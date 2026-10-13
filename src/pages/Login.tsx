import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  GraduationCap,
  Sparkles,
  Lock,
  Mail,
  User,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  UserCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginAsGuest } = useApp();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [level, setLevel] = useState<'ม.4' | 'ม.5' | 'ม.6'>('ม.4');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Preserve intended destination from ProtectedRoute
  const destination = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      if (!username.trim()) {
        throw new Error('กรุณากรอกชื่อผู้ใช้ (Username)');
      }
      if (!password.trim()) {
        throw new Error('กรุณากรอกรหัสผ่าน');
      }

      if (activeTab === 'register') {
        if (!displayName.trim()) {
          throw new Error('กรุณากรอกชื่อ-นามสกุลสำหรับแสดงในระบบ');
        }
        if (password.length < 4) {
          throw new Error('รหัสผ่านต้องมีความยาวอย่างน้อย 4 ตัวอักษร');
        }
        // Register always creates a 'student' account
        await login(username.trim(), password, displayName.trim(), 'student', level);
      } else {
        // Sign in with username & password
        await login(username.trim(), password);
      }

      // Successful login -> navigate to preserved destination
      navigate(destination, { replace: true });
    } catch (err: any) {
      setErrorMsg(err.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาตรวจสอบข้อมูล');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = () => {
    loginAsGuest();
    navigate(destination, { replace: true });
  };

  return (
    <div
      className="main-content"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        padding: 'var(--space-6) 0',
      }}
    >
      <div
        className="card-3d glass-panel"
        style={{
          width: '100%',
          maxWidth: '520px',
          padding: 'var(--space-8)',
          borderRadius: 'var(--radius-2xl)',
          boxShadow: 'var(--color-glass-shadow)',
          border: '1px solid var(--color-glass-border)',
          position: 'relative',
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: 'var(--radius-xl)',
              background: 'var(--gradient-ocean)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--space-3)',
              boxShadow: 'var(--shadow-glow)',
            }}
          >
            <GraduationCap size={32} />
          </div>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
            Sci-Com Academy
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginTop: '4px' }}>
            ระบบยืนยันตัวตนและการจัดการสิทธิ์การเข้าเรียน (Role-Based Authentication)
          </p>
        </div>

        {/* Tab Switcher: Login vs Register */}
        <div
          style={{
            display: 'flex',
            background: 'rgba(0, 0, 0, 0.25)',
            padding: '4px',
            borderRadius: 'var(--radius-lg)',
            marginBottom: 'var(--space-4)',
          }}
        >
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'login' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ flex: 1, borderRadius: 'var(--radius-md)' }}
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
            style={{ flex: 1, borderRadius: 'var(--radius-md)' }}
            onClick={() => {
              setActiveTab('register');
              setErrorMsg('');
            }}
          >
            สมัครสมาชิกใหม่ (Register)
          </button>
        </div>

        {/* Error Alert Message */}
        {errorMsg && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#f87171',
              fontSize: 'var(--text-xs)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: 'var(--space-4)',
            }}
          >
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {activeTab === 'register' && (
            <>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold' }}>
                  ชื่อ-นามสกุล หรือชื่อเรียกในห้องเรียน
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="เช่น น่าน วิทยานุกูล หรือชื่อของคุณ"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold' }}>
                  ระดับชั้นการศึกษา
                </label>
                <select
                  className="form-input"
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
            <label className="form-label" style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
              <span>ชื่อผู้ใช้ (Username)</span>
              <span style={{ color: 'var(--color-accent-primary)', fontWeight: 'normal', fontSize: '11px' }}>
                * ไม่ต้องใส่ @gmail.com
              </span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder={activeTab === 'login' ? 'ชื่อผู้ใช้ของคุณ' : 'เช่น student01 (ใช้แค่ user และ pass)'}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoCapitalize="none"
              autoCorrect="off"
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold' }}>
              รหัสผ่าน (Password)
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="ระบุรหัสผ่านของคุณ"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-tertiary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
            style={{ marginTop: 'var(--space-2)', padding: 'var(--space-3)', fontSize: 'var(--text-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            {isLoading ? 'กำลังประมวลผล...' : activeTab === 'login' ? 'เข้าสู่ระบบ (Sign In)' : 'สร้างบัญชีนักเรียน'}
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Guest Mode Access */}
        <div style={{ marginTop: 'var(--space-6)', borderTop: '1px solid var(--color-border-subtle)', paddingTop: 'var(--space-5)' }}>
          <div
            style={{
              padding: 'var(--space-4)',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(139, 92, 246, 0.06) 100%)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid rgba(59, 130, 246, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-3)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--color-accent-primary)' }}>
                <Sparkles size={14} /> โหมดผู้มาเยือน (Guest Mode)
              </div>
              <span className="badge badge-emerald" style={{ fontSize: '10px' }}>
                สิทธิ์เทียบเท่านักเรียน
              </span>
            </div>

            <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5 }}>
              เข้าทดลองเรียนรู้ทุกหลักสูตร ทำโจทย์แบบฝึกหัด และใช้งานทุกห้องแล็บได้ทันทีโดยไม่ต้องลงทะเบียน
            </p>

            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                padding: '8px 10px',
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                borderRadius: 'var(--radius-md)',
                fontSize: '11px',
                color: 'var(--color-warning)',
                lineHeight: 1.4,
              }}
            >
              <AlertCircle size={14} style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <strong>ระบบจะไม่บันทึกข้อมูลถาวร:</strong> เมื่อปิดหน้าต่างเบราว์เซอร์หรือออกจากระบบ ข้อมูลและความก้าวหน้าที่เคยลองเรียนไว้จะถูกรีเซ็ตทั้งหมด
              </div>
            </div>

            <button
              type="button"
              className="btn btn-outline"
              onClick={handleGuestLogin}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontWeight: 600,
                padding: '10px',
                borderColor: 'var(--color-accent-primary)',
                color: 'var(--color-accent-primary)',
                background: 'rgba(59, 130, 246, 0.08)',
              }}
            >
              <UserCheck size={16} /> เข้าสู่ระบบในฐานะผู้มาเยือน (Guest) →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
