"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

export interface ActionResult {
  success: boolean;
  message: string;
  errorDetails?: unknown;
}

export function toastActionResult(
  result: ActionResult | null | undefined,
  options?: { successMessage?: string },
) {
  if (!result) return;
  if (!result.message && !options?.successMessage) return;

  if (result.success) {
    toast.success(options?.successMessage ?? result.message);
  } else {
    toast.error(result.message);
  }
}

export function useActionResultToast(
  state: ActionResult | null | undefined,
  onSuccess?: () => void,
) {
  const onSuccessRef = useRef(onSuccess);

  useEffect(() => {
    onSuccessRef.current = onSuccess;
  });

  useEffect(() => {
    if (!state?.message) return;

    if (state.success) {
      toast.success(state.message);
      onSuccessRef.current?.();
    } else {
      toast.error(state.message);
    }
  }, [state]);
}
