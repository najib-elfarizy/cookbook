import React from "react";
import { useParams } from "react-router-dom";
import SearchSection from "../recipes/SearchSection";
import RecipeGrid from "../recipes/RecipeGrid";
import { useEffect, useState } from "react";
import { getRecipesByCategory } from "@/lib/api";

import { RecipeWithStats } from "@/types/supabase";

const CategoryPage = () => {
  const { slug } = useParams();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      if (!slug) return;
      try {
        const data = await getRecipesByCategory(slug);
        setRecipes(data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading recipes...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="flex flex-col min-h-screen">
        <SearchSection />
        <div className="flex-1">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold mb-6 capitalize">
              {slug} Recipes
            </h1>
            <RecipeGrid recipes={recipes} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CategoryPage;
