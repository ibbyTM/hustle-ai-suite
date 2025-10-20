import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";

export default function TermsOfService() {
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
              Terms of Service
            </h1>
            
            <div className="text-sm text-muted-foreground mb-8">
              <p>Effective Date: October 2025</p>
            </div>

            <div className="space-y-8 text-foreground/90">
              {/* Acceptance of Terms */}
              <section>
                <h2 className="text-2xl font-bold mb-4 text-foreground">1. Acceptance of Terms</h2>
                <p className="leading-relaxed">
                  By accessing or using HustleLab ("Service"), you agree to be bound by these Terms of Service 
                  and all applicable laws. If you do not agree, please discontinue use of the platform.
                </p>
              </section>

              {/* Use of the Service */}
              <section>
                <h2 className="text-2xl font-bold mb-4 text-foreground">2. Use of the Service</h2>
                <p className="leading-relaxed mb-4">
                  You agree to use HustleLab only for lawful purposes. You may not:
                </p>
                <ul className="space-y-2 ml-6 list-disc">
                  <li className="leading-relaxed">Reverse-engineer, copy, or resell the platform or its tools.</li>
                  <li className="leading-relaxed">Use HustleLab for fraudulent, harmful, or illegal activities.</li>
                  <li className="leading-relaxed">Interfere with site functionality or access without authorization.</li>
                </ul>
              </section>

              {/* Accounts */}
              <section>
                <h2 className="text-2xl font-bold mb-4 text-foreground">3. Accounts</h2>
                <p className="leading-relaxed">
                  You are responsible for maintaining the confidentiality of your login credentials. 
                  HustleLab is not liable for any activity that occurs under your account.
                </p>
              </section>

              {/* Intellectual Property */}
              <section>
                <h2 className="text-2xl font-bold mb-4 text-foreground">4. Intellectual Property</h2>
                <p className="leading-relaxed">
                  All content, branding, and materials on HustleLab—including text, graphics, logos, 
                  and automation tools—are owned by HustleLab or licensed to us. You may not reproduce 
                  or redistribute them without permission.
                </p>
              </section>

              {/* Payments and Subscriptions */}
              <section>
                <h2 className="text-2xl font-bold mb-4 text-foreground">5. Payments and Subscriptions</h2>
                <p className="leading-relaxed">
                  If you purchase a paid plan, you authorize HustleLab (or our payment processor) to charge 
                  your selected payment method. Subscription fees are billed automatically unless cancelled 
                  before renewal.
                </p>
              </section>

              {/* Limitation of Liability */}
              <section>
                <h2 className="text-2xl font-bold mb-4 text-foreground">6. Limitation of Liability</h2>
                <p className="leading-relaxed">
                  HustleLab is provided "as is" and without warranties. We are not liable for indirect, 
                  incidental, or consequential damages arising from your use of the Service.
                </p>
              </section>

              {/* Termination */}
              <section>
                <h2 className="text-2xl font-bold mb-4 text-foreground">7. Termination</h2>
                <p className="leading-relaxed">
                  We reserve the right to suspend or terminate access to HustleLab for violations of these 
                  terms or at our discretion.
                </p>
              </section>

              {/* Changes to These Terms */}
              <section>
                <h2 className="text-2xl font-bold mb-4 text-foreground">8. Changes to These Terms</h2>
                <p className="leading-relaxed">
                  We may update these Terms at any time. Continued use after updates means you accept 
                  the revised version.
                </p>
              </section>

              {/* Contact */}
              <section>
                <h2 className="text-2xl font-bold mb-4 text-foreground">9. Contact</h2>
                <p className="leading-relaxed mb-4">
                  If you have questions about these Terms, reach out to us at:
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
