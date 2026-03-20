"use client";
import toast from "react-hot-toast";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";
import TaskForm from "@/components/TaskForm";
import TaskItem from "@/components/TaskItem";
import { clearSession, getStoredUser } from "@/lib/auth";
import { createTask, deleteTask, listTasks, toggleTask, updateTask } from "@/lib/api";
import type { Task, TaskStatus, User } from "@/lib/types";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"" | TaskStatus>("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Task | null>(null);

  useEffect(() => {
    const stored = getStoredUser<User>();
    setUser(stored);
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await listTasks({ page, limit, search, status });
      setTasks(res.data);
      setTotalPages(res.meta.totalPages);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unable to load tasks";
      setError(msg);
      if (msg.toLowerCase().includes("unauthorized")) {
        clearSession();
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, status]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setPage(1);
      fetchTasks();
    }, 350);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const stats = useMemo(() => {
    const done = tasks.filter((t) => t.status === "COMPLETED").length;
    return { shown: tasks.length, done };
  }, [tasks]);

  const onCreate = async (payload: { title: string; description?: string; status?: TaskStatus }) => {
    try {
      await createTask(payload);
      toast.success("Task created!");
      await fetchTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create failed");
    }
  };

  const onUpdate = async (payload: { title: string; description?: string; status?: TaskStatus }) => {
    if (!editing) return;
    try {
      await updateTask(editing.id, payload);
      toast.success("Task updated successfully");
      setEditing(null);
      await fetchTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    }
  };

  const onDelete = async (task: Task) => {
    if (!confirm(`Delete "${task.title}"?`)) return;
    try {
      await deleteTask(task.id);
      toast.success("Task deleted successfully");
      await fetchTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const onToggle = async (task: Task) => {
    try {
      await toggleTask(task.id);
      toast.success("Task status updated");
      await fetchTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Toggle failed");
    }
  };

  useEffect(() => {
    if (!message) return;
    const id = window.setTimeout(() => setMessage(""), 2200);
    return () => window.clearTimeout(id);
  }, [message]);

  useEffect(() => {
    if (!error) return;
    const id = window.setTimeout(() => setError(""), 2600);
    return () => window.clearTimeout(id);
  }, [error]);

  useEffect(() => {
    if (!getStoredUser<User>()) {
      router.push("/login");
    }
  }, [router]);

  return (
    <>
      <NavBar />
      {/* <NavBar userEmail={user?.email ?? null} /> */}
      <main className="content">
        <section className="grid2">
          <div className="card">
            <h3>Task dashboard</h3>
            <p className="muted">Create, edit, filter, search, and manage your own tasks.</p>
            <div className="notice small">
              Showing {stats.shown} tasks on this page · {stats.done} completed
            </div>
          </div>

          <div className="card">
            <h3>Add task</h3>
            <TaskForm submitLabel="Create task" onSubmit={onCreate} />
          </div>
        </section>

        <section className="card">
          <h3>Filters</h3>
          <div className="toolbar">
            <input
              placeholder="Search by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select value={status} onChange={(e) => { setStatus(e.target.value as "" | TaskStatus); setPage(1); }}>
              <option value="">All status</option>
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
            </select>
            <button className="secondary" onClick={() => { setSearch(""); setStatus(""); setPage(1); }}>
              Reset
            </button>
            <button className="secondary" onClick={fetchTasks}>Refresh</button>
          </div>
        </section>

        {message ? <div className="notice success">{message}</div> : null}
        {error ? <div className="notice error">{error}</div> : null}

        <section className="tasks">
          {loading ? (
            <div className="card"><div className="card">
  <div className="loader"></div>
</div></div>
          ) : tasks.length === 0 ? (
            <div className="card">
              <p className="muted"><div className="card">
  <h3>No Tasks Yet 😴</h3>
  <p className="muted">Start by creating your first task!</p>
</div></p>
            </div>
          ) : (
            tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onEdit={setEditing}
                onDelete={onDelete}
                onToggle={onToggle}
              />
            ))
          )}
        </section>

        <section className="card pagination">
          <div className="muted small">Page {page} of {totalPages}</div>
          <div className="actions">
            <button className="secondary" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
              Previous
            </button>
            <button className="secondary" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
              Next
            </button>
          </div>
        </section>

        {editing ? (
          <section className="card">
            <h3>Edit task</h3>
            <TaskForm
              submitLabel="Save changes"
              initialTask={editing}
              onSubmit={onUpdate}
              onCancel={() => setEditing(null)}
            />
          </section>
        ) : null}
      </main>
    </>
  );
}
