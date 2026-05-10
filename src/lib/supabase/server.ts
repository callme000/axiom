import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch (error) {
            // This is expected if calling from a Server Component that is already streaming.
            // We log it only for debugging in dev mode.
            if (process.env.NODE_ENV === "development") {
              console.warn(
                "Supabase SSR: Unable to set cookies from Server Component. Ensure middleware is configured.",
                error,
              );
            }
          }
        },
      },
    },
  );
}
