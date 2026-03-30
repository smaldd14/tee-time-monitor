import type { UIMessage } from "ai";
import { isStaticToolUIPart } from "ai";

export function cleanupMessages(messages: UIMessage[]): UIMessage[] {
  return messages.filter((message) => {
    if (!message.parts) return true;

    const hasIncompleteToolCall = message.parts.some((part) => {
      if (!isStaticToolUIPart(part)) return false;
      return (
        part.state === "input-streaming" ||
        (part.state === "input-available" && !part.output && !part.errorText)
      );
    });

    return !hasIncompleteToolCall;
  });
}
