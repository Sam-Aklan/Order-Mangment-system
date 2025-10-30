import { z } from "zod";

export const MAX_IMAGE_SIZE = 1 * 1024 * 1024; // 1MB
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export const customerSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  email: z.string().email({ message: "Invalid email address." }),
  image: z
    .instanceof(File)
    .refine((file) => file === null || file instanceof File, {
      message: "Image must be a file.",
    })
    .refine(
      (file) =>
        file === null ||
        (ACCEPTED_IMAGE_TYPES.includes(file.type) &&
          file.size <= MAX_IMAGE_SIZE),
      {
        message: "Image must be JPEG, PNG, or WEBP and less than 5MB.",
      }
    )
    .nullable()
    .optional(),
});

export type CustomerInput = z.infer<typeof customerSchema>;
