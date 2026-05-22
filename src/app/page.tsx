"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Sparkles,
  Clock,
  FileText,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  LayoutGrid,
  List,
  Plus,
  Zap,
  BookOpen,
  BarChart3,
  RefreshCw,
} from 'lucide-react';
import { useAssignmentStore, Assignment } from '@/store/useAssignmentStore';
import { clsx } from 'clsx';

export default function Dashboard() {
  const { assignments } = useAssignmentStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubjectFilter, setActiveSubjectFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

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
    (sum, item) =>
      sum + item.sections.reduce((sSum, sec) => sSum + sec.questions.length, 0),
    0
  );

  const completedCount = assignments.filter((a) => a.status === 'completed').length;

  const kpis = [
    {
      label: 'Active Papers',
      value: assignments.length,
      sub: `${completedCount} completed`,
      icon: FileText,
      iconBg: 'from-brand-500/10 to-brand-600/5',
      iconColor: 'text-brand-600',
      accent: 'border-brand-500/20',
      trend: <TrendingUp size={11} className="text-emerald-500" />,
      trendText: '4 drafted this week',
      trendColor: 'text-emerald-600',
    },
    {
      label: 'AI Synthesized Questions',
      value: (totalQuestions + 1240).toLocaleString(),
      sub: 'Pedagogically calibrated',
      icon: Sparkles,
      iconBg: 'from-violet-500/10 to-purple-600/5',
      iconColor: 'text-semantic-ai',
      accent: 'border-violet-500/20',
      trend: <Zap size={11} className="text-semantic-ai" />,
      trendText: 'Bloom\'s taxonomy verified',
      trendColor: 'text-semantic-ai',
    },
    {
      label: 'Prep Time Saved',
      value: '42 hrs',
      sub: '≈ 8.4 hrs per draft',
      icon: Clock,
      iconBg: 'from-indigo-500/10 to-brand-600/5',
      iconColor: 'text-brand-600',
      accent: 'border-indigo-500/20',
      trend: <BarChart3 size={11} className="text-brand-600" />,
      trendText: 'Over all generated papers',
      trendColor: 'text-brand-600',
    },
  ];

  return (
    <div className="p-6 md:p-8 space-y-7 max-w-7xl mx-auto w-full font-ui animate-fade-slide-up">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-50 border border-brand-100 text-[10px] font-extrabold text-brand-600 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-ping-slow" />
              Live Workspace
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-neutral-900 leading-tight tracking-tight">
            Academic Assessment Dashboard
          </h1>
          <p className="text-sm text-neutral-500 mt-1 font-medium">
            Build and compile standardized curriculum evaluations powered by AI.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative w-full md:w-80 shrink-0">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search papers, subjects, grades…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-neutral-200 rounded-xl text-sm bg-white text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 shadow-sm transition-all"
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
                'relative bg-white border rounded-2xl p-5 shadow-[0_2px_16px_-4px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_-6px_rgba(79,70,229,0.12)] hover:-translate-y-[2px] transition-all duration-300 overflow-hidden group',
                kpi.accent
              )}
            >
              {/* Decorative gradient blob */}
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br opacity-[0.07] blur-xl from-brand-500 to-semantic-ai pointer-events-none" />

              <div className="flex items-start justify-between">
                <div className="space-y-1.5">
                  <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest">
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
                <div className={clsx('w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0 shadow-inner', kpi.iconBg)}>
                  <Icon size={20} className={kpi.iconColor} />
                </div>
              </div>
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
                'px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all select-none shrink-0 border',
                activeSubjectFilter === subj
                  ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                  : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50'
              )}
            >
              {subj}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 shrink-0 bg-neutral-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={clsx('p-1.5 rounded-md transition-all', viewMode === 'grid' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700')}
            title="Grid View"
          >
            <LayoutGrid size={15} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={clsx('p-1.5 rounded-md transition-all', viewMode === 'list' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700')}
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
        <div className="bg-white border border-neutral-100 rounded-2xl overflow-hidden shadow-[0_2px_16px_-4px_rgba(0,0,0,0.06)]">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-neutral-50 border-b border-neutral-100">
                <tr>
                  {['Paper Title', 'Subject', 'Grade', 'Marks', 'AI Status', 'Actions'].map((h, i) => (
                    <th
                      key={h}
                      className={clsx(
                        'py-3 px-5 text-[10px] font-black text-neutral-500 uppercase tracking-widest',
                        i === 5 && 'text-right'
                      )}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
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
    <div className="flex flex-col items-center justify-center text-center py-20 px-8 bg-white border border-neutral-100 rounded-2xl shadow-[0_2px_16px_-4px_rgba(0,0,0,0.06)]">
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-50 to-violet-50 border border-brand-100 flex items-center justify-center">
          <BookOpen size={34} className="text-brand-500" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-semantic-ai flex items-center justify-center shadow-md">
          <Sparkles size={13} className="text-white" />
        </div>
      </div>
      <h3 className="text-xl font-black text-neutral-900 mb-2">Start Generating with AI</h3>
      <p className="text-sm text-neutral-500 max-w-sm leading-relaxed">
        Upload lecture blueprints, syllabus files, or textbook excerpts to auto-generate
        curriculum-compliant exam papers in seconds.
      </p>
      <Link
        href="/assignments/create"
        className="mt-7 px-6 py-2.5 bg-gradient-to-r from-brand-600 to-semantic-ai hover:opacity-90 text-white font-bold text-sm rounded-xl transition-all flex items-center gap-2 shadow-[0_4px_20px_rgba(99,102,241,0.3)] hover:-translate-y-[1px]"
      >
        <Plus size={16} />
        <span>Create Your First Assignment</span>
      </Link>
    </div>
  );
}

/* ── Grid Card ───────────────────────────────────────────────────── */
function AssignmentCardItem({ item }: { item: Assignment }) {
  const isCompleted = item.status === 'completed';
  const isProcessing = ['processing', 'parsing', 'synthesizing', 'guardrails'].includes(item.status);
  const isFailed = item.status === 'failed';

  return (
    <div className="group bg-white border border-neutral-100 rounded-2xl p-5 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_28px_-4px_rgba(79,70,229,0.10)] hover:-translate-y-[2px] transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
      {/* Top shimmer on hover */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-500 via-semantic-ai to-brand-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-bold text-neutral-900 leading-snug pr-2 line-clamp-2">
            {item.title}
          </h3>
          <span className="shrink-0 px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 text-[10px] font-bold uppercase tracking-wide">
            {item.subject}
          </span>
        </div>

        <p className="text-xs text-neutral-500 font-medium">
          {item.grade} &bull; <span className="font-bold text-neutral-700">{item.totalMarks} Marks</span>
        </p>

        {isProcessing && (
          <div className="space-y-1.5 mt-1">
            <div className="flex justify-between text-[10px] font-bold">
              <span className="text-brand-600">AI Synthesizing…</span>
              <span className="text-brand-500">{item.progressPercent}%</span>
            </div>
            <div className="w-full h-1 bg-neutral-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-500 to-semantic-ai rounded-full transition-all duration-500"
                style={{ width: `${item.progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-5 pt-4 border-t border-neutral-50">
        <StatusBadge status={item.status} />
        <Link
          href={isProcessing ? '/assignments/create' : `/assignments/${item.id}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors"
        >
          {isFailed ? 'Retry' : isProcessing ? 'View Progress' : 'Open Paper'}
          <ArrowRight size={12} />
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
    <tr className="hover:bg-neutral-50/60 transition-colors group">
      <td className="py-3.5 px-5">
        <div className="font-bold text-neutral-900 text-sm leading-snug">{item.title}</div>
        <div className="text-[11px] text-neutral-400 mt-0.5 font-medium">Updated {item.updatedAt}</div>
      </td>
      <td className="py-3.5 px-5">
        <span className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 text-[11px] font-bold uppercase tracking-wide">
          {item.subject}
        </span>
      </td>
      <td className="py-3.5 px-5 text-sm text-neutral-700 font-medium">{item.grade}</td>
      <td className="py-3.5 px-5 text-sm font-black text-neutral-900 tabular-nums">{item.totalMarks} pts</td>
      <td className="py-3.5 px-5">
        <StatusBadge status={item.status} progress={item.progressPercent} />
      </td>
      <td className="py-3.5 px-5 text-right">
        {isProcessing ? (
          <span className="flex items-center justify-end gap-1.5 text-xs text-neutral-400 italic font-medium">
            <RefreshCw size={11} className="animate-rotate-slow" />
            Synthesizing…
          </span>
        ) : (
          <div className="flex items-center justify-end gap-3">
            <Link
              href={`/assignments/${item.id}`}
              className="text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors"
            >
              {isCompleted ? 'Open Editor' : isFailed ? 'Re-configure' : 'Build Draft'}
            </Link>
            {isCompleted && (
              <Link
                href={`/assignments/${item.id}`}
                className="px-3 py-1 bg-brand-50 hover:bg-brand-100 text-brand-600 text-xs font-bold rounded-lg transition-colors border border-brand-100"
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
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping-slow" />
        AI Processing {progress !== undefined ? `(${progress}%)` : ''}
      </span>
    );
  }
  if (status === 'completed') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold">
        <CheckCircle2 size={11} className="text-emerald-600" />
        Ready
      </span>
    );
  }
  if (status === 'failed') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-800 text-[10px] font-bold">
        <AlertCircle size={11} className="text-red-600" />
        Failed
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold">
      <AlertTriangle size={11} className="text-slate-500" />
      Draft
    </span>
  );
}
