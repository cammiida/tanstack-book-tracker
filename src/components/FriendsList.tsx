import { UseQueryResult } from "@tanstack/react-query";
import { User } from "../lib/users";
import { Link } from "react-router-dom";

export default function FriendsList({
  friendsQuery,
}: {
  friendsQuery: UseQueryResult<User[]>;
}) {
  const { data: friends, isLoading, error } = friendsQuery;

  if (!friends || isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <ul className="space-y-2">
      {friendsQuery.data?.map((friend) => (
        <li key={friend.id} className="bg-white shadow rounded-lg p-4">
          <Link
            to={`/users/${friend.id}`}
            className="text-blue-600 hover:underline"
          >
            {friend.name}
          </Link>
        </li>
      )) ?? <p>No friends found</p>}
    </ul>
  );
}
