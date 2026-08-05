import { defineTool } from "@lovable.dev/mcp-js";
import { supabaseForUser } from "../supabase";
import { errorResult, requireUser, textResult } from "../result";
import { SITE_URL } from "@/lib/site";

export default defineTool({
  name: "get_my_profile",
  title: "Get my FAYNO profile",
  description:
    "Return the signed-in user's FAYNO profile (@username, display name, public profile link) plus a count of their family records by privacy level.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    const denied = requireUser(ctx);
    if (denied) return denied;

    const supabase = supabaseForUser(ctx);
    const userId = ctx.getUserId()!;

    const [{ data: profile, error: profileError }, { data: members, error: membersError }] =
      await Promise.all([
        supabase
          .from("profiles")
          .select("username, full_name, created_at")
          .eq("id", userId)
          .maybeSingle(),
        supabase.from("family_members").select("privacy").eq("user_id", userId),
      ]);

    if (profileError) return errorResult(profileError.message);
    if (membersError) return errorResult(membersError.message);
    if (!profile) return errorResult("No FAYNO profile yet — finish onboarding in the app first.");

    const counts = { total: members?.length ?? 0, public: 0, family: 0, private: 0 };
    for (const row of members ?? []) counts[row.privacy] += 1;

    const summary = {
      username: profile.username,
      full_name: profile.full_name,
      public_profile_url: `${SITE_URL}/${profile.username}`,
      member_counts: counts,
    };
    return textResult(JSON.stringify(summary, null, 2), summary);
  },
});
