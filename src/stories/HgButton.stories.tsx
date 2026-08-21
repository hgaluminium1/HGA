import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Button } from "@/components/ui/button";

const meta = {
  title: "UI/Button",
  component: Button,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    children: "Inquire Now",
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const Outline: Story = { args: { variant: "outline" } };
export const GhostLight: Story = {
  args: { variant: "ghost-light" },
  decorators: [
    (Story) => (
      <div className="bg-ink rounded-xl p-8">
        <Story />
      </div>
    ),
  ],
};
export const Small: Story = { args: { size: "sm" } };
