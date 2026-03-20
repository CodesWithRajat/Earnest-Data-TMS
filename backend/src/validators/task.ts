import { z } from "zod";

export const taskStatusValues = ["PENDING", "COMPLETED"] as const;

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(120),
  description: z.string().max(1000).optional().nullable(),
  status: z.enum(taskStatusValues).optional()
});

export const updateTaskSchema = createTaskSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field is required" }
);

export const listTasksSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  status: z.enum(taskStatusValues).optional(),
  search: z.string().optional().default("")
});
