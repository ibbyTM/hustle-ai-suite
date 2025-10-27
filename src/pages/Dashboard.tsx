import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { AutomationCard } from "@/components/AutomationCard";
import { automations } from "@/data/automations";
import { AutomationTool, CategoryType } from "@/types/automation";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { QuickStartSection } from "@/components/dashboard/QuickStartSection";
import { SearchAndFilter } from "@/components/dashboard/SearchAndFilter";
import { FavoritesSection } from "@/components/dashboard/FavoritesSection";
import { RecentlyUsedSection } from "@/components/dashboard/RecentlyUsedSection";
import { CategorySection } from "@/components/dashboard/CategorySection";
import { useFavorites } from "@/hooks/useFavorites";
import { useRecentlyUsed } from "@/hooks/useRecentlyUsed";

const FREE_TIER_TOOLS = ["biz-idea", "hook-factory", "trend-finder", "inbox-influence"];

const categories: Array<"All" | CategoryType> = ["All", "Content", "Ads", "Hustle", "Brand", "Store", "Productivity"];

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"All" | CategoryType>("All");
  const [openCategory, setOpenCategory] = useState<CategoryType>("Content");
  const { tier } = useSubscription();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { recentTools } = useRecentlyUsed(5);
  const categorySectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  const isToolAccessible = (tool: AutomationTool) => {
    if (tier === "partner" || tier === "pro") return true;
    if (tier === "free") return FREE_TIER_TOOLS.includes(tool.id);
    return false;
  };

  const handleToolClick = (tool: AutomationTool) => {
    if (!isToolAccessible(tool)) {
      navigate("/pricing");
      return;
    }
    navigate(`/tool/${tool.id}`);
  };

  const handleFavoriteToggle = useCallback((e: React.MouseEvent, toolId: string) => {
    e.stopPropagation();
    if (isFavorite(toolId)) {
      removeFavorite(toolId);
    } else {
      addFavorite(toolId);
    }
  }, [isFavorite, addFavorite, removeFavorite]);

  // Filter and search logic
  const filteredTools = useMemo(() => {
    return automations.filter(tool => {
      const matchesCategory = selectedCategory === "All" || tool.category === selectedCategory;
      const matchesSearch = !searchQuery || 
        tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Group tools by category
  const toolsByCategory = useMemo(() => {
    const grouped: Record<CategoryType, AutomationTool[]> = {
      Content: [],
      Ads: [],
      Hustle: [],
      Brand: [],
      Store: [],
      Productivity: [],
    };

    filteredTools.forEach(tool => {
      grouped[tool.category].push(tool);
    });

    return grouped;
  }, [filteredTools]);

  // Get favorite tools
  const favoriteTools = useMemo(() => {
    return automations.filter(tool => favorites.includes(tool.id));
  }, [favorites]);

  // Get recent tools with full data
  const recentToolsWithData = useMemo(() => {
    return recentTools.map(rt => ({
      tool: automations.find(t => t.id === rt.tool_id)!,
      timestamp: rt.created_at,
    })).filter(rt => rt.tool); // Filter out any tools that don't exist
  }, [recentTools]);

  // Quick start handlers
  const handleStartNew = useCallback(() => {
    const firstTool = automations[0];
    if (firstTool) handleToolClick(firstTool);
  }, []);

  const handleContinuePrevious = useCallback(() => {
    if (recentToolsWithData.length > 0) {
      handleToolClick(recentToolsWithData[0].tool);
    }
  }, [recentToolsWithData]);

  const handleExploreTools = useCallback(() => {
    categorySectionRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Handle category toggle
  const handleCategoryToggle = useCallback((category: CategoryType) => {
    setOpenCategory(prev => prev === category ? "Content" : category);
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
          Automate your hustle. Don't overthink it.
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg">
          Pick a tool, hit generate, and watch the magic happen ✨
        </p>
      </div>

      {/* Quick Start Section */}
      <QuickStartSection
        onStartNew={handleStartNew}
        onContinuePrevious={handleContinuePrevious}
        onExploreTools={handleExploreTools}
        hasPreviousWork={recentToolsWithData.length > 0}
      />

      {/* Search and Filter */}
      <SearchAndFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categories}
      />

      {/* Favorites Section */}
      <FavoritesSection
        favoriteTools={favoriteTools}
        onToolClick={handleToolClick}
        isToolAccessible={isToolAccessible}
        isFavorite={isFavorite}
        onFavoriteToggle={handleFavoriteToggle}
      />

      {/* Recently Used Section */}
      <RecentlyUsedSection
        recentTools={recentToolsWithData}
        onToolClick={handleToolClick}
        isToolAccessible={isToolAccessible}
        isFavorite={isFavorite}
        onFavoriteToggle={handleFavoriteToggle}
      />

      {/* Category Sections */}
      <div ref={categorySectionRef}>
        {categories.filter(cat => cat !== "All").map((category) => {
          const categoryTools = toolsByCategory[category as CategoryType];
          if (categoryTools.length === 0) return null;

          return (
            <CategorySection
              key={category}
              category={category as CategoryType}
              tools={categoryTools}
              onToolClick={handleToolClick}
              isToolAccessible={isToolAccessible}
              isOpen={openCategory === category}
              onToggle={() => handleCategoryToggle(category as CategoryType)}
              isFavorite={isFavorite}
              onFavoriteToggle={handleFavoriteToggle}
            />
          );
        })}
      </div>

      {/* No Results */}
      {filteredTools.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            No tools found matching your search.
          </p>
        </div>
      )}
    </div>
  );
}
