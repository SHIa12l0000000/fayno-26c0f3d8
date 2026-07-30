import type { ReactNode } from "react";
import { PageShell } from "@/components/site/PageShell";

export function LegalPage({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <PageShell>
      <div className="mx-auto max-w-2xl px-5 py-16">
        <h1 className="text-2xl font-semibold">{title}</h1>
        {intro ? <p className="mt-3 text-[15px] text-muted-foreground">{intro}</p> : null}
        <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-muted-foreground [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-foreground [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-1.5">
          {children}
        </div>
      </div>
    </PageShell>
  );
}
