import React from 'react';
import { NavLink } from 'react-router-dom';
import { X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { navigationSections, facultyNavigationSections } from './Sidebar';
import { STSquareLogo } from '../ui/STSquareLogo';

export const MobileNav: React.FC = () => {
  const { mobileMenuOpen, setMobileMenuOpen, student, isDemoMode, userRole, userSession } = useApp();

  if (!mobileMenuOpen) return null;

  const currentSections = userRole === 'faculty' ? facultyNavigationSections : navigationSections;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#100D0B]/85 backdrop-blur-md transition-opacity"
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Slide-out Menu */}
      <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-[#1A120E] border-r border-[rgba(255,122,24,0.30)] shadow-[0_0_50px_rgba(255,122,24,0.2)] flex flex-col z-10 animate-in slide-in-from-left duration-300">
        {/* Header */}
        <div className="p-4 border-b border-[rgba(255,122,24,0.20)] flex items-center justify-between">
          <STSquareLogo size="sm" />
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-1.5 rounded-lg text-[#C5B5A8] hover:text-[#FFF8F0] hover:bg-white/10 cursor-pointer"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* User Quick Card */}
        <div className="p-3.5 mx-3 my-3 rounded-xl bg-gradient-to-br from-[#FF7A18]/15 via-[#24130D] to-[#100D0B] border border-[rgba(255,122,24,0.30)] flex items-center gap-3">
          <img
            src={student.avatarUrl}
            alt={userSession?.name || student.name}
            className="w-10 h-10 rounded-lg object-cover border border-[#FF8C32]/60"
          />
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-[#FFF8F0] truncate">
              {userRole === 'faculty' ? (userSession?.name || 'Dr. Rajesh Rao') : student.name}
            </p>
            <p className="text-[10px] text-[#C5B5A8] font-mono truncate">
              {userRole === 'faculty' ? 'FACULTY ID: FAC-CSE-042' : student.id}
            </p>
            <span className="inline-block mt-0.5 text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-[#FF7A18]/20 text-[#FFE0A3] border border-[#FF7A18]/30">
              {userRole === 'faculty' ? 'Faculty Portal' : (isDemoMode ? 'Demo Mode' : 'API Mode')}
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 px-3 py-2 space-y-4 overflow-y-auto no-scrollbar">
          {currentSections.map((sec, secIdx) => (
            <div key={secIdx} className="space-y-1">
              {sec.title && (
                <p className="px-3 text-[10px] font-bold tracking-widest text-[#8F8176] uppercase mb-1">
                  {sec.title}
                </p>
              )}
              {sec.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={`${item.label}-${item.path}`}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                        isActive
                          ? 'text-[#FFF8F0] bg-gradient-to-r from-[#FF7A18]/25 to-[#FF8C32]/12 border border-[rgba(255,122,24,0.45)] shadow-sm'
                          : 'text-[#C5B5A8] hover:text-[#FFF8F0] hover:bg-white/5'
                      }`
                    }
                  >
                    <Icon size={17} className="text-[#FF8C32]" />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-[#FF7A18]/20 text-[#FFE0A3] border border-[#FF7A18]/30">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[rgba(255,122,24,0.20)] text-center text-[10px] text-[#C5B5A8]">
          ST² Student Growth Hub &copy; 2026
        </div>
      </div>
    </div>
  );
};
