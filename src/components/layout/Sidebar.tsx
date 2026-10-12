import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  LineChart,
  ShieldAlert,
  Sparkles,
  FileSpreadsheet,
  GraduationCap,
  CalendarCheck,
  BookOpen,
  Trophy,
  Briefcase,
  Layers,
  Code2,
  FolderGit2,
  Rocket,
  Settings as SettingsIcon,
  ChevronLeft,
  ChevronRight,
  Target,
  Bot,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { STSquareLogo } from '../ui/STSquareLogo';

export interface NavSection {
  title?: string;
  items: {
    label: string;
    path: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    badge?: string;
    badgeColor?: 'orange' | 'amber' | 'green';
  }[];
}

export const navigationSections: NavSection[] = [
  {
    title: 'CORE ENGINE',
    items: [
      { label: 'Dashboard', path: '/', icon: LayoutDashboard },
      { label: 'Students', path: '/students', icon: Users, badge: '1,240', badgeColor: 'orange' },
      { label: 'Analytics', path: '/academic', icon: LineChart },
      { label: 'Interventions', path: '/interventions', icon: ShieldAlert, badge: '86 Alert', badgeColor: 'amber' },
      { label: 'Recommendations', path: '/st-point', icon: Sparkles, badge: 'AI', badgeColor: 'orange' },
      { label: 'Reports', path: '/reports', icon: FileSpreadsheet },
    ],
  },
  {
    title: 'STUDENT PILLARS',
    items: [
      { label: 'Attendance', path: '/attendance', icon: CalendarCheck, badge: '89.4%', badgeColor: 'green' },
      { label: 'LMS Activity', path: '/lms', icon: BookOpen },
      { label: 'Engagement', path: '/engagement', icon: Trophy },
      { label: 'Placement Readiness', path: '/placement', icon: Briefcase, badge: '76%', badgeColor: 'orange' },
      { label: 'Mock Interview', path: '/mock-interview', icon: Bot, badge: 'AI', badgeColor: 'orange' },
      { label: 'Assignments', path: '/assignments', icon: Layers, badge: '3 Due', badgeColor: 'orange' },
      { label: 'Skills & Feedback', path: '/skills', icon: Target, badge: 'Radar', badgeColor: 'amber' },
      { label: 'ST Point', path: '/st-point', icon: GraduationCap, badge: '920 pts', badgeColor: 'amber' },
    ],
  },
  {
    title: 'INNOVATION & CODE',
    items: [
      { label: 'Pro Code', path: '/pro-code', icon: Code2, badge: '120+' },
      { label: 'My Projects', path: '/projects', icon: FolderGit2, badge: '8', badgeColor: 'orange' },
      { label: 'Startup Desk', path: '/startup-desk', icon: Rocket, badge: 'New', badgeColor: 'amber' },
    ],
  },
  {
    title: 'PREFERENCES',
    items: [
      { label: 'Settings', path: '/settings', icon: SettingsIcon },
      { label: 'Profile', path: '/settings', icon: Users },
    ],
  },
];

export const facultyNavigationSections: NavSection[] = [
  {
    title: 'FACULTY SUITE',
    items: [
      { label: 'Faculty Hub', path: '/faculty', icon: LayoutDashboard },
      { label: 'Placement Analytics', path: '/faculty?tab=placement', icon: Briefcase, badge: '85.2%', badgeColor: 'orange' },
      { label: 'Academic Performance', path: '/faculty?tab=analytics', icon: LineChart, badge: 'Analytics', badgeColor: 'amber' },
      { label: 'Student Registry', path: '/faculty?tab=students', icon: Users, badge: 'Roster', badgeColor: 'orange' },
      { label: 'Syllabus Manager', path: '/faculty?tab=syllabus', icon: BookOpen, badge: '5 Units', badgeColor: 'amber' },
      { label: 'Course Desk', path: '/faculty?tab=courses', icon: GraduationCap },
    ],
  },
  {
    title: 'ACADEMIC OPERATIONS',
    items: [
      { label: 'Assignments & Grading', path: '/faculty?tab=assignments', icon: Layers, badge: 'Grading', badgeColor: 'orange' },
      { label: 'Attendance Ledger', path: '/faculty?tab=attendance', icon: CalendarCheck, badge: 'Active', badgeColor: 'green' },
      { label: 'Notices & Broadcasts', path: '/faculty?tab=announcements', icon: Sparkles },
    ],
  },
  {
    title: 'INSTITUTIONAL INSIGHTS',
    items: [
      { label: 'Cohort Reports', path: '/reports', icon: FileSpreadsheet },
      { label: 'Faculty Settings', path: '/settings', icon: SettingsIcon },
    ],
  },
];

export const Sidebar: React.FC = () => {
  const { sidebarCollapsed, setSidebarCollapsed, userRole } = useApp();
  const location = useLocation();

  const currentSections = userRole === 'faculty' ? facultyNavigationSections : navigationSections;

  return (
    <aside
      className={`hidden lg:flex flex-col shrink-0 border-r border-[rgba(255,122,24,0.30)] bg-[#1A120E]/85 backdrop-blur-md transform-gpu shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),4px_0_28px_rgba(0,0,0,0.35)] transition-all duration-300 relative z-30 ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Sidebar Header Brand (when expanded, compact logo) */}
      <div className="p-4 border-b border-[rgba(255,122,24,0.20)] flex items-center justify-between">
        <STSquareLogo size="sm" collapsed={sidebarCollapsed} />
      </div>

      {/* Navigation items list */}
      <div className="flex-1 py-3 px-3 space-y-4 overflow-y-auto no-scrollbar">
        {currentSections.map((sec, secIdx) => (
          <div key={secIdx} className="space-y-1">
            {!sidebarCollapsed && sec.title && (
              <p className="px-3 text-[10px] font-bold tracking-widest text-[#8F8176] uppercase mb-1.5">
                {sec.title}
              </p>
            )}

            {sec.items.map((item) => {
              const Icon = item.icon;
              const isExplicitQueryMatch = item.path.includes('?');
              const isCurrentActive = isExplicitQueryMatch
                ? (location.pathname + location.search) === item.path
                : (item.path === '/faculty' ? location.pathname === '/faculty' && !location.search : location.pathname === item.path);

              return (
                <NavLink
                  key={`${item.label}-${item.path}`}
                  to={item.path}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={() =>
                    `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 group relative ${
                      isCurrentActive
                        ? 'text-[#FFF8F0] bg-gradient-to-r from-[#FF7A18]/25 via-[#FF8C32]/12 to-transparent border border-[rgba(255,122,24,0.45)] shadow-[0_0_20px_rgba(255,122,24,0.22)]'
                        : 'text-[#C5B5A8] hover:text-[#FFF8F0] hover:bg-white/[0.04]'
                    }`
                  }
                >
                  {() => (
                    <>
                      <Icon
                        size={17}
                        className={`shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                          isCurrentActive ? 'text-[#FF8C32]' : 'text-[#C5B5A8] group-hover:text-[#FFF8F0]'
                        }`}
                      />
                      {!sidebarCollapsed && (
                        <span className="truncate flex-1">{item.label}</span>
                      )}
                      {!sidebarCollapsed && item.badge && (
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                            item.badgeColor === 'green'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-[#FF7A18]/20 text-[#FFE0A3] border border-[#FF7A18]/30'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      {isCurrentActive && (
                        <div className="absolute left-0 top-1 bottom-1 w-1 rounded-r-full bg-gradient-to-b from-[#FF7A18] to-[#FF8C32]" />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </div>

      {/* Collapse Toggle Footer */}
      <div className="p-3 border-t border-[rgba(255,122,24,0.20)] flex items-center justify-between">
        {!sidebarCollapsed && (
          <div className="text-[11px] text-[#C5B5A8] font-medium px-2">
            Collapse Sidebar
          </div>
        )}
        <button
          onClick={() => setSidebarCollapsed(prev => !prev)}
          className={`p-2 rounded-xl text-[#C5B5A8] hover:text-[#FF8C32] hover:bg-white/5 transition-all cursor-pointer ${
            sidebarCollapsed ? 'mx-auto' : ''
          }`}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
        </button>
      </div>
    </aside>
  );
};
