import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { todoSchema } from "../schemas";
import { Todo } from "./Todo";
import { NewTodo } from "./NewTodo";

async function fetchTodos() {
  const data = await fetch("https://example.com/todos").then((res) =>
    res.json()
  );
  return z.array(todoSchema).parse(data);
}

export type Todo = z.infer<typeof todoSchema>;

export function TodosList() {
  const {
    data: todos,
    isLoading,
    error,
  } = useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  if (isLoading && !todos) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        <h1>An error occurred</h1>
        <p>{error.message}</p>
      </div>
    );
  }

  const unfinishedTodos: Todo[] = [];
  const finishedTodos: Todo[] = [];

  todos?.forEach((todo) => {
    if (todo.completed) {
      finishedTodos.push(todo);
    } else {
      unfinishedTodos.push(todo);
    }
  });

  return (
    <div>
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold">Tanstack Todos</h1>
        <NewTodo />
        <div className="card flex flex-col gap-4">
          <h3 className="font-semibold text-xl">Unfinished todos</h3>
          {unfinishedTodos?.map((todo) => {
            return <Todo key={todo.id} todo={todo} />;
          })}
        </div>
        <div className="card flex flex-col gap-4">
          <h3 className="font-semibold text-xl">Finished todos</h3>
          {finishedTodos?.map((todo) => {
            return <Todo key={todo.id} todo={todo} />;
          })}
        </div>
      </div>
    </div>
  );
}
