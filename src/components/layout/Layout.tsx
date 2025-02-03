import React from "react";
import BottomNav from "./BottomNav";
import Navbar from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen pb-16">
      <Navbar />
      <main className="pt-2">{children}</main>
      <BottomNav />
    </div>
  );
};

export default Layout;
