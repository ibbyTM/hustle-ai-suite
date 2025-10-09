import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Ticket } from "lucide-react";
import { toast } from "sonner";
import { useSubscription } from "@/hooks/useSubscription";

interface PromoCodeInputProps {
  onSuccess?: () => void;
}

export default function PromoCodeInput({ onSuccess }: PromoCodeInputProps) {
  const [code, setCode] = useState("");
  const [isRedeeming, setIsRedeeming] = useState(false);
  const { redeemPromoCode } = useSubscription();

  const handleRedeem = async () => {
    if (!code.trim()) {
      toast.error("Please enter a promo code");
      return;
    }

    setIsRedeeming(true);
    try {
      const data = await redeemPromoCode(code.trim());

      if (data?.success) {
        toast.success(data.message || "Promo code redeemed successfully!");
        setCode("");
        onSuccess?.();
      } else {
        throw new Error(data?.error || "Failed to redeem promo code");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to redeem promo code";
      toast.error(errorMessage);
      console.error("Promo code redemption error:", error);
    } finally {
      setIsRedeeming(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isRedeeming) {
      handleRedeem();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
      <div className="relative flex-1">
        <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Enter promo code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyPress={handleKeyPress}
          disabled={isRedeeming}
          className="pl-10 uppercase"
          maxLength={20}
        />
      </div>
      <Button
        onClick={handleRedeem}
        disabled={isRedeeming || !code.trim()}
        className="min-w-[100px]"
      >
        {isRedeeming ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Redeeming...
          </>
        ) : (
          "Redeem"
        )}
      </Button>
    </div>
  );
}
