import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  ArrowRight,
  CheckCircle2,
  Clock,
  BookOpen,
  Sparkles,
  Layers,
  ChevronRight,
  Play
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { learningPaths, courses } from '../data/courses';
import CategoryIcon from '../components/common/CategoryIcon';

export const LearningPaths: React.FC = () => {
  const { state, enrollCourse, isEnrolled, getCourseProgress } = useApp();
  const navigate = useNavigate();

  const allCourses = [...courses, ...state.customCourses];

  return (
    <div className="main-content" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header */}
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
            <Compass size={22} />
          </div>
          <div>
            <h1 className="page-header-title">เส้นทางการเรียนรู้ (Learning Paths)</h1>
            <p className="page-header-desc">
              แผนผังการเรียนแบบเป็นระบบที่ออกแบบมาเฉพาะสำหรับนักเรียน ม.4-6 สายวิทย์-คอมพิวเตอร์
            </p>
          </div>
        </div>
      </div>

      {/* List of 5 Guided Paths */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
        {learningPaths.map((path, pIdx) => {
          // Calculate overall path progress
          const pathCourses = path.courses.map((id) => allCourses.find((c) => c.id === id)).filter(Boolean);
          let totalProgress = 0;
          pathCourses.forEach((c) => {
            if (c) {
              const totalLessons = c.modules.reduce((acc, m) => acc + m.lessons.length, 0);
              totalProgress += getCourseProgress(c.id, totalLessons);
            }
          });
          const pathAvgProgress = pathCourses.length > 0 ? Math.round(totalProgress / pathCourses.length) : 0;

          return (
            <div
              key={path.id}
              className="card"
              style={{
                border: '1px solid var(--color-border)',
                background: 'var(--color-bg-surface)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Path Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: 'var(--space-4)',
                  borderBottom: '1px solid var(--color-border)',
                  paddingBottom: 'var(--space-4)',
                  marginBottom: 'var(--space-6)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-2)' }}>
                    <span className="badge badge-blue">เส้นทางที่ {pIdx + 1}</span>
                    <span className="badge badge-violet">~{path.estimatedWeeks} สัปดาห์</span>
                    <span className="badge badge-emerald">{path.courses.length} คอร์สต่อเนื่อง</span>
                  </div>
                  <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
                    {path.title}
                  </h2>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginTop: '4px', maxWidth: '700px' }}>
                    {path.description}
                  </p>
                </div>

                {/* Path Progress Indicator */}
                <div style={{ minWidth: '180px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>ความสำเร็จรวม</span>
                    <span style={{ fontWeight: 'bold', color: 'var(--color-accent-primary)' }}>{pathAvgProgress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${pathAvgProgress}%` }} />
                  </div>
                </div>
              </div>

              {/* Step-by-Step Course Flow */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--color-text-tertiary)', textTransform: 'uppercase' }}>
                  ลำดับขั้นการเรียนรู้ (Roadmap):
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: 'var(--space-4)',
                    position: 'relative',
                  }}
                >
                  {pathCourses.map((course, stepIdx) => {
                    if (!course) return null;
                    const enrolled = isEnrolled(course.id);
                    const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
                    const prog = getCourseProgress(course.id, totalLessons);
                    const isDone = prog >= 100;

                    return (
                      <div
                        key={course.id}
                        className="card card-hover"
                        style={{
                          background: 'var(--color-bg-secondary)',
                          border: isDone ? '1px solid var(--color-success)' : '1px solid var(--color-border)',
                          padding: 'var(--space-4)',
                          display: 'flex',
                          flexDirection: 'column',
                          position: 'relative',
                        }}
                      >
                        {/* Step Number Badge */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                          <span
                            style={{
                              width: '26px',
                              height: '26px',
                              borderRadius: 'var(--radius-full)',
                              background: isDone ? 'var(--color-success)' : 'var(--color-accent-primary)',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 'var(--text-xs)',
                              fontWeight: 'bold',
                            }}
                          >
                            {isDone ? <CheckCircle2 size={16} /> : stepIdx + 1}
                          </span>
                          <span className="badge badge-blue">{course.level}</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-2)' }}>
                          <CategoryIcon name={course.icon} size={18} color="var(--color-accent-primary)" />
                          <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', margin: 0 }}>
                            {course.title}
                          </h4>
                        </div>

                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.4, marginBottom: 'var(--space-3)', flex: 1 }}>
                          {course.description}
                        </p>

                        <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-3)' }}>
                          ⏳ ~{course.estimatedHours} ชม. · {course.modules.length} โมดูล
                        </div>

                        {enrolled && (
                          <div style={{ marginBottom: 'var(--space-3)' }}>
                            <div className="progress-bar">
                              <div className="progress-fill" style={{ width: `${prog}%` }} />
                            </div>
                          </div>
                        )}

                        <button
                          className={`btn ${enrolled ? 'btn-primary' : 'btn-outline'} btn-sm`}
                          style={{ width: '100%', fontSize: 'var(--text-xs)' }}
                          onClick={() => {
                            if (!enrolled) enrollCourse(course.id);
                            navigate(`/courses/${course.id}`);
                          }}
                        >
                          {isDone ? 'ทบทวน' : enrolled ? 'เรียนต่อ' : 'เริ่มเรียนขั้นนี้'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LearningPaths;
