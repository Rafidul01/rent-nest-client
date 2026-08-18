import { Role } from "./types";

export type IconName =
    | "dashboard" | "requests" | "payments" | "profile"
    | "properties" | "users" | "categories";

export function getDashboardNavItems(role: Role) {
    switch (role) {
        case "TENANT":
            return [
                { label: "Overview", href: "/tenant-dashboard", icon: "dashboard" as IconName },
                { label: "My Requests", href: "/tenant-dashboard/requests", icon: "requests" as IconName },
                { label: "Payments", href: "/tenant-dashboard/payments", icon: "payments" as IconName },
                { label: "Profile", href: "/tenant-dashboard/profile", icon: "profile" as IconName },
            ];
        case "LANDLORD":
            return [
                { label: "Overview", href: "/landlord-dashboard", icon: "dashboard" as IconName },
                { label: "Properties", href: "/landlord-dashboard/properties", icon: "properties" as IconName },
                { label: "Requests", href: "/landlord-dashboard/requests", icon: "requests" as IconName },
                { label: "Profile", href: "/landlord-dashboard/profile", icon: "profile" as IconName },
            ];
        case "ADMIN":
            return [
                { label: "Overview", href: "/admin-dashboard", icon: "dashboard" as IconName },
                { label: "Users", href: "/admin-dashboard/users", icon: "users" as IconName },
                { label: "Properties", href: "/admin-dashboard/properties", icon: "properties" as IconName },
                { label: "Rentals", href: "/admin-dashboard/rentals", icon: "requests" as IconName },
                { label: "Categories", href: "/admin-dashboard/categories", icon: "categories" as IconName },
            ];
        default:
            return [];
    }
}