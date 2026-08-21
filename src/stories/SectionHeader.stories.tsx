import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { SectionHeader } from "@/components/molecules/section-header";

const meta = {
  title: "Molecules/SectionHeader",
  component: SectionHeader,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  args: {
    eyebrow: "Our Products",
    title: "From molten metal to market-ready alloy",
    description:
      "Five product lines, one continuous loop — every batch tracked from scrap intake to certified output.",
  },
} satisfies Meta<typeof SectionHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Centered: Story = { args: { center: true } };
