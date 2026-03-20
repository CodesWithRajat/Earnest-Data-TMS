import { Toaster } from "react-hot-toast";
import "./globals.css";
import Footer from "@/components/Footer";
export const metadata = {
  title: "Task Management System",
  description: "Full-stack task management app with Next.js and Node.js"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Toaster position="top-right" />
        <div className="container">
          <div className="shell">{children}</div>
        </div>
        <Footer />
      </body>
    </html>
  );
}
