"use client";

import Link from "next/link";
import { Check, HelpCircle } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annually">("monthly");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const plans = [
    {
      name: "Soft Start",
      price: billingPeriod === "monthly" ? 0 : 0,
      description: "Ideal for trying out our calm interface and side projects.",
      cta: "Get Started Free",
      features: [
        "1 Connected Store Feed",
        "Up to 100 Products",
        "Basic Dashboard Tracking",
        "Email Support (24h response)",
        "0% Commission Fees"
      ]
    },
    {
      name: "Gentle Pro",
      price: billingPeriod === "monthly" ? 29 : 23,
      description: "Everything required to run a scaling brand with peace of mind.",
      cta: "Start 14-Day Trial",
      popular: true,
      features: [
        "5 Connected Store Feeds",
        "Unlimited Products",
        "Real-Time Stock Synchronization",
        "AI Co-Pilot Assistant Integration",
        "Priority Support (under 2 hours)",
        "Advanced Analytics & Trends",
        "0% Commission Fees"
      ]
    },
    {
      name: "Enterprise",
      price: billingPeriod === "monthly" ? 99 : 79,
      description: "High-volume infrastructure with tailored integrations and SLA support.",
      cta: "Contact Enterprise Sales",
      features: [
        "Unlimited Store Feeds",
        "Unlimited Products",
        "Real-Time Stock Synchronization",
        "Custom AI Workflow Automations",
        "Dedicated Merchant Account Manager",
        "Developer API Access",
        "Custom Datastore Integrations",
        "0% Commission Fees"
      ]
    }
  ];

  const faqItems = [
    {
      q: "Are there really zero transaction fees?",
      a: "Yes. Unlike other platforms that extract 1.5% to 3.5% from every customer purchase, we believe your earnings are yours alone. You connect your own payment processor (e.g., Stripe, Shopify Payments, or PayPal) and pay only their merchant fees. We charge a flat software subscription."
    },
    {
      q: "Can I upgrade or downgrade anytime?",
      a: "Absolutely. All our subscriptions are billed on a month-to-month or year-to-year basis. You can cancel, downgrade, or upgrade your plan directly from your billing profile. If you upgrade mid-cycle, we prorate the pricing differences."
    },
    {
      q: "How does the annual discount work?",
      a: "By selecting annual billing, you save 20% overall on our paid subscriptions. We bill for the full 12 months upfront, locking in the discounted rate."
    },
    {
      q: "Do you offer a free trial?",
      a: "Yes. The Gentle Pro plan comes with a 14-day free trial, allowing you to synchronize inventory feeds, try the AI Co-Pilot, and review analytics. No credit card is required to sign up."
    }
  ];

  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="w-full py-20 md:py-32 bg-gradient-to-b from-primary/5 to-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-6 text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-foreground">
              Simple, Transparent Pricing
            </h1>
            <p className="text-muted-foreground md:text-xl leading-relaxed">
              No hidden checkout commissions. No unexpected billing limits. Choose the tier that matches your scale.
            </p>

            {/* Toggle Billing Period */}
            <div className="flex items-center gap-3 bg-muted p-1 rounded-full border w-fit">
              <button
                onClick={() => setBillingPeriod("monthly")}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  billingPeriod === "monthly"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod("annually")}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  billingPeriod === "annually"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Annually (Save 20%)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards Grid */}
      <section className="w-full py-12 bg-background border-t">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 items-stretch max-w-6xl mx-auto">
            {plans.map((plan, idx) => (
              <div
                key={idx}
                className={`flex flex-col rounded-3xl border bg-card p-8 shadow-sm transition-all hover:shadow-md relative ${
                  plan.popular ? "border-2 border-primary ring-2 ring-primary/20 scale-[1.02] lg:scale-[1.04]" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 -translate-y-1/2 mr-6 rounded-full bg-primary px-4 py-1 text-xs font-bold text-primary-foreground shadow-sm">
                    Most Popular
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold tracking-tight">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline text-5xl font-black tracking-tight text-foreground">
                    ${plan.price}
                    <span className="ml-1 text-base font-medium text-muted-foreground">/mo</span>
                  </div>
                  <p className="mt-4 text-muted-foreground text-sm leading-relaxed">{plan.description}</p>
                </div>

                <ul className="flex-1 space-y-4 mb-8">
                  {plan.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start">
                      <span className="p-0.5 rounded-full bg-primary/20 text-primary-foreground mr-3 mt-0.5 shrink-0">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      <span className="text-muted-foreground text-sm font-medium leading-normal">{feat}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/auth/login"
                  className={`block rounded-full py-3 text-center text-sm font-bold tracking-wide transition-all ${
                    plan.popular
                      ? "bg-primary text-primary-foreground shadow hover:bg-primary/90"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Matrix Grid */}
      <section className="w-full py-16 bg-muted/20 border-y">
        <div className="container px-4 md:px-6 max-w-4xl">
          <h2 className="text-2xl font-bold tracking-tight mb-8 text-center">Feature Matrix Comparison</h2>
          <div className="overflow-x-auto border rounded-2xl bg-card">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="p-4 font-bold text-muted-foreground">Feature</th>
                  <th className="p-4 font-bold text-center">Start</th>
                  <th className="p-4 font-bold text-center">Pro</th>
                  <th className="p-4 font-bold text-center">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="p-4 font-semibold">Store Sync Feeds</td>
                  <td className="p-4 text-center text-muted-foreground">1</td>
                  <td className="p-4 text-center text-foreground font-semibold">5</td>
                  <td className="p-4 text-center text-foreground font-semibold">Unlimited</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold">Product Capacity</td>
                  <td className="p-4 text-center text-muted-foreground">Up to 100</td>
                  <td className="p-4 text-center text-foreground font-semibold">Unlimited</td>
                  <td className="p-4 text-center text-foreground font-semibold">Unlimited</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold">Transaction Commissions</td>
                  <td className="p-4 text-center text-green-500 font-semibold">0%</td>
                  <td className="p-4 text-center text-green-500 font-semibold">0%</td>
                  <td className="p-4 text-center text-green-500 font-semibold">0%</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold">AI Assistant Drafts</td>
                  <td className="p-4 text-center text-muted-foreground">✘</td>
                  <td className="p-4 text-center text-green-500 font-semibold">✔</td>
                  <td className="p-4 text-center text-green-500 font-semibold">✔</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold">Developer API & Webhooks</td>
                  <td className="p-4 text-center text-muted-foreground">✘</td>
                  <td className="p-4 text-center text-muted-foreground">✘</td>
                  <td className="p-4 text-center text-green-500 font-semibold">✔</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold">Support SLA</td>
                  <td className="p-4 text-center text-muted-foreground">24 hours</td>
                  <td className="p-4 text-center text-foreground font-semibold">Priority (&lt;2h)</td>
                  <td className="p-4 text-center text-foreground font-semibold">Dedicated 1-on-1</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing FAQ Accordion */}
      <section className="w-full py-20 bg-background">
        <div className="container px-4 md:px-6 max-w-3xl">
          <div className="flex flex-col items-center space-y-4 text-center mb-12">
            <div className="p-3 bg-primary/20 rounded-xl w-fit text-primary-foreground">
              <HelpCircle className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Pricing FAQs</h2>
            <p className="text-muted-foreground">Detailed answers regarding bills, upgrades, and commissions.</p>
          </div>
          <div className="space-y-4">
            {faqItems.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} className="border bg-card rounded-xl overflow-hidden transition-colors">
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left font-semibold text-foreground hover:bg-muted/30 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
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
    </main>
  );
}
