import z from "zod";

export const filtersSchema = z.object({
  from: z.date().optional(),
  to: z.date().optional(),
  granularity: z.enum(['week','day','month',]).optional(),
  category: z.enum(["ELECTRONICS" , "CLOTHING" , "FOOD" , "BOOKS" , "FURNITURE" , "OTHER",]).optional(),
  status: z.enum(["PENDING","SHIPPED","DELIVERED",]).optional()
});

export type filtersSchemaType = z.infer<typeof filtersSchema>