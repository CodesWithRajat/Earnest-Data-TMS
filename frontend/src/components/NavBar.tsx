"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getStoredUser, clearSession } from "@/lib/auth";
import { useEffect, useState } from "react";

export default function NavBar() {
  const path = usePathname();
  const router = useRouter();

  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const user = getStoredUser<{ email: string }>();
    setUserEmail(user?.email ?? null);
  }, []);

  const handleLogout = () => {
    clearSession();
    setUserEmail(null);
    router.push("/login");
  };

  return (
    <nav className="navbar">
      <h2>🚀 Task Manager</h2>

      <div className="nav-right">
        <Link href="/" className={`nav-link ${path === "/" ? "active" : ""}`}>
          Home
        </Link>

        {userEmail ? (
          <>
            <Link
              href="/dashboard"
              className={`nav-link ${
                path === "/dashboard" ? "active" : ""
              }`}
            >
              Dashboard
            </Link>

            {/* 👤 Email */}
            <span className="user-email">{userEmail}</span>

            {/* 🔥 Logout */}
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className={`nav-link ${path === "/login" ? "active" : ""}`}
            >
              Login
            </Link>

            <Link
              href="/register"
              className={`nav-link ${
                path === "/register" ? "active" : ""
              }`}
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}