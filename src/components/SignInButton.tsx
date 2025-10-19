"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  signInWithGoogle,
  onAuthChange,
  getIdToken,
  auth,
} from "@/lib/firebaseClient";
import { LogOut, LogIn } from "lucide-react";

export default function SignInButton() {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const unsub = onAuthChange((u) => {
      setUser(u);
      if (typeof window !== "undefined") {
        if (u) {
          u.getIdToken().then((t: string) => {
            (window as any).__UL_FIREBASE_TOKEN = t;
          });
        } else {
          (window as any).__UL_FIREBASE_TOKEN = null;
        }
      }
    });
    return unsub;
  }, []);

  async function handleSignIn() {
    try {
      await signInWithGoogle();
    } catch (e) {
      console.error(e);
      setError(
        "Sign-in failed. Ensure Google Sign-In is enabled in your Firebase console."
      );
    }
  }

  function handleSignOut() {
    if (auth) auth.signOut();
  }

  if (user) {
    return (
      <div className="relative">
        <motion.button
          onClick={() => setDropdownOpen((p) => !p)}
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors shadow-sm"
        >
          <Image
            src={user.photoURL || "/user-avatar.png"}
            alt="User"
            width={28}
            height={28}
            className="rounded-full"
          />
          <span className="text-sm font-medium text-gray-700">
            {user.displayName?.split(" ")[0]}
          </span>
        </motion.button>

        {dropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
          >
            <div className="px-4 py-2 text-xs text-gray-500 border-b">
              Signed in as
              <div className="truncate text-gray-800 text-sm font-medium">
                {user.email}
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <LogOut size={15} />
              Sign out
            </button>
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start">
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleSignIn}
        className="flex items-center gap-2 px-4 py-2 rounded-lg 
                   border border-gray-300 bg-white hover:bg-gray-50 
                   shadow-sm transition-all text-gray-700 font-medium text-sm"
      >
        <Image
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google"
          width={18}
          height={18}
        />
        <span>Sign in with Google</span>
      </motion.button>

      {error && (
        <div className="text-xs text-red-600 mt-1 max-w-xs">{error}</div>
      )}
    </div>
  );
}
