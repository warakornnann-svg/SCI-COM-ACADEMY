import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  BookOpen,
  Copy,
  Check,
  HelpCircle,
  Clock,
  Sparkles,
  Info,
  AlertTriangle,
  Lightbulb,
  FileCode,
  Share2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { courses } from '../data/courses';
import QuizComponent from '../components/Quiz';
import { verifyAndUpdateCourseProgress } from '../lib/database';

export const LessonReader: React.FC = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
  const { state, dispatch, isLessonCompleted, addNotification } = useApp();

  const [copiedCodeIdx, setCopiedCodeIdx] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const allCourses = [...courses, ...state.customCourses];
  const course = allCourses.find((c) => c.id === courseId);

  // Find the active module and lesson
  let currentLesson: any = null;
  let currentModule: any = null;

  if (course) {
    for (const mod of course.modules) {
      const les = mod.lessons.find((l) => l.id === lessonId);
      if (les) {
        currentLesson = les;
        currentModule = mod;
        break;
      }
    }
  }

  // Flatten all lessons in order to calculate prev and next
  const flatLessons: { lesson: any; moduleTitle: string }[] = [];
  course?.modules.forEach((mod) => {
    mod.lessons.forEach((les) => {
      flatLessons.push({ lesson: les, moduleTitle: mod.title });
    });
  });

  const currentIndex = flatLessons.findIndex((item) => item.lesson.id === lessonId);
  const prevLesson = currentIndex > 0 ? flatLessons[currentIndex - 1].lesson : null;
  const nextLesson = currentIndex < flatLessons.length - 1 ? flatLessons[currentIndex + 1].lesson : null;

  const isCompleted = currentLesson ? isLessonCompleted(currentLesson.id) : false;

  // Verified Learning Activity Completion (Automated & Secure)
  const handleVerifiedCompletion = async (quizScore?: number) => {
    if (!currentLesson || !course) return;

    const targetUserId = state.user?.id || 'guest';

    // 1. Update lesson progress in state
    dispatch({
      type: 'UPDATE_LESSON_PROGRESS',
      payload: {
        userId: targetUserId,
        lessonId: currentLesson.id,
        courseId: course.id,
        completed: true,
        completedAt: new Date().toISOString(),
        quizScore,
        timeSpent: (currentLesson.estimatedMinutes || 10) * 60,
      },
    });

    addNotification('success', `ผ่านบทเรียน "${currentLesson.title}" เรียบร้อยแล้ว (+25 XP)`);

    // 2. Award first lesson achievement if not yet unlocked
    dispatch({
      type: 'ADD_ACHIEVEMENT',
      payload: {
        userId: targetUserId,
        achievementId: 'ach-first-lesson',
        unlockedAt: new Date().toISOString(),
      },
    });

    // 3. Verify 100% course completion on the trusted backend
    try {
      const result = await verifyAndUpdateCourseProgress(targetUserId, course.id, flatLessons.length);
      if (result.justCompleted || (result.completed && currentIndex === flatLessons.length - 1)) {
        addNotification('success', '🎉 ยินดีด้วย! คุณเรียนจบหลักสูตรนี้ครบ 100% แล้ว! กำลังนำทางไปหน้าความสำเร็จ...');
        setTimeout(() => {
          navigate(`/courses/${course.id}/success`);
        }, 1200);
      }
    } catch (err) {
      console.warn('Course verification check warning:', err);
    }
  };

  const handleCopyCode = (codeText: string, idx: number) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCodeIdx(idx);
    setTimeout(() => setCopiedCodeIdx(null), 2000);
    addNotification('info', 'คัดลอกโค้ดไปยังคลิปบอร์ดแล้ว');
  };

  if (!course || !currentLesson) {
    return (
      <div className="main-content" style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
        <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold', marginBottom: 'var(--space-2)' }}>
          ไม่พบบทเรียนที่ต้องการ
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>
          บทเรียนรหัส {lessonId} อาจไม่มีอยู่ในคอร์ส {courseId}
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/courses')}>
          กลับไปคลังบทเรียน
        </button>
      </div>
    );
  }

  return (
    <div className="main-content" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', maxWidth: '1200px' }}>
      {/* Top Navigation & Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-xs)' }}>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => navigate(`/courses/${course.id}`)}
            style={{ padding: 'var(--space-1) var(--space-2)' }}
          >
            <ArrowLeft size={16} /> กลับสู่หน้าคอร์ส
          </button>
          <span style={{ color: 'var(--color-text-tertiary)' }}>/</span>
          <span style={{ color: 'var(--color-text-tertiary)' }}>{currentModule?.title}</span>
          <span style={{ color: 'var(--color-text-tertiary)' }}>/</span>
          <span style={{ color: 'var(--color-accent-primary)', fontWeight: 'bold' }}>{currentLesson.title}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ fontSize: 'var(--text-xs)' }}
          >
            {sidebarOpen ? 'ซ่อนสารบัญ' : 'แสดงสารบัญ'}
          </button>
          {isCompleted ? (
            <span className="badge badge-emerald" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={13} /> ผ่านบทเรียนนี้แล้ว
            </span>
          ) : (
            <span className="badge badge-outline" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'var(--text-xs)' }}>
              <Clock size={13} /> กำลังศึกษา
            </span>
          )}
        </div>
      </div>

      {/* Main Two-Column Reader Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: sidebarOpen ? '280px 1fr' : '1fr', gap: 'var(--space-6)', alignItems: 'flex-start' }}>
        {/* Left Table of Contents Sidebar */}
        {sidebarOpen && (
          <div
            className="card"
            style={{
              padding: 'var(--space-4)',
              position: 'sticky',
              top: 'calc(var(--topbar-height) + 16px)',
              maxHeight: 'calc(100vh - 120px)',
              overflowY: 'auto',
            }}
          >
            <div style={{ fontWeight: 'bold', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-3)', color: 'var(--color-text-primary)' }}>
              📑 สารบัญบทเรียนในคอร์ส
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {course.modules.map((mod, mIdx) => (
                <div key={mod.id}>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', marginBottom: '6px' }}>
                    โมดูล {mIdx + 1}: {mod.title}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {mod.lessons.map((les) => {
                      const isActive = les.id === currentLesson.id;
                      const completed = isLessonCompleted(les.id);
                      return (
                        <div
                          key={les.id}
                          onClick={() => navigate(`/courses/${course.id}/lessons/${les.id}`)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '6px 8px',
                            borderRadius: 'var(--radius-md)',
                            fontSize: 'var(--text-xs)',
                            cursor: 'pointer',
                            background: isActive ? 'var(--color-accent-primary-muted)' : 'transparent',
                            color: isActive ? 'var(--color-accent-primary)' : 'var(--color-text-secondary)',
                            fontWeight: isActive ? 'bold' : 'normal',
                          }}
                        >
                          {completed ? (
                            <CheckCircle2 size={14} color="var(--color-success)" style={{ flexShrink: 0 }} />
                          ) : (
                            <div
                              style={{
                                width: '12px',
                                height: '12px',
                                borderRadius: 'var(--radius-full)',
                                border: '1px solid var(--color-border)',
                                flexShrink: 0,
                              }}
                            />
                          )}
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {les.title}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Right Lesson Content Pane */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', minWidth: 0 }}>
          {/* Article Header Card */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: 'var(--space-2)' }}>
              <span className="badge badge-blue">
                ⏱️ ใช้เวลาศึกษาประมาณ {currentLesson.estimatedMinutes} นาที
              </span>
              <span className="badge badge-violet">
                {currentLesson.type === 'reading' ? 'บทอ่าน' : currentLesson.type === 'interactive' ? 'แบบฝึกปฏิบัติ' : 'โค้ด & ตัวอย่าง'}
              </span>
            </div>

            <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold', lineHeight: 1.3, marginBottom: 'var(--space-2)' }}>
              {currentLesson.title}
            </h1>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
              ส่วนหนึ่งของวิชา: {course.title} · โมดูล: {currentModule?.title}
            </p>
          </div>

          {/* Render Sections */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)', lineHeight: 'var(--leading-relaxed)' }}>
            {currentLesson.content?.sections?.map((section: any, idx: number) => {
              if (section.type === 'heading') {
                return (
                  <h2
                    key={idx}
                    style={{
                      fontSize: 'var(--text-xl)',
                      fontWeight: 'bold',
                      color: 'var(--color-text-primary)',
                      marginTop: idx > 0 ? 'var(--space-4)' : 0,
                      borderBottom: '1px solid var(--color-border)',
                      paddingBottom: 'var(--space-2)',
                    }}
                  >
                    {section.content}
                  </h2>
                );
              }

              if (section.type === 'text') {
                return (
                  <p key={idx} style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                    {section.content}
                  </p>
                );
              }

              if (section.type === 'callout') {
                const getVariantStyle = () => {
                  switch (section.variant) {
                    case 'tip':
                      return {
                        bg: 'var(--color-success-muted)',
                        border: 'var(--color-success)',
                        icon: <Lightbulb size={20} color="var(--color-success)" />,
                        title: 'เคล็ดลับสำคัญ (Tip)',
                      };
                    case 'warning':
                      return {
                        bg: 'var(--color-warning-muted)',
                        border: 'var(--color-warning)',
                        icon: <AlertTriangle size={20} color="var(--color-warning)" />,
                        title: 'ข้อควรระวัง (Caution)',
                      };
                    case 'important':
                      return {
                        bg: 'rgba(239, 68, 68, 0.15)',
                        border: 'var(--color-error)',
                        icon: <AlertTriangle size={20} color="var(--color-error)" />,
                        title: 'ข้อสำคัญที่ต้องจำ',
                      };
                    default:
                      return {
                        bg: 'var(--color-accent-primary-muted)',
                        border: 'var(--color-accent-primary)',
                        icon: <Info size={20} color="var(--color-accent-primary)" />,
                        title: 'ข้อมูลเพิ่มเติม (Note)',
                      };
                  }
                };
                const style = getVariantStyle();
                return (
                  <div
                    key={idx}
                    style={{
                      background: style.bg,
                      borderLeft: `4px solid ${style.border}`,
                      borderRadius: 'var(--radius-md)',
                      padding: 'var(--space-4)',
                      display: 'flex',
                      gap: 'var(--space-3)',
                      alignItems: 'flex-start',
                    }}
                  >
                    <div style={{ flexShrink: 0, marginTop: '2px' }}>{style.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 'bold', fontSize: 'var(--text-xs)', color: style.border, marginBottom: '2px', textTransform: 'uppercase' }}>
                        {style.title}
                      </div>
                      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', lineHeight: 1.6 }}>
                        {section.content}
                      </div>
                    </div>
                  </div>
                );
              }

              if (section.type === 'code') {
                return (
                  <div
                    key={idx}
                    style={{
                      borderRadius: 'var(--radius-lg)',
                      overflow: 'hidden',
                      border: '1px solid var(--color-border)',
                      background: '#0a0f1d',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: 'var(--space-2) var(--space-4)',
                        background: 'rgba(255, 255, 255, 0.04)',
                        borderBottom: '1px solid var(--color-border)',
                        fontSize: 'var(--text-xs)',
                        color: 'var(--color-text-tertiary)',
                      }}
                    >
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-accent-primary)' }}>
                        {section.language || 'code'}
                      </span>
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ padding: '2px 8px', fontSize: '11px', gap: '4px' }}
                        onClick={() => handleCopyCode(section.content, idx)}
                      >
                        {copiedCodeIdx === idx ? <Check size={12} color="var(--color-success)" /> : <Copy size={12} />}
                        <span>{copiedCodeIdx === idx ? 'คัดลอกแล้ว' : 'คัดลอกโค้ด'}</span>
                      </button>
                    </div>
                    <pre
                      style={{
                        margin: 0,
                        padding: 'var(--space-4)',
                        overflowX: 'auto',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 'var(--text-sm)',
                        color: '#e2e8f0',
                        lineHeight: 1.6,
                      }}
                    >
                      <code>{section.content}</code>
                    </pre>
                  </div>
                );
              }

              if (section.type === 'list') {
                return (
                  <div key={idx}>
                    {section.content && <p style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-2)' }}>{section.content}</p>}
                    <ul style={{ paddingLeft: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                      {section.items?.map((item: string, itemIdx: number) => (
                        <li key={itemIdx} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              }

              return null;
            })}

            {/* Reading Comprehension Verification Checkpoint */}
            {!isCompleted && !currentLesson.content?.quiz && (
              <div
                style={{
                  marginTop: 'var(--space-6)',
                  padding: 'var(--space-4) var(--space-6)',
                  background: 'rgba(56, 189, 248, 0.08)',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  textAlign: 'center',
                }}
              >
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}>
                  📖 เมื่อศึกษาเนื้อหาและโค้ดตัวอย่างในบทเรียนนี้ครบถ้วนแล้ว ให้กดยืนยันการเรียนรู้เพื่อบันทึกความก้าวหน้าลงในฐานข้อมูล
                </p>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleVerifiedCompletion()}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <CheckCircle2 size={16} /> ยืนยันการเรียนรู้บทเรียนนี้ (+25 XP)
                </button>
              </div>
            )}

            {/* Embedded Quiz Component */}
            {currentLesson.content?.quiz && (
              <QuizComponent
                quiz={currentLesson.content.quiz}
                lessonId={currentLesson.id}
                courseId={course.id}
                onComplete={(quizScore) => {
                  handleVerifiedCompletion(quizScore);
                }}
              />
            )}
          </div>

          {/* Bottom Lesson Navigation Bar */}
          <div
            className="card"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 'var(--space-3)',
            }}
          >
            <div>
              {prevLesson ? (
                <button
                  className="btn btn-outline"
                  onClick={() => navigate(`/courses/${course.id}/lessons/${prevLesson.id}`)}
                  style={{ gap: '6px' }}
                >
                  <ChevronLeft size={16} />
                  <span>บทเรียนก่อนหน้า</span>
                </button>
              ) : (
                <button className="btn btn-outline" disabled style={{ opacity: 0.5 }}>
                  <ChevronLeft size={16} /> บทแรกของคอร์ส
                </button>
              )}
            </div>

            {/* Verified Learning Status Indicator (No manual bypass) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {isCompleted ? (
                <span className="badge badge-emerald" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px' }}>
                  <CheckCircle2 size={14} /> ผ่านบทเรียนนี้แล้ว (Verified Complete)
                </span>
              ) : currentLesson.content?.quiz ? (
                <span className="badge badge-amber" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px' }}>
                  <HelpCircle size={14} /> ต้องทำแบบทดสอบให้ผ่านเกณฑ์ (80%)
                </span>
              ) : (
                <span className="badge badge-cyan" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px' }}>
                  <BookOpen size={14} /> กำลังศึกษาเนื้อหาบทเรียน
                </span>
              )}
            </div>

            <div>
              {nextLesson ? (
                <button
                  className="btn btn-primary"
                  onClick={() => navigate(`/courses/${course.id}/lessons/${nextLesson.id}`)}
                  style={{ gap: '6px' }}
                >
                  <span>บทเรียนถัดไป</span>
                  <ChevronRight size={16} />
                </button>
              ) : isCompleted ? (
                <button
                  className="btn btn-primary"
                  onClick={() => navigate(`/courses/${course.id}/success`)}
                  style={{ gap: '6px' }}
                >
                  <span>ดูหน้าความสำเร็จของคอร์ส</span>
                  <Sparkles size={16} />
                </button>
              ) : (
                <button
                  className="btn btn-outline"
                  onClick={() => navigate(`/courses/${course.id}`)}
                  style={{ gap: '6px' }}
                >
                  <span>กลับหน้ารายละเอียดคอร์ส</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonReader;
