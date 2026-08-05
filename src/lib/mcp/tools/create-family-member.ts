import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";
import { errorResult, requireUser, textResult } from "../result";

export default defineTool({
  name: "create_family_member",
  title: "Add family member",
  description:
    "Add a new family record for the signed-in FAYNO user. Privacy defaults to 'public', which shows the member on the user's public profile.",
  inputSchema: {
    full_name: z.string().trim().min(1).describe("The person's full name."),
    relation: z
      .string()
      .trim()
      .optional()
      .describe("Relation to the user, e.g. Father, Grandmother, Cousin."),
    father_name: z.string().trim().optional(),
    mother_name: z.string().trim().optional(),
    birth_year: z.number().int().optional().describe("Year of birth, e.g. 1958."),
    death_year: z
      .number()
      .int()
      .optional()
      .describe("Year of death, if the person has passed away."),
    village: z.string().trim().optional().describe("Ancestral village or hometown."),
    city: z.string().trim().optional(),
    occupation: z.string().trim().optional(),
    about: z.string().trim().optional().describe("A short biography or memory."),
    privacy: z
      .enum(["public", "family", "private"])
      .optional()
      .describe(
        "'public' (anyone), 'family' (signed-in FAYNO users) or 'private' (only the user).",
      ),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async (input, ctx) => {
    const denied = requireUser(ctx);
    if (denied) return denied;

    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("family_members")
      .insert({
        user_id: ctx.getUserId()!,
        full_name: input.full_name,
        relation: input.relation ?? "",
        father_name: input.father_name ?? null,
        mother_name: input.mother_name ?? null,
        birth_year: input.birth_year ?? null,
        death_year: input.death_year ?? null,
        village: input.village ?? null,
        city: input.city ?? null,
        occupation: input.occupation ?? null,
        about: input.about ?? null,
        privacy: input.privacy ?? "public",
      })
      .select("id, full_name, relation, privacy")
      .single();

    if (error) return errorResult(error.message);
    return textResult(`Added ${data.full_name}. ${JSON.stringify(data)}`, { member: data });
  },
});
