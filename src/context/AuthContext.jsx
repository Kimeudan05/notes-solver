import { createContext, useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // Fetch initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) return;
      setUser(session?.user ?? null);
      setLoading(false);

      // 🟢 Cleanup hash from OAuth redirect
      if (window.location.hash.includes("access_token")) {
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      }
    });

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!isMounted) return;
        setUser(session?.user ?? null);
        setLoading(false);

        // 🟢 Cleanup hash again if it appears after auth event
        if (window.location.hash.includes("access_token")) {
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
        }
      }
    );

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
