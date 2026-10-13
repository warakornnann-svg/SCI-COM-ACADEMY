import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Plus,
  Play,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Eye,
  FileText,
  Layers,
  BookOpen,
  BarChart3,
  TrendingUp,
  X,
  Sparkles,
  Lock,
  ArrowRight,
  HelpCircle,
  Code2,
  CheckSquare,
  Award,
  Users,
  UserCheck,
  UserPlus,
  Save,
  Clock,
  Settings,
  ChevronDown,
  ChevronUp,
  FolderPlus,
  FilePlus,
  ListOrdered
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { courses as defaultCourses, courseCategories } from '../data/courses';
import type { Course, Module, Lesson, ContentSection, User } from '../types';
import { CreateChallengeModal } from '../components/CreateChallengeModal';
import {
  getAllProfilesFromDb,
  updateUserRoleInDb,
  deleteUserProfileFromDb,
  createProfileInDb,
  saveCourseToDb,
  deleteCourseFromDb,
  saveQuizToDb,
  initDatabase,
  getDatabaseStatus
} from '../lib/database';

export const AdminCMS: React.FC = () => {
  const navigate = useNavigate();
  const { state, saveCustomCourse, deleteCustomCourse, addNotification, deleteCustomChallenge } = useApp();

  const [activeTab, setActiveTab] = useState<'courses' | 'modules-lessons' | 'exercises' | 'users'>('courses');
  const [exerciseSubTab, setExerciseSubTab] = useState<'coding' | 'quizzes'>('coding');
  const [showCreateChallengeModal, setShowCreateChallengeModal] = useState(false);

  // Courses state
  const [coursesList, setCoursesList] = useState<Course[]>(() => [...defaultCourses, ...state.customCourses]);
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [selectedCourseId, setSelectedCourseId] = useState<string>(defaultCourses[0]?.id || 'comp-fund-101');

  // Course Modal state
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseTitleEn, setCourseTitleEn] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [courseCategory, setCourseCategory] = useState('computer-fundamentals');
  const [courseLevel, setCourseLevel] = useState<'ม.4' | 'ม.5' | 'ม.6'>('ม.4');
  const [courseDifficulty, setCourseDifficulty] = useState<'เริ่มต้น' | 'ปานกลาง' | 'ขั้นสูง'>('เริ่มต้น');
  const [courseHours, setCourseHours] = useState(12);
  const [courseObjectives, setCourseObjectives] = useState('เข้าใจหลักการทำงาน, นำไปประยุกต์ใช้งานได้จริง');
  const [coursePrereqs, setCoursePrereqs] = useState('');
  const [courseStatus, setCourseStatus] = useState<'published' | 'draft' | 'archived'>('published');

  // Module Modal state
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [moduleTitle, setModuleTitle] = useState('');
  const [moduleDesc, setModuleDesc] = useState('');

  // Lesson Modal state
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [editingLessonModuleId, setEditingLessonModuleId] = useState<string>('');
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonType, setLessonType] = useState<'reading' | 'quiz' | 'coding' | 'interactive'>('reading');
  const [lessonMinutes, setLessonMinutes] = useState(15);
  const [lessonStatus, setLessonStatus] = useState<'published' | 'draft'>('published');
  const [lessonSections, setLessonSections] = useState<ContentSection[]>([
    { type: 'heading', content: '📘 บทนำ' },
    { type: 'text', content: 'อธิบายรายละเอียดเนื้อหาของบทเรียนนี้...' },
  ]);

  // Exercise / Quiz Modal state
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [quizTitle, setQuizTitle] = useState('');
  const [quizCourseId, setQuizCourseId] = useState('comp-fund-101');
  const [quizPassingScore, setQuizPassingScore] = useState(80);
  const [quizQuestions, setQuizQuestions] = useState<Array<{
    id: string;
    question: string;
    type: 'multiple-choice' | 'true-false' | 'coding';
    points: number;
    explanation: string;
    options: Array<{ id: string; optionText: string; isCorrect: boolean }>;
  }>>([
    {
      id: 'q-new-1',
      question: 'โจทย์คำถามทดสอบความเข้าใจข้อที่ 1',
      type: 'multiple-choice',
      points: 10,
      explanation: 'คำอธิบายเฉลยที่ถูกต้อง',
      options: [
        { id: 'opt-1-1', optionText: 'ตัวเลือก A (คำตอบที่ถูกต้อง)', isCorrect: true },
        { id: 'opt-1-2', optionText: 'ตัวเลือก B', isCorrect: false },
        { id: 'opt-1-3', optionText: 'ตัวเลือก C', isCorrect: false },
        { id: 'opt-1-4', optionText: 'ตัวเลือก D', isCorrect: false },
      ],
    },
  ]);

  // User Accounts Management state
  const [usersList, setUsersList] = useState<User[]>([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserDisplayName, setNewUserDisplayName] = useState('');
  const [newUserRole, setNewUserRole] = useState<User['role']>('student');
  const [newUserLevel, setNewUserLevel] = useState<User['level']>('ม.4');
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  // Sync courses list with state
  useEffect(() => {
    setCoursesList([...defaultCourses, ...state.customCourses]);
  }, [state.customCourses]);

  // Load user accounts for admin
  useEffect(() => {
    if (state.user?.role === 'admin' && activeTab === 'users') {
      loadUsers();
    }
  }, [state.user, activeTab]);

  const loadUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const profiles = await getAllProfilesFromDb();
      setUsersList(profiles);
    } catch (err) {
      console.warn('Failed to load users:', err);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // Authorization check: Only teachers and admins can view CMS
  const isAuthorized = state.user?.role === 'admin' || state.user?.role === 'teacher';

  if (!isAuthorized) {
    return (
      <div className="main-content" style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--color-warning-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-warning)',
            margin: '0 auto var(--space-4)',
          }}
        >
          <Lock size={32} />
        </div>
        <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold', marginBottom: 'var(--space-2)' }}>
          พื้นที่จำกัดสิทธิ์เฉพาะครูและผู้ดูแลระบบ (Access Denied)
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', maxWidth: '500px', margin: '0 auto var(--space-6)', lineHeight: 1.6 }}>
          บัญชีปัจจุบันของคุณคือ "{state.user?.displayName || 'ผู้มาเยือน'}" ในบทบาท "{state.user?.role || 'นักเรียน'}"
          ไม่มีสิทธิ์เข้าถึงระบบจัดการหลักสูตร กรุณาเข้าสู่ระบบด้วยบัญชีผู้ดูแลระบบหรือครูผู้สอน
        </p>

        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/login')}
            style={{ gap: '6px' }}
          >
            <ShieldCheck size={16} /> เข้าสู่ระบบด้วยบัญชี Admin / Teacher
          </button>
          <button className="btn btn-outline" onClick={() => navigate('/dashboard')}>
            กลับสู่หน้าหลัก
          </button>
        </div>
      </div>
    );
  }

  const selectedCourse = coursesList.find((c) => c.id === selectedCourseId) || coursesList[0];

  // -------------------------------------------------------------
  // Course Management Handlers
  // -------------------------------------------------------------
  const handleOpenCreateCourse = () => {
    setEditingCourseId(null);
    setCourseTitle('');
    setCourseTitleEn('');
    setCourseDesc('');
    setCourseCategory('computer-fundamentals');
    setCourseLevel('ม.4');
    setCourseDifficulty('เริ่มต้น');
    setCourseHours(12);
    setCourseObjectives('เข้าใจหลักการทำงาน, นำไปประยุกต์ใช้งานได้จริง');
    setCoursePrereqs('');
    setCourseStatus('published');
    setShowCourseModal(true);
  };

  const handleOpenEditCourse = (course: Course) => {
    setEditingCourseId(course.id);
    setCourseTitle(course.title);
    setCourseTitleEn(course.titleEn || '');
    setCourseDesc(course.description);
    setCourseCategory(course.categoryId);
    setCourseLevel(course.level === 'ทุกระดับ' ? 'ม.4' : course.level);
    setCourseDifficulty(course.difficulty);
    setCourseHours(course.estimatedHours);
    setCourseObjectives(course.objectives.join(', '));
    setCoursePrereqs(course.prerequisites.join(', '));
    setCourseStatus(course.status);
    setShowCourseModal(true);
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle.trim()) return;

    if (editingCourseId) {
      // Edit existing course
      const existing = coursesList.find((c) => c.id === editingCourseId);
      if (!existing) return;

      const updated: Course = {
        ...existing,
        title: courseTitle.trim(),
        titleEn: courseTitleEn.trim(),
        description: courseDesc.trim(),
        categoryId: courseCategory,
        level: courseLevel,
        difficulty: courseDifficulty,
        estimatedHours: Number(courseHours) || 10,
        objectives: courseObjectives.split(',').map((s) => s.trim()).filter(Boolean),
        prerequisites: coursePrereqs.split(',').map((s) => s.trim()).filter(Boolean),
        status: courseStatus,
      };

      saveCustomCourse(updated);
      await saveCourseToDb(updated);
      addNotification('success', `อัปเดตข้อมูลคอร์ส "${updated.title}" เรียบร้อยแล้ว`);
    } else {
      // Create new course
      const newCourseId = 'course-' + Date.now();
      const newModuleId = 'mod-1-' + Date.now();
      const newLessonId = 'les-1-' + Date.now();

      const newCourse: Course = {
        id: newCourseId,
        categoryId: courseCategory,
        title: courseTitle.trim(),
        titleEn: courseTitleEn.trim(),
        description: courseDesc.trim() || 'คำอธิบายหลักสูตรสร้างใหม่โดยผู้ดูแลระบบ',
        icon: 'BookOpen',
        level: courseLevel,
        difficulty: courseDifficulty,
        estimatedHours: Number(courseHours) || 10,
        prerequisites: coursePrereqs.split(',').map((s) => s.trim()).filter(Boolean),
        objectives: courseObjectives.split(',').map((s) => s.trim()).filter(Boolean),
        status: courseStatus,
        tags: [courseCategory, courseLevel],
        modules: [
          {
            id: newModuleId,
            courseId: newCourseId,
            title: 'โมดูล 1: บทนำและภาพรวม',
            description: 'ทำความเข้าใจเป้าหมายและเนื้อหาพื้นฐานของหลักสูตร',
            order: 1,
            lessons: [
              {
                id: newLessonId,
                moduleId: newModuleId,
                courseId: newCourseId,
                title: 'บทเรียนที่ 1: แนะนำวิชาและเครื่องมือ',
                type: 'reading',
                estimatedMinutes: 15,
                order: 1,
                status: 'published',
                content: {
                  sections: [
                    { type: 'heading', content: '📘 บทนำสู่หลักสูตร' },
                    { type: 'text', content: 'ยินดีต้อนรับสู่หลักสูตรที่สร้างขึ้นใหม่ผ่านระบบ Admin CMS' },
                  ],
                },
              },
            ],
          },
        ],
      };

      saveCustomCourse(newCourse);
      await saveCourseToDb(newCourse);
      setSelectedCourseId(newCourse.id);
      addNotification('success', `สร้างคอร์สใหม่ "${newCourse.title}" ลงฐานข้อมูลเรียบร้อยแล้ว`);
    }

    setShowCourseModal(false);
  };

  const handleToggleCoursePublish = async (course: Course) => {
    const nextStatus = course.status === 'published' ? 'draft' : 'published';
    const updated: Course = { ...course, status: nextStatus };
    saveCustomCourse(updated);
    await saveCourseToDb(updated);
    addNotification('info', `เปลี่ยนสถานะคอร์ส "${course.title}" เป็น ${nextStatus === 'published' ? 'เผยแพร่แล้ว (Published)' : 'ฉบับร่าง (Draft)'}`);
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบคอร์สนี้ออกจากระบบ?')) return;
    deleteCustomCourse(courseId);
    await deleteCourseFromDb(courseId);
    addNotification('warning', 'ลบคอร์สออกจากระบบและฐานข้อมูลเรียบร้อยแล้ว');
  };

  // -------------------------------------------------------------
  // Module & Lesson Handlers
  // -------------------------------------------------------------
  const handleAddModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moduleTitle.trim() || !selectedCourse) return;

    const newMod: Module = {
      id: 'mod-' + Date.now(),
      courseId: selectedCourse.id,
      title: moduleTitle.trim(),
      description: moduleDesc.trim() || 'คำอธิบายโมดูล',
      order: selectedCourse.modules.length + 1,
      lessons: [],
    };

    const updatedCourse: Course = {
      ...selectedCourse,
      modules: [...selectedCourse.modules, newMod],
    };

    saveCustomCourse(updatedCourse);
    await saveCourseToDb(updatedCourse);
    setShowModuleModal(false);
    setModuleTitle('');
    setModuleDesc('');
    addNotification('success', `เพิ่มโมดูล "${newMod.title}" ในคอร์สเรียบร้อยแล้ว`);
  };

  const handleOpenAddLesson = (moduleId: string) => {
    setEditingLessonModuleId(moduleId);
    setLessonTitle('');
    setLessonType('reading');
    setLessonMinutes(15);
    setLessonStatus('published');
    setLessonSections([
      { type: 'heading', content: '📘 หัวข้อบทเรียน' },
      { type: 'text', content: 'เนื้อหาและคำอธิบายบทเรียน...' },
    ]);
    setShowLessonModal(true);
  };

  const handleAddContentSection = (type: ContentSection['type']) => {
    if (type === 'heading') {
      setLessonSections([...lessonSections, { type: 'heading', content: 'หัวข้อย่อยใหม่' }]);
    } else if (type === 'code') {
      setLessonSections([...lessonSections, { type: 'code', language: 'javascript', content: '// เขียนโค้ดตัวอย่างที่นี่\nconsole.log("Hello, World!");' }]);
    } else if (type === 'callout') {
      setLessonSections([...lessonSections, { type: 'callout', variant: 'info', content: 'ข้อความแจ้งเตือนหรือข้อควรจำที่สำคัญ' }]);
    } else {
      setLessonSections([...lessonSections, { type: 'text', content: 'ย่อหน้าเนื้อหาคำอธิบาย...' }]);
    }
  };

  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonTitle.trim() || !selectedCourse) return;

    const targetModule = selectedCourse.modules.find((m) => m.id === editingLessonModuleId);
    if (!targetModule) return;

    const newLesson: Lesson = {
      id: 'les-' + Date.now(),
      moduleId: targetModule.id,
      courseId: selectedCourse.id,
      title: lessonTitle.trim(),
      type: lessonType,
      estimatedMinutes: Number(lessonMinutes) || 15,
      order: targetModule.lessons.length + 1,
      status: lessonStatus,
      content: {
        sections: lessonSections,
      },
    };

    const updatedModules = selectedCourse.modules.map((m) => {
      if (m.id === targetModule.id) {
        return { ...m, lessons: [...m.lessons, newLesson] };
      }
      return m;
    });

    const updatedCourse: Course = {
      ...selectedCourse,
      modules: updatedModules,
    };

    saveCustomCourse(updatedCourse);
    await saveCourseToDb(updatedCourse);
    setShowLessonModal(false);
    addNotification('success', `เพิ่มบทเรียน "${newLesson.title}" สำเร็จแล้ว`);
  };

  // -------------------------------------------------------------
  // Exercise & Assignment Handlers
  // -------------------------------------------------------------
  const handleSaveExercise = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizTitle.trim()) return;

    const quizId = 'quiz-' + Date.now();
    const targetCourse = coursesList.find((c) => c.id === quizCourseId) || coursesList[0];
    const targetLessonId = targetCourse.modules[0]?.lessons[0]?.id || 'les-default';

    const formattedQuiz = {
      id: quizId,
      courseId: targetCourse.id,
      lessonId: targetLessonId,
      title: quizTitle.trim(),
      passingScore: Number(quizPassingScore) || 80,
      questions: quizQuestions.map((q) => ({
        id: q.id,
        question: q.question,
        type: q.type,
        points: q.points,
        explanation: q.explanation,
        options: q.options,
      })),
    };

    await saveQuizToDb(formattedQuiz);
    setShowExerciseModal(false);
    addNotification('success', `บันทึกแบบฝึกหัด "${quizTitle}" (เกณฑ์ผ่าน ${quizPassingScore}%) ลงฐานข้อมูลเรียบร้อยแล้ว`);
  };

  // -------------------------------------------------------------
  // User Accounts & Role Assignment Handlers (Admin Only)
  // -------------------------------------------------------------
  const handleUpdateRole = async (targetUserId: string, newRole: User['role']) => {
    if (state.user?.role !== 'admin') {
      addNotification('error', 'สิทธิ์ไม่เพียงพอ: เฉพาะผู้ดูแลระบบสูงสุด (Admin) เท่านั้นที่สามารถเปลี่ยนบทบาทได้');
      return;
    }

    try {
      await updateUserRoleInDb(state.user.id, targetUserId, newRole);
      setUsersList((prev) =>
        prev.map((u) => (u.id === targetUserId ? { ...u, role: newRole } : u))
      );
      addNotification('success', `อัปเดตบทบาทผู้ใช้เป็น ${newRole.toUpperCase()} เรียบร้อยแล้ว`);
    } catch (err: any) {
      addNotification('error', err.message || 'เกิดข้อผิดพลาดในการเปลี่ยนบทบาท');
    }
  };

  const handleDeleteUser = async (targetUserId: string, targetDisplayName: string) => {
    if (state.user?.role !== 'admin') {
      addNotification('error', 'สิทธิ์ไม่เพียงพอ: เฉพาะผู้ดูแลระบบ (Admin) เท่านั้นที่สามารถลบบัญชีผู้ใช้ได้');
      return;
    }

    if (targetUserId === state.user.id || targetUserId === '00000000-0000-0000-0000-000000000001') {
      addNotification('error', 'ไม่สามารถลบบัญชีผู้ดูแลระบบหลัก (Admin) ของตนเองได้');
      return;
    }

    const confirmed = window.confirm(
      `คุณแน่ใจหรือไม่ว่าต้องการลบบัญชีผู้ใช้ "${targetDisplayName}" ออกจากระบบอย่างถาวร?\n\nคำเตือน: ข้อมูลความก้าวหน้า แบบทดสอบ และผลงานโครงงานทั้งหมดของผู้ใช้นี้จะถูกลบออกจากฐานข้อมูล`
    );

    if (!confirmed) return;

    try {
      await deleteUserProfileFromDb(state.user.id, targetUserId);
      setUsersList((prev) => prev.filter((u) => u.id !== targetUserId));
      addNotification('success', `ลบบัญชีผู้ใช้ "${targetDisplayName}" ออกจากระบบเรียบร้อยแล้ว`);
    } catch (err: any) {
      addNotification('error', err.message || 'เกิดข้อผิดพลาดในการลบบัญชีผู้ใช้');
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserEmail.trim() || !newUserDisplayName.trim()) return;

    const normalizedTarget = newUserEmail.includes('@')
      ? newUserEmail.trim()
      : `${newUserEmail.trim().toLowerCase()}@scicom.ac.th`;

    try {
      const created = await createProfileInDb({
        email: normalizedTarget,
        displayName: newUserDisplayName.trim(),
        role: newUserRole,
        level: newUserLevel,
      });

      setUsersList((prev) => [...prev, created]);
      setShowUserModal(false);
      setNewUserEmail('');
      setNewUserDisplayName('');
      addNotification('success', `สร้างบัญชี "${created.displayName}" (${created.role}) ลงในระบบเรียบร้อยแล้ว`);
    } catch (err: any) {
      addNotification('error', err.message || 'ไม่สามารถสร้างบัญชีได้');
    }
  };

  return (
    <div className="main-content" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-12)' }}>
      {/* Header */}
      <div className="page-header card-3d glass-panel" style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--color-accent-primary-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-accent-primary)',
              }}
            >
              <ShieldCheck size={26} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1 className="page-header-title">ระบบจัดการการเรียนรู้และหลักสูตร (Admin CMS)</h1>
                <span className={`badge ${state.user?.role === 'admin' ? 'badge-primary' : 'badge-warning'}`}>
                  {state.user?.role === 'admin' ? 'ผู้ดูแลระบบ (Admin)' : 'ครูผู้สอน (Teacher)'}
                </span>
              </div>
              <p className="page-header-desc">
                จัดการหลักสูตร, โมดูล, บทเรียน, แบบฝึกหัด และบัญชีผู้ใช้ เชื่อมโยงฐานข้อมูล PostgreSQL จริง
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button className="btn btn-primary" onClick={handleOpenCreateCourse} style={{ gap: '6px' }}>
              <Plus size={16} /> สร้างคอร์สใหม่
            </button>
            {state.user?.role === 'admin' && (
              <button className="btn btn-outline" onClick={() => setShowUserModal(true)} style={{ gap: '6px' }}>
                <UserPlus size={16} /> เพิ่มบัญชีผู้ใช้
              </button>
            )}
          </div>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-5)', flexWrap: 'wrap' }}>
          <button
            className={`btn btn-sm ${activeTab === 'courses' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('courses')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <BookOpen size={15} /> 1. จัดการคอร์สเรียน ({coursesList.length})
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'modules-lessons' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('modules-lessons')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Layers size={15} /> 2. จัดการโมดูลและบทเรียน
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'exercises' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('exercises')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <CheckSquare size={15} /> 3. จัดการแบบฝึกหัด & ข้อสอบ
          </button>
          {state.user?.role === 'admin' && (
            <button
              className={`btn btn-sm ${activeTab === 'users' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveTab('users')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Users size={15} /> 4. บัญชีผู้ใช้และกำหนดสิทธิ์
            </button>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: COURSES MANAGEMENT */}
      {/* ============================================================== */}
      {activeTab === 'courses' && (
        <div className="card glass-panel" style={{ padding: 'var(--space-5)', borderRadius: 'var(--radius-xl)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
            <div>
              <h3 className="card-title">คลังหลักสูตรทั้งหมดในระบบ (Course Management)</h3>
              <p className="card-subtitle">สร้าง แก้ไข เผยแพร่ หรือจัดเก็บเข้ากรุ พร้อมบันทึกลง PostgreSQL</p>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <select
                className="form-input form-select"
                style={{ width: 'auto' }}
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
              >
                <option value="all">ทุกหมวดหมู่</option>
                {courseCategories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 'var(--text-sm)' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-tertiary)' }}>
                  <th style={{ padding: 'var(--space-3)' }}>ชื่อหลักสูตร</th>
                  <th style={{ padding: 'var(--space-3)' }}>หมวดหมู่วิชา</th>
                  <th style={{ padding: 'var(--space-3)' }}>ระดับชั้น</th>
                  <th style={{ padding: 'var(--space-3)' }}>โมดูล/บทเรียน</th>
                  <th style={{ padding: 'var(--space-3)' }}>ชั่วโมง</th>
                  <th style={{ padding: 'var(--space-3)' }}>สถานะ</th>
                  <th style={{ padding: 'var(--space-3)', textAlign: 'right' }}>การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                {coursesList
                  .filter((c) => courseFilter === 'all' || c.categoryId === courseFilter)
                  .map((course) => {
                    const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
                    return (
                      <tr key={course.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td style={{ padding: 'var(--space-3)' }}>
                          <div style={{ fontWeight: 'bold', color: 'var(--color-text-primary)' }}>{course.title}</div>
                          <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>ID: {course.id}</div>
                        </td>
                        <td style={{ padding: 'var(--space-3)' }}>
                          <span className="badge badge-outline" style={{ fontSize: '11px' }}>
                            {courseCategories.find((cat) => cat.id === course.categoryId)?.name || course.categoryId}
                          </span>
                        </td>
                        <td style={{ padding: 'var(--space-3)' }}>
                          <span className="badge badge-primary">{course.level}</span>
                        </td>
                        <td style={{ padding: 'var(--space-3)' }}>
                          {course.modules.length} โมดูล ({totalLessons} บท)
                        </td>
                        <td style={{ padding: 'var(--space-3)' }}>{course.estimatedHours} ชม.</td>
                        <td style={{ padding: 'var(--space-3)' }}>
                          <button
                            type="button"
                            className={`badge ${course.status === 'published' ? 'badge-emerald' : 'badge-warning'}`}
                            onClick={() => handleToggleCoursePublish(course)}
                            style={{ cursor: 'pointer', border: 'none' }}
                            title="คลิกเพื่อสลับสถานะ เผยแพร่/ฉบับร่าง"
                          >
                            {course.status === 'published' ? '✓ เผยแพร่แล้ว' : 'ฉบับร่าง (Draft)'}
                          </button>
                        </td>
                        <td style={{ padding: 'var(--space-3)', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                            <Link
                              to={`/courses/${course.id}`}
                              className="btn btn-ghost btn-sm"
                              title="ดูตัวอย่างมุมมองนักเรียน (Student Preview)"
                            >
                              <Eye size={14} />
                            </Link>
                            <button
                              className="btn btn-ghost btn-sm"
                              onClick={() => handleOpenEditCourse(course)}
                              title="แก้ไขข้อมูลหลักสูตร"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              className="btn btn-ghost btn-sm"
                              onClick={() => handleDeleteCourse(course.id)}
                              style={{ color: 'var(--color-error)' }}
                              title="ลบหลักสูตร"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: MODULES & LESSONS MANAGEMENT */}
      {/* ============================================================== */}
      {activeTab === 'modules-lessons' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          {/* Course Selector Bar */}
          <div className="card glass-panel" style={{ padding: 'var(--space-4)', borderRadius: 'var(--radius-xl)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontWeight: 'bold', fontSize: 'var(--text-sm)' }}>เลือกหลักสูตรที่ต้องการจัดการ:</span>
                <select
                  className="form-input form-select"
                  style={{ minWidth: '320px' }}
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                >
                  {coursesList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} ({c.level} - {c.modules.length} โมดูล)
                    </option>
                  ))}
                </select>
              </div>

              <button className="btn btn-primary btn-sm" onClick={() => setShowModuleModal(true)} style={{ gap: '6px' }}>
                <FolderPlus size={15} /> เพิ่มโมดูลใหม่ในคอร์สนี้
              </button>
            </div>
          </div>

          {/* Modules and Lessons List */}
          {selectedCourse && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {selectedCourse.modules.map((mod, modIdx) => (
                <div key={mod.id} className="card glass-panel" style={{ padding: 'var(--space-5)', borderRadius: 'var(--radius-xl)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="badge badge-primary">โมดูล {modIdx + 1}</span>
                        <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold' }}>{mod.title}</h4>
                      </div>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                        {mod.description || 'ไม่มีคำอธิบาย'}
                      </p>
                    </div>

                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => handleOpenAddLesson(mod.id)}
                      style={{ gap: '6px' }}
                    >
                      <FilePlus size={14} /> เพิ่มบทเรียนในโมดูลนี้
                    </button>
                  </div>

                  {/* Lessons Table in Module */}
                  {mod.lessons.length > 0 ? (
                    <div style={{ background: 'rgba(0, 0, 0, 0.2)', borderRadius: 'var(--radius-md)', padding: 'var(--space-2)' }}>
                      {mod.lessons.map((les, lesIdx) => (
                        <div
                          key={les.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '8px 12px',
                            borderBottom: lesIdx === mod.lessons.length - 1 ? 'none' : '1px solid var(--color-border-subtle)',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', width: '20px' }}>
                              {lesIdx + 1}.
                            </span>
                            <span className={`badge ${les.type === 'reading' ? 'badge-blue' : les.type === 'quiz' ? 'badge-violet' : 'badge-amber'}`} style={{ fontSize: '10px' }}>
                              {les.type.toUpperCase()}
                            </span>
                            <span style={{ fontWeight: 500, fontSize: 'var(--text-sm)' }}>{les.title}</span>
                            <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>
                              ({les.estimatedMinutes} นาที)
                            </span>
                          </div>

                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                            <span className={`badge ${les.status === 'published' ? 'badge-emerald' : 'badge-warning'}`} style={{ fontSize: '10px' }}>
                              {les.status === 'published' ? 'เผยแพร่' : 'ร่าง'}
                            </span>
                            <Link
                              to={`/courses/${selectedCourse.id}/lessons/${les.id}`}
                              className="btn btn-ghost btn-sm"
                              title="เปิดดูบทเรียน (Preview)"
                            >
                              <Eye size={13} />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ padding: 'var(--space-4)', textAlign: 'center', color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)' }}>
                      ยังไม่มีบทเรียนในโมดูลนี้ คลิก "เพิ่มบทเรียนในโมดูลนี้" เพื่อเริ่มต้น
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: EXERCISES & ASSIGNMENTS MANAGEMENT */}
      {/* ============================================================== */}
      {activeTab === 'exercises' && (
        <div className="card glass-panel" style={{ padding: 'var(--space-5)', borderRadius: 'var(--radius-xl)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
            <div>
              <h3 className="card-title">คลังแบบฝึกหัดและการบ้าน (Exercise & Assessment Management)</h3>
              <p className="card-subtitle">สร้างโจทย์ฝึกเขียนโค้ด (Coding Labs) และแบบทดสอบท้ายบทเรียน พร้อมระบบตรวจคำตอบอัตโนมัติ</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className="btn btn-primary"
                onClick={() => setShowCreateChallengeModal(true)}
                style={{ gap: '6px', background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)' }}
              >
                <Plus size={16} /> สร้างโจทย์เขียนโค้ดใหม่ (Lab Challenge)
              </button>
              <button
                className="btn btn-outline"
                onClick={() => setShowExerciseModal(true)}
                style={{ gap: '6px' }}
              >
                <Plus size={16} /> สร้างแบบทดสอบบทเรียน (Quiz)
              </button>
            </div>
          </div>

          {/* Sub-tab Navigation */}
          <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
            <button
              className={`btn btn-sm ${exerciseSubTab === 'coding' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setExerciseSubTab('coding')}
              style={{ gap: '6px' }}
            >
              <Code2 size={15} /> 1. โจทย์เขียนโปรแกรม (Programming Labs) ({6 + (state.customChallenges || []).length})
            </button>
            <button
              className={`btn btn-sm ${exerciseSubTab === 'quizzes' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setExerciseSubTab('quizzes')}
              style={{ gap: '6px' }}
            >
              <CheckSquare size={15} /> 2. แบบทดสอบท้ายบทเรียน (Lesson Quizzes)
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {/* Stats Overview */}
            <div className="grid grid-cols-3">
              <div className="card-3d glass-panel" style={{ padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <Code2 size={18} color="#8b5cf6" />
                  <span style={{ fontWeight: 'bold' }}>โจทย์ฝึกเขียนโปรแกรม</span>
                </div>
                <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold', color: '#8b5cf6' }}>
                  {6 + (state.customChallenges || []).length} โจทย์
                </div>
                <p style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>
                  โจทย์ระบบ 6 ข้อ + คุณครูสร้าง {(state.customChallenges || []).length} ข้อ พร้อม Test Cases ตรวจอัตโนมัติ
                </p>
              </div>

              <div className="card-3d glass-panel" style={{ padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <CheckSquare size={18} color="#10b981" />
                  <span style={{ fontWeight: 'bold' }}>ระบบตรวจข้อสอบ</span>
                </div>
                <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold', color: '#10b981' }}>
                  PostgreSQL Engine
                </div>
                <p style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>
                  ตรวจผลคำตอบฝั่ง Backend ป้องกันการแก้ไขคำตอบหรือคะแนนจากเบราว์เซอร์
                </p>
              </div>

              <div className="card-3d glass-panel" style={{ padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <Award size={18} color="#f59e0b" />
                  <span style={{ fontWeight: 'bold' }}>เกณฑ์ผ่านการเรียน</span>
                </div>
                <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold', color: '#f59e0b' }}>
                  80% ขึ้นไป
                </div>
                <p style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>
                  นักเรียนต้องผ่านเกณฑ์ระบบจึงจะนับว่าจบบทเรียนและคำนวณ Progress 100%
                </p>
              </div>
            </div>

            {/* SUB-TAB 1: CODING CHALLENGES */}
            {exerciseSubTab === 'coding' && (
              <div style={{ overflowX: 'auto', marginTop: 'var(--space-2)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 'var(--text-sm)' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-tertiary)' }}>
                      <th style={{ padding: 'var(--space-3)' }}>ชื่อโจทย์ปัญหา (Challenge)</th>
                      <th style={{ padding: 'var(--space-3)' }}>ระดับชั้น</th>
                      <th style={{ padding: 'var(--space-3)' }}>หมวดหมู่</th>
                      <th style={{ padding: 'var(--space-3)' }}>ความยาก</th>
                      <th style={{ padding: 'var(--space-3)' }}>Test Cases</th>
                      <th style={{ padding: 'var(--space-3)' }}>ผู้สร้าง</th>
                      <th style={{ padding: 'var(--space-3)', textAlign: 'right' }}>การจัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Built-in Challenges */}
                    {[
                      { id: 'prog-1', title: 'คำนวณปี พ.ศ. สู่ปี ค.ศ. และอายุ', grade: 'ม.4', categoryLabel: '1. ตัวแปรและชนิดข้อมูล', difficulty: 'เริ่มต้น', testCount: 3, creator: 'ระบบ (Built-in)', isCustom: false },
                      { id: 'prog-2', title: 'ระบบตัดเกรดมัธยมปลาย (Grade Calculator)', grade: 'ม.4', categoryLabel: '2. เงื่อนไขและการตัดสินใจ', difficulty: 'เริ่มต้น', testCount: 5, creator: 'ระบบ (Built-in)', isCustom: false },
                      { id: 'prog-3', title: 'หาผลรวมเลขคู่ 1 ถึง N (Sum of Even Numbers)', grade: 'ม.5', categoryLabel: '3. การวนซ้ำและลูป', difficulty: 'ปานกลาง', testCount: 4, creator: 'ระบบ (Built-in)', isCustom: false },
                      { id: 'prog-4', title: 'ตรวจสอบคำพาพาลินโดรม (Palindrome Checker)', grade: 'ม.5', categoryLabel: '4. ฟังก์ชันและโมดูล', difficulty: 'ปานกลาง', testCount: 4, creator: 'ระบบ (Built-in)', isCustom: false },
                      { id: 'prog-5', title: 'ค้นหาค่าสูงสุดและต่ำสุดในอาร์เรย์ (Min/Max)', grade: 'ม.5', categoryLabel: '5. อาร์เรย์และโครงสร้างข้อมูล', difficulty: 'ปานกลาง', testCount: 4, creator: 'ระบบ (Built-in)', isCustom: false },
                      { id: 'prog-6', title: 'ตรวจสอบจำนวนเฉพาะ (Prime Number Check)', grade: 'ม.6', categoryLabel: '6. การแก้ปัญหาเชิงคำนวณ', difficulty: 'ขั้นสูง', testCount: 4, creator: 'ระบบ (Built-in)', isCustom: false },
                    ].map((ch) => (
                      <tr key={ch.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td style={{ padding: 'var(--space-3)' }}>
                          <div style={{ fontWeight: 'bold', color: 'var(--color-text-primary)' }}>{ch.title}</div>
                          <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>ID: {ch.id}</div>
                        </td>
                        <td style={{ padding: 'var(--space-3)' }}>
                          <span className="badge badge-blue">{ch.grade}</span>
                        </td>
                        <td style={{ padding: 'var(--space-3)', color: 'var(--color-text-secondary)', fontSize: '12px' }}>
                          {ch.categoryLabel}
                        </td>
                        <td style={{ padding: 'var(--space-3)' }}>
                          <span className={`badge ${ch.difficulty === 'เริ่มต้น' ? 'badge-emerald' : ch.difficulty === 'ปานกลาง' ? 'badge-warning' : 'badge-primary'}`}>
                            {ch.difficulty}
                          </span>
                        </td>
                        <td style={{ padding: 'var(--space-3)' }}>
                          <span className="badge badge-outline">{ch.testCount} เคส</span>
                        </td>
                        <td style={{ padding: 'var(--space-3)', fontSize: '12px', color: 'var(--color-text-tertiary)' }}>
                          {ch.creator}
                        </td>
                        <td style={{ padding: 'var(--space-3)', textAlign: 'right' }}>
                          <Link to="/practice?lab=programming" className="btn btn-ghost btn-xs text-primary" style={{ gap: '4px' }}>
                            <Play size={12} /> ทดลองทำโจทย์
                          </Link>
                        </td>
                      </tr>
                    ))}

                    {/* Custom Challenges created by Teachers/Admins */}
                    {(state.customChallenges || []).map((ch) => (
                      <tr key={ch.id} style={{ borderBottom: '1px solid var(--color-border)', background: 'rgba(139, 92, 246, 0.05)' }}>
                        <td style={{ padding: 'var(--space-3)' }}>
                          <div style={{ fontWeight: 'bold', color: '#c084fc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Sparkles size={14} color="#a78bfa" /> {ch.title}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>ID: {ch.id}</div>
                        </td>
                        <td style={{ padding: 'var(--space-3)' }}>
                          <span className="badge badge-violet">{ch.grade}</span>
                        </td>
                        <td style={{ padding: 'var(--space-3)', color: 'var(--color-text-secondary)', fontSize: '12px' }}>
                          {ch.categoryLabel}
                        </td>
                        <td style={{ padding: 'var(--space-3)' }}>
                          <span className="badge badge-primary">{ch.difficulty}</span>
                        </td>
                        <td style={{ padding: 'var(--space-3)' }}>
                          <span className="badge badge-outline">{(ch.testCases || []).length} เคส</span>
                        </td>
                        <td style={{ padding: 'var(--space-3)', fontSize: '12px', color: '#c084fc', fontWeight: 'bold' }}>
                          {ch.createdBy || 'คุณครู'}
                        </td>
                        <td style={{ padding: 'var(--space-3)', textAlign: 'right' }}>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                            <Link to="/practice?lab=programming" className="btn btn-ghost btn-xs text-primary" style={{ gap: '4px' }}>
                              <Play size={12} /> ทดลอง
                            </Link>
                            <button
                              type="button"
                              className="btn btn-ghost btn-xs text-error"
                              onClick={async () => {
                                if (confirm(`คุณต้องการลบโจทย์ "${ch.title}" ออกจากระบบใช่หรือไม่?`)) {
                                  await deleteCustomChallenge(ch.id);
                                }
                              }}
                              title="ลบโจทย์นี้"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* SUB-TAB 2: LESSON QUIZZES */}
            {exerciseSubTab === 'quizzes' && (
              <div style={{ overflowX: 'auto', marginTop: 'var(--space-2)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 'var(--text-sm)' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-tertiary)' }}>
                      <th style={{ padding: 'var(--space-3)' }}>ชื่อแบบทดสอบ / แบบฝึกหัด</th>
                      <th style={{ padding: 'var(--space-3)' }}>หลักสูตร</th>
                      <th style={{ padding: 'var(--space-3)' }}>เกณฑ์ผ่าน (Threshold)</th>
                      <th style={{ padding: 'var(--space-3)' }}>การประเมินผล</th>
                      <th style={{ padding: 'var(--space-3)', textAlign: 'right' }}>สถานะ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { id: 'quiz-comp-1', title: 'แบบทดสอบ: พื้นฐานสถาปัตยกรรมคอมพิวเตอร์และ IPOS', course: 'comp-fund-101', pass: 80, eval: 'อัตโนมัติ (Automated Stored Proc)' },
                      { id: 'quiz-html-1', title: 'แบบทดสอบ: ความเข้าใจโครงสร้างแท็ก HTML5', course: 'html-css-101', pass: 80, eval: 'อัตโนมัติ (Automated Stored Proc)' },
                      { id: 'quiz-js-1', title: 'แบบทดสอบ: ตัวแปรและฟังก์ชัน JavaScript', course: 'js-101', pass: 80, eval: 'อัตโนมัติ (Automated Stored Proc)' },
                      { id: 'quiz-esp32-1', title: 'แบบทดสอบ: ขา GPIO และวงจร ESP32', course: 'esp32-101', pass: 80, eval: 'อัตโนมัติ (Automated Stored Proc)' },
                    ].map((q) => (
                      <tr key={q.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td style={{ padding: 'var(--space-3)' }}>
                          <div style={{ fontWeight: 'bold' }}>{q.title}</div>
                          <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>{q.id}</div>
                        </td>
                        <td style={{ padding: 'var(--space-3)' }}>
                          <span className="badge badge-primary">{q.course}</span>
                        </td>
                        <td style={{ padding: 'var(--space-3)' }}>
                          <span className="badge badge-emerald">≥ {q.pass}%</span>
                        </td>
                        <td style={{ padding: 'var(--space-3)', color: 'var(--color-text-secondary)', fontSize: '12px' }}>
                          {q.eval}
                        </td>
                        <td style={{ padding: 'var(--space-3)', textAlign: 'right' }}>
                          <span className="badge badge-emerald">เปิดใช้งาน</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: USERS & ROLES MANAGEMENT (ADMIN ONLY) */}
      {/* ============================================================== */}
      {activeTab === 'users' && state.user?.role === 'admin' && (
        <div className="card glass-panel" style={{ padding: 'var(--space-5)', borderRadius: 'var(--radius-xl)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
            <div>
              <h3 className="card-title">การจัดการผู้ใช้งานและการกำหนดบทบาท (User Accounts & Roles)</h3>
              <p className="card-subtitle">
                จัดการสิทธิ์ Admin, Teacher, Student อย่างปลอดภัย โดยบันทึกตรงสู่ PostgreSQL profiles
              </p>
            </div>
            <button className="btn btn-primary" onClick={() => setShowUserModal(true)} style={{ gap: '6px' }}>
              <UserPlus size={16} /> สร้างหรือเชิญบัญชีผู้ใช้
            </button>
          </div>

          {isLoadingUsers ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-secondary)' }}>
              กำลังโหลดข้อมูลผู้ใช้งานจากฐานข้อมูล PostgreSQL...
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 'var(--text-sm)' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-tertiary)' }}>
                    <th style={{ padding: 'var(--space-3)' }}>ชื่อผู้ใช้งาน</th>
                    <th style={{ padding: 'var(--space-3)' }}>ชื่อบัญชี / อีเมล</th>
                    <th style={{ padding: 'var(--space-3)' }}>ระดับชั้น</th>
                    <th style={{ padding: 'var(--space-3)' }}>คะแนน XP</th>
                    <th style={{ padding: 'var(--space-3)' }}>บทบาทปัจจุบัน</th>
                    <th style={{ padding: 'var(--space-3)', textAlign: 'center' }}>เปลี่ยนบทบาท (Role)</th>
                    <th style={{ padding: 'var(--space-3)', textAlign: 'right' }}>จัดการ (ลบบัญชี)</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map((u) => (
                    <tr key={u.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: 'var(--space-3)' }}>
                        <div style={{ fontWeight: 'bold', color: 'var(--color-text-primary)' }}>{u.displayName}</div>
                        <div style={{ fontSize: '10px', color: 'var(--color-text-tertiary)' }}>UUID: {u.id}</div>
                      </td>
                      <td style={{ padding: 'var(--space-3)', color: 'var(--color-text-secondary)' }}>{u.email}</td>
                      <td style={{ padding: 'var(--space-3)' }}>
                        <span className="badge badge-outline">{u.level}</span>
                      </td>
                      <td style={{ padding: 'var(--space-3)', fontWeight: 'bold', color: '#8b5cf6' }}>{u.xp} XP</td>
                      <td style={{ padding: 'var(--space-3)' }}>
                        <span
                          className={`badge ${u.role === 'admin' ? 'badge-primary' : u.role === 'teacher' ? 'badge-warning' : 'badge-emerald'}`}
                        >
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: 'var(--space-3)', textAlign: 'center' }}>
                        <select
                          className="form-input form-select"
                          style={{ width: 'auto', display: 'inline-block', fontSize: '12px', padding: '4px 8px' }}
                          value={u.role}
                          onChange={(e) => handleUpdateRole(u.id, e.target.value as any)}
                          disabled={u.id === state.user?.id || u.id === '00000000-0000-0000-0000-000000000001'}
                        >
                          <option value="student">Student (นักเรียน)</option>
                          <option value="teacher">Teacher (ครูผู้สอน)</option>
                          <option value="admin">Admin (ผู้ดูแลระบบ)</option>
                        </select>
                      </td>
                      <td style={{ padding: 'var(--space-3)', textAlign: 'right' }}>
                        {u.id === state.user?.id || u.id === '00000000-0000-0000-0000-000000000001' ? (
                          <span className="badge badge-primary" style={{ fontSize: '11px', opacity: 0.85 }}>
                            แอดมินหลัก (คุณ)
                          </span>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            style={{
                              color: 'var(--color-error)',
                              borderColor: 'rgba(239, 68, 68, 0.4)',
                              background: 'rgba(239, 68, 68, 0.08)',
                              fontSize: '12px',
                              padding: '4px 10px',
                              gap: '4px',
                            }}
                            title={`ลบบัญชีผู้ใช้ ${u.displayName}`}
                            onClick={() => handleDeleteUser(u.id, u.displayName)}
                          >
                            <Trash2 size={13} /> ลบผู้ใช้
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: CREATE / EDIT COURSE */}
      {/* ============================================================== */}
      {showCourseModal && (
        <div className="modal-overlay" onClick={() => setShowCourseModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editingCourseId ? '✏️ แก้ไขข้อมูลหลักสูตร' : '➕ สร้างคอร์สเรียนใหม่ (Create Course)'}
              </h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowCourseModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCourse}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div className="form-group">
                  <label className="form-label">ชื่อคอร์สเรียน (ภาษาไทย)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="เช่น การเขียนโปรแกรมภาษา Python สำหรับวิทยาศาสตร์ข้อมูล"
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">ชื่อคอร์สภาษาอังกฤษ</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Python for Data Science"
                    value={courseTitleEn}
                    onChange={(e) => setCourseTitleEn(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">คำอธิบายภาพรวมของหลักสูตร</label>
                  <textarea
                    className="form-input"
                    style={{ minHeight: '80px' }}
                    value={courseDesc}
                    onChange={(e) => setCourseDesc(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                  <div className="form-group">
                    <label className="form-label">หมวดหมู่วิชา</label>
                    <select
                      className="form-input form-select"
                      value={courseCategory}
                      onChange={(e) => setCourseCategory(e.target.value)}
                    >
                      {courseCategories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">ระดับชั้นเป้าหมาย</label>
                    <select
                      className="form-input form-select"
                      value={courseLevel}
                      onChange={(e) => setCourseLevel(e.target.value as any)}
                    >
                      <option value="ม.4">มัธยมศึกษาปีที่ 4</option>
                      <option value="ม.5">มัธยมศึกษาปีที่ 5</option>
                      <option value="ม.6">มัธยมศึกษาปีที่ 6</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-3)' }}>
                  <div className="form-group">
                    <label className="form-label">ระดับความยาก</label>
                    <select
                      className="form-input form-select"
                      value={courseDifficulty}
                      onChange={(e) => setCourseDifficulty(e.target.value as any)}
                    >
                      <option value="เริ่มต้น">เริ่มต้น</option>
                      <option value="ปานกลาง">ปานกลาง</option>
                      <option value="ขั้นสูง">ขั้นสูง</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">ระยะเวลา (ชม.)</label>
                    <input
                      type="number"
                      min="1"
                      className="form-input"
                      value={courseHours}
                      onChange={(e) => setCourseHours(Number(e.target.value))}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">สถานะเผยแพร่</label>
                    <select
                      className="form-input form-select"
                      value={courseStatus}
                      onChange={(e) => setCourseStatus(e.target.value as any)}
                    >
                      <option value="published">เผยแพร่ (Published)</option>
                      <option value="draft">ฉบับร่าง (Draft)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">จุดประสงค์การเรียนรู้ (คั่นด้วยจุลภาค)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={courseObjectives}
                    onChange={(e) => setCourseObjectives(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowCourseModal(false)}>
                  ยกเลิก
                </button>
                <button type="submit" className="btn btn-primary" disabled={!courseTitle.trim()}>
                  บันทึกลงฐานข้อมูล PostgreSQL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: ADD MODULE */}
      {/* ============================================================== */}
      {showModuleModal && (
        <div className="modal-overlay" onClick={() => setShowModuleModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">📁 เพิ่มโมดูลใหม่ (Add Module)</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModuleModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddModule}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div className="form-group">
                  <label className="form-label">ชื่อโมดูล (Module Title)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="เช่น โมดูล 3: อาร์เรย์และฟังก์ชัน"
                    value={moduleTitle}
                    onChange={(e) => setModuleTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">คำอธิบายโมดูล</label>
                  <textarea
                    className="form-input"
                    placeholder="อธิบายสรุปว่าโมดูลนี้เน้นเรื่องอะไร..."
                    value={moduleDesc}
                    onChange={(e) => setModuleDesc(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowModuleModal(false)}>
                  ยกเลิก
                </button>
                <button type="submit" className="btn btn-primary" disabled={!moduleTitle.trim()}>
                  บันทึกโมดูล
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: ADD / EDIT LESSON WITH STRUCTURED CONTENT */}
      {/* ============================================================== */}
      {showLessonModal && (
        <div className="modal-overlay" onClick={() => setShowLessonModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '720px' }}>
            <div className="modal-header">
              <h3 className="modal-title">📄 สร้าง/แก้ไขบทเรียน (Lesson Structured Builder)</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowLessonModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveLesson}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', maxHeight: '70vh', overflowY: 'auto' }}>
                <div className="form-group">
                  <label className="form-label">ชื่อบทเรียน (Lesson Title)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="เช่น การใช้งานคำสั่ง If-Else และการตัดสินใจเชิงตรรกะ"
                    value={lessonTitle}
                    onChange={(e) => setLessonTitle(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-3)' }}>
                  <div className="form-group">
                    <label className="form-label">ประเภทบทเรียน</label>
                    <select
                      className="form-input form-select"
                      value={lessonType}
                      onChange={(e) => setLessonType(e.target.value as any)}
                    >
                      <option value="reading">อ่านบทเรียน (Reading)</option>
                      <option value="quiz">แบบทดสอบ (Quiz)</option>
                      <option value="coding">ฝึกโค้ดดิ้ง (Coding Lab)</option>
                      <option value="interactive">สื่อจำลอง (Interactive)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">เวลาเรียนประมาณ (นาที)</label>
                    <input
                      type="number"
                      min="5"
                      className="form-input"
                      value={lessonMinutes}
                      onChange={(e) => setLessonMinutes(Number(e.target.value))}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">สถานะ</label>
                    <select
                      className="form-input form-select"
                      value={lessonStatus}
                      onChange={(e) => setLessonStatus(e.target.value as any)}
                    >
                      <option value="published">เผยแพร่ทันที (Published)</option>
                      <option value="draft">ฉบับร่าง (Draft)</option>
                    </select>
                  </div>
                </div>

                {/* Structured Sections Builder */}
                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 'bold', fontSize: 'var(--text-sm)' }}>
                      องค์ประกอบเนื้อหาบทเรียน (Content Sections):
                    </span>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button type="button" className="btn btn-outline btn-sm" onClick={() => handleAddContentSection('heading')}>
                        + หัวข้อ
                      </button>
                      <button type="button" className="btn btn-outline btn-sm" onClick={() => handleAddContentSection('text')}>
                        + ข้อความ
                      </button>
                      <button type="button" className="btn btn-outline btn-sm" onClick={() => handleAddContentSection('code')}>
                        + โค้ด
                      </button>
                      <button type="button" className="btn btn-outline btn-sm" onClick={() => handleAddContentSection('callout')}>
                        + กล่องเน้น
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {lessonSections.map((sec, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: 'rgba(0, 0, 0, 0.25)',
                          padding: '8px 12px',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--color-border-subtle)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span className="badge badge-outline" style={{ fontSize: '10px' }}>
                            {sec.type.toUpperCase()}
                          </span>
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            style={{ padding: '2px', color: 'var(--color-error)' }}
                            onClick={() => setLessonSections(lessonSections.filter((_, i) => i !== idx))}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                        <textarea
                          className="form-input"
                          style={{ minHeight: sec.type === 'code' ? '80px' : '45px', fontSize: '12px' }}
                          value={sec.content}
                          onChange={(e) => {
                            const updated = [...lessonSections];
                            updated[idx].content = e.target.value;
                            setLessonSections(updated);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowLessonModal(false)}>
                  ยกเลิก
                </button>
                <button type="submit" className="btn btn-primary" disabled={!lessonTitle.trim()}>
                  บันทึกบทเรียนสู่ฐานข้อมูล
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: CREATE EXERCISE / QUIZ */}
      {/* ============================================================== */}
      {showExerciseModal && (
        <div className="modal-overlay" onClick={() => setShowExerciseModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px' }}>
            <div className="modal-header">
              <h3 className="modal-title">📝 สร้างแบบฝึกหัดและการบ้านใหม่ (Create Exercise)</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowExerciseModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveExercise}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', maxHeight: '70vh', overflowY: 'auto' }}>
                <div className="form-group">
                  <label className="form-label">ชื่อแบบทดสอบ (Exercise / Quiz Title)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="เช่น แบบทดสอบวัดผล: วงจร IPOS และฮาร์ดแวร์"
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-3)' }}>
                  <div className="form-group">
                    <label className="form-label">กำหนดให้กับหลักสูตร</label>
                    <select
                      className="form-input form-select"
                      value={quizCourseId}
                      onChange={(e) => setQuizCourseId(e.target.value)}
                    >
                      {coursesList.map((c) => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">เกณฑ์ผ่านขั้นต่ำ (%)</label>
                    <input
                      type="number"
                      min="50"
                      max="100"
                      className="form-input"
                      value={quizPassingScore}
                      onChange={(e) => setQuizPassingScore(Number(e.target.value))}
                    />
                  </div>
                </div>

                {/* Questions Builder */}
                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 'bold', fontSize: 'var(--text-sm)' }}>
                      คำถามและตัวเลือก (Questions & Options):
                    </span>
                    <button
                      type="button"
                      className="btn btn-outline btn-xs"
                      onClick={() => {
                        setQuizQuestions((prev) => [
                          ...prev,
                          {
                            id: 'q-new-' + Date.now(),
                            question: `โจทย์คำถามทดสอบข้อที่ ${prev.length + 1}`,
                            type: 'multiple-choice',
                            points: 10,
                            explanation: 'คำอธิบายเฉลยที่ถูกต้อง',
                            options: [
                              { id: `opt-${Date.now()}-1`, optionText: 'ตัวเลือก ก (คำตอบที่ถูกต้อง)', isCorrect: true },
                              { id: `opt-${Date.now()}-2`, optionText: 'ตัวเลือก ข', isCorrect: false },
                              { id: `opt-${Date.now()}-3`, optionText: 'ตัวเลือก ค', isCorrect: false },
                              { id: `opt-${Date.now()}-4`, optionText: 'ตัวเลือก ง', isCorrect: false },
                            ],
                          },
                        ]);
                      }}
                      style={{ gap: '4px' }}
                    >
                      <Plus size={13} /> เพิ่มข้อสอบ
                    </button>
                  </div>

                  {quizQuestions.map((q, qIdx) => (
                    <div
                      key={q.id}
                      style={{
                        background: 'rgba(0, 0, 0, 0.25)',
                        padding: '12px',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--color-border-subtle)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                      }}
                    >
                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: '12px' }}>
                          คำถามข้อที่ {qIdx + 1}
                        </label>
                        <input
                          type="text"
                          className="form-input"
                          value={q.question}
                          onChange={(e) => {
                            const updated = [...quizQuestions];
                            updated[qIdx].question = e.target.value;
                            setQuizQuestions(updated);
                          }}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: '12px' }}>คำอธิบายเฉลย</label>
                        <input
                          type="text"
                          className="form-input"
                          value={q.explanation}
                          onChange={(e) => {
                            const updated = [...quizQuestions];
                            updated[qIdx].explanation = e.target.value;
                            setQuizQuestions(updated);
                          }}
                        />
                      </div>

                      {/* Options */}
                      <div style={{ marginTop: '4px' }}>
                        <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontWeight: 'bold' }}>
                          ตัวเลือกและเฉลย (เลือกข้อที่ถูกต้อง):
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                          {q.options.map((opt, optIdx) => (
                            <div key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <input
                                type="radio"
                                name={`correct-${q.id}`}
                                checked={opt.isCorrect}
                                onChange={() => {
                                  const updated = [...quizQuestions];
                                  updated[qIdx].options.forEach((o, i) => {
                                    o.isCorrect = i === optIdx;
                                  });
                                  setQuizQuestions(updated);
                                }}
                              />
                              <input
                                type="text"
                                className="form-input"
                                style={{ fontSize: '12px', padding: '4px 8px' }}
                                value={opt.optionText}
                                onChange={(e) => {
                                  const updated = [...quizQuestions];
                                  updated[qIdx].options[optIdx].optionText = e.target.value;
                                  setQuizQuestions(updated);
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowExerciseModal(false)}>
                  ยกเลิก
                </button>
                <button type="submit" className="btn btn-primary" disabled={!quizTitle.trim()}>
                  บันทึกแบบฝึกหัดลง PostgreSQL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: CREATE USER ACCOUNT (ADMIN ONLY) */}
      {/* ============================================================== */}
      {showUserModal && state.user?.role === 'admin' && (
        <div className="modal-overlay" onClick={() => setShowUserModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">👤 สร้างบัญชีผู้ใช้งานใหม่ (Create User Account)</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowUserModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateUser}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div className="form-group">
                  <label className="form-label">ชื่อ-นามสกุล ผู้ใช้งาน</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="เช่น อาจารย์วิภา เทคโนโลยี"
                    value={newUserDisplayName}
                    onChange={(e) => setNewUserDisplayName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>ชื่อผู้ใช้ หรืออีเมล (Username)</span>
                    <span style={{ fontSize: '11px', color: 'var(--color-accent-primary)' }}>* ไม่ต้องใส่ @gmail.com</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="เช่น somchai หรือ teacher01"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                  <div className="form-group">
                    <label className="form-label">บทบาท (Role)</label>
                    <select
                      className="form-input form-select"
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value as any)}
                    >
                      <option value="student">Student (นักเรียน)</option>
                      <option value="teacher">Teacher (ครูผู้สอน)</option>
                      <option value="admin">Admin (ผู้ดูแลระบบ)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">ระดับชั้น</label>
                    <select
                      className="form-input form-select"
                      value={newUserLevel}
                      onChange={(e) => setNewUserLevel(e.target.value as any)}
                    >
                      <option value="ม.4">มัธยมศึกษาปีที่ 4</option>
                      <option value="ม.5">มัธยมศึกษาปีที่ 5</option>
                      <option value="ม.6">มัธยมศึกษาปีที่ 6</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowUserModal(false)}>
                  ยกเลิก
                </button>
                <button type="submit" className="btn btn-primary" disabled={!newUserEmail.trim() || !newUserDisplayName.trim()}>
                  บันทึกลงฐานข้อมูล PostgreSQL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Teachers / Admins to Create Challenges */}
      <CreateChallengeModal
        isOpen={showCreateChallengeModal}
        onClose={() => setShowCreateChallengeModal(false)}
      />
    </div>
  );
};

export default AdminCMS;

