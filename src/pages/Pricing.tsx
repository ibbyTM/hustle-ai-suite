import { Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSubscription, TIER_CONFIG } from "@/hooks/useSubscription";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Pricing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { tier, createCheckout, openCustomerPortal, isLoading } = useSubscription();

  const handleUpgrade = async (priceId?: string) => {
    if (!user) {
      toast.error("Please sign in to upgrade");
      navigate("/auth");
      return;
    }

    if (!priceId) {
      toast.info("You're already on the free plan");
      return;
    }

    try {
      await createCheckout(priceId);
    } catch (error) {
      toast.error("Failed to start checkout");
      console.error(error);
    }
  };

  const handleManageSubscription = async () => {
    try {
      await openCustomerPortal();
    } catch (error) {
      toast.error("Failed to open subscription management");
      console.error(error);
    }
  };

  const tiers = [
    {
      name: "Free",
      tierKey: "free" as const,
      price: "£0",
      period: "forever",
      description: "Start Exploring",
      features: [
        "Biz-Idea Reactor",
        "Hook Factory (Lite)",
        "Trend Finder 2.0 (Preview)",
        "Inbox Influence Newsletter",
        "3 generations per day",
      ],
      priceId: undefined,
    },
    {
      name: "Plus",
      tierKey: "pro" as const,
      price: "£20",
      period: "per month",
      description: "Get All The Tools",
      features: [
        "All 12+ automation agents",
        "Unlimited generations",
        "Save & export features",
        "Priority support",
        "Monthly bonus drops",
        "Early access to new tools",
      ],
      priceId: TIER_CONFIG.pro.priceId,
      popular: true,
    },
    {
      name: "Partner",
      tierKey: "partner" as const,
      price: "£49",
      period: "per month",
      description: "Earn While You Hustle",
      features: [
        "Everything in Plus",
        "Affiliate dashboard access",
        "40% commission on referrals",
        "Partner badge & recognition",
        "Early beta access",
        "Co-creation opportunities",
      ],
      priceId: TIER_CONFIG.partner.priceId,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
          Choose Your Plan
        </h1>
        <p className="text-xl text-muted-foreground">
          Free to explore. Plus to unlock everything. Partner to earn while you build.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {tiers.map((tierData) => {
          const isCurrentPlan = tier === tierData.tierKey;
          
          return (
            <div
              key={tierData.name}
              className={`relative bg-gradient-card border rounded-2xl p-8 ${
                tierData.popular ? "border-primary shadow-glow scale-105" : "border-border"
              } ${isCurrentPlan ? "ring-2 ring-primary" : ""}`}
            >
              {tierData.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-primary px-4 py-1 rounded-full text-sm font-semibold text-white">
                    Most Popular
                  </span>
                </div>
              )}
              {isCurrentPlan && (
                <div className="absolute -top-4 right-4">
                  <span className="bg-secondary border border-primary px-3 py-1 rounded-full text-xs font-semibold text-primary">
                    Your Plan
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{tierData.name}</h3>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-5xl font-bold">{tierData.price}</span>
                  <span className="text-muted-foreground">/{tierData.period}</span>
                </div>
                <p className="text-muted-foreground text-sm">{tierData.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {tierData.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {isCurrentPlan && tierData.tierKey !== "free" ? (
                <Button
                  className="w-full"
                  variant="secondary"
                  onClick={handleManageSubscription}
                  disabled={isLoading}
                >
                  Manage Subscription
                </Button>
              ) : (
                <Button
                  className="w-full"
                  variant={tierData.priceId ? "gradient" : "secondary"}
                  onClick={() => handleUpgrade(tierData.priceId)}
                  disabled={isLoading || isCurrentPlan}
                >
                  {isCurrentPlan ? "Current Plan" : tierData.priceId ? `Get ${tierData.name}` : "Free Forever"}
                </Button>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-gradient-card border border-border rounded-2xl p-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Zap className="h-8 w-8 text-primary" />
          <h2 className="text-3xl font-bold">Ready to unlock everything?</h2>
        </div>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Join thousands of creators automating their hustle. No fluff, just tools that work.
        </p>
        <Button 
          variant="gradient" 
          size="lg"
          onClick={() => user ? handleUpgrade(TIER_CONFIG.pro.priceId) : navigate("/auth")}
          disabled={isLoading}
        >
          {user ? "Get Plus Now" : "Start Free"}
        </Button>
      </div>
    </div>
  );
}
