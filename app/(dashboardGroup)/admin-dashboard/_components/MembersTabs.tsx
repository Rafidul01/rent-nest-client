"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldBan, ShieldCheck } from "lucide-react";
import type { User } from "@/app/lib/types";
import { UserRow } from "./UserRow";

type MemberTab = "ACTIVE" | "BANNED";

export default function MembersTabs({ users }: { users: User[] }) {
  const [tab, setTab] = useState<MemberTab>("ACTIVE");

  const active = users.filter((u) => u.status === "ACTIVE");
  const banned = users.filter((u) => u.status === "BANNED");
  const visible = tab === "ACTIVE" ? active : banned;

  const EmptyIcon = tab === "ACTIVE" ? ShieldCheck : ShieldBan;
  const emptyTitle =
    tab === "ACTIVE" ? "No active members" : "No banned members";
  const emptyHint =
    tab === "ACTIVE"
      ? "Everyone is currently banned."
      : "No one is banned right now.";

  return (
    <div className="flex flex-col gap-4">
      <Tabs
        value={tab}
        onValueChange={(v) => setTab(v as MemberTab)}
      >
        <TabsList className="h-auto flex-wrap">
          <TabsTrigger value="ACTIVE">
            Active users
            <span className="ml-1.5 text-xs text-muted-foreground tabular-nums">
              ({active.length})
            </span>
          </TabsTrigger>
          <TabsTrigger value="BANNED">
            Banned users
            <span className="ml-1.5 text-xs text-muted-foreground tabular-nums">
              ({banned.length})
            </span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {visible.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center gap-3 py-12 text-center">
            <div className="flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
              <EmptyIcon aria-hidden="true" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-medium">{emptyTitle}</p>
              <p className="text-sm text-muted-foreground">{emptyHint}</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="p-0">
            <div className="flex flex-col">
              {visible.map((user, index) => (
                <div key={user.id}>
                  <UserRow user={user} />
                  {index < visible.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}