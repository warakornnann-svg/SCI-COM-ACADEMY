// ============================================
// SCI-COM ACADEMY — Application State Context
// ============================================

import React, { createContext, useContext, useReducer, useEffect, useState, type ReactNode } from 'react';
import type {
  User,
  Enrollment,
  LessonProgress,
  UserAchievement,
  TypingResult,
  StudentProject,
  PortfolioProfile,
  Course,
  LabProgress,
  ProgrammingChallenge,
} from '../types';
import {
  initDatabase,
  getDatabaseStatus,
  getUserProfile,
  upsertUserProfile,
  getEnrollmentsFromDb,
  saveEnrollmentToDb,
  getLessonProgressFromDb,
  saveLessonProgressToDb,
  getStudentProjectsFromDb,
  saveStudentProjectToDb,
  deleteStudentProjectFromDb,
  getLabProgressFromDb,
  saveLabProgressToDb,
  getPortfolioSettingsFromDb,
  savePortfolioSettingsToDb,
  saveCourseToDb,
  deleteCourseFromDb,
  getCustomChallengesFromDb,
  saveCustomChallengeToDb,
  deleteCustomChallengeFromDb,
  type DatabaseStatus,
} from '../lib/database';

interface AppNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: string;
}

interface AppState {
  user: User | null;
  theme: 'dark' | 'light';
  sidebarCollapsed: boolean;
  sidebarMobileOpen: boolean;
  enrollments: Enrollment[];
  lessonProgress: LessonProgress[];
  userAchievements: UserAchievement[];
  typingHistory: TypingResult[];
  savedProjects: StudentProject[];
  labProgress: LabProgress[];
  customCourses: Course[];
  customChallenges: ProgrammingChallenge[];
  portfolioProfile: PortfolioProfile;
  notifications: AppNotification[];
}

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_USER_ROLE'; payload: User['role'] }
  | { type: 'SET_USER_LEVEL'; payload: User['level'] }
  | { type: 'SET_THEME'; payload: 'dark' | 'light' }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'TOGGLE_MOBILE_SIDEBAR' }
  | { type: 'CLOSE_MOBILE_SIDEBAR' }
  | { type: 'ENROLL_COURSE'; payload: Enrollment }
  | { type: 'UPDATE_LESSON_PROGRESS'; payload: LessonProgress }
  | { type: 'ADD_ACHIEVEMENT'; payload: UserAchievement }
  | { type: 'ADD_TYPING_RESULT'; payload: TypingResult }
  | { type: 'SAVE_PROJECT'; payload: StudentProject }
  | { type: 'DELETE_PROJECT'; payload: string }
  | { type: 'UPDATE_LAB_PROGRESS'; payload: LabProgress }
  | { type: 'SAVE_COURSE'; payload: Course }
  | { type: 'DELETE_COURSE'; payload: string }
  | { type: 'SAVE_CHALLENGE'; payload: ProgrammingChallenge }
  | { type: 'DELETE_CHALLENGE'; payload: string }
  | { type: 'UPDATE_PORTFOLIO_PROFILE'; payload: Partial<PortfolioProfile> }
  | { type: 'ADD_NOTIFICATION'; payload: AppNotification }
  | { type: 'DISMISS_NOTIFICATION'; payload: string }
  | { type: 'LOAD_STATE'; payload: Partial<AppState> }
  | { type: 'RESET_STATE' };

const initialState: AppState = {
  user: null, // Visitor by default; login or guest required for learning platform
  theme: 'dark',
  sidebarCollapsed: false,
  sidebarMobileOpen: false,
  enrollments: [],
  lessonProgress: [],
  userAchievements: [],
  typingHistory: [],
  savedProjects: [],
  labProgress: [],
  customCourses: [],
  customChallenges: [],
  portfolioProfile: {
    bio: 'ยินดีต้อนรับสู่แฟ้มสะสมผลงาน (Digital Portfolio) ของฉัน',
    isPublic: true,
    theme: 'slate',
    contactEmail: '',
    githubUrl: '',
    customSkills: ['HTML5', 'CSS3', 'JavaScript'],
  },
  notifications: [],
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };

    case 'SET_USER_ROLE': {
      if (!state.user) return state;
      return {
        ...state,
        user: { ...state.user, role: action.payload },
      };
    }

    case 'SET_USER_LEVEL': {
      if (!state.user) return state;
      return {
        ...state,
        user: { ...state.user, level: action.payload },
      };
    }

    case 'SET_THEME':
      return { ...state, theme: action.payload };

    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };

    case 'TOGGLE_MOBILE_SIDEBAR':
      return { ...state, sidebarMobileOpen: !state.sidebarMobileOpen };

    case 'CLOSE_MOBILE_SIDEBAR':
      return { ...state, sidebarMobileOpen: false };

    case 'ENROLL_COURSE': {
      const existing = state.enrollments.find(e => e.courseId === action.payload.courseId);
      if (existing) return state;
      return { ...state, enrollments: [...state.enrollments, action.payload] };
    }

    case 'UPDATE_LESSON_PROGRESS': {
      if (state.user?.role !== 'guest') {
        saveLessonProgressToDb(action.payload).catch(console.warn);
      }
      const idx = state.lessonProgress.findIndex(
        p => p.lessonId === action.payload.lessonId && p.courseId === action.payload.courseId
      );
      const newProgress = [...state.lessonProgress];
      if (idx >= 0) {
        newProgress[idx] = action.payload;
      } else {
        newProgress.push(action.payload);
      }

      // Update enrollment progress
      let updatedEnrollments = [...state.enrollments];
      const enrollmentIdx = updatedEnrollments.findIndex(e => e.courseId === action.payload.courseId);

      if (enrollmentIdx >= 0 && action.payload.completed) {
        const enrollment = updatedEnrollments[enrollmentIdx];
        const completedLessons = new Set(enrollment.completedLessons);
        completedLessons.add(action.payload.lessonId);
        updatedEnrollments[enrollmentIdx] = {
          ...enrollment,
          completedLessons: Array.from(completedLessons),
          lastAccessedAt: new Date().toISOString(),
          lastLessonId: action.payload.lessonId,
        };
      } else if (enrollmentIdx === -1 && action.payload.completed) {
        // Auto-enroll if not enrolled
        updatedEnrollments.push({
          userId: state.user?.id || 'guest',
          courseId: action.payload.courseId,
          enrolledAt: new Date().toISOString(),
          progress: 25,
          completedLessons: [action.payload.lessonId],
          lastAccessedAt: new Date().toISOString(),
          lastLessonId: action.payload.lessonId,
        });
      }

      // Add XP to user
      const updatedUser = state.user
        ? { ...state.user, xp: state.user.xp + 25 }
        : null;

      return {
        ...state,
        user: updatedUser,
        lessonProgress: newProgress,
        enrollments: updatedEnrollments,
      };
    }

    case 'ADD_ACHIEVEMENT': {
      const exists = state.userAchievements.find(a => a.achievementId === action.payload.achievementId);
      if (exists) return state;
      const updatedUser = state.user
        ? { ...state.user, xp: state.user.xp + 50 }
        : null;
      return {
        ...state,
        user: updatedUser,
        userAchievements: [...state.userAchievements, action.payload],
      };
    }

    case 'ADD_TYPING_RESULT': {
      const updatedUser = state.user
        ? { ...state.user, xp: state.user.xp + 15 }
        : null;
      return {
        ...state,
        user: updatedUser,
        typingHistory: [action.payload, ...state.typingHistory],
      };
    }

    case 'SAVE_PROJECT': {
      const idx = state.savedProjects.findIndex(p => p.id === action.payload.id);
      const newProjects = [...state.savedProjects];
      if (idx >= 0) {
        newProjects[idx] = action.payload;
      } else {
        newProjects.unshift(action.payload);
      }
      return { ...state, savedProjects: newProjects };
    }

    case 'DELETE_PROJECT':
      return {
        ...state,
        savedProjects: state.savedProjects.filter(p => p.id !== action.payload),
      };

    case 'UPDATE_LAB_PROGRESS': {
      if (state.user?.role !== 'guest') {
        saveLabProgressToDb(action.payload).catch(console.warn);
      }
      const existingIdx = state.labProgress.findIndex(
        l => l.labId === action.payload.labId && l.exerciseId === action.payload.exerciseId
      );
      const newLabProgress = [...state.labProgress];
      if (existingIdx >= 0) {
        newLabProgress[existingIdx] = action.payload;
      } else {
        newLabProgress.push(action.payload);
      }
      return {
        ...state,
        labProgress: newLabProgress,
      };
    }

    case 'SAVE_COURSE': {
      const idx = state.customCourses.findIndex(c => c.id === action.payload.id);
      const newCourses = [...state.customCourses];
      if (idx >= 0) {
        newCourses[idx] = action.payload;
      } else {
        newCourses.unshift(action.payload);
      }
      return { ...state, customCourses: newCourses };
    }

    case 'DELETE_COURSE':
      return {
        ...state,
        customCourses: state.customCourses.filter(c => c.id !== action.payload),
      };

    case 'SAVE_CHALLENGE': {
      const currentList = state.customChallenges || [];
      const idx = currentList.findIndex(c => c.id === action.payload.id);
      const newChallenges = [...currentList];
      if (idx >= 0) {
        newChallenges[idx] = action.payload;
      } else {
        newChallenges.unshift(action.payload);
      }
      return { ...state, customChallenges: newChallenges };
    }

    case 'DELETE_CHALLENGE':
      return {
        ...state,
        customChallenges: (state.customChallenges || []).filter(c => c.id !== action.payload),
      };

    case 'UPDATE_PORTFOLIO_PROFILE': {
      const updatedProfile = { ...state.portfolioProfile, ...action.payload };
      if (state.user?.role !== 'guest' && state.user?.id) {
        savePortfolioSettingsToDb(state.user.id, updatedProfile).catch(console.warn);
      }
      return {
        ...state,
        portfolioProfile: updatedProfile,
      };
    }

    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [...state.notifications, action.payload] };

    case 'DISMISS_NOTIFICATION':
      return { ...state, notifications: state.notifications.filter(n => n.id !== action.payload) };

    case 'LOAD_STATE':
      return { ...state, ...action.payload };

    case 'RESET_STATE':
      return { ...initialState };

    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Helpers
  isEnrolled: (courseId: string) => boolean;
  getCourseProgress: (courseId: string, totalLessons?: number) => number;
  isLessonCompleted: (lessonId: string) => boolean;
  getQuizScore: (lessonId: string) => number | undefined;
  addNotification: (type: AppNotification['type'], message: string) => void;
  login: (
    emailOrIdentifier: string,
    passwordOrDisplayName?: string,
    displayName?: string,
    role?: User['role'],
    level?: User['level']
  ) => Promise<User>;
  loginAsGuest: () => User;
  logout: () => void;
  setUserRole: (role: User['role']) => void;
  setUserLevel: (level: User['level']) => void;
  enrollCourse: (courseId: string) => void;
  saveProject: (project: StudentProject) => void;
  deleteProject: (projectId: string) => void;
  saveCustomCourse: (course: Course) => void;
  deleteCustomCourse: (courseId: string) => void;
  saveCustomChallenge: (challenge: ProgrammingChallenge) => Promise<void>;
  deleteCustomChallenge: (challengeId: string) => Promise<void>;
  saveLabExercise: (labId: string, exerciseId: string, completed: boolean, score?: number, code?: string) => void;
  isLabExerciseCompleted: (labId: string, exerciseId: string) => boolean;
  getLabExerciseScore: (labId: string, exerciseId: string) => number | undefined;
  resetAllData: () => void;
  dbStatus: DatabaseStatus;
  refreshDatabase: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEY = 'scicom-academy-v2-state';
const GUEST_STORAGE_KEY = 'scicom-guest-session-v2';

function isValidUuid(id?: string): boolean {
  if (!id) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

function loadPersistedState(): Partial<AppState> {
  // 1. Check if there is an active guest session in this browser tab
  try {
    const guestSaved = sessionStorage.getItem(GUEST_STORAGE_KEY);
    if (guestSaved) {
      const parsed = JSON.parse(guestSaved);
      if (parsed.user?.role === 'guest') {
        return {
          user: parsed.user,
          theme: parsed.theme || 'dark',
          enrollments: parsed.enrollments || [],
          lessonProgress: parsed.lessonProgress || [],
          userAchievements: parsed.userAchievements || [],
          typingHistory: parsed.typingHistory || [],
          savedProjects: parsed.savedProjects || [],
          labProgress: parsed.labProgress || [],
          customCourses: parsed.customCourses || [],
          customChallenges: parsed.customChallenges || [],
          portfolioProfile: parsed.portfolioProfile || initialState.portfolioProfile,
        };
      }
    }
  } catch {}

  // 2. Check localStorage for permanent accounts
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Make sure guest user is never loaded from localStorage
      const user = parsed.user?.role === 'guest' ? null : (parsed.user || null);
      return {
        user,
        theme: parsed.theme || 'dark',
        enrollments: parsed.enrollments || [],
        lessonProgress: parsed.lessonProgress || [],
        userAchievements: parsed.userAchievements || [],
        typingHistory: parsed.typingHistory || [],
        savedProjects: parsed.savedProjects || [],
        labProgress: parsed.labProgress || [],
        customCourses: parsed.customCourses || [],
        customChallenges: parsed.customChallenges || [],
        portfolioProfile: parsed.portfolioProfile || initialState.portfolioProfile,
      };
    }
  } catch {
    // Ignore parse errors
  }
  return {};
}

function persistState(state: AppState) {
  // CRITICAL: Guests NEVER save to permanent localStorage!
  // If the user leaves the website, all guest data disappears completely.
  if (state.user?.role === 'guest') {
    try {
      const toSave = {
        user: state.user,
        theme: state.theme,
        enrollments: state.enrollments,
        lessonProgress: state.lessonProgress,
        userAchievements: state.userAchievements,
        typingHistory: state.typingHistory,
        savedProjects: state.savedProjects,
        labProgress: state.labProgress,
        customCourses: state.customCourses,
        customChallenges: state.customChallenges,
        portfolioProfile: state.portfolioProfile,
      };
      // Keep only in tab's sessionStorage during current active tab lifetime
      sessionStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(toSave));
    } catch {}
    return;
  }

  // Normal registered users are saved to localStorage
  try {
    const toSave = {
      user: state.user,
      theme: state.theme,
      enrollments: state.enrollments,
      lessonProgress: state.lessonProgress,
      userAchievements: state.userAchievements,
      typingHistory: state.typingHistory,
      savedProjects: state.savedProjects,
      labProgress: state.labProgress,
      customCourses: state.customCourses,
      customChallenges: state.customChallenges,
      portfolioProfile: state.portfolioProfile,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch {
    // Ignore quota errors
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [dbStatus, setDbStatus] = useState<DatabaseStatus>(getDatabaseStatus());

  // Function to initialize and refresh data from persistent PostgreSQL
  const refreshDatabase = async () => {
    try {
      const status = await initDatabase();
      setDbStatus(status);

      if (status.isReady) {
        const isRegisteredUser = state.user && state.user.role !== 'guest' && isValidUuid(state.user.id);

        if (isRegisteredUser) {
          const userId = state.user!.id;
          const [dbEnrollments, dbProgress, dbProjects, dbLabProg, dbPortfolio, dbChallenges] = await Promise.all([
            getEnrollmentsFromDb(userId),
            getLessonProgressFromDb(userId),
            getStudentProjectsFromDb(),
            getLabProgressFromDb(userId),
            getPortfolioSettingsFromDb(userId),
            getCustomChallengesFromDb(),
          ]);

          const updates: Partial<AppState> = {};
          if (dbEnrollments.length > 0) updates.enrollments = dbEnrollments;
          if (dbProgress.length > 0) updates.lessonProgress = dbProgress;
          if (dbProjects.length > 0) updates.savedProjects = dbProjects;
          if (dbLabProg.length > 0) updates.labProgress = dbLabProg;
          if (dbPortfolio) updates.portfolioProfile = dbPortfolio;
          if (dbChallenges.length > 0) updates.customChallenges = dbChallenges;

          if (Object.keys(updates).length > 0) {
            dispatch({ type: 'LOAD_STATE', payload: updates });
          }
        } else {
          // For guests or visitors: only load custom catalog challenges, do not fetch user data
          const dbChallenges = await getCustomChallengesFromDb();
          if (dbChallenges.length > 0) {
            dispatch({ type: 'LOAD_STATE', payload: { customChallenges: dbChallenges } });
          }
        }
      }
    } catch (err) {
      console.warn('Database sync encountered a warning:', err);
    }
  };

  // Load persisted cache on mount, then sync with real PostgreSQL
  useEffect(() => {
    const persisted = loadPersistedState();
    if (Object.keys(persisted).length > 0) {
      dispatch({ type: 'LOAD_STATE', payload: persisted });
    }
    // Connect to persistent PostgreSQL database
    refreshDatabase();
  }, []);

  // Persist state on changes
  useEffect(() => {
    persistState(state);
  }, [
    state.user,
    state.theme,
    state.enrollments,
    state.lessonProgress,
    state.userAchievements,
    state.typingHistory,
    state.savedProjects,
    state.labProgress,
    state.customCourses,
    state.customChallenges,
    state.portfolioProfile,
  ]);

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
  }, [state.theme]);

  const isEnrolled = (courseId: string) =>
    state.enrollments.some(e => e.courseId === courseId);

  const getCourseProgress = (courseId: string, totalLessons?: number) => {
    const enrollment = state.enrollments.find(e => e.courseId === courseId);
    if (!enrollment) return 0;
    if (totalLessons && totalLessons > 0) {
      const completedCount = enrollment.completedLessons.length;
      return Math.min(100, Math.round((completedCount / totalLessons) * 100));
    }
    return enrollment.progress || 0;
  };

  const isLessonCompleted = (lessonId: string) =>
    state.lessonProgress.some(p => p.lessonId === lessonId && p.completed);

  const getQuizScore = (lessonId: string) => {
    const progress = state.lessonProgress.find(p => p.lessonId === lessonId);
    return progress?.quizScore;
  };

  const addNotification = (type: AppNotification['type'], message: string) => {
    const notification: AppNotification = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
    setTimeout(() => {
      dispatch({ type: 'DISMISS_NOTIFICATION', payload: notification.id });
    }, 4000);
  };

  /**
   * One-click Guest Mode entry
   * - Has student permissions across all learning paths, labs, and quizzes
   * - Ephemeral: Data will NOT be saved permanently (cleared completely when leaving website)
   */
  const loginAsGuest = (): User => {
    const guestUser: User = {
      id: `guest-${Date.now()}`,
      email: 'guest@scicom.local',
      displayName: 'ผู้มาเยือน (Guest)',
      role: 'guest',
      level: 'ม.4',
      xp: 0,
      streak: 1,
      createdAt: new Date().toISOString(),
    };

    try {
      sessionStorage.removeItem(GUEST_STORAGE_KEY);
    } catch {}

    dispatch({ type: 'RESET_STATE' });
    dispatch({ type: 'SET_USER', payload: guestUser });
    addNotification('info', 'เข้าสู่ระบบในฐานะ "ผู้มาเยือน" เรียบร้อยแล้ว (โหมดทดลองเรียน: ไม่บันทึกข้อมูลถาวร)');
    return guestUser;
  };

  const login = async (
    usernameOrIdentifier: string,
    passwordOrDisplayName?: string,
    displayName?: string,
    role?: User['role'],
    level?: User['level']
  ): Promise<User> => {
    const rawTarget = usernameOrIdentifier.trim();

    // Guest shortcut
    if (rawTarget.toLowerCase() === 'guest' || role === 'guest') {
      return loginAsGuest();
    }

    await initDatabase();

    const normalizedTarget = rawTarget.includes('@')
      ? rawTarget.toLowerCase()
      : `${rawTarget.toLowerCase()}@scicom.ac.th`;

    // 1. Admin Account: Name 'น่าน', Username 'admin', Password 'admin1234'
    if (rawTarget.toLowerCase() === 'admin' || normalizedTarget === 'admin@scicom.ac.th') {
      if (passwordOrDisplayName && passwordOrDisplayName !== 'admin1234') {
        throw new Error('รหัสผ่านผู้ดูแลระบบ (Admin) ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง');
      }

      const adminUser: User = {
        id: '00000000-0000-0000-0000-000000000001',
        email: 'admin@scicom.ac.th',
        displayName: 'น่าน',
        role: 'admin',
        level: 'ม.6',
        xp: 2500,
        streak: 15,
        createdAt: new Date().toISOString(),
      };

      await upsertUserProfile(adminUser);
      dispatch({ type: 'SET_USER', payload: adminUser });
      addNotification('success', 'ยินดีต้อนรับ ผู้ดูแลระบบ "น่าน" (Admin) เข้าสู่ระบบ!');
      return adminUser;
    }

    // 2. Query from database profiles table (by username or email)
    let profile = await getUserProfile(rawTarget);
    if (!profile) {
      profile = await getUserProfile(normalizedTarget);
    }

    // If first param was display name and second was username/email (backward compatibility)
    if (!profile && passwordOrDisplayName && passwordOrDisplayName.includes('@')) {
      profile = await getUserProfile(passwordOrDisplayName.trim());
    }

    // 3. Registration: user & pass only, no @gmail.com required
    if (!profile && displayName) {
      // SECURITY RULE: Public self-registration ALWAYS defaults to 'student'
      // Cannot self-assign 'admin' or 'teacher'
      if (passwordOrDisplayName && passwordOrDisplayName.length < 4) {
        throw new Error('รหัสผ่านต้องมีความยาวอย่างน้อย 4 ตัวอักษร');
      }

      // Save user credentials locally
      try {
        const creds = JSON.parse(localStorage.getItem('scicom-user-creds') || '{}');
        creds[rawTarget.toLowerCase()] = passwordOrDisplayName || '';
        localStorage.setItem('scicom-user-creds', JSON.stringify(creds));
      } catch {}

      const newStudent: User = {
        id: 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
          const r = (Math.random() * 16) | 0;
          return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
        }),
        email: normalizedTarget,
        displayName: displayName.trim(),
        role: 'student', // enforced student
        level: level || 'ม.4',
        xp: 50,
        streak: 1,
        createdAt: new Date().toISOString(),
      };

      await upsertUserProfile(newStudent);
      profile = newStudent;
    }

    // Verify password if logging into existing registered user
    if (profile && passwordOrDisplayName && !displayName && profile.role !== 'admin') {
      try {
        const creds = JSON.parse(localStorage.getItem('scicom-user-creds') || '{}');
        const savedPass = creds[rawTarget.toLowerCase()] || creds[profile.email.toLowerCase()];
        if (savedPass && savedPass !== passwordOrDisplayName) {
          throw new Error('รหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบรหัสผ่านอีกครั้ง');
        }
      } catch (err: any) {
        if (err.message.includes('รหัสผ่านไม่ถูกต้อง')) throw err;
      }
    }

    if (!profile) {
      throw new Error(`ไม่พบชื่อผู้ใช้ "${rawTarget}" ในระบบ กรุณาตรวจสอบชื่อผู้ใช้ สมัครสมาชิกใหม่ หรือเข้าใช้งานแบบผู้มาเยือน`);
    }

    dispatch({ type: 'SET_USER', payload: profile });
    addNotification('success', `ยินดีต้อนรับ ${profile.displayName} เข้าสู่ระบบ!`);
    return profile;
  };

  const logout = () => {
    const wasGuest = state.user?.role === 'guest';
    try {
      sessionStorage.removeItem(GUEST_STORAGE_KEY);
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        parsed.user = null;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      }
    } catch {}

    if (wasGuest) {
      // Complete wipe of all in-memory learning data for guest
      dispatch({ type: 'RESET_STATE' });
      addNotification('info', 'ออกจากระบบเรียบร้อยแล้ว — ข้อมูลในโหมดผู้มาเยือนถูกล้างทั้งหมด');
    } else {
      dispatch({ type: 'SET_USER', payload: null });
      addNotification('info', 'ออกจากระบบเรียบร้อยแล้ว');
    }
  };

  const setUserRole = (role: User['role']) => {
    // Only current admins are permitted to alter roles
    if (state.user?.role !== 'admin') {
      addNotification('error', 'สิทธิ์ไม่เพียงพอ: ไม่อนุญาตให้ผู้ใช้งานเปลี่ยนบทบาทตนเอง');
      return;
    }
    dispatch({ type: 'SET_USER_ROLE', payload: role });
    if (state.user) {
      upsertUserProfile({ ...state.user, role }).catch(console.warn);
    }
    addNotification('info', `เปลี่ยนบทบาทเป็น: ${role}`);
  };

  const setUserLevel = (level: User['level']) => {
    dispatch({ type: 'SET_USER_LEVEL', payload: level });
    if (state.user && state.user.role !== 'guest') {
      upsertUserProfile({ ...state.user, level }).catch(console.warn);
    }
    addNotification('info', `เปลี่ยนระดับชั้นเป็น: ${level}`);
  };

  const enrollCourse = (courseId: string) => {
    if (isEnrolled(courseId)) return;
    const enrollmentUserId = state.user?.id || 'guest';
    const enrollment: Enrollment = {
      userId: enrollmentUserId,
      courseId,
      enrolledAt: new Date().toISOString(),
      progress: 0,
      completedLessons: [],
      lastAccessedAt: new Date().toISOString(),
    };
    dispatch({ type: 'ENROLL_COURSE', payload: enrollment });
    if (state.user?.role !== 'guest' && isValidUuid(enrollmentUserId)) {
      saveEnrollmentToDb(enrollment).catch(console.warn);
    }
    addNotification('success', 'ลงทะเบียนเรียนคอร์สนี้สำเร็จแล้ว! เริ่มเรียนบทแรกได้ทันที');
  };

  const saveProject = (project: StudentProject) => {
    dispatch({ type: 'SAVE_PROJECT', payload: project });
    if (state.user?.role !== 'guest' && isValidUuid(project.userId)) {
      saveStudentProjectToDb(project).catch(console.warn);
    }
    addNotification('success', `บันทึกโปรเจกต์ "${project.title}" เรียบร้อยแล้ว`);
  };

  const deleteProject = (projectId: string) => {
    dispatch({ type: 'DELETE_PROJECT', payload: projectId });
    if (state.user?.role !== 'guest') {
      deleteStudentProjectFromDb(projectId).catch(console.warn);
    }
    addNotification('info', 'ลบโปรเจกต์ออกจากระบบแล้ว');
  };

  const saveCustomCourse = (course: Course) => {
    dispatch({ type: 'SAVE_COURSE', payload: course });
    saveCourseToDb(course).catch(console.warn);
    addNotification('success', `บันทึกคอร์ส "${course.title}" ลงฐานข้อมูล PostgreSQL เรียบร้อยแล้ว`);
  };

  const deleteCustomCourse = (courseId: string) => {
    dispatch({ type: 'DELETE_COURSE', payload: courseId });
    deleteCourseFromDb(courseId).catch(console.warn);
    addNotification('info', 'ลบคอร์สออกจากระบบและฐานข้อมูลแล้ว');
  };

  const saveCustomChallenge = async (challenge: ProgrammingChallenge) => {
    dispatch({ type: 'SAVE_CHALLENGE', payload: challenge });
    await saveCustomChallengeToDb(challenge);
    addNotification('success', `บันทึกโจทย์แบบฝึกหัด "${challenge.title}" ลงฐานข้อมูลเรียบร้อยแล้ว`);
  };

  const deleteCustomChallenge = async (challengeId: string) => {
    dispatch({ type: 'DELETE_CHALLENGE', payload: challengeId });
    await deleteCustomChallengeFromDb(challengeId);
    addNotification('info', 'ลบโจทย์ออกจากระบบและฐานข้อมูลแล้ว');
  };

  const saveLabExercise = (labId: string, exerciseId: string, completed: boolean, score?: number, code?: string) => {
    const labUserId = state.user?.id || 'guest';
    const payload: LabProgress = {
      userId: labUserId,
      labId,
      exerciseId,
      completed,
      score,
      completedAt: new Date().toISOString(),
      savedCode: code,
    };
    dispatch({ type: 'UPDATE_LAB_PROGRESS', payload });
    if (state.user?.role !== 'guest' && isValidUuid(labUserId)) {
      saveLabProgressToDb(payload).catch(console.warn);
    }
    if (completed && state.user) {
      const xpBonus = score || 30;
      const updatedUser = {
        ...state.user,
        xp: state.user.xp + xpBonus,
      };
      dispatch({ type: 'SET_USER', payload: updatedUser });
      if (state.user.role !== 'guest' && isValidUuid(labUserId)) {
        upsertUserProfile(updatedUser).catch(console.warn);
      }
    }
  };

  const isLabExerciseCompleted = (labId: string, exerciseId: string) =>
    state.labProgress.some(l => l.labId === labId && l.exerciseId === exerciseId && l.completed);

  const getLabExerciseScore = (labId: string, exerciseId: string) => {
    const found = state.labProgress.find(l => l.labId === labId && l.exerciseId === exerciseId);
    return found?.score;
  };

  const resetAllData = () => {
    localStorage.removeItem(STORAGE_KEY);
    try {
      sessionStorage.removeItem(GUEST_STORAGE_KEY);
    } catch {}
    dispatch({ type: 'RESET_STATE' });
    addNotification('warning', 'รีเซ็ตข้อมูลทั้งหมดกลับสู่ค่าเริ่มต้นแล้ว');
  };

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        isEnrolled,
        getCourseProgress,
        isLessonCompleted,
        getQuizScore,
        addNotification,
        login,
        loginAsGuest,
        logout,
        setUserRole,
        setUserLevel,
        enrollCourse,
        saveProject,
        deleteProject,
        saveCustomCourse,
        deleteCustomCourse,
        saveCustomChallenge,
        deleteCustomChallenge,
        saveLabExercise,
        isLabExerciseCompleted,
        getLabExerciseScore,
        resetAllData,
        dbStatus,
        refreshDatabase,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}

export default AppContext;
