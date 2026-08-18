import Link from "next/link";
import { MapPin } from "lucide-react";
import { UserData } from "@/app/lib/types";
import { LettingLamp } from "@/app/(publicGroup)/_components/LettingLamp";

function FooterLogo() {
  return (
    <Link href="/" className="group flex w-fit items-center gap-2.5">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-sidebar-foreground/15 bg-sidebar-foreground/5 text-sidebar-foreground transition-colors group-hover:border-lamp/40 group-hover:text-lamp">
        <LettingLamp lit />
      </span>
      <span className="font-display text-lg font-semibold tracking-tight text-sidebar-foreground">
        rent<span className="text-sidebar-accent">nest</span>
      </span>
    </Link>
  );
}

function Column({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string; external?: boolean }[];
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sidebar-foreground/50">
        {title}
      </p>
      <ul className="flex flex-col gap-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-sidebar-foreground/75 transition-colors hover:text-lamp"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer({
  user,
  liveCount = 0,
}: {
  user: UserData;
  liveCount?: number;
}) {
  const basePath =
    user.success
      ? user.data.role === "ADMIN"
        ? "/admin-dashboard"
        : user.data.role === "LANDLORD"
          ? "/landlord-dashboard"
          : "/tenant-dashboard"
      : null;

  return (
    <footer className="border-t border-sidebar-foreground/10 bg-sidebar text-sidebar-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-2">
            <FooterLogo />
            <p className="max-w-sm text-sm leading-6 text-sidebar-foreground/65">
              The letting board for Dhaka and Chattogram. Search what fits,
              request the place, pay securely — then move in.
            </p>
            <p className="flex items-center gap-2 text-xs text-sidebar-foreground/50">
              <LettingLamp lit className="size-4" />
              {liveCount > 0
                ? `${liveCount} listings lit right now`
                : "The board is resting for a moment"}
            </p>
          </div>

          <Column
            title="Explore"
            links={[
              { label: "Home", href: "/" },
              { label: "Browse the board", href: "/properties" },
            ]}
          />

          <Column
            title="Account"
            links={
              basePath
                ? [{ label: "My dashboard", href: basePath }]
                : [
                    { label: "Login", href: "/login" },
                    { label: "Create account", href: "/register" },
                  ]
            }
          />
        </div>

        <div className="flex items-center gap-3 border-t border-sidebar-foreground/10 pt-6">
          <span className="h-px flex-1 bg-gradient-to-r from-sidebar-foreground/15 to-transparent" />
          <span className="flex size-2 rounded-full bg-lamp/60" aria-hidden="true" />
          <span className="h-px flex-1 bg-gradient-to-l from-sidebar-foreground/15 to-transparent" />
        </div>

        <div className="flex flex-col items-start justify-between gap-3 border-t border-sidebar-foreground/10 pt-6 text-xs text-sidebar-foreground/50 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} RentNest</p>
          <p className="flex items-center gap-1.5">
            <MapPin className="size-3.5" aria-hidden="true" />
            Dhaka · Chattogram — every available home is a lit lamp.
          </p>
        </div>
      </div>
    </footer>
  );
}