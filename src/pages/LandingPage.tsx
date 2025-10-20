import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { automations } from "@/data/automations";
import { AutomationCard } from "@/components/AutomationCard";
import hustleLabLogo from "@/assets/hustle-lab-logo.png";
import {
  Sparkles, 
  Zap, 
  Target, 
  CheckCircle2,
  ArrowRight,
  ArrowDown,
  ArrowUp,
  Users
} from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect logged-in users to dashboard
  if (user) {
    navigate("/dashboard");
    return null;
  }

  // Featured tools and expandable state
  const [showAllTools, setShowAllTools] = useState(false);
  const featuredToolIds = ["biz-idea", "hook-factory", "ad-copy-lab", "bookforge", "trend-finder", "offer-builder"];
  const featuredTools = automations.filter(tool => featuredToolIds.includes(tool.id));
  const displayedTools = showAllTools ? automations : featuredTools;

  const steps = [
    {
      number: "01",
      title: "Pick a Tool",
      description: "Choose from our suite of AI-powered automation tools built for modern creators."
    },
    {
      number: "02",
      title: "Customize",
      description: "Input your preferences and let our AI understand your unique business goals."
    },
    {
      number: "03",
      title: "Automate",
      description: "Watch your hustle grow on autopilot. No coding, no complexity, just results."
    }
  ];

  const testimonials = [
    {
      name: "Alex Rivera",
      handle: "@alexbuilds",
      quote: "Hustle Lab saved me 20+ hours a week. My content game is on autopilot now.",
      avatar: "A"
    },
    {
      name: "Jordan Kim",
      handle: "@jordanscale",
      quote: "From $0 to $10k/month in 3 months. The automations are insanely powerful.",
      avatar: "J"
    },
    {
      name: "Taylor Morgan",
      handle: "@taylorcreates",
      quote: "Finally, a platform that actually gets what young entrepreneurs need. Game changer.",
      avatar: "T"
    }
  ];

  const pricingTiers = [
    {
      name: "Free",
      price: "£0",
      period: "/forever",
      features: [
        "Biz-Idea Reactor",
        "Hook Factory (Lite)",
        "Trend Finder 2.0 (Preview)",
        "Inbox Influence Newsletter",
        "3 generations per day"
      ],
      popular: false
    },
    {
      name: "Plus",
      price: "£40",
      period: "/month",
      features: [
        "All 16+ automation agents",
        "Unlimited generations",
        "Save & export features",
        "Priority support",
        "Monthly bonus drops",
        "Early access to new tools"
      ],
      popular: true
    },
    {
      name: "Partner",
      price: "£75",
      period: "/month",
      features: [
        "Everything in Plus",
        "Affiliate dashboard access",
        "35% commission on referrals",
        "Give 25% off Plus to your referrals",
        "Partner badge & recognition",
        "Early beta access",
        "Co-creation opportunities"
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/50 animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <img 
                src={hustleLabLogo} 
                alt="Hustle Lab Logo" 
                className="h-10 w-auto"
              />
            </Link>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={() => navigate('/auth')}
                className="border-primary/30 hover:bg-primary/10"
              >
                Sign In
              </Button>
              <Button 
                variant="gradient"
                onClick={() => navigate('/auth')}
                className="font-semibold"
              >
                Sign Up Free
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-4 py-20 md:py-32 overflow-hidden mt-16">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.15),transparent_50%)]" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center animate-fade-in">
            <Badge className="mb-6 bg-primary/20 text-primary border-primary/30" variant="outline">
              <Sparkles className="w-3 h-3 mr-1" />
              16 AI Tools • Built for Hustlers
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent leading-tight">
              Build, Automate,<br />and Grow — All in One Hub.
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              Hustle Lab gives you 16 ready-to-use automations and AI tools to grow faster — without code.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 bg-gradient-primary hover:shadow-glow-primary"
                onClick={() => navigate('/auth')}
              >
                Start Free
                <Zap className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-6 border-primary/30 hover:bg-primary/10"
                onClick={() => {
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                See Tools
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Visual Element */}
          <div className="mt-16 relative animate-scale-in">
            <div className="absolute inset-0 bg-gradient-primary blur-3xl opacity-20" />
            <div className="relative bg-gradient-card border border-primary/20 rounded-2xl p-8 shadow-glow">
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div 
                    key={i} 
                    className="h-20 bg-primary/10 rounded-lg animate-glow-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 py-20 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="outline">
              Simple Process
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground">
              Three steps to automate your hustle
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <Card 
                key={index} 
                className="bg-gradient-card border-primary/20 hover:border-primary/40 transition-all hover:shadow-glow"
              >
                <CardContent className="p-8">
                  <div className="text-6xl font-bold text-primary/20 mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* All Automation Tools Section */}
      <section id="features" className="px-4 py-20 bg-background/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="outline">
              <Target className="w-3 h-3 mr-1" />
              All Automation Tools
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              All Your Tools in <span className="bg-gradient-primary bg-clip-text text-transparent">One Place</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              16 AI-powered agents designed to save you time and make you money
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {displayedTools.map((tool) => (
              <AutomationCard
                key={tool.id}
                tool={tool}
                onClick={() => navigate("/auth")}
                isLocked={false}
              />
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <Button
              onClick={() => setShowAllTools(!showAllTools)}
              variant="gradient"
              size="lg"
              className="group"
            >
              {showAllTools ? (
                <>
                  Show Less
                  <ArrowUp className="ml-2 h-5 w-5 group-hover:-translate-y-1 transition-transform" />
                </>
              ) : (
                <>
                  View All 16 Tools
                  <ArrowDown className="ml-2 h-5 w-5 group-hover:translate-y-1 transition-transform" />
                </>
              )}
            </Button>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="px-4 py-20 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="outline">
              <Users className="w-3 h-3 mr-1" />
              Trusted by Creators
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Don't Just Take Our Word
            </h2>
            <p className="text-xl text-muted-foreground">
              See what hustlers are saying about Hustle Lab
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index}
                className="bg-gradient-card border-primary/20"
              >
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-lg">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.handle}</div>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic">
                    "{testimonial.quote}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="outline">
              Flexible Pricing
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Choose Your Growth Plan
            </h2>
            <p className="text-xl text-muted-foreground">
              Start free. Scale when you're ready.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <Card 
                key={index}
                className={`relative ${
                  tier.popular 
                    ? 'border-primary shadow-glow-primary bg-gradient-card' 
                    : 'bg-gradient-card border-primary/20'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-primary text-white">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                  <div className="flex items-baseline mb-6">
                    <span className="text-5xl font-bold">{tier.price}</span>
                    <span className="text-muted-foreground ml-2">{tier.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${
                      tier.popular 
                        ? 'bg-gradient-primary hover:shadow-glow-primary' 
                        : 'bg-primary/10 hover:bg-primary/20'
                    }`}
                    onClick={() => navigate('/auth')}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-20 bg-gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1),transparent_70%)]" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            Join the Next-Gen of<br />Digital Hustlers
          </h2>
          <p className="text-xl text-white/90 mb-10">
            Start automating your business today. No credit card required.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-primary hover:bg-white/90 text-lg px-12 py-6"
            onClick={() => navigate('/auth')}
          >
            Start Free — No Credit Card Needed
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-sm text-white/70 mt-6">
            Join 10,000+ creators already building with Hustle Lab
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary/50 border-t border-border/50 px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Branding */}
            <div className="md:col-span-1">
              <Link to="/" className="flex items-center gap-3 mb-4">
                <img 
                  src={hustleLabLogo} 
                  alt="Hustle Lab Logo" 
                  className="h-8 w-auto"
                />
              </Link>
              <p className="text-sm text-muted-foreground">
                AI-powered tools for modern creators
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4 text-foreground">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link to="/course-guides" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Course Guides
                  </Link>
                </li>
                <li>
                  <Link to="/affiliate" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Affiliate Program
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold mb-4 text-foreground">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <span className="text-sm text-muted-foreground/50">
                    Terms of Service (Coming Soon)
                  </span>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold mb-4 text-foreground">Contact</h3>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="mailto:ibby@nexusedge.tech" 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    ibby@nexusedge.tech
                  </a>
                </li>
                <li>
                  <a 
                    href="tel:07447187138" 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    07447 187138
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-border/50 text-center">
            <p className="text-sm text-muted-foreground">
              © 2025 HustleLab. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
