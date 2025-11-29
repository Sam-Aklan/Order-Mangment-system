"use client";

import { productType } from "@/lib/actions/products";
import Image from "next/image";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Trash2 } from "lucide-react";

export default function ProductView({
  product,
  setToDelete,
}: {
  product: productType;
  setToDelete: Dispatch<
    SetStateAction<{
      name: string;
      id: string;
    } | null>
  >;
}) {
  return (
    <Card className="p-4 hover:shadow-md transition flex gap-4 items-start">
      {/* Image */}
      <div className="relative w-20 h-20 rounded-md overflow-hidden border bg-muted">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground text-xs">
            No image
          </div>
        )}
      </div>

      {/* Content */}
      <CardContent className="p-0 flex-1">
        <div className="flex flex-col justify-between h-full">
          {/* Title + Info */}
          <div>
            <h3 className="font-semibold text-lg">{product.name}</h3>
            <p className="text-sm text-muted-foreground">
              {product.category} • ${product.price.toFixed(2)}
            </p>

            <Badge
              variant={product.stock > 0 ? "default" : "destructive"}
              className="mt-2 w-fit"
            >
              {product.stock > 0
                ? `${product.stock} in stock`
                : "Out of stock"}
            </Badge>
          </div>

          {/* Actions */}
          <div className="flex gap-2 items-center mt-3">
            <Button variant="outline" size="sm" asChild className="gap-1">
              <Link href={`/dashboard/products/${product.id}`}>
                <Eye className="h-4 w-4" />
                View
              </Link>
            </Button>

            <Button
              variant="destructive"
              size="sm"
              className="gap-1"
              onClick={() =>
                setToDelete({ name: product.name, id: product.id })
              }
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
