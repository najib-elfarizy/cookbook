export interface Recipe {
  id: string;
  title: string;
  description: string;
  image_url: string;
  prep_time: number;
  cook_time: number;
  servings: number;
  difficulty: string;
  user_id: string;
  category: {
    id: string;
    title: string;
    slug: string;
  };
  user?: {
    username: string;
  };
  likes: number;
  saves: number;
  comments: number;
}

export interface HomeProps {
  initialSearchTerm?: string;
  initialFilters?: {
    cuisine: string;
    time: string;
    difficulty: string;
  };
}

export interface SearchSectionProps {
  onSearch?: (searchTerm: string) => void;
  onFilterChange?: (filterType: string, value: string) => void;
  searchTerm?: string;
  selectedCuisine?: string;
  selectedTime?: string;
  selectedDifficulty?: string;
}

export interface RecipeGridProps {
  recipes?: Recipe[];
}

export interface RecipeCardProps extends Partial<Recipe> {
  prepTime?: string;
  cookTime?: string;
  servings?: number;
  difficulty?: string;
  likes?: number;
  saves?: number;
  comments?: number;
  isLiked?: boolean;
  isSaved?: boolean;
  username?: string;
}

export interface CategoryCardProps {
  id: string;
  title: string;
  image_url: string;
  slug: string;
}

export interface CommentsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipeId: string;
  recipeTitle: string;
}

export interface AuthModalProps {
  trigger?: React.ReactNode;
  mode?: "sign-in" | "sign-up";
  onSuccess?: () => void;
}

export interface LayoutProps {
  children: React.ReactNode;
}

export interface CreateRecipeForm {
  title: string;
  description: string;
  image_url: string;
  category_id: string;
  prep_time: string;
  cook_time: string;
  servings: string;
  difficulty: string;
  instructions: Array<{ number: number; instruction: string; tip: string }>;
}
