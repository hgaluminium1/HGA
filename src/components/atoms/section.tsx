import { cn } from "@/lib/utils";

type SectionProps = React.ComponentProps<"section"> & {
  alt?: boolean;
  appearance?: "default" | "inverted" | "tinted" | "compact";
};

export function Section({
  className,
  alt = false,
  appearance = "default",
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(
        appearance === "compact"
          ? "py-10 md:py-14"
          : "py-[var(--section-pad)]",
        alt && "bg-bg-alt",
        appearance === "inverted" && "bg-ink text-on-dark",
        appearance === "tinted" && "bg-brand-accent-light",
        className,
      )}
      {...props}
    />
  );
}
