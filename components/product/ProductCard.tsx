"use client";

import { productType } from "@/lib/actions/products";

interface ProductCardProps {
  product: productType & { stock?: number }; // stock optional for edit
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove?: () => void; // optional remove action
  disableStockCheck?: boolean; // for edit mode
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
    <div className="border rounded p-4 shadow-sm flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-sm text-gray-600">
          ${product.price.toFixed(2)}
          {product.stock !== undefined && !disableStockCheck && (
            <> — {product.stock} in stock</>
          )}
        </p>
        {product.category && (
          <p className="text-sm text-gray-600">{product.category}</p>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={onDecrease}
          className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
          disabled={quantity === 0}
        >
          −
        </button>
        <span className="min-w-[2rem] text-center">{quantity}</span>
        <button
          type="button"
          onClick={onIncrease}
          className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
          disabled={isAtStockLimit}
        >
          +
        </button>
      </div>

      {onRemove && quantity > 0 && (
        <button
          type="button"
          onClick={onRemove}
          className="mt-2 text-sm text-red-600 hover:underline self-start"
        >
          Remove
        </button>
      )}
    </div>
  );
}
