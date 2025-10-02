import { z } from "zod";

export const orderSchema = z.object({
  customerId: z.string({error:"Customer is required."}).min(1, {message:"Customer is required."}),
  products: z
    .array(
      z.object({
        id: z.string(),
        quantity: z.number().min(1, "Quantity must be at least 1."),
        price: z.number().min(0),
        itemName: z.string(),
      })
    )
    .min(1, "At least one product must be added."),
  total: z.number().positive("Total must be greater than zero."),
});

export type OrderInput = z.infer<typeof orderSchema>;

export const updateOrderSchema = z.object({
  orderId: z.string().min(1),
  customerId: z.string().min(1),
  status: z.enum(["PENDING", "SHIPPED", "DELIVERED"]),
  quantities: z.record(z.string(), z.number().int().min(0)),
});

export type updateOrderValidation = z.infer<typeof updateOrderSchema>
