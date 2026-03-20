"use client";

import type { Task } from "@/lib/types";

export default function TaskItem({
  task,
  onEdit,
  onDelete,
  onToggle
}: {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onToggle: (task: Task) => void;
}) {
  const completed = task.status === "COMPLETED";

  return (
    <article className="task">
      <header>
        <div>
          <h3 style={{ margin: "0 0 6px" }}>{task.title}</h3>
          <div className={`badge ${completed ? "completed" : "pending"}`}>
            {completed ? "Completed" : "Pending"}
          </div>
        </div>
        <span className="muted small">{new Date(task.createdAt).toLocaleString()}</span>
      </header>

      {task.description ? <p className="muted" style={{ margin: 0 }}>{task.description}</p> : <p className="muted" style={{ margin: 0 }}>No description provided.</p>}

      <div className="actions">
        <button className="success" onClick={() => onToggle(task)}>
          {completed ? "Mark Pending" : "Mark Done"}
        </button>
        <button className="secondary" onClick={() => onEdit(task)}>Edit</button>
        <button className="danger" onClick={() => onDelete(task)}>Delete</button>
      </div>
    </article>
  );
}
