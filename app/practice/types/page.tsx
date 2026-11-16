// app/practice/types/page.tsx
type TaskStatus = "todo" | "doing" | "done";

interface Task {
  id: number;
  title: string;
  status: TaskStatus;
  assignee: string;
  memo?: string;
}

const STATUS_LABEL: Record<TaskStatus, string> = {
  todo: "할 일",
  doing: "진행 중",
  done: "완료",
};

const tasks: Task[] = [
  { id: 1, title: "Next.js 설치하기", status: "done", assignee: "보그쌤" },
  { id: 2, title: "TypeScript 복습하기", status: "doing", assignee: "김민수", memo: "웹개발기초 7장" },
  { id: 3, title: "Tailwind CSS 복습하기", status: "todo", assignee: "이지은" },
];

function countByStatus(list: Task[], status: TaskStatus): number {
  let count = 0;
  for (const task of list) {
    if (task.status === status) {
      count = count + 1;
    }
  }
  return count;
}

function firstItem<T>(items: T[]): T | undefined {
  return items[0];
}

function taskLine(task: Task): string {
  let line = "[" + STATUS_LABEL[task.status] + "] " + task.title + " (" + task.assignee + ")";
  if (task.memo !== undefined) {
    line = line + " - " + task.memo;
  }
  return line;
}

export default function TypesPracticePage() {
  const first = firstItem(tasks);
  let firstTitle = "없음";
  if (first !== undefined) {
    firstTitle = first.title;
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>TypeScript 요점 연습</h1>
      <p>전체 할 일: {tasks.length}개</p>
      <p>완료: {countByStatus(tasks, "done")}개</p>
      <p>진행 중: {countByStatus(tasks, "doing")}개</p>
      <p>첫 번째 할 일: {firstTitle}</p>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>{taskLine(task)}</li>
        ))}
      </ul>
    </main>
  );
}
