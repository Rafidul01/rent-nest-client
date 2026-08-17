// app/(dashboardGroup)/admin-dashboard/_components/UserRow.tsx
import { Mail, Phone, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { Role, User, UserStatus } from "@/app/lib/types";
import { BanButton } from "./BanButton";

const roleStyles: Record<Role, string> = {
  TENANT: "bg-blue-100 text-blue-800 border-blue-200",
  LANDLORD: "bg-violet-100 text-violet-800 border-violet-200",
  ADMIN: "bg-sidebar text-sidebar-foreground border-sidebar-accent",
};

const statusStyles: Record<UserStatus, string> = {
  ACTIVE: "bg-green-100 text-green-800 border-green-200",
  BANNED: "bg-red-100 text-red-800 border-red-200",
};

function getInitials(name?: string) {
  return (name ?? "?")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function UserRow({ user }: { user: User }) {
  return (
    <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3.5">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-sm font-semibold text-foreground">
          {getInitials(user.name)}
        </div>
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="truncate font-medium">{user.name}</span>
            <span
              className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
                roleStyles[user.role],
              )}
            >
              {user.role}
            </span>
            <span
              className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
                statusStyles[user.status],
              )}
            >
              {user.status}
            </span>
          </div>
          <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-0.5 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Mail className="size-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">{user.email}</span>
            </span>
            {user.phone && (
              <span className="flex items-center gap-1.5">
                <Phone className="size-3.5 shrink-0" aria-hidden="true" />
                {user.phone}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <UserRound className="size-3.5 shrink-0" aria-hidden="true" />
              Joined {formatDate(user.createdAt)}
            </span>
          </div>
        </div>
      </div>
      <BanButton userId={user.id} status={user.status} />
    </div>
  );
}
