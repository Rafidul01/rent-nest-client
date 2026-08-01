
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ProductCard } from "./product-card";

export default function Home() {
 return (
    <main className="flex min-h-svh items-center justify-center bg-background p-6">
      <ProductCard/>
    </main>
  )
}
