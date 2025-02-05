import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { getFollowers, getFollowing } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import FollowButton from "./FollowButton";

interface FollowListProps {
  userId: string;
  type: "followers" | "following";
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FollowList = ({ userId, type, open, onOpenChange }: FollowListProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      setLoading(true);
      const fetchUsers = type === "followers" ? getFollowers : getFollowing;
      fetchUsers(userId)
        .then(setUsers)
        .catch((error) => {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        })
        .finally(() => setLoading(false));
    }
  }, [userId, type, open, toast]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {type === "followers" ? "Followers" : "Following"}
          </DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="py-8 text-center text-muted-foreground">
            Loading...
          </div>
        ) : users.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            {type === "followers"
              ? "No followers yet"
              : "Not following anyone yet"}
          </div>
        ) : (
          <ScrollArea className="max-h-[400px]">
            <div className="space-y-4 p-1">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-2 hover:bg-accent rounded-lg"
                >
                  <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => {
                      navigate(`/user/${user.id}`);
                      onOpenChange(false);
                    }}
                  >
                    <Avatar>
                      <AvatarImage
                        src={
                          user.avatar_url ??
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`
                        }
                      />
                      <AvatarFallback>{user.full_name?.[0]}</AvatarFallback>
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
                      setUsers((prev) =>
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
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FollowList;
