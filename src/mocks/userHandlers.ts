import { http, HttpHandler, HttpResponse } from "msw";
import { books } from "./bookHandlers";
import { User } from "../lib/users";

export const userHandlers: HttpHandler[] = [
  // get all users
  http.get("/api/users", () => {
    return HttpResponse.json(users);
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
  http.get("/api/users/:id/books", (req) => {
    console.log("req", req);

    const { id } = req.params;

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

    console.log("userBooks", userBooks);

    return HttpResponse.json(userBooks);
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
