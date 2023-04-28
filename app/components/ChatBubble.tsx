import { useOutletContext } from "@remix-run/react";
import type { Message, OutletContext } from "~/types";

interface ChatBubbleProps {
  message: Message;
}

export const ChatBubble = ({ message }: ChatBubbleProps) => {
  const { session } = useOutletContext<OutletContext>();

  const isCurrentUser = session.user.id === message.user_id;

  return (
    <div className={`chat ${!isCurrentUser ? "chat-start" : "chat-end"}`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img
            alt={message.user_meta_data.name}
            src={message.user_meta_data.profile_image}
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
      <div className="chat-header mb-1">
        {message.user_meta_data.name}
        <time className="text-xs opacity-50 ml-1">
          {new Date(message.created_at).toTimeString().slice(0, 5)}
        </time>
      </div>
      <div
        className={`chat-bubble ${
          isCurrentUser ? "chat-bubble-primary" : "bg-slate-500"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
};
