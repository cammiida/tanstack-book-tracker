import { useQuery } from "@tanstack/react-query";
import "./App.css";
import { z } from "zod";

export const todoSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  completed: z.boolean(),
});

export type Todo = z.infer<typeof todoSchema>;

function App() {
  const {
    data: todos,
    isLoading,
    error,
  } = useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: async () => {
      const data = await fetch("https://example.com/todos").then((res) =>
        res.json()
      );
      return z.array(todoSchema).parse(data);
    },
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
          return (
            <div key={todo.id} className="todo">
              <input type="checkbox" checked={todo.completed} />
              <div>
                <h2>{todo.title}</h2>
                {todo.description && <p>{todo.description}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default App;
