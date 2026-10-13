import React, { useState, useEffect, useRef } from 'react';
import {
  Code2,
  Play,
  RotateCcw,
  Download,
  Award,
  Layers,
  Sparkles,
  CheckCircle2,
  Maximize2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface Template {
  id: string;
  name: string;
  html: string;
  css: string;
  js: string;
}

const templates: Template[] = [
  {
    id: 'profile-card',
    name: 'นามบัตรดิจิทัล (Profile Card)',
    html: `<div class="card">
  <div class="avatar">👨‍💻</div>
  <h2>สมชาย สายวิทย์-คอม</h2>
  <p class="role">นักเรียนชั้น ม.4/1 · Sci-Com</p>
  <div class="tags">
    <span>HTML</span>
    <span>CSS</span>
    <span>Python</span>
  </div>
  <button onclick="alert('สวัสดีครับ!')">ทักทายฉัน</button>
</div>`,
    css: `body {
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #0f172a;
  font-family: system-ui, sans-serif;
  color: #fff;
}

.card {
  background: #1e293b;
  padding: 30px;
  border-radius: 16px;
  text-align: center;
  width: 280px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.5);
  border: 1px solid rgba(255,255,255,0.1);
}

.avatar {
  font-size: 50px;
  margin-bottom: 12px;
}

h2 {
  margin: 0 0 6px 0;
  font-size: 20px;
}

.role {
  color: #94a3b8;
  font-size: 13px;
  margin: 0 0 18px 0;
}

.tags {
  display: flex;
  gap: 6px;
  justify-content: center;
  margin-bottom: 20px;
}

.tags span {
  background: #334155;
  color: #38bdf8;
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 6px;
}

button {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: 0.2s;
}

button:hover {
  background: #2563eb;
  transform: translateY(-2px);
}`,
    js: `// ลองเขียน JavaScript เพิ่มเติมที่นี่
console.log("Profile Card พร้อมทำงาน!");`,
  },
  {
    id: 'counter-app',
    name: 'ตัวนับจำนวน (Counter Interactive)',
    html: `<div class="container">
  <h1>ตัวนับจำนวน (Counter)</h1>
  <div class="display" id="count">0</div>
  <div class="buttons">
    <button id="dec">- ลด</button>
    <button id="reset">รีเซ็ต</button>
    <button id="inc">+ เพิ่ม</button>
  </div>
</div>`,
    css: `body {
  margin: 0;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #111827;
  font-family: system-ui, sans-serif;
  color: #fff;
}

.container {
  text-align: center;
  background: #1f2937;
  padding: 36px;
  border-radius: 20px;
  border: 1px solid #374151;
}

.display {
  font-size: 72px;
  font-weight: bold;
  color: #10b981;
  margin: 20px 0;
  font-family: monospace;
}

.buttons {
  display: flex;
  gap: 12px;
}

button {
  padding: 10px 18px;
  border-radius: 8px;
  font-size: 16px;
  border: none;
  cursor: pointer;
  background: #374151;
  color: white;
  transition: 0.2s;
}

button:hover {
  background: #4b5563;
}

#inc { background: #10b981; }
#inc:hover { background: #059669; }
#dec { background: #ef4444; }
#dec:hover { background: #dc2626; }`,
    js: `let count = 0;
const countEl = document.getElementById('count');

document.getElementById('inc').addEventListener('click', () => {
  count++;
  countEl.innerText = count;
});

document.getElementById('dec').addEventListener('click', () => {
  count--;
  countEl.innerText = count;
});

document.getElementById('reset').addEventListener('click', () => {
  count = 0;
  countEl.innerText = count;
});`,
  },
];

export const HTMLCSSLab: React.FC = () => {
  const { state, dispatch, addNotification } = useApp();

  const [selectedTemplate, setSelectedTemplate] = useState<string>(templates[0].id);
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');
  const [htmlCode, setHtmlCode] = useState(templates[0].html);
  const [cssCode, setCssCode] = useState(templates[0].css);
  const [jsCode, setJsCode] = useState(templates[0].js);
  const [srcDoc, setSrcDoc] = useState('');

  // Update srcDoc to trigger iframe update
  const runCode = () => {
    const combined = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>${cssCode}</style>
        </head>
        <body>
          ${htmlCode}
          <script>
            try {
              ${jsCode}
            } catch (err) {
              console.error(err);
            }
          </script>
        </body>
      </html>
    `;
    setSrcDoc(combined);

    // Award first code achievement
    dispatch({
      type: 'ADD_ACHIEVEMENT',
      payload: {
        userId: state.user?.id || 'guest',
        achievementId: 'ach-first-code',
        unlockedAt: new Date().toISOString(),
      },
    });
  };

  useEffect(() => {
    runCode();
  }, []);

  const handleTemplateChange = (tplId: string) => {
    const tpl = templates.find((t) => t.id === tplId);
    if (tpl) {
      setSelectedTemplate(tplId);
      setHtmlCode(tpl.html);
      setCssCode(tpl.css);
      setJsCode(tpl.js);

      const combined = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <style>${tpl.css}</style>
          </head>
          <body>
            ${tpl.html}
            <script>${tpl.js}</script>
          </body>
        </html>
      `;
      setSrcDoc(combined);
      addNotification('info', `โหลดเทมเพลต "${tpl.name}" เรียบร้อย`);
    }
  };

  const handleDownload = () => {
    const fullHtml = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <title>Sci-Com Project</title>
  <style>
${cssCode}
  </style>
</head>
<body>
${htmlCode}
<script>
${jsCode}
</script>
</body>
</html>`;
    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'scicom-web-project.html';
    a.click();
    URL.revokeObjectURL(url);
    addNotification('success', 'ดาวน์โหลดไฟล์ HTML สำเร็จแล้ว!');
  };

  return (
    <div className="main-content">
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 'var(--space-5)' }}>
        <div className="badge badge-blue" style={{ marginBottom: 'var(--space-2)' }}>
          <Code2 size={14} /> เว็บสตูดิโอแบบโต้ตอบ (Interactive Web Studio)
        </div>
        <h1 className="page-header-title">Web Studio: สร้างหน้าเว็บ HTML / CSS / JS</h1>
        <p className="page-header-desc">
          เขียนโค้ดและดูผลลัพธ์แบบสดทันที (Live Preview) เพื่อฝึกสร้างเว็บไซต์ตามโครงงานจริง
        </p>
      </div>

      {/* Control Bar */}
      <div
        className="card"
        style={{
          padding: 'var(--space-3) var(--space-4)',
          marginBottom: 'var(--space-4)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-3)',
          background: 'var(--color-bg-secondary)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>เทมเพลตเริ่มต้น:</span>
          <select
            className="form-input form-select"
            style={{ width: 'auto', fontSize: 'var(--text-xs)', padding: '6px 28px 6px 10px' }}
            value={selectedTemplate}
            onChange={(e) => handleTemplateChange(e.target.value)}
          >
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button className="btn btn-outline btn-sm" onClick={handleDownload} title="ดาวน์โหลดโค้ดเป็นไฟล์เดี่ยว">
            <Download size={14} /> ดาวน์โหลด HTML
          </button>
          <button className="btn btn-primary btn-sm" onClick={runCode}>
            <Play size={14} /> ประมวลผลโค้ด (Run)
          </button>
        </div>
      </div>

      {/* 2-Column Studio: Left Editor, Right Live Preview */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', minHeight: '560px' }}>
        {/* Left: Code Editor */}
        <div className="code-editor" style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Editor Header with File Tabs */}
          <div className="code-editor-header">
            <div className="code-editor-tabs">
              <button
                className={`code-editor-tab ${activeTab === 'html' ? 'active' : ''}`}
                onClick={() => setActiveTab('html')}
              >
                index.html
              </button>
              <button
                className={`code-editor-tab ${activeTab === 'css' ? 'active' : ''}`}
                onClick={() => setActiveTab('css')}
              >
                style.css
              </button>
              <button
                className={`code-editor-tab ${activeTab === 'js' ? 'active' : ''}`}
                onClick={() => setActiveTab('js')}
              >
                script.js
              </button>
            </div>

            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
              {activeTab.toUpperCase()}
            </span>
          </div>

          {/* Textarea for each tab */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {activeTab === 'html' && (
              <textarea
                className="code-editor-textarea"
                style={{ flex: 1 }}
                value={htmlCode}
                onChange={(e) => setHtmlCode(e.target.value)}
                placeholder="<!-- เขียนโค้ด HTML ที่นี่ -->"
                spellCheck={false}
              />
            )}
            {activeTab === 'css' && (
              <textarea
                className="code-editor-textarea"
                style={{ flex: 1 }}
                value={cssCode}
                onChange={(e) => setCssCode(e.target.value)}
                placeholder="/* เขียนโค้ด CSS ที่นี่ */"
                spellCheck={false}
              />
            )}
            {activeTab === 'js' && (
              <textarea
                className="code-editor-textarea"
                style={{ flex: 1 }}
                value={jsCode}
                onChange={(e) => setJsCode(e.target.value)}
                placeholder="// เขียนโค้ด JavaScript ที่นี่"
                spellCheck={false}
              />
            )}
          </div>
        </div>

        {/* Right: Live Preview Iframe */}
        <div
          className="card"
          style={{
            padding: 0,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid var(--color-border)',
            background: '#ffffff',
          }}
        >
          <div
            style={{
              padding: 'var(--space-2) var(--space-4)',
              background: 'var(--color-bg-secondary)',
              borderBottom: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginLeft: '8px' }}>
                พรีวิวผลลัพธ์ (Live Browser Preview)
              </span>
            </div>
            <button className="btn btn-ghost btn-icon sm" onClick={runCode} title="รีเฟรชการแสดงผล">
              <RotateCcw size={14} />
            </button>
          </div>

          <iframe
            srcDoc={srcDoc}
            title="live-preview"
            sandbox="allow-scripts allow-modals"
            style={{ width: '100%', flex: 1, border: 'none', background: '#fff' }}
          />
        </div>
      </div>
    </div>
  );
};

export default HTMLCSSLab;
