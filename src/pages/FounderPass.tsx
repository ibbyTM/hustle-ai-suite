import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription, TIER_CONFIG } from "@/hooks/useSubscription";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Users, TrendingUp, Shield, Sparkles, Crown, Rocket } from "lucide-react";
import { toast } from "sonner";

const CountdownTimer = ({ targetDate }: { targetDate: Date }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex gap-4 justify-center">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="flex flex-col items-center">
          <div className="bg-card border border-primary/20 rounded-lg p-4 min-w-[80px]">
            <span className="text-3xl font-bold text-primary">{value}</span>
          </div>
          <span className="text-xs text-muted-foreground mt-2 uppercase">{unit}</span>
        </div>
      ))}
    </div>
  );
};

const FounderPass = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { tier, createCheckout, isLoading } = useSubscription();
  
  const handleClaimPass = async () => {
    if (!user) {
      navigate("/auth?returnUrl=/founder-pass");
      return;
    }

    if (tier === "partner") {
      toast.success("You already have Partner access!");
      navigate("/dashboard");
      return;
    }

    try {
      await createCheckout(TIER_CONFIG.partner.priceId);
      toast.success("Redirecting to checkout...");
    } catch (error) {
      toast.error("Failed to start checkout. Please try again.");
    }
  };

  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 7);

  const benefits = [
    {
      icon: Zap,
      title: "16+ AI Hustle Agents",
      description: "Lifetime access to all current and future AI tools",
    },
    {
      icon: TrendingUp,
      title: "35% Recurring Commissions",
      description: "Personal affiliate dashboard to track your earnings",
    },
    {
      icon: Sparkles,
      title: "Early Access",
      description: "Be first to test new AI tools before public release",
    },
    {
      icon: Users,
      title: "Private Creator Network",
      description: "Direct support and exclusive community access",
    },
  ];

  const bonuses = [
    { icon: Crown, text: "Priority support line" },
    { icon: Rocket, text: "Exclusive affiliate strategies" },
    { icon: Shield, text: "Insider drops on new tools" },
  ];

  const testimonials = [
    {
      quote: "I made my first £100 in a week using HustleLab!",
      author: "Sarah M.",
      role: "Content Creator",
    },
    {
      quote: "The AI tools saved me 20 hours a week. Game changer.",
      author: "Mike R.",
      role: "Digital Marketer",
    },
    {
      quote: "35% recurring commissions are better than most affiliate programs.",
      author: "Alex K.",
      role: "Influencer",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center space-y-6">
            <Badge className="mb-4 text-sm px-4 py-1">Limited Offer</Badge>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
              Unlock Your AI Syndicate
              <br />
              <span className="text-primary">Founder Pass</span>
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Lifetime access. 35% recurring income. Only 50 creator spots.
            </p>
            <Button
              size="lg"
              variant="gradient"
              className="text-lg px-8 py-6 mt-8"
              onClick={handleClaimPass}
              disabled={isLoading}
            >
              Claim Your Founder Spot
            </Button>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 bg-card/50">
        <div className="container mx-auto max-w-4xl text-center space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold">Where AI Meets Ambition</h2>
          <p className="text-lg text-muted-foreground">
            HustleLab was built for creators who want to turn automation into income.
            We're opening 50 Founder Passes for early partners to shape the next wave
            of AI-powered influence.
          </p>
        </div>
      </section>

      {/* What You Get Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            What You Get
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card
                key={index}
                className="p-6 hover:border-primary/50 transition-colors"
              >
                <benefit.icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Bonus Add-Ons Section */}
      <section className="py-16 px-4 bg-card/50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            Bonus Add-Ons
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {bonuses.map((bonus, index) => (
              <Card
                key={index}
                className="p-6 text-center hover:scale-105 transition-transform"
              >
                <bonus.icon className="w-10 h-10 text-primary mx-auto mb-3" />
                <p className="font-medium">{bonus.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Urgency Section */}
      <section className="py-16 px-4 bg-destructive/10">
        <div className="container mx-auto max-w-4xl text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Only 50 Lifetime Founder Passes Exist
          </h2>
          <p className="text-lg text-muted-foreground">
            Once they're gone, they're gone.
          </p>
          <CountdownTimer targetDate={targetDate} />
          <div className="w-full max-w-md mx-auto bg-muted rounded-full h-4 overflow-hidden">
            <div className="bg-primary h-full w-2/3 animate-pulse" />
          </div>
          <p className="text-sm text-muted-foreground">
            Approximately 33 spots remaining
          </p>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            What Creators Say
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <p className="text-lg mb-4 italic">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-primary" />
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/20 via-background to-background">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <h2 className="text-4xl sm:text-5xl font-bold">
            Join the AI Syndicate Today
          </h2>
          <p className="text-lg text-muted-foreground">
            Free for life. 35% recurring commissions. No gimmicks.
          </p>
          <Button
            size="lg"
            variant="gradient"
            className="text-lg px-8 py-6 mt-8"
            onClick={handleClaimPass}
            disabled={isLoading}
          >
            Claim Your Founder Pass
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">
            Built in the HustleLab — where AI meets ambition.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default FounderPass;
