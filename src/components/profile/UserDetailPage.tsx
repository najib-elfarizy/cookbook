import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart } from "lucide-react";
import RecipeGrid from "../recipes/RecipeGrid";
import { fetchProfile, getAllRecipes, getUserRecipes } from "@/lib/api";
import { Profile, Recipe } from "@/types";
import { toast } from "../ui/use-toast";

const UserDetailPage = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState<Profile>();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile(userId).then((user) => {
      setProfile(user);
    }).catch((error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    });

    getUserRecipes(userId).then((data) => {
      setRecipes(data);
    }).catch((error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }).finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <img
                  src={profile.avatar ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`}
                  alt={profile.name}
                  className="w-20 h-20 rounded-full"
                />
                <div>
                  <h1 className="text-2xl font-bold">{profile.name}</h1>
                  <p className="text-muted-foreground">@{profile.full_name}</p>
                </div>
              </div>
            </div>

            <p className="text-gray-600 mb-6">{profile.bio}</p>

            <div className="flex gap-6 mb-8">
              <div className="text-center">
                <p className="font-semibold">{profile.recipes}</p>
                <p className="text-sm text-muted-foreground">Recipes</p>
              </div>
              <div className="text-center">
                <p className="font-semibold">{profile.followers}</p>
                <p className="text-sm text-muted-foreground">Followers</p>
              </div>
              <div className="text-center">
                <p className="font-semibold">{profile.followings}</p>
                <p className="text-sm text-muted-foreground">Following</p>
              </div>
            </div>

            <Tabs defaultValue="recipes" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="recipes" className="flex-1">
                  Recipes
                </TabsTrigger>
                <TabsTrigger value="liked" className="flex-1">
                  <Heart className="h-4 w-4 mr-2" />
                  Liked
                </TabsTrigger>
              </TabsList>
              <TabsContent value="recipes">
                <RecipeGrid recipes={recipes} />
              </TabsContent>
              <TabsContent value="liked">
                <div className="text-center py-8 text-muted-foreground">
                  Liked recipes are private
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDetailPage;
