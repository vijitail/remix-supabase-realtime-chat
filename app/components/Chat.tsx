import { Form, useOutletContext } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import type { Message, OutletContext } from "~/types";
import { ChatBubble } from "./ChatBubble";

interface ChatProps {
  messages: Message[];
}

export const Chat = ({ messages: serverMessages }: ChatProps) => {
  const [messages, setMessages] = useState(serverMessages);

  const { supabase } = useOutletContext<OutletContext>();
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const channel = supabase
      .channel("*")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "messages" },
        (payload) => {
          const newMessage = payload.new as Message;
          if (!messages.find((message) => message.id === newMessage.id)) {
            setMessages([...messages, newMessage]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [messages, supabase]);

  const handleLogout = () => {
    supabase.auth.signOut();
  };

  return (
    <div className="flex h-full flex-col">
      <div className="my-2">
        <button className="btn btn-xs btn-error" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className="flex flex-col flex-grow h-0 p-4 overflow-auto bg-blue-50 rounded-md">
        {messages.map((message, idx) => (
          <ChatBubble
            message={message}
            key={message.id}
            isGrouped={
              message.user_id === messages[idx - 1]?.user_id &&
              new Date(message.created_at).getTime() -
                new Date(messages[idx - 1]?.created_at).getTime() <
                60000
            }
          />
        ))}
      </div>
      <div className="mt-auto mb-5 py-2">
        <Form
          method="post"
          ref={formRef}
          onSubmit={(e) => {
            e.preventDefault();
            formRef.current?.submit();
            formRef.current?.reset();
          }}
        >
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full"
            name="message"
            ref={inputRef}
          />
        </Form>
      </div>
    </div>
  );
};
