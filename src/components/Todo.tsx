import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Todo } from "../App";
import { todoSchema } from "../schemas";

async function toggleTodo(id: string) {
  const data = await fetch(`https://example.com/todos/${id}`, {
    method: "PUT",
  }).then((res) => res.json());
  return todoSchema.parse(data);
}

export function Todo({ todo }: { todo: Todo }) {
  const queryClient = useQueryClient();
  const { mutate, isError } = useMutation({
    mutationKey: ["toggleTodo", todo.id],
    mutationFn: async () => toggleTodo(todo.id),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["todos"] });
    },
  });

  return (
    <div key={todo.id} className="todo" onClick={() => mutate()}>
      <input type="checkbox" checked={todo.completed} />
      <div>
        <h2>{todo.title}</h2>
        {todo.description && <p>{todo.description}</p>}
      </div>
      {isError && (
        <small className=" text-red-500">Failed to toggle todo</small>
      )}
    </div>
  );
}
