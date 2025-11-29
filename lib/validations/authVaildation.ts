import z from "zod";

export const authSchema = z.object({
  email: z.email({message:"enter a vaild email addres"}),
  password: z.string().min(1,{message:"enter a password"})
});

export type AuthSchemaType = z.infer<typeof authSchema>

