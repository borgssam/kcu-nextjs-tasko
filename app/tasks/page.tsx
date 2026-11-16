// app/tasks/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Pagination from "@/components/Pagination";
import Section from "@/components/Section";
import StatusFilter from "@/components/StatusFilter";
import TaskList from "@/components/TaskList";
import { getTasks } from "@/lib/data";
import { parsePage, parseStatus } from "@/lib/types";

export const metadata: Metadata = {
  title: "할 일 목록",
};

interface TasksPageProps {
  searchParams: Promise<{ status?: string; page?: string }>;
}

export default async function TasksPage({ searchParams }: TasksPageProps) {
  const params = await searchParams;
  const status = parseStatus(params.status);
  const page = parsePage(params.page);
  const result = await getTasks(status, page);

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">할 일 목록</h1>
        <Link href="/new" className="rounded-md bg-brand px-4 py-2 text-sm text-white hover:bg-brand-dark">
          새 할 일
        </Link>
      </div>
      <StatusFilter current={status} />
      <Section title={`${result.total}개`}>
        <TaskList tasks={result.tasks} />
      </Section>
      <Pagination total={result.total} page={page} status={status} />
    </>
  );
}
