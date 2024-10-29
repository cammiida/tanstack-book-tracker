import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";
import { todoSchema } from "../schemas";

export const todoQueries = {
  all: () => ["todos"],
  list: () =>
    queryOptions({
      queryKey: [...todoQueries.all()],
      queryFn: fetchTodos,
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
    }),
  detail: (id: number) =>
    queryOptions({
      queryKey: [...todoQueries.all(), "detail", id],
      queryFn: () => fetchTodo(id),
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
    }),
};

export const BASE_URL = "https://example.com";

export async function fetchTodo(id: number) {
  const data = await fetch(`${BASE_URL}/todos/${id}`).then((res) => res.json());

  return todoSchema.parse(data);
}

export async function fetchTodos() {
  const data = await fetch(`${BASE_URL}/todos`).then((res) => res.json());
  return z.array(todoSchema).parse(data);
}

export async function toggleTodo(id: string) {
  const data = await fetch(`${BASE_URL}/todos/${id}`, {
    method: "PUT",
  }).then((res) => res.json());
  return todoSchema.parse(data);
}
