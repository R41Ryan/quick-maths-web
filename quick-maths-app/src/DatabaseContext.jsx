import { createContext, useContext, useEffect, useState } from "react";
import supabase from "./supabaseClient";

const DatabaseContext = createContext();

export const DatabaseProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  async function signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      console.error("Error signing up:", error.message);
      return null;
    } else {
      setUser(data.user);
      return data.user;
    }
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error("Error signing in:", error.message);
      return null;
    } else {
      setUser(data.user);
      return data.user;
    }
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      setUser(null);
    }
  }

  useEffect(() => {
    const session = supabase.auth.getSession();
    if (session) {
      setUser(session.user);
    }

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  return (
    <DatabaseContext.Provider value={{supabase, signUp, signIn, signOut, user}}>
      {children}
    </DatabaseContext.Provider>
  );
};

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error("useDatabase must be used within a DatabaseProvider");
  }
  return context;
}
