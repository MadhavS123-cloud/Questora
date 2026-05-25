import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Sidebar from "../components/Sidebar";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"]
});

export const metadata: Metadata = {
  title: "QUESTORA - AI Assignment Generator Platform",
  description: "Generate beautiful, structured, and curriculum-compliant exam papers from textbook PDFs in real-time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable}`}>
      <body className="flex h-screen w-screen overflow-hidden bg-neutral-50 font-ui text-neutral-800 antialiased">
        {/* Responsive Workspace Grid */}
        <div className="flex h-full w-full overflow-hidden">
          {/* Collapsible Sidebar */}
          <Sidebar />

          {/* Main Context Right Window */}
          <main className="flex-1 h-full overflow-y-auto relative flex flex-col focus:outline-none">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
