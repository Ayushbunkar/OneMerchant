export default function AboutPage() {
  return (
    <main className="flex-1">
      <section className="w-full py-24 md:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-foreground">
              About Us
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              We believe in simple, beautiful software that doesn't overwhelm you with unnecessary features or harsh colors.
            </p>
          </div>
          <div className="mt-16 grid gap-10 sm:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Our Mission</h3>
              <p className="text-muted-foreground">
                To provide merchants with the softest, most intuitive operating system for their commerce needs. We focus on the essentials and present them in a way that reduces stress.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Our Vision</h3>
              <p className="text-muted-foreground">
                A world where software feels like a gentle breeze. No more clunky interfaces, no more eye-straining dashboards. Just pure, functional harmony.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
