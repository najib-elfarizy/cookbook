import React from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Heart,
  MessageCircle,
  Share2,
  BookmarkPlus,
  Clock,
  Users,
  ChefHat,
  Printer,
} from "lucide-react";

interface Ingredient {
  item: string;
  amount: string;
  unit: string;
}

interface Step {
  number: number;
  instruction: string;
  tip?: string;
}

const recipeData = {
  "homemade-pizza": {
    id: "homemade-pizza",
    title: "Authentic Neapolitan Pizza",
    description:
      "The secret to perfect Neapolitan pizza is in the dough fermentation! A traditional recipe passed down through generations.",
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3",
    author: {
      username: "ChefMarco",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marco",
    },
    stats: {
      likes: 892,
      comments: 45,
      saves: 156,
    },
    details: {
      prepTime: "30 mins",
      cookTime: "90 mins",
      totalTime: "2 hours",
      servings: 4,
      difficulty: "Medium",
      cuisine: "Italian",
    },
    ingredients: [
      { item: "00 Flour", amount: "1000", unit: "g" },
      { item: "Water", amount: "650", unit: "ml" },
      { item: "Salt", amount: "30", unit: "g" },
      { item: "Fresh Yeast", amount: "3", unit: "g" },
      { item: "San Marzano Tomatoes", amount: "400", unit: "g" },
      { item: "Fresh Mozzarella", amount: "200", unit: "g" },
      { item: "Fresh Basil", amount: "10", unit: "leaves" },
      { item: "Extra Virgin Olive Oil", amount: "2", unit: "tbsp" },
    ],
    steps: [
      {
        number: 1,
        instruction: "Mix flour and salt in a large bowl.",
        tip: "Use room temperature water for best results",
      },
      {
        number: 2,
        instruction:
          "Dissolve yeast in water and gradually add to flour mixture.",
      },
      {
        number: 3,
        instruction: "Knead dough for 20 minutes until smooth and elastic.",
        tip: "The dough should be slightly sticky but manageable",
      },
      {
        number: 4,
        instruction: "Let dough rest for 24 hours in refrigerator.",
      },
      {
        number: 5,
        instruction:
          "Divide dough into 4 balls and let rest at room temperature.",
      },
      {
        number: 6,
        instruction: "Stretch dough by hand and add toppings.",
      },
      {
        number: 7,
        instruction: "Bake in preheated oven at 450°C (850°F) for 90 seconds.",
        tip: "Use a pizza stone if available",
      },
    ],
  },
};

const RecipeDetail = () => {
  const { recipeId } = useParams<{ recipeId: string }>();
  // Use the provided recipeId or default to "homemade-pizza" for storyboard display
  const recipe = recipeData[recipeId || "homemade-pizza"];

  if (!recipe) return <div>Recipe not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="bg-white overflow-hidden">
          {/* Header Image */}
          <div className="relative h-[400px]">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
                <p className="text-white/90 mb-4">{recipe.description}</p>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={recipe.author.avatar} />
                    <AvatarFallback>{recipe.author.username[0]}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{recipe.author.username}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Recipe Stats */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-6">
                <Button variant="ghost" size="icon" className="text-red-500">
                  <Heart className="h-6 w-6" />
                  <span className="ml-2">{recipe.stats.likes}</span>
                </Button>
                <Button variant="ghost" size="icon">
                  <MessageCircle className="h-6 w-6" />
                  <span className="ml-2">{recipe.stats.comments}</span>
                </Button>
                <Button variant="ghost" size="icon">
                  <Share2 className="h-6 w-6" />
                </Button>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon">
                  <Printer className="h-6 w-6" />
                </Button>
                <Button variant="ghost" size="icon" className="text-blue-500">
                  <BookmarkPlus className="h-6 w-6" />
                  <span className="ml-2">{recipe.stats.saves}</span>
                </Button>
              </div>
            </div>

            {/* Recipe Details */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Total Time</p>
                  <p className="font-medium">{recipe.details.totalTime}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Servings</p>
                  <p className="font-medium">{recipe.details.servings}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ChefHat className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Difficulty</p>
                  <p className="font-medium">{recipe.details.difficulty}</p>
                </div>
              </div>
            </div>

            {/* Ingredients */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Ingredients</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recipe.ingredients.map((ingredient, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 border-b"
                  >
                    <span>{ingredient.item}</span>
                    <span className="text-gray-600">
                      {ingredient.amount} {ingredient.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="my-8" />

            {/* Instructions */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Instructions</h2>
              <div className="space-y-6">
                {recipe.steps.map((step) => (
                  <div key={step.number} className="flex gap-4">
                    <div className="flex-none">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-medium">
                        {step.number}
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-800">{step.instruction}</p>
                      {step.tip && (
                        <p className="text-sm text-muted-foreground mt-2 italic">
                          Tip: {step.tip}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RecipeDetail;
