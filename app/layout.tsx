"use client";
import "./globals.css";
import { ThemeProvider } from "@material-tailwind/react";

// See https://docs.fontawesome.com/web/use-with/react/use-with
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

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
    dialog: {
      styles: {
        base: {
          backdrop: {
            backgroundColor: "bg-black/60",
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
