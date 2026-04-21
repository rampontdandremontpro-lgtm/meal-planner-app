import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Recipes from "./pages/Recipes";
import RecipeDetail from "./pages/RecipeDetail";
import AddRecipe from "./pages/AddRecipe";
import EditRecipe from "./pages/EditRecipe";
import Planner from "./pages/Planner";
import ShoppingList from "./pages/ShoppingList";
import "./App.css";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Navigate to="/recipes" replace />} />

        <Route path="/recipes" element={<Recipes />} />

        <Route
          path="/recipes/new"
          element={
            <PrivateRoute>
              <AddRecipe />
            </PrivateRoute>
          }
        />

        <Route
          path="/recipes/:id/edit"
          element={
            <PrivateRoute>
              <EditRecipe />
            </PrivateRoute>
          }
        />

        <Route path="/recipes/:source/:id" element={<RecipeDetail />} />

        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/recipes" replace /> : <Login />
          }
        />

        <Route
          path="/register"
          element={
            isAuthenticated ? <Navigate to="/recipes" replace /> : <Register />
          }
        />

        <Route
          path="/planner"
          element={
            <PrivateRoute>
              <Planner />
            </PrivateRoute>
          }
        />

        <Route
          path="/shopping"
          element={
            <PrivateRoute>
              <ShoppingList />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/recipes" replace />} />
      </Routes>
    </>
  );
}

export default App;