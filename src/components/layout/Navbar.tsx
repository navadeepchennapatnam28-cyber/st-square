import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  CheckCheck,
  ChevronDown,
  Settings,
  GraduationCap,
  Sparkles,
  Menu,
  X,
  Calendar,
  Building2,
  Users,
  LogIn,
  LogOut,
  BookOpen,
  Layers,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../ui/Badge';
import { STSquareLogo } from '../ui/STSquareLogo';

export const Navbar: React.FC = () => {
  const {
    student,
    isDemoMode,
    searchQuery,
    setSearchQuery,
    notifications,
    markNotificationRead,
    clearAllNotifications,
    unreadNotificationsCount,
    setMobileMenuOpen,
    showToast,
    userRole,
    userSession,
    logout,
  } = useApp();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    showToast('Search Query Filtered', `Showing results matching "${searchQuery}"`, 'info');
  };

  const currentDateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const departments = [
    'All Departments',
    'Computer Science & Eng',
    'AI & Data Science',
    'Information Technology',
    'Electronics & Comm',
  ];

  const navLinks = userRole === 'faculty' ? [
    { label: 'Faculty Hub', path: '/faculty' },
    { label: 'Placement Analytics', path: '/faculty?tab=placement' },
    { label: 'Performance', path: '/faculty?tab=analytics' },
    { label: 'Student Registry', path: '/faculty?tab=students' },
    { label: 'Syllabus', path: '/faculty?tab=syllabus' },
    { label: 'Assignments', path: '/faculty?tab=assignments' },
    { label: 'Reports', path: '/reports' },
  ] : [
    { label: 'Dashboard', path: '/' },
    { label: 'Students', path: '/students' },
    { label: 'Analytics', path: '/academic' },
    { label: 'Interventions', path: '/interventions' },
    { label: 'ST Point', path: '/st-point' },
    { label: 'Mock Interview', path: '/mock-interview' },
    { label: 'Projects', path: '/projects' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full h-18 bg-[#1A120E]/85 backdrop-blur-md transform-gpu border-b border-[rgba(255,122,24,0.30)] shadow-[0_4px_30px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.12)] transition-all">
      <div className="max-w-[1720px] h-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        
        {/* Left: Branding & Search & Department filter */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="lg:hidden p-2 rounded-xl text-[#C5B5A8] hover:text-[#FFF8F0] hover:bg-white/5 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            <Menu size={22} />
          </button>

          {/* ST² Emblem & Typography */}
          <NavLink to="/" className="flex items-center group">
            <STSquareLogo size="md" />
          </NavLink>

          {/* Student Search bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="relative hidden md:flex items-center w-52 lg:w-60"
          >
            <Search className="absolute left-3 w-4 h-4 text-[#C5B5A8] pointer-events-none" />
            <input
              type="text"
              placeholder="Search students, metrics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-[#100D0B] border border-[rgba(255,122,24,0.30)] text-[#FFF8F0] placeholder:text-[#C5B5A8]/60 focus:outline-none focus:border-[#FF7A18] focus:ring-1 focus:ring-[#FF7A18]/30 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 text-[#A6A09B] hover:text-white p-0.5 rounded cursor-pointer"
              >
                <X size={12} />
              </button>
            )}
          </form>

          {/* Department Filter Selector */}
          <div className="hidden 2xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#100B08]/90 border border-[rgba(255,106,0,0.25)] text-xs text-[#A6A09B]">
            <Building2 size={13} className="text-[#FF8500]" />
            <select
              value={selectedDept}
              onChange={(e) => {
                setSelectedDept(e.target.value);
                showToast('Department Filtered', `Filtered to ${e.target.value}`, 'info');
              }}
              className="bg-transparent text-white font-medium focus:outline-none text-xs cursor-pointer"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept} className="bg-[#100B08] text-white">
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Center: Top Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1.5">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? 'text-white font-bold bg-gradient-to-r from-[#FF6A00] to-[#FF8500] shadow-[0_0_16px_rgba(255,106,0,0.45)]'
                    : 'text-[#A6A09B] hover:text-white hover:bg-white/[0.05]'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Right: Date, Demo Badge, Notifications, Profile */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Current Date Display */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#100B08]/90 border border-[rgba(255,106,0,0.25)] text-xs text-[#A6A09B]">
            <Calendar size={13} className="text-[#FF8500]" />
            <span className="font-medium text-white">{currentDateStr}</span>
          </div>

          {/* Real-Time Live Sync Status Indicator */}
          <div
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 text-xs font-semibold shadow-[0_0_12px_rgba(16,185,129,0.25)]"
            title="Real-time WebSocket telemetry and event stream connected"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
            <span className="font-mono text-[10px] tracking-wider uppercase font-bold">REAL-TIME SYNC</span>
          </div>

          {/* Mode Badge */}
          <NavLink
            to="/settings"
            title="Configure in Settings"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FF6A00]/15 border border-[#FF6A00]/30 hover:border-[#FF8500] transition-all text-[#FFB347] text-xs font-semibold cursor-pointer shadow-[0_0_10px_rgba(255,106,0,0.2)]"
          >
            <span className="w-2 h-2 rounded-full bg-[#FF8500] animate-pulse" />
            <span>{isDemoMode ? 'DEMO MODE' : 'API MODE'}</span>
          </NavLink>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotificationsOpen(prev => !prev)}
              className="relative p-2.5 rounded-xl bg-[#100B08] border border-[rgba(255,106,0,0.30)] hover:border-[#FF6A00] text-[#A6A09B] hover:text-white transition-all cursor-pointer shadow-inner"
              aria-label="Notifications"
            >
              <Bell size={17} />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-gradient-to-r from-[#FF6A00] to-[#FF8500] text-[#080604] text-[10px] font-black flex items-center justify-center shadow-lg">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Notifications Popover */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-3 w-84 sm:w-96 rounded-2xl bg-[#100B08]/95 border border-[rgba(255,106,0,0.4)] shadow-[0_20px_50px_rgba(255,106,0,0.2)] p-4 z-50 animate-in fade-in zoom-in-95 backdrop-blur-md">
                <div className="flex items-center justify-between pb-3 border-b border-[rgba(255,106,0,0.18)]">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-white font-display">Hub Notifications</h4>
                    {unreadNotificationsCount > 0 && (
                      <Badge variant="orange" size="sm">{unreadNotificationsCount} new</Badge>
                    )}
                  </div>
                  {unreadNotificationsCount > 0 && (
                    <button
                      onClick={clearAllNotifications}
                      className="text-xs text-[#FF8500] hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <CheckCheck size={14} /> Mark all read
                    </button>
                  )}
                </div>

                <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        markNotificationRead(item.id);
                        if (item.link) {
                          navigate(item.link);
                          setNotificationsOpen(false);
                        }
                      }}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        item.read
                          ? 'bg-[#140F0C]/60 border-[rgba(255,106,0,0.15)] text-[#A6A09B]'
                          : 'bg-[#FF6A00]/12 border-[#FF6A00]/35 text-white shadow-[0_0_12px_rgba(255,106,0,0.15)]'
                      } hover:bg-[#FF6A00]/15 hover:border-[#FF6A00]/50`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-semibold text-white">{item.title}</p>
                        <span className="text-[10px] text-[#A6A09B] whitespace-nowrap">{item.time}</span>
                      </div>
                      <p className="text-[11px] text-[#A6A09B] mt-1 line-clamp-2">{item.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Dropdown (Student or Faculty) */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(prev => !prev)}
              className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-xl bg-[#100B08] border border-[rgba(255,106,0,0.30)] hover:border-[#FF6A00] transition-all cursor-pointer group shadow-inner"
              aria-label="User profile menu"
            >
              <img
                src={student.avatarUrl}
                alt={userRole === 'faculty' ? (userSession?.name || 'Dr. Rajesh Rao') : student.name}
                className="w-8 h-8 rounded-lg object-cover border border-[#FF8500]/60 group-hover:border-[#FFB347] transition-all"
              />
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-white leading-tight">
                  {userRole === 'faculty' ? (userSession?.name || 'Dr. Rajesh Rao') : student.name}
                </p>
                <p className="text-[10px] text-[#A6A09B] leading-tight font-mono">
                  {userRole === 'faculty' ? 'FAC-CSE-042' : student.id}
                </p>
              </div>
              <ChevronDown size={14} className="text-[#A6A09B] group-hover:text-white transition-colors" />
            </button>

            {/* Profile Popover */}
            {profileOpen && (
              <div className="absolute right-0 mt-3 w-64 rounded-2xl bg-[#100B08]/95 border border-[rgba(255,106,0,0.4)] shadow-[0_20px_50px_rgba(255,106,0,0.2)] p-3 z-50 backdrop-blur-md animate-in fade-in zoom-in-95">
                <div className="p-3 rounded-xl bg-[#140F0C] border border-[rgba(255,106,0,0.2)] mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-bold text-white">
                      {userRole === 'faculty' ? (userSession?.name || 'Dr. Rajesh Rao') : student.name}
                    </p>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#FF7A18]/20 text-[#FFE0A3] border border-[#FF7A18]/30 uppercase">
                      {userRole === 'faculty' ? 'Faculty' : 'Student'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#FF8500] font-mono">
                    {userRole === 'faculty' ? 'FAC-CSE-042' : student.id}
                  </p>
                  <p className="text-[10px] text-[#A6A09B] mt-0.5">
                    {userRole === 'faculty' ? 'Computer Science & AI Dept.' : student.department}
                  </p>
                </div>

                <div className="space-y-1 text-xs">
                  {userRole === 'faculty' ? (
                    <>
                      <NavLink
                        to="/faculty"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#A6A09B] hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <Building2 size={15} className="text-[#FF8500]" /> Faculty Hub
                      </NavLink>
                      <NavLink
                        to="/faculty?tab=students"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#A6A09B] hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <Users size={15} className="text-[#FF8500]" /> Student Registry
                      </NavLink>
                      <NavLink
                        to="/faculty?tab=syllabus"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#A6A09B] hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <BookOpen size={15} /> Syllabus Manager
                      </NavLink>
                      <NavLink
                        to="/faculty?tab=assignments"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#A6A09B] hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <Layers size={15} /> Assignments & Grading
                      </NavLink>
                      <NavLink
                        to="/reports"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#C5B5A8] hover:text-[#FFF8F0] hover:bg-white/5 transition-colors"
                      >
                        <Sparkles size={15} /> Institutional Reports
                      </NavLink>
                    </>
                  ) : (
                    <>
                      <NavLink
                        to="/students"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#A6A09B] hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <Users size={15} className="text-[#FF8500]" /> Student Directory
                      </NavLink>
                      <NavLink
                        to="/academic"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#A6A09B] hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <GraduationCap size={15} /> Academic Transcript
                      </NavLink>
                      <NavLink
                        to="/st-point"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#A6A09B] hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <Sparkles size={15} className="text-[#FF8500]" /> ST Point Diagnostic
                      </NavLink>
                    </>
                  )}

                  <NavLink
                    to="/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#C5B5A8] hover:text-[#FFF8F0] hover:bg-white/5 transition-colors"
                  >
                    <Settings size={15} /> Hub Settings & API
                  </NavLink>

                  <button
                    onClick={async () => {
                      setProfileOpen(false);
                      await logout();
                      navigate('/login', { replace: true });
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-300 hover:text-rose-100 bg-rose-950/30 hover:bg-rose-900/40 border border-rose-500/30 transition-all cursor-pointer font-medium text-xs mt-2"
                  >
                    <LogOut size={15} className="text-rose-400" /> Sign Out of ST²
                  </button>
                </div>

                <div className="pt-2 mt-2 border-t border-[rgba(255,122,24,0.18)] text-center">
                  <p className="text-[10px] text-[#C5B5A8]/70">Smarter Insights, Brighter Futures.</p>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
