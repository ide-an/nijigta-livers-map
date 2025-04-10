"use client";
import "./globals.css";
import { ThemeProvider } from "@material-tailwind/react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider>
      <html lang="ja">
        <body>
          {children}
        </body>
      </html>
    </ThemeProvider>
  );
}
