import { useState } from "react";
import { useAgent } from "agents/react";
import { useAgentChat } from "@cloudflare/ai-chat/react";
import type { UIMessage } from "@ai-sdk/react";
import { ChatHeader } from "./ChatHeader";
import { ChatMessageList } from "./ChatMessageList";
import { ChatInputArea } from "./ChatInputArea";
import { cn } from "@/react-app/lib/utils";

interface AgentState {
  status: string;
  message?: string;
}

interface ChatContainerProps {
  className?: string;
}

function getOrCreateSessionId(): string {
  const key = "tee-time-session";
  let sessionId = localStorage.getItem(key);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(key, sessionId);
  }
  return sessionId;
}

export function ChatContainer({ className }: ChatContainerProps) {
  const [inputValue, setInputValue] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [agentState, setAgentState] = useState<AgentState>({ status: "idle" });

  const agent = useAgent({
    agent: "chat",
    name: getOrCreateSessionId(),
    onStateUpdate: (state) => setAgentState(state as AgentState),
    onOpen: () => setIsConnected(true),
    onClose: () => setIsConnected(false),
  });

  const { messages, sendMessage, stop, status, clearHistory, error } = useAgentChat({
    agent,
  }) as {
    messages: UIMessage[];
    sendMessage: (message: { role: string; parts: { type: string; text: string }[] }) => Promise<void>;
    stop: () => void;
    status: string;
    clearHistory: () => void;
    error: Error | undefined;
  };

  const isLoading = status === "streaming" || status === "submitted";

  const handleSend = async (text: string) => {
    setInputValue("");
    await sendMessage({
      role: "user",
      parts: [{ type: "text", text }],
    });
  };

  return (
    <div
      className={cn(
        "flex h-full min-h-0 flex-col overflow-hidden bg-background",
        className
      )}
    >
      <ChatHeader
        isConnected={isConnected}
        isStreaming={isLoading}
        onStop={() => stop()}
        onClear={() => clearHistory()}
        messageCount={messages.length}
      />

      <ChatMessageList
        messages={messages}
        isLoading={isLoading}
        agentState={agentState}
        onSend={handleSend}
        error={error}
        onRetry={() => {
          const lastUserMsg = [...messages].reverse().find(m => m.role === "user");
          if (lastUserMsg) {
            const text = lastUserMsg.parts
              ?.filter((p) => p.type === "text")
              .map((p) => (p as { type: "text"; text: string }).text)
              .join("");
            if (text) handleSend(text);
          }
        }}
      />

      <ChatInputArea
        value={inputValue}
        onChange={setInputValue}
        onSubmit={() => handleSend(inputValue)}
        onStop={() => stop()}
        isLoading={isLoading}
        isConnected={isConnected}
      />
    </div>
  );
}
