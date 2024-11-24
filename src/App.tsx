import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import BookPage from "./routes/BookPage";
import Home from "./routes/Home";
import UserListPage from "./routes/UserListPage";
import UserPage from "./routes/UserPage";
import ProfilePage from "./routes/ProfilePage";
import RootLayout from "./routes/layout/RootLayout";

export const CURRENT_USER_ID = "1";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route element={<RootLayout />}>
            <Route index element={<Home />} />
            <Route path="users" element={<UserListPage />} />
            <Route path="users/:userId" element={<UserPage />} />
            <Route path="books/:bookId" element={<BookPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Routes>
      </Router>
      <ReactQueryDevtools initialIsOpen={true} />
    </QueryClientProvider>
  );
}

export default App;
