import { useQuery } from "@tanstack/react-query";
import { BookList } from "../components/BookList";
import { fetchBooks } from "../lib/books";

export default function Home() {
  const booksQuery = useQuery({
    queryKey: ["books"],
    queryFn: fetchBooks,
  });

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">All Books</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BookList booksQuery={booksQuery} />
      </div>
    </div>
  );
}
