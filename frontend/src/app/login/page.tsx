"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";
import { login } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <main className="content">
        <section className="grid2">
          <div className="card">
            <h3>Login</h3>
            <p className="muted">Access your personal task dashboard.</p>
            <form className="form" onSubmit={handleSubmit}>
              <div>
                <label className="small muted">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <label className="small muted">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              {error ? <div className="notice error">{error}</div> : null}
              <button className="primary" type="submit" disabled={loading}>
                {loading ? "Signing in..." : "Login"}
              </button>
            </form>
          </div>
        </section>
      </main>
    </>
  );
}
