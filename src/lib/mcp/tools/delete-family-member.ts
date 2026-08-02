import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";
import { errorResult, requireUser, textResult } from "../result";

export default defineTool({
  name: "delete_family_member",
  title: "Delete family member",
  description:
    "Permanently delete one of the signed-in user's family records. This cannot be undone — confirm the person first.",
  inputSchema: {
    id: z.string().trim().min(1).describe("The family record id, from list_family_members."),
  },
  annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ id }, ctx) => {
    const denied = requireUser(ctx);
    if (denied) return denied;

    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("family_members")
      .delete()
      .eq("id", id)
      .eq("user_id", ctx.getUserId()!)
      .select("id, full_name")
      .maybeSingle();

    if (error) return errorResult(error.message);
    if (!data) return errorResult("No family record with that id belongs to you.");
    return textResult(`Deleted ${data.full_name}.`, { deleted: data });
  },
});
