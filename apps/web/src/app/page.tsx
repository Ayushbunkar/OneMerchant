"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, ShieldCheck, Zap, Bot, BarChart3, HelpCircle, Layers } from "lucide-react";
import { useState } from "react";

export default function HomePage() {
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
      transition: { type: "spring" as const, stiffness: 100 }
    }
  };

  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "How does the 0% commission model work?",
      a: "Unlike legacy platforms that penalize your growth by taxing every sale (usually 1.5% to 3.5%), OneMerchant charges a flat, predictable subscription fee. Every dollar you earn goes directly to your bank account, enabling higher margins and cleaner budgeting."
    },
    {
      q: "Can I import my existing product catalog?",
      a: "Yes! We offer single-click sync integrations for Shopify, WooCommerce, and standard merchant CSV exports. Your inventory, customer logs, and active orders will import seamlessly in under five minutes."
    },
    {
      q: "What does the AI Co-Pilot handle?",
      a: "The built-in AI assistant acts as a 24/7 digital team member. It drafts customer support replies, generates product descriptions, forecasts restock timelines based on buying velocity, and highlights anomalies in sales trends."
    },
    {
      q: "Is there support for brick-and-mortar storefronts?",
      a: "Absolutely. OneMerchant is built as a unified retail engine. You can connect your online storefronts and physical Point of Sale (POS) registers to synchronize inventory levels in real-time, preventing double-selling."
    }
  ];

  return (
    <main className="flex-1 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative w-full py-24 md:py-32 lg:py-48 bg-gradient-to-b from-primary/10 via-background to-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-primary/15 via-transparent to-transparent -z-10" />
        <div className="container px-4 md:px-6">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center space-y-8 text-center"
          >
            <motion.div 
              variants={itemVariants} 
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 text-primary-foreground text-xs font-semibold tracking-wide border border-primary/30"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Introducing Next-Gen Commerce OS
            </motion.div>
            <div className="space-y-4">
              <motion.h1 
                variants={itemVariants}
                className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl/none max-w-4xl"
              >
                One Dashboard. Zero Commission.{" "}
                <span className="bg-gradient-to-r from-primary-foreground to-purple-600 bg-clip-text text-transparent">
                  AI-Powered.
                </span>
              </motion.h1>
              <motion.p 
                variants={itemVariants}
                className="mx-auto max-w-[750px] text-muted-foreground md:text-xl/relaxed lg:text-lg/relaxed xl:text-xl/relaxed font-medium"
              >
                Stop losing margins to transaction fees. Combine inventory syncing, automated order processing, customer database records, and sales analysis inside a calm, beautiful dashboard.
              </motion.p>
            </div>
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md">
              <Link
                href="/auth/login"
                className="inline-flex h-12 items-center justify-center rounded-full bg-foreground px-8 text-sm font-semibold text-background shadow transition-transform hover:scale-[1.03] active:scale-[0.97]"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/about"
                className="inline-flex h-12 items-center justify-center rounded-full border border-input bg-background/50 backdrop-blur-sm px-8 text-sm font-semibold shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Learn More
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-12 border-y bg-card/50 backdrop-blur-sm">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <div className="text-4xl md:text-5xl font-black text-primary-foreground">0%</div>
              <div className="text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-wider">Transaction Fees</div>
            </div>
            <div className="space-y-1">
              <div className="text-4xl md:text-5xl font-black text-primary-foreground">$14M+</div>
              <div className="text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-wider">Volume Processed</div>
            </div>
            <div className="space-y-1">
              <div className="text-4xl md:text-5xl font-black text-primary-foreground">99.9%</div>
              <div className="text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-wider">Dashboard Uptime</div>
            </div>
            <div className="space-y-1">
              <div className="text-4xl md:text-5xl font-black text-primary-foreground">15k+</div>
              <div className="text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-wider">Active Merchants</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="w-full py-20 md:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Everything you need to grow, beautifully simplified
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-lg">
              No bloated side-panels. No high-stress graphs. We focus strictly on the indicators and workflows that drive merchant success.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="flex flex-col space-y-4 p-8 bg-card rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 bg-primary/20 rounded-xl w-fit text-primary-foreground">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Commission-Free Core</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Scale your store layout without sharing percentages. Pay a single flat subscription, preserving your hard-earned margins for what matters.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="flex flex-col space-y-4 p-8 bg-card rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 bg-primary/20 rounded-xl w-fit text-primary-foreground">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Omnichannel Stock Sync</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Maintain absolute control over stock levels. Sync your inventory quantities across brick-and-mortar register feeds, Shopify instances, and Amazon catalogs.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="flex flex-col space-y-4 p-8 bg-card rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 bg-primary/20 rounded-xl w-fit text-primary-foreground">
                <Bot className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Autonomous Co-Pilot</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Delegate standard clerical chores. Let the integrated AI assistant draft responses, track customer inquiries, and predict low-stock items before they run out.
              </p>
            </div>
            {/* Feature 4 */}
            <div className="flex flex-col space-y-4 p-8 bg-card rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 bg-primary/20 rounded-xl w-fit text-primary-foreground">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Real-Time Insights</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Make decisions backed by clean analytics. Gain insight into customer lifecycle metrics, sales momentum, and inventory valuations in seconds.
              </p>
            </div>
            {/* Feature 5 */}
            <div className="flex flex-col space-y-4 p-8 bg-card rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 bg-primary/20 rounded-xl w-fit text-primary-foreground">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">High-Speed Execution</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Built on an ultra-light framework, our dashboard loads instantaneously. No lag, no wait states—just immediate productivity.
              </p>
            </div>
            {/* Feature 6 */}
            <div className="flex flex-col space-y-4 p-8 bg-card rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 bg-primary/20 rounded-xl w-fit text-primary-foreground">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Calming Aesthetics</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Engineered to prevent eye strain and data overload. Soft color values, clean padding structures, and interactive feedback make managing your business a joy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-20 bg-card/30 border-t">
        <div className="container px-4 md:px-6 max-w-4xl">
          <div className="flex flex-col items-center space-y-4 text-center mb-12">
            <div className="p-3 bg-primary/20 rounded-xl w-fit text-primary-foreground">
              <HelpCircle className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">Got questions? We've got answers.</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div key={index} className="border bg-card rounded-xl overflow-hidden transition-colors">
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left font-semibold text-foreground hover:bg-muted/30 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <motion.span
                      animate={{ rotate: isOpen ? 185 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-muted-foreground"
                    >
                      ▼
                    </motion.span>
                  </button>
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="p-5 pt-0 text-muted-foreground text-sm leading-relaxed border-t border-border/55">
                      {faq.a}
                    </p>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="w-full py-24 bg-gradient-to-t from-primary/10 to-background border-t">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-6 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
              Ready to take complete ownership of your business?
            </h2>
            <p className="text-muted-foreground md:text-lg">
              Start building inventory catalogs, connecting sales feeds, and saving on commissions today. Setup takes minutes.
            </p>
            <Link
              href="/auth/login"
              className="inline-flex h-12 items-center justify-center rounded-full bg-foreground px-10 text-sm font-semibold text-background shadow transition-transform hover:scale-[1.03] active:scale-[0.97]"
            >
              Get Started for Free
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
