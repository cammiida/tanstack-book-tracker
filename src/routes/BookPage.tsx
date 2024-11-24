import { StarIcon as Star } from "@navikt/aksel-icons";
import {
  skipToken,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { CURRENT_USER_ID } from "../App";
import { BookReader, fetchBook, fetchBookReaders } from "../lib/books";
import {
  fetchCurrentUser,
  updateUserBookStatus,
  USER_BOOK_STATUSES,
  UserBookStatus,
} from "../lib/users";

export default function BookPage() {
  const { bookId } = useParams<{ bookId: string }>();

  const bookQuery = useQuery({
    queryKey: ["books", bookId],
    queryFn: bookId ? () => fetchBook(bookId) : skipToken,
  });

  const readersQuery = useQuery({
    queryKey: ["books", "readers", bookId],
    queryFn: bookId ? () => fetchBookReaders(bookId) : skipToken,
  });

  if (bookQuery.isLoading) {
    return <div className="text-center mt-8">Loading book details...</div>;
  }

  if (readersQuery.isLoading) {
    return <div className="text-center mt-8">Loading readers...</div>;
  }

  const book = bookQuery.data;
  const readers = readersQuery.data;

  const getReadersByStatus = (status: BookReader["status"]) =>
    readers?.filter((reader) => reader.status === status) ?? [];

  const ratings = (readers?.map((reader) => reader.rating) ?? []).filter(
    (it) => it != null
  );

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex flex-col gap-2">
        <div className="flex gap-4">
          <h1 className="text-3xl font-bold">{book?.title}</h1>
          {book && <BookStatusSelector bookId={book.id} />}
        </div>
        <BookRating ratings={ratings} />
      </div>
      <p className="text-xl text-gray-600 mb-4">by {book?.author}</p>
      <p className="mb-6">{book?.description}</p>

      <div className="grid md:grid-cols-3 gap-6">
        {USER_BOOK_STATUSES.map((status) => (
          <div key={status} className="bg-white shadow rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4 capitalize">{status}</h2>
            <ul className="space-y-2">
              {getReadersByStatus(status).map((reader) => (
                <li key={reader.userId} className="border-b pb-2">
                  <Link
                    to={`/users/${reader.userId}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {reader.userName}
                  </Link>
                  {reader.rating && (
                    <span className="ml-2">Rating: {reader.rating}/5</span>
                  )}
                  {reader.comment && (
                    <p className="text-sm text-gray-600 mt-1">
                      {reader.comment}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function BookStatusSelector({ bookId }: { bookId: string }) {
  const queryClient = useQueryClient();

  const { data: currentUser } = useQuery({
    queryKey: ["user", CURRENT_USER_ID],
    queryFn: fetchCurrentUser,
    select: (data) => data?.books.find((book) => book.bookId === bookId),
  });

  const { mutate: updateCurrentUserBookStatus } = useMutation({
    mutationFn: async (newStatus: UserBookStatus) => {
      // Do the update
      const updatedBook = await updateUserBookStatus({
        userId: CURRENT_USER_ID,
        bookId,
        status: newStatus,
      });

      console.log(updatedBook);

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["users", CURRENT_USER_ID] });
    },
  });

  const bookStatus = currentUser?.status;

  return (
    <div>
      <select
        id="countries"
        value={bookStatus}
        onChange={(e) => {
          updateCurrentUserBookStatus(e.target.value as UserBookStatus);
        }}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        <option>No status</option>
        {USER_BOOK_STATUSES.map((status) => (
          <option selected={bookStatus === status} value={status} key={status}>
            {status
              .replace(/([A-Z])/g, " $1")
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </option>
        ))}
      </select>
    </div>
  );
}

function BookRating({ ratings }: { ratings: number[] }) {
  const rating: number =
    ratings.length === 0
      ? 0
      : ratings.reduce<number>((prev, current) => prev + current, 0) /
        ratings.length;

  const fullStars = Math.floor(rating);

  const partialStar = rating % 1;
  const emptyStars = 5 - Math.ceil(rating);

  return (
    <>
      <div
        className="flex items-center space-x-1"
        aria-label={`Rating: ${rating} out of 5 stars`}
      >
        {[...Array(fullStars)].map((_, i) => (
          <Star
            key={`full-${i}`}
            className="w-6 h-6 fill-yellow-400 text-yellow-400"
          />
        ))}
        {partialStar > 0 && (
          <div className="relative">
            <Star className="w-6 h-6 text-gray-300" />
            <div
              className="absolute top-0 left-0 overflow-hidden"
              style={{ width: `${partialStar * 100}%` }}
            >
              <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="w-6 h-6 text-gray-300" />
        ))}
        <span className="ml-2 text-sm text-gray-600">
          ({rating.toFixed(1)})
        </span>
      </div>
      <small>{ratings.length} ratings</small>
    </>
  );
}
