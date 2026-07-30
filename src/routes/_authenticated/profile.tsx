import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { uploadPhoto } from "@/lib/photos";
import { PageShell } from "@/components/site/PageShell";
import { Photo } from "@/components/Photo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "Your profile — FAYNO" },
      { name: "description", content: "Update your FAYNO name, username, photo and password." },
      { property: "og:title", content: "Your profile — FAYNO" },
      { property: "og:description", content: "Update your FAYNO name, username, photo and password." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, profile, refreshProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [changing, setChanging] = useState(false);

  async function handleProfileSave(event: FormEvent) {
    event.preventDefault();
    if (!profile) return;
    if (!fullName.trim()) {
      toast.error("Please enter your name.");
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName.trim() })
      .eq("id", profile.id);
    setSaving(false);
    if (error) {
      toast.error("We couldn't save your profile.");
      return;
    }
    await refreshProfile();
    toast.success("Profile updated.");
  }

  async function handlePhoto(file: File | undefined) {
    if (!file || !profile) return;
    if (!file.type.startsWith("image/")) return toast.error("Please choose an image file.");
    if (file.size > 5 * 1024 * 1024) return toast.error("Images must be smaller than 5 MB.");
    setUploading(true);
    try {
      const path = await uploadPhoto(profile.id, file);
      const { error } = await supabase
        .from("profiles")
        .update({ profile_photo: path })
        .eq("id", profile.id);
      if (error) throw error;
      await refreshProfile();
      toast.success("Photo updated.");
    } catch {
      toast.error("We couldn't upload that photo.");
    } finally {
      setUploading(false);
    }
  }

  async function handlePasswordChange(event: FormEvent) {
    event.preventDefault();
    setPasswordError(null);
    if (password.length < 8) return setPasswordError("Use a password of at least 8 characters.");
    if (password !== confirm) return setPasswordError("The two passwords don't match.");
    setChanging(true);
    const { error } = await supabase.auth.updateUser({ password });
    setChanging(false);
    if (error) {
      setPasswordError("We couldn't update your password. Please log in again and retry.");
      return;
    }
    setPassword("");
    setConfirm("");
    toast.success("Password changed.");
  }

  async function handleLogout() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await signOut();
    navigate({ to: "/", replace: true });
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-2xl px-5 py-14">
        <h1 className="text-2xl font-semibold">Profile</h1>

        <section className="mt-8 rounded-xl border border-border bg-card p-6 shadow-card">
          <div className="flex flex-wrap items-center gap-5">
            <Photo
              path={profile?.profile_photo}
              name={profile?.full_name || profile?.username || "You"}
              rounded="rounded-full"
              className="h-20 w-20"
            />
            <div>
              <Label
                htmlFor="profile_photo"
                className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-normal transition-colors duration-150 hover:bg-muted"
              >
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                  <Upload className="h-4 w-4" aria-hidden />
                )}
                Change picture
              </Label>
              <input
                id="profile_photo"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => handlePhoto(e.target.files?.[0])}
              />
            </div>
          </div>

          <form onSubmit={handleProfileSave} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="profile_name">Name</Label>
              <Input
                id="profile_name"
                value={fullName}
                maxLength={80}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Username</Label>
              <p className="text-sm text-muted-foreground">
                @{profile?.username} ·{" "}
                {profile ? (
                  <Link
                    to="/$username"
                    params={{ username: profile.username }}
                    className="underline"
                  >
                    view public page
                  </Link>
                ) : null}
              </p>
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
              Save profile
            </Button>
          </form>
        </section>

        <section className="mt-6 rounded-xl border border-border bg-card p-6 shadow-card">
          <h2 className="text-base font-semibold">Change password</h2>
          <form onSubmit={handlePasswordChange} className="mt-4 space-y-4" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="profile_password">New password</Label>
              <Input
                id="profile_password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="profile_confirm">Confirm password</Label>
              <Input
                id="profile_confirm"
                type="password"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>
            {passwordError ? <p className="text-sm text-destructive">{passwordError}</p> : null}
            <Button type="submit" variant="outline" disabled={changing}>
              {changing ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
              Update password
            </Button>
          </form>
        </section>

        <section className="mt-6 flex items-center justify-between rounded-xl border border-border bg-surface p-6">
          <div>
            <p className="text-sm font-medium">Log out</p>
            <p className="mt-1 text-sm text-muted-foreground">
              You&apos;ll need your email and password to sign back in.
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Log out
          </Button>
        </section>
      </div>
    </PageShell>
  );
}
