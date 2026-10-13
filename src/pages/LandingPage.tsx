import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Code2,
  Terminal,
  Cpu,
  Database,
  BookOpen,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Layers,
  GraduationCap,
  Wifi,
  Keyboard,
  Award
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useApp();

  return (
    <div className="main-content" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)', paddingBottom: 'var(--space-12)' }}>
      {/* Hero Section with 3D Glassmorphism */}
      <div
        className="card-3d glass-panel"
        style={{
          position: 'relative',
          padding: 'var(--space-10) var(--space-8)',
          borderRadius: 'var(--radius-2xl)',
          overflow: 'hidden',
          border: '1px solid var(--color-glass-border)',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 27, 75, 0.85) 50%, rgba(3, 105, 161, 0.75) 100%)',
          boxShadow: 'var(--color-glass-shadow)',
        }}
      >
        {/* Floating Ambient Lights */}
        <div
          style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '260px',
            height: '260px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(56, 189, 248, 0.25) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-40px',
            left: '20%',
            width: '220px',
            height: '220px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.25) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '780px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-3)' }}>
            <span className="badge badge-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <GraduationCap size={14} /> แพลตฟอร์มการเรียนรู้วิทยาศาสตร์-คอมพิวเตอร์
            </span>
            <span className="badge badge-success">ม.4 – ม.6 (สสวท. / สอวน.)</span>
          </div>

          <h1 style={{ fontSize: 'var(--text-4xl)', fontWeight: 'bold', lineHeight: 1.25, color: '#ffffff', marginBottom: 'var(--space-4)' }}>
            ก้าวสู่ยุคดิจิทัลด้วยการเรียนรู้ <br />
            <span className="text-gradient-primary">ลงมือปฏิบัติจริงแบบ 100%</span>
          </h1>

          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-lg)', lineHeight: 1.6, marginBottom: 'var(--space-6)' }}>
            Sci-Com Academy คือระบบนิเวศการเรียนการสอนคอมพิวเตอร์ระดับมัธยมศึกษาตอนปลาย 
            บูรณาการพื้นฐานฮาร์ดแวร์, โค้ดดิ้งภาษา C++ & JavaScript, ฐานข้อมูล PostgreSQL, 
            และสมองกลฝังตัว ESP32 IoT เข้ากับห้องปฏิบัติการจำลองในเบราว์เซอร์
          </p>

          <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            {state.user ? (
              <button
                className="btn btn-primary btn-lg"
                onClick={() => navigate('/dashboard')}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                เข้าสู่แดชบอร์ดการเรียน <ArrowRight size={18} />
              </button>
            ) : (
              <>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => navigate('/login')}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', boxShadow: 'var(--shadow-glow)' }}
                >
                  <Sparkles size={18} /> เข้าสู่ระบบเพื่อเริ่มเรียน
                </button>
                <button
                  className="btn btn-outline btn-lg"
                  onClick={() => navigate('/login?tab=register')}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  สมัครสมาชิกนักเรียนใหม่
                </button>
              </>
            )}
            <Link to="/help" className="btn btn-ghost btn-lg">
              คำถามที่พบบ่อย (FAQ)
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
            จุดเด่นของหลักสูตร Sci-Com Academy
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginTop: '4px' }}>
            ออกแบบตามมาตรฐานหลักสูตรแกนกลางการศึกษาขั้นพื้นฐาน และหลักสูตรโอลิมปิกวิชาการคอมพิวเตอร์
          </p>
        </div>

        <div className="grid grid-cols-3">
          <div className="card-3d glass-panel" style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-lg)', background: 'rgba(56, 189, 248, 0.15)', color: 'var(--color-accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
              <Code2 size={24} />
            </div>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', marginBottom: 'var(--space-2)' }}>
              Interactive Web Studio
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.5 }}>
              ฝึกเขียน HTML5, Modern CSS, และ JavaScript ใน Sandboxed Editor ที่ปลอดภัย แสดงผลเรียลไทม์พร้อมบันทึกผลงานลงแฟ้มสะสมงานทันที
            </p>
          </div>

          <div className="card-3d glass-panel" style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-lg)', background: 'rgba(168, 85, 247, 0.15)', color: 'var(--color-accent-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
              <Terminal size={24} />
            </div>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', marginBottom: 'var(--space-2)' }}>
              C++ & Algorithm Practice
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.5 }}>
              ฝึกคิดเชิงคำนวณและแก้โจทย์ปัญหาอัลกอริทึมมาตรฐาน สอวน. พร้อมระบบตรวจเคสทดสอบอัตโนมัติ (Automated Test Cases)
            </p>
          </div>

          <div className="card-3d glass-panel" style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-lg)', background: 'rgba(245, 158, 11, 0.15)', color: 'var(--color-warning)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
              <Cpu size={24} />
            </div>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', marginBottom: 'var(--space-2)' }}>
              ESP32 & IoT Lab
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.5 }}>
              เรียนรู้วงจรดิจิทัล ขา GPIO เซ็นเซอร์วัดอุณหภูมิ DHT22 จอ OLED และสร้างเว็บเซิร์ฟเวอร์ IoT ควบคุมผ่านสมาร์ตโฟน
            </p>
          </div>
        </div>
      </div>

      {/* Security & Access Protection Notice */}
      <div className="card glass-panel" style={{ padding: 'var(--space-5)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ShieldCheck size={32} color="#10b981" />
            <div>
              <div style={{ fontWeight: 'bold', fontSize: 'var(--text-base)', color: 'var(--color-text-primary)' }}>
                ระบบความปลอดภัยและการจัดเก็บข้อมูลบนฐานข้อมูลจริง
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                เข้าสู่ระบบเพื่อบันทึกประวัติการเรียนรู้ ผลคะแนนสอบ และการปลดล็อกเหรียญตราความสำเร็จ
              </div>
            </div>
          </div>
          <button className="btn btn-outline btn-sm" onClick={() => navigate('/login')}>
            เข้าสู่ระบบทันที
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
