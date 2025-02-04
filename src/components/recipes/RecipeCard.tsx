import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AuthModal } from "@/components/auth/AuthModal";
import CommentsModal from "./CommentsModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Heart,
  MessageCircle,
  Share2,
  BookmarkPlus,
  Clock,
  Users,
  ChefHat,
  Calendar,
} from "lucide-react";
import { toggleRecipeLike, toggleRecipeSave } from "@/lib/api";
import { format } from "date-fns";
import { RecipeCardProps } from "@/types";

const RecipeCard = ({
  id = "1",
  title = "Delicious Recipe",
  image = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
  prepTime = "20 mins",
  cookTime = "30 mins",
  servings = 4,
  difficulty = "Medium",
  likes = 0,
  saves = 0,
  comments = 0,
  isLiked = false,
  isSaved = false,
  author_id = "default",
  username = "Chef",
}: RecipeCardProps) => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(isLiked);
  const [saved, setSaved] = useState(isSaved);
  const [likesCount, setLikesCount] = useState(likes);
  const [savesCount, setSavesCount] = useState(saves);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<Date>();
  const [customName, setCustomName] = useState("");
  const { user } = useAuth();

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking like
    if (!user) {
      setDialogOpen(true);
      return;
    }
    try {
      const isLiked = await toggleRecipeLike(id, user.id);
      setLiked(isLiked);
      setLikesCount((prev) => (isLiked ? prev + 1 : prev - 1));
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      setDialogOpen(true);
      return;
    }
    setSaveDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      const isSaved = await toggleRecipeSave(
        id,
        user.id,
        scheduledDate
          ? format(scheduledDate, "yyyy-MM-dd'T'HH:mm:ssxxx")
          : undefined,
        customName || undefined,
      );
      setSaved(isSaved);
      setSavesCount((prev) => (isSaved ? prev + 1 : prev - 1));
    } catch (error) {
      console.error("Error toggling save:", error);
    } finally {
      setSaveDialogOpen(false);
      setScheduledDate(undefined);
      setCustomName("");
    }
  };

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign in required</DialogTitle>
            <DialogDescription>
              Please sign in to interact with recipes
            </DialogDescription>
          </DialogHeader>
          <AuthModal mode="sign-in" onSuccess={() => setDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Recipe</DialogTitle>
            <DialogDescription>
              Schedule when you want to cook this recipe
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Custom Name (Optional)</Label>
              <Input
                placeholder="E.g. Sunday Dinner"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Schedule Date (Optional)</Label>
              <CalendarComponent
                mode="single"
                selected={scheduledDate}
                onSelect={setScheduledDate}
                className="rounded-md border"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Recipe</Button>
          </div>
        </DialogContent>
      </Dialog>

      <CommentsModal
        open={commentsOpen}
        onOpenChange={setCommentsOpen}
        recipeId={id}
        recipeTitle={title}
      />

      <Card
        className="group cursor-pointer overflow-hidden"
        onClick={() => navigate(`/recipe/${id}`)}
      >
        <CardContent className="p-0">
          <div className="relative aspect-[4/3]">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <div className="flex justify-between">
                  <div className="flex flex-col">
                    <h3 className="text-xl font-semibold mb-2">{title}</h3>
                    <div className="flex gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" /> {prepTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" /> {servings}
                      </span>
                      <span className="flex items-center gap-1">
                        <ChefHat className="h-4 w-4" /> {difficulty}
                      </span>
                    </div>
                  </div>
                  <div
                    className="flex items-center gap-2 mb-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/user/${author_id}`);
                    }}
                  >
                    <Avatar className="flex flex-col h-8 w-8 border-2 border-white">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${author_id}`}
                      />
                      <AvatarFallback>{username[0]}</AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-medium hover:underline cursor-pointer">
                      {username}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLike}
                className={liked ? "text-red-500" : ""}
              >
                <Heart
                  className="h-5 w-5"
                  fill={liked ? "currentColor" : "none"}
                />
                <span className="ml-1">{likesCount}</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  setCommentsOpen(true);
                }}
              >
                <MessageCircle className="h-5 w-5" />
                <span className="ml-1">{comments}</span>
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSaveClick}
              className={saved ? "text-blue-500" : ""}
            >
              <BookmarkPlus
                className="h-5 w-5"
                fill={saved ? "currentColor" : "none"}
              />
              <span className="ml-1">{savesCount}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default RecipeCard;
