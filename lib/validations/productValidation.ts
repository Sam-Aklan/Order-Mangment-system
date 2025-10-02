import { z } from "zod";

// Allowed categories
const categories = ["ELECTRONICS", "FOOD", "BOOKS", "FURNITURE", "OTHER"] as const;

export const productSchema = z.object({
  name: z.string().min(1, { message: "Product name is required" }),
  price: z
    .number({message:"enter a number"})
    .positive({ message: "Price must be greater than 0" })
    .refine(price=> !isNaN(price),{message:"enter a number"}),

category: z.enum(categories,{message:"choose vaild category"}).refine(cate=> categories.includes(cate),{
    message:"choose a vaild category"
}).refine(cate=> cate !==undefined,{message:"choosse a vaild category"}),
  stock: z
    .number()
    .int({ message: "Stock must be an integer" })
    .nonnegative({ message: "Stock must be 0 or greater" }),
  image: z
    .instanceof(File)
    .refine((file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type), {
      message: "Only JPEG, PNG, or WEBP files are allowed",
    })
    .refine((file) => file.size <= 2 * 1024 * 1024, {
      message: "Image size must not exceed 2MB",
    })
    .nullable()
    .optional(),
});

export type ProductInput = z.infer<typeof productSchema>;
