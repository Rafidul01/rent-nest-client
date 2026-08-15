import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  CalendarDays,
  CheckCircle2,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { getUser } from "@/service/getUser";
import { PageHeader } from "../../_components/PageHeader";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatDate(value: string | Date) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function TenantProfilePage() {
  const { data: user } = await getUser();

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <PageHeader
        eyebrow="Account center"
        title="Your profile"
        description="Keep your personal information up to date so your rental experience stays simple and seamless."
      />

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(260px,0.6fr)]">
        <Card className="overflow-hidden">
          <div className="h-2 bg-primary" />
          <CardHeader className="flex flex-col gap-5 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="size-20 border-4 border-background bg-primary/10 shadow-sm">
                <AvatarFallback className="bg-primary/10 text-xl font-semibold text-primary">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1">
                <CardTitle className="text-2xl">{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </div>
            </div>
            <Badge variant="secondary" className="w-fit gap-1.5 capitalize">
              <UserRound className="size-3.5" aria-hidden="true" />
              {user.role}
            </Badge>
          </CardHeader>

          <Separator />

          <CardContent className="grid gap-x-6 gap-y-6 pt-6 sm:grid-cols-2">
            <ProfileDetail
              icon={Mail}
              label="Email address"
              value={user.email}
            />
            <ProfileDetail
              icon={Phone}
              label="Phone number"
              value={user.phone || "Not provided"}
            />
            <ProfileDetail
              icon={ShieldCheck}
              label="Account status"
              value={user.status}
              valueClassName="capitalize"
            />
            <ProfileDetail
              icon={CalendarDays}
              label="Member since"
              value={formatDate(user.createdAt)}
            />
          </CardContent>
        </Card>

        <Card className="bg-primary text-primary-foreground">
          <CardHeader>
            <div className="flex size-10 items-center justify-center rounded-full bg-primary-foreground/15">
              <CheckCircle2 className="size-5" aria-hidden="true" />
            </div>
            <CardTitle className="pt-2">Profile complete</CardTitle>
            <CardDescription className="text-primary-foreground/75">
              Your account is ready for your next home search.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="h-2 overflow-hidden rounded-full bg-primary-foreground/20">
              <div className="h-full w-full rounded-full bg-primary-foreground" />
            </div>
            <p className="text-sm text-primary-foreground/80">
              All essential account details are available and protected.
            </p>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Account details</CardTitle>
          <CardDescription>
            This information is used to personalize your RentNest experience.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Badge variant="outline" className="rounded-full px-3 py-1 font-normal">
            Verified account
          </Badge>
          <Badge variant="outline" className="rounded-full px-3 py-1 font-normal">
            Tenant profile
          </Badge>
          <Badge variant="outline" className="rounded-full px-3 py-1 font-normal">
            Secure account
          </Badge>
        </CardContent>
      </Card>
    </main>
  );
}

type ProfileDetailProps = {
  icon: typeof Mail;
  label: string;
  value: string;
  valueClassName?: string;
};

function ProfileDetail({
  icon: Icon,
  label,
  value,
  valueClassName,
}: ProfileDetailProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <Icon className="size-4" aria-hidden="true" />
      </div>
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        <span className={`truncate text-sm font-medium ${valueClassName ?? ""}`}>
          {value}
        </span>
      </div>
    </div>
  );
}
