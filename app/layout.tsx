"use client";
import "./globals.css";
import { ThemeProvider } from "@material-tailwind/react";

// See https://docs.fontawesome.com/web/use-with/react/use-with
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { NavbarDefault } from "./components/navbar";
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
        <body className="h-dvh">
          <div className="flex flex-col h-dvh">
            <div className="md:h-[63.5px]">
              <NavbarDefault />
            </div>
            <div className="h-full md:h-[calc(100vh-63.5px)] bg-gray-200 text-black overflow-y-scroll">
              {children}
            </div>
          </div>
        </body>
      </html>
    </ThemeProvider>
  );
}
