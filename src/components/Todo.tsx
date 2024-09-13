import { useMutation, useQueryClient } from "@tanstack/react-query";
import { todoSchema } from "../schemas";
import type { Todo } from "./TodosList";

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
    <div
      key={todo.id}
      className="grid grid-cols-[5%_95%] cursor-pointer"
      onClick={() => mutate()}
    >
      <input type="checkbox" defaultChecked={todo.completed} className="" />
      <h2 className="font-semibold text-lg">{todo.title}</h2>
      {todo.description && <p className="col-start-2">{todo.description}</p>}
      {isError && (
        <small className="col-start-2 text-red-500">
          Failed to toggle todo
        </small>
      )}
    </div>
  );
}
