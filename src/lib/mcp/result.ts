import type { ToolContext } from "@lovable.dev/mcp-js";

export function textResult(text: string, structuredContent?: Record<string, unknown>) {
  return structuredContent
    ? { content: [{ type: "text" as const, text }], structuredContent }
    : { content: [{ type: "text" as const, text }] };
}

export function errorResult(text: string) {
  return { content: [{ type: "text" as const, text }], isError: true };
}

/** Returns an error result when the caller has no verified identity. */
export function requireUser(ctx: ToolContext) {
  if (!ctx.isAuthenticated()) return errorResult("Not authenticated. Connect your FAYNO account first.");
  const userId = ctx.getUserId();
  if (!userId) return errorResult("This token carries no user identity.");
  return null;
}
