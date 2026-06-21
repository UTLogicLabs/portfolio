import { useState } from "react";
import { Link, NavLink } from "react-router";

const NAV_LINKS = [
  { to: "/projects", label: "Projects" },
  { to: "/blog", label: "Blog" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

function navLinkClass({ isActive }: { isActive: boolean }) {
  return `text-sm font-medium transition-colors ${
    isActive
      ? "text-primary"
      : "text-muted-foreground hover:text-foreground"
  }`;
}

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur border-b border-border">
      <nav className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          to="/"
          className="font-semibold text-foreground hover:text-primary transition-colors"
        >
          Joshua Dix
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink key={to} to={to} className={navLinkClass}>
              {label}
            </NavLink>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 text-foreground"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
        >
          <span className={`block w-5 h-0.5 bg-current transition-transform ${open ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`block w-5 h-0.5 bg-current transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-0.5 bg-current transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="max-w-4xl mx-auto px-6 py-4 flex flex-col gap-4">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={navLinkClass}
                onClick={() => setOpen(false)}
              >
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
