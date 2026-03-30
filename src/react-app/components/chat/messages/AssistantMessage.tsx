import Markdown from "react-markdown";
import { MessageBubble } from "./MessageBubble";
import { GenerativeUI } from "./GenerativeUI";
import { ToolCallCard } from "../tools/ToolCallCard";
import type { Spec } from "@json-render/core";
import type { UIMessage } from "@ai-sdk/react";

type ToolStatus = "pending" | "running" | "success" | "error";

interface NormalizedToolPart {
  toolCallId: string;
  toolName: string;
  args: Record<string, unknown>;
  state: string;
  result?: unknown;
}

interface AssistantMessageProps {
  message: UIMessage;
  agentState?: {
    status: string;
    message?: string;
  };
}

function getToolStatus(state: string, agentStatus?: string): ToolStatus {
  if (state === "result" || state === "output-available") return "success";
  if (agentStatus === "error") return "error";
  if (
    state === "call" ||
    state === "partial-call" ||
    state === "input-available" ||
    state === "input-streaming"
  )
    return "running";
  return "pending";
}

interface ToolInvocationPart {
  type: "tool-invocation";
  toolInvocation: {
    toolCallId: string;
    toolName: string;
    args: Record<string, unknown>;
    state: string;
    result?: unknown;
  };
}

interface StaticToolPart {
  type: string;
  toolCallId: string;
  state: string;
  input?: Record<string, unknown>;
  output?: unknown;
}

function isToolInvocationPart(part: { type: string }): part is ToolInvocationPart {
  return (
    part.type === "tool-invocation" &&
    "toolInvocation" in part &&
    typeof (part as Record<string, unknown>).toolInvocation === "object"
  );
}

function isStaticToolPart(part: { type: string }): part is StaticToolPart {
  return (
    part.type.startsWith("tool-") &&
    part.type !== "tool-invocation" &&
    "toolCallId" in part &&
    "state" in part
  );
}

function normalizeToolParts(parts: UIMessage["parts"]): NormalizedToolPart[] {
  if (!parts) return [];

  const result: NormalizedToolPart[] = [];

  for (const part of parts) {
    if (isToolInvocationPart(part)) {
      const { toolInvocation: inv } = part;
      result.push({
        toolCallId: inv.toolCallId,
        toolName: inv.toolName,
        args: inv.args,
        state: inv.state,
        result: inv.result,
      });
    } else if (isStaticToolPart(part)) {
      result.push({
        toolCallId: part.toolCallId,
        toolName: part.type.replace("tool-", ""),
        args: part.input ?? {},
        state: part.state,
        result: part.output,
      });
    }
  }

  return result;
}

export function AssistantMessage({ message, agentState }: AssistantMessageProps) {
  const textParts = message.parts?.filter((part) => part.type === "text") ?? [];
  const uiParts = (message.parts ?? []).filter(
    (p) => (p as { type: string }).type === "data-ui"
  ) as { type: string; id?: string; data: Spec }[];
  const toolParts = normalizeToolParts(message.parts);

  const textContent = textParts
    .map((part) => (part as { type: "text"; text: string }).text)
    .join("");

  return (
    <MessageBubble role="assistant">
      <div className="space-y-3">
        {textContent && (
          <div className="leading-relaxed text-foreground prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0">
            <Markdown>{textContent}</Markdown>
          </div>
        )}

        {uiParts.map((part) => (
          <GenerativeUI key={part.id ?? "ui"} spec={part.data} />
        ))}

        {toolParts.map((tool) => {
          const status = getToolStatus(tool.state, agentState?.status);
          return (
            <ToolCallCard
              key={tool.toolCallId}
              toolName={tool.toolName}
              status={status}
              progress={
                status === "running" && agentState?.message
                  ? { message: agentState.message }
                  : undefined
              }
              result={tool.result}
              error={
                status === "error" ? agentState?.message || "An error occurred" : undefined
              }
            />
          );
        })}
      </div>
    </MessageBubble>
  );
}
