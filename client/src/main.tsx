import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Canvas from "./pages/Canvas.tsx";
import EditorLayout from "./Layouts/EditorLayout.tsx";
import SignUp from "./pages/SignUp.tsx";
import Login from "./pages/Login.tsx";
import { ProtectedRoute } from "./Layouts/protectedRoute.tsx";
import MyProjects from "./pages/DashBoard/MyProjects.tsx";
import DashboardLayout from "./Layouts/DashboardLayout.tsx";
import Home from "./pages/DashBoard/Home.tsx";
import CollaborativeProjects from "./pages/DashBoard/CollabrativeProjects.tsx";
import Landing from "./components/Landing.tsx";
import CanvasRoute from "./Layouts/CanvasRoute.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing></Landing>,
  },
  {
    path: "/landscape/:projectId",
    element: (
      <ProtectedRoute>
        <CanvasRoute><EditorLayout></EditorLayout></CanvasRoute>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Canvas></Canvas>,
      },
    ],
  },
  {
    path: "/signup",
    element: <SignUp></SignUp>,
  },
  {
    path: "/login",
    element: <Login></Login>,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Home /> },
      {
        path: "myprojects",
        element: <MyProjects />,
      },
      {
        path: "shared",
        element: <CollaborativeProjects/>
      }
    ],
  }

]);

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
