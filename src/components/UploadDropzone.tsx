"use client";

import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Trash2,
  File,
  Sparkles,
} from 'lucide-react';
import { clsx } from 'clsx';

interface UploadDropzoneProps {
  onFileAccepted: (fileName: string, excerpt: string) => void;
  onFileCleared: () => void;
}

const MOCK_EXCERPT =
  "A vehicle accelerates uniformly from rest to a speed of 20 m/s over a distance of 100 meters. Kinematics describes the motion of points, bodies, and systems of bodies without consideration of the forces that cause the motion. Velocity is a vector quantity expressing speed and direction. Speed is purely scalar. Acceleration measures velocity change over time. Uniform acceleration formulas apply to constant velocity rates.";

const FILE_ICONS: Record<string, React.ReactNode> = {
  pdf:  <FileText size={28} className="text-red-500" />,
  docx: <File     size={28} className="text-blue-500" />,
  txt:  <File     size={28} className="text-neutral-500" />,
};

export default function UploadDropzone({ onFileAccepted, onFileCleared }: UploadDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'completed' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string; ext: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = () => setIsDragOver(false);

  const processFile = (file: File) => {
    const supported = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ];
    const extMatch = file.name.match(/\.(pdf|docx|txt)$/i);
    const ext = extMatch ? extMatch[1].toLowerCase() : '';

    if (!supported.includes(file.type) && !extMatch) {
      setUploadState('error');
      setErrorMessage('Unsupported file format. Please upload PDF, DOCX, or TXT materials.');
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setUploadState('error');
      setErrorMessage('File exceeds the 50MB limit. Please compress and retry.');
      return;
    }

    setUploadState('uploading');
    setProgress(0);
    setUploadedFile({
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      ext,
    });

    let cur = 0;
    const iv = setInterval(() => {
      cur += Math.random() * 12 + 8;
      if (cur >= 100) {
        cur = 100;
        clearInterval(iv);
        setProgress(100);
        setTimeout(() => {
          setUploadState('completed');
          onFileAccepted(file.name, MOCK_EXCERPT);
        }, 300);
      }
      setProgress(Math.round(cur));
    }, 140);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) processFile(e.target.files[0]);
  };

  const clearFile = () => {
    setUploadState('idle');
    setProgress(0);
    setUploadedFile(null);
    setErrorMessage('');
    onFileCleared();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-3 font-ui">
      <div className="flex items-center gap-1.5 mb-3">
        <UploadCloud size={13} className="text-brand-500" />
        <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">
          Source Material Ingestion
        </label>
      </div>

      {/* ── Idle: drag & drop area ── */}
      {uploadState === 'idle' && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={clsx(
            'relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 group overflow-hidden',
            isDragOver
              ? 'border-brand-500 bg-brand-500/5 shadow-[0_0_0_4px_rgba(249,115,22,0.08)]'
              : 'border-neutral-400 hover:border-brand-500 hover:bg-brand-500/5'
          )}
          style={{
            backgroundImage: isDragOver
              ? 'radial-gradient(circle at 50% 50%, rgba(249,115,22,0.04) 0%, transparent 70%)'
              : undefined
          }}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.docx,.txt"
            className="hidden"
            aria-label="Upload source materials for assignment generation"
          />

          {/* Icon cluster */}
          <div className="relative mb-4">
            <div className={clsx(
              'w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300',
              isDragOver
                ? 'bg-brand-500/10 scale-110 shadow-[0_0_20px_rgba(249,115,22,0.2)]'
                : 'bg-neutral-100 group-hover:bg-brand-500/10 group-hover:scale-105'
            )}>
              <UploadCloud size={26} className={isDragOver ? 'text-brand-500' : 'text-neutral-700 group-hover:text-brand-500'} />
            </div>
            {isDragOver && (
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center animate-bounce">
                <span className="text-white text-[9px] font-black">+</span>
              </div>
            )}
          </div>

          <p className="text-sm font-bold text-neutral-900 mb-1">
            {isDragOver ? 'Release to upload' : 'Drag & drop your source material'}
          </p>
          <p className="text-xs text-neutral-700 font-medium">
            PDF, DOCX, or TXT &mdash; up to 50MB
          </p>

          {/* File type badges */}
          <div className="flex items-center gap-2 mt-4">
            {['PDF', 'DOCX', 'TXT'].map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 rounded-md bg-neutral-100 border border-neutral-300 text-[9px] font-black text-neutral-700 uppercase tracking-wider"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Uploading ── */}
      {uploadState === 'uploading' && (
        <div className="border border-neutral-300 rounded-2xl p-5 bg-neutral-200 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center shrink-0">
              {FILE_ICONS[uploadedFile?.ext || 'pdf'] || <FileText size={20} className="text-brand-500" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-neutral-900 truncate">{uploadedFile?.name}</p>
              <p className="text-xs text-neutral-700 font-medium mt-0.5">
                {uploadedFile?.size} &bull; Uploading &amp; OCR Parsing…
              </p>
            </div>
            <span className="text-sm font-black text-brand-500 tabular-nums shrink-0">{progress}%</span>
          </div>

          {/* Progress bar */}
          <div className="relative w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-brand-500 to-semantic-ai rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
            <div
              className="absolute top-0 h-full w-20 animate-shimmer rounded-full"
              style={{ left: `${Math.max(0, progress - 15)}%` }}
            />
          </div>

          {/* Stage labels */}
          <div className="flex justify-between mt-2">
            {['Uploading', 'OCR Engine', 'Concept Map'].map((label, i) => (
              <span
                key={label}
                className={clsx(
                  'text-[9px] font-bold uppercase tracking-wider transition-colors',
                  progress >= (i + 1) * 33 ? 'text-brand-500' : 'text-neutral-300'
                )}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Completed ── */}
      {uploadState === 'completed' && (
        <div className="border border-emerald-500/20 rounded-2xl p-5 bg-emerald-500/5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <CheckCircle2 size={20} className="text-emerald-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-neutral-900 truncate max-w-[200px]">
                  {uploadedFile?.name}
                </p>
                <p className="text-xs text-neutral-700 mt-0.5 font-medium">
                  {uploadedFile?.size}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-extrabold uppercase tracking-wider">
                    <CheckCircle2 size={9} />
                    OCR Parsed
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-500 text-[9px] font-extrabold uppercase tracking-wider">
                    <Sparkles size={9} />
                    AI Ready
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={clearFile}
              className="p-1.5 rounded-lg text-neutral-700 hover:text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
              title="Remove file"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ── Error ── */}
      {uploadState === 'error' && (
        <div className="border border-red-500/20 rounded-2xl p-5 bg-red-500/5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
              <AlertCircle size={20} className="text-red-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-red-400">Ingestion Error</p>
              <p className="text-xs text-red-400 mt-1 font-medium leading-snug">{errorMessage}</p>
              <button
                onClick={clearFile}
                className="mt-3 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-xs rounded-lg border border-red-500/20 transition-all"
              >
                Clear &amp; Retry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
