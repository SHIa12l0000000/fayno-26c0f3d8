import { createFileRoute, redirect } from "@tanstack/react-router";

/** Alias so /login never 404s — the real screen lives at /auth?mode=login. */
export const Route = createFileRoute("/login")({
  beforeLoad: () => {
    throw redirect({ to: "/auth", search: { mode: "login" }, replace: true });
  },
});
