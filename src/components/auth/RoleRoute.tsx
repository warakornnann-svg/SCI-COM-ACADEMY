import React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { User } from '../../types';

interface RoleRouteProps {
  children: React.ReactNode;
  allowedRoles: Array<User['role']>;
}

export const RoleRoute: React.FC<RoleRouteProps> = ({ children, allowedRoles }) => {
  const { state } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  // If not logged in at all, redirect to login
  if (!state.user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If role is not allowed, show Access Denied
  if (!allowedRoles.includes(state.user.role)) {
    return (
      <div className="main-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', padding: 'var(--space-8)' }}>
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-danger)',
            marginBottom: 'var(--space-4)',
            boxShadow: '0 0 20px rgba(239, 68, 68, 0.25)',
          }}
        >
          <Lock size={36} />
        </div>
        <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold', marginBottom: 'var(--space-2)', color: 'var(--color-text-primary)' }}>
          พื้นที่จำกัดสิทธิ์เฉพาะ {allowedRoles.includes('admin') ? 'ผู้ดูแลระบบ (Admin)' : 'ครูผู้สอน'}
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', maxWidth: '480px', marginBottom: 'var(--space-6)', lineHeight: 1.6, fontSize: 'var(--text-sm)' }}>
          บัญชีของคุณ ("{state.user.displayName}") มีบทบาทเป็น <strong>"{state.user.role === 'student' ? 'นักเรียน' : state.user.role}"</strong> จึงไม่ได้รับอนุญาตให้เข้าถึงระบบจัดการหลังบ้านตามนโยบายความปลอดภัย
        </p>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/dashboard')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <ArrowLeft size={16} /> กลับสู่แดชบอร์ดนักเรียน
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

export default RoleRoute;
