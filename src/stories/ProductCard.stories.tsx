import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

type ProductCardProps = {
  title: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
  wide?: boolean;
};

function ProductCard({
  title,
  href,
  imageSrc,
  imageAlt,
  wide,
}: ProductCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "shadow-brand-sm group relative flex min-h-[300px] items-end overflow-hidden rounded-[var(--radius-lg)]",
        wide && "min-h-[220px]",
      )}
    >
      <Image src={imageSrc} alt={imageAlt} fill className="object-cover" />
      <span className="absolute inset-0 bg-linear-to-t from-ink/85 to-transparent" />
      <span className="relative z-10 flex w-full items-end justify-between gap-3 p-5 text-on-dark">
        <span>
          <span className="text-xs font-bold tracking-wide uppercase text-gold">
            Our Product
          </span>
          <strong className="mt-1 block text-lg">{title}</strong>
        </span>
        <ArrowUpRight className="size-5" />
      </span>
    </Link>
  );
}

const meta = {
  title: "Molecules/ProductCard",
  component: ProductCard,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  args: {
    title: "Aluminium Billets",
    href: "/en/products/billets",
    imageSrc: "https://picsum.photos/seed/hg-billets/700/562",
    imageAlt: "Cylindrical aluminium billets",
  },
} satisfies Meta<typeof ProductCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Wide: Story = { args: { wide: true } };
