"use client";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useActionState, useState } from "react";
import { loginAction } from "../_actions/authActions";
import { useRouter } from "next/navigation";
import { useActionResultToast } from "@/app/lib/action-feedback";

export default function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, {
    success: false,
    message: "",
  });

  const router = useRouter();

  useActionResultToast(state, () => router.push("/"));

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
              aria-invalid={!!state.fieldErrors?.email}
            />
            <FieldError>{state.fieldErrors?.email}</FieldError>
          </Field>

          <Field>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="password">Password</FieldLabel>
            </div>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                aria-invalid={!!state.fieldErrors?.password}
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
            <FieldError>{state.fieldErrors?.password}</FieldError>
          </Field>

          <Field>
            <Button type="submit" className="w-full">
              {pending ? "Signing in..." : "Sign in"}
            </Button>
          </Field>

          <FieldDescription className="text-center">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-primary hover:underline"
            >
              Register
            </Link>
          </FieldDescription>
        </FieldGroup>
      </form>
    </div>
  );
}
