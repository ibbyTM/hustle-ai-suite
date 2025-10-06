import { CategoryType } from "@/types/automation";

interface CategoryBadgeProps {
  category: CategoryType;
}

const categoryStyles: Record<CategoryType, string> = {
  Content: "bg-category-content/20 text-category-content border-category-content/30",
  Ads: "bg-category-ads/20 text-category-ads border-category-ads/30",
  Hustle: "bg-category-hustle/20 text-category-hustle border-category-hustle/30",
  Brand: "bg-category-brand/20 text-category-brand border-category-brand/30",
  Store: "bg-category-store/20 text-category-store border-category-store/30",
  Productivity: "bg-category-productivity/20 text-category-productivity border-category-productivity/30",
};

export const CategoryBadge = ({ category }: CategoryBadgeProps) => {
  return (
    <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${categoryStyles[category]}`}>
      {category}
    </span>
  );
};
