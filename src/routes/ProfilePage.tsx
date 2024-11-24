import { skipToken, useQuery } from "@tanstack/react-query";
import { BookList } from "../components/BookList";
import FriendsList from "../components/FriendsList";
import { fetchCurrentUser, fetchFriends, fetchUserBooks } from "../lib/users";
import { CURRENT_USER_ID } from "../App";

export default function ProfilePage() {
  const currentUserQuery = useQuery({
    queryKey: ["users", CURRENT_USER_ID],
    queryFn: fetchCurrentUser,
  });

  const userId = currentUserQuery.data?.id;

  const booksQuery = useQuery({
    queryKey: ["books", userId],
    queryFn: userId ? () => fetchUserBooks(userId) : skipToken,
  });

  const friendsQuery = useQuery({
    queryKey: ["users", userId, "friends"],
    queryFn: userId ? () => fetchFriends(userId) : skipToken,
  });

  if (currentUserQuery.isLoading) {
    return <div className="text-center mt-8">Loading user...</div>;
  }

  if (currentUserQuery.error) {
    return (
      <div className="text-center mt-8">
        Error: {currentUserQuery.error?.message}
      </div>
    );
  }

  if (!currentUserQuery.data) {
    return <div className="text-center mt-8">User not found</div>;
  }

  const user = currentUserQuery.data;
  const read = user.books.filter((book) => book.status === "read").length;
  const currentlyReading = user.books.filter(
    (book) => book.status === "reading"
  ).length;
  const wantToRead = user.books.filter(
    (book) => book.status === "want-to-read"
  ).length;

  return (
    <div className="container mx-auto p-4 flex flex-col gap-4">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">{user.name}</h2>
        <p className="text-gray-600 mb-2">Email: {user.email}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-100 p-4 rounded-lg">
            <p className="text-lg font-semibold">{currentlyReading}</p>
            <p className="text-sm text-gray-600">Currently reading</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg">
            <p className="text-lg font-semibold">{read}</p>
            <p className="text-sm text-gray-600">
              Book{read > 1 ? "s" : ""} Read
            </p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg">
            <p className="text-lg font-semibold">{wantToRead}</p>
            <p className="text-sm text-gray-600">Want to read</p>
          </div>
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4">My Books</h2>
        <ul className="space-y-4">
          <BookList booksQuery={booksQuery} />
        </ul>
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4">My Friends</h2>
        <ul className="space-y-4">
          <FriendsList friendsQuery={friendsQuery} />
        </ul>
      </div>
    </div>
  );
}
