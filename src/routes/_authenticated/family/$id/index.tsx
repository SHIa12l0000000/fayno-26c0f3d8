import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { PageShell } from "@/components/site/PageShell";
import { Photo } from "@/components/Photo";
import { PrivacyBadge } from "@/components/MemberCard";
import { Button } from "@/components/ui/button";
import { MEMBER_COLUMNS, lifespan, type FamilyMember } from "@/lib/family";

export const Route = createFileRoute("/_authenticated/family/$id/")({
  head: () => ({
    meta: [
      { title: "Family member — FAYNO" },
      { name: "description", content: "Full details of a family member recorded on FAYNO." },
      { property: "og:title", content: "Family member — FAYNO" },
      { property: "og:description", content: "Full details of a family member recorded on FAYNO." },
    ],
  }),
  component: MemberDetail,
});

function MemberDetail() {
  const { id } = Route.useParams();
  const { user } = useAuth();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["member", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("family_members")
        .select(MEMBER_COLUMNS)
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return (data as FamilyMember) ?? null;
    },
  });

  if (isLoading) {
    return (
      <PageShell>
        <div className="mx-auto max-w-3xl space-y-4 px-5 py-14">
          <div className="h-56 animate-pulse rounded-xl bg-muted" />
          <div className="h-40 animate-pulse rounded-xl bg-muted" />
        </div>
      </PageShell>
    );
  }

  if (isError || !data) {
    return (
      <PageShell>
        <div className="mx-auto max-w-lg px-5 py-24 text-center">
          <h1 className="text-xl font-semibold">Record not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This member may have been deleted, or it isn&apos;t shared with you.
          </p>
          <Link to="/family" className="mt-6 inline-block text-sm underline">
            Back to my family
          </Link>
        </div>
      </PageShell>
    );
  }

  const isOwner = user?.id === data.user_id;

  const rows: [string, string | null][] = [
    ["Relation", data.relation || null],
    ["Birth year", data.birth_year ? String(data.birth_year) : null],
    ["Death year", data.death_year ? String(data.death_year) : null],
    ["Village", data.village],
    ["City", data.city],
    ["Occupation", data.occupation],
    ["Father", data.father_name],
    ["Mother", data.mother_name],
  ];

  return (
    <PageShell>
      <div className="mx-auto max-w-3xl px-5 py-14">
        <Link to="/family" className="text-sm text-muted-foreground underline">
          Back to my family
        </Link>

        <div className="mt-6 flex flex-wrap items-start gap-6">
          <Photo path={data.photo} name={data.full_name} className="h-40 w-40" />
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-semibold">{data.full_name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {data.relation}
              {lifespan(data) ? ` · ${lifespan(data)}` : ""}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <PrivacyBadge privacy={data.privacy} />
              {isOwner ? (
                <Button asChild size="sm" variant="outline">
                  <Link to="/family/$id/edit" params={{ id: data.id }}>
                    Edit
                  </Link>
                </Button>
              ) : null}
            </div>
          </div>
        </div>

        <dl className="mt-10 grid gap-x-8 gap-y-4 border-t border-border pt-8 sm:grid-cols-2">
          {rows
            .filter(([, value]) => Boolean(value))
            .map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
                <dd className="mt-1 text-sm">{value}</dd>
              </div>
            ))}
        </dl>

        {data.about ? (
          <section className="mt-10 border-t border-border pt-8">
            <h2 className="text-sm font-medium">About</h2>
            <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-muted-foreground">
              {data.about}
            </p>
          </section>
        ) : null}
      </div>
    </PageShell>
  );
}
