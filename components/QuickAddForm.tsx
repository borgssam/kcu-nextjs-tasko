// components/QuickAddForm.tsx
"use client";

import { useState } from "react";
import type { ChangeEvent, SubmitEvent } from "react";
import { STATUS_LABEL } from "@/lib/types";
import type { Task, TaskStatus } from "@/lib/types";

export default function QuickAddForm() {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [tasks, setTasks] = useState<Task[]>([]);

  function handleTitleChange(e: ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value);
  }

  function handleStatusChange(e: ChangeEvent<HTMLSelectElement>) {
    setStatus(e.target.value as TaskStatus);
  }

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = title.trim();
    if (trimmed === "") {
      return;
    }
    const newTask: Task = {
      id: tasks.length + 1,
      title: trimmed,
      content: "",
      status: status,
      assignee: "나",
      createdAt: "2026-11-15",
    };
    const nextTasks = tasks.slice();
    nextTasks.push(newTask);
    setTasks(nextTasks);
    setTitle("");
  }

  return (
    <div style={{ padding: 24 }}>
      <form onSubmit={handleSubmit}>
        <input value={title} onChange={handleTitleChange} placeholder="할 일 제목" />
        <select value={status} onChange={handleStatusChange}>
          <option value="todo">할 일</option>
          <option value="doing">진행 중</option>
          <option value="done">완료</option>
        </select>
        <button type="submit">추가</button>
      </form>
      <p>추가한 할 일: {tasks.length}개</p>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            [{STATUS_LABEL[task.status]}] {task.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
