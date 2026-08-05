import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";
import { siteUrl } from "@/lib/site";

const TITLE = "How to Start a Family Tree: A Beginner's Guide (2026)";
const DESCRIPTION =
  "A simple step-by-step guide to starting your family tree: what to write down first, which relatives to ask, how to record names, dates and villages, and how to keep it safe.";
const URL = siteUrl("/blog/how-to-start-a-family-tree");

export const Route = createFileRoute("/blog/how-to-start-a-family-tree")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "How to start a family tree",
          description: DESCRIPTION,
          url: URL,
          totalTime: "PT1H",
          step: [
            {
              "@type": "HowToStep",
              name: "Start with yourself",
              text: "Write your own full name, birth year and birthplace, then work backwards one generation at a time.",
            },
            {
              "@type": "HowToStep",
              name: "Write down what you already know",
              text: "Record parents, grandparents and their siblings from memory before doing any research.",
            },
            {
              "@type": "HowToStep",
              name: "Interview your oldest relatives",
              text: "Ask about names, villages, occupations and stories, and record the conversation.",
            },
            {
              "@type": "HowToStep",
              name: "Collect documents and photographs",
              text: "Gather certificates, land papers, letters and photo backs for names and dates.",
            },
            {
              "@type": "HowToStep",
              name: "Record each person consistently",
              text: "Use full names at birth, four-digit years, and place names as they were known then.",
            },
            {
              "@type": "HowToStep",
              name: "Note what you are unsure about",
              text: "Mark estimates and unverified facts so future readers know what still needs checking.",
            },
            {
              "@type": "HowToStep",
              name: "Keep it in one shareable place",
              text: "Store the tree online so relatives can read it and it survives lost notebooks and phones.",
            },
          ],
        }),
      },
    ],
  }),
  component: Guide,
});

function Guide() {
  return (
    <LegalPage
      title="How to start a family tree"
      intro="A beginner's guide you can finish in an afternoon — no software to learn, no research experience needed."
    >
      <section className="space-y-4">
        <p>
          Most family trees never get started because the first step looks like the hardest one. It
          isn&apos;t. You do not need archives, DNA tests or a subscription to begin — you need one
          page, a few names you already know, and an hour with the oldest person in your family.
        </p>
        <p>Here is the order that works.</p>
      </section>

      <section className="space-y-4">
        <h2>1. Start with yourself, not your ancestors</h2>
        <p>
          Write your own full name, year of birth and place of birth. Then add your parents, then
          their parents. Always move backwards one generation at a time. People who start from a
          famous or distant ancestor almost always get stuck, because there is no verified chain
          connecting them to that person.
        </p>
      </section>

      <section className="space-y-4">
        <h2>2. Empty your memory onto the page first</h2>
        <p>
          Before any research, write down everything you already know: names, nicknames, villages,
          rough years, who married whom, who moved where. Gaps are fine — leave them blank. This
          first draft tells you exactly which questions to ask next.
        </p>
      </section>

      <section className="space-y-4">
        <h2>3. Interview your oldest relatives — soon</h2>
        <p>
          This is the single most valuable hour you will spend, and it is the one that expires. Ask
          open questions and record the conversation with your phone:
        </p>
        <ul>
          <li>What were your parents&apos; and grandparents&apos; full names?</li>
          <li>Which village or town did the family come from originally?</li>
          <li>What work did they do? Did anyone move away, and why?</li>
          <li>Who were the brothers and sisters? Did any die young?</li>
          <li>Is there a story about the family that everyone used to tell?</li>
        </ul>
        <p>
          Write the answers down the same day. Second-hand memories fade faster than you expect.
        </p>
      </section>

      <section className="space-y-4">
        <h2>4. Gather the paper that already exists in the house</h2>
        <p>
          Before searching public records, look through what your family already keeps: birth,
          marriage and death certificates, school records, land or property papers, old passports,
          letters, and the backs of photographs — names and dates are often written there.
        </p>
      </section>

      <section className="space-y-4">
        <h2>5. Record every person the same way</h2>
        <p>Consistency is what makes a tree usable ten years from now. For each person, capture:</p>
        <ul>
          <li>Full name as given at birth, plus any name they were commonly known by</li>
          <li>Four-digit birth year, and death year if they have passed away</li>
          <li>Father&apos;s and mother&apos;s names — this is what actually links generations</li>
          <li>Ancestral village or hometown, and the city they later lived in</li>
          <li>Occupation, and a few sentences of biography or a single memory</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2>6. Mark what you are not sure about</h2>
        <p>
          Write &quot;around 1940&quot; rather than inventing 1940, and note where a fact came from
          (&quot;from Dadi, 2026&quot;). An honest tree with visible gaps is far more useful than a
          tidy one that quietly mixes memory with guesses.
        </p>
      </section>

      <section className="space-y-4">
        <h2>7. Keep it somewhere your family can actually reach</h2>
        <p>
          Notebooks are lost, phones are replaced, spreadsheets end up on one laptop. Keep the tree
          in one place online, decide per person whether their record is public, family-only or
          private, and share a single link with your relatives. They will correct and add to it —
          that is how a family tree grows.
        </p>
      </section>

      <section className="space-y-4">
        <h2>Common mistakes to avoid</h2>
        <ul>
          <li>Starting from a distant ancestor instead of yourself</li>
          <li>Copying an unsourced online tree into your own</li>
          <li>Recording only men, or only the direct line — siblings hold the clues</li>
          <li>Waiting until you have &quot;enough&quot; information to write anything down</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2>Start your tree now</h2>
        <p>
          FAYNO is built for exactly this first hour: add a person, add their parents&apos; names
          and village, choose who can see it, and share your profile link with the family.
        </p>
        <p>
          <Link
            to="/auth"
            search={{ mode: "signup" }}
            className="font-medium text-primary underline"
          >
            Create a free FAYNO account
          </Link>{" "}
          or{" "}
          <Link to="/about" className="font-medium text-primary underline">
            read more about FAYNO
          </Link>
          .
        </p>
      </section>
    </LegalPage>
  );
}
