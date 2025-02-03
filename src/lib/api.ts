import { supabase } from "./supabase";

export async function getCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("title");

  if (error) throw error;
  return data;
}

export async function getRecipesByCategory(categorySlug: string) {
  const { data, error } = await supabase
    .from("recipes")
    .select(
      `
      *,
      category:categories(*),
      likes:recipe_likes(count),
      saves:recipe_saves(count),
      comments:recipe_comments(count)
    `,
    )
    .order("created_at", { ascending: false })
    .eq("category.slug", categorySlug);

  if (error) throw error;
  return data.map((recipe) => ({
    ...recipe,
    likes: recipe.likes[0].count || 0,
    saves: recipe.saves[0].count || 0,
    comments: recipe.comments[0].count || 0,
  }));
}

export async function getAllRecipes(userId?: string) {
  const { data, error } = await supabase.from("recipes").select(`
      *,
      category:categories(*),
      likes:recipe_likes(count),
      saves:recipe_saves(count),
      comments:recipe_comments(count),
      user_liked:recipe_likes!left(user_id),
      user_saved:recipe_saves!left(user_id)
    `)
    .eq("user_liked.user_id", userId || "00000000-0000-0000-0000-000000000000")
    .eq("user_saved.user_id", userId || "00000000-0000-0000-0000-000000000000")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data.map((recipe) => ({
    ...recipe,
    likes: recipe.likes[0].count || 0,
    saves: recipe.saves[0].count || 0,
    comments: recipe.comments[0].count || 0,
  }));
}

export async function getRecipeById(id: string) {
  const { data, error } = await supabase
    .from("recipes")
    .select(
      `
      *,
      category:categories(*),
      likes:recipe_likes(count),
      saves:recipe_saves(count),
      comments:recipe_comments(*),
      user:users!author_id (*)
    `,
    )
    .eq("id", id)
    .single();

  if (error) throw error;
  return {
    ...data,
    likes: data.likes[0].count || 0,
    saves: data.saves[0].count || 0,
    comments: data.comments || [],
  };
}

export async function toggleRecipeLike(recipeId: string, userId: string) {
  const { data: existingLike } = await supabase
    .from("recipe_likes")
    .select()
    .eq("recipe_id", recipeId)
    .eq("user_id", userId)
    .single();

  if (existingLike) {
    const { error } = await supabase
      .from("recipe_likes")
      .delete()
      .eq("recipe_id", recipeId)
      .eq("user_id", userId);

    if (error) throw error;
    return false;
  } else {
    const { error } = await supabase
      .from("recipe_likes")
      .insert([{ recipe_id: recipeId, user_id: userId }]);

    if (error) throw error;
    return true;
  }
}

export async function toggleRecipeSave(recipeId: string, userId: string) {
  const { data: existingSave } = await supabase
    .from("recipe_saves")
    .select()
    .eq("recipe_id", recipeId)
    .eq("user_id", userId)
    .single();

  if (existingSave) {
    const { error } = await supabase
      .from("recipe_saves")
      .delete()
      .eq("recipe_id", recipeId)
      .eq("user_id", userId);

    if (error) throw error;
    return false;
  } else {
    const { error } = await supabase
      .from("recipe_saves")
      .insert([{ recipe_id: recipeId, user_id: userId }]);

    if (error) throw error;
    return true;
  }
}

export async function addComment(
  recipeId: string,
  userId: string,
  content: string,
) {
  const { data, error } = await supabase
    .from("recipe_comments")
    .insert([{ recipe_id: recipeId, user_id: userId, content }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getRecipeComments(recipeId: string) {
  const { data, error } = await supabase
    .from("recipe_comments")
    .select("*")
    .eq("recipe_id", recipeId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getSavedRecipes(userId: string) {
  const { data, error } = await supabase
    .from("recipes")
    .select(
      `
      *,
      category:categories(*),
      likes:recipe_likes(count),
      saves:recipe_saves(count),
      comments:recipe_comments(count),
      is_saved:recipe_saves!inner(user_id)
    `,
    )
    .order("created_at", { ascending: false })
    .eq("is_saved.user_id", userId);

  if (error) throw error;
  console.log(data);
  return data.map((recipe) => ({
    ...recipe,
    likes: recipe.likes[0].count || 0,
    saves: recipe.saves[0].count || 0,
    comments: recipe.comments[0].count || 0,
  }));
}

export async function getLikedRecipes(userId: string) {
  const { data, error } = await supabase
    .from("recipes")
    .select(
      `
      *,
      category:categories(*),
      likes:recipe_likes(count),
      saves:recipe_saves(count),
      comments:recipe_comments(count),
      is_liked:recipe_likes!inner(user_id)
    `,
    )
    .order("created_at", { ascending: false })
    .eq("is_liked.user_id", userId);

  if (error) throw error;
  return data.map((recipe) => ({
    ...recipe,
    likes: recipe.likes[0].count || 0,
    saves: recipe.saves[0].count || 0,
    comments: recipe.comments[0].count || 0,
  }));
}

export async function createRecipe(recipe: {
  title: string;
  description: string;
  image_url: string;
  category_id: string;
  prep_time: number;
  cook_time: number;
  servings: number;
  difficulty: string;
  instructions: Array<{ number: number; instruction: string; tip?: string }>;
  author_id: string;
}) {
  const { data, error } = await supabase
    .from("recipes")
    .insert([recipe])
    .select()
    .single();

  if (error) throw error;
  return data;
}
