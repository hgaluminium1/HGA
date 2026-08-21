import { cn } from "@/lib/utils";

type EyebrowProps = React.ComponentProps<"span"> & {
  light?: boolean;
};

export function Eyebrow({ className, light = false, ...props }: EyebrowProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-[0.78rem] font-bold tracking-[0.14em] uppercase",
        light ? "text-gold" : "text-brand-accent",
        "before:h-0.5 before:w-[22px] before:rounded-sm before:bg-current before:content-['']",
        className,
      )}
      {...props}
    />
  );
}
