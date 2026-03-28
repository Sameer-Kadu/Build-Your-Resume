import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import { ResumeProvider } from "@/context/resume-context";

export const metadata: Metadata = {
  title: "Build Your Resume - ATS Optimized",
  description: "Modern, production-ready Resume Builder with Google Drive storage.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-calibri antialiased">
        <AuthProvider>
          <ResumeProvider>
            {children}
          </ResumeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
