import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { HeroCarousel } from "@/features/public-home/components/hero-carousel";
import { homeContentEn } from "@/features/public-home/content/home.en";

const meta = {
  title: "Home/HeroCarousel",
  component: HeroCarousel,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  args: {
    locale: "en",
    content: homeContentEn.hero,
  },
} satisfies Meta<typeof HeroCarousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
