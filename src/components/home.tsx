import React, { useState } from "react";
import SearchSection from "./recipes/SearchSection";
import RecipeGrid from "./recipes/RecipeGrid";

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

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    // In a real implementation, this would trigger a search
    console.log("Searching for:", term);
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
    // In a real implementation, this would update the filtered results
    console.log("Filter changed:", filterType, value);
  };

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
          <RecipeGrid />
        </div>
      </main>
    </div>
  );
};

export default Home;
