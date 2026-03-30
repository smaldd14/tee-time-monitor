import { motion } from "motion/react";
import { MapPin, Sun, Calendar, Users } from "lucide-react";

const suggestions = [
  {
    icon: MapPin,
    title: "Find nearby courses",
    prompt: "Find tee times near 30301 this Saturday",
  },
  {
    icon: Sun,
    title: "Morning rounds",
    prompt: "Search for early morning tee times before 9am near 10001 this weekend",
  },
  {
    icon: Calendar,
    title: "Weekend deals",
    prompt: "Find hot deals on tee times near 90210 for next Saturday",
  },
  {
    icon: Users,
    title: "Group outing",
    prompt: "Find tee times for 4 players near 60601 next Friday afternoon",
  },
];

interface ChatEmptyStateProps {
  onSend: (text: string) => void;
}

export function ChatEmptyState({ onSend }: ChatEmptyStateProps) {
  return (
    <motion.div
      className="flex h-full flex-col items-center justify-center px-4"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <h2 className="mb-1 text-2xl font-semibold sm:text-3xl">
        What can I help you with?
      </h2>
      <p className="mb-8 text-sm text-muted-foreground">
        Find tee times and set up monitoring
      </p>

      <div className="grid w-full max-w-xl grid-cols-1 gap-3 sm:grid-cols-2">
        {suggestions.map((suggestion) => {
          const Icon = suggestion.icon;
          return (
            <button
              key={suggestion.title}
              className="flex items-start gap-3 rounded-xl border border-input p-4 text-left transition-all hover:border-primary/40 hover:shadow-sm"
              onClick={() => onSend(suggestion.prompt)}
            >
              <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{suggestion.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                  {suggestion.prompt}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
