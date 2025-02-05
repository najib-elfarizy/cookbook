import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";
import {
  getAllRecipes,
  getSavedRecipes,
  getLikedRecipes,
  getUserRecipes,
  fetchProfile,
  getFollowers,
  getFollowing,
} from "@/lib/api";
import { signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Heart, BookmarkCheck, LogOut } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import RecipeGrid from "../recipes/RecipeGrid";
import { Profile, Recipe } from "@/types";
import FollowList from "./FollowList";
import FollowButton from "./FollowButton";

const UserProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile>();
  const [followers, setFollowers] = useState([]);
  const [showFollowers, setShowFollowers] = useState(false);
  const [followingUsers, setFollowingUsers] = useState([]);
  const [showFollowings, setShowFollowings] = useState(false);
  const [activeTab, setActiveTab] = useState("recipes");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [likedRecipes, setLikedRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const loadFollowers = async () => {
      if (activeTab === "followers" && user) {
        const followers = await getFollowers(user.id);
        setFollowers(followers);
      }
    };

    const loadFollowing = async () => {
      if (activeTab === "following" && user) {
        const following = await getFollowing(user.id);
        setFollowingUsers(following);
      }
    };

    loadFollowers();
    loadFollowing();
  }, [user?.id, activeTab]);

  useEffect(() => {
    if (!user) return;

    fetchProfile(user.id)
      .then((data) => {
        setProfile(data);
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      });

    // Fetch user recipes
    getUserRecipes(user.id).then(setRecipes);

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

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <img
                  src={
                    profile?.avatar_url ??
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`
                  }
                  alt={profile?.full_name}
                  className="w-20 h-20 rounded-full"
                />
                <div>
                  <h1 className="text-2xl font-bold">{profile?.full_name}</h1>
                  <p className="text-muted-foreground">@{profile?.username}</p>
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

            <p className="text-gray-600 mb-6">{profile?.bio}</p>

            <div className="flex gap-6 mb-8">
              <div className="text-center">
                <p className="font-semibold">{recipes.length}</p>
                <p className="text-sm text-muted-foreground">Recipes</p>
              </div>
              <div
                className="text-center cursor-pointer hover:opacity-75"
                onClick={() => setShowFollowers(true)}
              >
                <p className="font-semibold">{profile?.followers || 0}</p>
                <p className="text-sm text-muted-foreground">Followers</p>
              </div>
              <div
                className="text-center cursor-pointer hover:opacity-75"
                onClick={() => setShowFollowings(true)}
              >
                <p className="font-semibold">{profile?.following || 0}</p>
                <p className="text-sm text-muted-foreground">Following</p>
              </div>
            </div>

            <Tabs
              defaultValue="recipes"
              className="w-full"
              onValueChange={setActiveTab}
            >
              <TabsList className="w-full">
                <TabsTrigger value="recipes" className="flex-1">
                  My Recipes
                </TabsTrigger>
                <TabsTrigger value="followers" className="flex-1">
                  Followers
                </TabsTrigger>
                <TabsTrigger value="following" className="flex-1">
                  Following
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
              <TabsContent value="followers">
                <div className="py-4">
                  {profile?.followers > 0 ? (
                    <div className="space-y-4">
                      {followers?.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between p-4 bg-card rounded-lg border"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage
                                src={
                                  user.avatar_url ??
                                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`
                                }
                              />
                              <AvatarFallback>
                                {user.full_name?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.full_name}</p>
                              <p className="text-sm text-muted-foreground">
                                @{user.username}
                              </p>
                            </div>
                          </div>
                          <FollowButton
                            userId={user.id}
                            isFollowing={user.is_following}
                            onFollowChange={(isFollowing) => {
                              setFollowers((prev) =>
                                prev.map((u) =>
                                  u.id === user.id
                                    ? { ...u, is_following: isFollowing }
                                    : u,
                                ),
                              );
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No followers yet
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="following">
                <div className="py-4">
                  {profile?.following > 0 ? (
                    <div className="space-y-4">
                      {followingUsers?.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between p-4 bg-card rounded-lg border"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage
                                src={
                                  user.avatar_url ??
                                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`
                                }
                              />
                              <AvatarFallback>
                                {user.full_name?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.full_name}</p>
                              <p className="text-sm text-muted-foreground">
                                @{user.username}
                              </p>
                            </div>
                          </div>
                          <FollowButton
                            userId={user.id}
                            isFollowing={user.is_following}
                            onFollowChange={(isFollowing) => {
                              setFollowingUsers((prev) =>
                                prev.map((u) =>
                                  u.id === user.id
                                    ? { ...u, is_following: isFollowing }
                                    : u,
                                ),
                              );
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      Not following anyone yet
                    </div>
                  )}
                </div>
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

        <FollowList
          userId={user.id}
          type="followers"
          open={showFollowers}
          onOpenChange={setShowFollowers}
        />
        <FollowList
          userId={user.id}
          type="following"
          open={showFollowings}
          onOpenChange={setShowFollowings}
        />
      </div>
    </div>
  );
};

export default UserProfile;
