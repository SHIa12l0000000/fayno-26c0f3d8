import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About FAYNO" },
      {
        name: "description",
        content: "FAYNO helps families preserve memories, relationships and stories for future generations.",
      },
      { property: "og:title", content: "About FAYNO" },
      {
        property: "og:description",
        content: "FAYNO helps families preserve memories, relationships and stories for future generations.",
      },
    ],
  }),
  component: () => (
    <LegalPage
      title="About FAYNO"
      intro="Helping families preserve memories, relationships and stories for future generations."
    >
      <section className="space-y-4">
        <h2>What FAYNO does</h2>
        <p>
          FAYNO is a simple place to write down who your family is. You add the people you know —
          parents, grandparents, the ones you only heard stories about — along with their village,
          the years they lived, what they did, and a short memory. Photographs can be attached where
          they exist.
        </p>
      </section>
      <section className="space-y-4">
        <h2>Why it&apos;s deliberately small</h2>
        <p>
          Genealogy tools are usually built for researchers. FAYNO is built for a family member who
          has an hour and a few names. There is no chart to master and nothing to configure — a form,
          a list, and a page you can share.
        </p>
      </section>
      <section className="space-y-4">
        <h2>Where it&apos;s going</h2>
        <p>
          This is the first version. Family collaboration, invitations and a visual family tree are
          the next steps. Anything added later will keep the same rule: every record stays under the
          control of the person who wrote it.
        </p>
      </section>
    </LegalPage>
  ),
});
