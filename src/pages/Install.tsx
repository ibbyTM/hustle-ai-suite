import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Smartphone, Check, Zap, TrendingUp, Database } from "lucide-react";
import { toast } from "sonner";

export default function Install() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      toast.success("App installed successfully!");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      toast.info("Installation is available through your browser menu");
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      toast.success("Installing app...");
    }

    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12 animate-fade-in">
          <div className="mb-6">
            <Smartphone className="h-20 w-20 mx-auto text-primary animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Install Hustle Lab
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get the full app experience with offline access, faster loading, and home screen convenience
          </p>
        </div>

        {isInstalled ? (
          <Card className="p-8 bg-gradient-card border-border text-center animate-scale-in">
            <Check className="h-16 w-16 mx-auto text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Already Installed!</h2>
            <p className="text-muted-foreground mb-6">
              You're all set. Open Hustle Lab from your home screen anytime.
            </p>
            <Button variant="outline" onClick={() => window.location.href = "/dashboard"}>
              Go to Dashboard
            </Button>
          </Card>
        ) : (
          <>
            <Card className="p-8 bg-gradient-card border-border mb-8 animate-fade-in">
              <div className="text-center mb-8">
                {isInstallable ? (
                  <Button
                    size="lg"
                    variant="gradient"
                    onClick={handleInstallClick}
                    className="gap-2 text-lg px-8 py-6"
                  >
                    <Download className="h-5 w-5" />
                    Install App Now
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      To install on mobile:
                    </p>
                    <div className="space-y-2 text-sm">
                      <p><strong>iPhone:</strong> Tap Share → Add to Home Screen</p>
                      <p><strong>Android:</strong> Tap Menu (⋮) → Install App / Add to Home Screen</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="text-center p-4">
                  <Zap className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold mb-2">Lightning Fast</h3>
                  <p className="text-sm text-muted-foreground">
                    Instant loading with offline support
                  </p>
                </div>
                <div className="text-center p-4">
                  <Database className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold mb-2">Offline Access</h3>
                  <p className="text-sm text-muted-foreground">
                    View your hustles without internet
                  </p>
                </div>
                <div className="text-center p-4">
                  <TrendingUp className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold mb-2">Native Feel</h3>
                  <p className="text-sm text-muted-foreground">
                    App-like experience on any device
                  </p>
                </div>
              </div>
            </Card>

            <div className="text-center">
              <Button variant="ghost" onClick={() => window.location.href = "/dashboard"}>
                Skip for now
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}