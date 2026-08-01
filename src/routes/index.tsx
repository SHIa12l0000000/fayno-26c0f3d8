import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Images, Users } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { Button } from "@/components/ui/button";
import amarPhoto from "@/assets/demo/amar.jpg";
import jaspalPhoto from "@/assets/demo/jaspal.jpg";
import harbansPhoto from "@/assets/demo/harbans.jpg";
import shivamPhoto from "@/assets/demo/shivam.jpg";
import nehaPhoto from "@/assets/demo/neha.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FAYNO — Every Family Has a Story. Preserve Yours." },
      {
        name: "description",
        content:
          "Save your family's names, photos and memories in one secure place so future generations never forget their roots.",
      },
      { property: "og:title", content: "FAYNO — Every Family Has a Story. Preserve Yours." },
      {
        property: "og:description",
        content:
          "Save your family's names, photos and memories in one secure place so future generations never forget their roots.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  {
    icon: Users,
    title: "Build your family",
    body: "Create your digital family record in minutes — names, relations, villages and dates, all in one place.",
  },
  {
    icon: Images,
    title: "Save memories",
    body: "Upload photographs and write down the stories that usually disappear after a generation or two.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy first",
    body: "Every person you add has its own setting: public, family only, or private to you.",
  },
];

function Landing() {
  return (
    <PageShell>
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-6xl gap-14 px-5 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-28">
          <div>
            <h1 className="max-w-xl text-4xl font-semibold leading-[1.1] sm:text-5xl">
              Every Family Has a Story. Preserve Yours.
            </h1>
            <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-muted-foreground">
              Save your family&apos;s names, photos, and memories in one secure place so future
              generations never forget their roots.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/auth" search={{ mode: "signup" }}>
                  Get started
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/search">Search families</Link>
              </Button>
            </div>
          </div>

          <FamilyDiagram />
        </div>
      </section>

      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-border bg-card p-6 shadow-card"
              >
                <feature.icon className="h-5 w-5 text-primary" aria-hidden />
                <h2 className="mt-4 text-[15px] font-semibold">{feature.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-3xl px-5 py-20">
          <h2 className="text-2xl font-semibold">Why FAYNO?</h2>
          <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-muted-foreground">
            <p>
              Most families lose their own history quietly. A grandparent passes away and the names
              of their parents go with them. Photographs sit in a box until they fade, and the
              village a family came from becomes a detail nobody can confirm anymore.
            </p>
            <p>
              FAYNO exists to slow that down. Write the names while someone still remembers them,
              add the few photographs that survived, and record the short stories that make a person
              more than a date. It takes an afternoon, and it stays readable for the people who come
              after you.
            </p>
          </div>
          <div className="mt-8">
            <Button asChild variant="outline">
              <Link to="/auth" search={{ mode: "signup" }}>
                Start your family record
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function FamilyDiagram() {
  return (
    <div className="relative rounded-2xl border border-border bg-surface p-6 sm:p-10">
      <div className="mx-auto max-w-sm">
        <PersonCard name="Amar Singh" meta="1931 – 1998 · Kotla" photo={amarPhoto} />
        <Connector />
        <div className="grid grid-cols-2 gap-3">
          <PersonCard name="Jaspal Singh" meta="b. 1958" photo={jaspalPhoto} compact />
          <PersonCard name="Harbans Kaur" meta="b. 1961" photo={harbansPhoto} compact />
        </div>
        <Connector />
        <div className="grid grid-cols-2 gap-3">
          <PersonCard name="Shivam" meta="b. 1994" photo={shivamPhoto} compact />
          <PersonCard name="Neha" meta="b. 1997" photo={nehaPhoto} compact />
        </div>
      </div>
    </div>
  );
}

function Connector() {
  return (
    <div className="flex h-8 items-center justify-center" aria-hidden>
      <div className="h-full w-px bg-border" />
    </div>
  );
}

function PersonCard({
  name,
  meta,
  photo,
  compact,
}: {
  name: string;
  meta: string;
  photo: string;
  compact?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-card">
      <img
        src={photo}
        alt={`Portrait of ${name}`}
        loading="lazy"
        decoding="async"
        width={512}
        height={512}
        className={`shrink-0 rounded-lg bg-muted object-cover ${compact ? "h-8 w-8" : "h-10 w-10"}`}
      />
      <div className="min-w-0">
        <p className={`truncate font-medium ${compact ? "text-[13px]" : "text-sm"}`}>{name}</p>
        <p className="truncate text-xs text-muted-foreground">{meta}</p>
      </div>
    </div>
  );
}

