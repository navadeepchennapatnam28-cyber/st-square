import { useState, useEffect, useCallback } from 'react';
import { MockInterview } from '../types/mockInterview.types';
import { mockInterviewService } from '../services/mockInterviewService';
import { useApp } from '../../../context/AppContext';

export const useInterviewHistory = () => {
  const { student, showToast } = useApp();
  const [interviews, setInterviews] = useState<MockInterview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'completed' | 'in_progress'>('all');

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await mockInterviewService.listInterviews(student.id);
      setInterviews(data);
    } catch {
      showToast('Error', 'Failed to retrieve mock interview records', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [student.id, showToast]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleDelete = async (interviewId: string) => {
    try {
      await mockInterviewService.deleteInterview(interviewId, student.id);
      setInterviews((prev) => prev.filter((i) => i.id !== interviewId));
      showToast('Interview Deleted', 'Record and telemetry successfully purged.', 'info');
    } catch {
      showToast('Error', 'Could not delete interview record.', 'error');
    }
  };

  const filteredInterviews = interviews.filter((item) => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  // Analytics stats
  const completedSessions = interviews.filter((i) => i.status === 'completed');
  const inProgressSessions = interviews.filter((i) => i.status === 'in_progress');
  const avgOverallScore =
    completedSessions.length > 0
      ? Math.round(
          completedSessions.reduce((acc, curr) => acc + (curr.overall_score || 0), 0) /
            completedSessions.length
        )
      : 0;

  return {
    interviews: filteredInterviews,
    allInterviews: interviews,
    isLoading,
    filter,
    setFilter,
    refreshHistory: fetchHistory,
    deleteInterview: handleDelete,
    stats: {
      total: interviews.length,
      completedCount: completedSessions.length,
      inProgressCount: inProgressSessions.length,
      avgScore: avgOverallScore,
      latestInProgress: inProgressSessions[0] || null,
    },
  };
};
