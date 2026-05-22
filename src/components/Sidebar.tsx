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
  Sparkles
} from 'lucide-react';
import { clsx } from 'clsx';

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Assignments', href: '/assignments/create', icon: BookOpen },
    { name: 'Question Bank', href: '#', icon: Layers, disabled: true },
    { name: 'Uploaded Sources', href: '#', icon: FolderDown, disabled: true },
  ];

  return (
    <aside 
      className={clsx(
        "h-screen border-r border-slate-800 bg-[#070b13] flex flex-col justify-between transition-all duration-300 relative z-30",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Brand & Collapse Header */}
      <div>
        <div className="h-16 border-b border-slate-900 px-4 flex items-center justify-between">
          {!isCollapsed && (
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-500 via-brand-600 to-semantic-ai flex items-center justify-center text-white font-extrabold shadow-[0_0_15px_rgba(99,102,241,0.4)] group-hover:scale-105 transition-transform duration-300">
                Q
              </div>
              <span className="font-ui font-black text-base text-slate-100 tracking-wider">
                QUESTORA <span className="text-[10px] text-brand-500 font-bold ml-1 bg-brand-500/10 px-1 py-0.5 rounded">AI</span>
              </span>
            </Link>
          )}
          {isCollapsed && (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-500 via-brand-600 to-semantic-ai flex items-center justify-center text-white font-extrabold mx-auto shadow-[0_0_15px_rgba(99,102,241,0.4)]">
              Q
            </div>
          )}
          
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute top-4 -right-3 w-6 h-6 rounded-full border border-slate-800 bg-[#070b13] hover:bg-slate-900 shadow-[0_0_10px_rgba(0,0,0,0.3)] flex items-center justify-center text-slate-400 hover:text-slate-100 transition-colors z-40"
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Core CTA */}
        <div className="p-3">
          <Link
            href="/assignments/create"
            className={clsx(
              "flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-semantic-ai hover:from-brand-500 hover:to-violet-500 text-white font-ui font-bold transition-all shadow-[0_4px_20px_rgba(99,102,241,0.25)] hover:shadow-[0_4px_25px_rgba(99,102,241,0.35)] hover:-translate-y-[1px]",
              isCollapsed ? "p-2 justify-center" : "px-4 py-3 w-full text-sm"
            )}
          >
            <PlusCircle size={18} className="shrink-0 text-indigo-200" />
            {!isCollapsed && <span>New Assignment</span>}
          </Link>
        </div>

        {/* Navigation Routes */}
        <nav className="px-2 space-y-1.5 mt-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.disabled ? '#' : item.href}
                className={clsx(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-ui text-sm transition-all duration-200 relative group",
                  isActive 
                    ? "bg-slate-900 text-white font-bold border border-slate-800 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]" 
                    : "text-slate-400 hover:bg-slate-900/40 hover:text-slate-100",
                  isCollapsed && "justify-center",
                  item.disabled && "opacity-30 cursor-not-allowed hover:bg-transparent hover:text-slate-400"
                )}
                title={item.name}
              >
                {/* Active left border indicator */}
                {isActive && !isCollapsed && (
                  <span className="absolute left-0 top-3 bottom-3 w-1 bg-gradient-to-b from-brand-400 to-semantic-ai rounded-r" />
                )}
                
                <Icon size={18} className={clsx("shrink-0 transition-colors duration-200", isActive ? "text-brand-400" : "text-slate-400 group-hover:text-slate-200")} />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Teacher Profile Info Zone */}
      <div className="p-4 border-t border-slate-900 bg-slate-950/40">
        <div className={clsx("flex items-center gap-3", isCollapsed && "justify-center")}>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-600/20 to-semantic-ai/20 flex items-center justify-center font-ui font-extrabold text-brand-400 text-sm border border-brand-500/30 select-none shadow-[inset_0_1px_2px_rgba(99,102,241,0.1)]">
            MJ
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <p className="font-ui text-xs font-bold text-slate-200 truncate">
                Mr. Jonathan
              </p>
              <div className="flex items-center gap-1 text-[9px] text-brand-400 font-extrabold uppercase tracking-wider mt-0.5">
                <Sparkles size={8} className="animate-pulse" /> Pro School Account
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
