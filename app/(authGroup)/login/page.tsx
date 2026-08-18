import React from "react";
import LoginForm from "../_components/loginForm";
import Link from "next/link";
import { LettingLamp } from "@/app/(publicGroup)/_components/LettingLamp";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm rounded-2xl border bg-card p-8 shadow-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <span className="flex size-11 items-center justify-center rounded-xl border bg-sidebar text-lamp">
            <LettingLamp lit className="size-6" />
          </span>
          <Link
            href="/"
            className="font-display text-lg font-semibold tracking-tight"
          >
            RentNest
          </Link>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-balance">
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
