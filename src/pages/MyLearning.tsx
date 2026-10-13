import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  BookMarked,
  BookOpen,
  Award,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Keyboard,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { courses } from '../data/courses';
import CategoryIcon from '../components/common/CategoryIcon';

export const MyLearning: React.FC = () => {
  const { state, getCourseProgress } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'in_progress' | 'completed' | 'quizzes' | 'typing'>('all');

  const allCourses = [...courses, ...state.customCourses];

  // Get enrolled courses with full data
  const enrolledCoursesData = state.enrollments.map((enr) => {
    const course = allCourses.find((c) => c.id === enr.courseId);
    const totalLessons = course ? course.modules.reduce((acc, m) => acc + m.lessons.length, 0) : 0;
    const progress = course ? getCourseProgress(course.id, totalLessons) : 0;
    return {
      enrollment: enr,
      course,
      totalLessons,
      progress,
      isCompleted: progress >= 100,
    };
  }).filter((item) => item.course !== undefined);

  // Filter based on active tab
  const displayedCourses = enrolledCoursesData.filter((item) => {
    if (activeTab === 'in_progress') return item.progress < 100;
    if (activeTab === 'completed') return item.progress >= 100;
    return true;
  });

  // Quiz history
  const quizHistory = state.lessonProgress
    .filter((p) => p.quizScore !== undefined)
    .map((p) => {
      const course = allCourses.find((c) => c.id === p.courseId);
      let lessonTitle = 'แบบทดสอบ';
      course?.modules.forEach((m) => {
        const l = m.lessons.find((les) => les.id === p.lessonId);
        if (l) lessonTitle = l.title;
      });
      return {
        ...p,
        courseTitle: course ? course.title : 'คอร์สเรียน',
        lessonTitle,
      };
    });

  return (
    <div className="main-content" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Page Header */}
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--space-2)' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--color-accent-primary-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-accent-primary)',
            }}
          >
            <BookMarked size={22} />
          </div>
          <div>
            <h1 className="page-header-title">การเรียนของฉัน (My Learning)</h1>
            <p className="page-header-desc">
              ติดตามความก้าวหน้า คอร์สที่กำลังเรียน ประวัติการทำแบบทดสอบ และสถิติการฝึกฝน
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-4)', flexWrap: 'wrap' }}>
          <button
            className={`btn btn-sm ${activeTab === 'all' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('all')}
          >
            คอร์สทั้งหมด ({enrolledCoursesData.length})
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'in_progress' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('in_progress')}
          >
            กำลังเรียน ({enrolledCoursesData.filter((i) => !i.isCompleted).length})
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'completed' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('completed')}
          >
            เรียนจบแล้ว ({enrolledCoursesData.filter((i) => i.isCompleted).length})
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'quizzes' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('quizzes')}
          >
            คะแนนแบบทดสอบ ({quizHistory.length})
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'typing' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('typing')}
          >
            ประวัติการพิมพ์ดีด ({state.typingHistory.length})
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'quizzes' ? (
        /* Quiz Scorecard Table */
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">ประวัติการทำแบบทดสอบ</h3>
              <p className="card-subtitle">คะแนนจริงที่ได้จากการทำแบบทดสอบท้ายบทเรียน</p>
            </div>
          </div>

          {quizHistory.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
              <p style={{ color: 'var(--color-text-secondary)' }}>คุณยังไม่ได้ทำแบบทดสอบใดๆ</p>
              <button className="btn btn-primary btn-sm" style={{ marginTop: 'var(--space-3)' }} onClick={() => navigate('/courses')}>
                เข้าสู่คอร์สเรียนเพื่อเริ่มทำแบบทดสอบ
              </button>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 'var(--text-sm)' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-tertiary)' }}>
                    <th style={{ padding: 'var(--space-3)' }}>คอร์สเรียน</th>
                    <th style={{ padding: 'var(--space-3)' }}>บทเรียน</th>
                    <th style={{ padding: 'var(--space-3)' }}>คะแนนที่ได้</th>
                    <th style={{ padding: 'var(--space-3)' }}>สถานะ</th>
                    <th style={{ padding: 'var(--space-3)' }}>วันที่ทำ</th>
                    <th style={{ padding: 'var(--space-3)', textAlign: 'right' }}>การดำเนินการ</th>
                  </tr>
                </thead>
                <tbody>
                  {quizHistory.map((q, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: 'var(--space-3)', fontWeight: 'bold' }}>{q.courseTitle}</td>
                      <td style={{ padding: 'var(--space-3)' }}>{q.lessonTitle}</td>
                      <td style={{ padding: 'var(--space-3)' }}>
                        <span style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', color: (q.quizScore || 0) >= 60 ? 'var(--color-success)' : 'var(--color-error)' }}>
                          {q.quizScore}%
                        </span>
                      </td>
                      <td style={{ padding: 'var(--space-3)' }}>
                        <span className={`badge ${(q.quizScore || 0) >= 60 ? 'badge-green' : 'badge-red'}`}>
                          {(q.quizScore || 0) >= 60 ? 'ผ่านเกณฑ์' : 'ไม่ผ่าน'}
                        </span>
                      </td>
                      <td style={{ padding: 'var(--space-3)', color: 'var(--color-text-tertiary)' }}>
                        {q.completedAt ? new Date(q.completedAt).toLocaleDateString('th-TH') : '-'}
                      </td>
                      <td style={{ padding: 'var(--space-3)', textAlign: 'right' }}>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => navigate(`/courses/${q.courseId}/lessons/${q.lessonId}`)}
                        >
                          ทำซ้ำ <ArrowRight size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : activeTab === 'typing' ? (
        /* Typing History */
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">ประวัติการทดสอบพิมพ์ดีดสัมผัส</h3>
              <p className="card-subtitle">สถิติความเร็วและความแม่นยำจากห้อง Typing Lab</p>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/practice/typing')}>
              <Keyboard size={15} /> ไปฝึกพิมพ์เพิ่ม
            </button>
          </div>

          {state.typingHistory.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
              <p style={{ color: 'var(--color-text-secondary)' }}>ยังไม่มีประวัติการฝึกพิมพ์</p>
              <button className="btn btn-primary btn-sm" style={{ marginTop: 'var(--space-3)' }} onClick={() => navigate('/practice/typing')}>
                เริ่มทดสอบพิมพ์สัมผัสครั้งแรก
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
              {state.typingHistory.map((th, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: 'var(--space-4)',
                    background: 'var(--color-bg-secondary)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                    <span className="badge badge-blue">
                      {th.language === 'th' ? 'ภาษาไทย' : th.language === 'en' ? 'English' : 'โค้ดโปรแกรม'}
                    </span>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                      {new Date(th.date).toLocaleDateString('th-TH')}
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', margin: 'var(--space-3) 0' }}>
                    <div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>ความเร็ว</div>
                      <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold', color: 'var(--color-accent-primary)' }}>
                        {th.wpm} <span style={{ fontSize: 'var(--text-xs)' }}>WPM</span>
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>ความแม่นยำ</div>
                      <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold', color: 'var(--color-success)' }}>
                        {th.accuracy}%
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                    พิมพ์ถูก {th.correctChars} ตัว · พิมพ์ผิด {th.incorrectChars} ตัว (เวลา {th.duration} วิ)
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Enrolled Courses Grid */
        <div>
          {displayedCourses.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--color-accent-primary-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-accent-primary)',
                  margin: '0 auto var(--space-4)',
                }}
              >
                <BookOpen size={32} />
              </div>
              <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold', marginBottom: 'var(--space-2)' }}>
                {activeTab === 'completed'
                  ? 'ยังไม่มีคอร์สที่เรียนจบสมบูรณ์ 100%'
                  : 'ยังไม่มีคอร์สที่ลงทะเบียนในหมวดนี้'}
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', maxWidth: '460px', margin: '0 auto var(--space-6)' }}>
                เลือกคอร์สที่คุณสนใจจากคลังบทเรียน เพื่อเริ่มบันทึกความก้าวหน้าและสะสมคะแนน XP
              </p>
              <button className="btn btn-primary" onClick={() => navigate('/courses')}>
                สำรวจคลังบทเรียนทั้งหมด <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-3">
              {displayedCourses.map(({ course, totalLessons, progress, isCompleted }) => {
                if (!course) return null;
                return (
                  <div key={course.id} className="card card-hover" style={{ display: 'flex', flexDirection: 'column' }}>
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
                      <span className={`badge ${isCompleted ? 'badge-green' : 'badge-blue'}`}>
                        {isCompleted ? 'เรียนจบแล้ว' : `เรียนไปแล้ว ${progress}%`}
                      </span>
                    </div>

                    <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', marginBottom: 'var(--space-1)' }}>
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

                    {/* Progress Bar */}
                    <div style={{ marginBottom: 'var(--space-4)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', marginBottom: '4px' }}>
                        <span style={{ color: 'var(--color-text-secondary)' }}>ความคืบหน้า</span>
                        <span style={{ fontWeight: 'bold', color: isCompleted ? 'var(--color-success)' : 'var(--color-accent-primary)' }}>
                          {progress}%
                        </span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${progress}%`,
                            background: isCompleted ? 'var(--color-success)' : undefined,
                          }}
                        />
                      </div>
                    </div>

                    <button
                      className="btn btn-primary btn-sm"
                      style={{ width: '100%' }}
                      onClick={() => navigate(`/courses/${course.id}`)}
                    >
                      {isCompleted ? 'ทบทวนเนื้อหา' : 'เรียนต่อจากจุดเดิม'} <ArrowRight size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyLearning;
