import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DocumentManagement - Pharmaceutical DMS",
  description: "21 CFR Part 11 compliant pharmaceutical document management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
