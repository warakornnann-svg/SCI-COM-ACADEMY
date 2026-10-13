import React, { useState } from 'react';
import {
  Code2,
  Terminal,
  Database,
  Cpu,
  Wifi,
  FileSpreadsheet,
  Keyboard,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  Zap,
  Filter,
  Layers,
  ChevronRight,
  GraduationCap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export interface LabDashboardProps {
  onSelectLab: (labId: string) => void;
}

export const LabDashboard: React.FC<LabDashboardProps> = ({ onSelectLab }) => {
  const { state } = useApp();
  const [levelFilter, setLevelFilter] = useState<'all' | 'ม.4' | 'ม.5' | 'ม.6'>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'เริ่มต้น' | 'ปานกลาง' | 'ขั้นสูง'>('all');

  const labCards = [
    {
      id: 'web',
      title: 'สตูดิโอพัฒนาเว็บ (Web Development Lab)',
      subtitle: 'HTML5 · CSS3 Glassmorphism · JavaScript DOM',
      grade: 'ม.4 - ม.5',
      difficulty: 'เริ่มต้น',
      icon: Code2,
      accentColor: '#3b82f6',
      gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.25), rgba(37, 99, 235, 0.05))',
      objectives: 'ฝึกสร้างหน้าเว็บด้วย HTML5 โครงสร้างมาตรฐาน ตกแต่งด้วย CSS3 Glassmorphism และ Responsive Flexbox พร้อมควบคุม DOM ด้วย JavaScript ใน Sandboxed Preview',
      totalExercises: 4,
      xpPerExercise: 35,
      features: ['Live Sandboxed Preview', 'Console Output Inspector', 'บันทึกโปรเจกต์ลงแฟ้มผลงาน', 'แม่แบบ UI 3 รูปแบบ'],
    },
    {
      id: 'programming',
      title: 'พื้นฐานการเขียนโปรแกรม & อัลกอริทึม (Programming Lab)',
      subtitle: 'C++ Simulation · JavaScript Algorithm · Test Cases',
      grade: 'ม.4 - ม.6',
      difficulty: 'ปานกลาง',
      icon: Terminal,
      accentColor: '#8b5cf6',
      gradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(109, 40, 217, 0.05))',
      objectives: 'ฝึกการคิดเชิงคำนวณและแก้โจทย์ปัญหา: ตัวแปร, นิพจน์, เงื่อนไข if-else, ลูป for/while, ฟังก์ชัน และโครงสร้างข้อมูล Array พร้อมระบบตรวจสอบ Test Cases',
      totalExercises: 6,
      xpPerExercise: 30,
      features: ['โจทย์ฝึกคิดตรรกะ 6 ข้อ', 'ระบบตรวจ Test Cases อัตโนมัติ', 'คำใบ้ Hints ในตัว', 'โหมด C++ ไวยากรณ์จำลอง'],
    },
    {
      id: 'sql',
      title: 'ห้องปฏิบัติการฐานข้อมูล (PostgreSQL & SQL Lab)',
      subtitle: 'PostgreSQL Engine · SELECT · JOIN · Aggregates',
      grade: 'ม.5 - ม.6',
      difficulty: 'ปานกลาง',
      icon: Database,
      accentColor: '#06b6d4',
      gradient: 'linear-gradient(135deg, rgba(6, 182, 212, 0.25), rgba(8, 145, 178, 0.05))',
      objectives: 'ฝึกเขียนคำสั่ง SQL จริงบนเอนจิน PostgreSQL: ค้นหาข้อมูลแบบมีเงื่อนไข, เรียงลำดับ, จัดกลุ่ม GROUP BY, สถิติ Aggregate และเชื่อมโยงตารางด้วย INNER/LEFT JOIN',
      totalExercises: 5,
      xpPerExercise: 40,
      features: ['PostgreSQL In-Browser Engine', 'ดู Schema 33 ตารางจริง', 'โจทย์ทดสอบพร้อมตัวตรวจผลลัพธ์', 'วัดเวลาประมวลผล (ms)'],
    },
    {
      id: 'esp32',
      title: 'สมองกลฝังตัว & ไอโอที (ESP32 & IoT Lab)',
      subtitle: 'GPIO Control · DHT22 Sensor · Virtual OLED · Wi-Fi IoT',
      grade: 'ม.5 - ม.6',
      difficulty: 'ขั้นสูง',
      icon: Cpu,
      accentColor: '#f59e0b',
      gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(217, 119, 6, 0.05))',
      objectives: 'เรียนรู้สถาปัตยกรรมบอร์ด ESP32, การควบคุมขาดิจิทัล GPIO, เซ็นเซอร์วัดอุณหภูมิ/ความชื้น DHT22, จอแสดงผล OLED 128x64, Serial Monitor และการสั่งงานผ่าน Wi-Fi Web Server',
      totalExercises: 4,
      xpPerExercise: 45,
      features: ['จำลองวงจรบอร์ด Breadboard', 'สไลเดอร์ปรับค่าอุณหภูมิ/ความชื้น', 'จอ OLED กราฟฟิกจำลอง', 'Serial Monitor 115200 baud'],
    },
    {
      id: 'fundamentals',
      title: 'พื้นฐานคอมพิวเตอร์และระบบเครือข่าย (Fundamentals & Networking)',
      subtitle: 'Hardware ID · 8-Bit Binary · IPv4 Subnetting · Packet Flow',
      grade: 'ม.4 - ม.5',
      difficulty: 'เริ่มต้น',
      icon: Wifi,
      accentColor: '#10b981',
      gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25), rgba(5, 150, 105, 0.05))',
      objectives: 'ระบุตำแหน่งและหน้าที่ของฮาร์ดแวร์คอมพิวเตอร์, วงจร IPOS, สวิตช์เลขฐานสอง 8 บิต/16 บิต, คำนวณ CIDR Subnet Mask, และจำลองเส้นทางส่งแพ็กเก็ตผ่าน Switch/Router',
      totalExercises: 5,
      xpPerExercise: 30,
      features: ['คลิกระบุชิ้นส่วนฮาร์ดแวร์', 'สลับบิตเลขฐานสอง 0/1 พร้อมค่าสิบ/Hex', 'เครื่องคำนวณ Subnet CIDR /8-/30', 'จำลองการ Ping ข้ามเครือข่าย'],
    },
    {
      id: 'office',
      title: 'ทักษะดิจิทัล & ออฟฟิศ (Microsoft Office & Digital Skills)',
      subtitle: 'Word Formatting · Excel Formulas · PowerPoint Design · Shortcuts',
      grade: 'ม.4',
      difficulty: 'เริ่มต้น',
      icon: FileSpreadsheet,
      accentColor: '#ec4899',
      gradient: 'linear-gradient(135deg, rgba(236, 72, 153, 0.25), rgba(219, 39, 119, 0.05))',
      objectives: 'ฝึกการจัดรูปแบบเอกสารรายงานเชิงวิชาการตามมาตรฐาน, ตารางคำนวณ Excel พร้อมสูตร =SUM, =AVERAGE, =IF และสร้างกราฟ, หลักการออกแบบสไลด์ และฝึกคีย์ลัด Windows สำคัญ',
      totalExercises: 4,
      xpPerExercise: 30,
      features: ['โปรแกรมจำลองสเปรดชีต Excel', 'สูตรคำนวณผลลัพธ์และกราฟแท่ง', 'ฝึกกฎ 6x6 Slide Presentation', 'ควิซคีย์ลัดแป้นพิมพ์ Windows'],
    },
    {
      id: 'typing',
      title: 'ฝึกพิมพ์ดีดสัมผัส (Touch Typing Lab)',
      subtitle: 'ภาษาไทย · English · โค้ดโปรแกรมมิ่ง (WPM / Accuracy)',
      grade: 'ม.4 - ม.6',
      difficulty: 'เริ่มต้น',
      icon: Keyboard,
      accentColor: '#6366f1',
      gradient: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(79, 70, 229, 0.05))',
      objectives: 'ฝึกทักษะการพิมพ์สัมผัสแป้นเหย้า ภาษาไทย แป้นพิมพ์ภาษาอังกฤษ และสัญลักษณ์โค้ดคำสั่ง เพิ่มความเร็ว WPM ความแม่นยำ และลดข้อผิดพลาดในการเขียนโปรแกรม',
      totalExercises: 3,
      xpPerExercise: 25,
      features: ['โหมดไทย / อังกฤษ / โค้ด', 'จับเวลา 30s, 60s, 180s', 'คำนวณ WPM, CPM, ความแม่นยำ %', 'บันทึกประวัติความเร็วลงฐานข้อมูล'],
    },
  ];

  // Calculate statistics across labs
  const completedLabCount = labCards.reduce((acc, lab) => {
    const completedInLab = state.labProgress.filter(
      (p) => p.labId === lab.id && p.completed
    ).length;
    return acc + completedInLab;
  }, 0);

  const totalExercisesCount = labCards.reduce((acc, lab) => acc + lab.totalExercises, 0);

  const filteredLabs = labCards.filter((lab) => {
    if (levelFilter !== 'all' && !lab.grade.includes(levelFilter)) return false;
    if (difficultyFilter !== 'all' && lab.difficulty !== difficultyFilter) return false;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Hero Glass Banner */}
      <div
        className="card card-3d glass-panel-glow"
        style={{
          padding: 'var(--space-8) var(--space-6)',
          position: 'relative',
          background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.85) 0%, rgba(15, 23, 42, 0.95) 100%)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-2)' }}>
            <span className="badge badge-blue" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Sparkles size={13} /> แผนการเรียนวิทยาศาสตร์-คอมพิวเตอร์ (ม.4 - ม.6)
            </span>
            <span className="badge badge-emerald">
              Interactive 3D Glass Environment
            </span>
          </div>

          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'bold', marginBottom: 'var(--space-3)', lineHeight: 1.3 }}>
            ศูนย์ฝึกปฏิบัติการจำลอง <span className="text-gradient-primary">Sci-Com Practical Labs</span>
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-base)', lineHeight: 1.7, marginBottom: 'var(--space-6)' }}>
            ห้องแล็บอินเทอร์แอคทีฟระดับมาตรฐาน ลงมือเขียนโค้ดจริงในเบราว์เซอร์ ทดสอบฐานข้อมูล PostgreSQL จำลองวงจรฮาร์ดแวร์ ESP32 ตรวจสอบเครือข่าย และพัฒนาทักษะดิจิทัลอย่างเข้มข้น
          </p>

          {/* Quick Metrics */}
          <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
            <div
              style={{
                padding: 'var(--space-3) var(--space-5)',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--glass-border)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'var(--color-accent-primary-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent-primary)' }}>
                <CheckCircle2 size={20} />
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>แบบฝึกหัดที่ทำสำเร็จ</div>
                <div style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold', color: '#f1f5f9' }}>
                  {completedLabCount} / {totalExercisesCount} <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>ภารกิจ</span>
                </div>
              </div>
            </div>

            <div
              style={{
                padding: 'var(--space-3) var(--space-5)',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--glass-border)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'var(--color-accent-secondary-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent-secondary)' }}>
                <Zap size={20} />
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>คะแนนสะสมจากห้องแล็บ</div>
                <div style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold', color: '#c084fc' }}>
                  {completedLabCount * 35} <span style={{ fontSize: 'var(--text-xs)' }}>XP</span>
                </div>
              </div>
            </div>

            <div
              style={{
                padding: 'var(--space-3) var(--space-5)',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--glass-border)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-success)' }}>
                <Database size={20} />
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>สถานะฐานข้อมูล</div>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-success)' }} />
                  {state.user ? 'บันทึกผลงานลง PostgreSQL' : 'โหมดบันทึกในเครื่อง (Local DB)'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Switcher Controls */}
      <div
        className="card"
        style={{
          padding: 'var(--space-4) var(--space-6)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-4)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--color-text-secondary)' }}>
            <Filter size={15} /> กรองตามระดับชั้น:
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {(['all', 'ม.4', 'ม.5', 'ม.6'] as const).map((lvl) => (
              <button
                key={lvl}
                className={`btn btn-sm ${levelFilter === lvl ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setLevelFilter(lvl)}
              >
                {lvl === 'all' ? 'ทุกระดับชั้น' : lvl}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
          <div style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--color-text-secondary)' }}>
            ความยาก:
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {(['all', 'เริ่มต้น', 'ปานกลาง', 'ขั้นสูง'] as const).map((diff) => (
              <button
                key={diff}
                className={`btn btn-sm ${difficultyFilter === diff ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setDifficultyFilter(diff)}
              >
                {diff === 'all' ? 'ทั้งหมด' : diff}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Lab Cards (3D Perspective tilt) */}
      <div className="card-3d-wrap" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 'var(--space-6)' }}>
        {filteredLabs.map((lab) => {
          const IconComponent = lab.icon;
          const completedInThisLab = state.labProgress.filter(
            (p) => p.labId === lab.id && p.completed
          ).length;
          const progressPercent = Math.min(100, Math.round((completedInThisLab / lab.totalExercises) * 100));

          return (
            <div
              key={lab.id}
              className="card card-3d card-interactive"
              onClick={() => onSelectLab(lab.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: 'var(--space-6)',
                position: 'relative',
                overflow: 'hidden',
                background: 'rgba(18, 26, 45, 0.75)',
                border: '1px solid var(--glass-border)',
              }}
            >
              {/* Header */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
                  <div
                    style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: 'var(--radius-xl)',
                      background: lab.gradient,
                      border: `1px solid ${lab.accentColor}44`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: lab.accentColor,
                      boxShadow: `0 8px 20px ${lab.accentColor}25`,
                    }}
                  >
                    <IconComponent size={28} />
                  </div>

                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.08)', fontSize: '11px' }}>
                      {lab.grade}
                    </span>
                    <span
                      className={`badge ${
                        lab.difficulty === 'เริ่มต้น'
                          ? 'badge-emerald'
                          : lab.difficulty === 'ปานกลาง'
                          ? 'badge-blue'
                          : 'badge-amber'
                      }`}
                      style={{ fontSize: '11px' }}
                    >
                      {lab.difficulty}
                    </span>
                  </div>
                </div>

                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', marginBottom: '4px', color: '#f1f5f9' }}>
                  {lab.title}
                </h3>
                <div style={{ fontSize: 'var(--text-xs)', color: lab.accentColor, fontWeight: 500, marginBottom: 'var(--space-3)' }}>
                  {lab.subtitle}
                </div>

                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 'var(--space-4)' }}>
                  {lab.objectives}
                </p>

                {/* Features Pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: 'var(--space-5)' }}>
                  {lab.features.map((feat, fIdx) => (
                    <span
                      key={fIdx}
                      style={{
                        fontSize: '11px',
                        padding: '3px 8px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--color-text-secondary)',
                      }}
                    >
                      ✓ {feat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Progress & Start Lab Button */}
              <div>
                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginBottom: '6px' }}>
                    <span>ความก้าวหน้า: {completedInThisLab} / {lab.totalExercises} ภารกิจ</span>
                    <span style={{ fontWeight: 'bold', color: progressPercent === 100 ? 'var(--color-success)' : 'var(--color-text-primary)' }}>
                      {progressPercent}%
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${progressPercent}%`,
                        height: '100%',
                        background: progressPercent === 100 ? 'var(--color-success)' : lab.accentColor,
                        borderRadius: '999px',
                        transition: 'width 0.5s ease',
                      }}
                    />
                  </div>
                </div>

                <button
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    gap: '8px',
                    background: lab.accentColor,
                    borderColor: lab.accentColor,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectLab(lab.id);
                  }}
                >
                  <span>{progressPercent > 0 && progressPercent < 100 ? 'ทำแบบฝึกหัดต่อ (Resume)' : progressPercent === 100 ? 'ทบทวนแล็บ (Review)' : 'เข้าสู่ห้องแล็บ (Start Lab)'}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LabDashboard;
