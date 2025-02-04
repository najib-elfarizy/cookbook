import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Recipe } from "@/types";
import RecipeGrid from "../recipes/RecipeGrid";

interface SavedRecipe extends Recipe {
  scheduled_date?: string;
  custom_name?: string;
}

interface SavedRecipesCalendarProps {
  recipes: SavedRecipe[];
  onDateSelect: (date: Date) => void;
  selectedDate?: Date;
}

const SavedRecipesCalendar = ({
  recipes,
  onDateSelect,
  selectedDate,
}: SavedRecipesCalendarProps) => {
  // Group recipes by date
  const recipesByDate = recipes.reduce(
    (acc, recipe) => {
      if (recipe.scheduled_date) {
        const date = format(new Date(recipe.scheduled_date), "yyyy-MM-dd");
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(recipe);
      }
      return acc;
    },
    {} as Record<string, SavedRecipe[]>,
  );

  // Get all dates that have recipes
  const datesWithRecipes = Object.keys(recipesByDate).map(
    (date) => new Date(date),
  );

  // Filter recipes for selected date
  const filteredRecipes = selectedDate
    ? recipes.filter(
        (recipe) =>
          recipe.scheduled_date &&
          format(new Date(recipe.scheduled_date), "yyyy-MM-dd") ===
            format(selectedDate, "yyyy-MM-dd"),
      )
    : recipes;

  return (
    <div className="grid md:grid-cols-[300px_1fr] gap-8">
      <Card>
        <CardContent className="p-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && onDateSelect(date)}
            className="rounded-md"
            modifiers={{
              booked: datesWithRecipes,
            }}
            modifiersStyles={{
              booked: {
                fontWeight: "bold",
                backgroundColor: "hsl(var(--primary) / 0.1)",
                color: "hsl(var(--primary))",
                border: "2px solid hsl(var(--primary))",
                borderRadius: "4px",
                transform: "scale(0.95)",
                transition: "all 0.2s ease",
                position: "relative",
                "&:hover": {
                  backgroundColor: "hsl(var(--primary) / 0.15)",
                  transform: "scale(1)",
                },
              },
            }}
          />
        </CardContent>
      </Card>

      <div className="space-y-4">
        {selectedDate ? (
          <div>
            <h2 className="text-2xl font-bold mb-4">
              Recipes for {format(selectedDate, "MMMM d, yyyy")}
            </h2>
            {filteredRecipes.length > 0 ? (
              <RecipeGrid recipes={filteredRecipes} />
            ) : (
              <p className="text-muted-foreground">
                No recipes scheduled for this date
              </p>
            )}
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-4">All Saved Recipes</h2>
            <RecipeGrid recipes={recipes} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedRecipesCalendar;
