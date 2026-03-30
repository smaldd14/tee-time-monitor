import { MessageBubble } from "./MessageBubble";

interface UserMessageProps {
  content: string;
}

export function UserMessage({ content }: UserMessageProps) {
  return <MessageBubble role="user">{content}</MessageBubble>;
}
