import React, { useState, useEffect } from "react";
import RecipeGrid from "../recipes/RecipeGrid";
import { getSavedRecipes } from "@/lib/api";
import { RecipeWithStats } from "@/types/supabase";
import { useAuth } from "@/lib/AuthContext";

const SavedRecipes = () => {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchSavedRecipes = async () => {
      try {
        const data = await getSavedRecipes(user.id);
        setRecipes(data);
      } catch (error) {
        console.error("Error fetching saved recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedRecipes();
  }, [user]);

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
