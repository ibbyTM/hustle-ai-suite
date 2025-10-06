import { Copy, TrendingUp, Users, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function Affiliate() {
  const referralLink = "https://hustlehub.app/ref/yourcode";
  
  const stats = [
    { label: "Total Referrals", value: "0", icon: Users, color: "text-category-content" },
    { label: "Active Subscribers", value: "0", icon: TrendingUp, color: "text-category-hustle" },
    { label: "Earnings This Month", value: "£0", icon: DollarSign, color: "text-category-store" },
  ];

  const leaderboard = [
    { rank: 1, name: "Alex M.", earnings: "£2,847", referrals: 23 },
    { rank: 2, name: "Jordan P.", earnings: "£1,923", referrals: 18 },
    { rank: 3, name: "Taylor R.", earnings: "£1,456", referrals: 14 },
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
          Earn 40% monthly commissions when your friends join HustleHub
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
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
          Share this link with your audience and earn 40% of their subscription fee every month they stay subscribed.
        </p>
      </div>

      <div className="bg-gradient-card border border-border rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-6">Top Affiliates This Month</h2>
        
        {leaderboard.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No data yet. Be the first!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {leaderboard.map((person) => (
              <div
                key={person.rank}
                className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl border border-border"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                    person.rank === 1 ? "bg-gradient-primary text-white" : "bg-muted"
                  }`}>
                    {person.rank}
                  </div>
                  <div>
                    <p className="font-semibold">{person.name}</p>
                    <p className="text-sm text-muted-foreground">{person.referrals} referrals</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-category-hustle">{person.earnings}</p>
                  <p className="text-xs text-muted-foreground">this month</p>
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
