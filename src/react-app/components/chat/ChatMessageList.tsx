import { useRef, useLayoutEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowDown, AlertCircle, RotateCcw } from "lucide-react";
import { ScrollArea } from "@/react-app/components/ui/scroll-area";
import { Button } from "@/react-app/components/ui/button";
import { ChatEmptyState } from "./ChatEmptyState";
import { UserMessage } from "./messages/UserMessage";
import { AssistantMessage } from "./messages/AssistantMessage";
import { StreamingMessage } from "./messages/StreamingMessage";
import type { UIMessage } from "@ai-sdk/react";

interface ChatMessageListProps {
  messages: UIMessage[];
  isLoading: boolean;
  agentState?: {
    status: string;
    message?: string;
  };
  onSend: (text: string) => void;
  error?: Error;
  onRetry?: () => void;
}

export function ChatMessageList({
  messages,
  isLoading,
  agentState,
  onSend,
  error,
  onRetry,
}: ChatMessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const initialScrollDone = useRef(false);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    bottomRef.current?.scrollIntoView({ behavior });
  };

  useLayoutEffect(() => {
    if (messages.length > 0 && !initialScrollDone.current) {
      initialScrollDone.current = true;
      requestAnimationFrame(() => scrollToBottom("smooth"));
    }
  }, [messages.length]);

  useLayoutEffect(() => {
    const scrollContainer = scrollRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]"
    ) as HTMLElement | null;

    if (!scrollContainer) return;

    const checkScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom && messages.length > 0);
    };

    scrollContainer.addEventListener("scroll", checkScroll);
    return () => scrollContainer.removeEventListener("scroll", checkScroll);
  }, [messages.length]);

  useLayoutEffect(() => {
    if (!initialScrollDone.current) return;

    const scrollContainer = scrollRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]"
    ) as HTMLElement | null;

    if (!scrollContainer) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;

    if (isNearBottom) {
      scrollToBottom();
    }
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="min-h-0 flex-1">
        <ChatEmptyState onSend={onSend} />
      </div>
    );
  }

  return (
    <div className="relative min-h-0 flex-1 overflow-hidden">
      <ScrollArea ref={scrollRef} className="h-full">
        <div
          className="mx-auto flex max-w-2xl flex-col gap-6 px-4 pt-4 pb-32"
          role="log"
          aria-label="Chat messages"
          aria-live="polite"
        >
          {messages.map((message) => {
            if (message.role === "user") {
              const textContent = message.parts
                ?.filter((part) => part.type === "text")
                .map((part) => (part as { type: "text"; text: string }).text)
                .join("");

              return (
                <UserMessage key={message.id} content={textContent || ""} />
              );
            }

            return (
              <AssistantMessage
                key={message.id}
                message={message}
                agentState={agentState}
              />
            );
          })}

          {isLoading &&
            (messages.length === 0 ||
              messages[messages.length - 1]?.role === "user") && (
              <StreamingMessage />
            )}

          {error && !isLoading && (
            <motion.div
              className="flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle className="size-4 shrink-0 text-destructive" />
              <span className="flex-1 text-destructive">
                Something went wrong. Please try again.
              </span>
              {onRetry && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="shrink-0 text-destructive hover:text-destructive"
                  onClick={onRetry}
                >
                  <RotateCcw className="mr-1.5 size-3.5" />
                  Retry
                </Button>
              )}
            </motion.div>
          )}

          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      <AnimatePresence>
        {showScrollButton && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-4 left-1/2 flex size-8 -translate-x-1/2 items-center justify-center rounded-full border bg-background text-muted-foreground shadow-md"
            onClick={() => scrollToBottom()}
            aria-label="Scroll to bottom"
          >
            <ArrowDown className="size-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
