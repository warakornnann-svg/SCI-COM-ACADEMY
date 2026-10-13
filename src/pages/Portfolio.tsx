import React, { useState } from 'react';
import {
  Award,
  ExternalLink,
  Mail,
  CheckCircle2,
  Share2,
  Printer,
  Sparkles,
  BookOpen,
  FolderGit2,
  Edit3,
  Globe,
  Lock,
  Layers
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { courses } from '../data/courses';

const GithubIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export const Portfolio: React.FC = () => {
  const { state, dispatch, addNotification } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [bioInput, setBioInput] = useState(state.portfolioProfile.bio);
  const [skillsInput, setSkillsInput] = useState(state.portfolioProfile.customSkills.join(', '));
  const [contactEmailInput, setContactEmailInput] = useState(state.portfolioProfile.contactEmail || '');
  const [githubUrlInput, setGithubUrlInput] = useState(state.portfolioProfile.githubUrl || '');

  const user = state.user;
  const displayName = user?.displayName || 'นักเรียนสายวิทย์-คอม';
  const level = user?.level || 'ม.4';

  const allCourses = [...courses, ...state.customCourses];

  // Completed courses
  const completedCourseList = state.enrollments
    .filter((e) => {
      const c = allCourses.find((co) => co.id === e.courseId);
      if (!c) return false;
      const totalLessons = c.modules.reduce((acc, m) => acc + m.lessons.length, 0);
      return totalLessons > 0 && e.completedLessons.length >= totalLessons;
    })
    .map((e) => allCourses.find((co) => co.id === e.courseId))
    .filter(Boolean);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: 'UPDATE_PORTFOLIO_PROFILE',
      payload: {
        bio: bioInput,
        customSkills: skillsInput.split(',').map((s) => s.trim()).filter(Boolean),
        contactEmail: contactEmailInput,
        githubUrl: githubUrlInput,
      },
    });
    setIsEditing(false);
    addNotification('success', 'บันทึกการเปลี่ยนแปลงแฟ้มผลงานเรียบร้อย');
  };

  const handleTogglePublic = () => {
    const nextState = !state.portfolioProfile.isPublic;
    dispatch({
      type: 'UPDATE_PORTFOLIO_PROFILE',
      payload: { isPublic: nextState },
    });
    addNotification('info', nextState ? 'เปิดการแสดงผล Portfolio สู่สาธารณะแล้ว' : 'ปิดการแสดงผล Portfolio สู่สาธารณะแล้ว (โหมดส่วนตัว)');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="main-content" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: '1000px' }}>
      {/* Top Controls Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            className={`btn btn-sm ${state.portfolioProfile.isPublic ? 'btn-primary' : 'btn-outline'}`}
            onClick={handleTogglePublic}
            style={{ gap: '6px' }}
          >
            {state.portfolioProfile.isPublic ? <Globe size={14} /> : <Lock size={14} />}
            <span>สถานะ: {state.portfolioProfile.isPublic ? 'เปิดสาธารณะ (Public)' : 'ส่วนตัว (Private)'}</span>
          </button>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button className="btn btn-outline btn-sm" onClick={() => setIsEditing(!isEditing)} style={{ gap: '6px' }}>
            <Edit3 size={14} /> {isEditing ? 'ยกเลิกการแก้ไข' : 'แก้ไขข้อมูลส่วนตัว'}
          </button>
          <button className="btn btn-outline btn-sm" onClick={handlePrint} style={{ gap: '6px' }}>
            <Printer size={14} /> พิมพ์ / ส่งออก PDF
          </button>
        </div>
      </div>

      {/* Edit Form Modal/Card */}
      {isEditing && (
        <div className="card" style={{ border: '1px solid var(--color-accent-primary)' }}>
          <h3 className="card-title" style={{ marginBottom: 'var(--space-4)' }}>✏️ แก้ไขข้อมูลแฟ้มผลงาน</h3>
          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div className="form-group">
              <label className="form-label">คำแนะนำตัวเองสั้นๆ (Biography)</label>
              <textarea
                className="form-input"
                style={{ minHeight: '80px' }}
                value={bioInput}
                onChange={(e) => setBioInput(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">ทักษะความสามารถ (คั่นด้วยจุลภาค)</label>
              <input
                type="text"
                className="form-input"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
              <div className="form-group">
                <label className="form-label">อีเมลติดต่อสำหรับงาน/ศึกษาต่อ</label>
                <input
                  type="email"
                  className="form-input"
                  value={contactEmailInput}
                  onChange={(e) => setContactEmailInput(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">ลิงก์ GitHub Profile</label>
                <input
                  type="url"
                  className="form-input"
                  value={githubUrlInput}
                  onChange={(e) => setGithubUrlInput(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
              <button type="button" className="btn btn-outline btn-sm" onClick={() => setIsEditing(false)}>
                ยกเลิก
              </button>
              <button type="submit" className="btn btn-primary btn-sm">
                บันทึกข้อมูล
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Portfolio Presentation Profile Card */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(30, 42, 66, 0.95) 0%, rgba(15, 23, 41, 0.95) 100%)',
          border: '1px solid var(--color-border)',
          padding: 'var(--space-8) var(--space-6)',
        }}
      >
        <div style={{ display: 'flex', gap: 'var(--space-6)', alignItems: 'center', flexWrap: 'wrap' }}>
          <div
            style={{
              width: '84px',
              height: '84px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--color-gradient-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 'var(--text-3xl)',
              fontWeight: 'bold',
              color: '#ffffff',
              boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)',
              flexShrink: 0,
            }}
          >
            {displayName.charAt(0).toUpperCase()}
          </div>

          <div style={{ flex: 1, minWidth: '260px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold', margin: 0 }}>
                {displayName}
              </h1>
              <span className="badge badge-blue">{level}</span>
              <span className="badge badge-emerald">สายวิทย์-คอม</span>
            </div>

            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.6, margin: 'var(--space-2) 0 var(--space-3)' }}>
              {state.portfolioProfile.bio}
            </p>

            <div style={{ display: 'flex', gap: 'var(--space-4)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', flexWrap: 'wrap' }}>
              {state.portfolioProfile.contactEmail && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Mail size={14} /> {state.portfolioProfile.contactEmail}
                </span>
              )}
              {state.portfolioProfile.githubUrl && (
                <a
                  href={state.portfolioProfile.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-accent-primary)', textDecoration: 'none' }}
                >
                  <GithubIcon size={14} /> GitHub Profile
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Skills Badges */}
      <div className="card">
        <h3 className="card-title" style={{ marginBottom: 'var(--space-3)' }}>
          🛠️ ทักษะและความสามารถ (Skills & Technologies)
        </h3>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {state.portfolioProfile.customSkills.map((sk, idx) => (
            <span
              key={idx}
              className="badge badge-blue"
              style={{ fontSize: 'var(--text-sm)', padding: '6px 14px' }}
            >
              {sk}
            </span>
          ))}
        </div>
      </div>

      {/* Student Projects Showcase */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">🚀 ผลงานและโครงงานที่สร้างสำเร็จ ({state.savedProjects.length})</h3>
            <p className="card-subtitle">ผลงานดิจิทัลที่พัฒนาขึ้นจริงผ่านระบบ Sci-Com Academy</p>
          </div>
        </div>

        {state.savedProjects.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
            ยังไม่มีโปรเจกต์ที่บันทึกไว้ใน Portfolio
          </div>
        ) : (
          <div className="grid grid-cols-2">
            {state.savedProjects.map((proj) => (
              <div
                key={proj.id}
                style={{
                  background: 'var(--color-bg-secondary)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-5)',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-2)' }}>
                  <span className="badge badge-blue">{proj.difficulty}</span>
                </div>

                <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', marginBottom: 'var(--space-1)' }}>
                  {proj.title}
                </h4>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: 'var(--space-4)', flex: 1 }}>
                  {proj.description}
                </p>

                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: 'var(--space-4)' }}>
                  {proj.skills.map((s, idx) => (
                    <span key={idx} className="badge badge-emerald" style={{ fontSize: '10px' }}>
                      {s}
                    </span>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-2)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-3)' }}>
                  {proj.demoUrl && (
                    <a
                      href={proj.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline btn-sm"
                      style={{ flex: 1, gap: '4px' }}
                    >
                      <ExternalLink size={13} /> ลิงก์สาธิต (Live Demo)
                    </a>
                  )}
                  {proj.repoUrl && (
                    <a
                      href={proj.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline btn-sm"
                      style={{ flex: 1, gap: '4px' }}
                    >
                      <GithubIcon size={13} /> Source Code
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Courses & Certifications Preview */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">📜 คอร์สเรียนที่สำเร็จการศึกษา</h3>
            <p className="card-subtitle">เกียรติบัตรรับรองความสำเร็จตามเกณฑ์ของโรงเรียน</p>
          </div>
        </div>

        {completedCourseList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
            เมื่อเรียนจบคอร์สใดคอร์สหนึ่งครบ 100% เกียรติบัตรจะปรากฏที่นี่โดยอัตโนมัติ
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
            {completedCourseList.map((course: any) => (
              <div
                key={course.id}
                style={{
                  background: 'var(--color-bg-secondary)',
                  border: '1px solid var(--color-success)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--color-success-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-success)',
                    flexShrink: 0,
                  }}
                >
                  <Award size={24} />
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: 'var(--text-sm)' }}>{course.title}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-success)' }}>✓ สำเร็จหลักสูตรครบ 100%</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;
