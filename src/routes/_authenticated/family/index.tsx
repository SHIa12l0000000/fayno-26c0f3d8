import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { PageShell } from "@/components/site/PageShell";
import { Photo } from "@/components/Photo";
import { PrivacyBadge } from "@/components/MemberCard";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MEMBER_COLUMNS, type FamilyMember } from "@/lib/family";

export const Route = createFileRoute("/_authenticated/family/")({
  head: () => ({
    meta: [
      { title: "My Family — FAYNO" },
      { name: "description", content: "Every family member you have recorded on FAYNO." },
      { property: "og:title", content: "My Family — FAYNO" },
      { property: "og:description", content: "Every family member you have recorded on FAYNO." },
    ],
  }),
  component: MyFamily,
});

function MyFamily() {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["my-family", profile?.id],
    enabled: Boolean(profile?.id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("family_members")
        .select(MEMBER_COLUMNS)
        .eq("user_id", profile!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as FamilyMember[];
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("family_members").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Member removed.");
      queryClient.invalidateQueries({ queryKey: ["my-family"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
    onError: () => toast.error("We couldn't delete that member. Please try again."),
  });

  return (
    <PageShell>
      <div className="mx-auto max-w-5xl px-5 py-14">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">My family</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {data ? `${data.length} ${data.length === 1 ? "record" : "records"}` : "Loading…"}
            </p>
          </div>
          <Button asChild>
            <Link to="/family/new">
              <Plus className="h-4 w-4" aria-hidden />
              Add member
            </Link>
          </Button>
        </div>

        <div className="mt-8">
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-40 animate-pulse rounded-xl bg-muted" />
              ))}
            </div>
          ) : isError ? (
            <div className="rounded-xl border border-border bg-surface p-8 text-center text-sm text-muted-foreground">
              We couldn&apos;t load your family records. Refresh the page to try again.
            </div>
          ) : data!.length === 0 ? (
            <div className="rounded-xl border border-border bg-surface p-10 text-center">
              <p className="font-medium">No family members yet</p>
              <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted-foreground">
                Add the first person and build outwards — a name and a relation is enough to begin.
              </p>
              <Button asChild className="mt-5" size="sm">
                <Link to="/family/new">Add member</Link>
              </Button>
            </div>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2">
              {data!.map((member) => (
                <li
                  key={member.id}
                  className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-card"
                >
                  <div className="flex gap-4">
                    <Photo
                      path={member.photo}
                      name={member.full_name}
                      className="h-16 w-16 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{member.full_name}</p>
                      <p className="mt-0.5 truncate text-sm text-muted-foreground">
                        {member.relation}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        {member.birth_year ? <span>b. {member.birth_year}</span> : null}
                        {member.village ? <span className="truncate">{member.village}</span> : null}
                      </div>
                    </div>
                    <PrivacyBadge privacy={member.privacy} className="self-start" />
                  </div>

                  <div className="mt-5 flex gap-2 border-t border-border pt-4">
                    <Button asChild variant="outline" size="sm">
                      <Link to="/family/$id" params={{ id: member.id }}>
                        View
                      </Link>
                    </Button>
                    <Button asChild variant="ghost" size="sm">
                      <Link to="/family/$id/edit" params={{ id: member.id }}>
                        Edit
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-destructive">
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete {member.full_name}?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This removes the record and its details permanently. This cannot be
                            undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => remove.mutate(member.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </PageShell>
  );
}
