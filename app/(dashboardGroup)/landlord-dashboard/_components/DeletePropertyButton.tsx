"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { deleteProperty } from "../_actions/deleteProperty";
import { toastActionResult } from "@/app/lib/action-feedback";

export function DeletePropertyButton({ propertyId }: { propertyId: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [pending, setPending] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancel = () => {
    setConfirming(false);
    if (timer.current) clearTimeout(timer.current);
  };

  const handleDelete = async () => {
    if (!confirming) {
      setConfirming(true);
      timer.current = setTimeout(cancel, 4000);
      return;
    }

    cancel();
    setPending(true);
    const result = await deleteProperty(propertyId);

    toastActionResult(result);
    if (result.success) {
      router.refresh();
    } else {
      setPending(false);
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={handleDelete}
      disabled={pending}
      className={
        confirming
          ? "text-destructive hover:bg-destructive/10 hover:text-destructive"
          : "text-muted-foreground hover:text-destructive"
      }
    >
      {pending ? (
        <Loader2 className="size-3.5 animate-spin" />
      ) : (
        <Trash2 className="size-3.5" />
      )}
      {confirming ? "Confirm?" : pending ? "Deleting" : "Delete"}
    </Button>
  );
}
