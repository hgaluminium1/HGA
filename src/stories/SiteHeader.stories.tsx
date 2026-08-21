import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { SiteHeader } from "@/components/organisms/site-header";

const meta = {
  title: "Chrome/SiteHeader",
  component: SiteHeader,
  parameters: {
    layout: "fullscreen",
    viewport: {
      defaultViewport: "desktop",
    },
  },
  tags: ["autodocs"],
  args: {
    locale: "en",
  },
} satisfies Meta<typeof SiteHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {};
export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};
