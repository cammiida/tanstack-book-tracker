import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./routes/Home";
import Root from "./routes/Root";
import Todos from "./routes/Todos";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { element: <Home />, index: true },
      { path: "/todos", element: <Todos /> },
    ],
  },
]);

function App() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

export default App;
