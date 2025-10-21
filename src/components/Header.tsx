"use client";
import { motion } from "framer-motion";
import { Search, User, Bell, Building2 } from "lucide-react";
import SignInButton from './SignInButton';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '@/contexts/ThemeContext';

export default function Header() {
  const { theme } = useTheme();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`
        sticky top-0 z-50 backdrop-blur-xl border-b transition-all duration-300
        ${theme === 'light' ? 'bg-white/70 border-gray-200/80 shadow-sm' : 'bg-gray-900/80 border-gray-700/80'}
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Left: Enhanced Brand */}
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <div className={`
              relative p-2 rounded-2xl bg-gradient-to-br shadow-lg
              ${theme === 'light' ? 'from-indigo-600 to-emerald-500 hover:from-indigo-700 hover:to-emerald-600' : 'from-blue-600 to-purple-700 dark:hover:from-blue-700 dark:hover:to-purple-800'}
              group transition-all duration-300
            `}>
              <Building2 size={20} className="text-white" />
              
              {/* Shine effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            
            <div className="flex flex-col">
              <span className={`
                text-xl font-bold bg-gradient-to-r bg-clip-text text-transparent
                ${theme === 'light' ? 'from-slate-900 to-indigo-700' : 'from-white to-gray-200'}
                tracking-tight
              `}>
                UrbanLedge
              </span>
              <span className={`
                text-xs font-medium
                text-gray-500 dark:text-gray-400
                hidden md:block
              `}>
                Property Tax Management
              </span>
            </div>
          </motion.div>

          {/* Center: Enhanced Search */}
          <motion.div 
            className="hidden md:flex items-center relative flex-1 max-w-2xl mx-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-full relative">
              <Search
                size={18}
                className={`
                  absolute left-4 top-1/2 transform -translate-y-1/2
                  ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}
                  transition-colors duration-200
                `}
              />
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="text"
                placeholder="Search properties, assessments, payments..."
                className={`
                  w-full border-0 rounded-2xl py-3 pl-12 pr-4 text-sm
                  ${theme === 'light' ? 'bg-white shadow-sm ring-1 ring-inset ring-gray-100 text-slate-900 placeholder-slate-400' : 'bg-gray-800/80 text-white placeholder-gray-400'}
                  backdrop-blur-sm
                  focus:ring-2 focus:ring-indigo-400/40
                  focus:bg-white dark:focus:bg-gray-800
                  outline-none transition-all duration-300
                  hover:bg-gray-50 dark:hover:bg-gray-700/80
                `}
              />
              
              {/* Keyboard shortcut hint */}
              <div className={`
                absolute right-3 top-1/2 transform -translate-y-1/2
                px-2 py-1 rounded-lg text-xs font-medium
                ${theme === 'light' ? 'bg-gray-100 text-gray-600 border border-gray-200' : 'bg-gray-700/50 text-gray-400 border border-gray-600/50'}
                hidden lg:block
              `}>
                ⌘K
              </div>
            </div>
          </motion.div>

          {/* Right: Enhanced Action Area */}
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Notifications */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                relative p-2.5 rounded-2xl transition-all duration-300
                ${theme === 'light' ? 'bg-white/60 hover:bg-gray-100 border border-gray-100' : 'bg-gray-800/80'}
                ${theme === 'light' ? 'text-gray-700' : 'text-gray-400'}
                hover:border-gray-300/50
              `}
              aria-label="Notifications"
            >
              <Bell size={20} />
              
              {/* Notification indicator */}
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`
                  absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs
                  bg-red-500 text-white flex items-center justify-center
                  ${theme === 'light' ? 'border-2 border-white' : 'border-2 border-gray-900'}
                  font-semibold
                `}
              >
                3
              </motion.span>
            </motion.button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Profile / Sign In */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`
                flex items-center gap-2 p-1.5 rounded-2xl
                ${theme === 'light' ? 'bg-white/60 hover:bg-gray-100 border border-gray-100' : 'bg-gray-800/80'}
                transition-all duration-300
              `}
            >
              <div className={`
                w-8 h-8 rounded-xl bg-gradient-to-br
                from-indigo-600 to-emerald-500 flex items-center justify-center
                shadow-md
              `}>
                <User size={16} className="text-white" />
              </div>
              
              <div className="hidden sm:block mr-2">
                <p className={`text-sm font-medium leading-none ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                  Welcome
                </p>
                <p className={`text-xs leading-none ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                  Sign in to continue
                </p>
              </div>
              
              <SignInButton />
            </motion.div>
          </motion.div>
        </div>

        {/* Mobile Search */}
        <motion.div 
          className="md:hidden pb-4"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative">
            <Search
              size={18}
              className={`
                absolute left-4 top-1/2 transform -translate-y-1/2
                text-gray-400 dark:text-gray-500
              `}
            />
            <input
              type="text"
              placeholder="Search properties, receipts..."
              className={`
                w-full border-0 rounded-2xl py-3 pl-12 pr-4 text-sm
                bg-gray-100/80 dark:bg-gray-800/80
                text-gray-900 dark:text-white 
                placeholder-gray-500 dark:placeholder-gray-400
                focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50
                focus:bg-white dark:focus:bg-gray-800
                outline-none transition-all duration-300
              `}
            />
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
}