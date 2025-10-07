import { Copy, TrendingUp, Users, DollarSign, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/hooks/useSubscription";

export default function Affiliate() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { hasPartnerAccess, isLoading: subscriptionLoading } = useSubscription();

  // Fetch user's profile with referral code
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from('profiles')
        .select('referral_code')
        .eq('user_id', user.id)
        .maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  // Fetch affiliate stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['affiliate-stats', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from('affiliate_stats')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  // Fetch leaderboard - anonymized to protect privacy
  const { data: leaderboard } = useQuery({
    queryKey: ['affiliate-leaderboard'],
    queryFn: async () => {
      const { data } = await supabase
        .from('affiliate_stats')
        .select('lifetime_earnings, total_referrals')
        .order('lifetime_earnings', { ascending: false })
        .limit(10);
      return data || [];
    },
  });

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto animate-fade-in text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Sign in to access the Affiliate Program</h2>
        <Button onClick={() => navigate('/auth')}>Sign In</Button>
      </div>
    );
  }

  if (!subscriptionLoading && !hasPartnerAccess) {
    return (
      <div className="max-w-6xl mx-auto animate-fade-in text-center py-12">
        <Lock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Partner Tier Required</h2>
        <p className="text-muted-foreground mb-6">
          The affiliate program is exclusive to Partner tier members. Upgrade to start earning 35% commissions!
        </p>
        <Button onClick={() => navigate('/pricing')} variant="gradient">
          Upgrade to Partner
        </Button>
      </div>
    );
  }

  if (profileLoading || statsLoading) {
    return (
      <div className="max-w-6xl mx-auto animate-fade-in text-center py-12">
        <p className="text-muted-foreground">Loading your affiliate dashboard...</p>
      </div>
    );
  }

  const referralLink = profile?.referral_code 
    ? `${window.location.origin}/?ref=${profile.referral_code}`
    : "Setting up your account...";
  
  const statsDisplay = [
    { label: "Total Referrals", value: stats?.total_referrals?.toString() || "0", icon: Users, color: "text-category-content" },
    { label: "Active Subscribers", value: stats?.active_subscribers?.toString() || "0", icon: TrendingUp, color: "text-category-hustle" },
    { label: "Earnings This Month", value: `£${stats?.earnings_this_month?.toFixed(2) || "0.00"}`, icon: DollarSign, color: "text-category-store" },
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Affiliate Program</h1>
        <p className="text-muted-foreground text-lg">
          Earn 35% monthly commissions when your friends join Hustle Lab
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {statsDisplay.map((stat) => (
          <div key={stat.label} className="bg-gradient-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
              <span className="text-3xl font-bold">{stat.value}</span>
            </div>
            <p className="text-muted-foreground text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-gradient-card border border-border rounded-2xl p-8 mb-8">
        <h2 className="text-2xl font-bold mb-4">Your Referral Link</h2>
        <div className="flex gap-2">
          <Input
            value={referralLink}
            readOnly
            className="bg-secondary border-border font-mono"
          />
          <Button onClick={handleCopyLink} variant="gradient">
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Share this link with your audience and earn 35% of their subscription fee every month they stay subscribed.
        </p>
      </div>

      <div className="bg-gradient-card border border-border rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-6">Top Affiliates This Month</h2>
        
        {!leaderboard || leaderboard.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No data yet. Be the first!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {leaderboard.map((person, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl border border-border"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                    index === 0 ? "bg-gradient-primary text-white" : "bg-muted"
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold">Rank #{index + 1}</p>
                    <p className="text-sm text-muted-foreground">{person.total_referrals} referrals</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-category-hustle">£{person.lifetime_earnings.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">lifetime</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 bg-gradient-primary rounded-2xl p-8 text-center text-white">
        <h2 className="text-3xl font-bold mb-2">Want to earn even more?</h2>
        <p className="mb-6 opacity-90">
          Upgrade to Partner tier for exclusive bonuses and monthly contests.
        </p>
        <Button className="bg-white text-primary hover:bg-white/90">
          Upgrade to Partner
        </Button>
      </div>
    </div>
  );
}
