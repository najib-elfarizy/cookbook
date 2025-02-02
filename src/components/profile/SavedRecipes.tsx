import React, { useState, useEffect } from "react";
import RecipeGrid from "../recipes/RecipeGrid";
import { getSavedRecipes } from "@/lib/api";

const SavedRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {
        // For now, using a hardcoded user ID for demo
        const userId = "demo-user";
        const data = await getSavedRecipes(userId);
        setRecipes(data);
      } catch (error) {
        console.error("Error fetching saved recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedRecipes();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading saved recipes...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Saved Recipes</h1>
        <RecipeGrid recipes={recipes} />
      </div>
    </div>
  );
};

export default SavedRecipes;
