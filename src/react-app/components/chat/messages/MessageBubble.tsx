import { motion } from "motion/react";
import { cn } from "@/react-app/lib/utils";

interface MessageBubbleProps {
  role: "user" | "assistant";
  children: React.ReactNode;
  className?: string;
}

export function MessageBubble({ role, children, className }: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <motion.div
      className={cn("flex", isUser ? "justify-end" : "justify-start")}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
    >
      <div
        className={cn(
          "whitespace-pre-wrap text-sm",
          isUser
            ? "max-w-[80%] rounded-2xl bg-secondary px-4 py-2.5 text-foreground md:max-w-[75%]"
            : "w-full text-left",
          className
        )}
      >
        {children}
      </div>
    </motion.div>
  );
}
