import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Heart,
  MessageCircle,
  Share2,
  BookmarkPlus,
  MoreHorizontal,
  Clock,
  Users,
  ChefHat,
} from "lucide-react";

interface Comment {
  username: string;
  text: string;
  avatar: string;
  timeAgo: string;
}

interface RecipeCardProps {
  username?: string;
  userAvatar?: string;
  title?: string;
  image?: string;
  likes?: number;
  comments?: Comment[];
  timePosted?: string;
  description?: string;
  isLiked?: boolean;
  isSaved?: boolean;
  cookTime?: string;
  servings?: number;
  difficulty?: string;
  onLike?: () => void;
  onSave?: () => void;
}

const RecipeCard = ({
  username = "ChefJohn",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  title = "Homemade Pizza Masterpiece",
  image = "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3",
  likes = 234,
  comments = [
    {
      username: "foodie123",
      text: "This looks amazing! 😍",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=foodie",
      timeAgo: "1h ago",
    },
    {
      username: "cookingpro",
      text: "What temperature do you bake it at?",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=pro",
      timeAgo: "30m ago",
    },
  ],
  timePosted = "2h ago",
  description = "Finally perfected my pizza dough recipe! The secret is letting it rest for 24 hours. Swipe for the full recipe! 🍕✨ #homemade #cooking #foodie",
  isLiked = false,
  isSaved = false,
  cookTime = "1.5 hours",
  servings = 4,
  difficulty = "Medium",
  onLike = () => {},
  onSave = () => {},
}: RecipeCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");

  const formatDescription = (text: string) => {
    return text.split(" ").map((word, index) =>
      word.startsWith("#") ? (
        <span
          key={index}
          className="text-blue-500 hover:underline cursor-pointer"
        >
          {word}{" "}
        </span>
      ) : (
        word + " "
      ),
    );
  };

  return (
    <Card className="w-full max-w-[500px] bg-white">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={userAvatar} />
              <AvatarFallback>{username[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold">{username}</h4>
              <p className="text-sm text-muted-foreground">{timePosted}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>

        <div className="relative aspect-square mb-4 rounded-md overflow-hidden">
          <img src={image} alt={title} className="w-full h-full object-cover" />
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-3">
            <h3 className="font-semibold text-lg">{title}</h3>
            <div className="flex gap-4 text-sm mt-1">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" /> {cookTime}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" /> {servings} servings
              </span>
              <span className="flex items-center gap-1">
                <ChefHat className="h-4 w-4" /> {difficulty}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onLike}
              className={isLiked ? "text-red-500" : ""}
            >
              <Heart
                className="h-6 w-6"
                fill={isLiked ? "currentColor" : "none"}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageCircle className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon">
              <Share2 className="h-6 w-6" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onSave}
            className={isSaved ? "text-blue-500" : ""}
          >
            <BookmarkPlus
              className="h-6 w-6"
              fill={isSaved ? "currentColor" : "none"}
            />
          </Button>
        </div>

        <div>
          <p className="font-semibold mb-1">{likes.toLocaleString()} likes</p>
          <p>
            <span className="font-semibold">{username}</span>{" "}
            <span className="text-sm">{formatDescription(description)}</span>
          </p>

          {showComments && (
            <div className="mt-4 space-y-4">
              {comments.map((comment, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.avatar} />
                    <AvatarFallback>{comment.username[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">
                        {comment.username}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {comment.timeAgo}
                      </span>
                    </div>
                    <p className="text-sm">{comment.text}</p>
                  </div>
                </div>
              ))}

              <div className="flex items-center gap-2 mt-4">
                <Input
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="text-sm"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={!newComment.trim()}
                  onClick={() => setNewComment("")}
                >
                  Post
                </Button>
              </div>
            </div>
          )}

          {!showComments && comments.length > 0 && (
            <button
              className="text-muted-foreground text-sm mt-2"
              onClick={() => setShowComments(true)}
            >
              View all {comments.length} comments
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecipeCard;
