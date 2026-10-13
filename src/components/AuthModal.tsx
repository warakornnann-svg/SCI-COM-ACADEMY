import React, { useState } from 'react';
import { X, Sparkles, GraduationCap, ShieldCheck, UserCheck, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, loginAsGuest } = useApp();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [level, setLevel] = useState<'ม.4' | 'ม.5' | 'ม.6'>('ม.4');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      if (!username.trim()) {
        throw new Error('กรุณากรอกชื่อผู้ใช้ (Username)');
      }
      if (!password.trim()) {
        throw new Error('กรุณากรอกรหัสผ่าน (Password)');
      }

      if (activeTab === 'register') {
        if (!displayName.trim()) {
          throw new Error('กรุณาระบุชื่อที่แสดงในระบบ');
        }
        if (password.length < 4) {
          throw new Error('รหัสผ่านต้องมีความยาวอย่างน้อย 4 ตัวอักษร');
        }
        await login(username.trim(), password, displayName.trim(), 'student', level);
      } else {
        await login(username.trim(), password);
      }

      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestEntry = () => {
    loginAsGuest();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <GraduationCap className="text-accent" size={24} color="#3b82f6" />
            <h3 className="modal-title">เข้าสู่ระบบ Sci-Com Academy</h3>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose} aria-label="ปิด">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* Guest Mode Card */}
          <div
            style={{
              padding: '12px 14px',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.08) 100%)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold', fontSize: '13px', color: 'var(--color-accent-primary)' }}>
                <Sparkles size={15} /> โหมดผู้มาเยือน (Guest Mode)
              </div>
              <span className="badge badge-emerald" style={{ fontSize: '10px' }}>สิทธิ์เทียบเท่านักเรียน</span>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.4 }}>
              ทดลองเรียนได้ทุกคอร์สและแล็บทันทีโดยไม่ต้องลงทะเบียน (เมื่อปิดเว็บ ข้อมูลที่เคยลองเรียนจะหายหมด)
            </p>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={handleGuestEntry}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                fontWeight: 600,
                color: 'var(--color-accent-primary)',
                borderColor: 'var(--color-accent-primary)',
              }}
            >
              <UserCheck size={14} /> เข้าใช้งานทันทีแบบผู้มาเยือน (Guest) →
            </button>
          </div>

          {/* Tab Switcher */}
          <div
            style={{
              display: 'flex',
              background: 'rgba(0, 0, 0, 0.25)',
              padding: '3px',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <button
              type="button"
              className={`btn btn-sm ${activeTab === 'login' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ flex: 1, borderRadius: 'var(--radius-sm)', fontSize: '12px' }}
              onClick={() => {
                setActiveTab('login');
                setErrorMsg('');
              }}
            >
              เข้าสู่ระบบ (Sign In)
            </button>
            <button
              type="button"
              className={`btn btn-sm ${activeTab === 'register' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ flex: 1, borderRadius: 'var(--radius-sm)', fontSize: '12px' }}
              onClick={() => {
                setActiveTab('register');
                setErrorMsg('');
              }}
            >
              สมัครสมาชิกใหม่ (Register)
            </button>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#f87171',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <AlertCircle size={14} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {activeTab === 'register' && (
              <>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '12px', fontWeight: 'bold' }}>ชื่อ-นามสกุล หรือชื่อเรียก</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="เช่น น่าน วิทยานุกูล หรือชื่อของคุณ"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '12px', fontWeight: 'bold' }}>ระดับชั้น</label>
                  <select
                    className="form-input form-select"
                    value={level}
                    onChange={(e) => setLevel(e.target.value as any)}
                  >
                    <option value="ม.4">มัธยมศึกษาปีที่ 4 (ม.4)</option>
                    <option value="ม.5">มัธยมศึกษาปีที่ 5 (ม.5)</option>
                    <option value="ม.6">มัธยมศึกษาปีที่ 6 (ม.6)</option>
                  </select>
                </div>
              </>
            )}

            <div className="form-group">
              <label className="form-label" style={{ fontSize: '12px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
                <span>ชื่อผู้ใช้ (Username)</span>
                <span style={{ color: 'var(--color-accent-primary)', fontWeight: 'normal', fontSize: '11px' }}>
                  * ไม่ต้องใส่ @gmail.com
                </span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder={activeTab === 'login' ? 'ชื่อผู้ใช้ของคุณ' : 'เช่น student01'}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoCapitalize="none"
                autoCorrect="off"
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontSize: '12px', fontWeight: 'bold' }}>รหัสผ่าน (Password)</label>
              <input
                type="password"
                className="form-input"
                placeholder="ระบุรหัสผ่านของคุณ"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="modal-footer" style={{ padding: 'var(--space-2) 0 0 0', borderTop: 'none', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button type="button" className="btn btn-outline btn-sm" onClick={onClose}>
                ยกเลิก
              </button>
              <button type="submit" className="btn btn-primary btn-sm" disabled={isLoading}>
                {isLoading ? 'กำลังเข้าสู่ระบบ...' : activeTab === 'login' ? 'เข้าสู่ระบบ (Sign In)' : 'สร้างบัญชีนักเรียน'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
