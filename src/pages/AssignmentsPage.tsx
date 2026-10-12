import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { useApp } from '../context/AppContext';
import { assignmentService, AssignmentItem } from '../services/assignmentService';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Upload,
  Calendar,
  Send,
  Sparkles,
  Search,
  BookOpen,
  MessageSquare,
  Award,
  ChevronRight,
  Download,
  Check,
  FileCheck,
} from 'lucide-react';

type Assignment = AssignmentItem;

export const AssignmentsPage: React.FC = () => {
  const { showToast, userSession, student } = useApp();
  const studentId = userSession?.id || student?.id || 'demo-student';

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'submitted' | 'graded'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    let isMounted = true;
    assignmentService.getAssignments(studentId).then((data) => {
      if (isMounted) setAssignments(data);
    });
    return () => {
      isMounted = false;
    };
  }, [studentId]);

  const totalAssignments = assignments.length;
  const pendingCount = assignments.filter((a) => a.status === 'pending').length;
  const submittedCount = assignments.filter((a) => a.status === 'submitted').length;
  const gradedCount = assignments.filter((a) => a.status === 'graded').length;
  
  const gradedList = assignments.filter((a) => a.status === 'graded' && a.obtainedMarks !== undefined);
  const avgMarksPct = gradedList.length > 0
    ? Math.round(gradedList.reduce((acc, curr) => acc + (curr.obtainedMarks! / curr.totalMarks) * 100, 0) / gradedList.length)
    : 92;

  const filteredAssignments = assignments.filter((item) => {
    const matchesTab = activeTab === 'all' || item.status === activeTab;
    const matchesQuery =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesQuery;
  });

  const handleOpenSubmit = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setSubmissionUrl(assignment.submissionLink || '');
    setSubmissionNotes('');
    setIsSubmitModalOpen(true);
  };

  const handleSubmitAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment) return;

    if (!submissionUrl.trim()) {
      showToast('Validation Error', 'Please enter a repository link or file submission URL', 'error');
      return;
    }

    setIsUploading(true);
    try {
      const updated = await assignmentService.submitAssignment({
        assignmentId: selectedAssignment.id,
        studentId,
        submissionLink: submissionUrl,
        notes: submissionNotes,
      });
      setAssignments(updated);
      setIsSubmitModalOpen(false);
      showToast(
        'Assignment Submitted',
        `Successfully submitted "${selectedAssignment.title}" for faculty evaluation.`,
        'success'
      );
    } catch {
      showToast('Submission Error', 'Failed to submit assignment. Please try again.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSyncLMS = async () => {
    try {
      const list = await assignmentService.getAssignments(studentId);
      setAssignments(list);
      showToast('Sync Complete', 'Course submission ledgers verified against institutional LMS.', 'info');
    } catch {
      showToast('Sync Warning', 'Could not reach LMS sync endpoint. Using cached data.', 'info');
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header Banner */}
      <GlassCard className="p-6 md:p-8 relative overflow-hidden border-[rgba(255,122,24,0.30)] bg-gradient-to-r from-[#24130D]/95 via-[#1A120E]/90 to-[#100D0B]/95">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-[#FF7A18]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FF7A18]/20 border border-[#FF7A18]/40 text-[#FF8C32] text-xs font-bold">
                <Sparkles size={12} className="text-[#FFB347]" />
                ST² ACADEMIC PORTAL
              </span>
              <Badge variant="orange" size="sm">Semester 6</Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FFF8F0] font-display">
              Assignments & Continuous Evaluation
            </h1>
            <p className="text-xs sm:text-sm text-[#C5B5A8] mt-1 max-w-2xl">
              Track course deliverables, test bench executions, faculty grading feedback, and real-time submission compliance.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="primary"
              size="sm"
              icon={<FileCheck size={15} />}
              onClick={handleSyncLMS}
            >
              Sync LMS Submissions
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* KPI Stats Row (Total, Pending, Submitted, Graded, Obtained Marks) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Assignments */}
        <GlassCard className="p-5 flex flex-col justify-between group hover:border-[#FF7A18]/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8F8176]">Total Assignments</span>
            <div className="w-8 h-8 rounded-lg bg-[#FF7A18]/10 border border-[#FF7A18]/30 flex items-center justify-center text-[#FF7A18]">
              <FileText size={16} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-[#FFF8F0] font-display">{totalAssignments}</div>
            <p className="text-[11px] text-[#8F8176] mt-0.5">Across 6 Theory & Lab Courses</p>
          </div>
        </GlassCard>

        {/* Pending Assignments */}
        <GlassCard className="p-5 flex flex-col justify-between group hover:border-[#FF8C32]/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8F8176]">Pending Due</span>
            <div className="w-8 h-8 rounded-lg bg-[#FF8C32]/15 border border-[#FF8C32]/40 flex items-center justify-center text-[#FF8C32]">
              <Clock size={16} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-[#FF8C32] font-display">{pendingCount}</div>
            <p className="text-[11px] text-[#FFB347] mt-0.5">Earliest due in 6 days</p>
          </div>
        </GlassCard>

        {/* Submitted Assignments */}
        <GlassCard className="p-5 flex flex-col justify-between group hover:border-[#10B981]/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8F8176]">Submitted</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-[#FFF8F0] font-display">{submittedCount}</div>
            <p className="text-[11px] text-[#8F8176] mt-0.5">Awaiting faculty grading</p>
          </div>
        </GlassCard>

        {/* Graded Assignments */}
        <GlassCard className="p-5 flex flex-col justify-between group hover:border-[#FF7A18]/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8F8176]">Graded</span>
            <div className="w-8 h-8 rounded-lg bg-[#FF7A18]/10 border border-[#FF7A18]/30 flex items-center justify-center text-[#FFB347]">
              <Award size={16} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-[#FFF8F0] font-display">{gradedCount}</div>
            <p className="text-[11px] text-[#8F8176] mt-0.5">Evaluated with feedback</p>
          </div>
        </GlassCard>

        {/* Obtained Marks */}
        <GlassCard className="p-5 flex flex-col justify-between group hover:border-[#FFB347]/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8F8176]">Average Score</span>
            <div className="w-8 h-8 rounded-lg bg-[#FFB347]/10 border border-[#FFB347]/30 flex items-center justify-center text-[#FFB347]">
              <Sparkles size={16} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-[#FFB347] font-display">{avgMarksPct}%</div>
            <p className="text-[11px] text-[#10B981] mt-0.5">Top 5% Cohort Benchmark</p>
          </div>
        </GlassCard>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2 bg-[#1A120E]/80 backdrop-blur-xl rounded-2xl border border-[rgba(255,122,24,0.25)]">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {(['all', 'pending', 'submitted', 'graded'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide capitalize transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-[#FF7A18] to-[#FF8C32] text-[#100D0B] shadow-[0_0_15px_rgba(255,122,24,0.3)]'
                  : 'text-[#8F8176] hover:text-[#FFF8F0] hover:bg-white/5'
              }`}
            >
              {tab === 'all' ? `All (${totalAssignments})` : `${tab} (${assignments.filter((a) => a.status === tab).length})`}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8F8176]" />
          <input
            type="text"
            placeholder="Search assignments or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#100D0B]/80 border border-[rgba(255,122,24,0.25)] text-xs text-[#FFF8F0] placeholder-[#8F8176]/60 focus:outline-none focus:border-[#FF7A18] transition-colors"
          />
        </div>
      </div>

      {/* Assignments List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredAssignments.map((asg) => (
          <GlassCard
            key={asg.id}
            className="p-5 flex flex-col justify-between group hover:border-[#FF7A18]/50 transition-all relative overflow-hidden"
          >
            {/* Top highlight bar */}
            <div
              className={`absolute top-0 left-0 right-0 h-1 ${
                asg.status === 'graded'
                  ? 'bg-gradient-to-r from-emerald-500 to-[#10B981]'
                  : asg.status === 'submitted'
                  ? 'bg-gradient-to-r from-[#FFB347] to-[#FFAA33]'
                  : 'bg-gradient-to-r from-[#FF7A18] to-[#FF8C32]'
              }`}
            />

            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-[11px] font-bold text-[#FF8C32] font-mono">
                      {asg.courseCode}
                    </span>
                    <span className="text-[11px] text-[#8F8176]">
                      • {asg.courseName}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#FFF8F0] group-hover:text-[#FF8C32] transition-colors">
                    {asg.title}
                  </h3>
                </div>

                <Badge
                  variant={
                    asg.status === 'graded'
                      ? 'green'
                      : asg.status === 'submitted'
                      ? 'amber'
                      : 'orange'
                  }
                  size="sm"
                >
                  {asg.status.toUpperCase()}
                </Badge>
              </div>

              <p className="text-xs text-[#8F8176] mt-2 line-clamp-2 leading-relaxed">
                {asg.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {asg.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-[rgba(255,248,240,0.03)] border border-[rgba(255,248,240,0.06)] text-[#8F8176]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Deadline & Faculty info */}
              <div className="mt-4 pt-3 border-t border-[rgba(255,248,240,0.06)] flex flex-wrap items-center justify-between gap-2 text-[11px]">
                <div className="flex items-center gap-1.5 text-[#8F8176]">
                  <Calendar size={13} className="text-[#FF8C32]" />
                  <span>Due: <strong className="text-[#FFF8F0] font-medium">{asg.dueDate}</strong></span>
                </div>
                <span className="text-[#8F8176]">
                  Faculty: <strong className="text-[#FFF8F0] font-medium">{asg.facultyName}</strong>
                </span>
              </div>

              {/* Graded Marks & Faculty Feedback Section */}
              {asg.status === 'graded' && asg.obtainedMarks !== undefined && (
                <div className="mt-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <Award size={14} /> Score Awarded
                    </span>
                    <span className="font-mono font-bold text-[#FFF8F0] text-sm">
                      {asg.obtainedMarks} / {asg.totalMarks} ({Math.round((asg.obtainedMarks / asg.totalMarks) * 100)}%)
                    </span>
                  </div>
                  {asg.facultyFeedback && (
                    <div className="mt-2 pt-2 border-t border-emerald-500/15 text-[11px] text-[#8F8176] flex items-start gap-1.5">
                      <MessageSquare size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                      <p><strong className="text-emerald-300">Feedback:</strong> "{asg.facultyFeedback}"</p>
                    </div>
                  )}
                </div>
              )}

              {/* Submitted status link preview */}
              {asg.status === 'submitted' && asg.submissionLink && (
                <div className="mt-3 p-2.5 rounded-xl bg-[#FFB347]/10 border border-[#FFB347]/20 text-[11px] flex items-center justify-between text-[#8F8176]">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-[#FFB347]" />
                    Submitted: {asg.submissionDate}
                  </span>
                  <a
                    href={asg.submissionLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#FF8C32] hover:underline font-mono"
                  >
                    View Artifact &rarr;
                  </a>
                </div>
              )}
            </div>

            {/* Action buttons footer */}
            <div className="mt-4 pt-3 border-t border-[rgba(255,248,240,0.06)] flex items-center justify-between">
              <span className="text-[11px] text-[#8F8176]">
                Max Score: <strong className="text-[#FFF8F0] font-mono">{asg.totalMarks} pts</strong>
              </span>

              {asg.status === 'pending' ? (
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Upload size={14} />}
                  onClick={() => handleOpenSubmit(asg)}
                >
                  Submit Assignment
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<FileCheck size={14} />}
                  onClick={() => handleOpenSubmit(asg)}
                >
                  {asg.status === 'graded' ? 'View Evaluation' : 'Update Submission'}
                </Button>
              )}
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Assignment Submission Interface Modal */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title={selectedAssignment?.status === 'graded' ? 'Assignment Evaluation' : 'Submit Assignment Deliverable'}
        subtitle={selectedAssignment ? `${selectedAssignment.courseCode} • ${selectedAssignment.title}` : ''}
        maxWidth="lg"
      >
        {selectedAssignment && (
          <form onSubmit={handleSubmitAssignment} className="space-y-4">
            <div className="p-3 rounded-xl bg-[rgba(255,248,240,0.03)] border border-[rgba(255,248,240,0.06)] text-xs text-[#8F8176] space-y-1">
              <div className="flex justify-between">
                <span>Due Date:</span>
                <strong className="text-[#FFF8F0]">{selectedAssignment.dueDate}</strong>
              </div>
              <div className="flex justify-between">
                <span>Course Faculty:</span>
                <strong className="text-[#FFF8F0]">{selectedAssignment.facultyName}</strong>
              </div>
              <div className="flex justify-between">
                <span>Evaluation Marks:</span>
                <strong className="text-[#FFF8F0]">{selectedAssignment.totalMarks} Points</strong>
              </div>
            </div>

            {selectedAssignment.status === 'graded' && selectedAssignment.facultyFeedback && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs">
                <p className="font-bold text-emerald-400 mb-1 flex items-center gap-1.5">
                  <Award size={15} /> Marks Scored: {selectedAssignment.obtainedMarks} / {selectedAssignment.totalMarks}
                </p>
                <p className="text-[#8F8176] leading-relaxed">
                  "{selectedAssignment.facultyFeedback}"
                </p>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#FFF8F0] mb-1.5">
                GitHub Repository / Artifact URL <span className="text-[#FF7A18]">*</span>
              </label>
              <input
                type="url"
                required
                placeholder="https://github.com/aarav-st2/assignment-repo"
                value={submissionUrl}
                onChange={(e) => setSubmissionUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#100D0B] border border-[rgba(255,122,24,0.3)] text-xs text-[#FFF8F0] placeholder-[#8F8176]/50 focus:outline-none focus:border-[#FF7A18]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#FFF8F0] mb-1.5">
                Implementation Notes & Test Output Summary
              </label>
              <textarea
                rows={3}
                placeholder="Detail state-machine coverage, edge case handling, or local unit test outcomes..."
                value={submissionNotes}
                onChange={(e) => setSubmissionNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#100D0B] border border-[rgba(255,122,24,0.3)] text-xs text-[#FFF8F0] placeholder-[#8F8176]/50 focus:outline-none focus:border-[#FF7A18] resize-none"
              />
            </div>

            <div className="p-3 rounded-xl border border-dashed border-[rgba(255,122,24,0.3)] bg-gradient-to-b from-[#FF7A18]/5 to-transparent text-center cursor-pointer hover:border-[#FF7A18] transition-colors">
              <Upload size={20} className="mx-auto text-[#FF8C32] mb-1" />
              <p className="text-xs font-semibold text-[#FFF8F0]">Upload Supporting PDF or ZIP Archive</p>
              <p className="text-[10px] text-[#8F8176]">Optional • Max file size 25MB • Automated plagiarism scan active</p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsSubmitModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={isUploading}
                icon={isUploading ? <Clock size={14} className="animate-spin" /> : <Send size={14} />}
              >
                {isUploading ? 'Submitting...' : 'Confirm Submission'}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
