import { Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSubscription, TIER_CONFIG } from "@/hooks/useSubscription";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import PromoCodeInput from "@/components/PromoCodeInput";

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
      price: "£40",
      period: "per month",
      description: "Get All The Tools",
      features: [
        "All 16+ automation agents",
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
      price: "£75",
      period: "per month",
      description: "Earn While You Hustle",
      features: [
        "Everything in Plus",
        "Affiliate dashboard access",
        "35% commission on referrals",
        "Give 50% off Plus to your referrals",
        "Partner badge & recognition",
        "Early beta access",
        "Co-creation opportunities",
      ],
      priceId: TIER_CONFIG.partner.priceId,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-primary bg-clip-text text-transparent">
          Choose Your Plan
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground px-4">
          Free to explore. Plus to unlock everything. Partner to earn while you build.
        </p>
      </div>

      {user && tier === "free" && (
        <div className="bg-gradient-card border border-border rounded-2xl p-6 mb-8 max-w-md mx-auto">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold mb-2">Have a promo code?</h3>
            <p className="text-sm text-muted-foreground">Unlock premium access instantly</p>
          </div>
          <PromoCodeInput />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
        {tiers.map((tierData) => {
          const isCurrentPlan = tier === tierData.tierKey;
          
          return (
            <div
              key={tierData.name}
              className={`relative bg-gradient-card border rounded-2xl p-6 sm:p-8 ${
                tierData.popular ? "border-primary shadow-glow md:scale-105" : "border-border"
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
                <h3 className="text-xl sm:text-2xl font-bold mb-2">{tierData.name}</h3>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-4xl sm:text-5xl font-bold">{tierData.price}</span>
                  <span className="text-muted-foreground text-sm">/{tierData.period}</span>
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

      <div className="bg-gradient-card border border-border rounded-2xl p-6 sm:p-8 text-center">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-4">
          <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">Ready to unlock everything?</h2>
        </div>
        <p className="text-sm sm:text-base text-muted-foreground mb-6 max-w-2xl mx-auto px-4">
          Join thousands of creators automating their hustle. No fluff, just tools that work.
        </p>
        <Button 
          variant="gradient" 
          size="lg"
          onClick={() => user ? handleUpgrade(TIER_CONFIG.pro.priceId) : navigate("/auth")}
          disabled={isLoading}
          className="min-h-[44px]"
        >
          {user ? "Get Plus Now" : "Start Free"}
        </Button>
      </div>
    </div>
  );
}
