import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Building2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  BookOpen,
  Target,
  BarChart3,
  Users2,
  Award,
} from 'lucide-react';
import { LiquidOrangeBackground } from '../components/auth/LiquidOrangeBackground';
import { ST2Logo } from '../components/common/ST2Logo';
import { useAuth } from '../context/AuthContext';

export function LandingEntryPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  // If already authenticated, redirect to their dedicated dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.userType === 'faculty') {
        if (user.facultyApprovalStatus === 'pending') {
          navigate('/faculty/pending-approval');
        } else {
          navigate('/faculty/dashboard');
        }
      } else {
        navigate('/student/dashboard');
      }
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="min-h-screen w-full relative flex flex-col justify-between overflow-x-hidden selection:bg-orange-500/35 selection:text-orange-200">
      <LiquidOrangeBackground />

      {/* Top Header */}
      <header className="relative z-10 w-full px-6 py-5 max-w-7xl mx-auto flex items-center justify-between">
        <ST2Logo size="md" subtitleText="STUDENT GROWTH HUB" badge="Dual Portal System" linkTo="/" />

        <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#180A04]/80 border border-orange-500/25 text-xs text-amber-200 backdrop-blur-md">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Strict Role Isolation Active</span>
        </div>
      </header>

      {/* Hero & Two Distinct Entry Points */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8 md:py-12 flex-1 flex flex-col justify-center">
        {/* Hero Title */}
        <div className="text-center space-y-3 max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-xs font-semibold text-orange-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Select Your Independent Dedicated Portal</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#FFF8F0] tracking-tight leading-[1.12] font-['Outfit']">
            Empowering students.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF7A18] via-[#FFB347] to-[#FFE0A3]">
              Supporting faculty.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-[#C5B5A8] max-w-2xl mx-auto leading-relaxed">
            Choose your designated entry point below. Students and faculty experience dedicated login portals, separate registration workflows, and independent data dashboards.
          </p>
        </div>

        {/* TWO COMPLETELY SEPARATE ENTRY POINT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto w-full">
          {/* ENTRY POINT 1: STUDENT PORTAL */}
          <motion.div
            whileHover={{ y: -4, scale: 1.015 }}
            transition={{ duration: 0.25 }}
            className="relative rounded-3xl p-7 sm:p-9 bg-[#150a05]/85 backdrop-blur-2xl border border-orange-500/35 shadow-[0_24px_60px_rgba(0,0,0,0.85),0_0_30px_rgba(255,122,24,0.15)] flex flex-col justify-between space-y-6 group overflow-hidden"
          >
            {/* Ambient Backlight */}
            <div className="absolute -top-24 -right-24 w-60 h-60 rounded-full bg-orange-500/20 blur-3xl pointer-events-none group-hover:bg-orange-500/35 transition-all" />

            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FF7A18] via-[#ea580c] to-[#FFB347] p-[1.5px] shadow-[0_0_20px_rgba(255,122,24,0.45)]">
                  <div className="w-full h-full rounded-[14px] bg-[#120603] flex items-center justify-center">
                    <GraduationCap className="w-7 h-7 text-orange-400 group-hover:scale-110 transition-transform" />
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-orange-500/20 text-orange-300 border border-orange-500/35">
                  Student System
                </span>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#FFF8F0] tracking-tight font-['Outfit']">
                  Student Portal
                </h2>
                <p className="text-xs sm:text-sm text-[#C5B5A8] leading-relaxed">
                  Take authorized assessments, track your cognitive progress with the animated circular score ring, and discover personalized AI improvement pathways.
                </p>
              </div>

              {/* Student Features List */}
              <div className="space-y-2 pt-2 border-t border-orange-500/15 text-xs text-amber-100/90">
                <div className="flex items-center gap-2">
                  <Target className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                  <span>Animated Circular Score Ring &amp; Live Simulator</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                  <span>Cognitive Domain Mastery Breakdown</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                  <span>Personalized Adaptive AI Tutor Recommendations</span>
                </div>
              </div>
            </div>

            {/* Direct Student Entry Buttons */}
            <div className="space-y-2.5 pt-4 relative z-10">
              <Link
                to="/student/login"
                className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#FF7A18] via-[#ea580c] to-[#FFB347] hover:shadow-[0_8px_24px_rgba(255,122,24,0.45)] transition-all flex items-center justify-center gap-2 border border-orange-300/30 font-['Outfit'] shadow-lg"
              >
                <span>Select Student Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/student/register"
                className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-orange-300 hover:text-white bg-[#1A0A04]/90 hover:bg-orange-950/60 border border-orange-500/25 hover:border-orange-500/40 transition-all flex items-center justify-center gap-1.5"
              >
                <span>New Student? Create Account</span>
                <span className="text-[10px] text-amber-300/60">&rarr;</span>
              </Link>
            </div>
          </motion.div>

          {/* ENTRY POINT 2: FACULTY PORTAL */}
          <motion.div
            whileHover={{ y: -4, scale: 1.015 }}
            transition={{ duration: 0.25 }}
            className="relative rounded-3xl p-7 sm:p-9 bg-[#150a05]/85 backdrop-blur-2xl border border-amber-500/35 shadow-[0_24px_60px_rgba(0,0,0,0.85),0_0_30px_rgba(255,179,71,0.15)] flex flex-col justify-between space-y-6 group overflow-hidden"
          >
            {/* Ambient Backlight */}
            <div className="absolute -top-24 -right-24 w-60 h-60 rounded-full bg-amber-500/20 blur-3xl pointer-events-none group-hover:bg-amber-500/35 transition-all" />

            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FFB347] via-[#FF7A18] to-[#ea580c] p-[1.5px] shadow-[0_0_20px_rgba(255,179,71,0.45)]">
                  <div className="w-full h-full rounded-[14px] bg-[#120703] flex items-center justify-center">
                    <Building2 className="w-7 h-7 text-amber-300 group-hover:scale-110 transition-transform" />
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/35">
                  Faculty System
                </span>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#FFF8F0] tracking-tight font-['Outfit']">
                  Faculty Portal
                </h2>
                <p className="text-xs sm:text-sm text-[#C5B5A8] leading-relaxed">
                  Monitor authorized class rosters, configure benchmarks in the assessment studio, analyze cohort cognitive mastery, and assign proactive revision modules.
                </p>
              </div>

              {/* Faculty Features List */}
              <div className="space-y-2 pt-2 border-t border-orange-500/15 text-xs text-amber-100/90">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Authorized Student Rosters &amp; Performance Reports</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Assessment &amp; Question Management Studio</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Evidence-Based Early Support Alerts (&lt; 65% Score)</span>
                </div>
              </div>
            </div>

            {/* Direct Faculty Entry Buttons */}
            <div className="space-y-2.5 pt-4 relative z-10">
              <Link
                to="/faculty/login"
                className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#FF7A18] via-[#ea580c] to-[#FFB347] hover:shadow-[0_8px_24px_rgba(255,179,71,0.45)] transition-all flex items-center justify-center gap-2 border border-amber-300/30 font-['Outfit'] shadow-lg"
              >
                <span>Select Faculty Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/faculty/register"
                className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-amber-300 hover:text-white bg-[#1A0A04]/90 hover:bg-orange-950/60 border border-orange-500/25 hover:border-amber-400/40 transition-all flex items-center justify-center gap-1.5"
              >
                <span>New Faculty? Request Access</span>
                <span className="text-[10px] text-amber-300/60">&rarr;</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full px-6 py-5 max-w-7xl mx-auto border-t border-orange-500/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-amber-300/60">
        <div>ST² HUB • STUDENT GROWTH HUB • Separate Student &amp; Faculty Architecture</div>
        <div>Liquid Orange Glass Theme • WCAG 2.1 AA Accessible</div>
      </footer>
    </div>
  );
}
