import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  BookOpen,
  Clock,
  Award,
  CheckCircle2,
  Flame,
  Zap,
  ArrowRight,
  Play,
  Layers,
  Code2,
  TrendingUp,
  FolderGit2,
  Compass,
  Filter,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { courses, dailyChallenges, courseCategories, learningPaths } from '../data/courses';
import CategoryIcon from '../components/common/CategoryIcon';

export const Dashboard: React.FC = () => {
  const { state, enrollCourse, getCourseProgress } = useApp();
  const navigate = useNavigate();
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<'ทั้งหมด' | 'ม.4' | 'ม.5' | 'ม.6'>('ทั้งหมด');
  const [activeChallengeIdx, setActiveChallengeIdx] = useState(0);

  // Combine static courses + customCourses from Admin
  const allCourses = [...courses, ...state.customCourses];

  // User details
  const user = state.user;
  const displayName = user ? user.displayName : 'ผู้มาเยือน';
  const userLevel = user ? user.level : 'ม.4';

  // Real statistics derived from actual user data
  const completedLessons = state.lessonProgress.filter((p) => p.completed);
  const totalCompletedCount = completedLessons.length;
  const totalMinutesSpent = state.lessonProgress.reduce((sum, p) => sum + (p.timeSpent || 0), 0);
  const totalHoursSpent = Math.max(0.5, Math.round((totalMinutesSpent / 3600) * 10) / 10);
  
  const quizzesWithScore = state.lessonProgress.filter((p) => p.quizScore !== undefined);
  const avgQuizScore = quizzesWithScore.length > 0
    ? Math.round(quizzesWithScore.reduce((sum, p) => sum + (p.quizScore || 0), 0) / quizzesWithScore.length)
    : 0;
  
  const totalSavedProjects = state.savedProjects.length;
  const totalTypingTests = state.typingHistory.length;

  // Active enrolled course for "Continue Learning"
  const recentEnrollment = state.enrollments.length > 0
    ? state.enrollments[0]
    : null;
  const recentCourse = recentEnrollment
    ? allCourses.find((c) => c.id === recentEnrollment.courseId)
    : allCourses[0];

  // Daily Challenge
  const currentChallenge = dailyChallenges[activeChallengeIdx] || dailyChallenges[0];

  // Filter recommended courses by level
  const filteredCourses = allCourses.filter((c) => {
    if (selectedLevelFilter === 'ทั้งหมด') return true;
    return c.level === selectedLevelFilter || c.level === 'ทุกระดับ';
  });

  return (
    <div className="main-content" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Welcome Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(30, 42, 66, 0.95) 0%, rgba(15, 23, 41, 0.95) 100%)',
          border: '1px solid rgba(59, 130, 246, 0.25)',
          position: 'relative',
          overflow: 'hidden',
          padding: 'var(--space-8) var(--space-6)',
        }}
      >
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '780px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-2)' }}>
            <span className="badge badge-blue" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles size={13} /> ยินดีต้อนรับสู่ Sci-Com Academy
            </span>
            {user && (
              <span className="badge badge-emerald">
                {user.level} · แผนการเรียนวิทย์-คอม
              </span>
            )}
          </div>

          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'bold', marginBottom: 'var(--space-2)', lineHeight: 1.3 }}>
            สวัสดีคุณ <span className="text-gradient-primary">{displayName}</span> 👋
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-base)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-5)' }}>
            พร้อมพัฒนาทักษะดิจิทัลวันนี้หรือยัง? เรียนรู้ผ่านการลงมือทำจริง จากพื้นฐานคอมพิวเตอร์และพิมพ์สัมผัส สู่การพัฒนาเว็บ แอปพลิเคชัน C++ และ IoT
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
            {recentCourse && (
              <button
                className="btn btn-primary"
                onClick={() => navigate(`/courses/${recentCourse.id}`)}
                style={{ padding: 'var(--space-3) var(--space-6)', fontSize: 'var(--text-base)' }}
              >
                <Play size={16} fill="currentColor" />
                เรียนต่อ: {recentCourse.title}
              </button>
            )}
            <button
              className="btn btn-outline"
              onClick={() => navigate('/practice')}
            >
              <Code2 size={16} /> เข้าห้องฝึกปฏิบัติ (Practice Lab)
            </button>
            <button
              className="btn btn-ghost"
              onClick={() => navigate('/learning-paths')}
            >
              <Compass size={16} /> ดูเส้นทางการเรียนรู้
            </button>
          </div>
        </div>

        {/* Floating 3D Geometric Accents (Hidden on tablet/mobile for clean layout) */}
        <div
          className="floating-3d-slow dashboard-floating-badges"
          style={{
            position: 'absolute',
            right: '40px',
            top: '32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              padding: '12px 20px',
              background: 'rgba(59, 130, 246, 0.15)',
              border: '1px solid rgba(59, 130, 246, 0.45)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderRadius: 'var(--radius-xl)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.45), 0 0 15px rgba(59, 130, 246, 0.25)',
              transform: 'perspective(600px) rotateY(-10deg) rotateX(5deg)',
            }}
          >
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9' }}>Real Database Connected</span>
          </div>

          <div
            className="floating-3d-reverse"
            style={{
              padding: '10px 18px',
              background: 'rgba(139, 92, 246, 0.18)',
              border: '1px solid rgba(139, 92, 246, 0.45)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4), 0 0 15px rgba(139, 92, 246, 0.25)',
              transform: 'perspective(600px) rotateY(-6deg) rotateX(-4deg) translateX(20px)',
            }}
          >
            <Sparkles size={15} color="#c084fc" />
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#e9d5ff' }}>7 Interactive Practical Labs</span>
          </div>
        </div>

        {/* Ambient glow decoration */}
        <div
          className="ambient-glow"
          style={{
            position: 'absolute',
            right: '-60px',
            bottom: '-60px',
            width: '280px',
            height: '280px',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Guest Mode Ephemeral Notice Banner */}
      {user?.role === 'guest' && (
        <div
          style={{
            padding: '12px 18px',
            borderRadius: 'var(--radius-xl)',
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>💡</span>
            <div style={{ fontSize: 'var(--text-sm)' }}>
              <strong style={{ color: 'var(--color-warning)' }}>คุณกำลังใช้งานในโหมดผู้มาเยือน (Guest Mode):</strong>{' '}
              <span style={{ color: 'var(--color-text-secondary)' }}>
                ทดลองเรียนได้ทุกวิชาและทำแล็บได้อิสระ แต่ข้อมูลจะไม่ถูกบันทึกถาวร (เมื่อปิดเว็บ ข้อมูลจะถูกรีเซ็ตทั้งหมด)
              </span>
            </div>
          </div>
          <button
            className="btn btn-outline btn-sm"
            style={{ borderColor: 'var(--color-warning)', color: 'var(--color-warning)', whiteSpace: 'nowrap' }}
            onClick={() => navigate('/login')}
          >
            สร้างบัญชีนักเรียน (เพื่อบันทึกข้อมูล) →
          </button>
        </div>
      )}

      {/* Admin Quick CMS Banner */}
      {user?.role === 'admin' && (
        <div
          style={{
            padding: '12px 18px',
            borderRadius: 'var(--radius-xl)',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(139, 92, 246, 0.08) 100%)',
            border: '1px solid rgba(59, 130, 246, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>👑</span>
            <div style={{ fontSize: 'var(--text-sm)' }}>
              <strong style={{ color: '#60a5fa' }}>ยินดีต้อนรับ ผู้ดูแลระบบ "น่าน" (Admin CMS):</strong>{' '}
              <span style={{ color: 'var(--color-text-secondary)' }}>
                คุณมีสิทธิ์เต็มในการบริหารจัดการคอร์สเรียน แบบฝึกหัด โครงงาน และบัญชีผู้ใช้ทั้งหมดในระบบ
              </span>
            </div>
          </div>
          <button
            className="btn btn-primary btn-sm"
            style={{ whiteSpace: 'nowrap' }}
            onClick={() => navigate('/admin')}
          >
            ไปยังแผงควบคุม Admin CMS →
          </button>
        </div>
      )}

      {/* Learning Statistics Bar */}
      <div className="grid grid-cols-4 card-3d-wrap">
        <div className="stat-card card-3d">
          <div className="stat-card-icon blue">
            <BookOpen size={24} />
          </div>
          <div className="stat-card-info">
            <div className="stat-card-label">บทเรียนที่เรียนจบ</div>
            <div className="stat-card-value">{totalCompletedCount} <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>บท</span></div>
            <div className="stat-card-sub">จากบทเรียนทั้งหมดในระบบ</div>
          </div>
        </div>

        <div className="stat-card card-3d">
          <div className="stat-card-icon violet">
            <Clock size={24} />
          </div>
          <div className="stat-card-info">
            <div className="stat-card-label">เวลาที่ใช้ฝึกฝน</div>
            <div className="stat-card-value">{totalHoursSpent} <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>ชม.</span></div>
            <div className="stat-card-sub">คำนวณจากการเรียนและฝึกปฏิบัติ</div>
          </div>
        </div>

        <div className="stat-card card-3d">
          <div className="stat-card-icon green">
            <Award size={24} />
          </div>
          <div className="stat-card-info">
            <div className="stat-card-label">คะแนนแบบทดสอบเฉลี่ย</div>
            <div className="stat-card-value">{avgQuizScore}%</div>
            <div className="stat-card-sub">{quizzesWithScore.length} แบบทดสอบที่ทำแล้ว</div>
          </div>
        </div>

        <div className="stat-card card-3d">
          <div className="stat-card-icon amber">
            <FolderGit2 size={24} />
          </div>
          <div className="stat-card-info">
            <div className="stat-card-label">โครงงานที่สร้างสำเร็จ</div>
            <div className="stat-card-value">{totalSavedProjects} <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>ชิ้น</span></div>
            <div className="stat-card-sub">บันทึกในแฟ้มผลงานแล้ว</div>
          </div>
        </div>
      </div>

      {/* 2-Column: Continue Learning & Daily Challenge */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 'var(--space-6)' }}>
        {/* Continue Learning Widget */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">📖 เรียนต่อจากจุดเดิม</h3>
              <p className="card-subtitle">คอร์สที่คุณเข้าเรียนล่าสุด</p>
            </div>
            <Link to="/my-learning" className="btn btn-ghost btn-sm" style={{ gap: '4px' }}>
              ดูทั้งหมด <ArrowRight size={14} />
            </Link>
          </div>

          {recentCourse ? (
            <div
              style={{
                background: 'var(--color-bg-secondary)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-4)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-3)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--color-accent-primary-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-accent-primary)',
                    flexShrink: 0,
                  }}
                >
                  <CategoryIcon name={recentCourse.icon} size={22} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-base)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {recentCourse.title}
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                    ระดับ: {recentCourse.level} · ความยาก: {recentCourse.difficulty}
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>ความคืบหน้า</span>
                  <span style={{ fontWeight: 'bold', color: 'var(--color-accent-primary)' }}>
                    {getCourseProgress(recentCourse.id, recentCourse.modules.reduce((acc, m) => acc + m.lessons.length, 0))}%
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${getCourseProgress(recentCourse.id, recentCourse.modules.reduce((acc, m) => acc + m.lessons.length, 0))}%`,
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-2)' }}>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => navigate(`/courses/${recentCourse.id}`)}
                  style={{ gap: '6px' }}
                >
                  <span>เข้าสู่บทเรียน</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: 'var(--space-8) var(--space-4)' }}>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}>
                คุณยังไม่ได้ลงทะเบียนเรียนคอร์สใดๆ
              </p>
              <button className="btn btn-outline btn-sm" onClick={() => navigate('/courses')}>
                เลือกดูคอร์สเรียนทั้งหมด
              </button>
            </div>
          )}
        </div>

        {/* Daily Challenge Widget */}
        <div className="card">
          <div className="card-header">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Flame size={18} color="#f59e0b" />
                <h3 className="card-title">ภารกิจประจำวัน (Daily Challenge)</h3>
              </div>
              <p className="card-subtitle">ทำภารกิจสั้นๆ ทุกวันเพื่อรับคะแนน XP พิเศษ</p>
            </div>
            <span className="badge badge-amber" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Zap size={13} /> +{currentChallenge.xpReward} XP
            </span>
          </div>

          <div
            style={{
              background: 'var(--color-bg-secondary)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-4)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-3)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--weight-semibold)', color: 'var(--color-text-primary)' }}>
                  🎯 {currentChallenge.title}
                </h4>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                  {currentChallenge.description}
                </p>
              </div>
              <span className="badge badge-blue">{currentChallenge.difficulty}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
              <span>⏱️ ใช้เวลาประมาณ: {currentChallenge.estimatedMinutes} นาที</span>
              <span>⭐ รางวัล: {currentChallenge.xpReward} XP</span>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
              {currentChallenge.type === 'typing' && (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => navigate('/practice/typing')}
                  style={{ width: '100%' }}
                >
                  เริ่มฝึกพิมพ์ 3 นาที <ArrowRight size={14} />
                </button>
              )}
              {currentChallenge.type === 'coding' && (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => navigate('/practice/web')}
                  style={{ width: '100%' }}
                >
                  เปิด Web Studio <ArrowRight size={14} />
                </button>
              )}
              {currentChallenge.type === 'quiz' && (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => navigate('/courses/excel-101')}
                  style={{ width: '100%' }}
                >
                  ไปยังโจทย์ฝึกฝน <ArrowRight size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Courses Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <div>
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
              📚 คอร์สเรียนแนะนำสำหรับคุณ
            </h2>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
              คัดสรรตามระดับชั้นและเป้าหมายการเรียนรู้สายวิทย์-คอมพิวเตอร์
            </p>
          </div>

          {/* Level Filter Tabs */}
          <div style={{ display: 'flex', gap: 'var(--space-1)', background: 'var(--color-bg-surface)', padding: '3px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
            {(['ทั้งหมด', 'ม.4', 'ม.5', 'ม.6'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevelFilter(lvl)}
                className={`btn btn-sm ${selectedLevelFilter === lvl ? 'btn-primary' : 'btn-ghost'}`}
                style={{ padding: 'var(--space-1) var(--space-3)', fontSize: 'var(--text-xs)' }}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-3">
          {filteredCourses.slice(0, 6).map((course) => {
            const isCourseEnrolled = state.enrollments.some((e) => e.courseId === course.id);
            const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
            const progress = getCourseProgress(course.id, totalLessons);

            return (
              <div
                key={course.id}
                className="card card-hover"
                style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
              >
                {/* Course Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
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
                    <CategoryIcon name={course.icon} size={24} />
                  </div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <span className="badge badge-blue">{course.level}</span>
                    <span className="badge badge-violet">{course.difficulty}</span>
                  </div>
                </div>

                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-semibold)', marginBottom: 'var(--space-1)' }}>
                  {course.title}
                </h3>
                {course.titleEn && (
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-2)' }}>
                    {course.titleEn}
                  </p>
                )}
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: 'var(--space-4)', flex: 1 }}>
                  {course.description}
                </p>

                {/* Course Meta */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                  <span>⏳ {course.estimatedHours} ชั่วโมง</span>
                  <span>📑 {course.modules.length} โมดูล ({totalLessons} บท)</span>
                </div>

                {/* Progress bar if enrolled */}
                {isCourseEnrolled && (
                  <div style={{ marginBottom: 'var(--space-3)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', marginBottom: '2px' }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>ความก้าวหน้า</span>
                      <span style={{ fontWeight: 'bold', color: 'var(--color-accent-primary)' }}>{progress}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                )}

                {/* Action button */}
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <button
                    className={`btn ${isCourseEnrolled ? 'btn-primary' : 'btn-outline'} btn-sm`}
                    style={{ width: '100%' }}
                    onClick={() => {
                      if (!isCourseEnrolled) enrollCourse(course.id);
                      navigate(`/courses/${course.id}`);
                    }}
                  >
                    {isCourseEnrolled ? 'เรียนต่อ' : 'ดูรายละเอียดและเริ่มเรียน'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-6)' }}>
          <button className="btn btn-outline" onClick={() => navigate('/courses')}>
            ดูคลังบทเรียนทั้งหมด ({allCourses.length} คอร์ส) <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Guided Learning Paths Teaser */}
      <div
        className="card"
        style={{
          background: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border)',
        }}
      >
        <div className="card-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Compass size={20} color="var(--color-accent-primary)" />
              <h2 className="card-title">เส้นทางการเรียนรู้ที่แนะนำ (Learning Paths)</h2>
            </div>
            <p className="card-subtitle">หลักสูตรแนะนำตามลำดับขั้น ไม่ต้องกลัวหลงทาง</p>
          </div>
          <Link to="/learning-paths" className="btn btn-ghost btn-sm">
            ดูเส้นทางทั้งหมด <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-3">
          {learningPaths.slice(0, 3).map((path) => (
            <div
              key={path.id}
              className="card card-hover"
              style={{
                background: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)',
                cursor: 'pointer',
              }}
              onClick={() => navigate('/learning-paths')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-2)' }}>
                <span className="badge badge-blue">⏱️ ~{path.estimatedWeeks} สัปดาห์</span>
                <span className="badge badge-violet">{path.courses.length} คอร์ส</span>
              </div>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', marginBottom: 'var(--space-1)' }}>
                {path.title}
              </h3>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: 'var(--space-3)' }}>
                {path.description}
              </p>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent-primary)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold' }}>
                สำรวจเส้นทางนี้ <ArrowRight size={12} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
