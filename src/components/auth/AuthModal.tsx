import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInWithEmail, signUpWithEmail } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";

interface AuthModalProps {
  trigger?: React.ReactNode;
  mode?: "sign-in" | "sign-up";
  onSuccess?: () => void;
}

export function AuthModal({
  trigger,
  mode: initialMode = "sign-in",
  onSuccess,
}: AuthModalProps) {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "sign-in") {
        await signInWithEmail(email, password);
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
      } else {
        await signUpWithEmail(email, password);
        toast({
          title: "Welcome!",
          description: "Your account has been created successfully.",
        });
      }
      onSuccess?.();
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

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || <Button>Sign In</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "sign-in" ? "Sign In" : "Create Account"}
          </DialogTitle>
          <DialogDescription>
            {mode === "sign-in"
              ? "Welcome back! Sign in to your account."
              : "Create a new account to get started."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Button type="submit" disabled={loading}>
              {loading
                ? "Loading..."
                : mode === "sign-in"
                  ? "Sign In"
                  : "Create Account"}
            </Button>
            <Button
              type="button"
              variant="link"
              onClick={() =>
                setMode(mode === "sign-in" ? "sign-up" : "sign-in")
              }
            >
              {mode === "sign-in"
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
