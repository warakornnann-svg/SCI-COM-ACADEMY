import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  BookMarked,
  Compass,
  Layers,
  FlaskConical,
  FolderGit2,
  Trophy,
  Award,
  HelpCircle,
  Settings,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Sidebar: React.FC = () => {
  const { state, dispatch } = useApp();
  const location = useLocation();

  // Close mobile sidebar on route change
  React.useEffect(() => {
    dispatch({ type: 'CLOSE_MOBILE_SIDEBAR' });
  }, [location.pathname, dispatch]);

  const navSections = [
    {
      label: 'การเรียนรู้',
      items: [
        { path: '/', label: 'หน้าแรก', icon: LayoutDashboard },
        { path: '/courses', label: 'คลังบทเรียน', icon: BookOpen, badge: '13' },
        { path: '/learning-paths', label: 'เส้นทางการเรียนรู้', icon: Compass },
        { path: '/my-learning', label: 'การเรียนของฉัน', icon: BookMarked },
      ],
    },
    {
      label: 'ลงมือปฏิบัติ',
      items: [
        { path: '/practice', label: 'ห้องฝึกปฏิบัติ (Labs)', icon: FlaskConical, badge: '7 แล็บ' },
        { path: '/projects', label: 'ห้องสร้างโปรเจกต์', icon: FolderGit2 },
      ],
    },
    {
      label: 'ความก้าวหน้า & ผลงาน',
      items: [
        { path: '/portfolio', label: 'ผลงานของฉัน', icon: Award },
        { path: '/achievements', label: 'ความสำเร็จ', icon: Trophy },
      ],
    },
    {
      label: 'การสนับสนุน & ระบบ',
      items: [
        { path: '/help', label: 'ศูนย์ช่วยเหลือ', icon: HelpCircle },
        { path: '/settings', label: 'ตั้งค่า', icon: Settings },
        {
          path: '/admin',
          label: 'ผู้ดูแลระบบ (CMS)',
          icon: ShieldCheck,
          badge: state.user?.role === 'admin' ? 'Admin' : state.user?.role === 'teacher' ? 'ครู' : undefined,
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {state.sidebarMobileOpen && (
        <div
          className="modal-overlay"
          style={{ zIndex: 'var(--z-fixed)' }}
          onClick={() => dispatch({ type: 'CLOSE_MOBILE_SIDEBAR' })}
        />
      )}

      <aside
        className={`sidebar ${state.sidebarCollapsed ? 'collapsed' : ''} ${
          state.sidebarMobileOpen ? 'mobile-open' : ''
        }`}
      >
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <GraduationCap size={20} />
          </div>
          <div className="sidebar-brand-text">
            <span className="sidebar-brand-name">SCI-COM</span>
            <span className="sidebar-brand-sub">ACADEMY ม.4 - ม.6</span>
          </div>
          {/* Mobile Close Button */}
          {state.sidebarMobileOpen && (
            <button
              className="btn btn-ghost btn-sm"
              style={{ marginLeft: 'auto' }}
              onClick={() => dispatch({ type: 'CLOSE_MOBILE_SIDEBAR' })}
              aria-label="ปิดเมนู"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navSections.map((sec, secIdx) => (
            <div key={secIdx} className="sidebar-section">
              <div className="sidebar-section-label">{sec.label}</div>
              {sec.items.map((item) => {
                const IconComponent = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `sidebar-link ${isActive ? 'active' : ''}`
                    }
                    title={state.sidebarCollapsed ? item.label : undefined}
                  >
                    <IconComponent className="sidebar-link-icon" />
                    <span className="sidebar-link-text">{item.label}</span>
                    {item.badge && (
                      <span className="sidebar-link-badge">{item.badge}</span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer Collapse Button (Desktop only) */}
        <div className="sidebar-footer">
          <button
            className="sidebar-collapse-btn"
            onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
            title={state.sidebarCollapsed ? 'ขยายแถบเมนู' : 'ย่อแถบเมนู'}
          >
            {state.sidebarCollapsed ? (
              <ChevronRight size={18} />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', justifyContent: 'center' }}>
                <ChevronLeft size={18} />
                <span style={{ fontSize: 'var(--text-xs)' }}>ย่อเมนู</span>
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
