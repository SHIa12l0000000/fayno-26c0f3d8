import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — FAYNO" },
      { name: "description", content: "The terms that apply when you use FAYNO." },
      { property: "og:title", content: "Terms of Service — FAYNO" },
      { property: "og:description", content: "The terms that apply when you use FAYNO." },
    ],
  }),
  component: () => (
    <LegalPage title="Terms of Service" intro="Last updated 30 July 2026.">
      <section className="space-y-4">
        <h2>Your account</h2>
        <p>
          You need an account to add family records. Keep your password to yourself; you are
          responsible for activity carried out through your account.
        </p>
      </section>
      <section className="space-y-4">
        <h2>Your content</h2>
        <p>
          The records and photographs you upload remain yours. You give FAYNO permission to store
          and display them according to the privacy setting you choose for each record. Only upload
          material you have the right to share, and be considerate about publishing details of
          living relatives.
        </p>
      </section>
      <section className="space-y-4">
        <h2>Acceptable use</h2>
        <ul>
          <li>Do not upload unlawful, abusive or deliberately false material.</li>
          <li>Do not attempt to access records that are not shared with you.</li>
          <li>Do not scrape or bulk-collect other people&apos;s public profiles.</li>
        </ul>
      </section>
      <section className="space-y-4">
        <h2>Service availability</h2>
        <p>
          FAYNO is an early product provided as is. We may change or interrupt features, and we
          recommend keeping your own copies of irreplaceable photographs.
        </p>
      </section>
    </LegalPage>
  ),
});
