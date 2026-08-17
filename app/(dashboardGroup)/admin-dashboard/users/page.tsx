import { ShieldAlert, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "../../_components/PageHeader";
import { getAdminUsers } from "../_actions/getAdminUsers";
import MembersTabs from "../_components/MembersTabs";

export default async function AdminUsersPage() {
  const users = await getAdminUsers();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Members"
        title="All members"
        description="Every tenant, landlord, and admin on the platform — ban or restore access right from the list."
      />

      {users.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center gap-3 py-12 text-center">
            <div className="flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
              <Users aria-hidden="true" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-medium">No members yet</p>
              <p className="text-sm text-muted-foreground">
                Registered users will show up here.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <MembersTabs users={users} />
      )}

      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <ShieldAlert className="size-3.5 shrink-0" aria-hidden="true" />
        Banned members can&apos;t sign in or take any action until restored.
      </p>
    </div>
  );
}