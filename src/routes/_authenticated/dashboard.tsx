import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search as SearchIcon, User, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { PageShell } from "@/components/site/PageShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — FAYNO" },
      {
        name: "description",
        content: "Your FAYNO dashboard: family records, additions and shortcuts.",
      },
      { property: "og:title", content: "Dashboard — FAYNO" },
      {
        property: "og:description",
        content: "Your FAYNO dashboard: family records and shortcuts.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { profile } = useAuth();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats", profile?.id],
    enabled: Boolean(profile?.id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("family_members")
        .select("privacy, id, full_name")
        .eq("user_id", profile!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      const rows = data ?? [];
      return {
        total: rows.length,
        public: rows.filter((r) => r.privacy === "public").length,
        private: rows.filter((r) => r.privacy === "private").length,
        recent: rows.slice(0, 3),
      };
    },
  });

  const firstName = (profile?.full_name || profile?.username || "").split(" ")[0];

  return (
    <PageShell>
      <div className="mx-auto max-w-5xl px-5 py-14">
        <h1 className="text-2xl font-semibold">Welcome back, {firstName} 👋</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your public page is{" "}
          {profile ? (
            <Link to="/$username" params={{ username: profile.username }} className="underline">
              fayno.com/@{profile.username}
            </Link>
          ) : null}
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Stat label="Family members" value={stats?.total} loading={isLoading} />
          <Stat label="Shared publicly" value={stats?.public} loading={isLoading} />
          <Stat label="Private records" value={stats?.private} loading={isLoading} />
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/family/new">
              <Plus className="h-4 w-4" aria-hidden />
              Add member
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/family">
              <Users className="h-4 w-4" aria-hidden />
              My family
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/search">
              <SearchIcon className="h-4 w-4" aria-hidden />
              Search
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link to="/profile">
              <User className="h-4 w-4" aria-hidden />
              Profile
            </Link>
          </Button>
        </div>

        {!isLoading && stats?.total === 0 ? (
          <div className="mt-10 rounded-xl border border-border bg-surface p-8">
            <p className="font-medium">Start with one person</p>
            <p className="mt-1.5 max-w-md text-sm text-muted-foreground">
              Add the oldest relative you can name. Everything else — photos, villages, stories —
              can be filled in later.
            </p>
            <Button asChild className="mt-5" size="sm">
              <Link to="/family/new">Add your first member</Link>
            </Button>
          </div>
        ) : null}

        {!isLoading && stats && stats.total > 0 && stats.recent && stats.recent.length > 0 ? (
          <div className="mt-10">
            <h2 className="text-lg font-semibold">Recently added</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {stats.recent.map((member: any) => (
                <Link
                  key={member.id}
                  to="/family/$id"
                  params={{ id: member.id }}
                  className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:bg-surface"
                >
                  <div className="h-10 w-10 shrink-0 rounded-lg bg-muted" aria-hidden />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{member.full_name}</p>
                    <p className="truncate text-xs text-muted-foreground">View details</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </PageShell>
  );
}

function Stat({ label, value, loading }: { label: string; value?: number; loading: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <p className="text-sm text-muted-foreground">{label}</p>
      {loading ? (
        <div className="mt-2 h-8 w-12 animate-pulse rounded bg-muted" />
      ) : (
        <p className="mt-1 text-3xl font-semibold tabular-nums">{value ?? 0}</p>
      )}
    </div>
  );
}
