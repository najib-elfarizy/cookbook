import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Grid3X3 } from "lucide-react";
import RecipeGrid from "../recipes/RecipeGrid";
import SavedRecipesCalendar from "./SavedRecipesCalendar";
import { getSavedRecipes } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";

const SavedRecipes = () => {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "calendar">("grid");
  const [selectedDate, setSelectedDate] = useState<Date>();

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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Saved Recipes</h1>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "calendar" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("calendar")}
            >
              <Calendar className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {viewMode === "grid" ? (
          <RecipeGrid recipes={recipes} />
        ) : (
          <SavedRecipesCalendar
            recipes={recipes}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        )}
      </div>
    </div>
  );
};

export default SavedRecipes;
