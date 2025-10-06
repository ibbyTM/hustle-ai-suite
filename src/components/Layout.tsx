import { Link, useLocation } from "react-router-dom";
import { Zap, TrendingUp, DollarSign, Grid3x3 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    { path: "/", icon: Grid3x3, label: "Dashboard" },
    { path: "/my-hustles", icon: TrendingUp, label: "My Hustles" },
    { path: "/affiliate", icon: DollarSign, label: "Affiliate" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-gradient-primary p-2 rounded-xl animate-glow-pulse">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  HustleHub 2.0
                </h1>
                <p className="text-xs text-muted-foreground">Automate your hustle</p>
              </div>
            </Link>

            <nav className="flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isActive(item.path)
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
              <Link to="/pricing">
                <Button variant="gradient" className="font-semibold">
                  Upgrade
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};
