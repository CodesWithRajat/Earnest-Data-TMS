export type User = {
  id: string;
  email: string;
  createdAt?: string;
};

export type AuthResponse = {
  user: User;
  accessToken: string;
};

export type TaskStatus = "PENDING" | "COMPLETED";

export type Task = {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type TaskListResponse = {
  data: Task[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
