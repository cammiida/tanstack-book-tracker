import { z } from "zod";
import { User, UserBook } from "./users";

export const bookSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  author: z.string(),
  published: z.number(),
});
export type Book = z.infer<typeof bookSchema>;

export type BookReader = {
  bookId: Book["id"];
  title: Book["title"];
  author: Book["author"];
  published: Book["published"];
  userId: User["id"];
  userName: User["name"];
  status: UserBook["status"];
  rating?: UserBook["rating"];
  comment?: UserBook["comment"];
};

export async function fetchBooks(): Promise<Book[]> {
  const response = await fetch("/api/books");
  return await response.json();
}

export async function fetchBook(id: string): Promise<Book> {
  const response = await fetch(`/api/books/${id}`);
  return await response.json();
}

export async function deleteBook(id: string): Promise<void> {
  await fetch(`/api/books/${id}`, { method: "DELETE" });
}

export async function updateBook({
  id,
  updatedBook,
}: {
  id: string;
  updatedBook: Partial<Book>;
}): Promise<Book> {
  const response = await fetch(`/api/books/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedBook),
  });

  return await response.json();
}

export async function fetchBookReaders(id: string): Promise<BookReader[]> {
  const response = await fetch(`/api/books/${id}/readers`);
  return await response.json();
}
