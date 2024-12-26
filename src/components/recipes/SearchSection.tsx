import React from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchSectionProps {
  onSearch?: (searchTerm: string) => void;
  onFilterChange?: (filterType: string, value: string) => void;
  searchTerm?: string;
  selectedCuisine?: string;
  selectedTime?: string;
  selectedDifficulty?: string;
}

const SearchSection = ({
  onSearch = () => {},
  onFilterChange = () => {},
  searchTerm = "",
  selectedCuisine = "",
  selectedTime = "",
  selectedDifficulty = "",
}: SearchSectionProps) => {
  return (
    <div className="w-full bg-white border-b p-4 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-10 w-full"
          />
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-medium">Filters:</span>
          </div>

          <Select
            value={selectedCuisine}
            onValueChange={(value) => onFilterChange("cuisine", value)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Cuisine Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="italian">Italian</SelectItem>
              <SelectItem value="japanese">Japanese</SelectItem>
              <SelectItem value="mexican">Mexican</SelectItem>
              <SelectItem value="indian">Indian</SelectItem>
              <SelectItem value="french">French</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={selectedTime}
            onValueChange={(value) => onFilterChange("time", value)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Cooking Time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">Under 15 mins</SelectItem>
              <SelectItem value="30">Under 30 mins</SelectItem>
              <SelectItem value="60">Under 1 hour</SelectItem>
              <SelectItem value="more">Over 1 hour</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={selectedDifficulty}
            onValueChange={(value) => onFilterChange("difficulty", value)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => {
              onFilterChange("cuisine", "");
              onFilterChange("time", "");
              onFilterChange("difficulty", "");
            }}
          >
            Clear Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchSection;
