import { useQuery } from "@tanstack/react-query";
import { BookList } from "../components/BookList";
import { fetchBooks } from "../lib/books";
import { useState } from "react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  const booksQuery = useQuery({
    queryKey: ["books", searchQuery],
    queryFn: () => fetchBooks(searchQuery),
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("submit");
    setSearchQuery(e.currentTarget.searchQuery.value);
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">All Books</h2>
      <form className="flex justify-end mb-4 gap-2" onSubmit={handleSubmit}>
        <input
          type="text"
          name="searchQuery"
          placeholder="Search books"
          className="w-full p-2"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Search
        </button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BookList booksQuery={booksQuery} />
      </div>
    </div>
  );
}
