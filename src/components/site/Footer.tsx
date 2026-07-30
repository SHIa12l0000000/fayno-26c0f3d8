import { Link } from "@tanstack/react-router";

const links = [
  { to: "/about", label: "About" },
  { to: "/privacy", label: "Privacy Policy" },
  { to: "/terms", label: "Terms" },
  { to: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[15px] font-semibold tracking-tight">FAYNO</p>
            <p className="mt-2 max-w-xs text-sm text-muted-foreground">
              Connecting Generations. Preserving Legacies.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-8 gap-y-3">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p className="italic">“Your family’s story deserves to live on.”</p>
          <p>© 2026 FAYNO. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
