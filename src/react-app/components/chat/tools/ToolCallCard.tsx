import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/react-app/lib/utils";

type ToolStatus = "pending" | "running" | "success" | "error";

interface ToolCallCardProps {
  toolName: string;
  status: ToolStatus;
  progress?: {
    message: string;
    percent?: number;
  };
  result?: unknown;
  error?: string;
  defaultExpanded?: boolean;
}

function formatToolName(name: string): string {
  return name
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

export function ToolCallCard({
  toolName,
  status,
  progress,
  result,
  error,
  defaultExpanded,
}: ToolCallCardProps) {
  const [isExpanded, setIsExpanded] = useState(
    defaultExpanded ?? status === "error"
  );

  const hasContent = result !== undefined || error;

  return (
    <motion.div
      className={cn(
        "overflow-hidden rounded-lg border transition-colors",
        status === "running" &&
          "border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30",
        status === "success" &&
          "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30",
        status === "error" &&
          "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30",
        status === "pending" && "border-border bg-muted"
      )}
      layout
    >
      <button
        className="flex w-full items-center gap-3 p-3 text-left"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        disabled={!hasContent}
      >
        <div className="shrink-0">
          {status === "running" ? (
            <Loader2 className="size-4 animate-spin text-blue-600 dark:text-blue-400" />
          ) : status === "success" ? (
            <CheckCircle2 className="size-4 text-green-600 dark:text-green-400" />
          ) : status === "error" ? (
            <AlertCircle className="size-4 text-red-600 dark:text-red-400" />
          ) : (
            <Clock className="size-4 text-muted-foreground" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{formatToolName(toolName)}</span>
            {status === "running" && progress?.percent !== undefined && (
              <span className="text-xs text-muted-foreground">
                {progress.percent}%
              </span>
            )}
          </div>
          {progress?.message && (
            <p
              className={cn(
                "text-xs text-muted-foreground",
                !isExpanded && "truncate"
              )}
            >
              {progress.message}
            </p>
          )}
        </div>

        {hasContent && (
          <ChevronDown
            className={cn(
              "size-4 text-muted-foreground transition-transform",
              isExpanded && "rotate-180"
            )}
          />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && hasContent && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-border/50"
          >
            <div className="max-h-64 overflow-auto p-3">
              {error ? (
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              ) : (
                <pre className="text-xs text-muted-foreground">
                  {typeof result === "string"
                    ? result
                    : JSON.stringify(result, null, 2)}
                </pre>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
