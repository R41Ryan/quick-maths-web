import { createContext, useContext, useEffect, useState } from "react";
import supabase from "./supabaseClient";

const DatabaseContext = createContext();

export const DatabaseProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  async function signUp(displayName, email, password) {
    if (!displayName || !email || !password) {
      const missingFieldsError = new Error("Missing required fields");
      missingFieldsError.status = 400; // Bad Request
      throw missingFieldsError;
    }

    // Check if the display name is available
    const isAvailable = await checkDisplayName(displayName);
    if (!isAvailable) {
      const nameTakenError = new Error("Display name already exists");
      nameTakenError.status = 409; // Conflict
      throw nameTakenError;
    }

    const { data: userData, error: userError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (userError) {
      console.error("Error signing up:", userError.message);
      throw userError;
    }

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .insert([{ display_name: displayName, user_id: userData.user.id }])
      .single();

    if (profileError) {
      console.error("Error creating profile:", profileError.message);
      throw profileError;
    }

    setUser(userData.user);
    return userData.user;
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Error signing in:", error.message);
      throw error;
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

  async function checkDisplayName(displayName) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("display_name", displayName);

    if (error) {
      console.error("Error checking display name:", error.message);
      return false;
    } else {
      console.log(data);
      if (data.length > 0) {
        return false; // Display name already exists
      } else {
        return true;
      }
    }
  }

  async function getProfile() {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.error("Error fetching profile:", error.message);
      return null;
    } else {
      return data;
    }
  }

  async function getAllProfiles() {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")

    if (error) {
      console.error("Error fetching profile:", error.message);
      return null;
    } else {
      return data;
    }
  }

  async function getSpecificProfile(userId) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single()

    if (error) {
      console.error("Error fetching profile:", error.message);
      return null;
    } else {
      return data;
    }
  }

  async function insertScore(score, time) {
    const { data, error } = await supabase
      .from("scores")
      .insert([{ user_id: user.id, score, time_seconds: time }])
      .single();

    if (error) {
      console.error("Error inserting score:", error.message);
      throw error;
    }
  }

  async function getUserScores() {
    const { data, error } = await supabase
      .from("scores")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching scores:", error.message);
      return null;
    } else {
      return data;
    }
  }

  async function getAllScores() {
    const { data, error } = await supabase
      .from("scores_with_display_name")
      .select("*")
      .order("score", { ascending: false })

    if (error) {
      console.error("Error fetching all scores:", error.message);
      return null;
    } else {
      return data;
    }
  }

  async function deleteScore(scoreId) {
    const { error } = await supabase
      .from("scores")
      .delete()
      .eq("id", scoreId);

    if (error) {
      console.error("Error deleting score:", error.message);
      throw error;
    }
  }

  async function deleteAllUserScores() {
    const { error } = await supabase
      .from("scores")
      .delete()
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting all scores:", error.message);
      throw error;
    }
  }

  async function getUserHighScore() {
    const { data, error } = await supabase
      .from("scores")
      .select("*")
      .eq("user_id", user.id)
      .order("score", {ascending: false})
      .limit(1)
      .single()

    if (error) {
      console.error("Error getting user's high score");
      throw error;
    } else {
      return data;
    }
  }

  async function getAllHighScores() {
    const { data, error } = await supabase
      .from("top_scores_per_user")
      .select("*")

    if (error) {
      console.error("Errors getting all highscores", error.message);
      throw error;
    } else {
      return data;
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
    <DatabaseContext.Provider
      value={{ supabase, user, signUp, signIn, signOut, getProfile, getAllProfiles, getSpecificProfile, insertScore, getUserScores, getAllScores, checkDisplayName, deleteScore, deleteAllUserScores, getUserHighScore, getAllHighScores }}
    >
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
