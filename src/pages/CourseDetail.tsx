import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  BookOpen,
  Clock,
  Award,
  CheckCircle2,
  ChevronRight,
  Play,
  ArrowLeft,
  Check,
  FileCode,
  HelpCircle,
  FolderGit2,
  Lock,
  Layers
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { courses, getCategoryById } from '../data/courses';
import CategoryIcon from '../components/common/CategoryIcon';

export const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { state, enrollCourse, isEnrolled, getCourseProgress, isLessonCompleted } = useApp();

  const allCourses = [...courses, ...state.customCourses];
  const course = allCourses.find((c) => c.id === courseId);

  if (!course) {
    return (
      <div className="main-content" style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
        <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold', marginBottom: 'var(--space-2)' }}>
          ไม่พบคอร์สเรียนที่ต้องการ
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>
          คอร์สเรียนรหัส {courseId} อาจถูกย้ายหรือไม่มีอยู่ในระบบ
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/courses')}>
          กลับไปคลังบทเรียน
        </button>
      </div>
    );
  }

  const category = getCategoryById(course.categoryId);
  const enrolled = isEnrolled(course.id);
  const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const progress = getCourseProgress(course.id, totalLessons);

  // Find the first uncompleted lesson, or the first lesson overall
  let nextLessonId = course.modules[0]?.lessons[0]?.id;
  for (const m of course.modules) {
    for (const l of m.lessons) {
      if (!isLessonCompleted(l.id)) {
        nextLessonId = l.id;
        break;
      }
    }
    if (nextLessonId && !isLessonCompleted(nextLessonId)) break;
  }

  const handleEnrollAndStart = () => {
    if (!enrolled) {
      enrollCourse(course.id);
    }
    if (nextLessonId) {
      navigate(`/courses/${course.id}/lessons/${nextLessonId}`);
    }
  };

  const getLessonTypeIcon = (type: string) => {
    switch (type) {
      case 'coding':
        return <FileCode size={16} color="var(--color-info)" />;
      case 'quiz':
        return <HelpCircle size={16} color="var(--color-warning)" />;
      case 'project':
        return <FolderGit2 size={16} color="var(--color-accent-secondary)" />;
      default:
        return <BookOpen size={16} color="var(--color-accent-primary)" />;
    }
  };

  const getLessonTypeLabel = (type: string) => {
    switch (type) {
      case 'coding':
        return 'ฝึกเขียนโค้ด';
      case 'quiz':
        return 'แบบทดสอบ';
      case 'project':
        return 'โครงงาน';
      case 'interactive':
        return 'มีส่วนร่วม';
      default:
        return 'บทอ่าน';
    }
  };

  return (
    <div className="main-content" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
        <Link to="/courses" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none' }}>
          คลังบทเรียน
        </Link>
        <ChevronRight size={14} />
        {category && (
          <>
            <Link to={`/courses?category=${category.id}`} style={{ color: 'var(--color-text-secondary)', textDecoration: 'none' }}>
              {category.name}
            </Link>
            <ChevronRight size={14} />
          </>
        )}
        <span style={{ color: 'var(--color-text-primary)' }}>{course.title}</span>
      </div>

      {/* Course Hero Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(30, 42, 66, 0.95) 0%, rgba(15, 23, 41, 0.95) 100%)',
          border: '1px solid rgba(59, 130, 246, 0.25)',
          position: 'relative',
          padding: 'var(--space-8) var(--space-6)',
        }}
      >
        <div style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: 'var(--radius-xl)',
              background: 'var(--color-accent-primary-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-accent-primary)',
              flexShrink: 0,
            }}
          >
            <CategoryIcon name={course.icon} size={38} />
          </div>

          <div style={{ flex: 1, minWidth: '280px' }}>
            <div style={{ display: 'flex', gap: '6px', marginBottom: 'var(--space-2)', flexWrap: 'wrap' }}>
              {category && <span className="badge badge-blue">{category.name}</span>}
              <span className="badge badge-emerald">{course.level}</span>
              <span className="badge badge-violet">{course.difficulty}</span>
            </div>

            <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'bold', marginBottom: 'var(--space-1)' }}>
              {course.title}
            </h1>
            {course.titleEn && (
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-3)' }}>
                {course.titleEn}
              </p>
            )}

            <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)', lineHeight: 1.6, maxWidth: '780px', marginBottom: 'var(--space-5)' }}>
              {course.description}
            </p>

            <div style={{ display: 'flex', gap: 'var(--space-6)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', flexWrap: 'wrap', marginBottom: 'var(--space-6)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={16} color="var(--color-info)" /> ระยะเวลาเรียนประมาณ: {course.estimatedHours} ชั่วโมง
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Layers size={16} color="var(--color-accent-primary)" /> {course.modules.length} โมดูล ({totalLessons} บทเรียน)
              </span>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center' }}>
              {totalLessons === 0 ? (
                <div className="badge badge-amber" style={{ padding: '8px 16px', fontSize: '13px' }}>
                  คอร์สนี้อยู่ระหว่างจัดเตรียมเนื้อหาโดยครูผู้สอน
                </div>
              ) : (
                <button
                  className="btn btn-primary"
                  onClick={handleEnrollAndStart}
                  style={{ padding: 'var(--space-3) var(--space-6)', fontSize: 'var(--text-base)', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Play size={16} fill="currentColor" />
                  {enrolled ? (progress >= 100 ? 'ทบทวนบทเรียน' : 'เรียนต่อจากจุดเดิม') : 'ลงทะเบียนเรียนฟรี'}
                </button>
              )}

              {enrolled && progress >= 100 && (
                <button
                  className="btn btn-outline"
                  onClick={() => navigate(`/courses/${course.id}/success`)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: 'var(--space-3) var(--space-5)' }}
                >
                  <Award size={16} color="var(--color-warning)" />
                  <span>ดูหน้าความสำเร็จของคอร์ส (100% Complete)</span>
                </button>
              )}

              {enrolled && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 var(--space-2)' }}>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                    {progress >= 100 ? '✓ เรียนจบแล้ว 100%' : `ความก้าวหน้า: ${progress}%`}
                  </span>
                  <div className="progress-bar" style={{ width: '120px' }}>
                    <div className="progress-fill" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Objectives & Prerequisites */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
        {/* Learning Objectives */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">🎯 จุดประสงค์การเรียนรู้</h3>
          </div>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', paddingLeft: 0, listStyle: 'none' }}>
            {course.objectives.map((obj, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                <CheckCircle2 size={18} color="var(--color-success)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Prerequisites */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">🔑 ความรู้พื้นฐานที่ต้องมี (Prerequisites)</h3>
          </div>
          {course.prerequisites.length === 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-success)', fontSize: 'var(--text-sm)' }}>
              <CheckCircle2 size={18} />
              <span>ไม่มีเงื่อนไขความรู้พื้นฐาน — สามารถเริ่มเรียนได้ทันที</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                แนะนำให้ศึกษาคอร์สต่อไปนี้ก่อนเพื่อความเข้าใจสูงสุด:
              </p>
              {course.prerequisites.map((preId) => {
                const preCourse = allCourses.find((c) => c.id === preId);
                if (!preCourse) return null;
                const preEnrolled = isEnrolled(preCourse.id);
                return (
                  <div
                    key={preId}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 'var(--space-3)',
                      background: 'var(--color-bg-secondary)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <CategoryIcon name={preCourse.icon} size={18} color="var(--color-accent-primary)" />
                      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold' }}>{preCourse.title}</span>
                    </div>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => navigate(`/courses/${preCourse.id}`)}
                    >
                      ดูคอร์ส <ChevronRight size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Syllabus / Modules & Lessons */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">📑 แผนการเรียนรู้และบทเรียน (Syllabus)</h2>
            <p className="card-subtitle">เนื้อหาบทเรียนทั้งหมด {course.modules.length} โมดูล</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {course.modules.map((mod, modIdx) => (
            <div
              key={mod.id}
              style={{
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                background: 'var(--color-bg-secondary)',
              }}
            >
              {/* Module Header */}
              <div
                style={{
                  padding: 'var(--space-4) var(--space-5)',
                  background: 'var(--color-bg-surface)',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="badge badge-blue">โมดูลที่ {modIdx + 1}</span>
                  <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold' }}>{mod.title}</h3>
                </div>
                {mod.description && (
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                    {mod.description}
                  </p>
                )}
              </div>

              {/* Lessons List in Module */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {mod.lessons.length === 0 ? (
                  <div style={{ padding: 'var(--space-4)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', fontStyle: 'italic' }}>
                    (เนื้อหาสำหรับโมดูลนี้กำลังจัดทำและจะเผยแพร่เร็วๆ นี้)
                  </div>
                ) : (
                  mod.lessons.map((lesson, lesIdx) => {
                    const completed = isLessonCompleted(lesson.id);
                    return (
                      <div
                        key={lesson.id}
                        onClick={() => navigate(`/courses/${course.id}/lessons/${lesson.id}`)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: 'var(--space-3) var(--space-5)',
                          borderBottom: lesIdx < mod.lessons.length - 1 ? '1px solid var(--color-border)' : 'none',
                          cursor: 'pointer',
                          transition: 'background var(--transition-fast)',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-bg-surface-hover)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            {completed ? (
                              <CheckCircle2 size={18} color="var(--color-success)" />
                            ) : (
                              <div
                                style={{
                                  width: '18px',
                                  height: '18px',
                                  borderRadius: 'var(--radius-full)',
                                  border: '2px solid var(--color-border)',
                                }}
                              />
                            )}
                          </div>
                          <div>
                            <div style={{ fontSize: 'var(--text-sm)', fontWeight: completed ? 'normal' : '500', color: completed ? 'var(--color-text-secondary)' : 'var(--color-text-primary)' }}>
                              {lesson.title}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: '2px' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                {getLessonTypeIcon(lesson.type)} {getLessonTypeLabel(lesson.type)}
                              </span>
                              <span>·</span>
                              <span>⏱️ ~{lesson.estimatedMinutes} นาที</span>
                            </div>
                          </div>
                        </div>

                        <button className="btn btn-ghost btn-sm" style={{ gap: '4px' }}>
                          <span>{completed ? 'ทบทวน' : 'เริ่มเรียน'}</span>
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
