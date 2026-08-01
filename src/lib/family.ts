export type Privacy = "public" | "family" | "private";

export type FamilyMember = {
  id: string;
  user_id: string;
  photo: string | null;
  full_name: string;
  relation: string;
  father_name: string | null;
  mother_name: string | null;
  birth_year: number | null;
  death_year: number | null;
  village: string | null;
  city: string | null;
  occupation: string | null;
  about: string | null;
  privacy: Privacy;
  created_at: string;
};

export const MEMBER_COLUMNS =
  "id, user_id, photo, full_name, relation, father_name, mother_name, birth_year, death_year, village, city, occupation, about, privacy, created_at";

export const PRIVACY_OPTIONS: {
  value: Privacy;
  label: string;
  hint: string;
  recommended?: boolean;
}[] = [
  {
    value: "public",
    label: "Public",
    hint: "Anyone can see this member on your public profile.",
    recommended: true,
  },
  { value: "family", label: "Family only", hint: "Only signed-in FAYNO members can see this record." },
  { value: "private", label: "Private", hint: "Only you can see this member." },
];


export const RELATIONS = [
  "Father",
  "Mother",
  "Grandfather",
  "Grandmother",
  "Great-grandfather",
  "Great-grandmother",
  "Brother",
  "Sister",
  "Son",
  "Daughter",
  "Uncle",
  "Aunt",
  "Cousin",
  "Spouse",
  "Other",
];

export function privacyLabel(privacy: Privacy) {
  return PRIVACY_OPTIONS.find((p) => p.value === privacy)?.label ?? privacy;
}

export function lifespan(member: Pick<FamilyMember, "birth_year" | "death_year">) {
  if (!member.birth_year && !member.death_year) return null;
  return `${member.birth_year ?? "?"} – ${member.death_year ?? "present"}`;
}

export function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function normalizeUsername(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "")
    .slice(0, 20);
}

export function usernameError(value: string) {
  if (value.length < 3) return "Username must be at least 3 characters.";
  if (value.length > 20) return "Username must be 20 characters or fewer.";
  if (!/^[a-z0-9_]+$/.test(value)) return "Use lowercase letters, numbers and underscores only.";
  return null;
}
