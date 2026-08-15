"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Check,
  ChevronDown,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  ShieldX,
  UserRound,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RentalRequest, User } from "@/app/lib/types";
import RequestStatusBadge from "../../_components/RequestStatusBadge";
import { updateRequestStatus } from "../_actions/updateRequestStatus";

interface DecisionCardProps {
  request: Omit<RentalRequest, "property"> & {
    property?: { id: string; title: string; city: string } | null;
    tenant?: Pick<User, "id" | "name" | "email" | "phone"> | null;
  };
}

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

export function DecisionCard({ request }: DecisionCardProps) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(request.status);
  const [pending, setPending] = useState<"APPROVED" | "REJECTED" | null>(null);

  const decide = async (next: "APPROVED" | "REJECTED") => {
    setPending(next);
    setStatus(next); // optimistic

    const result = await updateRequestStatus(request.id, next);

    if (!result.success) {
      setStatus(request.status); // revert
      setPending(null);
      toast.error(result.message);
      return;
    }

    setPending(null);
    toast.success(
      next === "APPROVED" ? "Request approved" : "Request declined",
    );
  };

  const isPending = status === "PENDING";
  const tenant = request.tenant;

  return (
    <Card
      className={cn(
        "transition-shadow hover:shadow-md",
        isPending && "border-primary/25 bg-primary/4",
      )}
    >
      <CardContent className="flex flex-col gap-4 py-4">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex w-full items-center justify-between gap-3 text-left"
        >
          <div className="flex min-w-0 items-center gap-3.5">
            <div
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-semibold",
                isPending
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {getInitials(tenant?.name)}
            </div>
            <div className="flex min-w-0 flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="truncate font-medium">{tenant?.name ?? "Tenant"}</span>
                <RequestStatusBadge status={status} />
              </div>
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
                {request.property?.title ?? "Property"}
                {request.property?.city ? ` · ${request.property.city}` : ""}
              </p>
            </div>
          </div>
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-muted-foreground transition-transform",
              open && "rotate-180",
            )}
            aria-hidden="true"
          />
        </button>

        {open && (
          <div className="grid gap-4 border-t pt-4 lg:grid-cols-[minmax(0,1fr)_auto]">
            <div className="grid min-w-0 gap-x-8 gap-y-3 sm:grid-cols-2">
              <Detail
                icon={UserRound}
                label="Tenant"
                value={tenant?.name ?? "—"}
              />
              <Detail
                icon={CalendarDays}
                label="Move-in"
                value={formatDate(request.moveInDate)}
              />
              <Detail
                icon={CalendarDays}
                label="Submitted"
                value={formatDate(request.createdAt)}
              />
              <Detail
                icon={Mail}
                label="Email"
                value={tenant?.email ?? "—"}
              />
              <Detail
                icon={Phone}
                label="Phone"
                value={tenant?.phone ?? "Not provided"}
              />
            </div>

            <div className="flex flex-col gap-3 lg:items-end">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-semibold tabular-nums tracking-tight">
                  ৳{request.totalAmount.toLocaleString()}
                </span>
                <span className="text-sm text-muted-foreground">
                  / {request.durationMonths} mo
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                ৳
                {(
                  request.totalAmount / Math.max(request.durationMonths, 1)
                ).toLocaleString(undefined, { maximumFractionDigits: 0 })}{" "}
                per month
              </p>
            </div>
          </div>
        )}

        {request.message && (
          <div className="flex items-start gap-2.5 rounded-lg bg-muted/50 px-3.5 py-3">
            <MessageSquareText
              className="mt-0.5 size-4 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <p className="text-sm leading-6 text-muted-foreground">
              “{request.message}”
            </p>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          {isPending ? (
            <>
              <p className="text-xs text-muted-foreground">
                Approve to move this tenant toward payment.
              </p>
              <div className="flex shrink-0 items-center gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => decide("REJECTED")}
                  disabled={pending !== null}
                >
                  {pending === "REJECTED" ? (
                    <ShieldX className="size-3.5 animate-pulse" />
                  ) : (
                    <X className="size-3.5" />
                  )}
                  Decline
                </Button>
                <Button
                  size="sm"
                  onClick={() => decide("APPROVED")}
                  disabled={pending !== null}
                >
                  {pending === "APPROVED" ? (
                    <Check className="size-3.5 animate-pulse" />
                  ) : (
                    <Check className="size-3.5" />
                  )}
                  Approve
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="text-xs text-muted-foreground">
                Decided {formatDate(request.updatedAt)}
              </p>
              <Link
                href={`/properties/${request.property?.id}`}
                className="text-xs font-medium text-primary hover:underline"
              >
                View property
              </Link>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-start gap-2.5">
      <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <Icon className="size-3.5" aria-hidden="true" />
      </div>
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        <span className="truncate text-sm font-medium">{value}</span>
      </div>
    </div>
  );
}
