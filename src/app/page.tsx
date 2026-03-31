import { SolvedAcWorkbench } from "@/components/solvedac-workbench";
import { createClient } from "@/utils/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: todos, error } = await supabase
    .from("todos")
    .select("id, name")
    .limit(5);

  return (
    <main className="space-y-8">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">Supabase connection check</h1>
        <p className="mt-2 text-sm text-slate-600">
          The list below reads from the <code>todos</code> table if it exists.
        </p>
        {error ? (
          <p className="mt-4 text-sm text-amber-700">
            Supabase is connected, but the query failed: {error.message}
          </p>
        ) : todos && todos.length > 0 ? (
          <ul className="mt-4 list-disc pl-5 text-sm text-slate-700">
            {todos.map((todo) => (
              <li key={todo.id}>{todo.name}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-slate-500">No todos found yet.</p>
        )}
      </section>
      <SolvedAcWorkbench />
    </main>
  );
}
