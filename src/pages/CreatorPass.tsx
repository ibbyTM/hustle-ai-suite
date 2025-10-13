import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Zap, TrendingUp, Shield, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const creatorPassSchema = z.object({
  full_name: z.string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  email: z.string()
    .trim()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
  tiktok_handle: z.string().trim().max(50, "Handle must be less than 50 characters").optional(),
  instagram_handle: z.string().trim().max(50, "Handle must be less than 50 characters").optional(),
  youtube_handle: z.string().trim().max(100, "Channel must be less than 100 characters").optional(),
  other_handle: z.string().trim().max(100, "Handle must be less than 100 characters").optional(),
  followers: z.enum(["0–5K", "5K–20K", "20K–100K", "100K+"], {
    required_error: "Please select your follower count"
  }),
  agree_to_promote: z.boolean()
    .refine(val => val === true, "You must agree to promote HustleLab")
}).refine(
  data => data.tiktok_handle || data.instagram_handle || data.youtube_handle || data.other_handle,
  { message: "Please provide at least one social media handle", path: ["tiktok_handle"] }
);

type CreatorPassFormData = z.infer<typeof creatorPassSchema>;

const CreatorPass = () => {
  const navigate = useNavigate();
  const formRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreatorPassFormData>({
    resolver: zodResolver(creatorPassSchema),
    defaultValues: {
      full_name: "",
      email: "",
      tiktok_handle: "",
      instagram_handle: "",
      youtube_handle: "",
      other_handle: "",
      agree_to_promote: false,
    },
  });

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  };

  const onSubmit = async (data: CreatorPassFormData) => {
    setIsSubmitting(true);

    try {
      // Capture hidden fields
      const searchParams = new URLSearchParams(window.location.search);
      const payload = {
        full_name: data.full_name,
        email: data.email,
        tiktok_handle: data.tiktok_handle || null,
        instagram_handle: data.instagram_handle || null,
        youtube_handle: data.youtube_handle || null,
        other_handle: data.other_handle || null,
        followers: data.followers,
        agree_to_promote: data.agree_to_promote,
        page_url: window.location.href,
        utm_source: searchParams.get('utm_source'),
        utm_campaign: searchParams.get('utm_campaign'),
        utm_medium: searchParams.get('utm_medium'),
        submitted_at: new Date().toISOString(),
      };

      // Send to GHL webhook
      const response = await fetch(
        'https://services.leadconnectorhq.com/hooks/QUfszPvQgfmXi21Aql52/webhook-trigger/438ed7d9-7574-4760-addf-a5beb3436155',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      toast.success('Application submitted successfully!');
      navigate('/creator-pass-check-email');
    } catch (error) {
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 sm:py-20 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-400 to-primary bg-clip-text text-transparent">
          Claim Your Free HustleLab Creator Pass 🎁
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Lifetime access to 16+ AI tools + 35% recurring affiliate commissions — free for verified creators.
        </p>
        <Button 
          size="lg" 
          onClick={scrollToForm}
          className="text-lg px-8 py-6"
        >
          Get My Free Pass
        </Button>
      </section>

      {/* Trust Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card border border-primary/20">
            <Zap className="w-12 h-12 text-primary mb-4" />
            <h3 className="font-semibold mb-2">Lifetime Access</h3>
            <p className="text-sm text-muted-foreground">Founder status with unlimited usage</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card border border-primary/20">
            <TrendingUp className="w-12 h-12 text-primary mb-4" />
            <h3 className="font-semibold mb-2">Personal Affiliate Dashboard</h3>
            <p className="text-sm text-muted-foreground">35% recurring commissions on all referrals</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card border border-primary/20">
            <Shield className="w-12 h-12 text-primary mb-4" />
            <h3 className="font-semibold mb-2">Priority Support</h3>
            <p className="text-sm text-muted-foreground">Early access to features + dedicated help</p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section ref={formRef} className="container mx-auto px-4 py-12 pb-20">
        <Card className="max-w-2xl mx-auto border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Apply for Your Creator Pass</CardTitle>
            <CardDescription className="text-center">
              Fill in your details below to claim your free lifetime access
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Add your social media handles below (at least one required)
                  </p>
                  
                  <FormField
                    control={form.control}
                    name="tiktok_handle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>TikTok Handle</FormLabel>
                        <FormControl>
                          <Input placeholder="@username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="instagram_handle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instagram Handle</FormLabel>
                        <FormControl>
                          <Input placeholder="@username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="youtube_handle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>YouTube Channel</FormLabel>
                        <FormControl>
                          <Input placeholder="@channelname or channel URL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="other_handle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Other Platform Handle</FormLabel>
                        <FormControl>
                          <Input placeholder="Platform name & handle" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="followers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Follower Count *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your follower count" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0–5K">0–5K</SelectItem>
                          <SelectItem value="5K–20K">5K–20K</SelectItem>
                          <SelectItem value="20K–100K">20K–100K</SelectItem>
                          <SelectItem value="100K+">100K+</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="agree_to_promote"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          I agree to promote HustleLab if I love it *
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full text-lg py-6" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Get My Free Creator Pass'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground border-t">
        <p>Built in the HustleLab — where AI meets ambition.</p>
      </footer>
    </div>
  );
};

export default CreatorPass;
