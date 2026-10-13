import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Trophy,
  Award,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  BookOpen,
  Calendar,
  Layers,
  Share2,
  Download
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { courses } from '../data/courses';
import { getCourseCompletionStatus } from '../lib/database';

export const CourseSuccess: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { state } = useApp();

  const [loading, setLoading] = useState(true);
  const [completionData, setCompletionData] = useState<{
    completed: boolean;
    progress: number;
    completedAt?: string;
  } | null>(null);

  const allCourses = [...courses, ...state.customCourses];
  const course = allCourses.find((c) => c.id === courseId);

  useEffect(() => {
    async function checkStatus() {
      if (!courseId) return;
      setLoading(true);

      const userId = state.user?.id || 'guest';
      const status = await getCourseCompletionStatus(userId, courseId);
      
      // Also check client enrollment state as fallback
      const localEnrollment = state.enrollments.find((e) => e.courseId === courseId);

      if (status && status.completed) {
        setCompletionData(status);
      } else if (localEnrollment && localEnrollment.progress >= 100) {
        setCompletionData({
          completed: true,
          progress: 100,
          completedAt: localEnrollment.lastAccessedAt,
        });
      } else {
        setCompletionData(null);
      }

      setLoading(false);
    }

    checkStatus();
  }, [courseId, state.user, state.enrollments]);

  if (loading) {
    return (
      <div className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
            กำลังตรวจสอบบันทึกการเรียนจบจากฐานข้อมูล PostgreSQL...
          </p>
        </div>
      </div>
    );
  }

  // If completion is not verified by database records
  if (!completionData || !completionData.completed) {
    return (
      <div className="main-content" style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.15)',
            color: 'var(--color-danger)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto var(--space-4)',
          }}
        >
          <BookOpen size={32} />
        </div>
        <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold', marginBottom: 'var(--space-2)' }}>
          ยังไม่สำเร็จการศึกษาตามเกณฑ์ 100%
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', maxWidth: '480px', margin: '0 auto var(--space-6)', lineHeight: 1.6, fontSize: 'var(--text-sm)' }}>
          ระบบตรวจสอบพบว่าคุณยังเรียนบทเรียนหรือทำแบบทดสอบในคอร์สนี้ไม่ครบถ้วนตามเกณฑ์ความก้าวหน้า
        </p>
        <button className="btn btn-primary" onClick={() => navigate(`/courses/${courseId}`)}>
          กลับไปเรียนต่อให้ครบ 100%
        </button>
      </div>
    );
  }

  const completionDate = completionData.completedAt
    ? new Date(completionData.completedAt).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div
      className="main-content"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-8) 0',
      }}
    >
      <div
        className="card-3d glass-panel"
        style={{
          width: '100%',
          maxWidth: '680px',
          padding: 'var(--space-10) var(--space-8)',
          borderRadius: 'var(--radius-2xl)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(56, 189, 248, 0.2)',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 27, 75, 0.9) 50%, rgba(16, 185, 129, 0.15) 100%)',
        }}
      >
        {/* Ambient Celebration Light Glow */}
        <div
          style={{
            position: 'absolute',
            top: '-60px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(56, 189, 248, 0.25) 0%, rgba(16, 185, 129, 0.2) 50%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* 3D Floating Trophy */}
        <div className="floating-3d-slow" style={{ display: 'inline-block', marginBottom: 'var(--space-4)' }}>
          <div
            style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 0 35px rgba(245, 158, 11, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.4)',
              border: '3px solid rgba(255, 255, 255, 0.3)',
            }}
          >
            <Trophy size={48} />
          </div>
        </div>

        {/* Verified Badge */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: 'var(--space-3)' }}>
          <span className="badge badge-emerald" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', padding: '6px 14px' }}>
            <CheckCircle2 size={16} /> ยืนยันการจบหลักสูตร 100% (Verified Completion)
          </span>
          <span className="badge badge-cyan" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', padding: '6px 14px' }}>
            <Sparkles size={16} /> +100 XP สำเร็จการศึกษา
          </span>
        </div>

        {/* Title */}
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'bold', color: '#ffffff', marginBottom: 'var(--space-2)' }}>
          ขอแสดงความยินดี! คุณเรียนจบหลักสูตรแล้ว
        </h1>
        <h2 style={{ fontSize: 'var(--text-xl)', color: 'var(--color-accent-primary)', fontWeight: '600', marginBottom: 'var(--space-4)' }}>
          "{course?.title || 'หลักสูตรวิทยาศาสตร์-คอมพิวเตอร์'}"
        </h2>

        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-base)', lineHeight: 1.6, maxWidth: '520px', margin: '0 auto var(--space-6)' }}>
          คุณได้ศึกษาบทเรียน ทำกิจกรรมปฏิบัติการ และผ่านการทดสอบครบทุกข้อตามเกณฑ์การประเมิน
          บันทึกผลการเรียนรู้ถูกจัดเก็บลงในฐานข้อมูล PostgreSQL เรียบร้อยแล้ว
        </p>

        {/* Certificate / Verification Card */}
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.35)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-4) var(--space-6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            flexWrap: 'wrap',
            gap: 'var(--space-3)',
            marginBottom: 'var(--space-8)',
          }}
        >
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>ผู้สำเร็จการศึกษา</div>
            <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#ffffff' }}>
              {state.user?.displayName || 'นักเรียนสายวิทย์-คอม'}
            </div>
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>วันที่บันทึกสำเร็จ</div>
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={14} /> {completionDate}
            </div>
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>สถานะหลักสูตร</div>
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--color-success)' }}>
              เกรดผ่านดีเยี่ยม (100%)
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/dashboard')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: 'var(--space-3) var(--space-6)' }}
          >
            กลับสู่แดชบอร์ดนักเรียน <ArrowRight size={16} />
          </button>
          <button
            className="btn btn-outline"
            onClick={() => navigate('/achievements')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Award size={16} /> ดูเหรียญความสำเร็จ
          </button>
          <button
            className="btn btn-ghost"
            onClick={() => navigate('/courses')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <BookOpen size={16} /> ค้นหาคอร์สถัดไป
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseSuccess;
