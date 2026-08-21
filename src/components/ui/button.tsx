import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "rounded-full bg-linear-to-br from-brand-accent to-brand-accent-dark text-primary-foreground shadow-[0_8px_20px_rgb(148_50_168_/_0.35)] hover:-translate-y-0.5 hover:bg-transparent hover:shadow-[0_12px_28px_rgb(148_50_168_/_0.45)]",
        outline:
          "rounded-full border-[1.5px] border-line bg-surface text-foreground hover:border-brand-accent hover:bg-surface hover:text-brand-accent",
        secondary:
          "rounded-full bg-secondary text-secondary-foreground hover:bg-bg-alt",
        ghost:
          "rounded-full hover:bg-muted hover:text-foreground",
        "ghost-light":
          "rounded-full border-[1.5px] border-white/55 bg-white/12 text-white backdrop-blur-sm hover:-translate-y-0.5 hover:bg-white/22",
        destructive:
          "rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-auto gap-2 px-6 py-3.5 text-[0.94rem] font-semibold",
        xs: "h-6 gap-1 rounded-full px-2 text-xs",
        sm: "h-auto gap-1.5 rounded-full px-4 py-2.5 text-[0.85rem] font-semibold",
        lg: "h-auto gap-2 rounded-full px-7 py-4 text-base font-semibold",
        icon: "size-10 rounded-full",
        "icon-xs": "size-6 rounded-full",
        "icon-sm": "size-9 rounded-full",
        "icon-lg": "size-11 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  nativeButton,
  render,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  // Link (and other non-<button>) render props need nativeButton=false
  // so Base UI does not force native button semantics.
  const resolvedNativeButton = nativeButton ?? render == null;

  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      nativeButton={resolvedNativeButton}
      render={render}
      {...props}
    />
  );
}

export { Button, buttonVariants }
