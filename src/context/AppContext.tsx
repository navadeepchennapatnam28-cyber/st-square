import React, { createContext, useContext, useState, useEffect } from 'react';
import { StudentProfile, NotificationItem, ToastMessage } from '../types';
import { demoStudentProfile } from '../data/demoDashboard';
import { apiClient } from '../services/apiClient';
import { authService, UserSession } from '../services/authService';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

interface AppContextType {
  student: StudentProfile;
  setStudent: React.Dispatch<React.SetStateAction<StudentProfile>>;
  userSession: UserSession | null;
  userRole: 'student' | 'faculty' | 'admin';
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  isDemoMode: boolean;
  setDemoMode: (enabled: boolean) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  unreadNotificationsCount: number;
  toast: ToastMessage | null;
  showToast: (title: string, message?: string, type?: ToastMessage['type']) => void;
  hideToast: () => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const initialNotifications: NotificationItem[] = [
  {
    id: 'n-1',
    title: 'CS605 Attendance Alert',
    message: 'Natural Language Processing attendance is at 77.8%. Attend the next class to maintain margin.',
    time: '20 mins ago',
    read: false,
    type: 'alert',
    link: '/attendance',
  },
  {
    id: 'n-2',
    title: 'Placement Test Scheduled',
    message: 'Google Campus OA assessment date confirmed for Nov 20, 2026.',
    time: '2 hours ago',
    read: false,
    type: 'info',
    link: '/placement',
  },
  {
    id: 'n-3',
    title: 'ST Point Insight Generated',
    message: 'New personalized recommendation added for Dynamic Programming practice.',
    time: 'Yesterday',
    read: true,
    type: 'success',
    link: '/st-point',
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [student, setStudent] = useState<StudentProfile>(demoStudentProfile);
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [userRole, setUserRole] = useState<'student' | 'faculty' | 'admin'>('student');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isDemoMode, setIsDemoModeState] = useState<boolean>(!apiClient.isUsingApiMode());
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('st2_notifications') ?? localStorage.getItem('bytexl_notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync notifications to local storage
  useEffect(() => {
    localStorage.setItem('st2_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Load and synchronize user profile from database
  const refreshProfile = async () => {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setIsAuthenticated(true);
          const profile = await authService.getProfile(session.user.id);
          const role = (profile?.role || (session.user.app_metadata?.role as 'student' | 'faculty' | 'admin') || 'student');
          setUserRole(role);

          const liveSession: UserSession = {
            id: session.user.id,
            email: session.user.email || '',
            role,
            name: profile?.name || session.user.user_metadata?.name || 'Student',
            studentId: profile?.student_id || session.user.user_metadata?.student_id,
            department: profile?.department_name || session.user.user_metadata?.department,
          };
          setUserSession(liveSession);

          if (profile) {
            setStudent({
              name: profile.name,
              id: profile.student_id || profile.id.slice(0, 8),
              program: profile.program || 'B.Tech Computer Science & AI',
              semester: profile.current_semester || 7,
              avatarUrl: profile.avatar_url || demoStudentProfile.avatarUrl,
              email: profile.email,
              department: profile.department_name || 'Computer Science & AI',
              batch: profile.batch || '2022 - 2026',
            });
          }
        } else {
          // Check cached session
          const cachedStr = localStorage.getItem('st2_cached_session');
          if (cachedStr) {
            try {
              const cached: UserSession = JSON.parse(cachedStr);
              setIsAuthenticated(true);
              setUserSession(cached);
              setUserRole(cached.role);
              return;
            } catch {
              // ignore
            }
          }
          setIsAuthenticated(false);
          setUserSession(null);
          setUserRole('student');
        }
      } catch {
        // Fallback
        const cachedStr = localStorage.getItem('st2_cached_session');
        if (cachedStr) {
          try {
            const cached: UserSession = JSON.parse(cachedStr);
            setIsAuthenticated(true);
            setUserSession(cached);
            setUserRole(cached.role);
            return;
          } catch {
            // ignore
          }
        }
      }
    } else {
      const cachedStr = localStorage.getItem('st2_cached_session');
      if (cachedStr) {
        try {
          const cached: UserSession = JSON.parse(cachedStr);
          setIsAuthenticated(true);
          setUserSession(cached);
          setUserRole(cached.role);
          return;
        } catch {
          // ignore
        }
      }
      setIsAuthenticated(false);
      setUserSession(null);
      setUserRole('student');
    }
  };

  // Setup Supabase auth session listener and Realtime notifications
  useEffect(() => {
    refreshProfile();

    if (isSupabaseConfigured() && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (session?.user) {
          refreshProfile();
        } else if (event === 'SIGNED_OUT') {
          localStorage.removeItem('st2_cached_session');
          setIsAuthenticated(false);
          setUserSession(null);
          setUserRole('student');
        } else {
          // If session is null on initial check, preserve valid cached session if one exists
          const cachedStr = localStorage.getItem('st2_cached_session');
          if (cachedStr) {
            try {
              const cached: UserSession = JSON.parse(cachedStr);
              setIsAuthenticated(true);
              setUserSession(cached);
              setUserRole(cached.role);
              return;
            } catch {
              // ignore
            }
          }
          setIsAuthenticated(false);
          setUserSession(null);
          setUserRole('student');
        }
      });

      // 1. Postgres Changes Listener on 'notifications'
      const notifChannel = supabase
        .channel('user_notifications')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'notifications' },
          (payload) => {
            const newNotif = payload.new as any;
            setNotifications((prev) => [
              {
                id: newNotif.id || 'notif-' + Date.now(),
                title: newNotif.title,
                message: newNotif.message,
                time: 'Just now',
                read: false,
                type: newNotif.type || 'info',
                link: newNotif.link,
              },
              ...prev,
            ]);
            showToast(newNotif.title, newNotif.message, 'info');
          }
        )
        .subscribe();

      // 2. High-speed Realtime Broadcast Channel ('st2_realtime_hub')
      const broadcastChannel = supabase
        .channel('st2_realtime_hub')
        .on('broadcast', { event: 'realtime_event' }, (payload: any) => {
          if (payload?.payload?.title) {
            showToast(payload.payload.title, payload.payload.message || 'Real-time telemetry event received', 'info');
            if (payload.payload.addNotification) {
              setNotifications((prev) => [
                {
                  id: 'rt-' + Date.now(),
                  title: payload.payload.title,
                  message: payload.payload.message,
                  time: 'Just now',
                  read: false,
                  type: 'info',
                  link: payload.payload.link,
                },
                ...prev,
              ]);
            }
          }
        })
        .subscribe();

      // 3. Window CustomEvent listener for cross-component real-time events
      const handleCustomRealtime = (e: Event) => {
        const customEvent = e as CustomEvent;
        if (customEvent.detail?.title) {
          showToast(customEvent.detail.title, customEvent.detail.message, customEvent.detail.type || 'info');
        }
      };
      window.addEventListener('st2:realtime', handleCustomRealtime);

      return () => {
        subscription.unsubscribe();
        window.removeEventListener('st2:realtime', handleCustomRealtime);
        if (supabase) {
          supabase.removeChannel(notifChannel);
          supabase.removeChannel(broadcastChannel);
        }
      };
    }
  }, []);

  const logout = async () => {
    await authService.logout();
    setIsAuthenticated(false);
    setUserSession(null);
    setUserRole('student');
    setStudent(demoStudentProfile);
    showToast('Signed Out', 'You have been safely signed out of ST².', 'info');
  };

  const setDemoMode = (enabled: boolean) => {
    setIsDemoModeState(enabled);
    apiClient.setApiMode(!enabled);
    showToast(
      enabled ? 'Demo Mode Active' : 'API Mode Enabled',
      enabled ? 'Running locally with simulated demo data & offline persistence.' : 'Now connecting to configured VITE_API_BASE_URL.',
      'info'
    );
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    if (supabase) {
      supabase.from('notifications').update({ is_read: true }).eq('id', id).then();
    }
  };

  const clearAllNotifications = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    if (supabase) {
      supabase.from('notifications').update({ is_read: true }).neq('id', '').then();
    }
    showToast('Notifications Cleared', 'All notices marked as read', 'info');
  };

  const showToast = (title: string, message?: string, type: ToastMessage['type'] = 'info') => {
    setToast({ id: String(Date.now()), title, message, type });
    setTimeout(() => {
      setToast(curr => (curr?.title === title ? null : curr));
    }, 4500);
  };

  const hideToast = () => {
    setToast(null);
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        student,
        setStudent,
        userSession,
        userRole,
        isAuthenticated,
        logout,
        refreshProfile,
        isDemoMode,
        setDemoMode,
        searchQuery,
        setSearchQuery,
        notifications,
        markNotificationRead,
        clearAllNotifications,
        unreadNotificationsCount,
        toast,
        showToast,
        hideToast,
        sidebarCollapsed,
        setSidebarCollapsed,
        mobileMenuOpen,
        setMobileMenuOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

