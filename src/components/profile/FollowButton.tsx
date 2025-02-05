import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { toggleFollow } from "@/lib/api";

interface FollowButtonProps {
  userId: string;
  isFollowing: boolean;
  onFollowChange?: (isFollowing: boolean) => void;
}

const FollowButton = ({
  userId,
  isFollowing: initialIsFollowing,
  onFollowChange,
}: FollowButtonProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);

  const handleToggleFollow = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const following = await toggleFollow(userId);
      setIsFollowing(following);
      onFollowChange?.(following);

      toast({
        title: following ? "Following" : "Unfollowed",
        description: following
          ? "You are now following this user"
          : "You have unfollowed this user",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (user?.id === userId) return null;

  return (
    <Button
      variant={isFollowing ? "outline" : "default"}
      onClick={handleToggleFollow}
      disabled={loading}
      size="sm"
    >
      {loading ? "Loading..." : isFollowing ? "Following" : "Follow"}
    </Button>
  );
};

export default FollowButton;
