import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, isFirebaseConfigured } from "../lib/firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      const savedUser = localStorage.getItem("udhaari_demo_user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    if (!isFirebaseConfigured) {
      const demoUser = { uid: "demo-user-id", email: email || "demo@udhaari.local", displayName: "Demo User" };
      localStorage.setItem("udhaari_demo_user", JSON.stringify(demoUser));
      setUser(demoUser);
      return demoUser;
    }
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (email, password) => {
    if (!isFirebaseConfigured) {
      const demoUser = { uid: "demo-user-id", email: email || "demo@udhaari.local", displayName: "Demo User" };
      localStorage.setItem("udhaari_demo_user", JSON.stringify(demoUser));
      setUser(demoUser);
      return demoUser;
    }
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = async () => {
    if (!isFirebaseConfigured) {
      const demoUser = { uid: "demo-user-id", email: "demo.google@udhaari.local", displayName: "Demo Google User" };
      localStorage.setItem("udhaari_demo_user", JSON.stringify(demoUser));
      setUser(demoUser);
      return demoUser;
    }
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const logout = async () => {
    if (!isFirebaseConfigured) {
      localStorage.removeItem("udhaari_demo_user");
      setUser(null);
      return;
    }
    return signOut(auth);
  };

  const value = {
    user,
    login,
    signup,
    loginWithGoogle,
    logout,
    isDemoMode: !isFirebaseConfigured
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
