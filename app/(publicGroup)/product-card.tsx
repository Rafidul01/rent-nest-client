import Image from "next/image"
import { ArrowRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function ProductCard() {
  return (
    <Card className="w-full max-w-sm">
      <Image
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4VO10MqDco0mDN0LDHONFJydrGG3Vch6pz3QW7JdYJw&s=10"
        alt="Aurora Pro wireless over-ear headphones"
        width={640}
        height={480}
        className="aspect-[4/3] w-full object-cover"
      />
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle>Aurora Pro Headphones</CardTitle>
          <Badge variant="secondary">In stock</Badge>
        </div>
        <CardDescription>
          Immersive wireless sound with active noise cancellation and 40-hour battery life.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold text-foreground">$299</p>
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          View details
          <ArrowRightIcon data-icon="inline-end" />
        </Button>
      </CardFooter>
    </Card>
  )
}
