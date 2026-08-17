"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2, KeyRound, LogOut } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { UserData } from "@/app/lib/types";
import { logout } from "@/service/logout";

type ButtonProps = React.ComponentProps<typeof Button>;

const ROLE_LABEL: Record<UserData["data"]["role"], string> = {
  TENANT: "tenant",
  LANDLORD: "landlord",
  ADMIN: "admin",
};

interface PostListingButtonProps {
  user: UserData | null;
  label?: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  className?: string;
  icon?: ReactNode | null;
}

export function PostListingButton({
  user,
  label = "Post a listing",
  variant = "default",
  size = "default",
  className,
  icon = <Building2 className="ml-2 size-4" aria-hidden="true" />,
}: PostListingButtonProps) {
  const [open, setOpen] = useState(false);

  // Guest → sign up as a landlord (role pre-selected in the form)
  if (!user?.success) {
    return (
      <Button asChild variant={variant} size={size} className={className}>
        <Link href="/register?role=LANDLORD">
          {label}
          {icon}
        </Link>
      </Button>
    );
  }

  // Landlord → straight to the add-property form
  if (user.data.role === "LANDLORD") {
    return (
      <Button asChild variant={variant} size={size} className={className}>
        <Link href="/landlord-dashboard/properties/new">
          {label}
          {icon}
        </Link>
      </Button>
    );
  }

  // Tenant / admin → explain they need a landlord account
  const roleLabel = ROLE_LABEL[user.data.role];

  const handleSwitch = async () => {
    await logout();
    window.location.href = "/register?role=LANDLORD";
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          {label}
          {icon}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80">
        <SheetHeader className="text-left">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <KeyRound className="size-5" aria-hidden="true" />
          </div>
          <SheetTitle>Listings are for landlords</SheetTitle>
          <SheetDescription>
            You&apos;re signed in as a {roleLabel}. To post a property, you&apos;ll
            need a landlord account — create one and you can list right away.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 flex flex-col gap-2">
          <Button onClick={handleSwitch}>
            <LogOut className="size-4" aria-hidden="true" />
            Create a landlord account
          </Button>
          <SheetClose asChild>
            <Button variant="outline">Not now</Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}