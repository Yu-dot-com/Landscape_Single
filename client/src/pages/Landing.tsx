import { Button } from "../components/Landing/button";
import { Contours } from "../components/Landing/Contours";
import { Converge } from "../components/Landing/Converge";
import { Hero } from "../components/Landing/Hero";
import { Reveal } from "../components/Landing/Reveal";
import { ScrollBackground } from "../components/Landing/ScrollBackground";
import { SiteNav } from "../components/Landing/SiteNav";

import "../landing.css";

export default function Landing() {
  return (
    <main className="landing-page relative overflow-x-hidden">
      <ScrollBackground />

      <SiteNav />

      <Hero />

      {/* SECTION 2 — THE QUESTION */}

      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-32 md:px-10">
        <Reveal
          as="h2"
          blur
          className="text-pretty text-5xl font-semibold leading-[1.02] tracking-tight text-(--landing-foreground) sm:text-6xl md:text-7xl lg:text-8xl"
        >
          Why design alone
        </Reveal>

        <Reveal
          as="h2"
          blur
          delay={250}
          className="mt-2 text-pretty text-5xl font-semibold leading-[1.02] tracking-tight text-(--landing-accent) sm:text-6xl md:text-7xl lg:text-8xl"
        >
          when you can collaborate?
        </Reveal>
      </section>

      {/* SECTION 3 — THE IDEA */}

      <section className="relative mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center gap-6 px-6 py-32 text-center md:px-10">
        <Reveal
          as="p"
          className="text-4xl font-medium tracking-tight text-(--landing-muted) sm:text-5xl md:text-6xl"
        >
          Your idea.
        </Reveal>

        <Reveal
          as="p"
          delay={200}
          className="text-4xl font-medium tracking-tight text-(--landing-muted) sm:text-5xl md:text-6xl"
        >
          Their ideas.
        </Reveal>

        <Reveal
          as="p"
          delay={400}
          className="text-5xl font-semibold tracking-tight text-(--landing-foreground) sm:text-6xl md:text-7xl"
        >
          One vision.
        </Reveal>
      </section>

      {/* SECTION 4 — COLLABORATION */}

      <section
        id="product"
        className="relative flex min-h-screen items-center overflow-hidden px-6 py-32 md:px-10"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[-10%] top-1/2 hidden h-[80vmin] w-[80vmin] -translate-y-1/2 text-(--landing-accent) opacity-25 md:block animate-drift"
        >
          <Contours variant="b" />
        </div>

        <div className="mx-auto w-full max-w-6xl">
          <div className="space-y-1">
            {["Create together.", "Design together."].map((line, i) => (
              <Reveal
                key={line}
                as="h2"
                blur
                delay={i * 200}
                className="text-balance text-5xl font-semibold leading-[1.05] tracking-tight text-(--landing-foreground) sm:text-6xl md:text-7xl lg:text-8xl"
              >
                {line}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 — FROM IDEA TO VISION */}

      <section
        id="how"
        className="relative flex min-h-screen items-center overflow-hidden px-6 py-32 md:px-10"
      >
        <div className="mx-auto grid w-full max-w-6xl items-center gap-16 md:grid-cols-2">
          <div className="space-y-10">
            <Reveal
              as="p"
              className="text-3xl font-medium leading-tight tracking-tight text-(--landing-muted) sm:text-4xl"
            >
              One idea.
            </Reveal>

            <Reveal
              as="p"
              delay={200}
              className="text-3xl font-medium leading-tight tracking-tight text-(--landing-foreground) sm:text-4xl"
            >
              Many minds.
            </Reveal>

            <Reveal
              as="p"
              delay={400}
              className="text-3xl font-semibold leading-tight tracking-tight text-(--landing-accent) sm:text-4xl"
            >
              One clear vision.
            </Reveal>
          </div>

          <div className="aspect-4/3 w-full">
            <Converge />
          </div>
        </div>
      </section>

      {/* SECTION 7 — PRODUCT REVEAL */}

      <section
        id="start"
        className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-32 text-center"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center text-(--landing-accent) opacity-20"
        >
          <div className="animate-drift-slow h-[120vmin] w-[120vmin]">
            <Contours variant="a" />
          </div>
        </div>

        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center">
          <Reveal
            as="h2"
            blur
            className="text-balance text-6xl font-semibold leading-[0.95] tracking-tight text-(--landing-foreground) sm:text-7xl md:text-8xl"
          >
            Design your landscape.
          </Reveal>

          <Reveal
            as="span"
            blur
            delay={250}
            className="mt-2 block text-6xl font-semibold tracking-tight text-(--landing-accent) sm:text-7xl md:text-8xl"
          >
            Together.
          </Reveal>

          <Reveal delay={450} className="mt-10">
            <Button render={<a href="/signup" />} size="lg">
              Start Designing
            </Button>
          </Reveal>
        </div>
      </section>

      {/* FINAL SECTION */}

      <section
        id="about"
        className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center gap-4 px-6 py-32 text-center md:px-10"
      >
        <Reveal
          as="h2"
          blur
          className="text-pretty text-5xl font-semibold leading-[1.02] tracking-tight text-(--landing-foreground) sm:text-6xl md:text-7xl"
        >
          Don&apos;t just imagine it.
        </Reveal>

        <Reveal
          as="h2"
          blur
          delay={250}
          className="text-pretty text-5xl font-semibold leading-[1.02] tracking-tight text-(--landing-accent) sm:text-6xl md:text-7xl"
        >
          Create it together.
        </Reveal>

        <Reveal delay={500} className="mt-6">
          <Button render={<a href="/signup" />} size="lg">
            Start Designing
          </Button>
        </Reveal>
      </section>

      {/* FOOTER */}

      <footer className="border-t border-(--landing-border)">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-10 sm:flex-row md:px-10">
          <div className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="inline-block h-2.5 w-2.5 rounded-full bg-(--landing-accent)"
            />

            <span className="font-mono text-sm uppercase tracking-[0.2em]">
              WeDraft
            </span>
          </div>

          <p className="text-sm text-(--landing-muted)">
            Be creative. Be collaborative.
          </p>

          <p className="font-mono text-xs uppercase tracking-[0.2em] text-(--landing-muted)">
            © {new Date().getFullYear()} WeDraft
          </p>
        </div>
      </footer>
    </main>
  );
}