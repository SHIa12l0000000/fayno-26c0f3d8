import { createFileRoute, Outlet, Navigate, useRouterState } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { user, profile, loading, profileLoading } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (loading || (user && profileLoading)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" aria-hidden />
        <span className="sr-only">Loading</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" search={{ mode: "login" }} replace />;
  }

  if (!profile && pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  if (profile && pathname === "/onboarding") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
