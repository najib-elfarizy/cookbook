import { supabase } from "./supabase";

export async function fetchProfile(userId: string, currentUserId?: string) {
  // Get basic profile info
  const { data: profile, error } = await supabase
    .from("profiles")
    .select(
      `
      *,
      recipes:recipes(count)
    `,
    )
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

export async function getUserRecipes(userId: string) {
  const { data, error } = await supabase
    .from("recipes")
    .select()
    .eq("author_id", userId);

  if (error) throw error;
  return data;
}

export async function getSavedRecipes(userId: string) {
  const { data, error } = await supabase
    .from("recipe_saves")
    .select(
      `
      recipe:recipes(*)
    `,
    )
    .eq("user_id", userId);

  if (error) throw error;
  return data.map((d) => d.recipe);
}

export async function getLikedRecipes(userId: string) {
  const { data, error } = await supabase
    .from("recipe_likes")
    .select(
      `
      recipe:recipes(*)
    `,
    )
    .eq("user_id", userId);

  if (error) throw error;
  return data.map((d) => d.recipe);
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
