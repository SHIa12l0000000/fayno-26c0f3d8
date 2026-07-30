import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { PageShell } from "@/components/site/PageShell";
import {
  MemberForm,
  memberPayload,
  toFormValues,
  type MemberFormValues,
} from "@/components/MemberForm";
import { MEMBER_COLUMNS, type FamilyMember } from "@/lib/family";

export const Route = createFileRoute("/_authenticated/family/$id/edit")({
  head: () => ({
    meta: [
      { title: "Edit family member — FAYNO" },
      { name: "description", content: "Update the details of a family member on FAYNO." },
      { property: "og:title", content: "Edit family member — FAYNO" },
      { property: "og:description", content: "Update the details of a family member on FAYNO." },
    ],
  }),
  component: EditMember,
});

function EditMember() {
  const { id } = Route.useParams();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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

  async function handleSubmit(values: MemberFormValues) {
    const { error } = await supabase.from("family_members").update(memberPayload(values)).eq("id", id);
    if (error) {
      toast.error("We couldn't save your changes. Please try again.");
      return;
    }
    queryClient.invalidateQueries({ queryKey: ["member", id] });
    queryClient.invalidateQueries({ queryKey: ["my-family"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    toast.success("Changes saved.");
    navigate({ to: "/family/$id", params: { id } });
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-3xl px-5 py-14">
        <Link to="/family" className="text-sm text-muted-foreground underline">
          Back to my family
        </Link>
        <h1 className="mt-4 text-2xl font-semibold">Edit family member</h1>

        <div className="mt-8">
          {isLoading ? (
            <div className="h-96 animate-pulse rounded-xl bg-muted" />
          ) : isError || !data ? (
            <p className="text-sm text-muted-foreground">
              This record couldn&apos;t be loaded. It may have been deleted.
            </p>
          ) : profile && data.user_id !== profile.id ? (
            <p className="text-sm text-muted-foreground">You can only edit your own records.</p>
          ) : profile ? (
            <MemberForm
              userId={profile.id}
              initial={toFormValues(data)}
              submitLabel="Save changes"
              onCancel={() => navigate({ to: "/family/$id", params: { id } })}
              onSubmit={handleSubmit}
            />
          ) : null}
        </div>
      </div>
    </PageShell>
  );
}
