import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact FAYNO" },
      { name: "description", content: "Questions, corrections or account help — how to reach FAYNO." },
      { property: "og:title", content: "Contact FAYNO" },
      {
        property: "og:description",
        content: "Questions, corrections or account help — how to reach FAYNO.",
      },
    ],
  }),
  component: () => (
    <LegalPage title="Contact" intro="A small team reads everything that comes in.">
      <section className="space-y-4">
        <h2>Email</h2>
        <p>
          Write to{" "}
          <a href="mailto:hello@fayno.com" className="text-foreground underline">
            hello@fayno.com
          </a>{" "}
          for general questions, feedback or partnership enquiries.
        </p>
      </section>
      <section className="space-y-4">
        <h2>Privacy and removals</h2>
        <p>
          If a public record mentions you and you want it taken down, email{" "}
          <a href="mailto:privacy@fayno.com" className="text-foreground underline">
            privacy@fayno.com
          </a>{" "}
          with the profile link. We respond to removal requests within five working days.
        </p>
      </section>
      <section className="space-y-4">
        <h2>Account help</h2>
        <p>
          Trouble signing in or resetting a password? Email{" "}
          <a href="mailto:support@fayno.com" className="text-foreground underline">
            support@fayno.com
          </a>{" "}
          from the address on the account.
        </p>
      </section>
    </LegalPage>
  ),
});
