import { http, HttpHandler, HttpResponse } from "msw";
import { books } from "./bookHandlers";
import { User, USER_BOOK_STATUSES, UserBook } from "../lib/users";
import { z } from "zod";

export const userHandlers: HttpHandler[] = [
  // get all users
  http.get("/api/users", () => {
    return HttpResponse.json(users);
  }),

  // get current user
  http.get("/api/me", () => {
    return HttpResponse.json(users[0]);
  }),

  // get a specific user
  http.get("/api/users/:id", (req) => {
    const { id } = req.params;

    const user = users.find((user) => user.id === id);
    if (!user) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(user);
  }),

  // get all books for a specific user
  http.get("/api/users/:id/books", ({ params }) => {
    const { id } = params;

    const user = users.find((user) => user.id === id);
    if (!user) {
      return new HttpResponse(null, { status: 404 });
    }

    const userBooks =
      user.books
        ?.map((userBook) => {
          const book = books.find((book) => book.id === userBook.bookId);
          if (!book) {
            return null;
          }

          return { ...userBook, ...book };
        })
        .filter((it) => it != null) ?? [];

    return HttpResponse.json(userBooks);
  }),

  // update book status for a specific user
  http.put("/api/users/:id/books/:bookId", async ({ params, request }) => {
    const { id, bookId } = params;
    const body = await request.json();
    console.log(body);

    const parsedBody = z
      .object({ status: z.enum(USER_BOOK_STATUSES) })
      .safeParse(body);

    console.log(parsedBody);

    if (!parsedBody.success) {
      return new HttpResponse(null, { status: 400 });
    }

    const { status } = parsedBody.data;

    const user = users.find((user) => user.id === id);
    if (!user) {
      return new HttpResponse(null, { status: 404 });
    }

    const existingUserBookId = user.books.findIndex(
      (it) => it.bookId === bookId
    );

    if (existingUserBookId === -1) {
      const newUserBook: UserBook = { bookId: String(bookId), status };
      user.books.push(newUserBook);

      return HttpResponse.json(newUserBook, { status: 201 });
    }

    const updatedUserBook = { ...user.books[existingUserBookId], status };
    user.books[existingUserBookId] = updatedUserBook;

    return HttpResponse.json(updatedUserBook, { status: 200 });
  }),

  // get all friends for a specific user
  http.get("/api/users/:id/friends", (req) => {
    const { id } = req.params;

    const user = users.find((user) => user.id === id);
    if (!user) {
      return new HttpResponse(null, { status: 404 });
    }

    const friends = users.filter((user) =>
      user.friends.includes(id.toString())
    );

    return HttpResponse.json(friends);
  }),
];

export const users: User[] = [
  {
    id: "1",
    name: "Alice",
    age: 25,
    email: "aliceName@gmail.com",
    books: [
      { bookId: "1", status: "read", rating: 5, comment: "Great book!" },
      { bookId: "2", status: "reading" },
      { bookId: "3", status: "want-to-read" },
    ],
    friends: ["2", "3"],
  },
  {
    id: "2",
    name: "Bob",
    age: 30,
    email: "bobbybob@hotmail.com",
    books: [
      { bookId: "4", status: "read", rating: 5, comment: "Great book!" },
      { bookId: "5", status: "reading" },
      { bookId: "6", status: "want-to-read" },
    ],
    friends: ["1", "3"],
  },
  {
    id: "3",
    name: "Charlie",
    age: 35,
    email: "charliemcmillan@outlook.com",
    books: [
      { bookId: "7", status: "read", rating: 5, comment: "Great book!" },
      { bookId: "8", status: "read", rating: 4, comment: "Good book!" },
      { bookId: "9", status: "want-to-read" },
    ],
    friends: ["1", "2"],
  },
  {
    id: "4",
    name: "David",
    age: 18,
    email: "david.strauss@gmail.com",
    books: [
      { bookId: "3", status: "read", rating: 5, comment: "Great book!" },
      { bookId: "4", status: "read", rating: 4, comment: "Good book!" },
      { bookId: "9", status: "reading" },
      { bookId: "10", status: "read", rating: 2, comment: "Bad book!" },
    ],
    friends: ["5"],
  },
  {
    id: "5",
    name: "Eve",
    age: 22,
    email: "evesmith@gmail.com",
    books: [
      { bookId: "1", status: "read", rating: 4, comment: "Good book!" },
      { bookId: "2", status: "read", rating: 3, comment: "Ok book!" },
      { bookId: "3", status: "read", rating: 5, comment: "Great book!" },
      { bookId: "4", status: "read", rating: 2, comment: "Bad book!" },
      { bookId: "5", status: "read", rating: 1, comment: "Terrible book!" },
      { bookId: "6", status: "read", rating: 5, comment: "Great book!" },
      { bookId: "7", status: "read", rating: 4, comment: "Good book!" },
      { bookId: "8", status: "read", rating: 3, comment: "Ok book!" },
      { bookId: "9", status: "read", rating: 2, comment: "Bad book!" },
      { bookId: "10", status: "read", rating: 1, comment: "Terrible book!" },
    ],
    friends: ["4"],
  },
];
