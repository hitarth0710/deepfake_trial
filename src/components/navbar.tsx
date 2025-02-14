import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { DocumentationDialog } from "./dialogs/DocumentationDialog";
import { PricingDialog } from "./dialogs/PricingDialog";
import { ProfileDialog } from "./dialogs/ProfileDialog";

export default function Navbar() {
  const { user } = useAuth();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 w-full border-b bg-background/60 backdrop-blur-md z-50">
      <div className="container flex h-16 items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 hover:opacity-80 hover:scale-105 transition-all duration-200"
        >
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold">M</span>
          </div>
          <span className="font-bold">MaskOff</span>
        </Link>
        <div className="flex items-center gap-4">
          <DocumentationDialog />
          <PricingDialog />
          {user ? (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/dashboard")}
                className="hover:scale-105 transition-all duration-200"
              >
                Dashboard
              </Button>
              <ProfileDialog />
              <Button
                size="sm"
                variant="outline"
                onClick={handleSignOut}
                className="hover:scale-105 transition-all duration-200"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              onClick={() => navigate("/sign-in")}
              className="hover:scale-105 transition-all duration-200"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
