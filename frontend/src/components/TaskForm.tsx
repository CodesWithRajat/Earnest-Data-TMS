"use client";

import { useEffect, useState } from "react";
import type { Task, TaskStatus } from "@/lib/types";

export default function TaskForm({
  onSubmit,
  initialTask,
  onCancel,
  submitLabel
}: {
  onSubmit: (payload: { title: string; description?: string; status?: TaskStatus }) => Promise<void>;
  initialTask?: Task | null;
  onCancel?: () => void;
  submitLabel: string;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("PENDING");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTitle(initialTask?.title ?? "");
    setDescription(initialTask?.description ?? "");
    setStatus(initialTask?.status ?? "PENDING");
  }, [initialTask]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({ title, description, status });
      if (!initialTask) {
        setTitle("");
        setDescription("");
        setStatus("PENDING");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="row cols2">
        <div>
          <label className="small muted">Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title" required />
        </div>
        <div>
          <label className="small muted">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)}>
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      <div>
        <label className="small muted">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional details..." />
      </div>

      <div className="actions">
        <button className="primary" type="submit" disabled={loading}>
          {loading ? "Saving..." : submitLabel}
        </button>
        {onCancel ? (
          <button className="secondary" type="button" onClick={onCancel}>
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}
