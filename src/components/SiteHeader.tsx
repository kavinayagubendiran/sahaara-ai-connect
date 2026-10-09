import { Link } from "@tanstack/react-router";
import { HeartHandshake } from "lucide-react";

const links = [
  { to: "/", label: "Request Help" },
  { to: "/dashboard", label: "Coordinator" },
  { to: "/impact", label: "Impact" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <HeartHandshake className="h-5 w-5" />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-lg font-bold text-foreground">Sahaara AI</span>
            <span className="block text-xs text-muted-foreground">Every Need Deserves a Resolution.</span>
          </span>
        </Link>
        <nav className="flex gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: true }}
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground"
              activeProps={{ className: "bg-secondary !text-secondary-foreground" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t py-6 text-center text-xs text-muted-foreground">
      Sahaara AI — hackathon prototype. All people, requests and resources shown are fictional. No real volunteers are contacted.
    </footer>
  );
}
