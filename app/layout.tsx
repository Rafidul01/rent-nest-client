
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";

import "./globals.css";
// import { Navbar } from "./components/shared/navbar";
import { Toaster } from "sonner";
// import { getUser } from "@/service/getUser";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    // const user = await getUser();

    return (
        <html lang="en" className="h-full antialiased">
            <body className="min-h-full flex flex-col" suppressHydrationWarning>
                <TooltipProvider>
                    {/* <Navbar user={user} /> */}
                    {children}
                    <Toaster />
                </TooltipProvider>
            </body>
        </html>
    );
}