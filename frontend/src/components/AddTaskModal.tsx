"use client";

import { useState } from "react";
import { createTask } from "@/lib/api";

export default function AddTaskModal({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!title) return;

    setLoading(true);
    try {
      await createTask({ title });
      onClose();
      location.reload(); // simple refresh
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Add Task</h3>

        <input
          placeholder="Enter task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button className="primary" onClick={handleAdd}>
            {loading ? "Adding..." : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}