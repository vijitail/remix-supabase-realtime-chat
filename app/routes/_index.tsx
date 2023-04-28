import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useOutletContext } from "@remix-run/react";
import { Chat } from "~/components/Chat";
import { Login } from "~/components/Login";
import type { Message, OutletContext } from "~/types";
import { createSupabaseServerClient } from "~/utils/supabase.server";

export const meta: V2_MetaFunction = () => {
  return [{ title: "Remix Supabase Realtime Chat" }];
};

export const action = async ({ request }: ActionArgs) => {
  const response = new Response();
  const supabase = createSupabaseServerClient({ request, response });

  const { message } = Object.fromEntries(await request.formData());

  await supabase.from("messages").insert({ content: String(message) });

  return json(null, { headers: response.headers });
};

export const loader = async ({ request }: LoaderArgs) => {
  const response = new Response();
  const supabase = createSupabaseServerClient({ request, response });

  const { data } = await supabase.from("messages").select("*");

  return json({ messages: data ?? [] }, { headers: response.headers });
};

export default function Index() {
  const { messages } = useLoaderData<typeof loader>();
  const { session } = useOutletContext<OutletContext>();

  return (
    <div className="container mx-auto md:w-[800px] h-screen">
      {!session?.user ? <Login /> : <Chat messages={messages as Message[]} />}
    </div>
  );
}
