import { useMutation, useQueryClient } from "@tanstack/react-query";
import { todoQueries, toggleTodo } from "../utils/todoQueries";
import { Todo } from "../routes/Todos";

export function TodoDetail({ todo }: { todo: Todo }) {
  const queryClient = useQueryClient();

  const { mutate, isError } = useMutation({
    mutationFn: async () => toggleTodo(todo.id),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: todoQueries.all() });
    },
  });

  const inputId = `todo-${todo.id}`;

  return (
    <div
      key={todo.id}
      className="grid grid-cols-[5%_95%] "
      onClick={() => mutate()}
    >
      <input
        id={inputId}
        type="checkbox"
        defaultChecked={todo.completed}
        className="cursor-pointer"
      />
      <label htmlFor={inputId} className="font-semibold text-lg cursor-pointer">
        {todo.title}
      </label>
      {todo.description && <p className="col-start-2">{todo.description}</p>}
      {isError && (
        <small className="col-start-2 text-red-500">
          Failed to toggle todo
        </small>
      )}
    </div>
  );
}
