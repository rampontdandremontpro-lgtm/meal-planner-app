import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Recipes from "./pages/Recipes";
import RecipeDetail from "./pages/RecipeDetail";
import AddRecipe from "./pages/AddRecipe";
import Planner from "./pages/Planner";
import ShoppingList from "./pages/ShoppingList";
import "./App.css";

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (isAuthenticated) {
    return <Navigate to="/recipes" replace />;
  }

  return children;
}

function ProtectedLayout({ children }) {
  return (
    <PrivateRoute>
      <Navbar />
      {children}
    </PrivateRoute>
  );
}

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      <Route path="/" element={<Navigate to="/recipes" replace />} />

      <Route
        path="/recipes"
        element={
          <ProtectedLayout>
            <Recipes />
          </ProtectedLayout>
        }
      />

      <Route
        path="/recipes/new"
        element={
          <ProtectedLayout>
            <AddRecipe />
          </ProtectedLayout>
        }
      />

      <Route
        path="/recipes/:id"
        element={
          <ProtectedLayout>
            <RecipeDetail />
          </ProtectedLayout>
        }
      />

      <Route
        path="/planner"
        element={
          <ProtectedLayout>
            <Planner />
          </ProtectedLayout>
        }
      />

      <Route
        path="/shopping"
        element={
          <ProtectedLayout>
            <ShoppingList />
          </ProtectedLayout>
        }
      />

      <Route path="*" element={<Navigate to="/recipes" replace />} />
    </Routes>
  );
}

export default App;