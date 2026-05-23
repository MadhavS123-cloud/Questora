"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  Layers,
  FolderDown,
  Settings,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  Sparkles,
  GraduationCap,
} from 'lucide-react';
import { clsx } from 'clsx';

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { name: 'Dashboard',        href: '/',                   icon: LayoutDashboard },
    { name: 'New Assignment',   href: '/assignments/create', icon: BookOpen },
    { name: 'Question Bank',    href: '#',                   icon: Layers,     disabled: true },
    { name: 'Uploaded Sources', href: '#',                   icon: FolderDown, disabled: true },
    { name: 'Settings',         href: '#',                   icon: Settings,   disabled: true },
  ];

  return (
    <aside
      className={clsx(
        'h-screen border-r border-neutral-300 bg-neutral-100 flex flex-col justify-between transition-all duration-300 relative z-30 shrink-0',
        isCollapsed ? 'w-[60px]' : 'w-64'
      )}
    >
      {/* Subtle top-edge gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-500 via-brand-400 to-transparent opacity-60" />

      <div className="flex flex-col h-full">
        {/* ── Brand Header ──────────────────────────────────── */}
        <div className="h-16 border-b border-neutral-300 px-3 flex items-center justify-between shrink-0 relative">
          {!isCollapsed && (
            <Link href="/" className="flex items-center gap-2.5 group overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white font-extrabold text-sm shadow-[0_0_16px_rgba(249,115,22,0.4)] group-hover:shadow-[0_0_24px_rgba(249,115,22,0.5)] group-hover:scale-105 transition-all duration-300 shrink-0">
                Q
              </div>
              <div className="overflow-hidden">
                <span className="font-ui font-black text-[15px] text-neutral-900 tracking-widest block leading-none">
                  QUESTORA
                </span>
                <span className="text-[9px] text-brand-500 font-bold uppercase tracking-widest">
                  AI Assessment Engine
                </span>
              </div>
            </Link>
          )}
          {isCollapsed && (
            <Link href="/" className="mx-auto">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white font-extrabold text-sm shadow-[0_0_16px_rgba(249,115,22,0.4)]">
                Q
              </div>
            </Link>
          )}

          {/* Collapse toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border border-neutral-300 bg-neutral-200 hover:bg-neutral-300 shadow-[0_0_10px_rgba(0,0,0,0.5)] flex items-center justify-center text-neutral-700 hover:text-neutral-900 transition-all z-40"
          >
            {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
          </button>
        </div>

        {/* ── New Assignment CTA ─────────────────────────────── */}
        <div className="p-3 shrink-0">
          <Link
            href="/assignments/create"
            className={clsx(
              'flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 text-white font-ui font-bold text-sm',
              'shadow-[0_4px_20px_rgba(249,115,22,0.3)] hover:shadow-[0_6px_28px_rgba(249,115,22,0.45)]',
              'hover:from-brand-400 hover:to-brand-500 hover:-translate-y-[1px] transition-all duration-200',
              isCollapsed ? 'p-2 justify-center' : 'px-4 py-3 w-full'
            )}
          >
            <PlusCircle size={16} className="shrink-0 text-orange-100" />
            {!isCollapsed && <span>New Assignment</span>}
          </Link>
        </div>

        {/* ── Navigation ────────────────────────────────────── */}
        <nav className="px-2 space-y-0.5 mt-1 flex-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.disabled ? '#' : item.href}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl font-ui text-sm transition-all duration-150 relative group',
                  isActive
                    ? 'bg-brand-500/10 text-brand-500 font-bold border border-brand-500/20'
                    : 'text-neutral-700 hover:bg-neutral-200 hover:text-neutral-800',
                  isCollapsed && 'justify-center px-0',
                  item.disabled && 'opacity-30 cursor-not-allowed hover:bg-transparent hover:text-neutral-700'
                )}
                title={item.name}
              >
                {/* Active left border */}
                {isActive && !isCollapsed && (
                  <span className="absolute left-0 top-2.5 bottom-2.5 w-[3px] bg-gradient-to-b from-brand-500 to-brand-600 rounded-r-full" />
                )}
                <Icon
                  size={17}
                  className={clsx(
                    'shrink-0 transition-colors',
                    isActive ? 'text-brand-500' : 'text-neutral-700 group-hover:text-neutral-800'
                  )}
                />
                {!isCollapsed && <span className="truncate">{item.name}</span>}
                {!isCollapsed && item.disabled && (
                  <span className="ml-auto text-[8px] font-black text-neutral-700 uppercase tracking-widest bg-neutral-200 px-1.5 py-0.5 rounded-md border border-neutral-300">
                    Soon
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* ── Divider ───────────────────────────────────────── */}
        <div className="mx-3 h-px bg-neutral-300 shrink-0" />

        {/* ── Teacher Profile ───────────────────────────────── */}
        <div className="p-3 shrink-0">
          <div className={clsx(
            'flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-neutral-200 transition-all cursor-pointer group',
            isCollapsed && 'justify-center'
          )}>
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500/20 to-brand-600/10 flex items-center justify-center font-ui font-extrabold text-brand-500 text-xs border border-brand-500/30 select-none shrink-0 shadow-[inset_0_1px_2px_rgba(249,115,22,0.1)]">
              MJ
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden flex-1">
                <p className="font-ui text-xs font-bold text-neutral-900 truncate leading-tight">
                  Mr. Jonathan
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Sparkles size={8} className="text-brand-500 animate-pulse shrink-0" />
                  <span className="text-[9px] text-brand-500 font-extrabold uppercase tracking-wider truncate">
                    Pro School Account
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
