import React, { useState, useEffect } from "react";
import SearchSection from "./recipes/SearchSection";
import RecipeGrid from "./recipes/RecipeGrid";
import { getAllRecipes } from "@/lib/api";

interface Recipe {
  id: string;
  title: string;
  description: string;
  image_url: string;
  prep_time: number;
  cook_time: number;
  servings: number;
  difficulty: string;
  category: {
    id: string;
    title: string;
    slug: string;
  };
  likes: number;
  saves: number;
  comments: number;
}

interface HomeProps {
  initialSearchTerm?: string;
  initialFilters?: {
    cuisine: string;
    time: string;
    difficulty: string;
  };
}

const Home = ({
  initialSearchTerm = "",
  initialFilters = {
    cuisine: "",
    time: "",
    difficulty: "",
  },
}: HomeProps) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [filters, setFilters] = useState(initialFilters);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const data = await getAllRecipes();
        setAllRecipes(data);
        setRecipes(data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    filterRecipes(term, filters);
  };

  const handleFilterChange = (filterType: string, value: string) => {
    const newFilters = {
      ...filters,
      [filterType]: value,
    };
    setFilters(newFilters);
    filterRecipes(searchTerm, newFilters);
  };

  const filterRecipes = (term: string, currentFilters: typeof filters) => {
    let filtered = [...allRecipes];

    // Apply search term filter
    if (term) {
      filtered = filtered.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(term.toLowerCase()) ||
          recipe.description?.toLowerCase().includes(term.toLowerCase()),
      );
    }

    // Apply cuisine filter
    if (currentFilters.cuisine) {
      filtered = filtered.filter(
        (recipe) =>
          recipe.category?.slug.toLowerCase() ===
          currentFilters.cuisine.toLowerCase(),
      );
    }

    // Apply difficulty filter
    if (currentFilters.difficulty) {
      filtered = filtered.filter(
        (recipe) =>
          recipe.difficulty.toLowerCase() ===
          currentFilters.difficulty.toLowerCase(),
      );
    }

    // Apply time filter
    if (currentFilters.time) {
      filtered = filtered.filter((recipe) => {
        const totalTime = recipe.prep_time + recipe.cook_time;
        switch (currentFilters.time) {
          case "15":
            return totalTime <= 15;
          case "30":
            return totalTime <= 30;
          case "60":
            return totalTime <= 60;
          case "more":
            return totalTime > 60;
          default:
            return true;
        }
      });
    }

    setRecipes(filtered);
  };

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
        <SearchSection
          searchTerm={searchTerm}
          selectedCuisine={filters.cuisine}
          selectedTime={filters.time}
          selectedDifficulty={filters.difficulty}
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
        />
        <div className="flex-1">
          <RecipeGrid recipes={recipes} />
        </div>
      </main>
    </div>
  );
};

export default Home;
