import { useRef, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/react-app/components/ui/button";
import { Send, Square } from "lucide-react";
import { cn } from "@/react-app/lib/utils";

interface ChatInputAreaProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onStop?: () => void;
  isLoading: boolean;
  isConnected: boolean;
  suggestions?: { label: string; prompt: string }[];
  onSuggestionClick?: (prompt: string) => void;
}

export function ChatInputArea({
  value,
  onChange,
  onSubmit,
  onStop,
  isLoading,
  isConnected,
  suggestions,
  onSuggestionClick,
}: ChatInputAreaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 128)}px`;
  }, [value]);

  return (
    <div className="pointer-events-none relative shrink-0">
      <div className="absolute inset-x-0 -top-8 h-8 bg-gradient-to-t from-background to-transparent" />
      <div className="pointer-events-auto bg-background px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (value.trim() && isConnected && !isLoading) {
              onSubmit();
            }
          }}
          className="mx-auto max-w-2xl"
        >
          <AnimatePresence>
            {suggestions && suggestions.length > 0 && (
              <motion.div
                className="flex gap-2 overflow-x-auto pb-3"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.2 }}
              >
                {suggestions.map((s) => (
                  <button
                    key={s.label}
                    title={s.prompt}
                    className="shrink-0 rounded-full border border-input bg-background px-3 py-1.5 text-xs text-foreground transition-colors hover:bg-secondary"
                    onClick={() => onSuggestionClick?.(s.prompt)}
                  >
                    {s.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          <div
            className={cn(
              "flex flex-col rounded-2xl border border-input bg-background shadow-lg",
              "focus-within:ring-2 focus-within:ring-ring"
            )}
          >
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (value.trim() && isConnected && !isLoading) {
                    onSubmit();
                  }
                }
              }}
              placeholder={
                isConnected ? "Ask about tee times..." : "Connecting..."
              }
              disabled={!isConnected || isLoading}
              rows={1}
              className={cn(
                "max-h-32 min-h-[44px] flex-1 resize-none overflow-y-auto bg-transparent px-4 pt-3 pb-2",
                "text-sm placeholder:text-muted-foreground",
                "focus-visible:outline-none",
                "disabled:cursor-not-allowed disabled:opacity-50"
              )}
            />

            <div className="flex items-center justify-end px-2 pb-2">
              {isLoading ? (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="size-8"
                  onClick={onStop}
                  aria-label="Stop generating"
                >
                  <Square className="size-3.5" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  size="icon"
                  className="size-8"
                  disabled={!value.trim() || !isConnected}
                  aria-label="Send message"
                >
                  <Send className="size-3.5" />
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
