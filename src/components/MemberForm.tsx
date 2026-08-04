import { useState, type FormEvent } from "react";
import { Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Photo } from "@/components/Photo";
import { PRIVACY_OPTIONS, RELATIONS, type FamilyMember, type Privacy } from "@/lib/family";
import { uploadPhoto } from "@/lib/photos";
import { cn } from "@/lib/utils";

export type MemberFormValues = {
  photo: string | null;
  full_name: string;
  relation: string;
  father_name: string;
  mother_name: string;
  birth_year: string;
  death_year: string;
  village: string;
  city: string;
  occupation: string;
  about: string;
  privacy: Privacy;
};

export function toFormValues(member?: FamilyMember | null): MemberFormValues {
  return {
    photo: member?.photo ?? null,
    full_name: member?.full_name ?? "",
    relation: member?.relation ?? "",
    father_name: member?.father_name ?? "",
    mother_name: member?.mother_name ?? "",
    birth_year: member?.birth_year ? String(member.birth_year) : "",
    death_year: member?.death_year ? String(member.death_year) : "",
    village: member?.village ?? "",
    city: member?.city ?? "",
    occupation: member?.occupation ?? "",
    about: member?.about ?? "",
    privacy: member?.privacy ?? "public",
  };
}

export function memberPayload(values: MemberFormValues) {
  return {
    photo: values.photo,
    full_name: values.full_name.trim(),
    relation: values.relation,
    father_name: values.father_name.trim() || null,
    mother_name: values.mother_name.trim() || null,
    birth_year: values.birth_year ? Number(values.birth_year) : null,
    death_year: values.death_year ? Number(values.death_year) : null,
    village: values.village.trim() || null,
    city: values.city.trim() || null,
    occupation: values.occupation.trim() || null,
    about: values.about.trim() || null,
    privacy: values.privacy,
  };
}

const currentYear = new Date().getFullYear();

function validate(values: MemberFormValues) {
  const errors: Partial<Record<keyof MemberFormValues, string>> = {};
  if (!values.full_name.trim()) errors.full_name = "Full name is required.";
  if (values.full_name.length > 100) errors.full_name = "Keep the name under 100 characters.";
  if (!values.relation.trim()) errors.relation = "Choose how this person is related to you.";
  for (const key of ["birth_year", "death_year"] as const) {
    const raw = values[key];
    if (!raw) continue;
    const year = Number(raw);
    if (!Number.isInteger(year) || year < 1000 || year > currentYear) {
      errors[key] = `Enter a year between 1000 and ${currentYear}.`;
    }
  }
  if (!errors.birth_year && !errors.death_year && values.birth_year && values.death_year) {
    if (Number(values.death_year) < Number(values.birth_year)) {
      errors.death_year = "Death year cannot be before birth year.";
    }
  }
  if (values.about.length > 1500) errors.about = "Keep the memory under 1500 characters.";
  return errors;
}

export function MemberForm({
  userId,
  initial,
  submitLabel,
  onCancel,
  onSubmit,
}: {
  userId: string;
  initial: MemberFormValues;
  submitLabel: string;
  onCancel: () => void;
  onSubmit: (values: MemberFormValues) => Promise<void>;
}) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof MemberFormValues, string>>>({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  function set<K extends keyof MemberFormValues>(key: K, value: MemberFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setUploadError(null);
    if (!ALLOWED_PHOTO_TYPES[file.type]) {
      setUploadError("Please choose a JPG, PNG, WebP or GIF image.");
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setUploadError("Images must be smaller than 5 MB.");
      return;
    }

    setUploading(true);
    try {
      const path = await uploadPhoto(userId, file);
      set("photo", path);
    } catch {
      setUploadError("We couldn't upload that photo. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setSaving(true);
    try {
      await onSubmit(values);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      <section className="flex flex-wrap items-center gap-5">
        <Photo path={values.photo} name={values.full_name || "New member"} className="h-20 w-20" />
        <div>
          <Label
            htmlFor="member-photo"
            className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-normal transition-colors duration-150 hover:bg-muted"
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <Upload className="h-4 w-4" aria-hidden />
            )}
            {values.photo ? "Replace photo" : "Upload photo"}
          </Label>
          <input
            id="member-photo"
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <p className="mt-2 text-xs text-muted-foreground">JPG or PNG, up to 5 MB. Optional.</p>
          {uploadError ? <p className="mt-1 text-xs text-destructive">{uploadError}</p> : null}
        </div>
      </section>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" htmlFor="full_name" error={errors.full_name} required>
          <Input
            id="full_name"
            value={values.full_name}
            maxLength={100}
            onChange={(e) => set("full_name", e.target.value)}
            placeholder="Amar Singh Bedi"
          />
        </Field>

        <Field label="Relation" htmlFor="relation" error={errors.relation} required>
          <select
            id="relation"
            value={values.relation}
            onChange={(e) => set("relation", e.target.value)}
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-card transition-colors duration-150 focus-visible:border-ring"
          >
            <option value="">Select a relation</option>
            {RELATIONS.map((relation) => (
              <option key={relation} value={relation}>
                {relation}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Father's name" htmlFor="father_name">
          <Input
            id="father_name"
            value={values.father_name}
            maxLength={100}
            onChange={(e) => set("father_name", e.target.value)}
          />
        </Field>

        <Field label="Mother's name" htmlFor="mother_name">
          <Input
            id="mother_name"
            value={values.mother_name}
            maxLength={100}
            onChange={(e) => set("mother_name", e.target.value)}
          />
        </Field>

        <Field label="Birth year" htmlFor="birth_year" error={errors.birth_year}>
          <Input
            id="birth_year"
            inputMode="numeric"
            value={values.birth_year}
            onChange={(e) => set("birth_year", e.target.value.replace(/\D/g, "").slice(0, 4))}
            placeholder="1942"
          />
        </Field>

        <Field label="Death year" htmlFor="death_year" error={errors.death_year} hint="Optional">
          <Input
            id="death_year"
            inputMode="numeric"
            value={values.death_year}
            onChange={(e) => set("death_year", e.target.value.replace(/\D/g, "").slice(0, 4))}
          />
        </Field>

        <Field label="Village" htmlFor="village">
          <Input
            id="village"
            value={values.village}
            maxLength={80}
            onChange={(e) => set("village", e.target.value)}
          />
        </Field>

        <Field label="City" htmlFor="city">
          <Input
            id="city"
            value={values.city}
            maxLength={80}
            onChange={(e) => set("city", e.target.value)}
          />
        </Field>

        <Field label="Occupation" htmlFor="occupation" className="sm:col-span-2">
          <Input
            id="occupation"
            value={values.occupation}
            maxLength={80}
            onChange={(e) => set("occupation", e.target.value)}
            placeholder="Farmer, teacher, shopkeeper…"
          />
        </Field>

        <Field
          label="About"
          htmlFor="about"
          className="sm:col-span-2"
          error={errors.about}
          hint="A short memory, story or detail worth remembering."
        >
          <Textarea
            id="about"
            rows={5}
            value={values.about}
            maxLength={1500}
            onChange={(e) => set("about", e.target.value)}
          />
        </Field>
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium">Privacy</legend>
        <div className="grid gap-2 sm:grid-cols-3">
          {PRIVACY_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={cn(
                "cursor-pointer rounded-xl border p-3 transition-colors duration-150",
                values.privacy === option.value
                  ? "border-primary bg-primary-soft"
                  : "border-border hover:bg-muted",
              )}
            >
              <input
                type="radio"
                name="privacy"
                value={option.value}
                checked={values.privacy === option.value}
                onChange={() => set("privacy", option.value)}
                className="sr-only"
              />
              <span className="flex items-center gap-2 text-sm font-medium">
                {option.label}
                {option.recommended ? (
                  <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-medium text-primary-foreground">
                    Recommended
                  </span>
                ) : null}
              </span>
              <span className="mt-1 block text-xs text-muted-foreground">{option.hint}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-wrap gap-3 border-t border-border pt-6">
        <Button type="submit" disabled={saving || uploading}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
          {submitLabel}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
  error,
  hint,
  required,
  className,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={htmlFor}>
        {label}
        {required ? <span className="text-muted-foreground"> *</span> : null}
      </Label>
      {children}
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
