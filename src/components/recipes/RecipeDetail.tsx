import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Heart,
  MessageCircle,
  Share2,
  BookmarkPlus,
  Clock,
  Users,
  ChefHat,
  Printer,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getRecipeById, toggleRecipeSave, addComment } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

interface Recipe {
  id: string;
  title: string;
  description: string;
  image_url: string;
  prep_time: number;
  cook_time: number;
  servings: number;
  difficulty: string;
  instructions: Array<{
    number: number;
    instruction: string;
    tip?: string;
  }>;
  likes: number;
  saves: number;
  comments: any[];
}

const RecipeDetail = () => {
  const navigate = useNavigate();
  const { recipeId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!recipeId) return;
      try {
        const data = await getRecipeById(recipeId);
        if (!data) {
          console.error("No recipe found with id:", recipeId);
          return;
        }
        setRecipe(data);

        // Subscribe to comments
        const subscription = supabase
          .channel(`recipe_comments:${recipeId}`)
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "recipe_comments",
              filter: `recipe_id=eq.${recipeId}`,
            },
            (payload) => {
              setRecipe((prev) => {
                if (!prev) return null;
                return {
                  ...prev,
                  comments: [payload.new, ...prev.comments],
                };
              });
            },
          )
          .subscribe();

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Error fetching recipe:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [recipeId]);

  const handleComment = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!newComment.trim()) return;

    try {
      await addComment(recipe!.id, user.id, newComment.trim());
      setNewComment("");
      toast({
        title: "Comment added",
        description: "Your comment has been posted successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading recipe...</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Recipe not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {showAuthModal && (
        <AuthModal mode="sign-in" onSuccess={() => setShowAuthModal(false)} />
      )}
      <div className="max-w-4xl mx-auto px-4">
        <Card className="bg-white overflow-hidden">
          <div className="relative h-[400px]">
            <img
              src={recipe.image_url}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-10 w-10 border-2 border-white">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${recipe.user_id}`}
                    />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div>
                    <p
                      className="text-sm font-medium hover:underline cursor-pointer"
                      onClick={() => navigate(`/user/${recipe.user_id}`)}
                    >
                      {recipe.user?.username || recipe.user_id.split("-")[0]}
                    </p>
                    <p className="text-sm text-white/80">
                      {new Date(recipe.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
                <p className="text-white/90 mb-4">{recipe.description}</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-6">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (!user) {
                      setShowAuthModal(true);
                      return;
                    }
                    // Handle like
                  }}
                >
                  <Heart className="h-6 w-6" />
                  <span className="ml-2">{recipe.likes}</span>
                </Button>
                <Button variant="ghost" size="icon">
                  <MessageCircle className="h-6 w-6" />
                  <span className="ml-2">{recipe.comments.length}</span>
                </Button>
                <Button variant="ghost" size="icon">
                  <Share2 className="h-6 w-6" />
                </Button>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon">
                  <Printer className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={async () => {
                    if (!user) {
                      setShowAuthModal(true);
                      return;
                    }
                    try {
                      const isSaved = await toggleRecipeSave(
                        recipe.id,
                        user.id,
                      );
                      setRecipe((prev) =>
                        prev
                          ? {
                              ...prev,
                              saves: isSaved ? prev.saves + 1 : prev.saves - 1,
                            }
                          : null,
                      );
                    } catch (error) {
                      console.error("Error toggling save:", error);
                    }
                  }}
                >
                  <BookmarkPlus className="h-6 w-6" />
                  <span className="ml-2">{recipe.saves}</span>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Total Time</p>
                  <p className="font-medium">
                    {recipe.prep_time + recipe.cook_time} mins
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Servings</p>
                  <p className="font-medium">{recipe.servings}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ChefHat className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Difficulty</p>
                  <p className="font-medium">{recipe.difficulty}</p>
                </div>
              </div>
            </div>

            <Separator className="my-8" />

            <div>
              <h2 className="text-2xl font-semibold mb-4">Instructions</h2>
              <div className="space-y-6">
                {recipe.instructions.map((step) => (
                  <div key={step.number} className="flex gap-4">
                    <div className="flex-none">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-medium">
                        {step.number}
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-800">{step.instruction}</p>
                      {step.tip && (
                        <p className="text-sm text-muted-foreground mt-2 italic">
                          Tip: {step.tip}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="my-8" />

            <div>
              <h2 className="text-2xl font-semibold mb-4">Comments</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <Avatar>
                    <AvatarImage
                      src={
                        user
                          ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`
                          : undefined
                      }
                    />
                    <AvatarFallback>?</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder={
                        user ? "Add a comment..." : "Sign in to comment"
                      }
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      disabled={!user}
                      className="mb-2"
                    />
                    <Button
                      onClick={handleComment}
                      disabled={!user || !newComment.trim()}
                    >
                      Post Comment
                    </Button>
                  </div>
                </div>

                {recipe.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-4">
                    <Avatar>
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user_id}`}
                      />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div>
                      <p
                        className="font-medium hover:underline cursor-pointer"
                        onClick={() => navigate(`/user/${comment.user_id}`)}
                      >
                        {comment.user_id.split("-")[0]}
                      </p>
                      <p className="text-gray-600">{comment.content}</p>
                      <p className="text-sm text-gray-400 mt-1">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RecipeDetail;
