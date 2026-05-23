"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Sparkles,
  CheckCircle,
  BookOpen,
  Target,
  Hash,
  Layers,
  ChevronRight,
  AlertTriangle,
  Wand2,
} from 'lucide-react';
import { useAssignmentStore, Assignment } from '@/store/useAssignmentStore';
import UploadDropzone from '@/components/UploadDropzone';
import ProgressTracker from '@/components/ProgressTracker';
import { clsx } from 'clsx';

const SUBJECTS = ['Physics', 'Math', 'History', 'Biology', 'Chemistry', 'English'];
const GRADES = ['Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];

export default function CreateAssignment() {
  const router = useRouter();
  const {
    addAssignment,
    simulateAICompilation,
    generationStatus,
    generationStep,
    generationLogs,
  } = useAssignmentStore();

  const [title, setTitle] = useState('Kinematics Unit Test');
  const [subject, setSubject] = useState('Physics');
  const [grade, setGrade] = useState('Grade 10');
  const [targetTotal, setTargetTotal] = useState(50);
  const [mcqCount, setMcqCount] = useState(5);
  const [mcqMarks, setMcqMarks] = useState(2);
  const [shortCount, setShortCount] = useState(3);
  const [shortMarks, setShortMarks] = useState(5);
  const [longCount, setLongCount] = useState(2);
  const [longMarks, setLongMarks] = useState(12.5);
  const [sourceName, setSourceName] = useState('');
  const [sourceExcerpt, setSourceExcerpt] = useState('');
  const [uiView, setUiView] = useState<'form' | 'generating'>('form');
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const distributedTotal = mcqCount * mcqMarks + shortCount * shortMarks + longCount * longMarks;
  const unallocatedMarks = targetTotal - distributedTotal;
  const isBalanced = Math.abs(unallocatedMarks) < 0.01;
  const canGenerate = !!sourceName && isBalanced;

  const handleFileAccepted = (name: string, excerpt: string) => {
    setSourceName(name);
    setSourceExcerpt(excerpt);
  };
  const handleFileCleared = () => {
    setSourceName('');
    setSourceExcerpt('');
  };

  const handleOptimisticFix = () => {
    const currentWithoutLong = mcqCount * mcqMarks + shortCount * shortMarks;
    const targetLong = targetTotal - currentWithoutLong;
    if (targetLong > 0 && longCount > 0) setLongMarks(targetLong / longCount);
  };

  const handleTriggerGeneration = () => {
    if (!sourceName) return;
    if (!isBalanced) return;
    const newId = String(Date.now());
    const newAssignment: Assignment = {
      id: newId,
      title: title || 'Untitled AI Assignment',
      subject,
      grade,
      totalMarks: targetTotal,
      status: 'processing',
      updatedAt: 'Just now',
      progressPercent: 10,
      sourceName,
      sourceTextExcerpt: sourceExcerpt,
      sections: [],
    };
    addAssignment(newAssignment);
    setGeneratingId(newId);
    setUiView('generating');
    simulateAICompilation(newId, () => {
      setTimeout(() => router.push(`/assignments/${newId}`), 500);
    });
  };

  if (uiView === 'generating') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-neutral-50">
        <ProgressTracker
          status={generationStatus}
          step={generationStep}
          logs={generationLogs}
          onBackgroundToggle={() => router.push('/')}
          onCancel={() => {
            setUiView('form');
            if (generatingId) {
              useAssignmentStore.getState().updateAssignmentStatus(generatingId, 'failed', 0);
            }
          }}
        />
      </div>
    );
  }
 
  const sectionRows = [
    {
      label: 'MCQ',
      icon: Hash,
      color: 'text-brand-500',
      bg: 'bg-brand-500/10',
      border: 'border-brand-500/20',
      count: mcqCount, setCount: setMcqCount,
      marks: mcqMarks, setMarks: setMcqMarks,
      preview: Array.from({ length: Math.min(8, mcqCount) }),
      previewColor: 'bg-brand-500/10 border-brand-500/20 text-brand-500',
    },
    {
      label: 'Short Answer',
      icon: BookOpen,
      color: 'text-semantic-ai',
      bg: 'bg-brand-500/10',
      border: 'border-brand-500/20',
      count: shortCount, setCount: setShortCount,
      marks: shortMarks, setMarks: setShortMarks,
      preview: Array.from({ length: Math.min(8, shortCount) }),
      previewColor: 'bg-brand-500/10 border-brand-500/20 text-brand-500',
    },
    {
      label: 'Long Essay',
      icon: Layers,
      color: 'text-brand-500',
      bg: 'bg-brand-500/10',
      border: 'border-brand-500/20',
      count: longCount, setCount: setLongCount,
      marks: longMarks, setMarks: setLongMarks,
      preview: Array.from({ length: Math.min(8, longCount) }),
      previewColor: 'bg-brand-500/10 border-brand-500/20 text-brand-500',
    },
  ];
 
  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full font-ui animate-fade-slide-up bg-neutral-50 text-neutral-800">
 
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 pb-2">
        <Link
          href="/"
          className="p-2 rounded-xl border border-neutral-300 hover:bg-neutral-200 text-neutral-700 hover:text-neutral-900 transition-all shadow-sm"
        >
          <ArrowLeft size={15} />
        </Link>
        <div>
          <span className="text-[10px] font-extrabold text-brand-500 uppercase tracking-widest block">
            AI Blueprint Wizard
          </span>
          <h1 className="text-xl font-extrabold text-neutral-900 leading-tight">
            Configure Assessment Specifications
          </h1>
        </div>
      </div>
 
      {/* ── Split layout ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 items-start">
 
        {/* Left: Config panel */}
        <div className="space-y-5">
 
          {/* Meta card */}
          <div className="bg-neutral-100 border border-neutral-300 rounded-2xl p-6 shadow-premium space-y-5">
            <div className="flex items-center gap-2 pb-1 border-b border-neutral-300">
              <Target size={15} className="text-brand-500" />
              <h2 className="text-xs font-black text-neutral-800 uppercase tracking-widest">
                1. Paper Meta &amp; Class Info
              </h2>
            </div>
 
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-neutral-700 uppercase tracking-widest">
                  Assignment Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input-premium"
                  placeholder="e.g. Kinematics Unit Test"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-neutral-700 uppercase tracking-widest">
                  Target Total Marks
                </label>
                <input
                  type="number"
                  value={targetTotal}
                  onChange={(e) => setTargetTotal(Number(e.target.value))}
                  className="input-premium"
                  min={1}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-neutral-700 uppercase tracking-widest">
                  Curriculum Subject
                </label>
                <div className="relative">
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="select-premium"
                  >
                    {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
                  </select>
                  <ChevronRight size={13} className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-neutral-700 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-neutral-700 uppercase tracking-widest">
                  Target Grade Level
                </label>
                <div className="relative">
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="select-premium"
                  >
                    {GRADES.map((g) => <option key={g}>{g}</option>)}
                  </select>
                  <ChevronRight size={13} className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-neutral-700 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
 
          {/* Upload card */}
          <div className="bg-neutral-100 border border-neutral-300 rounded-2xl p-6 shadow-premium">
            <UploadDropzone onFileAccepted={handleFileAccepted} onFileCleared={handleFileCleared} />
          </div>
 
          {/* Marks distribution card */}
          <div className="bg-neutral-100 border border-neutral-300 rounded-2xl p-6 shadow-premium space-y-5">
            <div className="flex items-center gap-2 pb-1 border-b border-neutral-300">
              <Layers size={15} className="text-semantic-ai" />
              <h2 className="text-xs font-black text-neutral-800 uppercase tracking-widest">
                2. Question Mix &amp; Mark Weights
              </h2>
            </div>
 
            <div className="space-y-3">
              {sectionRows.map((row) => {
                const Icon = row.icon;
                const rowTotal = row.count * row.marks;
                return (
                  <div
                    key={row.label}
                    className={clsx(
                      'flex items-center gap-3 p-3.5 rounded-xl border transition-all',
                      row.bg, row.border
                    )}
                  >
                    <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-neutral-200')}>
                      <Icon size={15} className={row.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={clsx('text-[11px] font-black uppercase tracking-wider mb-1.5', row.color)}>
                        {row.label}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col gap-0.5 flex-1">
                          <span className="text-[9px] font-bold text-neutral-700 uppercase">Count</span>
                          <input
                            type="number"
                            value={row.count}
                            onChange={(e) => row.setCount(Number(e.target.value))}
                            min={0}
                            className="w-full px-2 py-1 border border-neutral-300 rounded-lg text-xs font-bold text-neutral-900 bg-neutral-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
                          />
                        </div>
                        <div className="flex flex-col gap-0.5 flex-1">
                          <span className="text-[9px] font-bold text-neutral-700 uppercase">Marks/Q</span>
                          <input
                            type="number"
                            value={row.marks}
                            onChange={(e) => row.setMarks(Number(e.target.value))}
                            min={0}
                            step={0.5}
                            className="w-full px-2 py-1 border border-neutral-300 rounded-lg text-xs font-bold text-neutral-900 bg-neutral-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={clsx('text-lg font-black tabular-nums', row.color)}>{rowTotal}</span>
                      <span className="block text-[9px] text-neutral-700 font-semibold uppercase">marks</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
 
        {/* Right: Blueprint preview + Generate */}
        <div className="space-y-4 sticky top-6">
 
          {/* Blueprint preview card */}
          <div className="bg-neutral-100 border border-neutral-300 rounded-2xl overflow-hidden shadow-premium">
            {/* Header */}
            <div className="bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-200 p-5 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-brand-500/10 via-transparent to-semantic-ai/10 pointer-events-none" />
              <span className="text-[9px] font-black uppercase tracking-widest text-brand-500 block mb-1">
                ⚡ Live Blueprint Preview
              </span>
              <h3 className="font-extrabold text-base text-white tracking-tight truncate">
                {title || 'Untitled Assessment Blueprint'}
              </h3>
              <p className="text-xs text-neutral-700 mt-0.5">
                {subject} &bull; {grade} &bull;{' '}
                <span className="font-bold text-neutral-800">Target: {targetTotal} Marks</span>
              </p>
            </div>
 
            {/* Section skeletons */}
            <div className="p-5 space-y-5">
              {sectionRows.map((row, si) => {
                const rowTotal = row.count * row.marks;
                const sectionLabels = ['SECTION A: MULTIPLE CHOICE', 'SECTION B: SHORT ANSWERS', 'SECTION C: LONG ESSAYS'];
                return (
                  <div key={row.label} className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-black text-neutral-800 uppercase tracking-wide border-b border-neutral-300 pb-1.5">
                      <span>{sectionLabels[si]}</span>
                      <span className={clsx('font-black', row.color)}>{rowTotal} pts</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {row.preview.map((_, i) => (
                        <div
                          key={i}
                          className={clsx(
                            'w-7 h-5 rounded border text-[9px] font-bold flex items-center justify-center transition-all',
                            row.previewColor
                          )}
                        >
                          Q{(si === 1 ? mcqCount : si === 2 ? mcqCount + shortCount : 0) + i + 1}
                        </div>
                      ))}
                      {row.count > 8 && (
                        <span className={clsx('text-[10px] font-bold self-center', row.color)}>
                          +{row.count - 8} more
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
 
            {/* Balance bar */}
            <div className="bg-neutral-200 border-t border-neutral-300 px-5 py-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] text-neutral-700 font-semibold uppercase tracking-wide">Total Allocated</p>
                <p className="text-lg font-black text-neutral-900 tabular-nums">
                  {distributedTotal} / {targetTotal}
                  <span className="text-xs font-semibold text-neutral-700 ml-1">Marks</span>
                </p>
              </div>
 
              {isBalanced ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-extrabold uppercase tracking-wide">
                  <CheckCircle size={11} />
                  Perfectly Balanced
                </div>
              ) : (
                <div className="text-right space-y-1">
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-500 text-[10px] font-bold">
                    <AlertTriangle size={10} />
                    {unallocatedMarks > 0
                      ? `${unallocatedMarks} Unallocated`
                      : `${Math.abs(unallocatedMarks)} Excess`}
                  </div>
                  <button
                    onClick={handleOptimisticFix}
                    className="block text-[10px] font-bold text-brand-500 hover:text-brand-600 hover:underline w-full text-right"
                  >
                    Auto-balance essays →
                  </button>
                </div>
              )}
            </div>
          </div>
 
          {/* Generate button */}
          <button
            onClick={handleTriggerGeneration}
            disabled={!canGenerate}
            className={clsx(
              'w-full py-4 rounded-xl font-ui font-extrabold text-sm transition-all duration-300 flex items-center justify-center gap-2.5 relative overflow-hidden',
              canGenerate
                ? 'bg-gradient-to-r from-brand-500 via-brand-600 to-semantic-ai text-white shadow-[0_6px_30px_rgba(249,115,22,0.35)] hover:shadow-[0_8px_40px_rgba(249,115,22,0.5)] hover:-translate-y-[1px] animate-glow cursor-pointer'
                : 'bg-neutral-200 text-neutral-700 border border-neutral-300 cursor-not-allowed'
            )}
          >
            {canGenerate && (
              <span className="absolute inset-0 animate-shimmer pointer-events-none" />
            )}
            <Wand2 size={18} className={canGenerate ? 'text-orange-200' : 'text-neutral-700'} />
            <span>Generate Pedagogical Question Paper</span>
            {canGenerate && <Sparkles size={14} className="text-orange-200 animate-pulse" />}
          </button>
 
          {!sourceName && (
            <p className="text-[11px] text-neutral-700 text-center font-medium">
              ↑ Upload a source document to unlock AI generation
            </p>
          )}
          {sourceName && !isBalanced && (
            <p className="text-[11px] text-brand-500 text-center font-semibold">
              ⚠ Balance your marks distribution before generating
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
