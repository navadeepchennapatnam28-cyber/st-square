import React, { useState } from 'react';
import { CodingProblem, CodeApproach } from '../../types';
import { GlassCard } from '../ui/GlassCard';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  Play,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Terminal,
  Code2,
  Clock,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';
import { codingService } from '../../services/codingService';
import { useApp } from '../../context/AppContext';

interface CodeWorkspaceProps {
  problem: CodingProblem;
  onStatusChange?: () => void;
}

export const CodeWorkspace: React.FC<CodeWorkspaceProps> = ({ problem, onStatusChange }) => {
  const { showToast } = useApp();
  const [selectedApproachIndex, setSelectedApproachIndex] = useState(0);
  const [approachLanguage, setApproachLanguage] = useState<'python' | 'java' | 'cpp'>('python');
  
  // Code Editor state
  const [editorLanguage, setEditorLanguage] = useState<'python' | 'java' | 'cpp'>('python');
  const [editorCode, setEditorCode] = useState(problem.starterCode.python);
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [testResult, setTestResult] = useState<{
    status: 'Accepted' | 'Wrong Answer' | 'Compile Error';
    runtimeMs: number;
    memoryMb: number;
    passedTests: number;
    totalTests: number;
    output: string;
    message: string;
  } | null>(null);

  const activeApproach: CodeApproach = problem.approaches[selectedApproachIndex] || problem.approaches[0];

  const handleLanguageChange = (lang: 'python' | 'java' | 'cpp') => {
    setEditorLanguage(lang);
    setEditorCode(problem.starterCode[lang] || '');
  };

  const handleCopySnippet = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Copied to Clipboard', 'Algorithm implementation copied.', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    try {
      const result = await codingService.runCodeDemo(editorCode, editorLanguage, problem);
      setTestResult(result);
      if (result.status === 'Accepted') {
        showToast('Demo Run Successful', `${result.passedTests}/${result.totalTests} sample test cases passed!`, 'success');
      } else {
        showToast('Test Cases Failed', result.message, 'error');
      }
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitSolution = async () => {
    setIsRunning(true);
    try {
      const result = await codingService.runCodeDemo(editorCode, editorLanguage, problem);
      setTestResult(result);
      if (result.status === 'Accepted') {
        await codingService.markProblemSolved(problem.id);
        showToast(
          'Solution Submitted & Accepted!',
          `Awesome job! Solved "${problem.title}". ST Point score updated.`,
          'success'
        );
        if (onStatusChange) onStatusChange();
      } else {
        showToast('Submission Rejected', 'One or more edge cases failed. Review approaches.', 'error');
      }
    } finally {
      setIsRunning(false);
    }
  };

  const difficultyVariant = {
    Easy: 'green',
    Medium: 'orange',
    Hard: 'rose',
  } as const;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      {/* Left Column: Problem Details & Multi-Approaches (7 cols) */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* Problem Description Card */}
        <GlassCard variant="default" className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <Badge variant={difficultyVariant[problem.difficulty]}>
                {problem.difficulty}
              </Badge>
              <span className="text-xs font-mono font-medium text-[#8F8176] bg-[rgba(255,248,240,0.05)] px-2.5 py-0.5 rounded-full border border-[rgba(255,248,240,0.06)]">
                {problem.topic}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-[#8F8176]">
              <span>Acceptance: <strong className="text-[#FFF8F0] font-mono">{problem.acceptanceRate}</strong></span>
              {problem.solved && (
                <span className="text-[#10B981] font-semibold flex items-center gap-1">
                  <CheckCircle2 size={13} /> Solved
                </span>
              )}
            </div>
          </div>

          <h1 className="text-2xl font-extrabold text-[#FFF8F0] font-display mb-3">
            {problem.title}
          </h1>

          <div className="text-sm text-[#C5B5A8] leading-relaxed whitespace-pre-line mb-6">
            {problem.description}
          </div>

          {/* Sample Cases */}
          <div className="space-y-3 mb-6">
            <h4 className="text-xs font-bold text-[#FF8C32] uppercase tracking-wider">
              Sample Test Cases
            </h4>
            {problem.sampleCases.map((tc, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-[#1A120E] border border-[rgba(255,122,24,0.20)] font-mono text-xs space-y-1.5">
                <p className="text-[#8F8176]">
                  <strong className="text-[#FFF8F0]">Input: </strong> {tc.input}
                </p>
                <p className="text-[#8F8176]">
                  <strong className="text-[#FFF8F0]">Output: </strong>
                  <span className="text-[#FFB347] font-semibold">{tc.output}</span>
                </p>
                {tc.explanation && (
                  <p className="text-[#8F8176]/80 text-[11px] font-sans pt-1 border-t border-[rgba(255,248,240,0.06)]">
                    {tc.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Constraints */}
          <div className="mb-6">
            <h4 className="text-xs font-bold text-[#8F8176] uppercase tracking-wider mb-2">
              Constraints
            </h4>
            <ul className="space-y-1">
              {problem.constraints.map((c, idx) => (
                <li key={idx} className="text-xs text-[#8F8176] font-mono flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A18]" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Hints Accordion */}
          {problem.hints && problem.hints.length > 0 && (
            <div className="p-4 rounded-xl bg-[#FF7A18]/10 border border-[#FF7A18]/25">
              <h4 className="text-xs font-bold text-[#FF7A18] flex items-center gap-1.5 mb-2">
                <Sparkles size={14} className="text-[#FF8C32]" /> Algorithmic Hints
              </h4>
              <ul className="space-y-1.5">
                {problem.hints.map((h, i) => (
                  <li key={i} className="text-xs text-[#8F8176] flex items-start gap-2">
                    <span className="text-[#FF8C32] font-bold shrink-0">{i + 1}.</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </GlassCard>

        {/* MULTIPLE APPROACHES SECTION (Kadane, Improved, Brute Force) */}
        <GlassCard variant="default" className="p-6 border-l-2 border-l-[#FF7A18]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#FF7A18]" />
              <h3 className="text-lg font-bold text-[#FFF8F0] font-display">
                Multi-Approach Analysis
              </h3>
            </div>
            <span className="text-xs text-[#8F8176]">
              {problem.approaches.length} Solved Variations
            </span>
          </div>

          {/* Approach Switcher Tabs */}
          <div className="flex flex-wrap gap-2 mb-5">
            {problem.approaches.map((app, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedApproachIndex(idx)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedApproachIndex === idx
                    ? 'bg-gradient-to-r from-[#FF7A18] to-[#FF8C32] text-[#100D0B] font-bold shadow-md shadow-[#FF7A18]/25'
                    : 'bg-[#1A120E] text-[#8F8176] hover:text-[#FFF8F0] border border-[rgba(255,122,24,0.20)]'
                }`}
              >
                {app.name}
              </button>
            ))}
          </div>

          {/* Active Approach Details */}
          <div className="p-4 rounded-xl bg-[#1A120E]/85 border border-[rgba(255,122,24,0.15)] mb-4">
            <h4 className="text-sm font-bold text-[#FFF8F0] mb-2">
              {activeApproach.name}
            </h4>
            <p className="text-xs text-[#8F8176] leading-relaxed mb-4">
              {activeApproach.explanation}
            </p>

            {/* Algorithm Steps */}
            <div className="mb-4">
              <h5 className="text-[11px] font-bold text-[#FF8C32] uppercase tracking-wider mb-2">
                Algorithm Steps:
              </h5>
              <ol className="space-y-1.5">
                {activeApproach.algorithmSteps.map((step, idx) => (
                  <li key={idx} className="text-xs text-[#8F8176] flex items-start gap-2">
                    <span className="text-[#FF8C32] font-mono font-bold shrink-0">{idx + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Complexity Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[rgba(255,248,240,0.06)]">
              <div className="p-2.5 rounded-lg bg-[rgba(255,248,240,0.03)] border border-[rgba(255,248,240,0.06)]">
                <p className="text-[10px] uppercase font-bold text-[#8F8176]">Time Complexity</p>
                <p className="text-xs font-mono font-bold text-[#FF8C32] mt-0.5">{activeApproach.timeComplexity}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-[rgba(255,248,240,0.03)] border border-[rgba(255,248,240,0.06)]">
                <p className="text-[10px] uppercase font-bold text-[#8F8176]">Space Complexity</p>
                <p className="text-xs font-mono font-bold text-[#FFB347] mt-0.5">{activeApproach.spaceComplexity}</p>
              </div>
            </div>
          </div>

          {/* Code Snippet for Selected Approach with Language Switcher */}
          <div className="rounded-xl bg-[#100D0B] border border-[rgba(255,122,24,0.20)] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#1A120E]/90 border-b border-[rgba(255,248,240,0.06)]">
              <div className="flex items-center gap-2">
                {(['python', 'java', 'cpp'] as const).map(lang => (
                  <button
                    key={lang}
                    onClick={() => setApproachLanguage(lang)}
                    className={`px-2.5 py-1 rounded-md text-xs font-mono font-semibold uppercase transition-all cursor-pointer ${
                      approachLanguage === lang
                        ? 'bg-[#FF7A18]/20 text-[#FF8C32] border border-[#FF7A18]/40'
                        : 'text-[#8F8176] hover:text-[#FFF8F0]'
                    }`}
                  >
                    {lang === 'cpp' ? 'C++' : lang}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handleCopySnippet(activeApproach.codeSnippets[approachLanguage])}
                className="text-xs text-[#8F8176] hover:text-[#FFF8F0] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? <Check size={14} className="text-[#10B981]" /> : <Copy size={14} />}
                <span>{copied ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>

            <pre className="p-4 text-xs font-mono text-[#FFF8F0] overflow-x-auto leading-relaxed max-h-80">
              <code>{activeApproach.codeSnippets[approachLanguage]}</code>
            </pre>
          </div>
        </GlassCard>
      </div>

      {/* Right Column: Interactive Code Editor & Test Runner (5 cols) */}
      <div className="lg:col-span-5 sticky top-24 space-y-4">
        <GlassCard variant="default" className="p-5">
          {/* Editor Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[rgba(255,248,240,0.10)] mb-3">
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-[#FF7A18]" />
              <h3 className="text-sm font-bold text-[#FFF8F0] font-display">Code Practice Sandbox</h3>
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[#100D0B] border border-[rgba(255,122,24,0.20)]">
              {(['python', 'java', 'cpp'] as const).map(lang => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono uppercase font-semibold transition-all ${
                    editorLanguage === lang
                      ? 'bg-gradient-to-r from-[#FF7A18] to-[#FF8C32] text-[#100D0B] font-bold shadow-sm'
                      : 'text-[#8F8176] hover:text-[#FFF8F0]'
                  }`}
                >
                  {lang === 'cpp' ? 'C++' : lang}
                </button>
              ))}
            </div>
          </div>

          {/* Sandbox Notice */}
          <div className="p-2.5 rounded-xl bg-[#FF7A18]/10 border border-[#FF7A18]/25 text-[#FFB347] text-[11px] flex items-start gap-2 mb-3">
            <Info size={14} className="shrink-0 mt-0.5 text-[#FF7A18]" />
            <span>
              <strong>ST² Sandbox:</strong> Code execution simulates assertions against local test cases with sub-second feedback.
            </span>
          </div>

          {/* Code Editor Textarea */}
          <div className="relative rounded-xl bg-[#100D0B] border border-[rgba(255,122,24,0.25)] overflow-hidden font-mono text-xs">
            <textarea
              value={editorCode}
              onChange={(e) => setEditorCode(e.target.value)}
              rows={16}
              spellCheck={false}
              className="w-full p-4 bg-transparent text-[#FFF8F0] font-mono text-xs resize-none focus:outline-none focus:ring-1 focus:ring-[#FF7A18]/60 leading-relaxed selection:bg-[#FF7A18]/30"
              placeholder="Write your solution here..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-3 mt-4">
            <button
              onClick={() => setEditorCode(problem.starterCode[editorLanguage])}
              className="text-xs text-[#8F8176] hover:text-[#FFF8F0] underline cursor-pointer"
            >
              Reset Code
            </button>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleRunCode}
                isLoading={isRunning}
                icon={<Play size={14} />}
              >
                Run Code
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSubmitSolution}
                isLoading={isRunning}
                icon={<CheckCircle2 size={14} />}
              >
                Submit Solution
              </Button>
            </div>
          </div>
        </GlassCard>

        {/* Live Test Results Console */}
        {testResult && (
          <GlassCard variant="default" className="p-5 animate-in fade-in">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#FF7A18]" />
                <h4 className="text-xs font-bold text-[#FFF8F0] font-mono uppercase tracking-wider">
                  Execution Output
                </h4>
              </div>

              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  testResult.status === 'Accepted'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}
              >
                {testResult.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              <div className="p-2 rounded-lg bg-[rgba(255,248,240,0.02)] border border-[rgba(255,248,240,0.06)]">
                <span className="text-[#8F8176]">Runtime: </span>
                <span className="text-[#FFF8F0] font-mono font-bold">{testResult.runtimeMs} ms</span>
              </div>
              <div className="p-2 rounded-lg bg-[rgba(255,248,240,0.02)] border border-[rgba(255,248,240,0.06)]">
                <span className="text-[#8F8176]">Memory: </span>
                <span className="text-[#FFF8F0] font-mono font-bold">{testResult.memoryMb} MB</span>
              </div>
            </div>

            <pre className="p-3 rounded-lg bg-[#100D0B] border border-[rgba(255,122,24,0.20)] text-[11px] font-mono text-[#8F8176] whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto">
              {testResult.output}
            </pre>
          </GlassCard>
        )}
      </div>

    </div>
  );
};
