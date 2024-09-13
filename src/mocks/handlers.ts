import { http, HttpResponse } from "msw";
import { z } from "zod";
import { Todo } from "../components/TodosList";

let todos: Todo[] = [
  {
    id: "1",
    title: "Buy milk",
    completed: false,
  },
  {
    id: "2",
    title: "Take out the trash",
    completed: true,
  },
  {
    id: "3",
    title: "Write an article",
    completed: false,
  },
];

const BASE_URL = "https://example.com";

export const handlers = [
  // Intercept "GET https://example.com/user" requests...
  http.get(`${BASE_URL}/todos`, () => {
    // ...and respond to them using this JSON response.
    return HttpResponse.json(todos);
  }),

  http.put(`${BASE_URL}/todos/:id`, ({ params }) => {
    const { id } = params;

    const existingTodoIdx = todos.findIndex((todo) => todo.id === id);
    if (existingTodoIdx === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    const existingTodo = todos[existingTodoIdx];

    const updatedTodo = { ...existingTodo, completed: !existingTodo.completed };
    todos[existingTodoIdx] = updatedTodo;

    return HttpResponse.json(updatedTodo);
  }),

  http.post(`${BASE_URL}/todos`, async ({ request }) => {
    const { title, description } = z
      .object({ title: z.string(), description: z.string().optional() })
      .parse(await request.json());

    const newTodo: Todo = {
      id: String(todos.length + 1),
      title,
      description,
      completed: false,
    };
    todos = [newTodo, ...todos];

    return HttpResponse.json(todos);
  }),

  http.delete(`${BASE_URL}/todos/:id`, ({ params }) => {
    const { id } = params;

    const existingTodoIdx = todos.findIndex((todo) => todo.id === id);
    if (existingTodoIdx === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    todos = todos.filter((todo) => todo.id !== id);

    return HttpResponse.json(todos);
  }),
];
