import type { Meta, StoryObj } from "@storybook/react";
import { Typography } from "./Typography";

const meta: Meta<typeof Typography> = {
  title: "Components/Typography",
  component: Typography,
};
export default meta;

type Story = StoryObj<typeof Typography>;

export const Default: Story = {
  render: () => (
    <div className="flex w-full max-w-2xl flex-col gap-2">
      <Typography variant="h1">Taxing Laughter</Typography>
      <Typography variant="lead">
        The Joke Tax Chronicles — a cautionary tale of fiscal comedy.
      </Typography>
      <Typography>
        The king, being thoroughly amused, imposed a joke tax. Every joke
        told in the kingdom was thereafter subject to a levy, collected by
        the newly established Department of Humour Revenue.
      </Typography>
      <Typography variant="blockquote">
        "I account it one of the wisest laws ever enacted."
      </Typography>
      <Typography variant="muted">
        — Royal Treasurer, 1724 (disputed)
      </Typography>
      <Typography variant="ul">
        <li>Jokes exceeding ten seconds: taxed doubly</li>
        <li>Puns: exempt under the Grandfather Clause</li>
      </Typography>
      <Typography>
        Configure rates in <Typography variant="inlineCode">rates.config</Typography> or run{" "}
        <Typography variant="inlineCode">npm run joke-tax</Typography>.
      </Typography>
    </div>
  ),
};
