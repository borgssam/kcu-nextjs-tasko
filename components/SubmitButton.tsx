// components/SubmitButton.tsx
"use client";

import { useFormStatus } from "react-dom";

interface SubmitButtonProps {
  label: string;
}

export default function SubmitButton({ label }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  let text = label;
  if (pending) {
    text = "저장 중...";
  }

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-brand px-6 py-2 text-white hover:bg-brand-dark disabled:bg-gray-400"
    >
      {text}
    </button>
  );
}
