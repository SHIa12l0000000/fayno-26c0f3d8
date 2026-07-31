import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Photo } from "@/components/Photo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQueryClient } from "@tanstack/react-query";

const navLinks = [
  { to: "/", label: "Home", exact: true },
  { to: "/search", label: "Search" },
  { to: "/family", label: "My Family" },
];

export function Navbar() {
  const { user, profile, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await signOut();
    navigate({ to: "/", replace: true });
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-5">
        <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <img 
            src="/fayno-logo.png" 
            alt="FAYNO" 
            className="h-8 w-8 rounded-lg"
          />
          <span className="text-[17px] font-semibold tracking-tight hidden sm:inline">FAYNO</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeOptions={{ exact: link.exact }}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground data-[status=active]:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {loading ? (
            <div className="h-9 w-24 animate-pulse rounded-md bg-muted" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 rounded-full border border-border p-1 pr-3 transition-colors duration-150 hover:bg-muted">
                <Photo
                  path={profile?.profile_photo}
                  name={profile?.full_name || profile?.username || "You"}
                  rounded="rounded-full"
                  className="h-7 w-7"
                />
                <span className="max-w-[120px] truncate text-sm">
                  {profile ? `@${profile.username}` : "Account"}
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="truncate font-normal text-muted-foreground">
                  {user.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/family">My Family</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>
                {profile ? (
                  <DropdownMenuItem asChild>
                    <Link to="/$username" params={{ username: `@${profile.username}` }}>
                      Public profile
                    </Link>
                  </DropdownMenuItem>
                ) : null}
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={handleSignOut}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button asChild variant="outline" size="sm">
                <Link to="/auth" search={{ mode: "login" }}>
                  Login
                </Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/auth" search={{ mode: "signup" }}>
                  Sign up
                </Link>
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-md p-2 text-muted-foreground transition-colors duration-150 hover:bg-muted md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col px-5 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-border pt-3">
              {user ? (
                <>
                  <Button asChild variant="outline" size="sm" onClick={() => setOpen(false)}>
                    <Link to="/dashboard">Dashboard</Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setOpen(false);
                      handleSignOut();
                    }}
                  >
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant="outline" size="sm" onClick={() => setOpen(false)}>
                    <Link to="/auth" search={{ mode: "login" }}>
                      Login
                    </Link>
                  </Button>
                  <Button asChild size="sm" onClick={() => setOpen(false)}>
                    <Link to="/auth" search={{ mode: "signup" }}>
                      Sign up
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
