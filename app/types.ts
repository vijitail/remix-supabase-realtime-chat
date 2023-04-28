import type { Session, SupabaseClient } from "@supabase/supabase-js";


export type OutletContext = {
    supabase: SupabaseClient;
    session: Session
}

export interface Message {
    id: number;
    content: string;
    user_id: string;
    created_at: string;
    user_meta_data: {
        name: string;
        profile_image: string;
    }
}