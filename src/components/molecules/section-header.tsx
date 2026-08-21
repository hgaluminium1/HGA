import { Eyebrow } from "@/components/atoms/eyebrow";
import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  center?: boolean;
  className?: string;
  light?: boolean;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  center = false,
  className,
  light = false,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-[clamp(2rem,4vw,3rem)] max-w-xl",
        center && "mx-auto max-w-[42.5rem] text-center",
        className,
      )}
    >
      {eyebrow ? <Eyebrow light={light}>{eyebrow}</Eyebrow> : null}
      <h2 className={cn("text-fs-h2 mt-2.5", light && "text-on-dark")}>
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "text-fs-lead mt-3.5",
            light ? "text-on-dark-muted" : "text-muted-foreground",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
