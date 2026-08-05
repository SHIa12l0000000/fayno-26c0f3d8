import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search as SearchIcon } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/site/PageShell";
import { Photo } from "@/components/Photo";
import { Button } from "@/components/ui/button";
import { MEMBER_COLUMNS, lifespan, type FamilyMember } from "@/lib/family";
import type { Profile } from "@/lib/auth";

export const Route = createFileRoute("/search")({
  validateSearch: z.object({ q: z.string().max(80).optional() }),
  head: () => ({
    meta: [
      { title: "Search families — FAYNO" },
      {
        name: "description",
        content:
          "Search public FAYNO profiles and family records by name, username, village or family name.",
      },
      { property: "og:title", content: "Search families — FAYNO" },
      {
        property: "og:description",
        content: "Search public FAYNO profiles and family records by name, username or village.",
      },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const navigate = useNavigate();
  const [term, setTerm] = useState(q ?? "");
  const query = (q ?? "").trim();

  const { data, isFetching } = useQuery({
    queryKey: ["search", query],
    enabled: query.length >= 2,
    queryFn: async () => {
      // Strip LIKE wildcards and every PostgREST filter-syntax character so the
      // term can only ever be matched as plain text, never parsed as filter syntax.
      const safeTerm = query
        .replace(/[%_,.()*\\"':]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      if (safeTerm.length < 2) return { profiles: [], members: [] };
      const pattern = `%${safeTerm}%`;
      const [profiles, members] = await Promise.all([
        supabase
          .from("profiles")
          .select("id, username, full_name, profile_photo, created_at")
          .or(`username.ilike.${pattern},full_name.ilike.${pattern}`)
          .limit(12),
        supabase
          .from("family_members")
          .select(MEMBER_COLUMNS)
          .eq("privacy", "public")
          .or(`full_name.ilike.${pattern},village.ilike.${pattern},city.ilike.${pattern}`)
          .limit(24),
      ]);

      return {
        profiles: (profiles.data ?? []) as Profile[],
        members: (members.data ?? []) as FamilyMember[],
      };
    },
  });

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    navigate({ to: "/search", search: { q: term.trim() || undefined } });
  }

  const hasResults = (data?.profiles.length ?? 0) + (data?.members.length ?? 0) > 0;

  return (
    <PageShell>
      <div className="mx-auto max-w-4xl px-5 py-14">
        <h1 className="text-2xl font-semibold">Search families</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Only public information is shown here. Private and family-only records never appear in
          search.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex gap-2">
          <div className="relative flex-1">
            <SearchIcon
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <input
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              maxLength={80}
              placeholder="Name, username, village or family name"
              aria-label="Search"
              className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm shadow-card outline-none transition-colors duration-150 focus:border-ring"
            />
          </div>
          <Button type="submit">Search</Button>
        </form>

        <div className="mt-10">
          {query.length < 2 ? (
            <p className="text-sm text-muted-foreground">
              Type at least two characters to start searching.
            </p>
          ) : isFetching ? (
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />
              ))}
            </div>
          ) : !hasResults ? (
            <div className="rounded-xl border border-border bg-surface p-8 text-center">
              <p className="font-medium">No public results for “{query}”</p>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Try a shorter name, a village, or a username.
              </p>
            </div>
          ) : (
            <div className="space-y-10">
              {data!.profiles.length > 0 ? (
                <section>
                  <h2 className="text-sm font-medium text-muted-foreground">People on FAYNO</h2>
                  <ul className="mt-3 space-y-2">
                    {data!.profiles.map((profile) => (
                      <li key={profile.id}>
                        <Link
                          to="/$username"
                          params={{ username: profile.username }}
                          className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors duration-150 hover:border-foreground/20"
                        >
                          <Photo
                            path={profile.profile_photo}
                            name={profile.full_name || profile.username}
                            rounded="rounded-full"
                            className="h-10 w-10"
                          />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">
                              {profile.full_name || profile.username}
                            </p>
                            <p className="truncate text-sm text-muted-foreground">
                              @{profile.username}
                            </p>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {data!.members.length > 0 ? (
                <section>
                  <h2 className="text-sm font-medium text-muted-foreground">
                    Public family records
                  </h2>
                  <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                    {data!.members.map((member) => (
                      <li
                        key={member.id}
                        className="flex gap-4 rounded-xl border border-border bg-card p-4"
                      >
                        <Photo
                          path={member.photo}
                          name={member.full_name}
                          className="h-14 w-14 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{member.full_name}</p>
                          <p className="mt-0.5 truncate text-sm text-muted-foreground">
                            {member.village || member.city || member.occupation || member.relation}
                          </p>
                          {lifespan(member) ? (
                            <p className="mt-1 text-xs text-muted-foreground">{lifespan(member)}</p>
                          ) : null}
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
