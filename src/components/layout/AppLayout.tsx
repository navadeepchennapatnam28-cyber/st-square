import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { Toast } from '../ui/Toast';
import { WaterBubblesBackground } from './WaterBubblesBackground';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#100D0B] text-[#FFF8F0] flex flex-col relative overflow-x-hidden selection:bg-[#FF7A18]/30 selection:text-[#FFE0A3]">
      {/* ==================================================
          SECTION 3: CINEMATIC ORANGE LIQUID GLASS BACKGROUND SYSTEM
          Deep dark brown (#24130D) & black (#100D0B) base colors,
          large blurred orange radial gradients (#FF7A18, #FF8C32, #FFB347),
          soft amber ambient lighting, subtle trails & floating glass spheres
          ================================================== */}
      
      {/* 1. Base Layer: Multi-radial ambient gradient field */}
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

      {/* 2. Top-Right Glowing Amber/Orange Primary Sunbeam Orb */}
      <div className="fixed -top-48 -right-48 w-[52rem] h-[52rem] rounded-full bg-gradient-to-bl from-[#FF7A18]/25 via-[#FF8C32]/12 to-transparent blur-[120px] pointer-events-none z-0" />

      {/* 3. Top-Left Warm Orange Ambient Edge Lighting (reflecting near sidebar) */}
      <div className="fixed -top-36 -left-36 w-[44rem] h-[44rem] rounded-full bg-gradient-to-br from-[#FF8C32]/18 via-[#FFB347]/08 to-transparent blur-[110px] pointer-events-none z-0" />

      {/* 4. Subtle Ambient Orange Light Trails */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-15"
        style={{
          backgroundImage: `repeating-linear-gradient(
            135deg,
            rgba(255, 122, 24, 0.03) 0px,
            rgba(255, 122, 24, 0.03) 1px,
            transparent 1px,
            transparent 120px
          )`,
        }}
      />

      {/* 5. Center-Right Glowing Ambient Light Area */}
      <div className="fixed top-1/3 -right-24 w-[40rem] h-[40rem] rounded-full bg-gradient-to-l from-[#FF7A18]/12 via-[#FFB347]/06 to-transparent blur-[120px] pointer-events-none z-0" />

      {/* 6. Sidebar Edge Glow (Vertical soft reflection line) */}
      <div className="fixed left-64 top-0 bottom-0 w-32 bg-gradient-to-r from-[#FF7A18]/6 to-transparent blur-2xl pointer-events-none z-0 hidden lg:block" />

      {/* 7. Bottom-Left Cinematic Orange Ambient Edge Light */}
      <div className="fixed -bottom-52 -left-52 w-[48rem] h-[48rem] rounded-full bg-gradient-to-tr from-[#FF7A18]/20 via-[#FF8C32]/10 to-transparent blur-[130px] pointer-events-none z-0" />

      {/* 9. Floating Liquid Water Bubbles System across Every Page */}
      <WaterBubblesBackground />

      {/* Top Navbar */}
      <Navbar />

      {/* Main Layout Area: Persistent Left Sidebar + Main Content Viewport */}
      <div className="flex-1 flex w-full max-w-[1720px] mx-auto overflow-hidden relative z-10">
        <Sidebar />
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10 w-full min-w-0 flex flex-col justify-between">
          <div>
            <Outlet />
          </div>

          {/* ST² Global Footer (Section 1) */}
          <footer className="mt-12 pt-6 pb-4 border-t border-[rgba(255,122,24,0.20)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#C5B5A8]">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-[#FFF8F0] font-display flex items-center">
                ST<sup className="text-xs font-bold text-[#FF8C32] ml-0.5">²</sup>
              </span>
              <span className="text-[#FF7A18]">•</span>
              <span className="text-[#C5B5A8] font-medium tracking-wide">STUDENT GROWTH HUB</span>
              <span className="hidden md:inline text-[#8F8176]">
                — "Smarter Insights, Brighter Futures."
              </span>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="text-[#FFE0A3]/80">Live Cohort Telemetry Active</span>
              <span className="text-[#8F8176]">&copy; 2026 ST² Inc. All rights reserved.</span>
            </div>
          </footer>
        </main>
      </div>

      {/* Mobile Slide-out Drawer */}
      <MobileNav />

      {/* Global Toast System */}
      <Toast />
    </div>
  );
};
