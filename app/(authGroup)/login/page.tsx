import React from "react";
import LoginForm from "../_components/loginForm";
import Link from "next/link";
import { Home } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-sm border p-8 rounded-3xl ">
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <Link
            href="/"
            className="mb-2 flex items-center gap-2 text-lg font-semibold"
          >
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Home className="size-5" />
            </span>
            RentNest
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight text-balance">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground text-pretty">
            Sign in to manage your rentals and saved homes.
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
