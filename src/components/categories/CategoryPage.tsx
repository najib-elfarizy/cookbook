import React from "react";
import { useParams } from "react-router-dom";
import SearchSection from "../recipes/SearchSection";
import RecipeGrid from "../recipes/RecipeGrid";

const categoryRecipes = {
  italian: [
    {
      id: "i1",
      username: "ChefMarco",
      userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marco",
      title: "Authentic Neapolitan Pizza",
      image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3",
      likes: 892,
      timePosted: "1d ago",
      description:
        "The secret to perfect Neapolitan pizza is in the dough fermentation! 🍕 #italianfood #pizza #authentic",
      cookTime: "2 hours",
      servings: 4,
      difficulty: "Medium",
      isLiked: false,
      isSaved: false,
    },
    {
      id: "i2",
      username: "PastaQueen",
      userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pasta",
      title: "Homemade Pasta Carbonara",
      image: "https://images.unsplash.com/photo-1612874742237-6526221588e3",
      likes: 654,
      timePosted: "5h ago",
      description:
        "Classic Roman carbonara - no cream, just eggs, pecorino, and guanciale! 🍝 #pasta #rome #authentic",
      cookTime: "30 mins",
      servings: 2,
      difficulty: "Medium",
      isLiked: true,
      isSaved: true,
    },
  ],
  japanese: [
    {
      id: "j1",
      username: "SushiMaster",
      userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sushi",
      title: "Homemade Sushi Rolls",
      image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c",
      likes: 445,
      timePosted: "3h ago",
      description:
        "Making sushi at home is easier than you think! 🍱 #sushi #japanesefood #homemade",
      cookTime: "1 hour",
      servings: 3,
      difficulty: "Medium",
      isLiked: false,
      isSaved: true,
    },
  ],
  mexican: [
    {
      id: "m1",
      username: "TacoLover",
      userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Taco",
      title: "Street Style Tacos",
      image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47",
      likes: 723,
      timePosted: "4h ago",
      description:
        "Authentic Mexican street tacos with homemade salsa verde! 🌮 #tacos #mexicanfood",
      cookTime: "45 mins",
      servings: 4,
      difficulty: "Easy",
      isLiked: true,
      isSaved: false,
    },
  ],
};

const CategoryPage = () => {
  const { slug } = useParams();
  const recipes = categoryRecipes[slug as keyof typeof categoryRecipes] || [];

  return (
    <div className="min-h-screen bg-background">
      <main className="flex flex-col min-h-screen">
        <SearchSection />
        <div className="flex-1">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold mb-6 capitalize">
              {slug} Recipes
            </h1>
            <RecipeGrid socialRecipes={recipes} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CategoryPage;
