// import logo from "./logo.svg";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/login";
import Home from "./pages/home";
import Register from "./pages/register";
import ProtectedRoute from "./components/ProtectedRoutes";
import RouterWrapper from "./components/RouteWrapper";
import { AuthProvider } from "./context/AuthContext";

const def_route = createBrowserRouter([
  {
    path: "/",
    element: <RouterWrapper />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register/> },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={def_route}>
        <div className="App"></div>
      </RouterProvider>
    </AuthProvider>
  );
}

export default App;
