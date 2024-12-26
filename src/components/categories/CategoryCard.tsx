import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface CategoryCardProps {
  title: string;
  image: string;
  recipeCount: number;
  slug: string;
}

const CategoryCard = ({
  title = "Italian",
  image = "https://images.unsplash.com/photo-1498579150354-977475b7ea0b",
  recipeCount = 127,
  slug = "italian",
}: CategoryCardProps) => {
  const navigate = useNavigate();

  return (
    <Card
      className="group cursor-pointer overflow-hidden"
      onClick={() => navigate(`/category/${slug}`)}
    >
      <CardContent className="p-0 relative aspect-square">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors">
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="text-xl font-semibold mb-1">{title}</h3>
            <p className="text-sm text-white/80">{recipeCount} recipes</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
