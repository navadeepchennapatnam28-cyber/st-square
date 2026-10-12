import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useApp } from '../context/AppContext';
import { authService, isValidEmail, isValidIndianMobile } from '../services/authService';
import { WaterBubblesBackground } from '../components/layout/WaterBubblesBackground';
import {
  Sparkles,
  Lock,
  Mail,
  User,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  GraduationCap,
  KeyRound,
  Check,
  AlertCircle,
  ChevronLeft,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast, refreshProfile, isAuthenticated, userRole } = useApp();

  // Redirect if already authenticated
  useEffect(() => {
    const cachedStr = localStorage.getItem('st2_cached_session');
    const isAuthed = isAuthenticated || !!cachedStr;
    if (isAuthed) {
      let role = userRole;
      if (!role && cachedStr) {
        try {
          role = JSON.parse(cachedStr).role;
        } catch {
          // ignore
        }
      }
      if (role === 'faculty') {
        navigate('/faculty', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [isAuthenticated, userRole, navigate]);

  type AuthMode = 'login' | 'register' | 'forgot' | 'reset' | 'verify';
  type LoginRole = 'student' | 'faculty';

  const [mode, setMode] = useState<AuthMode>('login');
  const [loginRole, setLoginRole] = useState<LoginRole>('student');

  // Form Fields
  const [email, setEmail] = useState('aarav.sharma@st2.edu');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [studentId, setStudentId] = useState('');
  const [department, setDepartment] = useState('Computer Science & AI');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [rememberMe, setRememberMe] = useState(true);

  // Password Visibility States (all hidden by default)
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showResetConfirmPassword, setShowResetConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleRoleSwitch = (role: LoginRole) => {
    setLoginRole(role);
    setFormError(null);
    if (role === 'faculty') {
      setEmail('dr.arvind@faculty.st2.edu');
      setPassword('password123');
    } else {
      setEmail('aarav.sharma@st2.edu');
      setPassword('password123');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setFormError('Please enter both your email address and passphrase.');
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      setFormError('Please enter a valid email address (e.g. name@example.com). Supports Gmail, Outlook, Yahoo, college, and company domains.');
      return;
    }

    setIsLoading(true);
    const { session, error } = await authService.login(cleanEmail, cleanPassword, loginRole);
    setIsLoading(false);

    if (error) {
      setFormError(error);
      showToast('Authentication Failed', error, 'error');
      return;
    }

    if (session) {
      await refreshProfile();
      if (session.role === 'faculty' || session.role === 'admin') {
        showToast('Faculty Authentication Cleared', `Welcome, ${session.name}! Accessing Command Center.`, 'success');
        navigate('/faculty', { replace: true });
      } else {
        showToast('Scholar Authentication Cleared', `Welcome to ST², ${session.name}! Accessing Student Dashboard.`, 'success');
        navigate('/', { replace: true });
      }
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanStudentId = studentId.trim();
    const cleanPhone = phone.replace(/\D/g, '');

    // 1. User Display Name Validation
    if (!cleanName || cleanName.length < 2) {
      setFormError('Please provide a valid display name.');
      return;
    }

    // 2. Email Validation
    if (!cleanEmail) {
      setFormError('Please provide your email address.');
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      setFormError('Please enter a valid email address (e.g. name@example.com). Supports Gmail, Outlook, Yahoo, university, and company domains.');
      return;
    }

    // 3. Indian Mobile Number Validation (10 digits)
    if (!cleanPhone) {
      setFormError('Please enter your 10-digit mobile number.');
      return;
    }

    if (!isValidIndianMobile(cleanPhone)) {
      setFormError('Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.');
      return;
    }

    // 4. Role ID Validation
    if (!cleanStudentId) {
      setFormError(loginRole === 'faculty' ? 'Please provide your Faculty ID / Designation.' : 'Please provide your University Roll Number.');
      return;
    }

    // 5. Passphrase Validation
    if (!password.trim() || password !== confirmPassword) {
      setFormError('Passphrases do not match or cannot be empty.');
      return;
    }

    if (password.length < 6) {
      setFormError('Passphrase must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    const { user, error, confirmationRequired, notice } = await authService.register({
      email: cleanEmail,
      password,
      name: cleanName,
      studentId: cleanStudentId,
      department,
      phone: cleanPhone,
      role: loginRole,
    });
    setIsLoading(false);

    if (error) {
      setFormError(error);
      showToast('Registration Error', error, 'error');
      return;
    }

    if (notice) {
      showToast('Account Provisioned', notice, 'info');
    }

    if (confirmationRequired) {
      setMode('verify');
      showToast('Account Created', `Please check ${cleanEmail} for confirmation link or code.`, 'info');
    } else if (user) {
      await refreshProfile();
      if (user.role === 'faculty') {
        showToast('Faculty Account Activated', `Welcome to ST², ${user.name}! Accessing Command Center.`, 'success');
        navigate('/faculty');
      } else {
        showToast('Scholar Account Activated', `Welcome to ST², ${user.name}! Accessing Student Dashboard.`, 'success');
        navigate('/');
      }
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setFormError('Please enter your registered email address.');
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      setFormError('Please enter a valid email address (e.g. name@example.com).');
      return;
    }

    setIsLoading(true);
    const { success, error } = await authService.requestPasswordReset(cleanEmail);
    setIsLoading(false);

    if (error) {
      setFormError('Password recovery request could not be processed. Please check with campus IT.');
      showToast('Reset Request Failed', error || 'Unable to dispatch recovery instructions.', 'error');
      return;
    }

    setMode('login');
    showToast('Reset Instructions Issued', `If an account exists for ${cleanEmail}, instructions have been dispatched.`, 'info');
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!password.trim() || password !== confirmPassword) {
      setFormError('Passphrases do not match or cannot be empty.');
      return;
    }

    if (password.length < 6) {
      setFormError('Passphrase must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setMode('login');
      showToast('Password Updated', 'Your credentials were successfully updated. Please sign in.', 'success');
    }, 600);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const pin = otpCode.join('');
    if (pin.length < 6) {
      setFormError('Please input all 6 digits of your verification code.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showToast('Account Verified', 'Identity confirmed. Welcome to ST².', 'success');
      navigate(loginRole === 'faculty' ? '/faculty' : '/');
    }, 600);
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val[0];
    const newOtp = [...otpCode];
    newOtp[index] = val;
    setOtpCode(newOtp);
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-[#100D0B] text-[#FFF8F0] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden selection:bg-[#FF7A18]/30 selection:text-[#FFE0A3]">
      {/* Cinematic Ambient Background Fields */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `
            radial-gradient(ellipse 90% 55% at 50% -15%, rgba(255, 122, 24, 0.22), transparent 70%),
            radial-gradient(circle 900px at 95% 15%, rgba(255, 140, 50, 0.18), transparent 65%),
            radial-gradient(circle 800px at 0% 35%, rgba(36, 19, 13, 0.85), transparent 70%),
            radial-gradient(ellipse 70% 45% at 85% 85%, rgba(255, 179, 71, 0.15), transparent 65%),
            radial-gradient(circle 650px at 15% 90%, rgba(255, 122, 24, 0.18), transparent 60%)
          `,
        }}
      />
      <div className="fixed -top-48 -right-48 w-[52rem] h-[52rem] rounded-full bg-gradient-to-bl from-[#FF7A18]/25 via-[#FF8C32]/12 to-transparent blur-[120px] pointer-events-none z-0" />
      <div className="fixed -bottom-52 -left-52 w-[48rem] h-[48rem] rounded-full bg-gradient-to-tr from-[#FF7A18]/20 via-[#FF8C32]/10 to-transparent blur-[130px] pointer-events-none z-0" />
      <WaterBubblesBackground />

      {/* Main Liquid Glass Authentication Card */}
      <div className="w-full max-w-5xl rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 border border-[rgba(255,140,50,0.35)] bg-[#1A120E]/90 backdrop-blur-xl transform-gpu shadow-[0_25px_70px_rgba(0,0,0,0.7),0_0_35px_rgba(255,122,24,0.2),inset_0_1.5px_1px_rgba(255,255,255,0.25)] relative z-10 my-6">
        {/* Top Specular Glint Line */}
        <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none z-20" />

        {/* ==================================================
            LEFT BRANDING PANEL
            ================================================== */}
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-8 xl:p-10 relative overflow-hidden bg-gradient-to-br from-[#24130D] via-[#1A120E] to-[#100D0B] border-r border-[rgba(255,122,24,0.20)]">
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-gradient-to-br from-[#FF7A18]/25 via-[#FF8C32]/12 to-transparent blur-2xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-gradient-to-tl from-[#FFB347]/15 via-[#FF7A18]/08 to-transparent blur-2xl pointer-events-none" />

          {/* Top Brand Header */}
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-3xl font-black text-[#FFF8F0] font-display flex items-center">
                ST<sup className="text-lg font-black bg-gradient-to-r from-[#FF7A18] via-[#FF8C32] to-[#FFB347] bg-clip-text text-transparent ml-0.5 drop-shadow-[0_0_10px_rgba(255,122,24,0.7)]">²</sup>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FF7A18]/20 text-[#FFE0A3] border border-[#FF7A18]/30">
                INTEGRATED PORTAL
              </span>
            </div>

            <p className="text-xs font-bold text-[#FF8C32] uppercase tracking-widest mb-1">
              STUDENT & FACULTY PLATFORM
            </p>
            <h2 className="text-2xl font-extrabold text-[#FFF8F0] font-display tracking-tight leading-snug">
              Smarter Insights, <br />
              <span className="bg-gradient-to-r from-[#FFF8F0] via-[#FFE0A3] to-[#FF8C32] bg-clip-text text-transparent">
                Brighter Futures.
              </span>
            </h2>
            <p className="text-xs text-[#C5B5A8] mt-3 leading-relaxed">
              Unified institutional intelligence for continuous student telemetry, algorithmic growth coaching, and faculty governance.
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="relative z-10 space-y-3 my-8">
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-md">
              <div className="w-8 h-8 rounded-xl bg-[#FF7A18]/15 border border-[#FF7A18]/30 flex items-center justify-center text-[#FF8C32] shrink-0 mt-0.5">
                <GraduationCap size={16} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#FFF8F0]">Student Growth Cockpit</h4>
                <p className="text-[11px] text-[#C5B5A8] mt-0.5">Real-time CGPA, attendance telemetry, Pro Code, and AI Mock Interviews.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-md">
              <div className="w-8 h-8 rounded-xl bg-[#FF8C32]/15 border border-[#FF8C32]/30 flex items-center justify-center text-[#FFB347] shrink-0 mt-0.5">
                <ShieldCheck size={16} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#FFF8F0]">Faculty Governance Desk</h4>
                <p className="text-[11px] text-[#C5B5A8] mt-0.5">Syllabus coverage tracking, attendance ledger, and confidential remediation.</p>
              </div>
            </div>
          </div>

          {/* Security Assurance */}
          <div className="relative z-10 pt-4 border-t border-[rgba(255,122,24,0.18)] flex items-center justify-between text-[11px] text-[#8F8176]">
            <div className="flex items-center gap-1.5 text-[#C5B5A8]">
              <ShieldCheck size={14} className="text-[#FF8C32]" />
              <span>TLS 1.3 Institutional Encrypted</span>
            </div>
            <span className="font-mono">v4.3.0</span>
          </div>
        </div>

        {/* ==================================================
            RIGHT AUTHENTICATION PANEL
            ================================================== */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
          <div>
            {/* Mobile Branding Header */}
            <div className="lg:hidden mb-6 pb-4 border-b border-white/5 text-center">
              <div className="inline-flex items-center gap-1.5 mb-1">
                <span className="text-2xl font-black text-[#FFF8F0] font-display flex items-center">
                  ST<sup className="text-base font-black text-[#FF7A18] ml-0.5">²</sup>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FF7A18]/20 text-[#FFE0A3]">
                  PORTAL
                </span>
              </div>
              <p className="text-[10px] font-bold text-[#FF8C32] uppercase tracking-wider">
                STUDENT & FACULTY PLATFORM
              </p>
            </div>

            {/* Mode Switch Header */}
            <div className="flex items-center justify-between gap-2 mb-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#FFF8F0] font-display">
                  {mode === 'login' && 'Institutional Sign In'}
                  {mode === 'register' && (loginRole === 'faculty' ? 'Create Faculty Account' : 'Create Student Account')}
                  {mode === 'forgot' && 'Account Recovery'}
                  {mode === 'reset' && 'Set New Password'}
                  {mode === 'verify' && 'Verify Email Address'}
                </h3>
                <p className="text-xs text-[#C5B5A8] mt-1">
                  {mode === 'login' && 'Select your institutional role and enter credentials to continue.'}
                  {mode === 'register' && (loginRole === 'faculty'
                    ? 'Register your faculty credentials to manage course rosters and placement records.'
                    : 'Register your university roll number to link continuous assessment logs.')}
                  {mode === 'forgot' && 'Provide your registered email to receive recovery instructions.'}
                  {mode === 'reset' && 'Create a strong passphrase with numbers and special symbols.'}
                  {mode === 'verify' && 'Enter the 6-digit confirmation PIN sent to your inbox.'}
                </p>
              </div>

              {mode !== 'login' && (
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setFormError(null);
                  }}
                  className="text-xs text-[#FF8C32] hover:text-[#FFE0A3] flex items-center gap-1 cursor-pointer shrink-0 font-medium"
                >
                  <ChevronLeft size={14} /> Back to Sign In
                </button>
              )}
            </div>

            {/* Error Banner */}
            {formError && (
              <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle size={15} className="shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* ==================================================
                TWO PROMINENT OPTIONS: STUDENT VS FACULTY LOGIN
                ================================================== */}
            {mode === 'login' && (
              <div className="grid grid-cols-2 gap-3 mb-6 p-1.5 rounded-2xl bg-[#140F0C] border border-[rgba(255,106,0,0.25)] shadow-inner">
                <button
                  type="button"
                  onClick={() => handleRoleSwitch('student')}
                  className={`flex items-center justify-center gap-2.5 py-3 px-3 sm:px-4 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    loginRole === 'student'
                      ? 'bg-gradient-to-r from-[#FF7A18] to-[#FF8C32] text-white shadow-[0_4px_20px_rgba(255,122,24,0.4)] border border-white/20'
                      : 'text-[#C5B5A8] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <GraduationCap size={18} />
                  <div className="text-left">
                    <div className="leading-tight text-xs font-black">STUDENT LOGIN</div>
                    <div className="text-[10px] font-normal opacity-85">Scholar Telemetry</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleSwitch('faculty')}
                  className={`flex items-center justify-center gap-2.5 py-3 px-3 sm:px-4 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    loginRole === 'faculty'
                      ? 'bg-gradient-to-r from-[#FF8C32] to-[#FFB347] text-white shadow-[0_4px_20px_rgba(255,140,50,0.4)] border border-white/20'
                      : 'text-[#C5B5A8] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <ShieldCheck size={18} />
                  <div className="text-left">
                    <div className="leading-tight text-xs font-black">FACULTY LOGIN</div>
                    <div className="text-[10px] font-normal opacity-85">Mentor & Dean Desk</div>
                  </div>
                </button>
              </div>
            )}

            {/* ==================================================
                FORM: LOGIN
                ================================================== */}
            {mode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#FFF8F0] mb-1.5">
                    {loginRole === 'faculty' ? 'Faculty Email Address' : 'Student Email Address'}
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8F8176]" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={
                        loginRole === 'faculty'
                          ? 'e.g. dr.arvind@faculty.st2.edu, mentor@gmail.com'
                          : 'e.g. aarav.sharma@st2.edu, scholar@gmail.com'
                      }
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#140F0C] border border-[rgba(255,106,0,0.25)] text-xs text-[#FFF8F0] placeholder-[#8F8176] focus:outline-none focus:border-[#FF7A18] transition-colors"
                    />
                  </div>
                  <p className="text-[10px] text-[#8F8176] mt-1">
                    Accepts Gmail, Outlook, Yahoo, university, or corporate email accounts.
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-[#FFF8F0]">Passphrase</label>
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-[11px] text-[#FF8C32] hover:text-[#FFE0A3] cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8F8176]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#140F0C] border border-[rgba(255,106,0,0.25)] text-xs text-[#FFF8F0] placeholder-[#8F8176] focus:outline-none focus:border-[#FF7A18] transition-colors"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8F8176] hover:text-white cursor-pointer"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-[#C5B5A8]">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded accent-[#FF7A18]"
                    />
                    <span>Remember terminal session</span>
                  </label>
                  <span className="text-[10px] text-[#8F8176]">Auto-redirects to portal</span>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isLoading}
                  className="w-full mt-2 gap-2 shadow-[0_10px_30px_rgba(255,122,24,0.3)]"
                >
                  {isLoading ? (
                    'Verifying Credentials...'
                  ) : (
                    <>
                      <span>Enter {loginRole === 'faculty' ? 'Faculty Portal' : 'Student Cockpit'}</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </Button>

                {/* Role Specific Bottom Notice */}
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-[#8F8176] flex items-center justify-between">
                  <span>
                    {loginRole === 'faculty'
                      ? '🔐 Faculty Portal access. New faculty member?'
                      : '🎓 New student or scholar? Need an account?'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setFormError(null);
                    }}
                    className="text-[#FF8C32] font-bold hover:underline cursor-pointer ml-2 shrink-0"
                  >
                    Register Now
                  </button>
                </div>
              </form>
            )}

            {/* ==================================================
                FORM: REGISTER (STUDENT & FACULTY REGISTRATION)
                ================================================== */}
            {mode === 'register' && (
              <form onSubmit={handleRegister} className="space-y-3.5">
                {/* Role Selector in Registration */}
                <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#140F0C] border border-[rgba(255,106,0,0.25)]">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginRole('student');
                      setFormError(null);
                    }}
                    className={`flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      loginRole === 'student'
                        ? 'bg-gradient-to-r from-[#FF7A18] to-[#FF8C32] text-white shadow-sm'
                        : 'text-[#C5B5A8] hover:text-white'
                    }`}
                  >
                    <GraduationCap size={14} /> Student Registration
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginRole('faculty');
                      setFormError(null);
                    }}
                    className={`flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      loginRole === 'faculty'
                        ? 'bg-gradient-to-r from-[#FF8C32] to-[#FFB347] text-white shadow-sm'
                        : 'text-[#C5B5A8] hover:text-white'
                    }`}
                  >
                    <ShieldCheck size={14} /> Faculty Registration
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#FFF8F0] mb-1">
                      {loginRole === 'faculty' ? 'Full Faculty Name' : 'Full Scholar Name'}
                    </label>
                    <div className="relative">
                      <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8F8176]" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={loginRole === 'faculty' ? 'Dr. Arvind Subramanian' : 'Aarav Sharma'}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#140F0C] border border-[rgba(255,106,0,0.25)] text-xs text-[#FFF8F0] placeholder-[#8F8176] focus:outline-none focus:border-[#FF7A18]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#FFF8F0] mb-1">
                      {loginRole === 'faculty' ? 'Faculty ID / Designation' : 'University Roll Number'}
                    </label>
                    <input
                      type="text"
                      required
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      placeholder={loginRole === 'faculty' ? 'FAC-CSE-042' : 'STU-2024-8842'}
                      className="w-full px-3 py-2 rounded-xl bg-[#140F0C] border border-[rgba(255,106,0,0.25)] text-xs text-[#FFF8F0] placeholder-[#8F8176] focus:outline-none focus:border-[#FF7A18]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#FFF8F0] mb-1">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#140F0C] border border-[rgba(255,106,0,0.25)] text-xs text-[#FFF8F0] focus:outline-none focus:border-[#FF7A18]"
                  >
                    <option value="Computer Science & AI">Computer Science & AI</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Data Science & Analytics">Data Science & Analytics</option>
                    <option value="Electronics & Computing">Electronics & Computing</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#FFF8F0] mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8F8176]" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="yourname@gmail.com"
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#140F0C] border border-[rgba(255,106,0,0.25)] text-xs text-[#FFF8F0] placeholder-[#8F8176] focus:outline-none focus:border-[#FF7A18]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#FFF8F0] mb-1">
                      Mobile Number (10 Digits)
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[#8F8176] text-xs font-mono">
                        <Phone size={13} />
                        <span className="text-[#C5B5A8] border-r border-[#8F8176]/30 pr-1.5">+91</span>
                      </div>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={phone}
                        onChange={(e) => {
                          const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
                          setPhone(digitsOnly);
                        }}
                        placeholder="9876543210"
                        className="w-full pl-16 pr-3 py-2 rounded-xl bg-[#140F0C] border border-[rgba(255,106,0,0.25)] text-xs font-mono text-[#FFF8F0] placeholder-[#8F8176] focus:outline-none focus:border-[#FF7A18]"
                      />
                    </div>
                  </div>
                </div>

                <p className="text-[10px] text-[#8F8176]">
                  Accepts Gmail, Outlook, Yahoo, university (.edu, .ac.in), and company emails.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#FFF8F0] mb-1">Passphrase</label>
                    <div className="relative">
                      <input
                        type={showRegisterPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min 6 characters"
                        className="w-full pl-3 pr-9 py-2 rounded-xl bg-[#140F0C] border border-[rgba(255,106,0,0.25)] text-xs text-[#FFF8F0] placeholder-[#8F8176] focus:outline-none focus:border-[#FF7A18]"
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8F8176] hover:text-white cursor-pointer"
                        aria-label="Toggle password visibility"
                      >
                        {showRegisterPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#FFF8F0] mb-1">Confirm Passphrase</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repeat passphrase"
                        className="w-full pl-3 pr-9 py-2 rounded-xl bg-[#140F0C] border border-[rgba(255,106,0,0.25)] text-xs text-[#FFF8F0] placeholder-[#8F8176] focus:outline-none focus:border-[#FF7A18]"
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8F8176] hover:text-white cursor-pointer"
                        aria-label="Toggle confirm password visibility"
                      >
                        {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                </div>

                <Button type="submit" variant="primary" size="lg" disabled={isLoading} className="w-full mt-3">
                  {isLoading
                    ? 'Creating Identity...'
                    : loginRole === 'faculty'
                    ? 'Initialize Faculty Account'
                    : 'Initialize Student Account'}
                </Button>
              </form>
            )}

            {/* ==================================================
                FORM: FORGOT PASSWORD
                ================================================== */}
            {mode === 'forgot' && (
              <form onSubmit={handleForgot} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#FFF8F0] mb-1.5">Registered Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8F8176]" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. name@gmail.com, scholar@st2.edu"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#140F0C] border border-[rgba(255,106,0,0.25)] text-xs text-[#FFF8F0] placeholder-[#8F8176] focus:outline-none focus:border-[#FF7A18]"
                    />
                  </div>
                  <p className="text-[10px] text-[#8F8176] mt-1">
                    Accepts any registered email address from any provider.
                  </p>
                </div>

                <Button type="submit" variant="primary" size="lg" disabled={isLoading} className="w-full">
                  {isLoading ? 'Sending Instructions...' : 'Dispatch Reset Email'}
                </Button>
              </form>
            )}

            {/* ==================================================
                FORM: RESET PASSWORD
                ================================================== */}
            {mode === 'reset' && (
              <form onSubmit={handleReset} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#FFF8F0] mb-1.5">New Passphrase</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8F8176]" />
                    <input
                      type={showResetPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#140F0C] border border-[rgba(255,106,0,0.25)] text-xs text-[#FFF8F0] placeholder-[#8F8176] focus:outline-none focus:border-[#FF7A18]"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowResetPassword(!showResetPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8F8176] hover:text-white cursor-pointer"
                      aria-label="Toggle password visibility"
                    >
                      {showResetPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#FFF8F0] mb-1.5">Confirm New Passphrase</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8F8176]" />
                    <input
                      type={showResetConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat passphrase"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#140F0C] border border-[rgba(255,106,0,0.25)] text-xs text-[#FFF8F0] placeholder-[#8F8176] focus:outline-none focus:border-[#FF7A18]"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowResetConfirmPassword(!showResetConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8F8176] hover:text-white cursor-pointer"
                      aria-label="Toggle confirm password visibility"
                    >
                      {showResetConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <Button type="submit" variant="primary" size="lg" disabled={isLoading} className="w-full">
                  {isLoading ? 'Updating Passphrase...' : 'Save & Sign In'}
                </Button>
              </form>
            )}

            {/* ==================================================
                FORM: OTP VERIFICATION
                ================================================== */}
            {mode === 'verify' && (
              <form onSubmit={handleVerify} className="space-y-5">
                <div className="flex justify-center gap-2">
                  {otpCode.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-input-${idx}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      className="w-11 h-12 text-center text-lg font-bold font-mono rounded-xl bg-[#140F0C] border border-[rgba(255,106,0,0.3)] text-[#FFF8F0] focus:border-[#FF7A18] focus:outline-none"
                    />
                  ))}
                </div>

                <Button type="submit" variant="primary" size="lg" disabled={isLoading} className="w-full">
                  {isLoading ? 'Confirming Identity...' : 'Complete Verification & Enter'}
                </Button>
              </form>
            )}
          </div>

          {/* Footer Note */}
          <div className="pt-6 mt-6 border-t border-[rgba(255,122,24,0.15)] flex items-center justify-between text-[11px] text-[#8F8176]">
            <span>ST² Student Intelligence Platform</span>
            <span>&copy; 2026 byteXL Ecosystem</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
