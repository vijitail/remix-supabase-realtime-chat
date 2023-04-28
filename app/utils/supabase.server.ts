import { createServerClient } from "@supabase/auth-helpers-remix";


export const createSupabaseServerClient = ({request, response}: {request: Request, response: Response}) => createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLIC_KEY!, {request, response})