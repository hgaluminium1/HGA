import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { FaqSection } from "@/features/public-home/components/faq-section";
import { homeContentEn } from "@/features/public-home/content/home.en";

const meta = {
  title: "Home/FaqSection",
  component: FaqSection,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  args: {
    content: homeContentEn.faq,
  },
} satisfies Meta<typeof FaqSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
