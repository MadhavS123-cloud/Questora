"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search, Sparkles, Clock, FileText, CheckCircle2,
  AlertCircle, AlertTriangle, ArrowRight, TrendingUp,
  LayoutGrid, List, Plus, Zap, BookOpen, BarChart3, RefreshCw,
} from 'lucide-react';
import { useAssignmentStore, Assignment } from '../store/useAssignmentStore';
import { clsx } from 'clsx';

export default function Dashboard() {
  const { assignments, fetchAssignments } = useAssignmentStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubjectFilter, setActiveSubjectFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  React.useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const subjects = ['All', 'Physics', 'Math', 'History', 'Science'];

  const filteredAssignments = assignments.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.grade.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject =
      activeSubjectFilter === 'All' ||
      item.subject.toLowerCase() === activeSubjectFilter.toLowerCase();
    return matchesSearch && matchesSubject;
  });

  const totalQuestions = assignments.reduce(
    (sum, item) => sum + item.sections.reduce((sSum, sec) => sSum + sec.questions.length, 0), 0
  );
  const completedCount = assignments.filter((a) => a.status === 'completed').length;

  const kpis = [
    {
      label: 'Active Papers',
      value: assignments.length,
      sub: `${completedCount} completed`,
      icon: FileText,
      gradient: 'from-brand-500/15 to-brand-600/5',
      iconColor: 'text-brand-500',
      borderAccent: 'hover:border-brand-500/30',
      trend: <TrendingUp size={11} className="text-emerald-400" />,
      trendText: '4 drafted this week',
      trendColor: 'text-emerald-400',
      glowColor: 'rgba(249,115,22,0.08)',
    },
    {
      label: 'AI Synthesized Questions',
      value: (totalQuestions + 1240).toLocaleString(),
      sub: 'Pedagogically calibrated',
      icon: Sparkles,
      gradient: 'from-violet-500/15 to-purple-600/5',
      iconColor: 'text-violet-400',
      borderAccent: 'hover:border-violet-500/30',
      trend: <Zap size={11} className="text-violet-400" />,
      trendText: "Bloom's taxonomy verified",
      trendColor: 'text-violet-400',
      glowColor: 'rgba(139,92,246,0.08)',
    },
    {
      label: 'Prep Time Saved',
      value: '42 hrs',
      sub: '≈ 8.4 hrs per draft',
      icon: Clock,
      gradient: 'from-brand-500/15 to-indigo-600/5',
      iconColor: 'text-brand-500',
      borderAccent: 'hover:border-brand-500/30',
      trend: <BarChart3 size={11} className="text-brand-500" />,
      trendText: 'Over all generated papers',
      trendColor: 'text-brand-500',
      glowColor: 'rgba(249,115,22,0.08)',
    },
  ];

  return (
    <div className="p-6 md:p-8 space-y-7 max-w-7xl mx-auto w-full font-ui animate-fade-slide-up">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-[10px] font-extrabold text-brand-500 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-ping-slow" />
              Live Workspace
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-neutral-900 leading-tight tracking-tight">
            Academic Assessment Dashboard
          </h1>
          <p className="text-sm text-neutral-700 mt-1">
            Build and compile standardized curriculum evaluations powered by AI.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative w-full md:w-80 shrink-0">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-700 pointer-events-none" />
          <input
            type="text"
            placeholder="Search papers, subjects, grades…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-neutral-300 rounded-xl text-sm bg-neutral-200 text-neutral-900 placeholder-neutral-700 focus:outline-none focus:ring-2 focus:ring-brand-500/25 focus:border-brand-500 shadow-sm"
          />
        </div>
      </div>

      {/* ── KPI Cards ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className={clsx(
                'relative bg-neutral-100 border border-neutral-300 rounded-2xl p-5 shadow-premium card-hover-border',
                'hover:shadow-[0_8px_32px_-4px_rgba(0,0,0,0.5)] hover:-translate-y-[2px] transition-all duration-300 overflow-hidden group',
                kpi.borderAccent
              )}
            >
              {/* Background gradient blob */}
              <div className={clsx('absolute -top-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br opacity-60 blur-2xl pointer-events-none', kpi.gradient)} />
              {/* Top accent line on hover */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-500 via-brand-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl" />

              <div className="flex items-start justify-between relative">
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold text-neutral-700 uppercase tracking-widest">
                    {kpi.label}
                  </p>
                  <p className="text-3xl font-black text-neutral-900 tabular-nums leading-none">
                    {kpi.value}
                  </p>
                  <div className={clsx('flex items-center gap-1 text-[11px] font-semibold mt-1', kpi.trendColor)}>
                    {kpi.trend}
                    <span>{kpi.trendText}</span>
                  </div>
                </div>
                <div className={clsx(
                  'w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0 border border-neutral-300/50',
                  kpi.gradient
                )}>
                  <Icon size={20} className={kpi.iconColor} />
                </div>
              </div>
              <p className="text-[11px] text-neutral-700 mt-3 font-medium">{kpi.sub}</p>
            </div>
          );
        })}
      </div>

      {/* ── Filter bar ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-0.5 max-w-[80%]">
          {subjects.map((subj) => (
            <button
              key={subj}
              onClick={() => setActiveSubjectFilter(subj)}
              className={clsx(
                'px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide select-none shrink-0 border transition-all duration-200',
                activeSubjectFilter === subj
                  ? 'bg-brand-500 text-white border-brand-500 shadow-[0_4px_14px_rgba(249,115,22,0.3)]'
                  : 'bg-neutral-100 border-neutral-300 text-neutral-700 hover:border-brand-500/50 hover:text-neutral-800'
              )}
            >
              {subj}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 shrink-0 bg-neutral-200 rounded-lg p-1 border border-neutral-300">
          <button
            onClick={() => setViewMode('grid')}
            className={clsx('p-1.5 rounded-md transition-all', viewMode === 'grid' ? 'bg-neutral-100 text-brand-500 shadow-sm border border-neutral-300' : 'text-neutral-700 hover:text-neutral-800')}
            title="Grid View"
          >
            <LayoutGrid size={15} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={clsx('p-1.5 rounded-md transition-all', viewMode === 'list' ? 'bg-neutral-100 text-brand-500 shadow-sm border border-neutral-300' : 'text-neutral-700 hover:text-neutral-800')}
            title="List View"
          >
            <List size={15} />
          </button>
        </div>
      </div>

      {/* ── Content Zone ───────────────────────────────────────── */}
      {filteredAssignments.length === 0 ? (
        <EmptyState />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {filteredAssignments.map((item) => (
            <AssignmentCardItem key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="bg-neutral-100 border border-neutral-300 rounded-2xl overflow-hidden shadow-premium">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-neutral-200 border-b border-neutral-300">
                <tr>
                  {['Paper Title', 'Subject', 'Grade', 'Marks', 'AI Status', 'Actions'].map((h, i) => (
                    <th
                      key={h}
                      className={clsx(
                        'py-3 px-5 text-[10px] font-black text-neutral-700 uppercase tracking-widest',
                        i === 5 && 'text-right'
                      )}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-300">
                {filteredAssignments.map((item) => (
                  <AssignmentRowItem key={item.id} item={item} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Empty State ─────────────────────────────────────────────────── */
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-8 bg-neutral-100 border border-neutral-300 rounded-2xl shadow-premium relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 via-transparent to-violet-500/5 pointer-events-none" />
      <div className="relative mb-6 animate-float">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500/15 to-brand-700/5 border border-brand-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(249,115,22,0.1)]">
          <BookOpen size={34} className="text-brand-500" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-md animate-pulse">
          <Sparkles size={13} className="text-white" />
        </div>
      </div>
      <h3 className="text-xl font-black text-neutral-900 mb-2">Start Generating with AI</h3>
      <p className="text-sm text-neutral-700 max-w-sm leading-relaxed">
        Upload lecture blueprints, syllabus files, or textbook excerpts to auto-generate
        curriculum-compliant exam papers in seconds.
      </p>
      <Link
        href="/assignments/create"
        className="mt-7 px-6 py-2.5 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white font-bold text-sm rounded-xl transition-all flex items-center gap-2 shadow-[0_4px_20px_rgba(249,115,22,0.35)] hover:-translate-y-[1px] hover:shadow-[0_6px_28px_rgba(249,115,22,0.45)]"
      >
        <Plus size={16} />
        <span>Create Your First Assignment</span>
      </Link>
    </div>
  );
}

/* ── Grid Card ───────────────────────────────────────────────────── */
function AssignmentCardItem({ item }: { item: Assignment }) {
  const isProcessing = ['processing', 'parsing', 'synthesizing', 'guardrails'].includes(item.status);
  const isFailed = item.status === 'failed';

  return (
    <div className="group bg-neutral-100 border border-neutral-300 rounded-2xl p-5 shadow-premium hover:shadow-[0_8px_32px_-4px_rgba(0,0,0,0.5)] hover:-translate-y-[2px] transition-all duration-300 relative overflow-hidden flex flex-col justify-between card-hover-border">
      {/* Top shimmer on hover */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-500 via-brand-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      {/* Corner glow */}
      <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-brand-500/5 blur-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="space-y-3 relative">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-bold text-neutral-900 leading-snug pr-2 line-clamp-2">{item.title}</h3>
          <span className="shrink-0 px-2 py-0.5 rounded-md bg-neutral-200 text-neutral-700 text-[10px] font-bold uppercase tracking-wide border border-neutral-300">
            {item.subject}
          </span>
        </div>

        <p className="text-xs text-neutral-700 font-medium">
          {item.grade} &bull; <span className="font-bold text-neutral-800">{item.totalMarks} Marks</span>
        </p>

        {isProcessing && (
          <div className="space-y-1.5 mt-1">
            <div className="flex justify-between text-[10px] font-bold">
              <span className="text-brand-500">AI Synthesizing…</span>
              <span className="text-brand-500 tabular-nums">{item.progressPercent}%</span>
            </div>
            <div className="w-full h-1 bg-neutral-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full transition-all duration-500 animate-shimmer"
                style={{ width: `${item.progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-5 pt-4 border-t border-neutral-300 relative">
        <StatusBadge status={item.status} />
        <Link
          href={isProcessing ? '/assignments/create' : `/assignments/${item.id}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-brand-500 hover:text-brand-400 transition-colors group/link"
        >
          {isFailed ? 'Retry' : isProcessing ? 'View Progress' : 'Open Paper'}
          <ArrowRight size={12} className="group-hover/link:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}

/* ── List Row ────────────────────────────────────────────────────── */
function AssignmentRowItem({ item }: { item: Assignment }) {
  const isCompleted = item.status === 'completed';
  const isProcessing = ['processing', 'parsing', 'synthesizing', 'guardrails'].includes(item.status);
  const isFailed = item.status === 'failed';

  return (
    <tr className="hover:bg-neutral-200/30 transition-colors group">
      <td className="py-3.5 px-5">
        <div className="font-bold text-neutral-900 text-sm leading-snug">{item.title}</div>
        <div className="text-[11px] text-neutral-700 mt-0.5 font-medium">Updated {item.updatedAt}</div>
      </td>
      <td className="py-3.5 px-5">
        <span className="px-2 py-0.5 rounded-md bg-neutral-200 text-neutral-700 text-[11px] font-bold uppercase tracking-wide border border-neutral-300">
          {item.subject}
        </span>
      </td>
      <td className="py-3.5 px-5 text-sm text-neutral-800 font-medium">{item.grade}</td>
      <td className="py-3.5 px-5 text-sm font-black text-neutral-900 tabular-nums">{item.totalMarks} pts</td>
      <td className="py-3.5 px-5">
        <StatusBadge status={item.status} progress={item.progressPercent} />
      </td>
      <td className="py-3.5 px-5 text-right">
        {isProcessing ? (
          <span className="flex items-center justify-end gap-1.5 text-xs text-neutral-700 italic font-medium">
            <RefreshCw size={11} className="animate-rotate-slow" />
            Synthesizing…
          </span>
        ) : (
          <div className="flex items-center justify-end gap-3">
            <Link
              href={`/assignments/${item.id}`}
              className="text-xs font-bold text-brand-500 hover:text-brand-400 transition-colors"
            >
              {isCompleted ? 'Open Editor' : isFailed ? 'Re-configure' : 'Build Draft'}
            </Link>
            {isCompleted && (
              <Link
                href={`/assignments/${item.id}`}
                className="px-3 py-1 bg-brand-500/10 hover:bg-brand-500/20 text-brand-500 text-xs font-bold rounded-lg transition-colors border border-brand-500/20"
              >
                Export PDF
              </Link>
            )}
          </div>
        )}
      </td>
    </tr>
  );
}

/* ── Status Badge ────────────────────────────────────────────────── */
function StatusBadge({ status, progress }: { status: string; progress?: number }) {
  const isProcessing = ['processing', 'parsing', 'synthesizing', 'guardrails'].includes(status);
  if (isProcessing) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-500 text-[10px] font-bold">
        <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-ping-slow" />
        AI Processing {progress !== undefined ? `(${progress}%)` : ''}
      </span>
    );
  }
  if (status === 'completed') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
        <CheckCircle2 size={11} className="text-emerald-500" />
        Ready
      </span>
    );
  }
  if (status === 'failed') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold">
        <AlertCircle size={11} className="text-red-500" />
        Failed
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-200 border border-neutral-300 text-neutral-700 text-[10px] font-bold">
      <AlertTriangle size={11} />
      Draft
    </span>
  );
}
