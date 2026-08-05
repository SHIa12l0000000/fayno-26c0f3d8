import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/lib/auth";
import { normalizeUsername, usernameError } from "@/lib/family";
import { PageShell } from "@/components/site/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const searchSchema = z.object({
  mode: z.enum(["login", "signup", "forgot"]).catch("login"),
  // Same-origin relative path to return to after signing in (used by the OAuth consent flow).
  next: z.string().optional().catch(undefined),
});

/** Only allow same-origin relative paths, so `next` can never send users off-site. */
function safeNext(next: string | undefined) {
  if (!next) return undefined;
  if (!next.startsWith("/") || next.startsWith("//")) return undefined;
  return next;
}

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Sign in to FAYNO" },
      {
        name: "description",
        content: "Log in or create a free FAYNO account to start preserving your family history.",
      },
      { property: "og:title", content: "Sign in to FAYNO" },
      {
        property: "og:description",
        content: "Log in or create a free FAYNO account to start preserving your family history.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { mode, next } = Route.useSearch();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const target = safeNext(next);

  useEffect(() => {
    if (loading || !user) return;
    if (target) window.location.assign(target);
    else navigate({ to: "/dashboard", replace: true });
  }, [loading, user, navigate, target]);

  return (
    <PageShell>
      <div className="mx-auto w-full max-w-md px-5 py-16 sm:py-24">
        {mode === "signup" ? (
          <SignUpCard next={target} />
        ) : mode === "forgot" ? (
          <ForgotCard />
        ) : (
          <LoginCard next={target} />
        )}
      </div>
    </PageShell>
  );
}

function GoogleButton({ label, next }: { label: string; next?: string }) {
  const [busy, setBusy] = useState(false);

  async function handleGoogle() {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: next ? `${window.location.origin}${next}` : window.location.origin,
    });
    if (result.error) {
      setBusy(false);
      toast.error("Google sign-in failed. Please try again.");
      return;
    }
    if (result.redirected) return;
    window.location.assign(next ?? "/dashboard");
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={handleGoogle}
      disabled={busy}
    >
      {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
      {label}
    </Button>
  );
}

function Card({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-7 shadow-card">
      <h1 className="text-xl font-semibold">{title}</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
      <div className="mt-6">{children}</div>
      <div className="mt-6 border-t border-border pt-5 text-sm text-muted-foreground">{footer}</div>
    </div>
  );
}

function LoginCard({ next }: { next?: string }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) {
      setError(
        error.message.toLowerCase().includes("invalid")
          ? "That email and password don't match an account."
          : error.message,
      );
      return;
    }
    if (next) {
      window.location.assign(next);
      return;
    }
    navigate({ to: "/dashboard" });
  }

  return (
    <Card
      title="Log in to FAYNO"
      subtitle="Continue building your family record."
      footer={
        <>
          New here?{" "}
          <Link to="/auth" search={{ mode: "signup", next }} className="text-foreground underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              to="/auth"
              search={{ mode: "forgot" }}
              className="text-xs text-muted-foreground underline"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
          Log in
        </Button>
      </form>
      <Divider />
      <GoogleButton label="Continue with Google" next={next} />
    </Card>
  );
}

function Divider() {
  return (
    <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
      <div className="h-px flex-1 bg-border" />
      or
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function SignUpCard({ next }: { next?: string }) {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    if (!fullName.trim()) return setError("Please enter your name.");
    const nameIssue = usernameError(username);
    if (nameIssue) return setError(nameIssue);
    if (password.length < 8) return setError("Use a password of at least 8 characters.");

    setBusy(true);
    const { data: taken } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", username)
      .maybeSingle();
    if (taken) {
      setBusy(false);
      return setError(`@${username} is already taken. Try another one.`);
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: `${window.location.origin}${next ?? "/dashboard"}`,
        data: { full_name: fullName.trim(), username },
      },
    });
    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    if (!data.session) {
      setSent(true);
      return;
    }
    window.location.assign("/onboarding");
  }

  if (sent) {
    return (
      <Card
        title="Confirm your email"
        subtitle={`We sent a confirmation link to ${email}. Open it to activate your account.`}
        footer={
          <>
            Wrong address?{" "}
            <button
              type="button"
              className="text-foreground underline"
              onClick={() => setSent(false)}
            >
              Go back
            </button>
          </>
        }
      >
        <p className="text-sm text-muted-foreground">
          The link expires after a while. If it doesn&apos;t arrive in a few minutes, check your
          spam folder.
        </p>
      </Card>
    );
  }

  return (
    <Card
      title="Create your FAYNO account"
      subtitle="It takes a minute. Your record stays private until you choose otherwise."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/auth" search={{ mode: "login", next }} className="text-foreground underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="full_name">Full name</Label>
          <Input
            id="full_name"
            required
            maxLength={80}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="username">Username</Label>
          <div className="flex items-center gap-2 rounded-md border border-input px-3">
            <span className="text-sm text-muted-foreground">@</span>
            <input
              id="username"
              value={username}
              onChange={(e) => setUsername(normalizeUsername(e.target.value))}
              className="h-9 w-full bg-transparent text-sm outline-none"
              placeholder="shivambedi"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Your public page will be fayno.com/@{username || "username"}
          </p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="signup_email">Email</Label>
          <Input
            id="signup_email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="signup_password">Password</Label>
          <Input
            id="signup_password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">At least 8 characters.</p>
        </div>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
          Create account
        </Button>
      </form>
      <Divider />
      <GoogleButton label="Sign up with Google" next={next} />
    </Card>
  );
}

function ForgotCard() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    setSent(true);
  }

  return (
    <Card
      title="Reset your password"
      subtitle="We'll email you a link to set a new one."
      footer={
        <Link to="/auth" search={{ mode: "login" }} className="text-foreground underline">
          Back to login
        </Link>
      }
    >
      {sent ? (
        <p className="text-sm text-muted-foreground">
          If an account exists for {email}, a reset link is on its way.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="reset_email">Email</Label>
            <Input
              id="reset_email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
            Send reset link
          </Button>
        </form>
      )}
    </Card>
  );
}
