import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";

import "./globals.css";
import { Navbar } from "./components/shared/navbar";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});


export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="h-full antialiased">
            <body className="min-h-full flex flex-col" suppressHydrationWarning>
                <Navbar />
                {children}
            </body>
        </html>
    );
}