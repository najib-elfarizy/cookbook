import { Suspense } from "react";
import { Routes, Route, BrowserRouter, useRoutes } from "react-router-dom";
import Home from "./components/home";
import CategoriesGrid from "./components/categories/CategoriesGrid";
import CategoryPage from "./components/categories/CategoryPage";
import RecipeDetail from "./components/recipes/RecipeDetail";
import Layout from "./components/layout/Layout";
import SavedRecipes from "./components/profile/SavedRecipes";
import UserProfile from "./components/profile/UserProfile";
import UserDetailPage from "./components/profile/UserDetailPage";
import CreateRecipe from "./components/recipes/CreateRecipe";
import SettingsPage from "./components/profile/SettingsPage";
import routes from "tempo-routes";

import AuthProvider from "./lib/AuthContext";

// Separate component to handle Tempo routes
function TempoRoutes() {
  const tempoElement = useRoutes(routes);
  return tempoElement;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<p>Loading...</p>}>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/categories" element={<CategoriesGrid />} />
              <Route path="/category/:slug" element={<CategoryPage />} />
              <Route path="/recipe/:recipeId" element={<RecipeDetail />} />
              <Route path="/create" element={<CreateRecipe />} />
              <Route path="/saved" element={<SavedRecipes />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/user/:userId" element={<UserDetailPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              {import.meta.env.VITE_TEMPO === "true" && (
                <Route path="/tempobook/*" element={<TempoRoutes />} />
              )}
            </Routes>
          </Layout>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
