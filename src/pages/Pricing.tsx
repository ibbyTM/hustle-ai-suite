import { Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Pricing() {
  const tiers = [
    {
      name: "Free",
      price: "£0",
      period: "forever",
      description: "Get started with basic tools",
      features: [
        "Access to Trend Finder 2.0",
        "Access to Biz-Idea Reactor",
        "Save up to 5 hustles",
        "Community support",
      ],
      cta: "Current Plan",
      gradient: false,
    },
    {
      name: "Pro",
      price: "£19",
      period: "per month",
      description: "Unlock all the tools you need",
      features: [
        "All 12 automation tools",
        "Unlimited saved hustles",
        "Priority support",
        "Export to Notion",
        "Early access to new tools",
      ],
      cta: "Upgrade to Pro",
      gradient: true,
      popular: true,
    },
    {
      name: "Partner",
      price: "£39",
      period: "per month",
      description: "Pro + earn commissions",
      features: [
        "Everything in Pro",
        "40% affiliate commissions",
        "Custom affiliate dashboard",
        "Exclusive partner community",
        "Monthly bonus contests",
      ],
      cta: "Become a Partner",
      gradient: true,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
          Choose Your Hustle Tier
        </h1>
        <p className="text-xl text-muted-foreground">
          Start free. Scale when you're ready. Stack commissions as a partner.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`relative bg-gradient-card border rounded-2xl p-8 ${
              tier.popular ? "border-primary shadow-glow scale-105" : "border-border"
            }`}
          >
            {tier.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-gradient-primary px-4 py-1 rounded-full text-sm font-semibold text-white">
                  Most Popular
                </span>
              </div>
            )}

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
              <div className="flex items-baseline justify-center gap-1 mb-2">
                <span className="text-5xl font-bold">{tier.price}</span>
                <span className="text-muted-foreground">/{tier.period}</span>
              </div>
              <p className="text-muted-foreground text-sm">{tier.description}</p>
            </div>

            <ul className="space-y-3 mb-8">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              className={`w-full`}
              variant={tier.gradient ? "gradient" : "secondary"}
            >
              {tier.cta}
            </Button>
          </div>
        ))}
      </div>

      <div className="bg-gradient-card border border-border rounded-2xl p-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Zap className="h-8 w-8 text-primary" />
          <h2 className="text-3xl font-bold">Ready to level up?</h2>
        </div>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Join thousands of hustlers automating their way to £10K months. No fluff, just tools that actually work.
        </p>
        <Button variant="gradient" size="lg">
          Start Your Free Trial
        </Button>
      </div>
    </div>
  );
}
