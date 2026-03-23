'use client'

import React from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import { useUI } from '@/contexts/UIContext'

type Props = {
  children: React.ReactNode
}

export default function AppShell({ children }: Props) {
  const { sidebarCollapsed } = useUI()

  return (
    <div className="min-h-screen app-shell-bg">
      <div className="border-b border-slate-200/80 dark:border-slate-700/70">
        <Header />
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 py-8 lg:flex-row">
          <aside className={`hidden shrink-0 transition-[width] duration-300 lg:block ${sidebarCollapsed ? 'lg:w-24' : 'lg:w-72'}`}>
            <Sidebar />
          </aside>
          <main className="min-w-0 flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
