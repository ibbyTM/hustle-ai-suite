import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link to="/">
          <Button variant="outline" className="mb-8 border-primary/30">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <Card className="bg-gradient-card border-primary/20">
          <CardContent className="p-8 md:p-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
              Privacy Policy
            </h1>
            
            <div className="flex gap-4 text-sm text-muted-foreground mb-8">
              <p>Effective Date: October 2025</p>
              <p>Last Updated: October 2025</p>
            </div>

            <div className="space-y-8 text-foreground/90">
              {/* Introduction */}
              <section>
                <h2 className="text-2xl font-bold mb-4 text-foreground">1. Introduction</h2>
                <p className="leading-relaxed">
                  Welcome to HustleLab ("we," "our," or "us"). This Privacy Policy explains how we collect, 
                  use, and protect your information when you use our website, tools, and services.
                </p>
                <p className="leading-relaxed mt-4">
                  By using HustleLab, you agree to the collection and use of information in accordance with this policy.
                </p>
              </section>

              {/* Information We Collect */}
              <section>
                <h2 className="text-2xl font-bold mb-4 text-foreground">2. Information We Collect</h2>
                <p className="leading-relaxed mb-4">
                  We may collect the following types of information:
                </p>
                <ul className="space-y-3 ml-6">
                  <li className="leading-relaxed">
                    <strong className="text-foreground">Personal Information:</strong> Name, email address, and phone number 
                    when you contact us or create an account.
                  </li>
                  <li className="leading-relaxed">
                    <strong className="text-foreground">Usage Data:</strong> Pages visited, time spent, browser type, 
                    and other analytics for improving the platform.
                  </li>
                  <li className="leading-relaxed">
                    <strong className="text-foreground">Cookies:</strong> Small files used to store preferences 
                    and enhance your experience.
                  </li>
                </ul>
              </section>

              {/* How We Use Your Information */}
              <section>
                <h2 className="text-2xl font-bold mb-4 text-foreground">3. How We Use Your Information</h2>
                <p className="leading-relaxed mb-4">
                  We use your data to:
                </p>
                <ul className="space-y-2 ml-6 list-disc">
                  <li className="leading-relaxed">Provide and improve our tools and services.</li>
                  <li className="leading-relaxed">Send updates, offers, or platform announcements.</li>
                  <li className="leading-relaxed">Respond to support requests or inquiries.</li>
                  <li className="leading-relaxed">Comply with legal obligations.</li>
                </ul>
              </section>

              {/* Data Protection */}
              <section>
                <h2 className="text-2xl font-bold mb-4 text-foreground">4. Data Protection</h2>
                <p className="leading-relaxed">
                  We take reasonable measures to secure your data against unauthorized access, disclosure, or alteration. 
                  However, no online platform is 100% secure, so please use caution when sharing personal details.
                </p>
              </section>

              {/* Third-Party Services */}
              <section>
                <h2 className="text-2xl font-bold mb-4 text-foreground">5. Third-Party Services</h2>
                <p className="leading-relaxed">
                  Our site may include links or integrations with third-party platforms (like payment processors, 
                  analytics tools, or automation software). These third parties have their own privacy policies 
                  and are not governed by HustleLab.
                </p>
              </section>

              {/* Your Rights */}
              <section>
                <h2 className="text-2xl font-bold mb-4 text-foreground">6. Your Rights</h2>
                <p className="leading-relaxed mb-4">
                  You may request to:
                </p>
                <ul className="space-y-2 ml-6 list-disc">
                  <li className="leading-relaxed">Access or correct your personal data.</li>
                  <li className="leading-relaxed">Delete your account and associated data.</li>
                  <li className="leading-relaxed">Opt out of marketing emails.</li>
                </ul>
                <p className="leading-relaxed mt-4">
                  To make a request, contact us at{" "}
                  <a href="mailto:ibby@nexusedge.tech" className="text-primary hover:underline font-semibold">
                    ibby@nexusedge.tech
                  </a>
                </p>
              </section>

              {/* Contact */}
              <section>
                <h2 className="text-2xl font-bold mb-4 text-foreground">7. Contact</h2>
                <p className="leading-relaxed mb-4">
                  For privacy-related concerns, reach out at:
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <a href="mailto:ibby@nexusedge.tech" className="text-primary hover:underline font-semibold">
                      ibby@nexusedge.tech
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <a href="tel:07447187138" className="text-primary hover:underline font-semibold">
                      07447 187138
                    </a>
                  </div>
                </div>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
