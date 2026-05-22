"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Sparkles,
  Printer,
  CheckCircle,
  FileText,
  Edit3,
  RefreshCw,
  Trash2,
  ChevronDown,
  Brain,
  Shield,
  Zap,
  BookOpen,
} from 'lucide-react';
import { useAssignmentStore, Question } from '@/store/useAssignmentStore';
import { clsx } from 'clsx';

export default function AssignmentEditor() {
  const params = useParams();
  const router = useRouter();
  const assignmentId = params.id as string;

  const {
    assignments,
    activeSourceHighlight,
    setActiveSourceHighlight,
    updateQuestion,
    deleteQuestion,
    regenerateQuestion,
    verifyAssignment,
  } = useAssignmentStore();

  const activeAssignment = assignments.find((a) => a.id === assignmentId);

  const [fontFamily, setFontFamily] = useState<'font-examSerif' | 'font-ui' | 'font-examSans'>('font-examSerif');
  const [fontSize, setFontSize] = useState<'text-sm' | 'text-base' | 'text-lg'>('text-base');
  const [marginSize, setMarginSize] = useState<'p-6' | 'p-10' | 'p-14'>('p-10');
  const [includeAnswerKey, setIncludeAnswerKey] = useState(true);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [editBufferText, setEditBufferText] = useState('');
  const [regenLoadingId, setRegenLoadingId] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<'source' | 'paper'>('paper');
  const [hoveredQuestionId, setHoveredQuestionId] = useState<string | null>(null);

  useEffect(() => {
    if (!activeAssignment) router.push('/');
  }, [activeAssignment, router]);

  if (!activeAssignment) return null;

  const handleVerify = () => {
    verifyAssignment(activeAssignment.id);
  };
  const handleTriggerPrint = () => window.print();
  const handleInitEdit = (q: Question) => {
    setEditingQuestionId(q.id);
    setEditBufferText(q.questionText);
  };
  const handleSaveEdit = (q: Question, sectionId: string) => {
    updateQuestion(activeAssignment.id, sectionId, q.id, { questionText: editBufferText });
    setEditingQuestionId(null);
  };
  const handleQuestionRegen = async (sectionId: string, q: Question, type: 'easier' | 'harder' | 'rephrase') => {
    setRegenLoadingId(q.id);
    try {
      await regenerateQuestion(activeAssignment.id, sectionId, q.id, type);
    } finally {
      setRegenLoadingId(null);
    }
  };

  const isCompleted = activeAssignment.status === 'completed';

  return (
    <div className="flex flex-col h-screen w-full font-ui overflow-hidden bg-neutral-50">

      {/* ── Global Header ──────────────────────────────────────────────── */}
      <header className="h-14 border-b border-neutral-100 bg-white px-5 flex items-center justify-between shrink-0 no-print shadow-[0_1px_0_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-neutral-600 transition-all"
          >
            <ArrowLeft size={14} />
          </Link>
          <div className="hidden md:block">
            <span className="text-[9px] font-black text-brand-500 uppercase tracking-widest block">
              Assignment Editor
            </span>
            <h1 className="text-sm font-extrabold text-neutral-900 leading-tight truncate max-w-[260px]">
              {activeAssignment.title}
            </h1>
          </div>
        </div>

        {/* Format selectors */}
        <div className="hidden lg:flex items-center gap-3 text-xs text-neutral-700">
          {[
            {
              label: 'Font', value: fontFamily, onChange: setFontFamily as (v: string) => void,
              options: [
                { value: 'font-examSerif', label: 'Georgia (Print)' },
                { value: 'font-ui', label: 'Jakarta (Modern)' },
                { value: 'font-examSans', label: 'Arial (Standard)' },
              ]
            },
            {
              label: 'Size', value: fontSize, onChange: setFontSize as (v: string) => void,
              options: [
                { value: 'text-sm', label: 'Compact 10pt' },
                { value: 'text-base', label: 'Standard 11pt' },
                { value: 'text-lg', label: 'Readable 12pt' },
              ]
            },
            {
              label: 'Margins', value: marginSize, onChange: setMarginSize as (v: string) => void,
              options: [
                { value: 'p-6', label: 'Narrow' },
                { value: 'p-10', label: 'Standard' },
                { value: 'p-14', label: 'Wide' },
              ]
            },
          ].map((sel) => (
            <div key={sel.label} className="flex items-center gap-1.5">
              <span className="text-neutral-400 font-semibold text-[11px]">{sel.label}:</span>
              <select
                value={sel.value}
                onChange={(e) => sel.onChange(e.target.value)}
                className="px-2 py-1 border border-neutral-200 rounded-lg bg-white font-semibold text-xs focus:outline-none focus:ring-1 focus:ring-brand-400 cursor-pointer"
              >
                {sel.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          ))}
          <label className="flex items-center gap-1.5 text-xs text-neutral-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={includeAnswerKey}
              onChange={(e) => setIncludeAnswerKey(e.target.checked)}
              className="rounded text-brand-600 focus:ring-brand-500 w-3.5 h-3.5"
            />
            <span className="text-[11px] font-semibold">Answer Key</span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {!isCompleted && (
            <button
              onClick={handleVerify}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 shadow-sm"
            >
              <CheckCircle size={13} />
              <span className="hidden sm:block">Verify &amp; Lock</span>
            </button>
          )}
          {isCompleted && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
              <CheckCircle size={12} />
              <span className="hidden sm:block">Verified</span>
            </div>
          )}
          <button
            onClick={handleTriggerPrint}
            className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Printer size={13} />
            <span>Export PDF</span>
          </button>
        </div>
      </header>

      {/* Mobile Tabs */}
      <div className="flex border-b border-neutral-100 bg-white md:hidden no-print">
        {(['source', 'paper'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setMobileTab(tab)}
            className={clsx(
              'flex-1 py-2.5 text-xs font-bold border-b-2 text-center transition-colors',
              mobileTab === tab ? 'border-brand-600 text-brand-600' : 'border-transparent text-neutral-500'
            )}
          >
            {tab === 'source' ? '① Source Excerpt' : '② Generated Paper'}
          </button>
        ))}
      </div>

      {/* ── Dual Pane Workspace ────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden w-full">

        {/* LEFT: Dark source pane */}
        <section
          className={clsx(
            'w-full md:w-[38%] bg-[#080d17] border-r border-slate-800/80 flex flex-col shrink-0 overflow-hidden transition-all duration-300 no-print dark-scrollbar',
            mobileTab === 'source' ? 'flex' : 'hidden md:flex'
          )}
        >
          {/* Pane header */}
          <div className="px-5 py-3.5 border-b border-slate-800/80 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                <FileText size={13} className="text-brand-400" />
              </div>
              <div>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block">
                  Source Vault
                </span>
                <span className="text-xs font-bold text-slate-200">
                  {activeAssignment.sourceName || 'Ingested Document'}
                </span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 text-[9px] font-bold uppercase tracking-wider">
              OCR Parsed
            </span>
          </div>

          {/* Source text */}
          <div className="flex-1 overflow-y-auto p-5 dark-scrollbar">
            <div className="rounded-xl bg-slate-950/60 border border-slate-800/60 p-4 space-y-3">
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest border-b border-slate-900 pb-2">
                Concept boundaries parsed via OCR engine:
              </p>
              <div className="leading-loose text-sm text-slate-400 font-ui space-y-1">
                {activeAssignment.sourceTextExcerpt
                  ? activeAssignment.sourceTextExcerpt.split('. ').map((sentence, idx) => {
                      const clean = sentence.trim();
                      const isHighlighted =
                        activeSourceHighlight &&
                        clean.toLowerCase().includes(activeSourceHighlight.toLowerCase().replace(/\.$/, '').substring(0, 30));
                      return (
                        <span
                          key={idx}
                          className={clsx(
                            'inline transition-all duration-300 rounded px-0.5',
                            isHighlighted
                              ? 'bg-brand-500/25 text-white border-b border-brand-400/50 font-semibold'
                              : 'text-slate-400'
                          )}
                        >
                          {clean}.{' '}
                        </span>
                      );
                    })
                  : <span className="text-slate-600 italic">No source material uploaded.</span>
                }
              </div>
            </div>
          </div>

          {/* Bottom hint */}
          <div className="px-5 py-3 border-t border-slate-800/80 shrink-0">
            <div className="flex items-center gap-2 text-[10px] text-brand-400 font-bold bg-brand-500/5 border border-brand-500/15 rounded-lg px-3 py-2">
              <Sparkles size={12} className="animate-pulse" />
              Hover questions to reveal source citations
            </div>
          </div>
        </section>

        {/* RIGHT: Exam paper viewport */}
        <section
          className={clsx(
            'flex-1 h-full overflow-y-auto transition-all duration-300',
            mobileTab === 'paper' ? 'block' : 'hidden md:block'
          )}
          style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' }}
        >
          <div className="p-4 md:p-8 flex justify-center min-h-full">
            {/* A4 Paper */}
            <div
              className={clsx(
                'w-full max-w-3xl bg-white rounded-xl shadow-[0_8px_40px_-8px_rgba(0,0,0,0.12)] printable-exam-container text-neutral-900 border border-neutral-200/60',
                fontFamily, fontSize, marginSize
              )}
            >
              {/* Letterhead */}
              <div className="text-center border-2 border-double border-neutral-800 p-4 space-y-2 mb-8">
                <h2 className="text-lg font-extrabold tracking-tight font-examSerif uppercase text-neutral-900">
                  Oakridge International Academy
                </h2>
                <div className="flex flex-wrap items-center justify-between text-xs font-semibold px-2 pt-2 font-ui gap-2 text-neutral-800">
                  <span>Name: __________________________</span>
                  <span>Date: ____________</span>
                </div>
                <div className="flex flex-wrap items-center justify-between text-xs font-semibold px-2 font-ui gap-2 text-neutral-700">
                  <span>Grade: {activeAssignment.grade} ({activeAssignment.subject})</span>
                  <span>Time: 90 Minutes &bull; Total: {activeAssignment.totalMarks} Marks</span>
                </div>
              </div>

              {/* Sections */}
              <div className="space-y-8">
                {activeAssignment.sections.map((section) => (
                  <div key={section.id} className="space-y-4">
                    {/* Section header */}
                    <h3 className="text-sm font-extrabold uppercase border-b-2 border-neutral-900 pb-1.5 tracking-wider font-ui text-neutral-950 flex items-center justify-between">
                      <span>{section.title}</span>
                      <span className="text-[10px] font-bold bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded normal-case tracking-normal">
                        {section.questions.reduce((sum, q) => sum + q.marks, 0)} pts
                      </span>
                    </h3>

                    {/* Questions */}
                    <div className="space-y-5">
                      {section.questions.map((q) => {
                        const isEditing = editingQuestionId === q.id;
                        const isRegen = regenLoadingId === q.id;
                        const isHovered = hoveredQuestionId === q.id;

                        return (
                          <div
                            key={q.id}
                            onMouseEnter={() => {
                              setHoveredQuestionId(q.id);
                              if (q.sourceCitation) setActiveSourceHighlight(q.sourceCitation.passageSnippet);
                            }}
                            onMouseLeave={() => {
                              setHoveredQuestionId(null);
                              setActiveSourceHighlight(null);
                            }}
                            className={clsx(
                              'group relative border rounded-xl p-3.5 transition-all duration-200 exam-question-card',
                              isHovered
                                ? 'border-brand-200 bg-brand-50/30 shadow-[0_2px_12px_-3px_rgba(99,102,241,0.1)]'
                                : 'border-transparent hover:border-neutral-100',
                              isRegen && 'opacity-50'
                            )}
                          >
                            {/* Regen overlay */}
                            {isRegen && (
                              <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10 rounded-xl">
                                <div className="flex items-center gap-2 text-[11px] font-bold text-brand-600">
                                  <RefreshCw size={14} className="animate-rotate-slow" />
                                  AI Synthesizing variant…
                                </div>
                              </div>
                            )}

                            {/* Action bar — appears on hover */}
                            <div className="absolute -top-4 right-3 hidden group-hover:flex items-center gap-1 bg-white border border-neutral-200 rounded-xl px-2 py-1 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.1)] z-20 no-print font-ui">
                              {/* AI confidence */}
                              <span
                                className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-violet-50 border border-violet-100 text-violet-700 text-[9px] font-extrabold cursor-help"
                                title={`AI Confidence: ${q.confidenceScore}%\nBloom's Tier: Application\nSyllabus: ${activeAssignment.grade}`}
                              >
                                <Brain size={9} />
                                {q.confidenceScore}%
                              </span>

                              {/* Calibrate dropdown */}
                              <div className="relative group/regen">
                                <button className="flex items-center gap-1 px-2 py-0.5 rounded-lg hover:bg-neutral-50 text-neutral-600 hover:text-brand-600 text-[9px] font-bold transition-colors">
                                  <Zap size={9} />
                                  Calibrate
                                  <ChevronDown size={8} />
                                </button>
                                <div className="absolute right-0 top-6 w-36 bg-white border border-neutral-100 rounded-xl shadow-[0_8px_24px_-4px_rgba(0,0,0,0.1)] py-1.5 hidden group-hover/regen:block z-30">
                                  {[
                                    { label: 'Make Easier', type: 'easier' as const },
                                    { label: 'Increase Rigor', type: 'harder' as const },
                                    { label: 'Rephrase', type: 'rephrase' as const },
                                  ].map((opt) => (
                                    <button
                                      key={opt.type}
                                      onClick={() => handleQuestionRegen(section.id, q, opt.type)}
                                      className="w-full text-left px-3 py-1.5 hover:bg-brand-50 text-[10px] font-semibold text-neutral-700 hover:text-brand-700 transition-colors"
                                    >
                                      {opt.label}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Edit */}
                              <button
                                onClick={() => handleInitEdit(q)}
                                className="p-1 rounded-lg hover:bg-neutral-50 text-neutral-500 hover:text-brand-600 transition-colors"
                                title="Edit question"
                              >
                                <Edit3 size={10} />
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => deleteQuestion(activeAssignment.id, section.id, q.id)}
                                className="p-1 rounded-lg hover:bg-red-50 text-neutral-500 hover:text-red-600 transition-colors"
                                title="Delete question"
                              >
                                <Trash2 size={10} />
                              </button>
                            </div>

                            {/* Marks label */}
                            <span className="float-right text-xs font-bold text-neutral-700 tracking-wide print-marks-label font-ui ml-2">
                              [{q.marks} {q.marks === 1 ? 'Mark' : 'Marks'}]
                            </span>

                            {/* Question body */}
                            <div className="space-y-2.5">
                              <div className="flex items-start gap-2.5">
                                <span className="font-black text-neutral-900 shrink-0 question-numbering font-ui text-sm">
                                  Q{q.index}.
                                </span>
                                <div className="flex-1 pr-16 leading-relaxed">
                                  {isEditing ? (
                                    <div className="space-y-2 no-print">
                                      <textarea
                                        value={editBufferText}
                                        onChange={(e) => setEditBufferText(e.target.value)}
                                        className="w-full p-2.5 border border-brand-300 rounded-lg text-sm text-neutral-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-400/40 resize-none"
                                        rows={3}
                                      />
                                      <div className="flex items-center gap-2">
                                        <button
                                          onClick={() => handleSaveEdit(q, section.id)}
                                          className="px-3 py-1 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-bold transition-colors"
                                        >
                                          Save
                                        </button>
                                        <button
                                          onClick={() => setEditingQuestionId(null)}
                                          className="px-3 py-1 border border-neutral-200 rounded-lg text-xs text-neutral-600 hover:bg-neutral-50 transition-colors"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <span
                                      className="cursor-pointer"
                                      onDoubleClick={() => handleInitEdit(q)}
                                      title="Double-click to edit"
                                    >
                                      {q.questionText}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* MCQ options */}
                              {q.questionType === 'MCQ' && q.options && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 pl-7 mt-1 text-xs">
                                  {q.options.map((opt, i) => (
                                    <div key={i} className="flex items-baseline gap-1.5 text-neutral-800">
                                      <span className="font-bold uppercase text-neutral-600">({String.fromCharCode(65 + i)})</span>
                                      <span>{opt}</span>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Source citation tag */}
                              {q.sourceCitation && isHovered && (
                                <div className="no-print mt-2 flex items-start gap-1.5 px-2.5 py-1.5 rounded-lg bg-brand-50 border border-brand-100 animate-fade-slide-up">
                                  <BookOpen size={10} className="text-brand-500 mt-0.5 shrink-0" />
                                  <span className="text-[10px] text-brand-700 font-semibold leading-snug">
                                    <span className="font-bold">Pg {q.sourceCitation.pageNumber}:</span>{' '}
                                    &ldquo;{q.sourceCitation.passageSnippet.substring(0, 80)}…&rdquo;
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Answer Key */}
              {includeAnswerKey && activeAssignment.sections.length > 0 && (
                <div className="border-t border-dashed border-neutral-300 mt-16 pt-8 space-y-4 page-break-before">
                  <h3 className="text-sm font-extrabold uppercase border-b-2 border-neutral-900 pb-1.5 tracking-widest text-neutral-950">
                    Assessment Answer Reference Sheet
                  </h3>
                  <div className="space-y-3 pl-4 text-xs font-ui">
                    {activeAssignment.sections.flatMap((s) => s.questions).map((q) => (
                      <div key={q.id} className="flex items-start gap-3">
                        <span className="font-bold text-neutral-900 shrink-0">Q{q.index}.</span>
                        <div>
                          {q.questionType === 'MCQ' ? (
                            <p className="font-bold text-brand-600">Correct Option: (A)</p>
                          ) : (
                            <p className="text-neutral-500 italic leading-relaxed">
                              [Model Answer] Evaluate student&apos;s understanding as per syllabus. Reference:{' '}
                              <span className="text-neutral-700">{q.sourceCitation?.passageSnippet?.substring(0, 60) || 'Ingested material'}…</span>
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
