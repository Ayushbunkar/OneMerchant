import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex-1">
      <section className="w-full py-24 md:py-32 lg:py-48 bg-primary/20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none text-primary-foreground">
                Welcome to OneMerchant
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                The soft, gentle, and easy way to manage your commerce operations. Beautiful design, simple functionality.
              </p>
            </div>
            <div className="space-x-4">
              <Link
                href="/auth/login"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                Get Started
              </Link>
              <Link
                href="/about"
                className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center space-y-4 text-center p-6 bg-card rounded-lg shadow-sm border">
              <div className="p-4 bg-primary/20 rounded-full">
                <svg className=" h-6 w-6 text-primary" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <h3 className="text-xl font-bold">User Management</h3>
              <p className="text-muted-foreground">Manage your users with a beautiful, soft-themed interface.</p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center p-6 bg-card rounded-lg shadow-sm border">
              <div className="p-4 bg-primary/20 rounded-full">
                <svg className=" h-6 w-6 text-primary" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><rect height="18" rx="2" ry="2" width="18" x="3" y="3"/><line x1="3" x2="21" y1="9" y2="9"/><line x1="9" x2="9" y1="21" y2="9"/></svg>
              </div>
              <h3 className="text-xl font-bold">Dashboard</h3>
              <p className="text-muted-foreground">Everything you need in one place. Simple CRUD operations.</p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center p-6 bg-card rounded-lg shadow-sm border">
              <div className="p-4 bg-primary/20 rounded-full">
                <svg className=" h-6 w-6 text-primary" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </div>
              <h3 className="text-xl font-bold">Soft Aesthetics</h3>
              <p className="text-muted-foreground">No funky colors. Just pure, relaxing pastel tones.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
