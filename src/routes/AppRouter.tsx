import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type  { RootState } from "@/store/store";
import Login from "@/features/auth/Login";
import Register from "@/features/auth/Register";
import HomePage from "@/pages/HomePage";

// Komponen untuk memproteksi halaman (Hanya bisa diakses jika sudah login)
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/login" />,
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};