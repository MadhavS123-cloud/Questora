"use client";

import React, { useEffect, useRef } from 'react';
import { Sparkles, CheckCircle2, Circle, XCircle, ArrowRight, Terminal } from 'lucide-react';
import { clsx } from 'clsx';

interface ProgressTrackerProps {
  status: 'idle' | 'ingesting' | 'parsing' | 'synthesizing' | 'guardrails' | 'completed' | 'failed';
  step: number;
  logs: string[];
  onBackgroundToggle: () => void;
  onCancel: () => void;
}

const PIPELINE_STAGES = [
  { label: 'File Ingestion',      stepVal: 1, desc: 'Verifying & parsing formats',           key: 'ingesting' },
  { label: 'Semantic Analysis',   stepVal: 2, desc: 'Mapping conceptual knowledge graph',     key: 'parsing' },
  { label: 'Question Synthesis',  stepVal: 3, desc: 'Drafting questions with distractors',    key: 'synthesizing' },
  { label: 'Quality Guardrails',  stepVal: 4, desc: 'Bloom\'s taxonomy & syllabus alignment', key: 'guardrails' },
  { label: 'Final Typesetting',   stepVal: 5, desc: 'Formatting print-ready exam layout',     key: 'completed' },
];

export default function ProgressTracker({ status, step, logs, onBackgroundToggle, onCancel }: ProgressTrackerProps) {
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const progressPercent =
    status === 'completed' ? 100 :
    status === 'failed' ? 0 :
    Math.min(93, Math.max(5, (step / 5) * 100));

  const isCompleted = status === 'completed';
  const isFailed = status === 'failed';

  return (
    <div className="w-full max-w-3xl mx-auto font-ui animate-fade-slide-up">
 
      {/* ── Outer card ────────────────────────────────────────────── */}
      <div className="bg-neutral-100 border border-neutral-300 rounded-2xl overflow-hidden shadow-[0_8px_40px_-8px_rgba(0,0,0,0.4)]">
 
        {/* Header */}
        <div className="bg-gradient-to-r from-neutral-50 via-neutral-100 to-neutral-200 px-6 py-5 flex items-center justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-500/10 via-transparent to-semantic-ai/10 pointer-events-none" />
          <div className="flex items-center gap-3 relative">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
              <Sparkles size={20} className="text-brand-500 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white leading-tight">
                QUESTORA AI — Generating Paper
              </h2>
              <p className="text-[11px] text-neutral-700 mt-0.5">
                {isCompleted
                  ? 'Paper compiled successfully!'
                  : isFailed
                  ? 'Generation failed.'
                  : `Est. remaining: ~${Math.max(5, 30 - step * 6)}s`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 relative">
            <button
              onClick={onBackgroundToggle}
              className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-800 font-semibold text-xs rounded-lg transition-all flex items-center gap-1.5"
            >
              <span>Background</span>
              <ArrowRight size={12} />
            </button>
            <button
              onClick={onCancel}
              className="px-3.5 py-1.5 bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 text-neutral-700 hover:text-red-400 font-semibold text-xs rounded-lg transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
 
        <div className="p-6 space-y-6">
 
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-neutral-800">
              <span>Overall Synthesis Rate</span>
              <span className="tabular-nums text-brand-500">{Math.round(progressPercent)}%</span>
            </div>
            <div className="relative w-full h-2 bg-neutral-50 rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-brand-500 via-[#FF7A1A] to-semantic-ai rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
              {!isCompleted && (
                <div
                  className="absolute top-0 h-full w-16 animate-shimmer rounded-full"
                  style={{ left: `${Math.max(0, progressPercent - 10)}%` }}
                />
              )}
            </div>
          </div>
 
          {/* Pipeline stages */}
          <div className="grid grid-cols-5 gap-2">
            {PIPELINE_STAGES.map((stage) => {
              const isFinished = step > stage.stepVal || isCompleted;
              const isActive = step === stage.stepVal && !isCompleted && !isFailed;
              const isPending = !isFinished && !isActive;
 
              return (
                <div
                  key={stage.label}
                  className={clsx(
                    'relative flex flex-col gap-2 p-3 rounded-xl border transition-all duration-500',
                    isFinished && 'border-emerald-500/20 bg-emerald-500/5',
                    isActive && 'border-brand-500/30 bg-brand-500/5 shadow-[0_0_12px_rgba(249,115,22,0.12)] scale-[1.02]',
                    isPending && 'border-neutral-300 bg-neutral-100/40 opacity-40'
                  )}
                >
                  {/* Step indicator */}
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-black text-neutral-700 uppercase tracking-widest">
                      0{stage.stepVal}
                    </span>
                    {isFinished && <CheckCircle2 size={13} className="text-emerald-500" />}
                    {isActive && (
                      <div className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-ping-slow" />
                    )}
                    {isPending && <Circle size={12} className="text-neutral-300" />}
                  </div>
                  {/* Stage label */}
                  <div>
                    <p className={clsx(
                      'text-[10px] font-bold leading-tight',
                      isFinished && 'text-emerald-400',
                      isActive && 'text-brand-500',
                      isPending && 'text-neutral-700'
                    )}>
                      {stage.label}
                    </p>
                    <p className="text-[9px] text-neutral-700 mt-0.5 leading-tight hidden sm:block">
                      {stage.desc}
                    </p>
                  </div>
                  {/* Active pulse line */}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-500 to-semantic-ai rounded-b-xl" />
                  )}
                </div>
              );
            })}
          </div>
 
          {/* Terminal console */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Terminal size={13} className="text-neutral-700" />
              <label className="text-[10px] font-black text-neutral-700 uppercase tracking-widest">
                Real-Time Synthesis Log
              </label>
              <div className="flex-1 h-px bg-neutral-300" />
              {!isCompleted && (
                <span className="text-[9px] text-emerald-500 font-bold animate-pulse">● LIVE</span>
              )}
            </div>
 
            <div
              className="w-full h-48 bg-[#0a0a0c] rounded-xl border border-neutral-300 p-4 overflow-y-auto space-y-1 dark-scrollbar font-mono text-xs"
              aria-live="polite"
              aria-label="AI generation logs"
            >
              {/* Terminal prompt line */}
              <div className="text-neutral-700 text-[10px] mb-2 border-b border-neutral-300 pb-1.5 flex items-center gap-2">
                <span className="text-emerald-500 font-bold">questora@ai</span>
                <span className="text-neutral-700">:</span>
                <span className="text-brand-500">~/synthesis</span>
                <span className="text-neutral-700">$</span>
                <span className="text-neutral-700">generate --mode=pedagogical --compliance=grade-10</span>
              </div>
 
              {logs.map((log, index) => {
                const isPhase = log.startsWith('Phase') || log.startsWith('[Connection');
                const isSuccess = log.toLowerCase().includes('success') || log.toLowerCase().includes('complet') || log.toLowerCase().includes('passed');
                const isWarn = log.toLowerCase().includes('warning') || log.toLowerCase().includes('draft');
 
                return (
                  <div
                    key={index}
                    className={clsx(
                      'leading-relaxed flex items-start gap-2',
                      isPhase && 'text-semantic-ai font-bold',
                      isSuccess && !isPhase && 'text-emerald-400',
                      isWarn && !isPhase && 'text-brand-500',
                      !isPhase && !isSuccess && !isWarn && 'text-neutral-700'
                    )}
                  >
                    <span className="text-neutral-700 select-none shrink-0 mt-0.5">&gt;&gt;</span>
                    <span>{log}</span>
                  </div>
                );
              })}
 
              {/* Blinking cursor */}
              {!isCompleted && !isFailed && (
                <div className="flex items-center gap-2 text-neutral-700">
                  <span className="text-neutral-700">&gt;&gt;</span>
                  <span className="inline-block w-2 h-3.5 bg-brand-500 animate-terminal-blink rounded-sm" />
                </div>
              )}
 
              {isCompleted && (
                <div className="flex items-center gap-2 text-emerald-400 font-bold mt-1">
                  <span className="text-neutral-700">&gt;&gt;</span>
                  <CheckCircle2 size={12} />
                  <span>Process exited successfully. Redirecting to editor…</span>
                </div>
              )}
 
              <div ref={logEndRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
