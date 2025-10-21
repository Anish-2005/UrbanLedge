"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  signInWithGoogle,
  onAuthChange,
  auth,
} from "@/lib/firebaseClient";
import { LogOut, LogIn } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export default function SignInButton() {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { theme } = useTheme();

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

  return (
    <div className="relative">
      {/* --- LOGGED IN --- */}
      {user ? (
        <div>
          <motion.button
            onClick={() => setDropdownOpen((p) => !p)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-xl border
              transition-all duration-300 shadow-sm
              ${
                theme === "light"
                  ? "bg-white border-gray-200 hover:bg-gray-50 text-gray-800"
                  : "bg-gray-800/80 border-gray-700 hover:bg-gray-700 text-gray-100"
              }
            `}
          >
            <Image
              src={user.photoURL || "/user-avatar.png"}
              alt="User"
              width={28}
              height={28}
              className="rounded-full"
            />
            <span className="text-sm font-medium truncate max-w-[100px]">
              {user.displayName?.split(" ")[0]}
            </span>
          </motion.button>

          {/* Dropdown */}
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className={`
                  absolute right-0 mt-2 w-44 rounded-xl border shadow-lg overflow-hidden
                  ${
                    theme === "light"
                      ? "bg-white border-gray-200"
                      : "bg-gray-800 border-gray-700"
                  }
                `}
              >
                <div
                  className={`px-4 py-2 text-xs border-b
                    ${
                      theme === "light"
                        ? "text-gray-500 border-gray-100"
                        : "text-gray-400 border-gray-700"
                    }`}
                >
                  Signed in as
                  <div
                    className={`truncate text-sm font-medium ${
                      theme === "light" ? "text-gray-800" : "text-gray-200"
                    }`}
                  >
                    {user.email}
                  </div>
                </div>

                <button
                  onClick={handleSignOut}
                  className={`flex items-center gap-2 w-full px-4 py-2 text-sm transition-colors
                    ${
                      theme === "light"
                        ? "text-gray-700 hover:bg-gray-50"
                        : "text-gray-200 hover:bg-gray-700/70"
                    }`}
                >
                  <LogOut size={15} />
                  Sign out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        /* --- LOGGED OUT --- */
        <div className="flex flex-col items-start">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSignIn}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium
              transition-all duration-300 shadow-sm
              ${
                theme === "light"
                  ? "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  : "bg-gray-800/80 border-gray-700 text-gray-100 hover:bg-gray-700"
              }
            `}
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
            <div
              className={`text-xs mt-1 max-w-xs ${
                theme === "light" ? "text-red-600" : "text-red-400"
              }`}
            >
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
