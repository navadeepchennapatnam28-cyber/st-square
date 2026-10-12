import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldAlert,
  Loader2,
} from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { InterviewReport } from '../../features/mock-interview/components/InterviewReport';
import { CompleteInterviewSessionData } from '../../features/mock-interview/types/mockInterview.types';
import { mockInterviewService } from '../../features/mock-interview/services/mockInterviewService';
import { useApp } from '../../context/AppContext';

export const MockInterviewReportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { student } = useApp();

  const [sessionData, setSessionData] = useState<CompleteInterviewSessionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await mockInterviewService.getSessionData(id, student.id);
        if (!data) {
          setError('Interview report not found or you are not authorized to view this record.');
        } else {
          setSessionData(data);
        }
      } catch {
        setError('Failed to fetch interview report.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id, student.id]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center animate-in fade-in">
        <div className="w-10 h-10 border-3 border-[#FF7A18] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <h3 className="text-base font-bold text-[#FFF8F0]">
          Compiling Detailed Simulation Audit...
        </h3>
        <p className="text-xs text-[#C5B5A8]">
          Aggregating communication, technical depth, and confidence telemetry.
        </p>
      </div>
    );
  }

  if (error || !sessionData) {
    return (
      <div className="max-w-xl mx-auto py-16 animate-in fade-in">
        <GlassCard className="p-8 text-center border-rose-500/30">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center mx-auto mb-4 text-rose-400">
            <ShieldAlert size={26} />
          </div>
          <h2 className="text-lg font-black text-[#FFF8F0] mb-2">
            Audit Report Access Denied
          </h2>
          <p className="text-xs text-[#C5B5A8] mb-6 leading-relaxed">
            {error || 'Unable to display simulation audit for the requested interview ID.'}
          </p>
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/mock-interview')}
            icon={<ArrowLeft size={14} />}
          >
            Return to Mock Interview Studio
          </Button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16 animate-in fade-in duration-300">
      <InterviewReport
        interview={sessionData.interview}
        questions={sessionData.questions}
        answers={sessionData.answers}
      />
    </div>
  );
};
