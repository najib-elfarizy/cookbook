import { Suspense, lazy } from "react";
import { Routes, Route, BrowserRouter, useRoutes } from "react-router-dom";
import RequireAuth from "./components/RequireAuth";
const Home = lazy(() => import("./components/home"));
const AuthPage = lazy(() => import("./pages/auth"));
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
              <Route path="/auth" element={<AuthPage />} />
              <Route
                path="/create"
                element={
                  <RequireAuth>
                    <CreateRecipe />
                  </RequireAuth>
                }
              />
              <Route
                path="/saved"
                element={
                  <RequireAuth>
                    <SavedRecipes />
                  </RequireAuth>
                }
              />
              <Route
                path="/profile"
                element={
                  <RequireAuth>
                    <UserProfile />
                  </RequireAuth>
                }
              />
              <Route path="/user/:userId" element={<UserDetailPage />} />
              <Route
                path="/settings"
                element={
                  <RequireAuth>
                    <SettingsPage />
                  </RequireAuth>
                }
              />
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
