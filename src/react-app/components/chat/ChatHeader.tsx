import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Button } from "@/react-app/components/ui/button";
import { ArrowLeft, Trash2, Square } from "lucide-react";
import { cn } from "@/react-app/lib/utils";

interface ChatHeaderProps {
  isConnected: boolean;
  isStreaming: boolean;
  onStop: () => void;
  onClear: () => void;
  messageCount: number;
}

export function ChatHeader({
  isConnected,
  isStreaming,
  onStop,
  onClear,
  messageCount,
}: ChatHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="shrink-0 px-4">
      <div className="mx-auto flex h-14 max-w-2xl items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => navigate("/")}
            aria-label="Back to Home"
          >
            <ArrowLeft className="size-4" />
          </Button>
          <span className="font-medium">Tee Time Assistant</span>
          <motion.div
            className={cn(
              "size-2 rounded-full",
              isConnected ? "bg-green-500" : "bg-muted-foreground"
            )}
            animate={!isConnected ? { opacity: [1, 0.4, 1] } : {}}
            transition={{ repeat: Infinity, duration: 1.5 }}
            aria-label={isConnected ? "Connected" : "Connecting"}
          />
        </div>

        <div className="flex items-center gap-1">
          {isStreaming && (
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={onStop}
              aria-label="Stop generating"
            >
              <Square className="size-3.5" />
            </Button>
          )}
          {messageCount > 0 && (
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={onClear}
              aria-label="Clear chat history"
            >
              <Trash2 className="size-3.5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
