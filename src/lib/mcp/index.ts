import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listFamilyMembers from "./tools/list-family-members";
import createFamilyMember from "./tools/create-family-member";
import updateFamilyMember from "./tools/update-family-member";
import deleteFamilyMember from "./tools/delete-family-member";
import getMyProfile from "./tools/get-my-profile";

// The OAuth issuer must be the direct Supabase host. VITE_SUPABASE_PROJECT_ID is
// inlined by Vite at build time and survives publish unchanged.
const projectRef = import.meta.env["VITE_SUPABASE_PROJECT_ID"] ?? "project-ref-unset";

export default defineMcp({
  name: "fayno",
  title: "fayno",
  version: "0.1.0",
  instructions:
    "Tools for FAYNO, a family-history record keeper. Every tool acts as the signed-in FAYNO user. Use `get_my_profile` for their @username and record counts, `list_family_members` to read their family records, and `create_family_member` / `update_family_member` / `delete_family_member` to manage them. Privacy is one of 'public' (visible on their public profile), 'family' (signed-in FAYNO users only) or 'private' (only them); default to 'public' unless the user says otherwise. Always confirm with the user before deleting a record.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [
    getMyProfile,
    listFamilyMembers,
    createFamilyMember,
    updateFamilyMember,
    deleteFamilyMember,
  ],
});
