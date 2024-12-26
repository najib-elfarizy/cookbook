import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import CategoriesGrid from "./components/categories/CategoriesGrid";
import CategoryPage from "./components/categories/CategoryPage";
import RecipeDetail from "./components/recipes/RecipeDetail";
import routes from "tempo-routes";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<CategoriesGrid />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/recipe/:recipeId" element={<RecipeDetail />} />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
