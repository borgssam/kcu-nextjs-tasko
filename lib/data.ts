// lib/data.ts
import { supabase } from "@/lib/supabase";
import { PAGE_SIZE, TASK_STATUSES, parseStatus } from "@/lib/types";
import type { Comment, CommentInput, Task, TaskInput, TaskStatus, TaskWithCount } from "@/lib/types";

interface TaskRow {
  id: number;
  title: string;
  content: string;
  status: string;
  assignee: string;
  created_at: string;
}

interface TaskRowWithCount extends TaskRow {
  comments: { count: number }[];
}

interface CommentRow {
  id: number;
  task_id: number;
  author: string;
  content: string;
  created_at: string;
}

function toTask(row: TaskRow): Task {
  let status = parseStatus(row.status);
  if (status === undefined) {
    status = "todo";
  }
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    status: status,
    assignee: row.assignee,
    createdAt: row.created_at,
  };
}

function toComment(row: CommentRow): Comment {
  return {
    id: row.id,
    taskId: row.task_id,
    author: row.author,
    content: row.content,
    createdAt: row.created_at,
  };
}

async function countTasks(status: TaskStatus | undefined): Promise<number> {
  let query = supabase
    .from("tasks")
    .select("*", { count: "exact", head: true });
  if (status !== undefined) {
    query = query.eq("status", status);
  }

  const result = await query;
  if (result.error) {
    throw new Error(result.error.message);
  }
  if (result.count === null) {
    return 0;
  }
  return result.count;
}

export async function getTasks(
  status: TaskStatus | undefined,
  page: number,
): Promise<{ tasks: TaskWithCount[]; total: number }> {
  const total = await countTasks(status);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  if (from >= total) {
    return { tasks: [], total: total };
  }

  let query = supabase
    .from("tasks")
    .select("*, comments(count)");
  if (status !== undefined) {
    query = query.eq("status", status);
  }

  const result = await query
    .order("id", { ascending: false })
    .range(from, to);
  if (result.error) {
    throw new Error(result.error.message);
  }

  const rows = result.data as TaskRowWithCount[];
  const tasks: TaskWithCount[] = [];
  for (const row of rows) {
    const task = toTask(row);
    let commentCount = 0;
    if (row.comments.length > 0) {
      commentCount = row.comments[0].count;
    }
    tasks.push({
      id: task.id,
      title: task.title,
      content: task.content,
      status: task.status,
      assignee: task.assignee,
      createdAt: task.createdAt,
      commentCount: commentCount,
    });
  }
  return { tasks: tasks, total: total };
}

export async function getStatusCounts(): Promise<Record<TaskStatus, number>> {
  const counts: Record<TaskStatus, number> = { todo: 0, doing: 0, done: 0 };
  for (const status of TASK_STATUSES) {
    counts[status] = await countTasks(status);
  }
  return counts;
}

export async function getTask(id: number): Promise<Task | undefined> {
  if (!Number.isInteger(id)) {
    return undefined;
  }

  const result = await supabase
    .from("tasks")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (result.error) {
    throw new Error(result.error.message);
  }
  if (result.data === null) {
    return undefined;
  }
  return toTask(result.data as TaskRow);
}

export async function getComments(taskId: number): Promise<Comment[]> {
  const result = await supabase
    .from("comments")
    .select("*")
    .eq("task_id", taskId)
    .order("id", { ascending: true });
  if (result.error) {
    throw new Error(result.error.message);
  }

  const rows = result.data as CommentRow[];
  const comments: Comment[] = [];
  for (const row of rows) {
    comments.push(toComment(row));
  }
  return comments;
}

export async function createTask(input: TaskInput): Promise<Task> {
  const result = await supabase
    .from("tasks")
    .insert({
      title: input.title,
      content: input.content,
      status: input.status,
      assignee: input.assignee,
    })
    .select()
    .single();
  if (result.error) {
    throw new Error(result.error.message);
  }
  return toTask(result.data as TaskRow);
}

export async function updateTask(id: number, input: TaskInput): Promise<void> {
  const result = await supabase
    .from("tasks")
    .update({
      title: input.title,
      content: input.content,
      status: input.status,
      assignee: input.assignee,
    })
    .eq("id", id);
  if (result.error) {
    throw new Error(result.error.message);
  }
}

export async function deleteTask(id: number): Promise<void> {
  const result = await supabase
    .from("tasks")
    .delete()
    .eq("id", id);
  if (result.error) {
    throw new Error(result.error.message);
  }
}

export async function addComment(input: CommentInput): Promise<void> {
  const result = await supabase
    .from("comments")
    .insert({
      task_id: input.taskId,
      author: input.author,
      content: input.content,
    });
  if (result.error) {
    throw new Error(result.error.message);
  }
}
