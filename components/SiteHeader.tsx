// components/SiteHeader.tsx
import Image from "next/image";
import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-brand">
          <Image src="/logo.svg" alt="tasko 로고" width={32} height={32} />
          tasko
        </Link>
        <nav className="flex gap-6 text-gray-700">
          <Link href="/tasks" className="hover:text-brand">
            할 일
          </Link>
          <Link href="/about" className="hover:text-brand">
            소개
          </Link>
        </nav>
      </div>
    </header>
  );
}
