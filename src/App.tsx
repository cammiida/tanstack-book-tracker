import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import "./App.css";
import { Todo } from "./components/Todo";
import { todoSchema } from "./schemas";

async function fetchTodos() {
  const data = await fetch("https://example.com/todos").then((res) =>
    res.json()
  );
  return z.array(todoSchema).parse(data);
}

export type Todo = z.infer<typeof todoSchema>;

function App() {
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

  if (!todos) {
    return "No todos, hooray!";
  }

  return (
    <>
      <h1>Tanstack Todos</h1>
      <div className="card">
        {todos.map((todo) => {
          return <Todo key={todo.id} todo={todo} />;
        })}
      </div>
    </>
  );
}

export default App;
