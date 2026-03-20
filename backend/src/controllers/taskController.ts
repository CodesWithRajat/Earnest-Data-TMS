import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/errors.js";
import { createTaskSchema, listTasksSchema, updateTaskSchema } from "../validators/task.js";

function assertUser(req: Request) {
  const userId = req.user?.id;
  if (!userId) throw new AppError("Unauthorized", 401);
  return userId;
}

export async function listTasks(req: Request, res: Response) {
  const userId = assertUser(req);
  const parsed = listTasksSchema.safeParse(req.query);
  if (!parsed.success) {
    throw new AppError(parsed.error.issues[0]?.message || "Invalid query", 400);
  }

  const { page, limit, status, search } = parsed.data;

  const where = {
    userId,
    ...(status ? { status } : {}),
    ...(search
      ? {
          title: {
            contains: search,
            mode: "insensitive" as const
          }
        }
      : {})
  };

  const [total, tasks] = await Promise.all([
    prisma.task.count({ where }),
    prisma.task.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit
    })
  ]);

  res.json({
    data: tasks,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit))
    }
  });
}

export async function createTask(req: Request, res: Response) {
  const userId = assertUser(req);
  const parsed = createTaskSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(parsed.error.issues[0]?.message || "Invalid input", 400);
  }

  const task = await prisma.task.create({
    data: {
      userId,
      title: parsed.data.title,
      description: parsed.data.description ?? null,
      status: parsed.data.status ?? "PENDING"
    }
  });

  res.status(201).json({ task });
}

export async function getTask(req: Request, res: Response) {
  const userId = assertUser(req);
  const task = await prisma.task.findFirst({
    where: { id: req.params.id, userId }
  });

  if (!task) throw new AppError("Task not found", 404);
  res.json({ task });
}

export async function updateTask(req: Request, res: Response) {
  const userId = assertUser(req);
  const parsed = updateTaskSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(parsed.error.issues[0]?.message || "Invalid input", 400);
  }

  const existing = await prisma.task.findFirst({
    where: { id: req.params.id, userId }
  });
  if (!existing) throw new AppError("Task not found", 404);

  const task = await prisma.task.update({
    where: { id: existing.id },
    data: {
      ...(parsed.data.title !== undefined ? { title: parsed.data.title } : {}),
      ...(parsed.data.description !== undefined ? { description: parsed.data.description } : {}),
      ...(parsed.data.status !== undefined ? { status: parsed.data.status } : {})
    }
  });

  res.json({ task });
}

export async function deleteTask(req: Request, res: Response) {
  const userId = assertUser(req);
  const existing = await prisma.task.findFirst({
    where: { id: req.params.id, userId }
  });
  if (!existing) throw new AppError("Task not found", 404);

  await prisma.task.delete({ where: { id: existing.id } });
  res.json({ message: "Task deleted" });
}

export async function toggleTask(req: Request, res: Response) {
  const userId = assertUser(req);
  const existing = await prisma.task.findFirst({
    where: { id: req.params.id, userId }
  });
  if (!existing) throw new AppError("Task not found", 404);

  const task = await prisma.task.update({
    where: { id: existing.id },
    data: {
      status: existing.status === "COMPLETED" ? "PENDING" : "COMPLETED"
    }
  });

  res.json({ task });
}
