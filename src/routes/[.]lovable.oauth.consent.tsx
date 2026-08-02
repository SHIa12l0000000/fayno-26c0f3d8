import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/site/PageShell";
import { Button } from "@/components/ui/button";

type AuthorizationDetails = {
  client?: { name?: string | null; client_uri?: string | null } | null;
  redirect_url?: string | null;
  redirect_to?: string | null;
};

type OAuthApi = {
  getAuthorizationDetails: (
    id: string,
  ) => Promise<{ data: AuthorizationDetails | null; error: { message: string } | null }>;
  approveAuthorization: (
    id: string,
  ) => Promise<{ data: AuthorizationDetails | null; error: { message: string } | null }>;
  denyAuthorization: (
    id: string,
  ) => Promise<{ data: AuthorizationDetails | null; error: { message: string } | null }>;
};

function oauthApi(): OAuthApi {
  return (supabase.auth as unknown as { oauth: OAuthApi }).oauth;
}

export const Route = createFileRoute("/.lovable/oauth/consent")({
  // Browser-only: the Supabase client reads its session from localStorage.
  ssr: false,
  validateSearch: (s: Record<string, unknown>) => ({
    authorization_id: typeof s.authorization_id === "string" ? s.authorization_id : "",
  }),
  beforeLoad: async ({ search, location }) => {
    if (!search.authorization_id) throw new Error("Missing authorization_id");
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      const next = location.pathname + location.searchStr;
      throw redirect({ to: "/auth", search: { mode: "login" as const, next } });
    }
  },
  loader: async ({ location }) => {
    const authorizationId = new URLSearchParams(location.search).get("authorization_id")!;
    const { data, error } = await oauthApi().getAuthorizationDetails(authorizationId);
    if (error) throw new Error(error.message);
    const immediate = data?.redirect_url ?? data?.redirect_to;
    if (immediate && !data?.client) throw redirect({ href: immediate });
    return data;
  },
  component: Consent,
  errorComponent: ({ error }) => (
    <PageShell>
      <div className="mx-auto w-full max-w-md px-5 py-16">
        <div className="rounded-2xl border border-border bg-card p-7 shadow-card">
          <h1 className="text-xl font-semibold">Authorization request failed</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {String((error as Error)?.message ?? error)}
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Close this window and start the connection again from the app you were using.
          </p>
        </div>
      </div>
    </PageShell>
  ),
});

function Consent() {
  const details = Route.useLoaderData();
  const { authorization_id } = Route.useSearch();
  const [busy, setBusy] = useState<"approve" | "deny" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const clientName = details?.client?.name?.trim() || "This app";

  async function decide(approve: boolean) {
    setBusy(approve ? "approve" : "deny");
    setError(null);
    const api = oauthApi();
    const { data, error: decideError } = approve
      ? await api.approveAuthorization(authorization_id)
      : await api.denyAuthorization(authorization_id);
    if (decideError) {
      setBusy(null);
      setError(decideError.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(null);
      setError("The authorization server did not return a redirect. Please try again.");
      return;
    }
    window.location.href = target;
  }

  return (
    <PageShell>
      <div className="mx-auto w-full max-w-md px-5 py-16">
        <div className="rounded-2xl border border-border bg-card p-7 shadow-card">
          <h1 className="text-xl font-semibold">Connect {clientName} to FAYNO</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {clientName} is asking to use your FAYNO account. If you approve, it can read and manage
            your family records on your behalf — the same records you see when you are signed in.
          </p>
          <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
            <li>• Read your profile and your family records</li>
            <li>• Add, edit and delete family records</li>
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">
            It can never see other people&apos;s private records. You can disconnect at any time from
            the connected app.
          </p>
          {error ? (
            <p role="alert" className="mt-4 text-sm text-destructive">
              {error}
            </p>
          ) : null}
          <div className="mt-6 flex gap-3">
            <Button className="flex-1" disabled={busy !== null} onClick={() => decide(true)}>
              {busy === "approve" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
              Approve
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              disabled={busy !== null}
              onClick={() => decide(false)}
            >
              {busy === "deny" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
              Deny
            </Button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
