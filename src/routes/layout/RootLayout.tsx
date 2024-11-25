import { Link, Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-4">
        <Outlet />
      </div>
    </div>
  );
}

function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          Book Tracker
        </Link>
        <div>
          <Link to="/" className="mr-4">
            All books
          </Link>
          <Link to="/users" className="mr-4">
            All Users
          </Link>
          <Link to="/profile">My Profile</Link>
        </div>
      </div>
    </nav>
  );
}
