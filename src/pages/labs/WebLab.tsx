import React, { useState, useEffect } from 'react';
import {
  Code2,
  Play,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  FolderGit2,
  HelpCircle,
  Award,
  Layers,
  Zap,
  Terminal,
  Maximize2,
  Check,
  Copy,
  Trash2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { StudentProject } from '../../types';

interface WebTemplate {
  id: string;
  name: string;
  html: string;
  css: string;
  js: string;
}

interface WebChallenge {
  id: string;
  title: string;
  difficulty: 'เริ่มต้น' | 'ปานกลาง';
  description: string;
  targetCriteria: string[];
  starterHtml: string;
  starterCss: string;
  starterJs: string;
  solutionHint: string;
  validationCheck: (html: string, css: string, js: string) => boolean;
}

const templates: WebTemplate[] = [
  {
    id: 'glass-card',
    name: '1. การ์ดโปรไฟล์ 3D Glassmorphism',
    html: `<div class="glass-card">
  <div class="avatar">👨‍💻</div>
  <h2>สมชาย สายวิทย์-คอม</h2>
  <p class="role">นักเรียนชั้น ม.4 · Sci-Com Academy</p>
  <div class="skills">
    <span class="badge">HTML5</span>
    <span class="badge">CSS3</span>
    <span class="badge">JavaScript</span>
  </div>
  <button id="btnHeart" class="btn">❤️ ให้กำลังใจ (<span id="count">0</span>)</button>
</div>`,
    css: `body {
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: radial-gradient(circle at 10% 20%, #1e1b4b 0%, #0f172a 90%);
  font-family: system-ui, sans-serif;
  color: #f8fafc;
}

.glass-card {
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  padding: 32px;
  text-align: center;
  width: 280px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.avatar {
  font-size: 50px;
  margin-bottom: 12px;
}

h2 {
  margin: 0 0 6px;
  font-size: 20px;
}

.role {
  color: #94a3b8;
  font-size: 13px;
  margin: 0 0 16px;
}

.skills {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 20px;
}

.badge {
  background: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
  border: 1px solid rgba(59, 130, 246, 0.3);
  padding: 4px 10px;
  border-radius: 99px;
  font-size: 11px;
}

.btn {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
  transition: transform 0.15s ease;
}

.btn:hover {
  transform: scale(1.05);
}`,
    js: `let likes = 0;
const btn = document.getElementById('btnHeart');
const countSpan = document.getElementById('count');

btn.addEventListener('click', () => {
  likes++;
  countSpan.textContent = likes;
  console.log('ส่งกำลังใจสำเร็จ! ยอดรวม: ' + likes);
});`,
  },
  {
    id: 'flex-grid',
    name: '2. เลย์เอาต์กล่อง Flexbox Responsive',
    html: `<div class="container">
  <div class="box">
    <h3>🌐 เว็บไซต์</h3>
    <p>HTML / CSS / JS</p>
  </div>
  <div class="box">
    <h3>⚡ สมองกล</h3>
    <p>ESP32 & Sensors</p>
  </div>
  <div class="box">
    <h3>💾 ฐานข้อมูล</h3>
    <p>PostgreSQL & SQL</p>
  </div>
</div>`,
    css: `body {
  margin: 0;
  padding: 30px;
  background: #090d16;
  font-family: sans-serif;
  color: #f1f5f9;
}

.container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  max-width: 650px;
  margin: 0 auto;
}

.box {
  flex: 1 1 180px;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  transition: transform 0.2s;
}

.box:hover {
  transform: translateY(-4px);
  border-color: #3b82f6;
}`,
    js: `console.log('Flexbox layout loaded successfully.');`,
  },
];

const challenges: WebChallenge[] = [
  {
    id: 'wc-1',
    title: 'ภารกิจที่ 1: ตกแต่งการ์ดด้วย Glassmorphism (ม.4)',
    difficulty: 'เริ่มต้น',
    description: 'ฝึกแต่งสไตล์การ์ดโดยใส่เอฟเฟกต์โปร่งแสง backdrop-filter และขอบมน border-radius',
    targetCriteria: [
      'มีคลาส .card หรือแท็ก div ที่กำหนด background โปร่งแสง (rgba)',
      'มีการใช้คุณสมบัติ backdrop-filter: blur(...) หรือ -webkit-backdrop-filter',
      'มี border-radius ไม่น้อยกว่า 12px',
    ],
    starterHtml: `<div class="card">
  <h2>นักเรียนสายวิทย์-คอม</h2>
  <p>ภารกิจ: ใส่สไตล์ Glassmorphism ให้การ์ดนี้</p>
</div>`,
    starterCss: `body {
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #0a0f1d;
  color: white;
  font-family: sans-serif;
}

.card {
  /* เติมสไตล์ Glassmorphism ตรงนี้ */
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}`,
    starterJs: `console.log('Challenge 1 ready');`,
    solutionHint: 'ใช้ background: rgba(30, 41, 59, 0.7); ร่วมกับ backdrop-filter: blur(12px); และ border-radius: 16px;',
    validationCheck: (html, css) => {
      const lower = css.toLowerCase();
      return (
        lower.includes('backdrop-filter') &&
        lower.includes('blur') &&
        lower.includes('border-radius')
      );
    },
  },
  {
    id: 'wc-2',
    title: 'ภารกิจที่ 2: ควบคุมปุ่มคลิกด้วย Event Listener (ม.4)',
    difficulty: 'เริ่มต้น',
    description: 'เขียน JavaScript เพื่อผูกอีเวนต์ addEventListener("click", ...) เมื่อกดปุ่มแล้วให้เปลี่ยนข้อความ',
    targetCriteria: [
      'มีปุ่ม <button id="btnAction"> หรือปุ่มใน HTML',
      'มีคำสั่ง addEventListener สำหรับการคลิก (click)',
      'มีการเปลี่ยนข้อความ textContent หรือ innerText เมื่อกด',
    ],
    starterHtml: `<div style="text-align: center; padding: 40px; font-family: sans-serif; color: white;">
  <h1 id="statusText">ยินดีต้อนรับสู่ Sci-Com</h1>
  <button id="btnAction" style="padding: 10px 20px; font-size: 16px; cursor: pointer; border-radius: 8px; background: #3b82f6; color: white; border: none;">
    กดเพื่อเริ่มเรียนรู้
  </button>
</div>`,
    starterCss: `body { background: #0f172a; }`,
    starterJs: `const btn = document.getElementById('btnAction');
const txt = document.getElementById('statusText');

btn.addEventListener('click', () => {
  txt.textContent = '🚀 กำลังเข้าสู่บทเรียนถัดไป!';
  console.log('User clicked action button');
});`,
    solutionHint: 'ใช้ document.getElementById เพื่อดึงปุ่มและข้อความ จากนั้นใช้ .addEventListener("click", () => { txt.textContent = "..."; })',
    validationCheck: (html, css, js) => {
      const lower = js.toLowerCase();
      return (
        lower.includes('addeventlistener') &&
        lower.includes('click') &&
        (lower.includes('textcontent') || lower.includes('innertext') || lower.includes('innerhtml'))
      );
    },
  },
  {
    id: 'wc-3',
    title: 'ภารกิจที่ 3: จัดเรียงเมนูบาร์ด้วย Flexbox (ม.5)',
    difficulty: 'ปานกลาง',
    description: 'จัดเรียงแถบเมนูให้อยู่ในแนวนอนและกระจายอย่างสวยงามด้วย display: flex และ justify-content',
    targetCriteria: [
      'ใช้ display: flex บนคลาสคอนเทนเนอร์นำทาง .navbar หรือ .nav',
      'ใช้ justify-content: space-between หรือ space-around',
      'มีระยะห่าง gap หรือ padding อย่างเหมาะสม',
    ],
    starterHtml: `<nav class="navbar">
  <div class="brand">SCI-COM</div>
  <div class="nav-links">
    <span>หน้าแรก</span>
    <span>คอร์สเรียน</span>
    <span>ห้องแล็บ</span>
  </div>
</nav>`,
    starterCss: `body { margin: 0; background: #090d16; font-family: sans-serif; color: white; }
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: rgba(30, 41, 59, 0.8);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.nav-links {
  display: flex;
  gap: 16px;
  font-size: 14px;
}`,
    starterJs: `console.log('Navigation bar loaded');`,
    solutionHint: 'กำหนด display: flex; และ justify-content: space-between; ให้กับกล่องคอนเทนเนอร์หลักของเมนู',
    validationCheck: (html, css) => {
      const lower = css.toLowerCase();
      return lower.includes('display: flex') || lower.includes('display:flex') && lower.includes('justify-content');
    },
  },
];

interface WebLabProps {
  onBack?: () => void;
}

export const WebLab: React.FC<WebLabProps> = ({ onBack }) => {
  const { state, saveProject, saveLabExercise, isLabExerciseCompleted, addNotification } = useApp();

  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');
  const [activeChallengeIdx, setActiveChallengeIdx] = useState<number | null>(null);

  const [htmlCode, setHtmlCode] = useState(templates[0].html);
  const [cssCode, setCssCode] = useState(templates[0].css);
  const [jsCode, setJsCode] = useState(templates[0].js);

  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [saveTitle, setSaveTitle] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [challengePassed, setChallengePassed] = useState<boolean | null>(null);

  // Load a starter template
  const handleLoadTemplate = (t: WebTemplate) => {
    setActiveChallengeIdx(null);
    setHtmlCode(t.html);
    setCssCode(t.css);
    setJsCode(t.js);
    setConsoleLogs([]);
    setChallengePassed(null);
    addNotification('info', `โหลดแม่แบบ "${t.name}" แล้ว`);
  };

  // Load a challenge
  const handleLoadChallenge = (idx: number) => {
    setActiveChallengeIdx(idx);
    const c = challenges[idx];
    setHtmlCode(c.starterHtml);
    setCssCode(c.starterCss);
    setJsCode(c.starterJs);
    setConsoleLogs([]);
    setShowHint(false);
    setChallengePassed(null);
    addNotification('info', `เริ่มทำ "${c.title}"`);
  };

  // Compile sandboxed srcDoc
  const compiledSrcDoc = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>${cssCode}</style>
      </head>
      <body>
        ${htmlCode}
        <script>
          window.console.log = function(...args) {
            window.parent.postMessage({ type: 'CONSOLE_LOG', payload: args.join(' ') }, '*');
          };
          window.console.error = function(...args) {
            window.parent.postMessage({ type: 'CONSOLE_ERROR', payload: args.join(' ') }, '*');
          };
          try {
            ${jsCode}
          } catch (err) {
            window.parent.postMessage({ type: 'CONSOLE_ERROR', payload: 'Error: ' + err.message }, '*');
          }
        </script>
      </body>
    </html>
  `;

  // Listen for iframe console messages
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'CONSOLE_LOG') {
        setConsoleLogs((prev) => [...prev.slice(-30), `[LOG] ${e.data.payload}`]);
      } else if (e.data?.type === 'CONSOLE_ERROR') {
        setConsoleLogs((prev) => [...prev.slice(-30), `[ERR] ${e.data.payload}`]);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Validate active challenge
  const handleValidateChallenge = () => {
    if (activeChallengeIdx === null) {
      addNotification('info', 'กำลังรันโค้ดแสดงผลสด (ไม่มีภารกิจที่เลือก)');
      return;
    }
    const c = challenges[activeChallengeIdx];
    const isSuccess = c.validationCheck(htmlCode, cssCode, jsCode);
    setChallengePassed(isSuccess);

    if (isSuccess) {
      saveLabExercise('web', c.id, true, 35, `${htmlCode}\n/* CSS */\n${cssCode}`);
      addNotification('success', `ยินดีด้วย! ผ่าน "${c.title}" เรียบร้อย (+35 XP บันทึกในฐานข้อมูลแล้ว)`);
    } else {
      addNotification('warning', 'โค้ดยังไม่ผ่านเงื่อนไขครบทุกข้อ ลองดูคำใบ้หรือตรวจสอบโค้ดอีกครั้ง');
    }
  };

  // Save current project to student projects
  const handleSaveToPortfolio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!saveTitle.trim()) return;

    const newProject: StudentProject = {
      id: 'sp-' + Date.now(),
      userId: state.user?.id || 'guest',
      title: saveTitle.trim(),
      description: 'ผลงานที่สร้างจากห้องปฏิบัติการ Web Development Playground (HTML, CSS, JS)',
      category: 'web-development',
      difficulty: 'เริ่มต้น',
      tags: ['HTML', 'CSS', 'JavaScript', 'Web Playground'],
      skills: ['HTML5', 'CSS3', 'JavaScript'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveProject(newProject);
    setShowSaveModal(false);
    setSaveTitle('');
  };

  const handleResetCurrent = () => {
    if (activeChallengeIdx !== null) {
      handleLoadChallenge(activeChallengeIdx);
    } else {
      setHtmlCode(templates[0].html);
      setCssCode(templates[0].css);
      setJsCode(templates[0].js);
    }
    setConsoleLogs([]);
    setChallengePassed(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Top Banner & Challenges Bar */}
      <div className="card" style={{ padding: 'var(--space-4) var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <div>
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Code2 color="#3b82f6" /> สตูดิโอพัฒนาเว็บ (Interactive Web Studio)
            </h2>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
              เขียน HTML, CSS และ JavaScript ในสภาพแวดล้อม Sandboxed ปลอดภัย แสดงผลทันทีพร้อมบันทึกผลงานลงฐานข้อมูล
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary btn-sm"
              onClick={handleValidateChallenge}
              style={{ gap: '6px' }}
            >
              <Play size={14} fill="currentColor" /> {activeChallengeIdx !== null ? 'ตรวจสอบภารกิจ (Evaluate)' : 'รันโค้ด (Run Code)'}
            </button>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => setShowSaveModal(true)}
              style={{ gap: '6px' }}
            >
              <FolderGit2 size={14} /> บันทึกใส่พอร์ต
            </button>
            <button
              className="btn btn-ghost btn-sm"
              onClick={handleResetCurrent}
              title="รีเซ็ตโค้ดกลับสู่ค่าเริ่มต้น"
            >
              <RotateCcw size={14} />
            </button>
            {onBack && (
              <button
                className="btn btn-outline btn-sm"
                onClick={onBack}
                title="กลับแดชบอร์ดแล็บ"
              >
                ← แดชบอร์ด
              </button>
            )}
          </div>
        </div>

        {/* Challenge Selector Pills */}
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-4)', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--color-text-tertiary)' }}>
            🎯 ภารกิจฝึกหัด:
          </span>
          {challenges.map((c, idx) => {
            const isCompleted = isLabExerciseCompleted('web', c.id);
            const isSelected = activeChallengeIdx === idx;
            return (
              <button
                key={c.id}
                className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-outline'}`}
                style={{ fontSize: '12px', padding: '4px 10px', gap: '6px' }}
                onClick={() => handleLoadChallenge(idx)}
              >
                {isCompleted && <CheckCircle2 size={13} color="var(--color-success)" />}
                <span>{c.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Challenge Instructions (if active) */}
      {activeChallengeIdx !== null && (
        <div
          className="card"
          style={{
            background: 'rgba(59, 130, 246, 0.08)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            padding: 'var(--space-5)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span className="badge badge-blue">ระดับ {challenges[activeChallengeIdx].difficulty}</span>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold' }}>
                  {challenges[activeChallengeIdx].title}
                </h3>
              </div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}>
                {challenges[activeChallengeIdx].description}
              </p>
            </div>
            <button
              className="btn btn-ghost btn-sm"
              style={{ fontSize: 'var(--text-xs)', gap: '4px' }}
              onClick={() => setShowHint(!showHint)}
            >
              <HelpCircle size={14} /> {showHint ? 'ซ่อนคำใบ้' : 'ดูคำใบ้ (Hint)'}
            </button>
          </div>

          {/* Criteria Checklist */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
            <span style={{ fontWeight: 'bold', color: 'var(--color-text-primary)' }}>เกณฑ์ที่ต้องทำให้ผ่าน:</span>
            {challenges[activeChallengeIdx].targetCriteria.map((crit, cIdx) => (
              <div key={cIdx} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: 'var(--color-accent-primary)' }}>•</span> {crit}
              </div>
            ))}
          </div>

          {showHint && (
            <div style={{ marginTop: 'var(--space-3)', padding: 'var(--space-3)', background: 'rgba(0, 0, 0, 0.3)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)', color: '#38bdf8' }}>
              💡 <strong>คำใบ้:</strong> {challenges[activeChallengeIdx].solutionHint}
            </div>
          )}

          {challengePassed !== null && (
            <div
              style={{
                marginTop: 'var(--space-3)',
                padding: 'var(--space-3) var(--space-4)',
                borderRadius: 'var(--radius-md)',
                background: challengePassed ? 'var(--color-success-muted)' : 'var(--color-error-muted)',
                border: `1px solid ${challengePassed ? 'var(--color-success)' : 'var(--color-error)'}`,
                color: challengePassed ? 'var(--color-success)' : 'var(--color-error)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {challengePassed ? <CheckCircle2 size={18} /> : <Zap size={18} />}
              <span>{challengePassed ? 'ยินดีด้วย! คุณผ่านภารกิจนี้เรียบร้อย (+35 XP)' : 'ยังไม่ผ่านเงื่อนไข ลองแก้ไขโค้ดตามคำใบ้แล้วกดตรวจสอบอีกครั้ง'}</span>
            </div>
          )}
        </div>
      )}

      {/* Editor & Preview Split Workspace */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: 'var(--space-4)', minHeight: '560px' }}>
        {/* Left: Code Editor Tabs */}
        <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {/* Tabs Switcher */}
          <div style={{ display: 'flex', background: 'rgba(10, 15, 29, 0.9)', borderBottom: '1px solid var(--color-border)', padding: '4px 8px', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                className={`btn btn-sm ${activeTab === 'html' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ fontSize: '12px', padding: '4px 12px' }}
                onClick={() => setActiveTab('html')}
              >
                HTML
              </button>
              <button
                className={`btn btn-sm ${activeTab === 'css' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ fontSize: '12px', padding: '4px 12px' }}
                onClick={() => setActiveTab('css')}
              >
                CSS
              </button>
              <button
                className={`btn btn-sm ${activeTab === 'js' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ fontSize: '12px', padding: '4px 12px' }}
                onClick={() => setActiveTab('js')}
              >
                JavaScript
              </button>
            </div>

            <div style={{ display: 'flex', gap: '4px' }}>
              {templates.map((tpl) => (
                <button
                  key={tpl.id}
                  className="btn btn-ghost btn-sm"
                  style={{ fontSize: '11px', padding: '2px 8px' }}
                  onClick={() => handleLoadTemplate(tpl)}
                >
                  {tpl.name.split('.')[1]}
                </button>
              ))}
            </div>
          </div>

          {/* Active Editor Panel */}
          <div style={{ flex: 1, position: 'relative', display: 'flex' }}>
            <textarea
              style={{
                width: '100%',
                height: '100%',
                minHeight: '440px',
                background: '#0a0f1d',
                color: activeTab === 'html' ? '#f87171' : activeTab === 'css' ? '#60a5fa' : '#facc15',
                padding: 'var(--space-4)',
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                lineHeight: 1.6,
                resize: 'none',
                border: 'none',
                outline: 'none',
              }}
              value={activeTab === 'html' ? htmlCode : activeTab === 'css' ? cssCode : jsCode}
              onChange={(e) => {
                if (activeTab === 'html') setHtmlCode(e.target.value);
                else if (activeTab === 'css') setCssCode(e.target.value);
                else setJsCode(e.target.value);
              }}
              spellCheck={false}
            />
          </div>
        </div>

        {/* Right: Live Sandboxed Preview & Mini Console */}
        <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '8px 16px', background: 'rgba(10, 15, 29, 0.9)', borderBottom: '1px solid var(--color-border)', fontSize: '12px', color: 'var(--color-text-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>🖥️ Live Preview (Sandboxed iFrame)</span>
            <span style={{ fontSize: '11px', color: 'var(--color-success)' }}>● กำลังแสดงผลสด</span>
          </div>

          <iframe
            title="Web Lab Output Sandbox"
            srcDoc={compiledSrcDoc}
            style={{
              width: '100%',
              flex: 1,
              minHeight: '340px',
              border: 'none',
              background: '#090d16',
            }}
            sandbox="allow-scripts allow-modals"
          />

          {/* Console Inspector */}
          <div style={{ height: '120px', background: '#050811', borderTop: '1px solid var(--color-border)', padding: '8px 12px', overflowY: 'auto', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
            <div style={{ color: 'var(--color-accent-primary)', marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
              <span>Console Logs:</span>
              <button
                className="btn btn-ghost btn-sm"
                style={{ padding: 0, fontSize: '10px' }}
                onClick={() => setConsoleLogs([])}
              >
                ล้าง Log
              </button>
            </div>
            {consoleLogs.length === 0 ? (
              <span style={{ color: '#475569' }}>ยังไม่มีคำสั่ง console.log()</span>
            ) : (
              consoleLogs.map((log, idx) => (
                <div key={idx} style={{ color: log.startsWith('[ERR]') ? '#ef4444' : '#94a3b8' }}>
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Save Project Modal */}
      {showSaveModal && (
        <div className="modal-overlay" onClick={() => setShowSaveModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <div className="modal-header">
              <h3 className="modal-title">บันทึกโปรเจกต์ลงแฟ้มผลงาน</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowSaveModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSaveToPortfolio} className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label">ชื่อโปรเจกต์</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="เช่น เว็บประวัติส่วนตัว Glassmorphism"
                  value={saveTitle}
                  onChange={(e) => setSaveTitle(e.target.value)}
                  required
                />
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                ผลงานนี้จะถูกบันทึกลงในฐานข้อมูลระบบ และสามารถนำไปแสดงในหน้า "ผลงานของฉัน (Portfolio)" ได้ทันที
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowSaveModal(false)}>ยกเลิก</button>
                <button type="submit" className="btn btn-primary" disabled={!saveTitle.trim()}>บันทึกลงฐานข้อมูล</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebLab;
