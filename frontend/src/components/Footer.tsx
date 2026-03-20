"use client";

import { Home, PlusCircle, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AddTaskModal from "./AddTaskModal";

export default function Footer() {
  const router = useRouter();
  const [showAdd, setShowAdd] = useState(false);

  return (
    <>
      <footer className="footer">
        <div className="footer-nav">

          {/* Home */}
          <button className="nav-item" onClick={() => router.push("/")}>
            <Home size={20} />
          </button>

          {/* ➕ Add Task (CENTER BUTTON) */}
          <button
            className="nav-item highlight"
            onClick={() => setShowAdd(true)}
          >
            <PlusCircle size={28} />
          </button>

          {/* Profile */}
          <button className="nav-item">
            <User size={20} />
          </button>

        </div>
      </footer>

      {/* Modal */}
      {showAdd && (
        <AddTaskModal onClose={() => setShowAdd(false)} />
      )}
    </>
  );
}