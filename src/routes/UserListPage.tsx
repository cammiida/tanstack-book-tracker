import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchUsers } from "../lib/users";

export default function UserListPage() {
  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  if (!users || isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">All Users</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => {
          const booksRead = user.books.filter(
            (it) => it.status === "read"
          ).length;

          return (
            <Link
              key={user.id}
              to={`/users/${user.id}`}
              className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">{user.name}</h2>
              <p className="text-gray-600 mb-2">{user.email}</p>
              <p className="text-blue-600 font-medium">
                Books read: {booksRead}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
