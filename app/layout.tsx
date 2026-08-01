import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";

import "./globals.css";
import { Navbar } from "./components/shared/navbar";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html
      lang="en"
      className={cn("h-full antialiased", "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col">


        <Navbar />
        {children}

        {/* Footer */}
      </body>
    </html>
  );
}