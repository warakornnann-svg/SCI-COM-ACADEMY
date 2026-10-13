import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Copy,
  Check,
  BookOpen,
  Info,
  Lightbulb,
  AlertTriangle,
  Play,
  Keyboard,
  Code2
} from 'lucide-react';
import { getCourseById } from '../data/courses';
import { useApp } from '../context/AppContext';
import QuizComponent from '../components/Quiz';

export const LessonViewer: React.FC = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
  const { state, dispatch, isLessonCompleted, addNotification } = useApp();

  const [copiedCodeIdx, setCopiedCodeIdx] = useState<number | null>(null);

  const course = courseId ? getCourseById(courseId) : undefined;

  if (!course) {
    return (
      <div className="main-content">
        <div className="empty-state card">
          <h2>ไม่พบคอร์สเรียน</h2>
          <Link to="/courses" className="btn btn-primary" style={{ marginTop: '16px' }}>
            กลับไปหน้ารวมคอร์ส
          </Link>
        </div>
      </div>
    );
  }

  // Find all lessons flattened
  const allLessons = course.modules.flatMap((m) => m.lessons);
  const currentIdx = allLessons.findIndex((l) => l.id === lessonId);
  const lesson = currentIdx >= 0 ? allLessons[currentIdx] : allLessons[0];

  if (!lesson) {
    return (
      <div className="main-content">
        <div className="empty-state card">
          <h2>ไม่พบบทเรียน</h2>
          <Link to={`/courses/${course.id}`} className="btn btn-primary" style={{ marginTop: '16px' }}>
            กลับไปหน้ารายละเอียดคอร์ส
          </Link>
        </div>
      </div>
    );
  }

  const prevLesson = currentIdx > 0 ? allLessons[currentIdx - 1] : null;
  const nextLesson = currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null;
  const completed = isLessonCompleted(lesson.id);

  const handleCopyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIdx(idx);
    setTimeout(() => setCopiedCodeIdx(null), 2000);
    addNotification('info', 'คัดลอกโค้ดลงคลิปบอร์ดแล้ว');
  };

  const handleMarkComplete = () => {
    dispatch({
      type: 'UPDATE_LESSON_PROGRESS',
      payload: {
        userId: state.user?.id || 'guest',
        lessonId: lesson.id,
        courseId: course.id,
        completed: true,
        completedAt: new Date().toISOString(),
        timeSpent: lesson.estimatedMinutes * 60,
      },
    });
    addNotification('success', `ยินดีด้วย! คุณเรียนจบบทเรียน "${lesson.title}" (+25 XP)`);

    // Check achievement for first lesson
    dispatch({
      type: 'ADD_ACHIEVEMENT',
      payload: {
        userId: state.user?.id || 'guest',
        achievementId: 'ach-first-lesson',
        unlockedAt: new Date().toISOString(),
      },
    });

    if (nextLesson) {
      navigate(`/courses/${course.id}/lessons/${nextLesson.id}`);
    }
  };

  return (
    <div className="main-content">
      {/* Top Breadcrumb & Navigation */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--space-6)',
          flexWrap: 'wrap',
          gap: 'var(--space-3)',
        }}
      >
        <Link
          to={`/courses/${course.id}`}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}
        >
          <ArrowLeft size={16} /> กลับสู่โครงสร้างวิชา: {course.title}
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          {prevLesson && (
            <Link
              to={`/courses/${course.id}/lessons/${prevLesson.id}`}
              className="btn btn-outline btn-sm"
              title={prevLesson.title}
            >
              <ChevronLeft size={16} /> บทก่อนหน้า
            </Link>
          )}

          {nextLesson && (
            <Link
              to={`/courses/${course.id}/lessons/${nextLesson.id}`}
              className="btn btn-outline btn-sm"
              title={nextLesson.title}
            >
              บทถัดไป <ChevronRight size={16} />
            </Link>
          )}
        </div>
      </div>

      {/* Main 2-Column Lesson Layout */}
      <div className="lesson-layout">
        {/* Left/Main Lesson Content Area */}
        <div className="lesson-content">
          <div className="card" style={{ padding: 'var(--space-8)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
              <span className="badge badge-blue">บทเรียนที่ {currentIdx + 1} จาก {allLessons.length}</span>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                ใช้เวลาประมาณ {lesson.estimatedMinutes} นาที
              </span>
            </div>

            <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'bold', marginBottom: 'var(--space-6)' }}>
              {lesson.title}
            </h1>

            {/* Render Content Sections */}
            {lesson.content.sections && lesson.content.sections.length > 0 ? (
              lesson.content.sections.map((section, sIdx) => {
                switch (section.type) {
                  case 'heading':
                    return (
                      <h2 key={sIdx} style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold', marginTop: 'var(--space-6)', marginBottom: 'var(--space-3)' }}>
                        {section.content}
                      </h2>
                    );

                  case 'text':
                    return (
                      <p key={sIdx} style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: 'var(--space-4)', fontSize: 'var(--text-base)' }}>
                        {section.content}
                      </p>
                    );

                  case 'callout': {
                    const isTip = section.variant === 'tip';
                    const isWarning = section.variant === 'warning';
                    return (
                      <div
                        key={sIdx}
                        style={{
                          padding: 'var(--space-4)',
                          borderRadius: 'var(--radius-lg)',
                          background: isTip ? 'var(--color-success-muted)' : isWarning ? 'var(--color-warning-muted)' : 'var(--color-accent-primary-muted)',
                          borderLeft: `4px solid ${isTip ? 'var(--color-success)' : isWarning ? 'var(--color-warning)' : 'var(--color-accent-primary)'}`,
                          marginBottom: 'var(--space-5)',
                          display: 'flex',
                          gap: '12px',
                        }}
                      >
                        <div style={{ flexShrink: 0, marginTop: '2px' }}>
                          {isTip ? <Lightbulb size={20} color="var(--color-success)" /> : isWarning ? <AlertTriangle size={20} color="var(--color-warning)" /> : <Info size={20} color="var(--color-accent-primary)" />}
                        </div>
                        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', lineHeight: 1.6 }}>
                          {section.content}
                        </div>
                      </div>
                    );
                  }

                  case 'code':
                    return (
                      <div key={sIdx} style={{ marginBottom: 'var(--space-5)' }}>
                        <div className="code-editor-header" style={{ borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }}>
                          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                            {section.language || 'code'}
                          </span>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => handleCopyCode(section.content, sIdx)}
                            style={{ gap: '4px', fontSize: 'var(--text-xs)' }}
                          >
                            {copiedCodeIdx === sIdx ? (
                              <>
                                <Check size={14} color="var(--color-success)" /> คัดลอกแล้ว
                              </>
                            ) : (
                              <>
                                <Copy size={14} /> คัดลอก
                              </>
                            )}
                          </button>
                        </div>
                        <pre style={{ margin: 0, borderRadius: '0 0 var(--radius-lg) var(--radius-lg)', borderTop: 'none' }}>
                          <code>{section.content}</code>
                        </pre>
                      </div>
                    );

                  case 'list':
                    return (
                      <ul key={sIdx} style={{ paddingLeft: 'var(--space-6)', marginBottom: 'var(--space-4)' }}>
                        {section.items?.map((item, itemIdx) => (
                          <li key={itemIdx} style={{ marginBottom: 'var(--space-2)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                            {item}
                          </li>
                        ))}
                      </ul>
                    );

                  case 'diagram':
                    return (
                      <div
                        key={sIdx}
                        style={{
                          padding: 'var(--space-5)',
                          borderRadius: 'var(--radius-lg)',
                          background: 'var(--color-bg-secondary)',
                          border: '1px solid var(--color-border)',
                          marginBottom: 'var(--space-5)',
                          textAlign: 'center',
                        }}
                      >
                        <pre
                          style={{
                            background: 'var(--color-bg-input)',
                            display: 'inline-block',
                            padding: 'var(--space-4) var(--space-6)',
                            borderRadius: 'var(--radius-md)',
                            fontFamily: 'var(--font-mono)',
                            fontSize: 'var(--text-xs)',
                            color: 'var(--color-accent-primary)',
                            lineHeight: 1.4,
                          }}
                        >
                          {section.content}
                        </pre>
                      </div>
                    );

                  default:
                    return null;
                }
              })
            ) : (
              <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  กำลังจัดทำเนื้อหาสำหรับบทเรียนนี้
                </p>
              </div>
            )}

            {/* Quick Practice shortcut if applicable */}
            {course.id === 'typing-101' && (
              <div
                style={{
                  marginTop: 'var(--space-6)',
                  padding: 'var(--space-4)',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--color-bg-secondary)',
                  border: '1px dashed var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <strong>พร้อมทดสอบพิมพ์สัมผัสจริงหรือยัง?</strong>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                    เข้าสู่ห้องปฏิบัติการพิมพ์ดีดเพื่อวัดความเร็ว WPM และความแม่นยำ
                  </div>
                </div>
                <Link to="/typing-lab" className="btn btn-primary btn-sm">
                  <Keyboard size={14} /> ไปยัง Typing Lab
                </Link>
              </div>
            )}

            {course.id === 'html-css-101' && (
              <div
                style={{
                  marginTop: 'var(--space-6)',
                  padding: 'var(--space-4)',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--color-bg-secondary)',
                  border: '1px dashed var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <strong>ทดลองเขียนโค้ด HTML/CSS ในสตูดิโอสด</strong>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                    พิมพ์โค้ดแล้วดูผลการแสดงผลบนเบราว์เซอร์ได้ทันที
                  </div>
                </div>
                <Link to="/web-lab" className="btn btn-primary btn-sm">
                  <Code2 size={14} /> ไปยัง Web Studio
                </Link>
              </div>
            )}

            {/* Quiz Component if available */}
            {lesson.content.quiz && (
              <QuizComponent
                quiz={lesson.content.quiz}
                lessonId={lesson.id}
                courseId={course.id}
                onComplete={() => {}}
              />
            )}

            {/* Completion & Next Lesson Bottom Bar */}
            <div
              style={{
                marginTop: 'var(--space-8)',
                paddingTop: 'var(--space-6)',
                borderTop: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 'var(--space-4)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {completed ? (
                  <span className="badge badge-green" style={{ padding: '6px 12px', fontSize: 'var(--text-sm)' }}>
                    <CheckCircle2 size={16} /> บทเรียนนี้ผ่านแล้ว
                  </span>
                ) : (
                  <button className="btn btn-success" onClick={handleMarkComplete}>
                    <CheckCircle2 size={16} /> ทำเครื่องหมายว่าเรียนจบ (+25 XP)
                  </button>
                )}
              </div>

              {nextLesson && (
                <Link to={`/courses/${course.id}/lessons/${nextLesson.id}`} className="btn btn-primary">
                  บทเรียนถัดไป: {nextLesson.title} <ChevronRight size={16} />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Syllabus Outline */}
        <div className="lesson-sidebar">
          <div className="card" style={{ position: 'sticky', top: 'calc(var(--topbar-height) + var(--space-4))', padding: 'var(--space-4)' }}>
            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', marginBottom: 'var(--space-3)' }}>
              สารบัญบทเรียน
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', maxHeight: '70vh', overflowY: 'auto' }}>
              {course.modules.map((m, mIdx) => (
                <div key={m.id}>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--color-text-tertiary)', marginBottom: '4px' }}>
                    {mIdx + 1}. {m.title}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {m.lessons.map((l) => {
                      const isCurrent = l.id === lesson.id;
                      const isDone = isLessonCompleted(l.id);

                      return (
                        <Link
                          key={l.id}
                          to={`/courses/${course.id}/lessons/${l.id}`}
                          style={{
                            padding: '6px 8px',
                            borderRadius: 'var(--radius-md)',
                            fontSize: 'var(--text-xs)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: isCurrent ? 'var(--color-accent-primary-muted)' : 'transparent',
                            color: isCurrent ? 'var(--color-accent-primary)' : 'var(--color-text-secondary)',
                            fontWeight: isCurrent ? 'bold' : 'normal',
                          }}
                        >
                          {isDone ? (
                            <CheckCircle2 size={13} color="var(--color-success)" />
                          ) : (
                            <div style={{ width: '13px', height: '13px', borderRadius: '50%', border: '1px solid var(--color-border)', flexShrink: 0 }} />
                          )}
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {l.title}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonViewer;
