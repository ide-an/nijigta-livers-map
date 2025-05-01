"use client";
import "./globals.css";
import { ThemeProvider } from "@material-tailwind/react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = {
    chip: {
      styles: {
        base: {
          chip: {
            textTransform: "normal-case",
          },
        },
      },
    },
  };
  return (
    <ThemeProvider value={theme}>
      <html lang="ja">
        <body>{children}</body>
      </html>
    </ThemeProvider>
  );
}
