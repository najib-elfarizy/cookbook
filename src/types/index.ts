export interface Category {
  id: string
  slug: string
  title: string
  description: string | null
  image_url: string | null
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  image_url: string;
  prep_time: number;
  cook_time: number;
  servings: number;
  difficulty: string;
  author_id: string;
  category_id: string;
  created_at: string;
  instructions: Array<{
    number: number;
    instruction: string;
    tip?: string;
  }>;
  category: {
    slug: 'N/A'
  };
  user: {
    id: string
    email: string
    raw_user_meta_data: { name?: string }
  } | null;
  comments: number;
  likes: number;
  saves: number;
}

export interface RecipeDetail {
  id: string;
  title: string;
  description: string;
  image_url: string;
  prep_time: number;
  cook_time: number;
  servings: number;
  difficulty: string;
  author_id: string;
  created_at: string;
  instructions: Array<{
    number: number;
    instruction: string;
    tip?: string;
  }>;
  category: {
    slug: 'N/A'
  },
  user: {
    id: string
    email: string
    raw_user_meta_data: { name?: string }
  } | null;
  likes: number;
  saves: number;
  comments: any[];
}

export interface RecipeComment {
  id: string
  recipe_id: string | null
  user_id: string | null
  created_at: string
  content: string
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
