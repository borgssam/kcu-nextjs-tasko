// app/practice/tailwind/page.tsx
export default function TailwindPracticePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="flex items-center justify-between bg-white px-4 py-4 shadow-sm">
        <div className="text-xl font-bold text-brand">tasko</div>
        <nav className="flex gap-6 text-gray-700">
          <a href="#" className="hover:text-blue-600">할 일</a>
          <a href="#" className="hover:text-blue-600">새 할 일</a>
        </nav>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-4 text-2xl font-bold">Tailwind CSS 요점 연습</h1>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-md">
            <h2 className="mb-2 text-lg font-semibold">카드 1</h2>
            <p className="text-sm text-gray-600">화면 너비에 따라 1칸, 2칸, 3칸으로 바뀐다.</p>
          </article>
          <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-md">
            <h2 className="mb-2 text-lg font-semibold">카드 2</h2>
            <p className="text-sm text-gray-600">카드 설명 내용</p>
          </article>
          <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-md">
            <h2 className="mb-2 text-lg font-semibold">카드 3</h2>
            <p className="text-sm text-gray-600">카드 설명 내용</p>
          </article>
        </div>

        <div className="mt-8 flex gap-2">
          <input
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            placeholder="눌러 보면 테두리가 파랗게 바뀐다"
          />
          <button className="rounded-md bg-brand px-4 py-2 text-white transition hover:bg-brand-dark">
            추가
          </button>
        </div>
      </main>
    </div>
  );
}
