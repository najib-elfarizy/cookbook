import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Search, PlusSquare, BookmarkIcon, User } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

const BottomNav = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Search, label: "Search", path: "/categories" },
    { icon: PlusSquare, label: "Create", path: "/create" },
    { icon: BookmarkIcon, label: "Saved", path: "/saved", requiresAuth: true },
    { icon: User, label: "Profile", path: "/profile", requiresAuth: true },
  ].filter((item) => !item.requiresAuth || user);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t py-2 px-4 flex justify-around items-center">
      {navItems.map(({ icon: Icon, label, path }) => (
        <Button
          key={path}
          variant="ghost"
          className={`flex flex-col items-center gap-1 h-auto py-2 ${isActive(path) ? "text-primary" : "text-gray-500"}`}
          onClick={() => navigate(path)}
        >
          <Icon className="h-5 w-5" />
          <span className="text-xs">{label}</span>
        </Button>
      ))}
    </div>
  );
};

export default BottomNav;
