import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";

export default function Root() {
  return (
    <div className="flex w-screen">
      <Navbar />
      <div className="w-full max-w-5xl min-w-min min-h-screen mx-auto p-10">
        <Outlet />
      </div>
    </div>
  );
}
