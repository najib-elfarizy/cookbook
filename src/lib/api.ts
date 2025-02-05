import { supabase } from "./supabase";

export async function fetchProfile(userId: string, currentUserId?: string) {
  // Get basic profile info
  const { data: profile, error } = await supabase
    .from("profiles")
    .select(`*`)
    .eq("id", userId)
    .single();

  if (error) throw error;

  // Get followers and following counts
  const [followersResult, followingResult] = await Promise.all([
    supabase
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("following_id", userId),
    supabase
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("follower_id", userId),
  ]);

  // Check if current user is following this profile
  let isFollowing = false;
  if (currentUserId) {
    const { data: followData } = await supabase
      .from("follows")
      .select()
      .eq("follower_id", currentUserId)
      .eq("following_id", userId)
      .single();
    isFollowing = !!followData;
  }

  return {
    ...profile,
    followers: followersResult.count || 0,
    following: followingResult.count || 0,
    is_following: isFollowing,
  };
}

export async function getFollowers(userId: string) {
  const { data: followers, error } = await supabase
    .from("follows")
    .select(
      `
      follower:profiles!follows_follower_id_fkey(
        id,
        full_name,
        username,
        avatar_url
      )
    `,
    )
    .eq("following_id", userId);

  if (error) throw error;

  // Transform the data to get the follower profiles
  return followers.map((f) => ({
    ...f.follower,
    is_following: false, // This will be updated in the UI when needed
  }));
}

export async function getFollowing(userId: string) {
  const { data: following, error } = await supabase
    .from("follows")
    .select(
      `
      following:profiles!follows_following_id_fkey(
        id,
        full_name,
        username,
        avatar_url
      )
    `,
    )
    .eq("follower_id", userId);

  if (error) throw error;

  // Transform the data to get the following profiles
  return following.map((f) => ({
    ...f.following,
    is_following: true, // Since we're following these users
  }));
}

export async function toggleFollow(userId: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: existingFollow } = await supabase
    .from("follows")
    .select()
    .eq("following_id", userId)
    .eq("follower_id", user.id)
    .single();

  if (existingFollow) {
    const { error } = await supabase
      .from("follows")
      .delete()
      .eq("following_id", userId)
      .eq("follower_id", user.id);

    if (error) throw error;
    return false;
  } else {
    const { error } = await supabase
      .from("follows")
      .insert([{ following_id: userId, follower_id: user.id }]);

    if (error) throw error;
    return true;
  }
}

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
  let query = supabase.from("recipes").select(`
      *,
      category:categories(*),
      likes:recipe_likes(count),
      saves:recipe_saves(count),
      comments:recipe_comments(count),
      is_liked:recipe_likes!left(user_id),
      is_saved:recipe_saves!left(user_id),
      user:profiles!author_id (*)
    `);

  if (userId) {
    query = query
      .eq("is_liked.user_id", userId)
      .eq("is_saved.user_id", userId);
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) throw error;
  return data.map((recipe) => ({
    ...recipe,
    likes: recipe.likes[0].count || 0,
    saves: recipe.saves[0].count || 0,
    comments: recipe.comments[0].count || 0,
    is_liked: recipe.is_liked[0]?.user_id == userId,
    is_saved: recipe.is_saved[0]?.user_id == userId,
  }));
}

export async function getUserRecipes(userId: string) {
  const { data, error } = await supabase
    .from("recipes")
    .select()
    .eq("author_id", userId);

  if (error) throw error;
  return data;
}

export async function findRecipeById(id: string, userId?: string) {
  let query = supabase
    .from("recipes")
    .select(
      `
      *,
      category:categories(*),
      likes:recipe_likes(count),
      saves:recipe_saves(count),
      comments:recipe_comments(*),
      user:profiles!author_id (*),
      is_liked:recipe_likes!left(user_id),
      is_saved:recipe_saves!left(user_id)
    `,
    );

  if (userId) {
    query = query
      .eq("is_liked.user_id", userId)
      .eq("is_saved.user_id", userId);
  }

  const { data, error } = await query.eq("id", id).single();

  if (error) throw error;
  return {
    ...data,
    likes: data.likes[0].count || 0,
    saves: data.saves[0].count || 0,
    is_liked: data.is_liked[0]?.user_id == userId,
    is_saved: data.is_saved[0]?.user_id == userId,
    comments: data.comments || [],
  };
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
      recipe_saves!inner(scheduled_date, custom_name)
    `,
    )
    .eq("recipe_saves.user_id", userId);
  // .order("recipe_saves.scheduled_date", { ascending: true });

  if (error) throw error;
  return data.map((recipe) => ({
    ...recipe,
    likes: recipe.likes[0].count || 0,
    saves: recipe.saves[0].count || 0,
    comments: recipe.comments[0].count || 0,
    scheduled_date: recipe.recipe_saves[0]?.scheduled_date,
    custom_name: recipe.recipe_saves[0]?.custom_name,
  }));
}

export async function toggleRecipeSave(
  recipeId: string,
  userId: string,
  scheduledDate?: string,
  customName?: string,
) {
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
    const { error } = await supabase.from("recipe_saves").insert([
      {
        recipe_id: recipeId,
        user_id: userId,
        scheduled_date: scheduledDate,
        custom_name: customName,
      },
    ]);

    if (error) throw error;
    return true;
  }
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

export async function createRecipe(recipe: any) {
  const { data, error } = await supabase
    .from("recipes")
    .insert([recipe])
    .select()
    .single();

  if (error) throw error;
  return data;
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
    .select(
      `
      *,
      user:profiles!user_id (*)
    `)
    .eq("recipe_id", recipeId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}