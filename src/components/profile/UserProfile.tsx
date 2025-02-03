import React, { useEffect, useState } from "react";
import { RecipeWithStats } from "@/types/supabase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";
import { getAllRecipes, getSavedRecipes, getLikedRecipes } from "@/lib/api";
import { signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Heart, BookmarkCheck, LogOut } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import RecipeGrid from "../recipes/RecipeGrid";

const UserProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [recipes, setRecipes] = useState<RecipeWithStats[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<RecipeWithStats[]>([]);
  const [likedRecipes, setLikedRecipes] = useState<RecipeWithStats[]>([]);

  useEffect(() => {
    if (!user) return;

    // Fetch user's recipes
    getAllRecipes().then((allRecipes) => {
      const userRecipes = allRecipes.filter(
        (recipe) => recipe.user_id === user.id,
      );
      setRecipes(userRecipes);
    });

    // Fetch saved recipes
    getSavedRecipes(user.id).then(setSavedRecipes);

    // Fetch liked recipes
    getLikedRecipes(user.id).then(setLikedRecipes);
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <AuthModal />
      </div>
    );
  }

  const userData = {
    name: user.email?.split("@")[0] || "User",
    username: user.email?.split("@")[0] || "user",
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`,
    bio: "Food enthusiast and home chef. Love trying new recipes!",
    recipesCount: recipes.length,
    followersCount: 0,
    followingCount: 0,
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <img
                  src={userData.avatar}
                  alt={userData.name}
                  className="w-20 h-20 rounded-full"
                />
                <div>
                  <h1 className="text-2xl font-bold">{userData.name}</h1>
                  <p className="text-muted-foreground">@{userData.username}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigate("/settings")}
                >
                  <Settings className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <p className="text-gray-600 mb-6">{userData.bio}</p>

            <div className="flex gap-6 mb-8">
              <div className="text-center">
                <p className="font-semibold">{userData.recipesCount}</p>
                <p className="text-sm text-muted-foreground">Recipes</p>
              </div>
              <div className="text-center">
                <p className="font-semibold">{userData.followersCount}</p>
                <p className="text-sm text-muted-foreground">Followers</p>
              </div>
              <div className="text-center">
                <p className="font-semibold">{userData.followingCount}</p>
                <p className="text-sm text-muted-foreground">Following</p>
              </div>
            </div>

            <Tabs defaultValue="recipes" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="recipes" className="flex-1">
                  My Recipes
                </TabsTrigger>
                <TabsTrigger value="liked" className="flex-1">
                  <Heart className="h-4 w-4 mr-2" />
                  Liked
                </TabsTrigger>
                <TabsTrigger value="saved" className="flex-1">
                  <BookmarkCheck className="h-4 w-4 mr-2" />
                  Saved
                </TabsTrigger>
              </TabsList>
              <TabsContent value="recipes">
                <RecipeGrid recipes={recipes} />
              </TabsContent>
              <TabsContent value="liked">
                <RecipeGrid recipes={likedRecipes} />
              </TabsContent>
              <TabsContent value="saved">
                <RecipeGrid recipes={savedRecipes} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
