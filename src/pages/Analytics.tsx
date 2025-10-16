import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { automations } from "@/data/automations";
import { CategoryType } from "@/types/automation";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Zap, Calendar, Target } from "lucide-react";
import { startOfDay, subDays, subMonths, isAfter, format } from "date-fns";

interface Generation {
  id: string;
  tool_id: string;
  tool_title: string;
  tool_emoji: string;
  created_at: string;
}

export default function Analytics() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<string>("all");

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    fetchGenerations();
  }, [user, navigate]);

  const fetchGenerations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("generations")
        .select("id, tool_id, tool_title, tool_emoji, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setGenerations(data || []);
    } catch (error: any) {
      console.error("Error fetching generations:", error);
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  const getToolCategory = (toolId: string): CategoryType | null => {
    const tool = automations.find((t) => t.id === toolId);
    return tool?.category || null;
  };

  const filteredGenerations = useMemo(() => {
    if (timeRange === "all") return generations;

    const now = startOfDay(new Date());
    let filterDate: Date;

    if (timeRange === "week") {
      filterDate = subDays(now, 7);
    } else if (timeRange === "month") {
      filterDate = subDays(now, 30);
    } else if (timeRange === "3months") {
      filterDate = subMonths(now, 3);
    } else {
      return generations;
    }

    return generations.filter((gen) => isAfter(new Date(gen.created_at), filterDate));
  }, [generations, timeRange]);

  const categoryData = useMemo(() => {
    const counts: Record<CategoryType, number> = {
      Content: 0,
      Ads: 0,
      Hustle: 0,
      Brand: 0,
      Store: 0,
      Productivity: 0,
    };

    filteredGenerations.forEach((gen) => {
      const category = getToolCategory(gen.tool_id);
      if (category) {
        counts[category]++;
      }
    });

    return Object.entries(counts)
      .filter(([_, count]) => count > 0)
      .map(([name, value]) => ({ name, value }));
  }, [filteredGenerations]);

  const toolData = useMemo(() => {
    const counts: Record<string, { name: string; count: number; emoji: string }> = {};

    filteredGenerations.forEach((gen) => {
      if (!counts[gen.tool_id]) {
        counts[gen.tool_id] = {
          name: gen.tool_title,
          count: 0,
          emoji: gen.tool_emoji,
        };
      }
      counts[gen.tool_id].count++;
    });

    return Object.values(counts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .map((item) => ({ name: `${item.emoji} ${item.name}`, value: item.count }));
  }, [filteredGenerations]);

  const trendData = useMemo(() => {
    const dailyCounts: Record<string, number> = {};

    filteredGenerations.forEach((gen) => {
      const date = format(new Date(gen.created_at), "MMM d");
      dailyCounts[date] = (dailyCounts[date] || 0) + 1;
    });

    return Object.entries(dailyCounts)
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .map(([date, count]) => ({ date, count }));
  }, [filteredGenerations]);

  const chartConfig: ChartConfig = {
    count: {
      label: "Hustles",
      color: "hsl(var(--primary))",
    },
    value: {
      label: "Count",
      color: "hsl(var(--primary))",
    },
  };

  const COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(var(--accent))", "hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))"];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto animate-fade-in">
        <div className="mb-6 sm:mb-8">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-6 w-96" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-24 w-full" />
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-[300px] w-full" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Analytics Dashboard</h1>
        <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
          Track your hustle generation activity and insights
        </p>
      </div>

      {/* Time Range Filter */}
      <div className="mb-6">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="week">Last 7 Days</SelectItem>
            <SelectItem value="month">Last 30 Days</SelectItem>
            <SelectItem value="3months">Last 3 Months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <Card className="p-6 bg-gradient-card border-border">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Hustles</p>
              <p className="text-2xl font-bold">{filteredGenerations.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card border-border">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-secondary/10 rounded-xl">
              <Target className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tools Used</p>
              <p className="text-2xl font-bold">{new Set(filteredGenerations.map((g) => g.tool_id)).size}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card border-border">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent/10 rounded-xl">
              <TrendingUp className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Top Category</p>
              <p className="text-2xl font-bold">{categoryData.length > 0 ? categoryData[0].name : "N/A"}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card border-border">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg per Day</p>
              <p className="text-2xl font-bold">
                {trendData.length > 0
                  ? (filteredGenerations.length / Math.max(trendData.length, 1)).toFixed(1)
                  : "0"}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {filteredGenerations.length === 0 ? (
        <Card className="p-12 text-center bg-gradient-card border-border">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-bold mb-2">No data yet</h2>
            <p className="text-muted-foreground">
              Start using tools to see your analytics!
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Distribution */}
          <Card className="p-6 bg-gradient-card border-border">
            <h2 className="text-xl font-bold mb-6">Hustles by Category</h2>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="hsl(var(--primary))"
                  dataKey="value"
                >
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </Card>

          {/* Top Tools */}
          <Card className="p-6 bg-gradient-card border-border">
            <h2 className="text-xl font-bold mb-6">Top 10 Tools</h2>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <BarChart data={toolData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis type="number" className="text-xs" />
                <YAxis dataKey="name" type="category" width={150} className="text-xs" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ChartContainer>
          </Card>

          {/* Activity Trend */}
          <Card className="p-6 bg-gradient-card border-border lg:col-span-2">
            <h2 className="text-xl font-bold mb-6">Activity Trend</h2>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ChartContainer>
          </Card>
        </div>
      )}
    </div>
  );
}
