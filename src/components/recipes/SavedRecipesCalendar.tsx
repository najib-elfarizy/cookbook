import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Recipe } from "@/types";

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
                backgroundColor: "var(--primary)",
                color: "white",
              },
            }}
          />
        </CardContent>
      </Card>

      <div className="space-y-4">
        {selectedDate && (
          <div>
            <h2 className="text-2xl font-bold mb-4">
              Recipes for {format(selectedDate, "MMMM d, yyyy")}
            </h2>
            {recipesByDate[format(selectedDate, "yyyy-MM-dd")]?.map(
              (recipe) => (
                <Card key={recipe.id} className="mb-4">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={recipe.image_url}
                        alt={recipe.title}
                        className="w-24 h-24 object-cover rounded-md"
                      />
                      <div>
                        <h3 className="font-semibold">
                          {recipe.custom_name || recipe.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {recipe.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ),
            ) || (
              <p className="text-muted-foreground">
                No recipes scheduled for this date
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedRecipesCalendar;
