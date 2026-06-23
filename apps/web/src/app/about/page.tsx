"use client";

import { motion } from "framer-motion";
import { Heart, Shield, Compass, Sparkles } from "lucide-react";

export default function AboutPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <main className="flex-1">
      <section className="w-full py-20 md:py-32 bg-gradient-to-b from-primary/5 to-background">
        <div className="container px-4 md:px-6">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center space-y-6 text-center max-w-4xl mx-auto"
          >
            <motion.h1 
              variants={itemVariants}
              className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-foreground"
            >
              Rethinking Commerce for Modern Merchants
            </motion.h1>
            <motion.p 
              variants={itemVariants}
              className="text-muted-foreground md:text-xl leading-relaxed font-medium max-w-3xl"
            >
              We build simple, calming software that doesn't overwhelm you with unnecessary features, hidden charges, or eye-straining colors.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Main Narrative */}
      <section className="w-full py-16 bg-background border-t">
        <div className="container px-4 md:px-6 max-w-4xl">
          <div className="space-y-12">
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Our Origin</h2>
              <p className="text-muted-foreground leading-relaxed text-base">
                For years, independent brands and digital store owners have been trapped in an expensive trade-off. To gain advanced syncing features and automated analytics, they had to license platform bundles that take high commission fees (up to 3.5% per sale) or struggle with massive, outdated, stressful software suites. 
              </p>
              <p className="text-muted-foreground leading-relaxed text-base">
                We started OneMerchant with a simple premise: **commerce software should feel like a partner, not a tollbooth**. We decided to strip away the clutter, focus on high-fidelity features, design them with relaxing, pastel tones, and offer it all at a transparent, flat price point.
              </p>
            </div>

            <div className="grid gap-10 sm:grid-cols-2 mt-12">
              <div className="space-y-4 p-6 bg-card rounded-2xl border">
                <div className="p-3 bg-primary/20 rounded-xl w-fit text-primary-foreground">
                  <Compass className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Our Mission</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  To provide merchants with the most intuitive, calm, and reliable workspace to coordinate sales, inventory, and order fulfillment. We focus strictly on the vital controls, removing digital static so you can direct your energy into customer relations and product quality.
                </p>
              </div>

              <div className="space-y-4 p-6 bg-card rounded-2xl border">
                <div className="p-3 bg-primary/20 rounded-xl w-fit text-primary-foreground">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Our Vision</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  A world where software feels like a gentle breeze. We envision thousands of independent business owners running efficient, profitable operations without paying transaction fees, fighting clunky dashboards, or experiencing administrative stress.
                </p>
              </div>
            </div>

            {/* Core Values Section */}
            <div className="space-y-8 pt-12 border-t">
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-center">Core Design Values</h2>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="text-center p-4">
                  <Heart className="h-8 w-8 mx-auto text-primary mb-3" />
                  <h4 className="font-bold text-lg mb-2">Merchant-First Equity</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    By capping fees at flat rates, we ensure that as your business scales, your profits remain in your custody. We succeed when you keep your margins.
                  </p>
                </div>
                <div className="text-center p-4">
                  <Shield className="h-8 w-8 mx-auto text-primary mb-3" />
                  <h4 className="font-bold text-lg mb-2">Cognitive Clarity</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    We intentionally limit information clutter. By building calming layouts and workflows, we minimize administrative fatigue and stress.
                  </p>
                </div>
                <div className="text-center p-4">
                  <Sparkles className="h-8 w-8 mx-auto text-primary mb-3" />
                  <h4 className="font-bold text-lg mb-2">AI-Driven Efficiency</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    We use machine intelligence to take over tedious paperwork, such as drafting emails, tracking shipment states, and organizing restock plans.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
