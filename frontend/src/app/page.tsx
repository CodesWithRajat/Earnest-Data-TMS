import Link from "next/link";
import NavBar from "@/components/NavBar";

export default function HomePage() {
  return (
    <>
      <NavBar />
      <main className="content">
        <section className="grid2">
          <div className="card">
            <h3>Full-stack task manager</h3>
            <p className="muted">
              A polished assessment project with secure JWT authentication, refresh tokens, task CRUD, pagination, filtering, search, and a responsive Next.js frontend.
            </p>
            <div className="actions">
              <Link className="primary" href="/register">Get Started</Link>
              <Link className="secondary" href="/login">Login</Link>
            </div>
          </div>
          <div className="card">
            <h3>What is included</h3>
            <ul className="muted">
              <li>Backend API in Node.js + TypeScript</li>
              <li>Prisma ORM + SQLite</li>
              <li>Access token + refresh token flow</li>
              <li>Task search, filter, pagination, and toggle</li>
            </ul>
          </div>
        </section>
      </main>
    </>
  );
}
