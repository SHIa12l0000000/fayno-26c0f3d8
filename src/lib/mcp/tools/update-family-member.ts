import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";
import { errorResult, requireUser, textResult } from "../result";

export default defineTool({
  name: "update_family_member",
  title: "Update family member",
  description:
    "Update fields on one of the signed-in user's existing family records. Only the fields you pass are changed.",
  inputSchema: {
    id: z.string().trim().min(1).describe("The family record id, from list_family_members."),
    full_name: z.string().trim().optional(),
    relation: z.string().trim().optional(),
    father_name: z.string().trim().optional(),
    mother_name: z.string().trim().optional(),
    birth_year: z.number().int().optional(),
    death_year: z.number().int().optional(),
    village: z.string().trim().optional(),
    city: z.string().trim().optional(),
    occupation: z.string().trim().optional(),
    about: z.string().trim().optional(),
    privacy: z.enum(["public", "family", "private"]).optional(),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  handler: async ({ id, ...fields }, ctx) => {
    const denied = requireUser(ctx);
    if (denied) return denied;

    const patch = Object.fromEntries(
      Object.entries(fields).filter(([, value]) => value !== undefined),
    );
    if (Object.keys(patch).length === 0) return errorResult("Pass at least one field to update.");

    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("family_members")
      .update(patch)
      .eq("id", id)
      .eq("user_id", ctx.getUserId()!)
      .select("id, full_name, relation, privacy")
      .maybeSingle();

    if (error) return errorResult(error.message);
    if (!data) return errorResult("No family record with that id belongs to you.");
    return textResult(`Updated ${data.full_name}. ${JSON.stringify(data)}`, { member: data });
  },
});
