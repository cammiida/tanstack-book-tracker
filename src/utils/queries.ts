import { z } from "zod";
import { todoSchema } from "../schemas";

export async function fetchTodos() {
  const data = await fetch("https://example.com/todos").then((res) =>
    res.json()
  );
  return z.array(todoSchema).parse(data);
}
