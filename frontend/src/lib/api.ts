"use client";

import type { AuthResponse, Task, TaskListResponse, TaskStatus, User } from "./types";
import { clearSession, getAccessToken, setSession } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function refreshAccessToken(): Promise<string | null> {
  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" }
  });

  if (!res.ok) return null;
  const data = (await res.json()) as { accessToken: string; user: User };
  setSession(data.accessToken, data.user);
  return data.accessToken;
}

async function apiFetch<T>(path: string, init: RequestInit = {}, retry = true): Promise<T> {
  const token = getAccessToken();
  const headers = new Headers(init.headers || {});
  headers.set("Content-Type", headers.get("Content-Type") || "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
    credentials: "include"
  });

  if (res.status === 401 && retry && !path.startsWith("/auth/")) {
    const fresh = await refreshAccessToken();
    if (fresh) return apiFetch<T>(path, init, false);
    clearSession();
  }

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const err = await res.json();
      if (err?.message) message = err.message;
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export async function register(email: string, password: string) {
  const data = await apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
  setSession(data.accessToken, data.user);
  return data;
}

export async function login(email: string, password: string) {
  const data = await apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
  setSession(data.accessToken, data.user);
  return data;
}

export async function logout() {
  await apiFetch<{ message: string }>("/auth/logout", {
    method: "POST"
  });
  clearSession();
}

export async function getMe() {
  return apiFetch<{ user: User }>("/auth/me");
}

export async function listTasks(params: {
  page: number;
  limit: number;
  search: string;
  status: "" | TaskStatus;
}) {
  const query = new URLSearchParams();
  query.set("page", String(params.page));
  query.set("limit", String(params.limit));
  if (params.search) query.set("search", params.search);
  if (params.status) query.set("status", params.status);
  return apiFetch<TaskListResponse>(`/tasks?${query.toString()}`);
}

export async function createTask(payload: { title: string; description?: string; status?: TaskStatus }) {
  return apiFetch<{ task: Task }>("/tasks", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function updateTask(taskId: string, payload: { title?: string; description?: string | null; status?: TaskStatus }) {
  return apiFetch<{ task: Task }>(`/tasks/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
}

export async function deleteTask(taskId: string) {
  return apiFetch<{ message: string }>(`/tasks/${taskId}`, {
    method: "DELETE"
  });
}

export async function toggleTask(taskId: string) {
  return apiFetch<{ task: Task }>(`/tasks/${taskId}/toggle`, {
    method: "PATCH"
  });
}
