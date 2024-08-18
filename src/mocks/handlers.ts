import { http, HttpResponse } from "msw";
import { Todo } from "../App";

const todos: Todo[] = [
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
];
