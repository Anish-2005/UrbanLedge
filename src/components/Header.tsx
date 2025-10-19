"use client";
import { motion } from "framer-motion";
import { Search, User, Home } from "lucide-react";
import SignInButton from './SignInButton'

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          
          {/* Left: Brand */}
          <div className="flex items-center gap-2">
            <Home size={22} className="text-indigo-600" />
            <span className="text-xl font-semibold text-gray-800 tracking-tight">
              UrbanLedge
            </span>
            <span className="hidden md:block text-sm text-gray-500 ml-2">
              | Property Tax Management
            </span>
          </div>

          {/* Center: Search */}
          <div className="hidden md:flex items-center relative w-72">
            <Search
              size={18}
              className="absolute left-3 top-2.5 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search properties, receipts..."
              className="w-full border border-gray-300 rounded-lg py-2 pl-9 pr-3 text-sm text-gray-700 placeholder-gray-400
                focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
            />
          </div>

          {/* Right: Action Button */}
          <div className="flex items-center gap-3">
            <SignInButton />
          </div>

        </div>
      </div>
    </motion.header>
  );
}
