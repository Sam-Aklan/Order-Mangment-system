"use client"

import { categoryType } from "@/lib/actions/products"
import Link from "next/link"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface OrderCardProps {
  orderId: string
  customerName: string
  userRole: "admin" | "user"
  createdAt: Date
  status: string
  total: number
  items: {
    product: {
      name: string
      id: string
      price: number
      stock: number
      category: categoryType
    }
    quantity: number
    id: string
  }[]
  setOrderToDelete: (id: string) => void
}

const statusVariant = (status: string) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800"
    case "SHIPPED":
      return "bg-blue-100 text-blue-800"
    default:
      return "bg-green-100 text-green-800"
  }
}

const OrderCard = ({
  customerName,
  items,
  total,
  createdAt,
  orderId,
  status,
  userRole,
  setOrderToDelete,
}: OrderCardProps) => {
  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="font-semibold text-lg">{customerName}</h3>
          <p className="text-sm text-muted-foreground">
            Created: {new Date(createdAt).toLocaleString()}
          </p>
        </div>

        <div className="flex flex-col items-start sm:items-end gap-1">
          <Badge
            className={`${statusVariant(
              status
            )} px-3 py-1 rounded-full text-xs font-semibold`}
          >
            {status}
          </Badge>
          <p className="font-bold text-sm sm:text-base">
            Total: ${total.toFixed(2)}
          </p>
        </div>
      </CardHeader>

      <CardContent className="mt-2">
        <p className="font-medium mb-2">Products:</p>
        <ul className="list-disc ml-6 text-sm space-y-1">
          {items.map((item) => (
            <li key={item.id}>
              {item.product.name} × {item.quantity} (${item.product.price.toFixed(2)} each)
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="flex justify-end gap-2 mt-4 flex-wrap">
          <Button asChild>
          <Link href={`/dashboard/order/${orderId}`}>View</Link>
        </Button>
        
        {userRole === "admin" && (
          <Button
            variant="destructive"
            onClick={() => setOrderToDelete(orderId)}
          >
            Delete
          </Button>
        )}

      </CardFooter>
    </Card>
  )
}

export default OrderCard
