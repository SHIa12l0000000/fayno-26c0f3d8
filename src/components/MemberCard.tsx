import { Link } from "@tanstack/react-router";
import { Globe, Lock, Users } from "lucide-react";
import type { FamilyMember, Privacy } from "@/lib/family";
import { privacyLabel } from "@/lib/family";
import { cn } from "@/lib/utils";

const icons: Record<Privacy, typeof Globe> = {
  public: Globe,
  family: Users,
  private: Lock,
};

export function PrivacyBadge({ privacy, className }: { privacy: Privacy; className?: string }) {
  const Icon = icons[privacy];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-border bg-muted px-2 py-1 text-xs text-muted-foreground",
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {privacyLabel(privacy)}
    </span>
  );
}

import { Photo } from "@/components/Photo";

export function MemberCard({
  member,
  to,
  params,
}: {
  member: FamilyMember;
  to: string;
  params?: Record<string, string>;
}) {
  return (
    <Link
      to={to}
      params={params as never}
      className="group flex gap-4 rounded-xl border border-border bg-card p-4 shadow-card transition-colors duration-150 hover:border-foreground/20"
    >
      <Photo path={member.photo} name={member.full_name} className="h-16 w-16 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{member.full_name}</p>
        <p className="mt-0.5 truncate text-sm text-muted-foreground">
          {member.relation || "Family member"}
        </p>
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {member.birth_year ? <span>b. {member.birth_year}</span> : null}
          {member.village ? <span className="truncate">{member.village}</span> : null}
        </div>
      </div>
    </Link>
  );
}
