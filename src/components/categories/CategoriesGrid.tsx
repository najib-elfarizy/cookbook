import React from "react";
import CategoryCard from "./CategoryCard";

const categories = [
  {
    title: "Italian",
    image: "https://images.unsplash.com/photo-1498579150354-977475b7ea0b",
    recipeCount: 127,
    slug: "italian",
  },
  {
    title: "Japanese",
    image: "https://images.unsplash.com/photo-1580822184713-fc5400e7fe10",
    recipeCount: 95,
    slug: "japanese",
  },
  {
    title: "Mexican",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47",
    recipeCount: 84,
    slug: "mexican",
  },
  {
    title: "Indian",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe",
    recipeCount: 112,
    slug: "indian",
  },
  {
    title: "Mediterranean",
    image: "https://images.unsplash.com/photo-1544510806-909d9995bb1c",
    recipeCount: 73,
    slug: "mediterranean",
  },
  {
    title: "Chinese",
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d",
    recipeCount: 89,
    slug: "chinese",
  },
];

const CategoriesGrid = () => {
  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Recipe Categories</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.slug} {...category} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesGrid;
