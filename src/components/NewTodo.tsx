import { useMutation, useQueryClient } from "@tanstack/react-query";
import { newTodoSchema } from "../schemas";
import { Todo } from "./TodosList";
import { useRef } from "react";

type NewTodo = Pick<Todo, "title" | "description">;

async function createTodo(newTodo: NewTodo) {
  // throw new Error("Not implemented");

  const res = await fetch("https://example.com/todos", {
    method: "POST",
    body: JSON.stringify(newTodo),
  });
  return await res.json();
}

export function NewTodo() {
  const formRef = useRef<HTMLFormElement>(null);
  const queryClient = useQueryClient();
  const { mutate, error } = useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["todos"] });
      formRef.current?.reset();
    },
    onError: (error) => {
      console.error(error);
      throw error;
    },
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formElements = form.elements as typeof form.elements & {
      title: HTMLInputElement;
      description: HTMLTextAreaElement;
    };

    const newTodo = newTodoSchema.safeParse({
      title: formElements.title.value,
      description: formElements.description.value,
    });

    if (newTodo.success) {
      mutate(newTodo.data);
    }

    return false;
  }

  return (
    <form ref={formRef} className="flex flex-col gap-1" onSubmit={handleSubmit}>
      <input
        className="px-3 py-1 text-lg font-normal rounded-lg border focus:outline focus:outline-2 focus:outline-offset-2 bg-[#ffffff] text-[#444444] focus:outline-[#aaaaaa] border-[#cccccc]"
        placeholder="Todo title"
        name="title"
      />
      <textarea
        className="px-3 py-1 text-lg font-normal rounded-lg border focus:outline focus:outline-2 focus:outline-offset-2 bg-[#ffffff] text-[#444444] focus:outline-[#aaaaaa] border-[#cccccc]"
        placeholder="Todo description"
        name="description"
      />
      <button
        type="submit"
        className="font-bold w-full rounded-lg text-lg py-1 bg-[#374151] text-[#ffffff] justify-center"
      >
        Create Todo
      </button>
      <small className="text-red-200">{error?.message}</small>
    </form>
  );
}
