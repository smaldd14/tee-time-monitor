import { Renderer, JSONUIProvider } from "@json-render/react";
import type { Spec } from "@json-render/core";
import { teeTimeRegistry } from "@/react-app/lib/json-render";

interface GenerativeUIProps {
  spec: Spec;
}

export function GenerativeUI({ spec }: GenerativeUIProps) {
  return (
    <JSONUIProvider registry={teeTimeRegistry}>
      <Renderer spec={spec} registry={teeTimeRegistry} />
    </JSONUIProvider>
  );
}
