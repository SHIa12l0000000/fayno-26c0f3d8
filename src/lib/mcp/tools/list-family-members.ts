import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";
import { errorResult, requireUser, textResult } from "../result";

const MEMBER_COLUMNS =
  "id, full_name, relation, father_name, mother_name, birth_year, death_year, village, city, occupation, about, privacy, created_at";

export default defineTool({
  name: "list_family_members",
  title: "List family members",
  description:
    "List the family records saved by the signed-in FAYNO user, newest first. Optionally filter by privacy level or a name/village search term.",
  inputSchema: {
    privacy: z
      .enum(["public", "family", "private"])
      .optional()
      .describe("Only return records with this privacy level."),
    search: z.string().trim().optional().describe("Match against the member's full name."),
    limit: z.number().int().min(1).max(100).optional().describe("Maximum records to return (default 25)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ privacy, search, limit }, ctx) => {
    const denied = requireUser(ctx);
    if (denied) return denied;

    const supabase = supabaseForUser(ctx);
    let query = supabase
      .from("family_members")
      .select(MEMBER_COLUMNS)
      .eq("user_id", ctx.getUserId()!)
      .order("created_at", { ascending: false })
      .limit(limit ?? 25);

    if (privacy) query = query.eq("privacy", privacy);
    if (search) {
      const safe = search.replace(/[%_,.()*\\"':]/g, " ").trim();
      if (safe) query = query.ilike("full_name", `%${safe}%`);
    }

    const { data, error } = await query;
    if (error) return errorResult(error.message);
    return textResult(JSON.stringify(data ?? [], null, 2), { members: data ?? [] });
  },
});
