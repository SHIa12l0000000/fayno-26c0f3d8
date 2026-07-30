import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — FAYNO" },
      {
        name: "description",
        content: "How FAYNO stores your family records and what is visible to other people.",
      },
      { property: "og:title", content: "Privacy Policy — FAYNO" },
      {
        property: "og:description",
        content: "How FAYNO stores your family records and what is visible to other people.",
      },
    ],
  }),
  component: () => (
    <LegalPage title="Privacy Policy" intro="Last updated 30 July 2026.">
      <section className="space-y-4">
        <h2>What we store</h2>
        <ul>
          <li>Your account email and password, handled by our authentication provider.</li>
          <li>Your name, username and optional profile photo.</li>
          <li>The family records you create, including any photos you upload.</li>
        </ul>
      </section>
      <section className="space-y-4">
        <h2>Who can see your records</h2>
        <p>Each family member you add carries one of three settings, chosen by you:</p>
        <ul>
          <li>
            <strong>Public</strong> — shown on your public profile and in search results.
          </li>
          <li>
            <strong>Family only</strong> — visible to signed-in FAYNO accounts, not to the open web.
          </li>
          <li>
            <strong>Private</strong> — visible only to you.
          </li>
        </ul>
        <p>
          Your email address is never displayed on a public page, is not searchable, and is not
          shared with other users.
        </p>
      </section>
      <section className="space-y-4">
        <h2>Your control</h2>
        <p>
          You can edit or delete any record at any time. Deleting a record removes it from our
          database. Deleting your account removes your profile and every record attached to it.
        </p>
      </section>
      <section className="space-y-4">
        <h2>Third parties</h2>
        <p>
          We do not sell data and we do not run advertising. Data is processed only by the
          infrastructure providers required to run the service — hosting, database and
          authentication.
        </p>
      </section>
    </LegalPage>
  ),
});
