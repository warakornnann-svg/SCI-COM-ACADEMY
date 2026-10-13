import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  FileText,
  Presentation,
  Keyboard,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Play,
  RotateCcw,
  Sparkles,
  BarChart3,
  Layers,
  ArrowRight,
  Save,
  Check,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface OfficeSkillsLabProps {
  onBack?: () => void;
}

type TabType = 'excel' | 'word' | 'ppt' | 'shortcuts';

export const OfficeSkillsLab: React.FC<OfficeSkillsLabProps> = ({ onBack }) => {
  const { state, dispatch, saveLabExercise, addNotification } = useApp();
  const [activeTab, setActiveTab] = useState<TabType>('excel');

  // Excel State
  const initialGrid = [
    ['ชื่อนักเรียน', 'วิชาคณิตศาสตร์', 'วิชาวิทยาศาสตร์', 'รวมคะแนน', 'ผลการประเมิน'],
    ['สมชาย ใจดี', '85', '92', '=SUM(B2:C2)', '=IF(D2>=160, "ผ่านดีเยี่ยม", "ผ่าน")'],
    ['สมหญิง รักเรียน', '78', '84', '=SUM(B3:C3)', '=IF(D3>=160, "ผ่านดีเยี่ยม", "ผ่าน")'],
    ['มานะ อดทน', '62', '65', '=SUM(B4:C4)', '=IF(D4>=160, "ผ่านดีเยี่ยม", "ผ่าน")'],
    ['ชูใจ ใฝ่รู้', '90', '95', '=SUM(B5:C5)', '=IF(D5>=160, "ผ่านดีเยี่ยม", "ผ่าน")'],
    ['คะแนนเฉลี่ย', '=AVERAGE(B2:B5)', '=AVERAGE(C2:C5)', '=AVERAGE(D2:D5)', '']
  ];

  const [grid, setGrid] = useState<string[][]>(initialGrid);
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number }>({ r: 1, c: 3 });
  const [formulaInput, setFormulaInput] = useState<string>(initialGrid[1][3]);
  const [excelCompleted, setExcelCompleted] = useState<boolean>(false);

  // Word State
  const [docMargin, setDocMargin] = useState<'standard' | 'formal' | 'narrow'>('formal');
  const [fontFamily, setFontFamily] = useState<'sarabun' | 'prompt' | 'sans'>('sarabun');
  const [fontSize, setFontSize] = useState<number>(16);
  const [lineSpacing, setLineSpacing] = useState<number>(1.15);
  const [docTitle, setDocTitle] = useState<string>('รายงานโครงงานวิทยาการคำนวณ: ระบบตรวจจับสภาพแวดล้อมด้วย IoT');
  const [docContent, setDocContent] = useState<string>(
    'บทคัดย่อ\nโครงงานนี้มีวัตถุประสงค์เพื่อพัฒนาระบบสมองกลฝังตัว ESP32 สำหรับตรวจวัดอุณหภูมิและความชื้นสัมพัทธ์ในห้องปฏิบัติการคอมพิวเตอร์ โดยส่งสัญญาณข้อมูลผ่านโพรโทคอล Wi-Fi ไปยังแดชบอร์ดแสดงผลแบบเรียลไทม์ ผลการทดสอบพบว่าระบบมีความแม่นยำสูงและตอบสนองได้รวดเร็ว เหมาะสำหรับการใช้งานจริงในโรงเรียน'
  );

  // PPT State
  const [slideTitle, setSlideTitle] = useState<string>('สถาปัตยกรรมระบบ IoT สำหรับโรงเรียน');
  const [slideBullets, setSlideBullets] = useState<string[]>([
    'เซนเซอร์ DHT22 ตรวจวัดอุณหภูมิและความชื้น',
    'ไมโครคอนโทรลเลอร์ ESP32 ประมวลผลสัญญาณ',
    'เชื่อมต่อ Wi-Fi ส่งข้อมูลผ่าน REST API',
    'เว็บแดชบอร์ดแสดงกราฟสถิติแบบเรียลไทม์'
  ]);
  const [bulletInput, setBulletInput] = useState<string>('');
  const [slideTheme, setSlideTheme] = useState<'dark' | 'glass' | 'corporate'>('glass');

  // Shortcuts Trainer State
  const shortcutsList = [
    { id: 1, key: 'ctrl+c', display: 'Ctrl + C', name: 'คัดลอก (Copy)', desc: 'คัดลอกข้อความหรือไฟล์ที่เลือกไว้' },
    { id: 2, key: 'ctrl+v', display: 'Ctrl + V', name: 'วาง (Paste)', desc: 'วางสิ่งที่คัดลอกไว้ลงตำแหน่งปัจจุบัน' },
    { id: 3, key: 'ctrl+z', display: 'Ctrl + Z', name: 'ยกเลิก (Undo)', desc: 'ย้อนกลับการกระทำล่าสุดที่ทำผิดพลาด' },
    { id: 4, key: 'ctrl+y', display: 'Ctrl + Y', name: 'ทำซ้ำ (Redo)', desc: 'ทำซ้ำการกระทำที่เพิ่งกดยกเลิกไป' },
    { id: 5, key: 'ctrl+shift+n', display: 'Ctrl + Shift + N', name: 'สร้างโฟลเดอร์ใหม่', desc: 'สร้าง New Folder ใน Windows File Explorer' },
    { id: 6, key: 'win+v', display: 'Windows + V', name: 'ประวัติคลิปบอร์ด (Clipboard History)', desc: 'ดูข้อความหรือภาพทั้งหมดที่เคยก็อปปี้ไว้' }
  ];
  const [activeShortcutIdx, setActiveShortcutIdx] = useState<number>(0);
  const [pressedKeyStatus, setPressedKeyStatus] = useState<string>('');
  const [shortcutScore, setShortcutScore] = useState<number>(0);

  // Sync formula bar when clicking a cell
  useEffect(() => {
    if (grid[selectedCell.r] && grid[selectedCell.r][selectedCell.c] !== undefined) {
      setFormulaInput(grid[selectedCell.r][selectedCell.c]);
    }
  }, [selectedCell, grid]);

  // Formula Evaluator Function
  const evaluateCell = (val: string, r: number, c: number): string => {
    if (!val || !val.startsWith('=')) return val;

    try {
      const expr = val.substring(1).trim().toUpperCase();

      // Handle =SUM(A1:B4) or =SUM(B2:B5)
      const sumMatch = expr.match(/^SUM\(([A-E])([1-6]):([A-E])([1-6])\)$/);
      if (sumMatch) {
        const startCol = sumMatch[1].charCodeAt(0) - 65;
        const startRow = parseInt(sumMatch[2], 10) - 1;
        const endCol = sumMatch[3].charCodeAt(0) - 65;
        const endRow = parseInt(sumMatch[4], 10) - 1;

        let sum = 0;
        for (let row = Math.min(startRow, endRow); row <= Math.max(startRow, endRow); row++) {
          for (let col = Math.min(startCol, endCol); col <= Math.max(startCol, endCol); col++) {
            const raw = grid[row]?.[col] || '0';
            const num = parseFloat(raw.startsWith('=') ? evaluateCell(raw, row, col) : raw);
            if (!isNaN(num)) sum += num;
          }
        }
        return sum.toFixed(0);
      }

      // Handle =AVERAGE(B2:B5)
      const avgMatch = expr.match(/^AVERAGE\(([A-E])([1-6]):([A-E])([1-6])\)$/);
      if (avgMatch) {
        const startCol = avgMatch[1].charCodeAt(0) - 65;
        const startRow = parseInt(avgMatch[2], 10) - 1;
        const endCol = avgMatch[3].charCodeAt(0) - 65;
        const endRow = parseInt(avgMatch[4], 10) - 1;

        let sum = 0;
        let count = 0;
        for (let row = Math.min(startRow, endRow); row <= Math.max(startRow, endRow); row++) {
          for (let col = Math.min(startCol, endCol); col <= Math.max(startCol, endCol); col++) {
            const raw = grid[row]?.[col] || '0';
            const num = parseFloat(raw.startsWith('=') ? evaluateCell(raw, row, col) : raw);
            if (!isNaN(num)) {
              sum += num;
              count++;
            }
          }
        }
        return count > 0 ? (sum / count).toFixed(1) : '0';
      }

      // Handle =MAX(range)
      const maxMatch = expr.match(/^MAX\(([A-E])([1-6]):([A-E])([1-6])\)$/);
      if (maxMatch) {
        const startCol = maxMatch[1].charCodeAt(0) - 65;
        const startRow = parseInt(maxMatch[2], 10) - 1;
        const endCol = maxMatch[3].charCodeAt(0) - 65;
        const endRow = parseInt(maxMatch[4], 10) - 1;

        let maxVal = -Infinity;
        for (let row = Math.min(startRow, endRow); row <= Math.max(startRow, endRow); row++) {
          for (let col = Math.min(startCol, endCol); col <= Math.max(startCol, endCol); col++) {
            const raw = grid[row]?.[col] || '0';
            const num = parseFloat(raw.startsWith('=') ? evaluateCell(raw, row, col) : raw);
            if (!isNaN(num) && num > maxVal) maxVal = num;
          }
        }
        return maxVal === -Infinity ? '0' : maxVal.toString();
      }

      // Handle =IF(D2>=160, "ผ่านดีเยี่ยม", "ผ่าน")
      const ifMatch = expr.match(/^IF\(([A-E])([1-6])(>=|>|<=|<|==|=)([0-9]+)\s*,\s*"([^"]+)"\s*,\s*"([^"]+)"\)$/);
      if (ifMatch) {
        const col = ifMatch[1].charCodeAt(0) - 65;
        const row = parseInt(ifMatch[2], 10) - 1;
        const op = ifMatch[3];
        const threshold = parseFloat(ifMatch[4]);
        const trueVal = ifMatch[5];
        const falseVal = ifMatch[6];

        const targetRaw = grid[row]?.[col] || '0';
        const num = parseFloat(targetRaw.startsWith('=') ? evaluateCell(targetRaw, row, col) : targetRaw);

        let condition = false;
        if (op === '>=' || op === '=>') condition = num >= threshold;
        else if (op === '>') condition = num > threshold;
        else if (op === '<=') condition = num <= threshold;
        else if (op === '<') condition = num < threshold;
        else condition = num === threshold;

        return condition ? trueVal : falseVal;
      }

      return '#VALUE!';
    } catch {
      return '#ERROR!';
    }
  };

  const handleApplyFormula = () => {
    const newGrid = [...grid.map((row) => [...row])];
    newGrid[selectedCell.r][selectedCell.c] = formulaInput;
    setGrid(newGrid);

    // Check completion criteria
    const avgScoreCell = newGrid[5][1];
    if (avgScoreCell.includes('AVERAGE')) {
      setExcelCompleted(true);
      if (state.user?.id) {
        saveLabExercise('office', 'excel-calc', true, 100);
      }
      addNotification('success', 'คำนวณสูตร Excel สำเร็จและบันทึกลงฐานข้อมูลแล้ว! (+30 XP)');
    }
  };

  // Listen for keyboard combinations in the shortcut trainer
  useEffect(() => {
    if (activeTab !== 'shortcuts') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const current = shortcutsList[activeShortcutIdx];
      if (!current) return;

      const ctrl = e.ctrlKey || e.metaKey;
      const shift = e.shiftKey;
      const key = e.key.toLowerCase();

      let detected = '';
      if (ctrl && shift && key === 'n') detected = 'ctrl+shift+n';
      else if (ctrl && key === 'c') detected = 'ctrl+c';
      else if (ctrl && key === 'v') detected = 'ctrl+v';
      else if (ctrl && key === 'z') detected = 'ctrl+z';
      else if (ctrl && key === 'y') detected = 'ctrl+y';

      if (detected) {
        if (detected === current.key) {
          setPressedKeyStatus(`ถูกต้อง! คุณกด ${current.display}`);
          setShortcutScore((prev) => prev + 10);
          addNotification('success', `ยอดเยี่ยม! ทักษะคีย์ลัด ${current.display} ผ่านแล้ว (+10 XP)`);
          setTimeout(() => {
            if (activeShortcutIdx < shortcutsList.length - 1) {
              setActiveShortcutIdx((prev) => prev + 1);
              setPressedKeyStatus('');
            }
          }, 800);
        } else {
          setPressedKeyStatus(`ยังไม่ตรง (คุณกด ${e.key.toUpperCase()}) ลองใหม่อีกครั้ง!`);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, activeShortcutIdx]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Top Banner with 3D glass effect */}
      <div className="card-3d glass-panel" style={{ padding: 'var(--space-5)', borderRadius: 'var(--radius-xl)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-primary">มัธยมศึกษาปีที่ 4–6</span>
              <span className="badge badge-success">Digital Productivity Skills</span>
            </div>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
              ห้องปฏิบัติการ Microsoft Office & ดิจิทัลเวิร์กสเปซ
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
              ฝึกฝนทักษะการคำนวณสเปรดชีต Excel ด้วยสูตรจริง, การจัดรูปแบบเอกสารราชการ Word และหลักการออกแบบสไลด์ PowerPoint ตามมาตรฐาน
            </p>
          </div>
          {onBack && (
            <button className="btn btn-outline btn-sm" onClick={onBack}>
              ← กลับสู่แดชบอร์ดแล็บ
            </button>
          )}
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-5)', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: 'var(--space-3)', flexWrap: 'wrap' }}>
          <button
            className={`btn btn-sm ${activeTab === 'excel' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('excel')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <FileSpreadsheet size={16} /> Excel สเปรดชีต & สูตรคำนวณ
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'word' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('word')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <FileText size={16} /> Word การจัดหน้าเอกสารทางการ
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'ppt' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('ppt')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Presentation size={16} /> PowerPoint การออกแบบสไลด์
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'shortcuts' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('shortcuts')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Keyboard size={16} /> คีย์ลัด & ทักษะคอมพิวเตอร์
          </button>
        </div>
      </div>

      {/* TAB 1: EXCEL SPREADSHEET LAB */}
      {activeTab === 'excel' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 'var(--space-6)' }}>
          {/* Main Grid Area */}
          <div className="card glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {/* Formula Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                background: 'rgba(0,0,0,0.3)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border-subtle)'
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  background: 'var(--color-accent-primary-muted)',
                  color: 'var(--color-accent-primary)',
                  padding: '4px 8px',
                  borderRadius: '4px'
                }}
              >
                {String.fromCharCode(65 + selectedCell.c)}
                {selectedCell.r + 1}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', fontWeight: 'bold' }}>fx</span>
              <input
                type="text"
                value={formulaInput}
                onChange={(e) => setFormulaInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyFormula()}
                placeholder="ป้อนค่าหรือสูตรคำนวณ เช่น =SUM(B2:C2), =AVERAGE(B2:B5), =IF(D2>=160, 'ผ่านดีเยี่ยม', 'ผ่าน')"
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--color-text-primary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '14px'
                }}
              />
              <button className="btn btn-sm btn-primary" onClick={handleApplyFormula}>
                คำนวณ (Enter)
              </button>
            </div>

            {/* Grid Table */}
            <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-subtle)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--color-text-secondary)' }}>
                    <th style={{ width: '40px', padding: '8px', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>#</th>
                    {['A', 'B', 'C', 'D', 'E'].map((col) => (
                      <th key={col} style={{ padding: '8px 12px', border: '1px solid rgba(255,255,255,0.08)', fontWeight: 'bold' }}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {grid.map((row, rIdx) => (
                    <tr key={rIdx}>
                      <td
                        style={{
                          background: 'rgba(255,255,255,0.03)',
                          padding: '8px',
                          border: '1px solid rgba(255,255,255,0.08)',
                          textAlign: 'center',
                          color: 'var(--color-text-muted)',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '11px'
                        }}
                      >
                        {rIdx + 1}
                      </td>
                      {row.map((cellVal, cIdx) => {
                        const isSelected = selectedCell.r === rIdx && selectedCell.c === cIdx;
                        const evaluated = evaluateCell(cellVal, rIdx, cIdx);
                        const isFormula = cellVal.startsWith('=');

                        return (
                          <td
                            key={cIdx}
                            onClick={() => setSelectedCell({ r: rIdx, c: cIdx })}
                            style={{
                              padding: '8px 12px',
                              border: isSelected ? '2px solid var(--color-accent-primary)' : '1px solid rgba(255,255,255,0.08)',
                              background: isSelected
                                ? 'rgba(56, 189, 248, 0.15)'
                                : rIdx === 0
                                ? 'rgba(255,255,255,0.04)'
                                : 'transparent',
                              fontWeight: rIdx === 0 ? '600' : 'normal',
                              color: isFormula ? 'var(--color-accent-secondary)' : 'var(--color-text-primary)',
                              cursor: 'pointer',
                              userSelect: 'none',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span>{evaluated}</span>
                              {isFormula && (
                                <span style={{ fontSize: '10px', opacity: 0.6, fontFamily: 'var(--font-mono)' }}>fx</span>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Quick Chart Visualization */}
            <div style={{ padding: 'var(--space-4)', background: 'rgba(0,0,0,0.25)', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-3)' }}>
                <BarChart3 size={18} color="var(--color-accent-primary)" />
                <span style={{ fontWeight: 'bold', fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>
                  การแสดงผลกราฟแท่งเปรียบเทียบคะแนนรวม (Live Data Preview)
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {grid.slice(1, 5).map((row, idx) => {
                  const studentName = row[0];
                  const total = parseFloat(evaluateCell(row[3], idx + 1, 3)) || 0;
                  const percentage = Math.min(100, Math.round((total / 200) * 100));

                  return (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ width: '100px', fontSize: '12px', color: 'var(--color-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {studentName}
                      </span>
                      <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', height: '18px', borderRadius: '4px', overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${percentage}%`,
                            height: '100%',
                            background: idx === 0 ? 'var(--gradient-ocean)' : idx === 3 ? 'var(--gradient-sunset)' : 'var(--gradient-cyber)',
                            borderRadius: '4px',
                            transition: 'width 0.4s ease'
                          }}
                        />
                      </div>
                      <span style={{ width: '60px', fontSize: '12px', fontFamily: 'var(--font-mono)', textAlign: 'right', color: 'var(--color-accent-primary)' }}>
                        {total} คะแนน
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Excel Reference & Exercises */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div className="card glass-panel">
              <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', marginBottom: 'var(--space-3)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Info size={16} color="var(--color-accent-primary)" /> คู่มือสูตร Excel ที่จำเป็น
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                <div style={{ padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px' }}>
                  <code style={{ color: 'var(--color-accent-primary)', fontWeight: 'bold' }}>=SUM(ช่วงข้อมูล)</code>
                  <div style={{ color: 'var(--color-text-secondary)', marginTop: '2px' }}>หาผลรวม เช่น <code>=SUM(B2:C2)</code></div>
                </div>
                <div style={{ padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px' }}>
                  <code style={{ color: 'var(--color-accent-primary)', fontWeight: 'bold' }}>=AVERAGE(ช่วงข้อมูล)</code>
                  <div style={{ color: 'var(--color-text-secondary)', marginTop: '2px' }}>หาค่าเฉลี่ยเลขคณิต เช่น <code>=AVERAGE(B2:B5)</code></div>
                </div>
                <div style={{ padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px' }}>
                  <code style={{ color: 'var(--color-accent-primary)', fontWeight: 'bold' }}>=MAX(ช่วงข้อมูล)</code>
                  <div style={{ color: 'var(--color-text-secondary)', marginTop: '2px' }}>หาค่าสูงสุดของชุดข้อมูล</div>
                </div>
                <div style={{ padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px' }}>
                  <code style={{ color: 'var(--color-accent-primary)', fontWeight: 'bold' }}>=IF(เงื่อนไข, จริง, เท็จ)</code>
                  <div style={{ color: 'var(--color-text-secondary)', marginTop: '2px' }}>ตรวจสอบเงื่อนไขทางตรรกะ</div>
                </div>
              </div>
            </div>

            <div className="card glass-panel" style={{ border: '1px solid var(--color-accent-primary)' }}>
              <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', color: 'var(--color-accent-primary)', marginBottom: '8px' }}>
                ภารกิจการฝึก: คำนวณคะแนนเฉลี่ย
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
                คลิกที่เซลล์ <strong>B6</strong> แล้วพิมพ์ <code>=AVERAGE(B2:B5)</code> จากนั้นกดคำนวณเพื่อหาคะแนนเฉลี่ยวิชาคณิตศาสตร์
              </p>
              <button
                className="btn btn-sm btn-outline"
                style={{ width: '100%' }}
                onClick={() => {
                  setSelectedCell({ r: 5, c: 1 });
                  setFormulaInput('=AVERAGE(B2:B5)');
                }}
              >
                ใส่สูตรตัวอย่างลงในเซลล์ B6
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: WORD DOCUMENT FORMATTING LAB */}
      {activeTab === 'word' && (
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 'var(--space-6)' }}>
          {/* Formatting Controls */}
          <div className="card glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
              แถบเครื่องมือจัดหน้าเอกสาร
            </h3>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>
                ระยะขอบกระดาษ (Margins)
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <button
                  className={`btn btn-sm ${docMargin === 'formal' ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ justifyContent: 'flex-start' }}
                  onClick={() => setDocMargin('formal')}
                >
                  มาตรฐานราชการ (บน 1.5", ซ้าย 1.5", ล่าง 1", ขวา 1")
                </button>
                <button
                  className={`btn btn-sm ${docMargin === 'standard' ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ justifyContent: 'flex-start' }}
                  onClick={() => setDocMargin('standard')}
                >
                  มาตรฐานทั่วไป (1 นิ้วทุกด้าน)
                </button>
                <button
                  className={`btn btn-sm ${docMargin === 'narrow' ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ justifyContent: 'flex-start' }}
                  onClick={() => setDocMargin('narrow')}
                >
                  ขอบแคบ (0.5 นิ้วทุกด้าน)
                </button>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>
                ฟอนต์ & ขนาดตัวอักษร
              </label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value as any)}
                  className="input"
                  style={{ flex: 1, padding: '6px', fontSize: '12px' }}
                >
                  <option value="sarabun">TH Sarabun PSK / Sarabun</option>
                  <option value="prompt">Prompt (สมัยใหม่)</option>
                  <option value="sans">IBM Plex Sans Thai</option>
                </select>
                <input
                  type="number"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value, 10) || 16)}
                  min={12}
                  max={24}
                  className="input"
                  style={{ width: '60px', padding: '6px', fontSize: '12px', textAlign: 'center' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>
                ระยะห่างบรรทัด (Line Spacing)
              </label>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[1.0, 1.15, 1.5].map((spacing) => (
                  <button
                    key={spacing}
                    className={`btn btn-sm ${lineSpacing === spacing ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ flex: 1 }}
                    onClick={() => setLineSpacing(spacing)}
                  >
                    {spacing} เท่า
                  </button>
                ))}
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: 'var(--space-3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-success)', fontSize: '12px', fontWeight: 'bold' }}>
                <CheckCircle2 size={16} /> ตรวจสอบมาตรฐานรายงาน ม.ปลาย
              </div>
              <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                ฟอนต์ TH Sarabun ขนาด 16pt และระยะขอบ 1.5" คือมาตรฐานของ สพฐ. และงานวิจัย
              </p>
            </div>
          </div>

          {/* Document Preview Canvas */}
          <div
            className="card"
            style={{
              background: '#f8fafc',
              color: '#0f172a',
              borderRadius: 'var(--radius-lg)',
              padding: docMargin === 'formal' ? '48px 40px 32px 48px' : docMargin === 'narrow' ? '24px' : '36px',
              minHeight: '480px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              fontFamily: fontFamily === 'sarabun' ? 'Sarabun, sans-serif' : fontFamily === 'prompt' ? 'Prompt, sans-serif' : 'inherit',
              lineHeight: lineSpacing
            }}
          >
            {/* Header info */}
            <div style={{ textAlign: 'right', fontSize: '12px', color: '#64748b', marginBottom: '24px' }}>
              หน้า 1 จาก 1
            </div>

            {/* Document Title (Heading 1) */}
            <h1
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => setDocTitle(e.currentTarget.textContent || '')}
              style={{
                fontSize: `${fontSize + 4}px`,
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: '20px',
                color: '#0f172a',
                outline: 'none'
              }}
            >
              {docTitle}
            </h1>

            {/* Document Paragraphs */}
            <div
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => setDocContent(e.currentTarget.textContent || '')}
              style={{
                fontSize: `${fontSize}px`,
                textIndent: '32px',
                textAlign: 'justify',
                color: '#334155',
                whiteSpace: 'pre-line',
                outline: 'none'
              }}
            >
              {docContent}
            </div>

            {/* Footer */}
            <div style={{ marginTop: 'auto', paddingTop: '32px', borderTop: '1px solid #e2e8f0', fontSize: '11px', color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}>
              <span>กลุ่มสาระการเรียนรู้วิทยาศาสตร์และเทคโนโลยี</span>
              <span>โรงเรียน Sci-Com Academy</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: POWERPOINT SLIDE DESIGN */}
      {activeTab === 'ppt' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 'var(--space-6)' }}>
          {/* Slide 16:9 Canvas */}
          <div
            className="card"
            style={{
              aspectRatio: '16/9',
              background:
                slideTheme === 'glass'
                  ? 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0369a1 100%)'
                  : slideTheme === 'dark'
                  ? '#090d16'
                  : 'linear-gradient(135deg, #1e293b, #0f172a)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-8)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.1)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Ambient visual sphere */}
            <div
              style={{
                position: 'absolute',
                top: '-40px',
                right: '-40px',
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                background: 'rgba(56, 189, 248, 0.2)',
                filter: 'blur(40px)',
                pointerEvents: 'none'
              }}
            />

            <div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 'bold',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  color: 'var(--color-accent-primary)'
                }}
              >
                Project Presentation Slide
              </span>
              <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'bold', color: '#ffffff', marginTop: '6px' }}>
                {slideTitle}
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', margin: 'auto 0' }}>
              {slideBullets.map((bullet, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-accent-primary)' }} />
                  <span style={{ fontSize: '18px', color: '#e2e8f0', fontWeight: '500' }}>{bullet}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px' }}>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Sci-Com Computer Project Presentation</span>
              <span style={{ fontSize: '12px', color: 'var(--color-accent-primary)', fontWeight: 'bold' }}>Slide 01</span>
            </div>
          </div>

          {/* Slide Design Analyzer */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div className="card glass-panel">
              <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', marginBottom: 'var(--space-3)' }}>
                กฎการออกแบบสไลด์ (6x6 Rule Checker)
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>จำนวนหัวข้อย่อย (Bullets):</span>
                  <span className={`badge ${slideBullets.length <= 6 ? 'badge-success' : 'badge-danger'}`}>
                    {slideBullets.length} / 6 บรรทัด
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>อัตราส่วนคอนทราสต์:</span>
                  <span className="badge badge-success">ผ่านเกณฑ์ AAA</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>ธีมภาพรวม:</span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      className={`btn btn-xs ${slideTheme === 'glass' ? 'btn-primary' : 'btn-ghost'}`}
                      onClick={() => setSlideTheme('glass')}
                    >
                      Glass
                    </button>
                    <button
                      className={`btn btn-xs ${slideTheme === 'dark' ? 'btn-primary' : 'btn-ghost'}`}
                      onClick={() => setSlideTheme('dark')}
                    >
                      Dark
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="card glass-panel">
              <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', marginBottom: '8px' }}>
                เพิ่มหัวข้อใหม่
              </h4>
              <div style={{ display: 'flex', gap: '6px' }}>
                <input
                  type="text"
                  value={bulletInput}
                  onChange={(e) => setBulletInput(e.target.value)}
                  placeholder="พิมพ์ข้อความสไลด์..."
                  className="input"
                  style={{ flex: 1, padding: '6px 10px', fontSize: '13px' }}
                />
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => {
                    if (bulletInput.trim()) {
                      setSlideBullets([...slideBullets, bulletInput.trim()]);
                      setBulletInput('');
                    }
                  }}
                >
                  เพิ่ม
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: KEYBOARD SHORTCUTS & FILE MANAGEMENT */}
      {activeTab === 'shortcuts' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 'var(--space-6)' }}>
          {/* Interactive Keyboard Stage */}
          <div className="card glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-8)', minHeight: '380px' }}>
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
              <span className="badge badge-primary" style={{ marginBottom: '8px' }}>
                แบบฝึกหัดที่ {activeShortcutIdx + 1} จาก {shortcutsList.length}
              </span>
              <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
                {shortcutsList[activeShortcutIdx]?.name}
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginTop: '4px' }}>
                {shortcutsList[activeShortcutIdx]?.desc}
              </p>
            </div>

            {/* Huge Interactive Key Badge */}
            <div
              className="card-3d"
              style={{
                padding: '24px 48px',
                borderRadius: 'var(--radius-xl)',
                background: 'rgba(56, 189, 248, 0.1)',
                border: '2px solid var(--color-accent-primary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '32px',
                fontWeight: 'bold',
                color: 'var(--color-accent-primary)',
                letterSpacing: '2px',
                boxShadow: 'var(--shadow-glow)'
              }}
            >
              {shortcutsList[activeShortcutIdx]?.display}
            </div>

            {/* Instruction prompt */}
            <p style={{ marginTop: 'var(--space-6)', color: 'var(--color-text-muted)', fontSize: '14px' }}>
              👉 กดคีย์ลัดบนคีย์บอร์ดจริงของคุณ เพื่อทดสอบความจำและความคล่องแคล่ว
            </p>

            {pressedKeyStatus && (
              <div
                style={{
                  marginTop: 'var(--space-3)',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: pressedKeyStatus.includes('ถูกต้อง') ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  color: pressedKeyStatus.includes('ถูกต้อง') ? 'var(--color-success)' : 'var(--color-danger)',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}
              >
                {pressedKeyStatus}
              </div>
            )}
          </div>

          {/* Shortcuts Score & Quick Jump */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div className="card glass-panel">
              <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', marginBottom: 'var(--space-3)' }}>
                คะแนนทักษะคีย์ลัด
              </h4>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--color-accent-primary)', fontFamily: 'var(--font-mono)' }}>
                {shortcutScore} <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>XP</span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                การใช้คีย์ลัดช่วยเพิ่มความเร็วในการทำงานคอมพิวเตอร์ได้มากกว่า 3 เท่า
              </p>
            </div>

            <div className="card glass-panel">
              <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', marginBottom: '8px' }}>
                รายการคีย์ลัดทั้งหมด
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {shortcutsList.map((item, idx) => (
                  <button
                    key={item.id}
                    className={`btn btn-xs ${activeShortcutIdx === idx ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ justifyContent: 'space-between', padding: '6px 10px' }}
                    onClick={() => {
                      setActiveShortcutIdx(idx);
                      setPressedKeyStatus('');
                    }}
                  >
                    <span>{item.name}</span>
                    <code style={{ fontSize: '10px' }}>{item.display}</code>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
