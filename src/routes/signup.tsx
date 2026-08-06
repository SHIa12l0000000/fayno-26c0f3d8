import { createFileRoute, redirect } from "@tanstack/react-router";

/** Alias so /signup never 404s — the real screen lives at /auth?mode=signup. */
export const Route = createFileRoute("/signup")({
  beforeLoad: () => {
    throw redirect({ to: "/auth", search: { mode: "signup" }, replace: true });
  },
});
