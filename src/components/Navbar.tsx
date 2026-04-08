import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Car, Plus, LogIn, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary">
          <Car size={28} />
          <span>Car Point</span>
        </Link>
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link to="/create-ad">
                <Button size="sm">
                  <Plus size={16} className="mr-1" /> Postavi Oglas
                </Button>
              </Link>
              <Link to={`/user/${user!.userId}`}>
                <Button size="sm" variant="outline">
                  <User size={16} className="mr-1" /> {user!.username}
                </Button>
              </Link>
              <Button size="sm" variant="ghost" onClick={handleLogout}>
                <LogOut size={16} className="mr-1" /> Odjavi se
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button size="sm">
                  <LogIn size={16} className="mr-1" /> Prijava
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" variant="outline">
                  Registracija
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
