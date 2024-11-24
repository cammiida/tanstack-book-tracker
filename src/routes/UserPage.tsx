import { skipToken, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { BookList } from "../components/BookList";
import FriendsList from "../components/FriendsList";
import { fetchFriends, fetchUser, fetchUserBooks } from "../lib/users";

export default function UserPage() {
  const { userId } = useParams<{ userId: string }>();

  const userQuery = useQuery({
    queryKey: ["users", userId],
    queryFn: userId ? () => fetchUser(userId) : skipToken,
  });

  const booksQuery = useQuery({
    queryKey: ["users", userId, "books"],
    queryFn: userId ? () => fetchUserBooks(userId) : skipToken,
  });

  const friendsQuery = useQuery({
    queryKey: ["users", userId, "friends"],
    queryFn: userId ? () => fetchFriends(userId) : skipToken,
  });

  if (userQuery.isLoading) {
    return <div className="text-center mt-8">Loading user...</div>;
  }

  if (userQuery.error) {
    return (
      <div className="text-center mt-8">
        Error:{" "}
        {userQuery.error?.message ||
          booksQuery.error?.message ||
          friendsQuery.error?.message}
      </div>
    );
  }

  const user = userQuery.data;

  if (!user) {
    return <div className="text-center mt-8">User not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{user.name}'s Profile</h1>
      <p className="text-gray-600 mb-6">{user.email}</p>
      <h2 className="text-2xl font-semibold mb-4">{user.name}'s Books</h2>
      <BookList booksQuery={booksQuery} />
      <h2 className="text-2xl font-semibold mt-8 mb-4">
        {user.name}'s Friends
      </h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <FriendsList friendsQuery={friendsQuery} />
      </ul>
    </div>
  );
}
