import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/site/PageShell";
import { Photo } from "@/components/Photo";
import { MEMBER_COLUMNS, lifespan, type FamilyMember } from "@/lib/family";
import type { Profile } from "@/lib/auth";

export const Route = createFileRoute("/$username")({
  head: ({ params }) => {
    const handle = params.username.replace(/^@/, "");
    return {
      meta: [
        { title: `@${handle} — FAYNO` },
        {
          name: "description",
          content: `Public family record shared by @${handle} on FAYNO.`,
        },
        { property: "og:title", content: `@${handle} — FAYNO` },
        {
          property: "og:description",
          content: `Public family record shared by @${handle} on FAYNO.`,
        },
      ],
    };
  },
  component: PublicProfile,
});

function PublicProfile() {
  const { username } = Route.useParams();
  const handle = username.replace(/^@/, "").toLowerCase();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["public-profile", handle],
    queryFn: async () => {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("id, username, full_name, profile_photo, created_at")
        .eq("username", handle)
        .maybeSingle();
      if (error) throw error;
      if (!profile) throw notFound();

      const { data: members } = await supabase
        .from("family_members")
        .select(MEMBER_COLUMNS)
        .eq("user_id", profile.id)
        .eq("privacy", "public")
        .order("birth_year", { ascending: true, nullsFirst: false });

      return { profile: profile as Profile, members: (members ?? []) as FamilyMember[] };
    },
  });

  if (isLoading) {
    return (
      <PageShell>
        <div className="mx-auto max-w-4xl space-y-4 px-5 py-14">
          <div className="h-24 animate-pulse rounded-xl bg-muted" />
          <div className="h-40 animate-pulse rounded-xl bg-muted" />
        </div>
      </PageShell>
    );
  }

  if (isError || !data) {
    return (
      <PageShell>
        <div className="mx-auto max-w-lg px-5 py-24 text-center">
          <h1 className="text-xl font-semibold">This page isn&apos;t available</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            No FAYNO profile exists at @{handle}.
          </p>
          <Link to="/search" className="mt-6 inline-block text-sm underline">
            Search other families
          </Link>
        </div>
      </PageShell>
    );
  }

  const { profile, members } = data;

  return (
    <PageShell>
      <div className="mx-auto max-w-4xl px-5 py-14">
        <header className="flex flex-wrap items-center gap-5 border-b border-border pb-8">
          <Photo
            path={profile.profile_photo}
            name={profile.full_name || profile.username}
            rounded="rounded-full"
            className="h-20 w-20"
          />
          <div>
            <h1 className="text-2xl font-semibold">{profile.full_name || profile.username}</h1>
            <p className="mt-1 text-sm text-muted-foreground">@{profile.username}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {members.length} public {members.length === 1 ? "record" : "records"}
            </p>
          </div>
        </header>

        {members.length === 0 ? (
          <div className="mt-10 rounded-xl border border-border bg-surface p-8 text-center">
            <p className="font-medium">Nothing shared publicly yet</p>
            <p className="mt-1.5 text-sm text-muted-foreground">
              This family keeps their records private or visible to family only.
            </p>
          </div>
        ) : (
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {members.map((member) => (
              <li key={member.id} className="rounded-xl border border-border bg-card p-5">
                <div className="flex gap-4">
                  <Photo
                    path={member.photo}
                    name={member.full_name}
                    className="h-16 w-16 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="truncate font-medium">{member.full_name}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{member.relation}</p>
                    {lifespan(member) ? (
                      <p className="mt-1 text-xs text-muted-foreground">{lifespan(member)}</p>
                    ) : null}
                  </div>
                </div>
                <dl className="mt-4 space-y-1.5 text-sm">
                  {member.village ? <Row label="Village" value={member.village} /> : null}
                  {member.occupation ? <Row label="Occupation" value={member.occupation} /> : null}
                </dl>
                {member.about ? (
                  <p className="mt-4 whitespace-pre-line border-t border-border pt-4 text-sm leading-relaxed text-muted-foreground">
                    {member.about}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </PageShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="w-24 shrink-0 text-muted-foreground">{label}</dt>
      <dd className="min-w-0 flex-1">{value}</dd>
    </div>
  );
}
