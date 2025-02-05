import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/lib/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";
import { useToast } from "@/components/ui/use-toast";
import { addComment, getRecipeComments } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { RecipeComment } from "@/types";

interface CommentsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipeId: string;
  recipeTitle: string;
}

const CommentsModal = ({
  open,
  onOpenChange,
  recipeId,
  recipeTitle,
}: CommentsModalProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<RecipeComment[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (open && recipeId) {
      getRecipeComments(recipeId).then(setComments);
    }
  }, [open, recipeId]);

  const handleComment = async () => {
    if (!user) {
      setDialogOpen(true);
      return;
    }

    if (!newComment.trim()) return;

    try {
      const comment = await addComment(recipeId, user.id, newComment.trim());
      setComments((prev) => [comment, ...prev]);
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

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign in required</DialogTitle>
          </DialogHeader>
          <AuthModal mode="sign-in" onSuccess={() => setDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Comments on {recipeTitle}</DialogTitle>
          </DialogHeader>

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
                  placeholder={user ? "Add a comment..." : "Sign in to comment"}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="mb-2"
                  onClick={() => {
                    if (!user) setDialogOpen(true);
                  }}
                />
                <Button
                  onClick={handleComment}
                  disabled={!user || !newComment.trim()}
                >
                  Post Comment
                </Button>
              </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto space-y-4">
              {comments.map((comment) => (
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
                      {comment.user?.full_name}
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
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CommentsModal;
