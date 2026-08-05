import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { normalizeUsername, usernameError } from "@/lib/family";
import { PageShell } from "@/components/site/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_authenticated/onboarding")({
  head: () => ({
    meta: [
      { title: "Choose your username — FAYNO" },
      { name: "description", content: "Pick the username for your public FAYNO family page." },
      { property: "og:title", content: "Choose your username — FAYNO" },
      {
        property: "og:description",
        content: "Pick the username for your public FAYNO family page.",
      },
    ],
  }),
  component: Onboarding,
});

function suggest(base: string) {
  const clean = normalizeUsername(base) || "family";
  return [
    `${clean}_family`.slice(0, 20),
    `${clean}${Math.floor(10 + Math.random() * 89)}`.slice(0, 20),
    `the_${clean}`.slice(0, 20),
  ];
}

function Onboarding() {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const metadata = (user?.user_metadata ?? {}) as {
    full_name?: string;
    username?: string;
    name?: string;
  };

  const [fullName, setFullName] = useState(metadata.full_name ?? metadata.name ?? "");
  const [username, setUsername] = useState(
    normalizeUsername(metadata.username ?? user?.email?.split("@")[0] ?? ""),
  );
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setError(null);
    setSuggestions([]);
  }, [username]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!user) return;
    if (!fullName.trim()) return setError("Please enter your name.");
    const issue = usernameError(username);
    if (issue) return setError(issue);

    setBusy(true);
    const { error: insertError } = await supabase.from("profiles").insert({
      id: user.id,
      username,
      full_name: fullName.trim(),
    });
    setBusy(false);

    if (insertError) {
      if (insertError.code === "23505") {
        const options = suggest(username);
        const { data: taken } = await supabase
          .from("profiles")
          .select("username")
          .in("username", options);
        const used = new Set((taken ?? []).map((row) => row.username));
        setSuggestions(options.filter((option) => !used.has(option)));
        setError(`@${username} is taken. Here are a few that are free:`);
        return;
      }
      setError("We couldn't save that username. Please try again.");
      return;
    }

    await refreshProfile();
    navigate({ to: "/dashboard", replace: true });
  }

  return (
    <PageShell>
      <div className="mx-auto w-full max-w-md px-5 py-16">
        <div className="rounded-2xl border border-border bg-card p-7 shadow-card">
          <h1 className="text-xl font-semibold">Choose your username</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            This becomes the address of your public family page.
          </p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="onboarding_name">Your name</Label>
              <Input
                id="onboarding_name"
                value={fullName}
                maxLength={80}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="onboarding_username">Username</Label>
              <div className="flex items-center gap-2 rounded-md border border-input px-3">
                <span className="text-sm text-muted-foreground">@</span>
                <input
                  id="onboarding_username"
                  value={username}
                  onChange={(e) => setUsername(normalizeUsername(e.target.value))}
                  className="h-9 w-full bg-transparent text-sm outline-none"
                />
              </div>
              <p className="text-xs text-muted-foreground">fayno.com/@{username || "username"}</p>
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            {suggestions.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {suggestions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setUsername(option)}
                    className="rounded-md border border-border px-2.5 py-1.5 text-sm transition-colors duration-150 hover:bg-muted"
                  >
                    @{option}
                  </button>
                ))}
              </div>
            ) : null}
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
              Continue
            </Button>
          </form>
        </div>
      </div>
    </PageShell>
  );
}
