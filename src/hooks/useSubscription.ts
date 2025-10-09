import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";

export type SubscriptionTier = "free" | "pro" | "partner";

export interface Subscription {
  tier: SubscriptionTier;
  status: string;
  current_period_end: string | null;
}

export const TIER_CONFIG = {
  pro: {
    priceId: "price_1SGR9aJLDxMViooDsH1mtAKY", // £40/month standard price
    discountedPriceId: "price_1SFhXkJLDxMViooDs9zF3WaE", // £20/month for Partner referrals
    productId: "prod_TCqrdvyJQk9Vjn",
    name: "Plus",
    price: "£40",
    discountedPrice: "£20",
  },
  partner: {
    priceId: "price_1SGRCIJLDxMViooDnuKa1vFm", // £75/month
    productId: "prod_TCqumNy7jI9JpT",
    name: "Partner",
    price: "£75",
  },
};

export function useSubscription() {
  const { user } = useAuth();

  const { data: subscription, isLoading, refetch } = useQuery({
    queryKey: ["subscription", user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from("subscriptions")
        .select("tier, status, current_period_end")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      
      return data as Subscription | null;
    },
    enabled: !!user,
  });

  const tier: SubscriptionTier = subscription?.tier || "free";
  const hasProAccess = tier === "pro" || tier === "partner";
  const hasPartnerAccess = tier === "partner";

  const createCheckout = async (priceId: string, referralCode?: string) => {
    const { data, error } = await supabase.functions.invoke("create-checkout", {
      body: { priceId, referralCode },
    });

    if (error) throw error;
    
    if (data?.url) {
      window.open(data.url, "_blank");
    }
  };

  const openCustomerPortal = async () => {
    const { data, error } = await supabase.functions.invoke("customer-portal");

    if (error) throw error;
    
    if (data?.url) {
      window.open(data.url, "_blank");
    }
  };

  const redeemPromoCode = async (code: string) => {
    const { data, error } = await supabase.functions.invoke("redeem-promo-code", {
      body: { code },
    });
    
    if (error) throw error;
    await refetch();
    return data;
  };

  return {
    subscription,
    tier,
    hasProAccess,
    hasPartnerAccess,
    isLoading,
    createCheckout,
    openCustomerPortal,
    redeemPromoCode,
    refetch,
  };
}
