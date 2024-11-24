import { UseQueryResult } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Book } from "../lib/books";
import { UserBook, UserBookStatus } from "../lib/users";

export function BookList({
  booksQuery,
}: {
  booksQuery: UseQueryResult<(Book & Partial<UserBook>)[]>;
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
      {books?.map((book) => (
        <li className="bg-white shadow rounded-lg p-4">
          <Link to={`/books/${book.id}`} className="flex align-center gap-2">
            <h3 className="text-xl font-semibold text-blue-600 hover:underline">
              {book.title}
            </h3>
            {book.status && <Badge status={book.status} />}
          </Link>
          <p className="text-gray-600">{book.author}</p>
          <p className="text-gray-600">{book.published}</p>
        </li>
      )) ?? <p>No books found</p>}
    </ul>
  );
}

function Badge({ status }: { status: UserBookStatus }) {
  const colors = {
    "want-to-read": "yellow",
    reading: "blue",
    read: "green",
  };

  return (
    <div>
      <span
        className={`bg-${colors[status]}-100 text-${colors[status]}-800 px-2 py-1 rounded-full text-xs`}
      >
        {status
          .replace(/-/g, " ")
          .split(" ")
          .map((word) => word[0].toUpperCase() + word.slice(1))
          .join(" ")}
      </span>
    </div>
  );
}
