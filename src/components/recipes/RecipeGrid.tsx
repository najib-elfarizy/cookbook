import React from "react";
import RecipeCard from "./RecipeCard";
import SocialRecipeCard from "./SocialRecipeCard";

interface Recipe {
  id: string;
  title: string;
  image: string;
  prepTime: string;
  servings: number;
  rating: number;
  difficulty: "Easy" | "Medium" | "Hard";
  isSaved: boolean;
}

interface SocialRecipe {
  id: string;
  username: string;
  userAvatar: string;
  title: string;
  image: string;
  likes: number;
  timePosted: string;
  description: string;
  cookTime: string;
  servings: number;
  difficulty: string;
  isLiked: boolean;
  isSaved: boolean;
}

interface RecipeGridProps {
  recipes?: Recipe[];
  socialRecipes?: SocialRecipe[];
}

const defaultRecipes: Recipe[] = [
  {
    id: "1",
    title: "Classic Margherita Pizza",
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3",
    prepTime: "45 mins",
    servings: 4,
    rating: 4.8,
    difficulty: "Medium",
    isSaved: false,
  },
  {
    id: "2",
    title: "Grilled Salmon with Asparagus",
    image: "https://images.unsplash.com/photo-1567121938596-cf8d2c872397",
    prepTime: "30 mins",
    servings: 2,
    rating: 4.5,
    difficulty: "Easy",
    isSaved: true,
  },
];

const defaultSocialRecipes: SocialRecipe[] = [
  {
    id: "s1",
    username: "ChefJohn",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    title: "Homemade Pizza Masterpiece",
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3",
    likes: 234,
    timePosted: "2h ago",
    description:
      "Finally perfected my pizza dough recipe! The secret is letting it rest for 24 hours. 🍕✨ #homemade #cooking #foodie",
    cookTime: "1.5 hours",
    servings: 4,
    difficulty: "Medium",
    isLiked: false,
    isSaved: false,
  },
  {
    id: "s2",
    username: "SarahBakes",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    title: "Perfect Chocolate Cake",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
    likes: 456,
    timePosted: "5h ago",
    description:
      "The richest chocolate cake you'll ever taste! 🍫✨ #baking #dessert #chocolate",
    cookTime: "2 hours",
    servings: 8,
    difficulty: "Medium",
    isLiked: true,
    isSaved: true,
  },
];

const RecipeGrid = ({
  recipes = defaultRecipes,
  socialRecipes = defaultSocialRecipes,
}: RecipeGridProps) => {
  return (
    <div className="w-full min-h-[842px] bg-gray-50 p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-[1200px] mx-auto">
        {/* Regular recipes removed */}
        {socialRecipes.map((recipe) => (
          <SocialRecipeCard
            key={recipe.id}
            username={recipe.username}
            userAvatar={recipe.userAvatar}
            title={recipe.title}
            image={recipe.image}
            likes={recipe.likes}
            timePosted={recipe.timePosted}
            description={recipe.description}
            cookTime={recipe.cookTime}
            servings={recipe.servings}
            difficulty={recipe.difficulty}
            isLiked={recipe.isLiked}
            isSaved={recipe.isSaved}
            onLike={() => console.log(`Toggle like for recipe: ${recipe.id}`)}
            onSave={() => console.log(`Toggle save for recipe: ${recipe.id}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default RecipeGrid;
