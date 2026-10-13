import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  User,
  Shield,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Database,
  Server,
  RefreshCw,
  Clock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { executeRawQuery } from '../lib/database';

export const Settings: React.FC = () => {
  const { state, dispatch, setUserRole, setUserLevel, resetAllData, addNotification, dbStatus, refreshDatabase } = useApp();

  const [displayName, setDisplayName] = useState(state.user?.displayName || '');
  const [email, setEmail] = useState(state.user?.email || '');
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [isTestingDb, setIsTestingDb] = useState(false);
  const [healthResult, setHealthResult] = useState<string | null>(null);

  const handleRunHealthCheck = async () => {
    setIsTestingDb(true);
    setHealthResult(null);
    try {
      const res = await executeRawQuery('SELECT count(*)::int as course_count FROM public.courses;');
      if (res.error) {
        setHealthResult(`ข้อผิดพลาด: ${res.error}`);
        addNotification('error', 'การทดสอบเชื่อมต่อฐานข้อมูลล้มเหลว');
      } else {
        setHealthResult(`เชื่อมต่อสำเร็จสมบูรณ์! พบข้อมูลคอร์สเรียนใน PostgreSQL ${res.rows[0]?.course_count} รายการ (Latency: ${res.executionTimeMs} ms)`);
        addNotification('success', 'ทดสอบเชื่อมต่อ PostgreSQL สำเร็จ');
      }
    } catch (err: any) {
      setHealthResult(`เกิดข้อผิดพลาด: ${err.message}`);
    } finally {
      setIsTestingDb(false);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.user) return;

    dispatch({
      type: 'SET_USER',
      payload: {
        ...state.user,
        displayName: displayName.trim() || state.user.displayName,
        email: email.trim() || state.user.email,
      },
    });

    addNotification('success', 'บันทึกการตั้งค่าโปรไฟล์เรียบร้อย');
  };

  return (
    <div className="main-content" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: '800px' }}>
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
            <SettingsIcon size={22} />
          </div>
          <div>
            <h1 className="page-header-title">การตั้งค่า (Settings)</h1>
            <p className="page-header-desc">
              ปรับแต่งธีมการแสดงผล ข้อมูลส่วนตัว ระดับชั้น และสิทธิ์การใช้งานในระบบ
            </p>
          </div>
        </div>
      </div>

      {/* Theme Settings Card */}
      <div className="card">
        <h3 className="card-title" style={{ marginBottom: 'var(--space-2)' }}>
          🎨 ธีมและหน้าตาการแสดงผล (Appearance)
        </h3>
        <p className="card-subtitle" style={{ marginBottom: 'var(--space-4)' }}>
          เลือกโทนสีที่เหมาะกับสายตาของคุณ
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <div
            onClick={() => dispatch({ type: 'SET_THEME', payload: 'dark' })}
            style={{
              padding: 'var(--space-4)',
              borderRadius: 'var(--radius-lg)',
              border: state.theme === 'dark' ? '2px solid var(--color-accent-primary)' : '1px solid var(--color-border)',
              background: '#0f1729',
              color: '#f8fafc',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Moon size={18} color="#60a5fa" />
            </div>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: 'var(--text-sm)' }}>ธีมมืด (Dark Slate)</div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>แนะนำสำหรับลดแสงจ้าขณะเขียนโค้ด</div>
            </div>
          </div>

          <div
            onClick={() => dispatch({ type: 'SET_THEME', payload: 'light' })}
            style={{
              padding: 'var(--space-4)',
              borderRadius: 'var(--radius-lg)',
              border: state.theme === 'light' ? '2px solid var(--color-accent-primary)' : '1px solid var(--color-border)',
              background: '#ffffff',
              color: '#0f172a',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sun size={18} color="#f59e0b" />
            </div>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: 'var(--text-sm)' }}>ธีมสว่าง (Clean Light)</div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>ตัวหนังสือคมชัดสำหรับการอ่านเวลากลางวัน</div>
            </div>
          </div>
        </div>
      </div>

      {/* Guest Mode Notice in Settings */}
      {state.user?.role === 'guest' && (
        <div
          style={{
            padding: '16px 20px',
            borderRadius: 'var(--radius-xl)',
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <div style={{ fontWeight: 'bold', color: 'var(--color-warning)', fontSize: 'var(--text-base)', marginBottom: '4px' }}>
              💡 บัญชีผู้มาเยือน (Guest Mode)
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
              คุณมีสิทธิ์เทียบเท่านักเรียนในการเข้าถึงทุกหลักสูตรและแล็บปฏิบัติการ แต่ข้อมูลจะไม่ถูกบันทึกลงฐานข้อมูล เมื่อปิดเว็บข้อมูลที่เคยเรียนไว้จะหายทั้งหมด
            </div>
          </div>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => (window.location.href = '/login')}
          >
            สร้างบัญชีนักเรียน (เพื่อบันทึกข้อมูล)
          </button>
        </div>
      )}

      {/* Role & Academic Level Info */}
      <div className="card">
        <h3 className="card-title" style={{ marginBottom: 'var(--space-2)' }}>
          🛡️ บทบาทและสิทธิ์การใช้งาน (Role & Permissions)
        </h3>
        <p className="card-subtitle" style={{ marginBottom: 'var(--space-4)' }}>
          {state.user?.role === 'admin'
            ? 'คุณอยู่ในสถานะผู้ดูแลระบบ (Admin: น่าน) สามารถสลับบทบาทเพื่อตรวจสอบมุมมองของผู้ใช้งานได้'
            : state.user?.role === 'guest'
            ? 'สถานะปัจจุบัน: ผู้มาเยือน (Guest) — สิทธิ์เทียบเท่านักเรียน (ไม่บันทึกข้อมูลถาวร)'
            : `สถานะปัจจุบัน: นักเรียน (Student) — ชั้น ${state.user?.level || 'ม.4'}`}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-3)' }}>
          {[
            { role: 'student', label: 'นักเรียน (Student)', desc: 'เรียนรู้ ทำแบบทดสอบ บันทึกโปรเจกต์' },
            { role: 'teacher', label: 'ครูผู้สอน (Teacher)', desc: 'ดูรายงาน ตรวจงาน จัดการห้องเรียน' },
            { role: 'admin', label: 'ผู้ดูแลระบบ (Admin CMS)', desc: 'จัดการคอร์ส โมดูล และระบบทั้งหมด' },
          ].map((item) => {
            const isSelected = state.user?.role === item.role;
            const canSwitch = state.user?.role === 'admin';
            return (
              <div
                key={item.role}
                onClick={() => {
                  if (canSwitch) {
                    setUserRole(item.role as any);
                  } else {
                    addNotification('warning', 'เฉพาะผู้ดูแลระบบ (Admin น่าน) เท่านั้นที่สามารถเปลี่ยนบทบาทได้');
                  }
                }}
                style={{
                  padding: 'var(--space-4)',
                  borderRadius: 'var(--radius-lg)',
                  border: isSelected ? '2px solid var(--color-accent-primary)' : '1px solid var(--color-border)',
                  background: isSelected ? 'var(--color-accent-primary-muted)' : 'var(--color-bg-secondary)',
                  cursor: canSwitch ? 'pointer' : 'default',
                  opacity: !canSwitch && !isSelected ? 0.6 : 1,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontWeight: 'bold', fontSize: 'var(--text-sm)', color: isSelected ? 'var(--color-accent-primary)' : 'var(--color-text-primary)' }}>
                    {item.label}
                  </div>
                  {isSelected && <span className="badge badge-blue" style={{ fontSize: '10px' }}>ปัจจุบัน</span>}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                  {item.desc}
                </div>
              </div>
            );
          })}
        </div>

        {/* Level Switcher */}
        <div style={{ marginTop: 'var(--space-5)' }}>
          <label className="form-label">ระดับชั้นมัธยมศึกษา:</label>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            {(['ม.4', 'ม.5', 'ม.6'] as const).map((lvl) => (
              <button
                key={lvl}
                className={`btn btn-sm ${state.user?.level === lvl ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setUserLevel(lvl)}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Profile Details Edit */}
      {state.user && (
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: 'var(--space-4)' }}>
            👤 ข้อมูลบัญชีผู้ใช้
          </h3>

          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div className="form-group">
              <label className="form-label">ชื่อที่แสดงในระบบ</label>
              <input
                type="text"
                className="form-input"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">อีเมล</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn btn-primary btn-sm">
                บันทึกการแก้ไข
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Database & Storage Status Card */}
      <div className="card" style={{ border: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-accent-primary-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-accent-primary)',
              }}
            >
              <Database size={20} />
            </div>
            <div>
              <h3 className="card-title" style={{ margin: 0, fontSize: 'var(--text-base)' }}>
                ฐานข้อมูลจริง PostgreSQL (Database Engine)
              </h3>
              <p className="card-subtitle" style={{ margin: 0 }}>
                {dbStatus.provider}
              </p>
            </div>
          </div>

          <span className={`badge ${dbStatus.isReady ? 'badge-green' : 'badge-yellow'}`}>
            {dbStatus.isReady ? '● เชื่อมต่อสมบูรณ์ (Active)' : '○ กำลังเชื่อมต่อ...'}
          </span>
        </div>

        {/* Database Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-3)', marginTop: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
          <div style={{ background: 'var(--color-bg-secondary)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>ระบบฐานข้อมูล</div>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', marginTop: '2px', color: 'var(--color-text-primary)' }}>
              PostgreSQL (Relational SQL)
            </div>
          </div>

          <div style={{ background: 'var(--color-bg-secondary)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>จำนวนตารางในสกีมา</div>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', marginTop: '2px', color: 'var(--color-accent-primary)' }}>
              {dbStatus.tablesCount} ตาราง (33 Relational Tables)
            </div>
          </div>

          <div style={{ background: 'var(--color-bg-secondary)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>การรักษาความปลอดภัย</div>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', marginTop: '2px', color: 'var(--color-success)' }}>
              Row Level Security (RLS)
            </div>
          </div>

          <div style={{ background: 'var(--color-bg-secondary)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>การบันทึกถาวร</div>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', marginTop: '2px', color: 'var(--color-text-primary)' }}>
              Persistent Storage
            </div>
          </div>
        </div>

        {/* Health Check Feedback */}
        {healthResult && (
          <div
            style={{
              padding: 'var(--space-3) var(--space-4)',
              borderRadius: 'var(--radius-md)',
              background: healthResult.startsWith('ข้อผิดพลาด') ? 'var(--color-error-muted)' : 'var(--color-success-muted)',
              border: `1px solid ${healthResult.startsWith('ข้อผิดพลาด') ? 'var(--color-error)' : 'var(--color-success)'}`,
              fontSize: 'var(--text-xs)',
              marginBottom: 'var(--space-3)',
              color: healthResult.startsWith('ข้อผิดพลาด') ? 'var(--color-error)' : 'var(--color-success)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {healthResult}
          </div>
        )}

        {/* Database Actions */}
        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => refreshDatabase()}
            style={{ gap: '6px' }}
          >
            <RefreshCw size={14} /> ซิงค์ข้อมูลล่าสุดจากฐานข้อมูล
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={handleRunHealthCheck}
            disabled={isTestingDb}
            style={{ gap: '6px' }}
          >
            <Server size={14} /> {isTestingDb ? 'กำลังทดสอบ...' : 'ทดสอบคำสั่งไปยัง PostgreSQL (Health Check)'}
          </button>
        </div>
      </div>

      {/* Danger Zone: Reset Data */}
      <div className="card" style={{ border: '1px solid var(--color-error-muted)' }}>
        <h3 className="card-title" style={{ color: 'var(--color-error)', marginBottom: 'var(--space-2)' }}>
          ⚠️ ล้างข้อมูลและรีเซ็ตระบบ (Danger Zone)
        </h3>
        <p className="card-subtitle" style={{ marginBottom: 'var(--space-4)' }}>
          ล้างประวัติการเรียน ความก้าวหน้า และโปรเจกต์ที่บันทึกไว้ในเบราว์เซอร์นี้ทั้งหมดกลับสู่ค่าเริ่มต้น
        </p>

        {showConfirmReset ? (
          <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-error)' }}>
              คุณแน่ใจหรือไม่ว่าจะล้างข้อมูลทั้งหมด?
            </span>
            <button
              className="btn btn-sm"
              style={{ background: 'var(--color-error)', color: 'white' }}
              onClick={() => {
                resetAllData();
                setShowConfirmReset(false);
              }}
            >
              ยืนยันการล้างข้อมูล
            </button>
            <button className="btn btn-outline btn-sm" onClick={() => setShowConfirmReset(false)}>
              ยกเลิก
            </button>
          </div>
        ) : (
          <button
            className="btn btn-outline btn-sm"
            style={{ color: 'var(--color-error)', borderColor: 'var(--color-error)' }}
            onClick={() => setShowConfirmReset(true)}
          >
            <RotateCcw size={14} /> รีเซ็ตข้อมูลการเรียนทั้งหมด
          </button>
        )}
      </div>
    </div>
  );
};

export default Settings;
