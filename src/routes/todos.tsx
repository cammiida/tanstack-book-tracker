import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { NewTodo } from "../components/NewTodo";
import { TodoDetail } from "../components/Todo";
import { todoSchema } from "../schemas";
import { todoQueries } from "../utils/todoQueries";

export type Todo = z.infer<typeof todoSchema>;

export default function Todos() {
  const { data, isLoading, error } = useQuery({
    ...todoQueries.list(),
    select: (todos) => {
      const unfinishedTodos: Todo[] = [];
      const finishedTodos: Todo[] = [];

      todos?.forEach((todo) => {
        if (todo.completed) {
          finishedTodos.push(todo);
        } else {
          unfinishedTodos.push(todo);
        }
      });

      return { unfinishedTodos, finishedTodos };
    },
  });

  if (isLoading && !data) {
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

  const hasTodos = data?.finishedTodos.length || data?.unfinishedTodos.length;

  return (
    <div>
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold">Tanstack Todos</h1>
        <NewTodo />
        {hasTodos ? <TodoList {...data} /> : <div>No todos found</div>}
      </div>
    </div>
  );
}

type TodoListProps = {
  unfinishedTodos: Todo[];
  finishedTodos: Todo[];
};

function TodoList({ finishedTodos, unfinishedTodos }: TodoListProps) {
  return (
    <>
      <div className="card flex flex-col gap-4">
        <h3 className="font-semibold text-xl">Unfinished todos</h3>
        {unfinishedTodos?.map((todo) => {
          return <TodoDetail key={todo.id} todo={todo} />;
        })}
      </div>
      <div className="card flex flex-col gap-4">
        <h3 className="font-semibold text-xl">Finished todos</h3>
        {finishedTodos?.map((todo) => {
          return <TodoDetail key={todo.id} todo={todo} />;
        })}
      </div>
    </>
  );
}
