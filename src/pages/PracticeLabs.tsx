import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Code2,
  Terminal,
  Database,
  Cpu,
  Wifi,
  FileSpreadsheet,
  Keyboard,
  Layers,
  Sparkles
} from 'lucide-react';
import { LabDashboard } from './labs/LabDashboard';
import { WebLab } from './labs/WebLab';
import { ProgrammingLab } from './labs/ProgrammingLab';
import { SqlLab } from './labs/SqlLab';
import { Esp32Lab } from './labs/Esp32Lab';
import { FundamentalsNetworkingLab } from './labs/FundamentalsNetworkingLab';
import { OfficeSkillsLab } from './labs/OfficeSkillsLab';
import { TypingLab } from './labs/TypingLab';

export const PracticeLabs: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Active lab tab: 'dashboard' | 'web' | 'programming' | 'sql' | 'esp32' | 'fundamentals' | 'office' | 'typing'
  const initialLab = searchParams.get('lab') || 'dashboard';
  const [activeLab, setActiveLab] = useState<string>(initialLab);

  useEffect(() => {
    const labFromUrl = searchParams.get('lab');
    if (labFromUrl && labFromUrl !== activeLab) {
      setActiveLab(labFromUrl);
    } else if (!labFromUrl && activeLab !== 'dashboard') {
      setActiveLab('dashboard');
    }
  }, [searchParams]);

  const handleSelectLab = (labId: string) => {
    // Normalization for legacy / alias keys
    let target = labId;
    if (labId === 'cpp') target = 'programming';
    if (labId === 'networking') target = 'fundamentals';

    setActiveLab(target);
    if (target === 'dashboard') {
      setSearchParams({});
    } else {
      setSearchParams({ lab: target });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="main-content" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Top Header & Fast Lab Switcher */}
      <div className="page-header glass-panel" style={{ padding: 'var(--space-5)', borderRadius: 'var(--radius-xl)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--gradient-ocean)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: 'var(--shadow-glow)'
              }}
            >
              <Code2 size={24} />
            </div>
            <div>
              <h1 className="page-header-title" style={{ fontSize: 'var(--text-2xl)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                ศูนย์ปฏิบัติการคอมพิวเตอร์ (Sci-Com Practical Labs)
              </h1>
              <p className="page-header-desc">
                สภาพแวดล้อมฝึกปฏิบัติจริงแบบอินเทอร์แอคทีฟ สำหรับนักเรียนแผนการเรียนวิทยาศาสตร์-คอมพิวเตอร์ ม.4–6
              </p>
            </div>
          </div>

          {activeLab !== 'dashboard' && (
            <button
              className="btn btn-outline btn-sm"
              onClick={() => handleSelectLab('dashboard')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Layers size={14} /> หน้าหลักแดชบอร์ดแล็บ
            </button>
          )}
        </div>

        {/* Quick Nav Chips - Responsive Touch Scrollable & Wrap */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginTop: 'var(--space-4)',
            overflowX: 'auto',
            paddingBottom: '4px',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
          }}
        >
          <button
            className={`btn btn-xs ${activeLab === 'dashboard' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => handleSelectLab('dashboard')}
            style={{ flexShrink: 0, minHeight: '32px' }}
          >
            <Layers size={13} style={{ marginRight: '4px' }} /> แดชบอร์ด
          </button>
          <button
            className={`btn btn-xs ${activeLab === 'typing' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => handleSelectLab('typing')}
            style={{ flexShrink: 0, minHeight: '32px' }}
          >
            <Keyboard size={13} style={{ marginRight: '4px' }} /> ฝึกพิมพ์สัมผัส
          </button>
          <button
            className={`btn btn-xs ${activeLab === 'web' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => handleSelectLab('web')}
            style={{ flexShrink: 0, minHeight: '32px' }}
          >
            <Code2 size={13} style={{ marginRight: '4px' }} /> เว็บสตูดิโอ (HTML/CSS/JS)
          </button>
          <button
            className={`btn btn-xs ${activeLab === 'programming' || activeLab === 'cpp' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => handleSelectLab('programming')}
            style={{ flexShrink: 0, minHeight: '32px' }}
          >
            <Terminal size={13} style={{ marginRight: '4px' }} /> พื้นฐานโค้ดดิ้ง (C++/JS)
          </button>
          <button
            className={`btn btn-xs ${activeLab === 'sql' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => handleSelectLab('sql')}
            style={{ flexShrink: 0, minHeight: '32px' }}
          >
            <Database size={13} style={{ marginRight: '4px' }} /> ฐานข้อมูล SQL
          </button>
          <button
            className={`btn btn-xs ${activeLab === 'esp32' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => handleSelectLab('esp32')}
            style={{ flexShrink: 0, minHeight: '32px' }}
          >
            <Cpu size={13} style={{ marginRight: '4px' }} /> สมองกล ESP32 & IoT
          </button>
          <button
            className={`btn btn-xs ${activeLab === 'fundamentals' || activeLab === 'networking' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => handleSelectLab('fundamentals')}
            style={{ flexShrink: 0, minHeight: '32px' }}
          >
            <Wifi size={13} style={{ marginRight: '4px' }} /> ฮาร์ดแวร์ & เครือข่าย
          </button>
          <button
            className={`btn btn-xs ${activeLab === 'office' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => handleSelectLab('office')}
            style={{ flexShrink: 0, minHeight: '32px' }}
          >
            <FileSpreadsheet size={13} style={{ marginRight: '4px' }} /> MS Office & ทักษะดิจิทัล
          </button>
        </div>
      </div>

      {/* Render Selected Lab Component */}
      {activeLab === 'dashboard' && <LabDashboard onSelectLab={handleSelectLab} />}
      {activeLab === 'web' && <WebLab onBack={() => handleSelectLab('dashboard')} />}
      {(activeLab === 'programming' || activeLab === 'cpp') && (
        <ProgrammingLab onBack={() => handleSelectLab('dashboard')} />
      )}
      {activeLab === 'sql' && <SqlLab onBack={() => handleSelectLab('dashboard')} />}
      {activeLab === 'esp32' && <Esp32Lab onBack={() => handleSelectLab('dashboard')} />}
      {(activeLab === 'fundamentals' || activeLab === 'networking') && (
        <FundamentalsNetworkingLab onBack={() => handleSelectLab('dashboard')} />
      )}
      {activeLab === 'office' && <OfficeSkillsLab onBack={() => handleSelectLab('dashboard')} />}
      {activeLab === 'typing' && <TypingLab onBack={() => handleSelectLab('dashboard')} />}
    </div>
  );
};
export default PracticeLabs;
