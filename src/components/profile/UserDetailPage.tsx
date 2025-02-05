import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import RecipeGrid from "../recipes/RecipeGrid";
import { fetchProfile, getUserRecipes } from "@/lib/api";
import { Profile, Recipe } from "@/types";
import { toast } from "../ui/use-toast";
import FollowButton from "./FollowButton";
import FollowList from "./FollowList";
import { useAuth } from "@/lib/AuthContext";

const UserDetailPage = () => {
  const { userId } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile>();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [followers, setFollowers] = useState([]);
  const [showFollowers, setShowFollowers] = useState(false);
  const [followingUsers, setFollowingUsers] = useState([]);
  const [showFollowings, setShowFollowings] = useState(false);
  const [activeTab, setActiveTab] = useState("recipes");

  useEffect(() => {
    const loadFollowers = async () => {
      if (activeTab === "followers") {
        const followers = await getFollowers(userId);
        setFollowers(followers);
      }
    };

    const loadFollowing = async () => {
      if (activeTab === "following") {
        const following = await getFollowing(userId);
        setFollowingUsers(following);
      }
    };

    loadFollowers();
    loadFollowing();
  }, [userId, activeTab]);

  useEffect(() => {
    if (!userId) return;

    fetchProfile(userId, user?.id)
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

    getUserRecipes(userId)
      .then((data) => {
        setRecipes(data);
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      })
      .finally(() => setLoading(false));
  }, [userId, user?.id]);

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
                  src={
                    profile?.avatar_url ??
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`
                  }
                  alt={profile?.full_name}
                  className="w-20 h-20 rounded-full"
                />
                <div>
                  <h1 className="text-2xl font-bold">{profile?.full_name}</h1>
                  <p className="text-muted-foreground">@{profile?.username}</p>
                </div>
              </div>
              {user?.id !== userId && (
                <FollowButton
                  userId={userId}
                  isFollowing={profile?.is_following}
                  onFollowChange={(isFollowing) =>
                    setProfile((prev) =>
                      prev
                        ? {
                            ...prev,
                            is_following: isFollowing,
                            followers: prev.followers + (isFollowing ? 1 : -1),
                          }
                        : prev,
                    )
                  }
                />
              )}
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

            <Tabs defaultValue="recipes" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="recipes" className="flex-1">
                  Recipes
                </TabsTrigger>
                <TabsTrigger value="followers" className="flex-1">
                  Followers
                </TabsTrigger>
                <TabsTrigger value="following" className="flex-1">
                  Following
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
            </Tabs>
          </CardContent>
        </Card>

        <FollowList
          userId={userId}
          type="followers"
          open={showFollowers}
          onOpenChange={setShowFollowers}
        />
        <FollowList
          userId={userId}
          type="following"
          open={showFollowings}
          onOpenChange={setShowFollowings}
        />
      </div>
    </div>
  );
};

export default UserDetailPage;
