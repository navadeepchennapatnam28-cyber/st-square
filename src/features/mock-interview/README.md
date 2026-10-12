# ST² AI Mock Interview Module

A dedicated, self-contained AI-powered text-based mock interview platform for students in the ST² Student Growth Hub.

## Folder Structure

```
src/features/mock-interview/
├── components/
│   ├── InterviewSetupForm.tsx       # Configuration form for role, company, difficulty & length
│   ├── InterviewQuestionCard.tsx    # Question card with TTS speech synthesis & focus topics
│   ├── AnswerInput.tsx              # Textarea with live word counter, pro tips, submit handler
│   ├── InterviewProgress.tsx        # Step progress bar, active timer with pause/resume & badges
│   ├── InterviewFeedbackCard.tsx    # 4-pillar score breakdown, qualitative tips & model answers
│   ├── InterviewReport.tsx          # Comprehensive audit report with score rings & Q&A review
│   └── InterviewHistoryList.tsx     # Past interview archives, filters, resume & delete actions
├── hooks/
│   ├── useMockInterview.ts          # Active session lifecycle, timer, answer submission & review
│   └── useInterviewHistory.ts       # History records, filters, deletion, and aggregate statistics
├── services/
│   ├── mockInterviewService.ts      # Session CRUD, Supabase sync & localStorage offline fallback
│   └── aiInterviewService.ts        # AI generation & evaluation with server-side Edge function pattern
├── types/
│   └── mockInterview.types.ts       # Typed models for interviews, questions, answers, and reports
├── utils/
│   ├── constants.ts                 # Role lists, company presets, difficulty & rubrics
│   └── scoring.ts                   # Weighted aggregate scoring & readiness evaluation
└── README.md
```

## Routes Exposed

- `/mock-interview` — Setup cockpit, summary statistics, and interview history
- `/mock-interview/session/:id` — Live timed mock interview session
- `/mock-interview/report/:id` — Completed simulation audit report & model answers

## Supabase Schema & Row-Level Security (RLS)

The module defines three primary tables in `supabase/migrations/20261012_mock_interviews.sql`:
1. `mock_interviews` — Tracks target career parameters, overall scores, and session status (`setup`, `in_progress`, `completed`, `abandoned`).
2. `mock_interview_questions` — Stores questions per interview session.
3. `mock_interview_answers` — Records student answers, 4-pillar scores, feedback, and model answers.

### RLS Policies:
- **Students**: Full CRUD access only to their own interview sessions (`student_id = auth.uid()`).
- **Faculty**: Read-only summary score access for students within their department; raw student answers remain private unless explicit admin permission is granted.
- **Admin**: Full read and audit access.

## AI Integration Security Pattern

- **Zero Client-Side Secret Exposure**: No OpenAI or Gemini API keys are bundled into the client application.
- **Server-Side AI Handler**: A Supabase Edge Function (`supabase/functions/mock-interview-ai/index.ts`) handles AI evaluation when Supabase is connected.
- **Demo Mode**: When offline or before keys are provisioned, a local deterministic evaluation engine generates realistic questions, rubrics, and feedback, ensuring zero downtime for hackathon evaluations.
