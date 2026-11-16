// components/CommentSection.tsx
"use client";

import { useEffect, useOptimistic } from "react";
import { useRouter } from "next/navigation";
import CommentList from "@/components/CommentList";
import { addCommentAction } from "@/lib/actions";
import { supabase } from "@/lib/supabase";
import type { Comment } from "@/lib/types";

interface CommentSectionProps {
  taskId: number;
  comments: Comment[];
}

function addToList(current: Comment[], newComment: Comment): Comment[] {
  const next = current.slice();
  next.push(newComment);
  return next;
}

function readText(formData: FormData, name: string): string {
  const value = formData.get(name);
  if (typeof value !== "string") {
    return "";
  }
  return value.trim();
}

export default function CommentSection({ taskId, comments }: CommentSectionProps) {
  const router = useRouter();
  const [optimisticComments, addOptimisticComment] = useOptimistic(comments, addToList);
  const input = "rounded-md border border-gray-300 px-3 py-2 focus:border-brand focus:outline-none";

  useEffect(() => {
    const channel = supabase
      .channel(`comments-${taskId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
          filter: `task_id=eq.${taskId}`,
        },
        () => {
          router.refresh();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [taskId, router]);

  async function handleAction(formData: FormData) {
    const author = readText(formData, "author");
    const content = readText(formData, "content");
    if (author === "" || content === "") {
      return;
    }
    addOptimisticComment({
      id: -Date.now(),
      taskId: taskId,
      author: author,
      content: content,
      createdAt: "등록 중...",
    });
    await addCommentAction(formData);
  }

  return (
    <>
      <CommentList comments={optimisticComments} />
      <form action={handleAction} className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input type="hidden" name="taskId" value={taskId} />
        <input name="author" placeholder="이름" className={`${input} sm:w-32`} />
        <input name="content" placeholder="댓글을 입력하세요" className={`${input} flex-1`} />
        <button type="submit" className="rounded-md bg-brand px-4 py-2 text-white hover:bg-brand-dark">
          등록
        </button>
      </form>
    </>
  );
}
