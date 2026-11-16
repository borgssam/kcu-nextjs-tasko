// components/Section.tsx
import type { ReactNode } from "react";

interface SectionProps {
  title: string;
  children: ReactNode;
}

export default function Section({ title, children }: SectionProps) {
  return (
    <section className="mb-8">
      <h2 className="mb-4 text-lg font-semibold text-gray-700">{title}</h2>
      {children}
    </section>
  );
}
