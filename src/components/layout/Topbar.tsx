import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Moon,
  Sun,
  Flame,
  Zap,
  LogIn,
  LogOut,
  User as UserIcon,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface TopbarProps {
  onOpenAuth: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenAuth }) => {
  const { state, dispatch, logout } = useApp();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const toggleTheme = () => {
    dispatch({
      type: 'SET_THEME',
      payload: state.theme === 'dark' ? 'light' : 'dark',
    });
  };

  // Calculate live user stats
  const completedLessonsCount = state.lessonProgress.filter(p => p.completed).length;
  const userXp = (state.user?.xp || 0) + (completedLessonsCount * 25) + (state.typingHistory.length * 10);
  const streak = state.user?.streak || (completedLessonsCount > 0 ? 1 : 0);

  return (
    <header className="topbar">
      <div className="topbar-left">
        {/* Mobile menu trigger */}
        <button
          className="topbar-mobile-menu"
          onClick={() => dispatch({ type: 'TOGGLE_MOBILE_SIDEBAR' })}
          aria-label="เปิดเมนูนำทาง"
        >
          <Menu size={22} />
        </button>

        {/* Global Search Input */}
        <form onSubmit={handleSearchSubmit} className="topbar-search">
          <Search className="topbar-search-icon" />
          <input
            type="text"
            className="topbar-search-input"
            placeholder="ค้นหาคอร์ส, บทเรียน, ภาษาโปรแกรม..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
      </div>

      <div className="topbar-right">
        {/* Streak indicator */}
        <div
          className="badge badge-amber"
          title="จำนวนวันที่เข้าเรียนต่อเนื่อง"
          style={{ padding: '6px 10px', fontSize: 'var(--text-xs)', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <Flame size={14} color="#f59e0b" />
          <span>{streak} วันติดกัน</span>
        </div>

        {/* XP indicator */}
        <div
          className="badge badge-violet"
          title="คะแนนประสบการณ์รวม (XP)"
          style={{ padding: '6px 10px', fontSize: 'var(--text-xs)', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <Zap size={14} color="#8b5cf6" />
          <span>{userXp} XP</span>
        </div>

        {/* Theme Toggle Button */}
        <button
          className="topbar-btn"
          onClick={toggleTheme}
          title={state.theme === 'dark' ? 'เปลี่ยนเป็นธีมสว่าง' : 'เปลี่ยนเป็นธีมมืด'}
          aria-label="สลับธีม"
        >
          {state.theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Profile / Auth */}
        {state.user ? (
          <div style={{ position: 'relative' }}>
            <button
              className="topbar-profile"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              style={state.user.role === 'admin' ? { borderColor: 'rgba(59, 130, 246, 0.5)' } : undefined}
            >
              <div
                className="topbar-avatar"
                style={
                  state.user.role === 'admin'
                    ? { background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', color: '#fff' }
                    : state.user.role === 'guest'
                    ? { background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.4)' }
                    : undefined
                }
              >
                {state.user.role === 'admin' ? '👑' : state.user.displayName.charAt(0).toUpperCase()}
              </div>
              <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
                <span className="topbar-profile-name">{state.user.displayName}</span>
                <span className="topbar-profile-role">
                  {state.user.role === 'admin'
                    ? 'ผู้ดูแลระบบ (Admin)'
                    : state.user.role === 'guest'
                    ? 'ผู้มาเยือน (Guest)'
                    : `${state.user.level} · นักเรียน`}
                </span>
              </div>
            </button>

            {showProfileMenu && (
              <div
                className="card"
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '110%',
                  minWidth: '220px',
                  padding: 'var(--space-2)',
                  zIndex: 'var(--z-dropdown)',
                  boxShadow: 'var(--shadow-xl)',
                }}
              >
                <div style={{ padding: 'var(--space-2) var(--space-3)', borderBottom: '1px solid var(--color-border)', marginBottom: 'var(--space-1)' }}>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>{state.user.displayName}</span>
                    {state.user.role === 'admin' && (
                      <span className="badge badge-blue" style={{ fontSize: '10px' }}>Admin</span>
                    )}
                    {state.user.role === 'guest' && (
                      <span className="badge badge-amber" style={{ fontSize: '10px' }}>ชั่วคราว</span>
                    )}
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                    {state.user.role === 'guest' ? 'ไม่ผูกอีเมล (โหมดทดลอง)' : state.user.email}
                  </div>
                </div>

                {state.user.role === 'guest' && (
                  <div
                    style={{
                      padding: '8px 10px',
                      background: 'rgba(245, 158, 11, 0.1)',
                      border: '1px solid rgba(245, 158, 11, 0.25)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '11px',
                      color: 'var(--color-warning)',
                      margin: '4px',
                      lineHeight: 1.4,
                    }}
                  >
                    ⚠️ <strong>โหมดผู้มาเยือน:</strong> ข้อมูลจะไม่ถูกบันทึกถาวร เมื่อปิดเว็บข้อมูลจะหายทั้งหมด
                    <button
                      type="button"
                      className="btn btn-primary btn-xs"
                      style={{ width: '100%', marginTop: '6px', fontSize: '11px' }}
                      onClick={() => {
                        setShowProfileMenu(false);
                        navigate('/login');
                      }}
                    >
                      สมัครบัญชีเพื่อบันทึก
                    </button>
                  </div>
                )}

                {state.user.role === 'admin' && (
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ width: '100%', justifyContent: 'flex-start', gap: '8px', color: '#60a5fa' }}
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate('/admin');
                    }}
                  >
                    <ShieldCheck size={14} /> ระบบจัดการแอดมิน (Admin CMS)
                  </button>
                )}

                <button
                  className="btn btn-ghost btn-sm"
                  style={{ width: '100%', justifyContent: 'flex-start', gap: '8px' }}
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate('/portfolio');
                  }}
                >
                  <UserIcon size={14} /> ดูแฟ้มผลงาน
                </button>
                <button
                  className="btn btn-ghost btn-sm"
                  style={{ width: '100%', justifyContent: 'flex-start', gap: '8px', color: 'var(--color-error)' }}
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                  }}
                >
                  <LogOut size={14} /> ออกจากระบบ
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            className="btn btn-primary btn-sm"
            onClick={onOpenAuth}
            style={{ gap: '6px' }}
          >
            <LogIn size={15} />
            <span>เข้าสู่ระบบ</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Topbar;
