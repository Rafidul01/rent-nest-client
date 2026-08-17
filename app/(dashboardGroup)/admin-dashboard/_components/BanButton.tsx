"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldBan, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { UserStatus } from "@/app/lib/types";
import { updateUserStatus } from "../_actions/updateUserStatus";

export function BanButton({
  userId,
  status,
}: {
  userId: string;
  status: UserStatus;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [pending, setPending] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const banned = status === "BANNED";

  const cancel = () => {
    setConfirming(false);
    if (timer.current) clearTimeout(timer.current);
  };

  const handleToggle = async () => {
    if (!confirming) {
      setConfirming(true);
      timer.current = setTimeout(cancel, 4000);
      return;
    }

    cancel();
    setPending(true);
    const next = banned ? "ACTIVE" : "BANNED";
    const result = await updateUserStatus(userId, next as UserStatus);

    if (!result.success) {
      toast.error(result.message);
      setPending(false);
      return;
    }

    setPending(false);
    toast.success(banned ? "User reinstated" : "User banned");
    router.refresh();
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      disabled={pending}
      className={
        banned
          ? "text-primary hover:bg-primary/10 hover:text-primary"
          : "text-muted-foreground hover:text-destructive"
      }
    >
      {pending ? (
        <Loader2 className="size-3.5 animate-spin" />
      ) : banned ? (
        <ShieldCheck className="size-3.5" />
      ) : (
        <ShieldBan className="size-3.5" />
      )}
      {confirming
        ? "Confirm?"
        : pending
          ? banned
            ? "Restoring"
            : "Banning"
          : banned
            ? "Restore"
            : "Ban"}
    </Button>
  );
}
