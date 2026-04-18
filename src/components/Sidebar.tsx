'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/supabase';

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: '📊' },
  { label: 'Partners', href: '/dashboard/partners', icon: '🤝' },
  { label: 'Projects', href: '/dashboard/projects', icon: '📋' },
  { label: 'Activities', href: '/dashboard/activities', icon: '🎯' },
  { label: 'Tasks', href: '/dashboard/tasks', icon: '✓' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  return (
    <div className="w-60 bg-slate-50 border-r border-slate-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900">iLEAD PM</h1>
        <p className="text-xs text-slate-600 mt-1">Catalyste+ Vietnam</p>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-100 text-blue-700 font-medium'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="border-t border-slate-200 p-4 space-y-3">
        {user && (
          <>
            <div className="px-4 py-2 bg-blue-50 rounded-lg">
              <p className="text-xs text-slate-600">Logged in as</p>
              <p className="text-sm font-medium text-slate-900 truncate">{user.email}</p>
            </div>
            <button
              onClick={signOut}
              className="w-full px-4 py-2 text-sm text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Sign out
            </button>
          </>
        )}
      </div>
    </div>
  );
}
