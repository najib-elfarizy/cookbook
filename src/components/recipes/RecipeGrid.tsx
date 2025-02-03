import React from "react";
import RecipeCard from "./RecipeCard";

import { RecipeWithStats } from "@/types/supabase";

interface RecipeGridProps {
  recipes?: RecipeWithStats[];
}

const RecipeGrid = ({ recipes = [] }: RecipeGridProps) => {
  if (!recipes || recipes.length === 0) {
    return (
      <div className="w-full min-h-[842px] bg-gray-50 p-6 flex items-center justify-center">
        <p className="text-gray-500">No recipes found</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[842px] bg-gray-50 p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-[1200px] mx-auto">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            id={recipe.id}
            title={recipe.title}
            image={recipe.image_url}
            prepTime={`${recipe.prep_time} mins`}
            cookTime={`${recipe.cook_time} mins`}
            servings={recipe.servings}
            difficulty={recipe.difficulty}
            likes={recipe.likes}
            saves={recipe.saves}
            comments={recipe.comments}
            user_id={recipe.user_id || "default"}
            username={
              recipe.user?.username ||
              (recipe.user_id ? recipe.user_id.split("-")[0] : "Anonymous")
            }
          />
        ))}
      </div>
    </div>
  );
};

export default RecipeGrid;
