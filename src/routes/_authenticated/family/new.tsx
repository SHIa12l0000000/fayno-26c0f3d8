import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
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

export const Route = createFileRoute("/_authenticated/family/new")({
  head: () => ({
    meta: [
      { title: "Add a family member — FAYNO" },
      {
        name: "description",
        content: "Record a family member's name, relation, village and story.",
      },
      { property: "og:title", content: "Add a family member — FAYNO" },
      {
        property: "og:description",
        content: "Record a family member's name, relation, village and story.",
      },
    ],
  }),
  component: AddMember,
});

function AddMember() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function handleSubmit(values: MemberFormValues) {
    if (!profile) return;
    const { error } = await supabase
      .from("family_members")
      .insert({ ...memberPayload(values), user_id: profile.id });
    if (error) {
      toast.error("We couldn't save this member. Please try again.");
      return;
    }
    queryClient.invalidateQueries({ queryKey: ["my-family"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    toast.success("Family member saved.");
    navigate({ to: "/family" });
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-3xl px-5 py-14">
        <Link to="/family" className="text-sm text-muted-foreground underline">
          Back to my family
        </Link>
        <h1 className="mt-4 text-2xl font-semibold">Add a family member</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Only a name and a relation are required. Add whatever else you know.
        </p>
        <div className="mt-8">
          {profile ? (
            <MemberForm
              userId={profile.id}
              initial={toFormValues()}
              submitLabel="Save member"
              onCancel={() => navigate({ to: "/family" })}
              onSubmit={handleSubmit}
            />
          ) : null}
        </div>
      </div>
    </PageShell>
  );
}
