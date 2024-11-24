import { Link } from "react-router-dom";
import { Book } from "../lib/books";

export function BookItem({ book }: { book: Book }) {
  return (
    <li className="bg-white shadow rounded-lg p-4">
      <Link to={`/books/${book.id}`} className="text-blue-600 hover:underline">
        <h3 className="text-xl font-semibold">{book.title}</h3>
      </Link>
      <p className="text-gray-600">{book.author}</p>
      <p className="text-gray-600">{book.published}</p>
    </li>
  );
}
