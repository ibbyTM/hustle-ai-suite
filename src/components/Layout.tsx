import { Link, useLocation, useNavigate } from "react-router-dom";
import { TrendingUp, DollarSign, Grid3x3, LogOut, Database, Menu, Download, GraduationCap, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { toast } from "sonner";
import hustleLabLogo from "@/assets/hustle-lab-logo.png";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { ChatWidget } from "./ChatWidget";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { tier } = useSubscription();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  
  const showUpgrade = tier === "free";

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setShowInstallPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate("/auth");
  };
  
  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    { path: "/dashboard", icon: Grid3x3, label: "Dashboard" },
    { path: "/my-hustles", icon: TrendingUp, label: "My Hustles" },
    { path: "/knowledge-bases", icon: Database, label: "Knowledge Bases" },
    { path: "/course-guides", icon: GraduationCap, label: "Courses" },
    { path: "/learn", icon: BookOpen, label: "Learn", hidden: true },
    { path: "/affiliate", icon: DollarSign, label: "Affiliate" },
  ];

  const shouldHideHeader = location.pathname === '/' || location.pathname === '/auth';

  return (
    <div className="min-h-screen bg-background">
      {!shouldHideHeader && (
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <Link to="/dashboard" className="flex items-center gap-2 sm:gap-3 group">
                <img 
                  src={hustleLabLogo} 
                  alt="Hustle Lab Logo" 
                  className="h-8 sm:h-10 md:h-12 w-auto"
                />
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
                {navItems.filter(item => !item.hidden).map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-3 xl:px-4 py-2 rounded-lg transition-all ${
                      isActive(item.path)
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="font-medium text-sm xl:text-base">{item.label}</span>
                  </Link>
                ))}

                {user ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSignOut}
                    className="gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden xl:inline">Sign Out</span>
                  </Button>
                ) : (
                  <Link to="/auth">
                    <Button variant="outline" size="sm">
                      Sign In
                    </Button>
                  </Link>
                )}

                {showUpgrade && (
                  <Link to="/pricing">
                    <Button variant="gradient" className="font-semibold" size="sm">
                      Upgrade
                    </Button>
                  </Link>
                )}

                {showInstallPrompt && (
                  <Link to="/install">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="h-4 w-4" />
                      <span className="hidden xl:inline">Install App</span>
                    </Button>
                  </Link>
                )}
              </nav>

              {/* Mobile Navigation */}
              <div className="flex lg:hidden items-center gap-2">
                {showUpgrade && (
                  <Link to="/pricing">
                    <Button variant="gradient" size="sm" className="text-xs px-3">
                      Upgrade
                    </Button>
                  </Link>
                )}
                <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                      <Menu className="h-5 w-5" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-72 bg-card">
                    <nav className="flex flex-col gap-4 mt-8">
                      {navItems.filter(item => !item.hidden).map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setSheetOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all min-h-[44px] ${
                            isActive(item.path)
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                          }`}
                        >
                          <item.icon className="h-5 w-5" />
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      ))}

                      <div className="border-t border-border pt-4 mt-2">
                        {user ? (
                          <Button
                            variant="outline"
                            className="w-full gap-2 min-h-[44px]"
                            onClick={() => {
                              handleSignOut();
                              setSheetOpen(false);
                            }}
                          >
                            <LogOut className="h-4 w-4" />
                            Sign Out
                          </Button>
                        ) : (
                          <Link to="/auth" onClick={() => setSheetOpen(false)}>
                            <Button variant="outline" className="w-full min-h-[44px]">
                              Sign In
                            </Button>
                          </Link>
                        )}
                      </div>
                    </nav>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </header>
      )}

      <main className={shouldHideHeader ? "" : "container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8"}>
        {children}
      </main>
      {user && !shouldHideHeader && <ChatWidget />}
    </div>
  );
};
