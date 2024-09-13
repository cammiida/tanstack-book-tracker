import { z } from "zod";

export const todoSchema = z.object({
  id: z.string(),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z
    .string()
    .optional()
    .transform((val) => (val?.length ? val : undefined)),
  completed: z.boolean().default(false),
});

export const newTodoSchema = z.object({
  title: todoSchema.shape.title,
  description: todoSchema.shape.description,
});
