"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { LogOut, ChevronDown } from "lucide-react";
import { signInWithGoogle, onAuthChange, auth } from "@/lib/firebaseClient";
import { useTheme } from "@/contexts/ThemeContext";
import { User } from "firebase/auth";

export default function SignInButton() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const unsub = onAuthChange((u) => {
      setUser(u);
      if (typeof window !== "undefined") {
        if (u) {
          u.getIdToken().then((token: string) => {
            (window as Window & { __UL_FIREBASE_TOKEN?: string }).__UL_FIREBASE_TOKEN = token;
          });
        } else {
          (window as Window & { __UL_FIREBASE_TOKEN?: string }).__UL_FIREBASE_TOKEN = undefined;
        }
      }
    });
    return unsub;
  }, []);

  async function handleSignIn() {
    try {
      await signInWithGoogle();
      setError(null);
    } catch (e) {
      console.error(e);
      setError("Sign-in failed. Enable Google Sign-In in Firebase console.");
    }
  }

  function handleSignOut() {
    if (auth) auth.signOut();
    setDropdownOpen(false);
  }

  if (!user) {
    return (
      <div className="flex flex-col items-start">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSignIn}
          className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition ${
            theme === "light"
              ? "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              : "border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800"
          }`}
        >
          <Image
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            width={16}
            height={16}
          />
          <span>Sign in</span>
        </motion.button>

        {error && (
          <div className={`mt-1 text-xs ${theme === "light" ? "text-red-600" : "text-red-400"}`}>
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <motion.button
        onClick={() => setDropdownOpen((open) => !open)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className={`inline-flex items-center gap-2 rounded-xl border px-2.5 py-1.5 transition ${
          theme === "light"
            ? "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            : "border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
        }`}
      >
        <Image
          src={user.photoURL || "/user-avatar.png"}
          alt="User"
          width={28}
          height={28}
          className="rounded-full"
        />
        <span className="max-w-[90px] truncate text-sm font-medium">
          {user.displayName?.split(" ")[0] || "User"}
        </span>
        <ChevronDown size={14} className={`transition ${dropdownOpen ? "rotate-180" : ""}`} />
      </motion.button>

      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className={`absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border shadow-lg ${
              theme === "light" ? "border-slate-200 bg-white" : "border-slate-700 bg-slate-900"
            }`}
          >
            <div
              className={`border-b px-4 py-2 text-xs ${
                theme === "light"
                  ? "border-slate-100 text-slate-500"
                  : "border-slate-700 text-slate-400"
              }`}
            >
              Signed in as
              <div className={`truncate text-sm font-medium ${theme === "light" ? "text-slate-700" : "text-slate-200"}`}>
                {user.email}
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className={`flex w-full items-center gap-2 px-4 py-2.5 text-sm transition ${
                theme === "light"
                  ? "text-slate-700 hover:bg-slate-50"
                  : "text-slate-200 hover:bg-slate-800"
              }`}
            >
              <LogOut size={15} />
              Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
