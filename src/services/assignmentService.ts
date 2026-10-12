import { supabase, isSupabaseConfigured } from './supabaseClient';

export interface AssignmentItem {
  id: string;
  title: string;
  courseCode: string;
  courseName: string;
  facultyName: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  obtainedMarks?: number;
  totalMarks: number;
  facultyFeedback?: string;
  submissionDate?: string;
  submissionLink?: string;
  description: string;
  tags: string[];
}

const STORAGE_KEY = 'st2_assignments_state';

const initialAssignments: AssignmentItem[] = [
  {
    id: 'asg-01',
    title: 'Distributed Consensus & Raft Protocol Simulation',
    courseCode: 'CS601',
    courseName: 'Distributed Systems & Cloud Computing',
    facultyName: 'Dr. Vikram Ramanathan',
    dueDate: 'Oct 18, 2026 • 11:59 PM',
    status: 'pending',
    totalMarks: 100,
    description: 'Implement a leader election and log replication module using Python/Go. Ensure heartbeats and split-brain election timeouts are handled gracefully.',
    tags: ['Distributed Systems', 'Python', 'Consensus'],
  },
  {
    id: 'asg-02',
    title: 'Neural Style Transfer & ResNet Feature Optimization',
    courseCode: 'AI604',
    courseName: 'Deep Learning & Computer Vision',
    facultyName: 'Prof. Meera Deshmukh',
    dueDate: 'Oct 22, 2026 • 05:00 PM',
    status: 'pending',
    totalMarks: 50,
    description: 'Train a VGG19/ResNet network to transfer artistic textures from impressionist paintings to high-resolution landscape images with Gram matrix loss optimization.',
    tags: ['Deep Learning', 'PyTorch', 'ResNet'],
  },
  {
    id: 'asg-03',
    title: 'B-Tree Indexing Engine for Micro-Databases',
    courseCode: 'CS602',
    courseName: 'Compiler Design & Code Generation',
    facultyName: 'Dr. M. Venkat',
    dueDate: 'Oct 26, 2026 • 11:59 PM',
    status: 'pending',
    totalMarks: 100,
    description: 'Build an on-disk B+ tree index structure with concurrency-friendly page latches and node splitting algorithms.',
    tags: ['Compilers', 'Storage Engines', 'C++'],
  },
  {
    id: 'asg-04',
    title: 'Multi-Stage Docker CI/CD Pipeline & Kubernetes Ingress',
    courseCode: 'PE608',
    courseName: 'Product Engineering & DevOps',
    facultyName: 'Prof. Ananya Ghosh',
    dueDate: 'Oct 10, 2026 • 11:59 PM',
    status: 'graded',
    obtainedMarks: 94,
    totalMarks: 100,
    submissionDate: 'Oct 09, 2026 • 08:34 PM',
    submissionLink: 'https://github.com/aarav-sharma/devops-k8s-pipeline',
    facultyFeedback: 'Superb deployment configuration! Excellent use of distroless container bases and Helm charts. Full marks on ingress routing.',
    description: 'Construct an automated deployment pipeline utilizing GitHub Actions, Docker multi-stage builds, and Minikube ingress controllers.',
    tags: ['DevOps', 'Docker', 'Kubernetes'],
  },
  {
    id: 'asg-05',
    title: 'Fine-Tuning TinyLlama on Domain Legal QA Datasets',
    courseCode: 'CS605',
    courseName: 'Natural Language Processing',
    facultyName: 'Prof. Arvind Subramanian',
    dueDate: 'Oct 07, 2026 • 11:59 PM',
    status: 'submitted',
    totalMarks: 100,
    submissionDate: 'Oct 07, 2026 • 04:12 PM',
    submissionLink: 'https://huggingface.co/aarav/legal-tinyllama-lora',
    description: 'Execute parameter-efficient fine-tuning (LoRA) on legal question-answering datasets and evaluate ROUGE scores.',
    tags: ['NLP', 'LLM', 'LoRA'],
  },
];

export const assignmentService = {
  /**
   * Fetch all assignments and student submission states
   */
  async getAssignments(studentId?: string): Promise<AssignmentItem[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data: assignments, error: aErr } = await supabase
          .from('assignments')
          .select('*')
          .order('due_date', { ascending: true });

        if (!aErr && assignments && assignments.length > 0) {
          // If studentId available, fetch their submissions
          let submissionsMap: Record<string, any> = {};
          if (studentId) {
            const { data: subs } = await supabase
              .from('assignment_submissions')
              .select('*')
              .eq('student_id', studentId);

            if (subs) {
              subs.forEach((s) => {
                submissionsMap[s.assignment_id] = s;
              });
            }
          }

          return assignments.map((a): AssignmentItem => {
            const sub = submissionsMap[a.id];
            return {
              id: a.id,
              title: a.title,
              courseCode: a.course_code,
              courseName: a.course_name,
              facultyName: a.faculty_name,
              dueDate: new Date(a.due_date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              }),
              status: sub ? sub.status : 'pending',
              obtainedMarks: sub?.obtained_marks,
              totalMarks: a.total_marks,
              facultyFeedback: sub?.faculty_feedback,
              submissionDate: sub?.submission_date
                ? new Date(sub.submission_date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })
                : undefined,
              submissionLink: sub?.submission_link,
              description: a.description,
              tags: a.tags || [],
            };
          });
        }
      } catch {
        // Fallback to local storage
      }
    }

    const local = localStorage.getItem(STORAGE_KEY);
    if (local) {
      try {
        return JSON.parse(local);
      } catch {
        // Fallback to initial
      }
    }
    return initialAssignments;
  },

  /**
   * Submit or update an assignment response
   */
  async submitAssignment(params: {
    assignmentId: string;
    studentId: string;
    submissionLink: string;
    notes?: string;
  }): Promise<AssignmentItem[]> {
    const { assignmentId, studentId, submissionLink, notes } = params;

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase
          .from('assignment_submissions')
          .upsert({
            assignment_id: assignmentId,
            student_id: studentId,
            submission_link: submissionLink,
            notes: notes || '',
            status: 'submitted',
            submission_date: new Date().toISOString(),
          }, { onConflict: 'assignment_id,student_id' });
      } catch {
        // Fallback
      }
    }

    // Mirror to local state
    const current = await this.getAssignments(studentId);
    const updated = current.map((item) => {
      if (item.id === assignmentId) {
        return {
          ...item,
          status: 'submitted' as const,
          submissionLink,
          submissionDate: 'Just now',
        };
      }
      return item;
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },
};
