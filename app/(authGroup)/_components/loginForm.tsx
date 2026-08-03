"use client";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldGroup,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { loginAction } from "../_actions/authActions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, {
    success: false,
    message: "",
  });

  const router = useRouter()

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      router.push("/")
    }

    if (state.errorDetails) {
      toast.error(state.message);
    }
  }, [state]);
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div>
      <form action={action}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </Field>

          <Field>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground transition-colors hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </Field>

          <Field>
            <Button type="submit" className="w-full">
              {pending ? "Signing in..." : "Sign in"}
            </Button>
          </Field>

          <FieldDescription className="text-center">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-primary hover:underline"
            >
              Sign up
            </Link>
          </FieldDescription>
        </FieldGroup>
      </form>
    </div>
  );
}
