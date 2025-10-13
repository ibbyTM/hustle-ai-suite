import { CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const CreatorPassCheckEmail = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="max-w-2xl w-full border-primary/20">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <CheckCircle2 className="w-20 h-20 text-primary" />
              <Sparkles className="w-8 h-8 text-purple-400 absolute -top-2 -right-2 animate-pulse" />
            </div>
          </div>
          <CardTitle className="text-3xl sm:text-4xl mb-4">
            🔥 You're In! Check Your Email
          </CardTitle>
          <CardDescription className="text-base sm:text-lg">
            Your free Creator Pass and affiliate setup link are on the way. It can take 2–5 minutes. 
            If you don't see it, check Promotions/Spam.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <Button 
              variant="secondary" 
              size="lg"
              className="text-lg px-8"
              asChild
            >
              <a href="#" target="_blank" rel="noopener noreferrer">
                Join the AI Syndicate Creators Group
              </a>
            </Button>
          </div>

          <div className="text-center pt-6 border-t">
            <p className="text-sm text-muted-foreground">
              Questions? Email{" "}
              <a 
                href="mailto:support@hustlelab.co.uk" 
                className="text-primary hover:underline"
              >
                support@hustlelab.co.uk
              </a>
            </p>
          </div>

          <div className="text-center pt-4">
            <p className="text-xs text-muted-foreground">
              Built in the HustleLab — where AI meets ambition.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatorPassCheckEmail;
