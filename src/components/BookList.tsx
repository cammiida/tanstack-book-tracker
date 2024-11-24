import { UseQueryResult } from "@tanstack/react-query";
import { Book } from "../lib/books";
import { BookItem } from "./BookItem";

export function BookList({
  booksQuery,
}: {
  booksQuery: UseQueryResult<Book[]>;
}) {
  const { data: books, isLoading, error } = booksQuery;

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <ul className="space-y-4 flex flex-col">
      {books?.map((book) => <BookItem key={book.id} book={book} />) ?? (
        <p>No books found</p>
      )}
    </ul>
  );
}
