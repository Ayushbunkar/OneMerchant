import Link from "next/link";

export default function PricingPage() {
  return (
    <main className="flex-1">
      <section className="w-full py-24 md:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-foreground">
              Simple Pricing
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Choose the plan that best fits your needs. No hidden fees.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Basic Plan */}
            <div className="flex flex-col rounded-2xl border bg-card p-8 shadow-sm">
              <h3 className="text-2xl font-bold">Soft Start</h3>
              <div className="mt-4 flex items-baseline text-4xl font-bold">
                $0
                <span className="ml-1 text-xl font-medium text-muted-foreground">/mo</span>
              </div>
              <p className="mt-4 text-muted-foreground">Perfect for trying out our calm interface.</p>
              <ul className="mt-8 flex-1 space-y-4">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span className="ml-3 text-muted-foreground">Basic Dashboard</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span className="ml-3 text-muted-foreground">Up to 100 items</span>
                </li>
              </ul>
              <Link href="/auth/login" className="mt-8 block rounded-md bg-secondary px-6 py-3 text-center text-sm font-medium text-secondary-foreground hover:bg-secondary/80">
                Get Started
              </Link>
            </div>
            
            {/* Pro Plan */}
            <div className="flex flex-col rounded-2xl border-2 border-primary bg-card p-8 shadow-md relative">
              <div className="absolute top-0 right-0 -mt-4 mr-4 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                Popular
              </div>
              <h3 className="text-2xl font-bold">Gentle Pro</h3>
              <div className="mt-4 flex items-baseline text-4xl font-bold">
                $29
                <span className="ml-1 text-xl font-medium text-muted-foreground">/mo</span>
              </div>
              <p className="mt-4 text-muted-foreground">Everything you need to run your business smoothly.</p>
              <ul className="mt-8 flex-1 space-y-4">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span className="ml-3 text-muted-foreground">Advanced Dashboard</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span className="ml-3 text-muted-foreground">Unlimited items</span>
                </li>
              </ul>
              <Link href="/auth/login" className="mt-8 block rounded-md bg-primary px-6 py-3 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
