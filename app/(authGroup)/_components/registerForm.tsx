
"use client"

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useActionState, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { registerAction } from "../_actions/authActions";

export default function RegisterForm() {
    const router = useRouter();
    const [state, action, pending] = useActionState(registerAction, {
        success: false,
        message: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState("TENANT");

    useEffect(() => {
        if (state.message && state.success) {
            toast.success(state.message);
            router.push("/login");
        } else if (state.message && !state.success) {
            toast.error(state.message);
        }
    }, [state, router]);

    return (
        <form action={action}>
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="name">Full Name</FieldLabel>
                    <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        autoComplete="name"
                        required
                        aria-invalid={!!state.fieldErrors?.name}
                    />
                    <FieldError>{state.fieldErrors?.name}</FieldError>
                </Field>

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
                    <FieldLabel htmlFor="phone">Phone (optional)</FieldLabel>
                    <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="01XXXXXXXXX"
                        autoComplete="tel"
                    />
                </Field>

                <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <div className="relative">
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="At least 6 characters"
                            autoComplete="new-password"
                            required
                            minLength={6}
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
                    <FieldLabel htmlFor="role">I am a</FieldLabel>
                    <input type="hidden" name="role" value={role} />
                    <Select value={role} onValueChange={setRole}>
                        <SelectTrigger id="role" className="w-full">
                            <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="TENANT">Tenant — looking for a place</SelectItem>
                            <SelectItem value="LANDLORD">Landlord — listing properties</SelectItem>
                        </SelectContent>
                    </Select>
                </Field>

                <Field>
                    <Button type="submit" className="w-full" disabled={pending}>
                        {pending ? "Creating account..." : "Create account"}
                    </Button>
                </Field>

                <FieldDescription className="text-center">
                    Already have an account?{" "}
                    <Link href="/login" className="font-medium text-primary hover:underline">
                        Login
                    </Link>
                </FieldDescription>
            </FieldGroup>
        </form>
    );
}