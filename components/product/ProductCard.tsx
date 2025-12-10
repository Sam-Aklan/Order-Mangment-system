"use client";

import { productType } from "@/lib/actions/products";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: productType & { stock?: number };
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove?: () => void;
  disableStockCheck?: boolean;
}

export default function ProductCard({
  product,
  quantity,
  onIncrease,
  onDecrease,
  onRemove,
  disableStockCheck = false,
}: ProductCardProps) {
  const isAtStockLimit =
    !disableStockCheck && product.stock !== undefined && quantity >= product.stock;

  return (
    <Card className="w-full shadow-sm flex flex-col justify-between">
      <CardHeader>
        <CardTitle className="text-lg">{product.name}</CardTitle>

        <CardDescription className="flex flex-col gap-1">
          <span className="text-base font-medium">
            ${product.price.toFixed(2)}
          </span>

          {product.stock !== undefined && !disableStockCheck && (
            <Badge
              className={cn(
                "w-fit",
                product.stock === 0
                  ? "bg-red-100 text-red-800"
                  : "bg-chart-3 text-blue-800"
              )}
            >
              {product.stock} in stock
            </Badge>
          )}

          {product.category && (
            <span className="text-sm text-muted-foreground">
              {product.category}
            </span>
          )}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {quantity===0?<Button 
        className="w-fit p-2"
        onClick={onIncrease}>

          <ShoppingCart/> Add to cart
        </Button>:<div className="flex items-center gap-3 ">
          <Button
            type="button"
            size="icon"
            className="rounded-full"
            onClick={onIncrease}
            disabled={isAtStockLimit}
          >
            <Plus className="h-4 w-4" />
          </Button>

          <span className="min-w-[2rem] text-center text-base">
            {quantity}
          </span>
           <Button
            type="button"
            variant={`secondary`}
            size="icon"
            onClick={onDecrease}
            className="rounded-full"
            disabled={quantity === 0}
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>}

        {isAtStockLimit && (
          <p className="text-sm text-red-500 mt-2">
            Maximum stock reached.
          </p>
        )}
      </CardContent>

      {onRemove && quantity > 0 && (
        <CardFooter className="pt-2">
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={onRemove}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Remove
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
