"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, MapPin } from "lucide-react";

import type {
  CareerDepartment,
  CareerEmploymentType,
  CareerOpeningDTO,
} from "@/modules/careers/browser";
import { cn } from "@/lib/utils";

const DEPT_LABEL: Record<CareerDepartment, string> = {
  operations: "Operations",
  quality: "Quality",
  maintenance: "Maintenance",
  commercial: "Commercial",
  engineering: "Engineering",
  hr: "People & HR",
  other: "Other",
};

const TYPE_LABEL: Record<CareerEmploymentType, string> = {
  full_time: "Full-time",
  contract: "Contract",
  internship: "Internship",
};

type OpenRolesBoardProps = {
  openings: CareerOpeningDTO[];
  hrEmail: string | null;
  contactHref: string;
};

export function OpenRolesBoard({
  openings,
  hrEmail,
  contactHref,
}: OpenRolesBoardProps) {
  const [department, setDepartment] = useState<CareerDepartment | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const departments = useMemo(() => {
    const set = new Set(openings.map((o) => o.department));
    return (Object.keys(DEPT_LABEL) as CareerDepartment[]).filter((d) =>
      set.has(d),
    );
  }, [openings]);

  const filtered = useMemo(
    () =>
      department === "all"
        ? openings
        : openings.filter((o) => o.department === department),
    [openings, department],
  );

  function applyHref(opening: CareerOpeningDTO) {
    const email = opening.applyEmail || hrEmail;
    if (email) {
      const subject = encodeURIComponent(`Application: ${opening.title}`);
      const body = encodeURIComponent(
        `Hello HG HR,\n\nI am applying for ${opening.title} (${opening.location}).\n\n`,
      );
      return `mailto:${email}?subject=${subject}&body=${body}`;
    }
    return contactHref;
  }

  return (
    <div>
      <div className="flex flex-col gap-4 min-[720px]:flex-row min-[720px]:items-end min-[720px]:justify-between">
        <div>
          <p className="text-muted-foreground text-sm">
            {filtered.length} open role{filtered.length === 1 ? "" : "s"}
            {department !== "all" ? ` in ${DEPT_LABEL[department]}` : ""}
          </p>
        </div>
        <div
          className="flex flex-wrap gap-1.5"
          role="group"
          aria-label="Filter by department"
        >
          <FilterChip
            active={department === "all"}
            onClick={() => setDepartment("all")}
            label="All teams"
          />
          {departments.map((d) => (
            <FilterChip
              key={d}
              active={department === d}
              onClick={() => setDepartment(d)}
              label={DEPT_LABEL[d]}
            />
          ))}
        </div>
      </div>

      <ul className="mt-6 divide-y divide-black/[0.08] border-y border-black/[0.08]">
        {filtered.map((opening) => {
          const open = expanded === opening.id;
          return (
            <li key={opening.id}>
              <button
                type="button"
                className="hover:bg-black/[0.015] flex w-full flex-col gap-2 px-1 py-5 text-left transition-colors min-[720px]:flex-row min-[720px]:items-center min-[720px]:gap-6"
                onClick={() => setExpanded(open ? null : opening.id)}
                aria-expanded={open}
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-[1.05rem] font-semibold tracking-tight text-ink">
                    {opening.title}
                  </span>
                  <span className="text-muted-foreground mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.8125rem]">
                    <span>{DEPT_LABEL[opening.department]}</span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="size-3.5 opacity-70" aria-hidden />
                      {opening.location}
                    </span>
                    <span>{TYPE_LABEL[opening.employmentType]}</span>
                  </span>
                </span>
                <span className="text-brand-blue shrink-0 text-[0.8125rem] font-semibold">
                  {open ? "Hide details" : "View role"}
                </span>
              </button>
              {open ? (
                <div className="border-t border-black/[0.04] px-1 pt-4 pb-6">
                  {opening.summary ? (
                    <p className="text-muted-foreground max-w-3xl text-[0.9375rem] leading-relaxed">
                      {opening.summary}
                    </p>
                  ) : null}
                  {opening.description ? (
                    <div className="mt-4 max-w-3xl whitespace-pre-wrap text-[0.875rem] leading-relaxed text-ink/85">
                      {opening.description}
                    </div>
                  ) : null}
                  <a
                    href={applyHref(opening)}
                    className="bg-brand-blue hover:bg-brand-blue-dark mt-5 inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-md)] px-5 text-[0.875rem] font-semibold text-white transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Apply
                    <ArrowUpRight className="size-4" />
                  </a>
                </div>
              ) : null}
            </li>
          );
        })}
        {filtered.length === 0 ? (
          <li className="text-muted-foreground py-10 text-center text-sm">
            No roles in this team right now — try another filter or send an open
            application below.
          </li>
        ) : null}
      </ul>
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-8 rounded-[var(--radius-md)] px-3 text-[0.75rem] font-semibold transition-colors",
        active
          ? "bg-ink text-white"
          : "bg-bg-alt text-ink/80 hover:bg-black/[0.06]",
      )}
    >
      {label}
    </button>
  );
}
