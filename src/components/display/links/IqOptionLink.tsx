import { Anchor } from "@mantine/core";

export default function IqOptionLink({ path }: { path: string }) {
  return (
    <Anchor
      href={`https://iqoption.com${path}`}
      target="_blank"
      rel="noopener noreferrer"
      c="blue"
      fw={500}
      td="underline"
    >
      https://iqoption.com{path}
    </Anchor>
  );
}
