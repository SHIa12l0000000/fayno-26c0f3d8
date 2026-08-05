import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2, Mail, Share2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { useAuth } from "@/lib/auth";
import { LANGUAGES, useLanguage } from "@/lib/language";
import { deleteMyAccount } from "@/lib/account.functions";
import { PageShell } from "@/components/site/PageShell";
import { ThemeToggle } from "@/components/ThemeToggle";
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
import { cn } from "@/lib/utils";

const SUPPORT_EMAIL = "fayno2028@gmail.com";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Settings — FAYNO" },
      {
        name: "description",
        content:
          "Manage your FAYNO account: app language, theme, invites, help and feedback, log out or delete your account.",
      },
      { property: "og:title", content: "Settings — FAYNO" },
      {
        property: "og:description",
        content: "Language, theme, invites, support and account controls for your FAYNO account.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SettingsPage,
});

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6 rounded-xl border border-border bg-card p-6 shadow-card">
      <h2 className="text-base font-semibold">{title}</h2>
      {hint ? <p className="mt-1 text-sm text-muted-foreground">{hint}</p> : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function SettingsPage() {
  const { profile, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const deleteAccount = useServerFn(deleteMyAccount);
  const [deleting, setDeleting] = useState(false);

  const inviteLink = profile
    ? `${currentOrigin()}/@${profile.username}`
    : currentOrigin();

  async function handleLogout() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await signOut();
    navigate({ to: "/", replace: true });
  }

  async function handleInvite() {
    const text = `Preserve your family history on FAYNO — ${inviteLink}`;
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: "FAYNO", text, url: inviteLink });
        return;
      }
      await navigator.clipboard.writeText(text);
      toast.success(t("copied"));
    } catch {
      // user dismissed the share sheet
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteAccount({ data: undefined });
      await queryClient.cancelQueries();
      queryClient.clear();
      await signOut();
      toast.success(t("deleted"));
      navigate({ to: "/", replace: true });
    } catch {
      toast.error(t("deleteFailed"));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-2xl px-5 py-14">
        <h1 className="text-2xl font-semibold">{t("settings")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("settingsIntro")}</p>

        <Section title={t("language")} hint={t("languageHint")}>
          <div className="grid gap-2 sm:grid-cols-2">
            {LANGUAGES.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setLanguage(option.value)}
                className={cn(
                  "rounded-xl border p-3 text-left transition-colors duration-150",
                  language === option.value
                    ? "border-primary bg-primary-soft"
                    : "border-border hover:bg-muted",
                )}
              >
                <span className="block text-sm font-medium">{option.native}</span>
                <span className="mt-1 block text-xs text-muted-foreground">
                  {option.label}
                  {option.value === "en" ? " · default" : ""}
                </span>
              </button>
            ))}
          </div>
        </Section>

        <Section title={t("appearance")} hint={t("appearanceHint")}>
          <div className="flex items-center justify-between">
            <span className="text-sm">{t("theme")}</span>
            <ThemeToggle size="sm" showLabel />
          </div>
        </Section>

        <Section title={t("inviteTitle")} hint={t("inviteHint")}>
          <div className="flex flex-wrap items-center gap-3">
            <Button type="button" onClick={handleInvite}>
              <Share2 className="h-4 w-4" aria-hidden />
              {t("copyLink")}
            </Button>
            <code className="truncate rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
              {inviteLink}
            </code>
          </div>
        </Section>

        <Section title={t("helpTitle")} hint={t("helpHint")}>
          <Button asChild variant="outline">
            <a href={`mailto:${SUPPORT_EMAIL}?subject=FAYNO%20help%20and%20feedback`}>
              <Mail className="h-4 w-4" aria-hidden />
              {t("emailUs")} · {SUPPORT_EMAIL}
            </a>
          </Button>
        </Section>

        <Section title={t("account")}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">{t("logout")}</p>
              <p className="mt-1 text-sm text-muted-foreground">{t("logoutHint")}</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              {t("logout")}
            </Button>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
            <div>
              <p className="text-sm font-medium text-destructive">{t("deleteAccount")}</p>
              <p className="mt-1 text-sm text-muted-foreground">{t("deleteHint")}</p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={deleting}>
                  <Trash2 className="h-4 w-4" aria-hidden />
                  {t("deleteAccount")}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("deleteConfirmTitle")}</AlertDialogTitle>
                  <AlertDialogDescription>{t("deleteConfirmBody")}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {deleting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
                    {t("deleteForever")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </Section>
      </div>
    </PageShell>
  );
}
