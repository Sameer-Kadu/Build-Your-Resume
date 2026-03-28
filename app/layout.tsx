import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import { ResumeProvider } from "@/context/resume-context";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        <AuthProvider>
          <ResumeProvider>
            {children}
          </ResumeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
