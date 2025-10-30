import {z} from 'zod'

// Allowed categories
const categories = ["ELECTRONICS", "FOOD", "BOOKS", "FURNITURE", "CLOTHING","OTHER"] as const;

export const productSchema = z.object({
  name: z.string().min(1, { message: "Product name is required" }),
  price: z
    .string({message:"enter a number"})
    
    .refine(price=> !isNaN(Number(price)),{message:"enter a number not a text"})
    .refine(price=>Number(price) > 0,{message:"price must be greater than 0"}),

category: z.enum(categories,{message:"choose vaild category"}).refine(cate=> categories.includes(cate),{
    message:"choose a vaild category"
}).refine(cate=> cate !==undefined,{message:"choosse a vaild category"}),
  stock: z
    .string({message:"enter a number"})
    .refine(stock=> !isNaN(Number(stock)), {message:"enter a number not a text"})
    .refine(stock=>Number.isInteger(Number(stock)), {message:"float values are not excepted for stock"}),
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
