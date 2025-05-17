import { ReactNode } from "react";

export default function TextLink({
  children,
  href,
}: {
  children: ReactNode;
  href: string;
}) {
  return (
    <a
      href={href}
      className="text-blue-600 hover:bg-blue-50 active:bg-blue-100"
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  );
}
