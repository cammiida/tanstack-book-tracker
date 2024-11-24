import { http, HttpHandler, HttpResponse } from "msw";

import { Book, BookReader, bookSchema } from "../lib/books";
import { users } from "./userHandlers";

export const bookHandlers: HttpHandler[] = [
  // Get all books
  http.get("/api/books", ({ request }) => {
    const url = new URL(request.url);
    const searchQuery = url.searchParams.get("searchQuery");

    const filteredBooks = searchQuery
      ? books.filter(
          (book) =>
            book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : books;

    return HttpResponse.json(filteredBooks);
  }),

  // Get a single book
  http.get("/api/books/:id", ({ params }) => {
    const { id } = params;

    const book = books.find((book) => book.id === id);
    if (!book) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(book);
  }),

  // Get book readers
  http.get("/api/books/:id/readers", ({ params }) => {
    const { id } = params;

    const bookReaders: BookReader[] = users
      .map((user) => {
        const userBook = user.books.find((userBook) => userBook.bookId === id);
        const book = books.find((book) => book.id === id);
        if (!userBook || !book) {
          return null;
        }

        return {
          bookId: book.id,
          title: book.title,
          author: book.author,
          published: book.published,
          userId: user.id,
          userName: user.name,
          status: userBook.status,
          rating: userBook.rating,
          comment: userBook.comment,
        };
      })
      .filter((it) => it !== null);

    return HttpResponse.json(bookReaders);
  }),

  // Add a new book
  http.post("/api/books", async ({ request }) => {
    const data = await request.json();
    const newBook = bookSchema.safeParse(data);

    if (!newBook.success) {
      return HttpResponse.json(newBook.error, { status: 400 });
    }

    books = [...books, newBook.data];
  }),

  // Update a book
  http.put("/api/books/:id", async ({ params, request }) => {
    const { id } = params;
    const data = await request.json();

    const parsedBody = bookSchema.partial().safeParse(data);

    if (!parsedBody.success) {
      return HttpResponse.json(parsedBody.error, { status: 400 });
    }

    const existingBookIdx = books.findIndex((book) => book.id === id);
    if (existingBookIdx === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    const existingBook = books[existingBookIdx];
    const updatedBook = { ...existingBook, ...parsedBody.data };

    books[existingBookIdx] = updatedBook;

    return HttpResponse.json(updatedBook);
  }),

  // Delete a book
  http.delete("/api/books/:id", ({ params }) => {
    const { id } = params;

    const existingBookIdx = books.findIndex((book) => book.id === id);
    if (existingBookIdx === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    books = books.filter((book) => book.id !== id);

    return HttpResponse.json(books);
  }),
];

export let books: Book[] = [
  {
    id: "1",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    published: 1937,
    description:
      "In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole, filled with the ends of worms and an oozy smell, nor yet a dry, bare, sandy hole with nothing in it to sit down on or to eat: it was a hobbit-hole, and that means comfort. Written for J.R.R. Tolkien’s own children, The Hobbit met with instant critical acclaim when it was first published in 1937. Now recognized as a timeless classic, this introduction to the hobbit Bilbo Baggins, the wizard Gandalf, Gollum, and the spectacular world of Middle-earth recounts of the adventures of a reluctant hero, a powerful and dangerous ring, and the cruel dragon Smaug the Magnificent. The text in this 372-page paperback edition is based on that first published in Great Britain by Collins Modern Classics (1998), and includes a note on the text by Douglas A. Anderson (2001).",
  },
  {
    id: "2",
    title: "The Lord of the Rings",
    author: "J.R.R. Tolkien",
    published: 1954,
    description:
      "One Ring to rule them all, One Ring to find them, One Ring to bring them all and in the darkness bind them. In ancient times the Rings of Power were crafted by the Elven-smiths, and Sauron, the Dark Lord, forged the One Ring, filling it with his own power so that he could rule all others. But the One Ring was taken from him, and though he sought it throughout Middle-earth, it remained lost to him. After many ages it fell by chance into the hands of the hobbit Bilbo Baggins. From Sauron's fastness in the Dark Tower of Mordor, his power spread far and wide. Sauron gathered all the Great Rings to him, but always he searched for the One Ring that would complete his dominion. When Bilbo reached his eleventy-first birthday he disappeared, bequeathing to his young cousin Frodo the Ruling Ring and a perilous quest: to journey across Middle-earth, deep into the shadow of the Dark Lord, and destroy the Ring by casting it into the Cracks of Doom. The Lord of the Rings tells of the great quest undertaken by Frodo and the Fellowship of the Ring: Gandalf the Wizard; the hobbits Merry, Pippin, and Sam; Gimli the Dwarf; Legolas the Elf; Boromir of Gondor; and a tall, mysterious stranger called Strider.",
  },
  {
    id: "3",
    title: "The Silmarillion",
    author: "J.R.R. Tolkien",
    published: 1977,
    description:
      "The Silmarillion is a collection of mythopoeic works by English writer J. R. R. Tolkien.",
  },
  {
    id: "4",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    published: 1925,
    description:
      "The story of the mysteriously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.",
  },
  {
    id: "5",
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    published: 1951,
    description:
      "The novel details two days in the life of 16-year-old Holden Caulfield after he has been expelled from prep school.",
  },
  {
    id: "6",
    title: "1984",
    author: "George Orwell",
    published: 1949,
    description: "A dystopian social science fiction novel.",
  },
  {
    id: "7",
    title: "Animal Farm",
    author: "George Orwell",
    published: 1945,
    description:
      "An allegorical novella reflecting events leading up to the Russian Revolution of 1917.",
  },
  {
    id: "8",
    title: "Never let me go",
    author: "Kazuo Ishiguro",
    published: 2005,
    description: "A dystopian science fiction novel.",
  },
  {
    id: "9",
    title: "My brilliant friend",
    author: "Elena Ferrante",
    published: 2011,
    description:
      "A modern masterpiece from one of Italy’s most acclaimed authors, My Brilliant Friend is a rich, intense and generous-hearted story about two friends, Elena and Lila. Ferrante’s inimitable style lends itself perfectly to a meticulous portrait of these two women that is also the story of a nation and a touching meditation on the nature of friendship. Through the lives of these two women, Ferrante tells the story of a neighbourhood, a city and a country as it is transformed in ways that, in turn, also transform the relationship between her two protagonists.",
  },
  {
    id: "10",
    title: "The Known World",
    author: "Edward P. Jones",
    published: 2003,
    description:
      "A historical novel about a black slave owner in the antebellum South.",
  },
];
