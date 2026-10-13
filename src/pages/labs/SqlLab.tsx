import React, { useState, useEffect } from 'react';
import {
  Database,
  Play,
  RotateCcw,
  CheckCircle2,
  Table as TableIcon,
  HelpCircle,
  Zap,
  Sparkles,
  Layers,
  Clock,
  Check,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { executeRawQuery } from '../../lib/database';

interface SqlChallenge {
  id: string;
  title: string;
  difficulty: 'เริ่มต้น' | 'ปานกลาง' | 'ขั้นสูง';
  concept: string;
  description: string;
  starterSql: string;
  expectedQuery: string;
  hint: string;
  checkResult: (rows: any[]) => boolean;
}

const sqlChallenges: SqlChallenge[] = [
  {
    id: 'sql-1',
    title: 'ภารกิจที่ 1: ค้นหารายวิชาระดับ "เริ่มต้น" (SELECT & WHERE)',
    difficulty: 'เริ่มต้น',
    concept: 'SELECT, WHERE, ORDER BY',
    description: 'ดึงข้อมูล id, title, level, estimated_hours จากตาราง public.courses โดยเลือกเฉพาะคอร์สที่มี difficulty = \'เริ่มต้น\' และเรียงตาม estimated_hours จากน้อยไปมาก',
    starterSql: `SELECT id, title, level, estimated_hours 
FROM public.courses 
WHERE difficulty = 'เริ่มต้น' 
ORDER BY estimated_hours ASC;`,
    expectedQuery: `SELECT id, title, level, estimated_hours FROM public.courses WHERE difficulty = 'เริ่มต้น' ORDER BY estimated_hours ASC;`,
    hint: 'ใช้คำสั่ง SELECT ... FROM public.courses WHERE difficulty = \'เริ่มต้น\' ORDER BY estimated_hours ASC;',
    checkResult: (rows) => rows.length > 0 && rows.every((r) => r.estimated_hours !== undefined && r.title !== undefined),
  },
  {
    id: 'sql-2',
    title: 'ภารกิจที่ 2: ค้นหาผู้ใช้ที่มี XP สูงสุด 5 อันดับแรก (LIMIT)',
    difficulty: 'เริ่มต้น',
    concept: 'ORDER BY, LIMIT',
    description: 'ดึง display_name, role, level, xp จากตาราง public.profiles เรียงตามค่า xp จากมากไปหาน้อย และจำกัดเฉพาะ 5 แถวแรก (LIMIT 5)',
    starterSql: `SELECT display_name, role, level, xp 
FROM public.profiles 
ORDER BY xp DESC 
LIMIT 5;`,
    expectedQuery: `SELECT display_name, role, level, xp FROM public.profiles ORDER BY xp DESC LIMIT 5;`,
    hint: 'ใช้ ORDER BY xp DESC LIMIT 5;',
    checkResult: (rows) => rows.length <= 5 && rows.length > 0 && rows.every((r) => r.xp !== undefined),
  },
  {
    id: 'sql-3',
    title: 'ภารกิจที่ 3: สรุปจำนวนคอร์สในแต่ละระดับชั้น (GROUP BY & COUNT)',
    difficulty: 'ปานกลาง',
    concept: 'GROUP BY, COUNT(*)',
    description: 'นับจำนวนคอร์สเรียนทั้งหมดในแต่ละระดับชั้น (level) โดยแสดงคอลัมน์ level และ total_courses เรียงลำดับตาม level',
    starterSql: `SELECT level, count(*) as total_courses 
FROM public.courses 
GROUP BY level 
ORDER BY level;`,
    expectedQuery: `SELECT level, count(*) as total_courses FROM public.courses GROUP BY level ORDER BY level;`,
    hint: 'ใช้ SELECT level, count(*) as total_courses FROM public.courses GROUP BY level;',
    checkResult: (rows) => rows.length > 0 && rows.some((r) => r.total_courses !== undefined || r.count !== undefined),
  },
  {
    id: 'sql-4',
    title: 'ภารกิจที่ 4: เชื่อมโยงคอร์สกับชื่อหมวดหมู่วิชา (INNER JOIN)',
    difficulty: 'ปานกลาง',
    concept: 'INNER JOIN, Foreign Keys',
    description: 'เชื่อมโยงตาราง courses (c) กับ course_categories (cat) เพื่อแสดงชื่อคอร์ส (c.title) และชื่อหมวดหมู่ภาษาไทย (cat.name)',
    starterSql: `SELECT c.title, cat.name as category_name, c.difficulty 
FROM public.courses c 
INNER JOIN public.course_categories cat ON c.category_id = cat.id 
LIMIT 10;`,
    expectedQuery: `SELECT c.title, cat.name as category_name, c.difficulty FROM public.courses c INNER JOIN public.course_categories cat ON c.category_id = cat.id LIMIT 10;`,
    hint: 'ใช้ INNER JOIN public.course_categories cat ON c.category_id = cat.id',
    checkResult: (rows) => rows.length > 0 && rows.some((r) => r.category_name !== undefined),
  },
  {
    id: 'sql-5',
    title: 'ภารกิจที่ 5: ค่าเฉลี่ยเวลาเรียนของคอร์ส (AVG & MAX & MIN)',
    difficulty: 'ขั้นสูง',
    concept: 'Aggregate Functions',
    description: 'คำนวณหาค่าเฉลี่ยชั่วโมงเรียน (AVG), ค่าสูงสุด (MAX), และค่าต่ำสุด (MIN) ของคอร์สทั้งหมดในระบบ',
    starterSql: `SELECT 
  round(avg(estimated_hours), 1) as avg_hours, 
  max(estimated_hours) as max_hours, 
  min(estimated_hours) as min_hours 
FROM public.courses;`,
    expectedQuery: `SELECT round(avg(estimated_hours), 1) as avg_hours, max(estimated_hours) as max_hours, min(estimated_hours) as min_hours FROM public.courses;`,
    hint: 'ใช้ฟังก์ชัน avg(estimated_hours), max(estimated_hours), min(estimated_hours)',
    checkResult: (rows) => rows.length === 1 && (rows[0].avg_hours !== undefined || rows[0].avg !== undefined),
  },
];

interface SqlLabProps {
  onBack?: () => void;
}

export const SqlLab: React.FC<SqlLabProps> = ({ onBack }) => {
  const { saveLabExercise, isLabExerciseCompleted, addNotification } = useApp();

  const [activeTab, setActiveTab] = useState<'editor' | 'schema'>('editor');
  const [activeChallengeIdx, setActiveChallengeIdx] = useState<number | null>(0);

  const [sqlQuery, setSqlQuery] = useState(sqlChallenges[0].starterSql);
  const [queryResult, setQueryResult] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [executionTime, setExecutionTime] = useState<number>(0);
  const [isExecuting, setIsExecuting] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [challengePassed, setChallengePassed] = useState<boolean | null>(null);

  // Table presets for schema explorer
  const [selectedTable, setSelectedTable] = useState<'courses' | 'profiles' | 'course_categories' | 'lessons' | 'quizzes' | 'achievements'>('courses');

  const executeCurrentSql = async () => {
    setIsExecuting(true);
    setQueryError(null);
    try {
      const res = await executeRawQuery(sqlQuery.trim());
      if (res.error) {
        setQueryError(res.error);
        setQueryResult([]);
        setColumns([]);
        setChallengePassed(false);
      } else {
        setQueryResult(res.rows);
        setColumns(res.columns);
        setExecutionTime(res.executionTimeMs);

        // If challenge active, validate
        if (activeChallengeIdx !== null) {
          const c = sqlChallenges[activeChallengeIdx];
          const passed = c.checkResult(res.rows);
          setChallengePassed(passed);
          if (passed) {
            saveLabExercise('sql', c.id, true, 40, sqlQuery);
            addNotification('success', `ยินดีด้วย! ผ่าน "${c.title}" เรียบร้อย (+40 XP บน PostgreSQL)`);
          }
        }
      }
    } catch (err: any) {
      setQueryError(err.message || 'เกิดข้อผิดพลาดในการประมวลผล');
      setQueryResult([]);
      setColumns([]);
      setChallengePassed(false);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSelectChallenge = (idx: number) => {
    setActiveChallengeIdx(idx);
    const c = sqlChallenges[idx];
    setSqlQuery(c.starterSql);
    setChallengePassed(null);
    setShowHint(false);
  };

  const handleTablePresetSelect = (tbl: 'courses' | 'profiles' | 'course_categories' | 'lessons' | 'quizzes' | 'achievements') => {
    setSelectedTable(tbl);
    setActiveChallengeIdx(null);
    const queryMap: Record<string, string> = {
      courses: 'SELECT id, title, level, difficulty, estimated_hours FROM public.courses LIMIT 10;',
      profiles: 'SELECT id, display_name, role, level, xp, streak FROM public.profiles LIMIT 10;',
      course_categories: 'SELECT id, name, name_en, color, course_count FROM public.course_categories;',
      lessons: 'SELECT id, course_id, title, type, estimated_minutes FROM public.lessons LIMIT 10;',
      quizzes: 'SELECT id, course_id, title, passing_score FROM public.quizzes LIMIT 10;',
      achievements: 'SELECT id, title, rarity, xp_reward FROM public.achievements LIMIT 10;',
    };
    setSqlQuery(queryMap[tbl]);
  };

  useEffect(() => {
    executeCurrentSql();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Top Banner Card */}
      <div className="card" style={{ padding: 'var(--space-4) var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
          <div>
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Database color="#06b6d4" /> ห้องปฏิบัติการฐานข้อมูล PostgreSQL (Interactive SQL Lab)
            </h2>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
              ประมวลผลคำสั่ง SQL จริงบนฐานข้อมูล PostgreSQL พร้อมระบบตรวจสอบความถูกต้องและสำรวจตาราง
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span className="badge badge-cyan" style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Zap size={12} /> In-Browser PostgreSQL Engine
            </span>
            <button
              className="btn btn-primary btn-sm"
              onClick={executeCurrentSql}
              disabled={isExecuting}
              style={{ gap: '6px' }}
            >
              <Play size={14} fill="currentColor" /> {isExecuting ? 'กำลังประมวลผล...' : 'รันคำสั่ง (Execute SQL)'}
            </button>
            {onBack && (
              <button
                className="btn btn-outline btn-sm"
                onClick={onBack}
              >
                ← แดชบอร์ด
              </button>
            )}
          </div>
        </div>

        {/* Challenge Badges */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--color-text-tertiary)' }}>
            🎯 ภารกิจ SQL:
          </span>
          {sqlChallenges.map((c, idx) => {
            const isCompleted = isLabExerciseCompleted('sql', c.id);
            const isSelected = activeChallengeIdx === idx;
            return (
              <button
                key={c.id}
                className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-outline'}`}
                style={{ fontSize: '12px', padding: '4px 10px', gap: '6px' }}
                onClick={() => handleSelectChallenge(idx)}
              >
                {isCompleted && <CheckCircle2 size={13} color="var(--color-success)" />}
                <span>ข้อ {idx + 1}: {c.concept}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Challenge Instructions */}
      {activeChallengeIdx !== null && (
        <div
          className="card"
          style={{
            background: 'rgba(6, 182, 212, 0.08)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            padding: 'var(--space-5)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span className="badge badge-cyan">{sqlChallenges[activeChallengeIdx].concept}</span>
                <span className="badge badge-blue">ระดับ: {sqlChallenges[activeChallengeIdx].difficulty}</span>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold' }}>
                  {sqlChallenges[activeChallengeIdx].title}
                </h3>
              </div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}>
                {sqlChallenges[activeChallengeIdx].description}
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

          {showHint && (
            <div style={{ marginTop: 'var(--space-2)', padding: 'var(--space-3)', background: 'rgba(0, 0, 0, 0.3)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)', color: '#38bdf8' }}>
              💡 <strong>คำใบ้:</strong> {sqlChallenges[activeChallengeIdx].hint}
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
              {challengePassed ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <span>{challengePassed ? 'ยินดีด้วย! คำสั่ง SQL ถูกต้องตามเงื่อนไข (+40 XP)' : 'ผลลัพธ์ยังไม่ตรงกับเงื่อนไขที่กำหนด ลองตรวจสอบคำสั่งอีกครั้ง'}</span>
            </div>
          )}
        </div>
      )}

      {/* SQL Editor Card */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <label className="form-label" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Database size={16} color="var(--color-accent-primary)" /> ตัวเขียนคำสั่ง PostgreSQL (Query Editor)
          </label>
          {/* Quick Table Presets */}
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', alignSelf: 'center', marginRight: '4px' }}>
              ตารางจริง:
            </span>
            {(['courses', 'profiles', 'course_categories', 'lessons', 'quizzes', 'achievements'] as const).map((t) => (
              <button
                key={t}
                className="btn btn-ghost btn-sm"
                style={{ fontSize: '11px', padding: '2px 8px' }}
                onClick={() => handleTablePresetSelect(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <textarea
          style={{
            width: '100%',
            height: '110px',
            background: '#0a0f1d',
            color: '#38bdf8',
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            lineHeight: 1.6,
            padding: 'var(--space-3)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            outline: 'none',
            resize: 'vertical',
          }}
          value={sqlQuery}
          onChange={(e) => setSqlQuery(e.target.value)}
          spellCheck={false}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
            💡 คำสั่ง SQL ประมวลผลบนเอนจินจริง รองรับ SELECT, WHERE, JOIN, GROUP BY, INSERT, UPDATE
          </span>
          <button
            className="btn btn-primary btn-sm"
            onClick={executeCurrentSql}
            disabled={isExecuting}
            style={{ gap: '6px' }}
          >
            <Play size={14} fill="currentColor" /> {isExecuting ? 'กำลังประมวลผล...' : 'รันคำสั่ง (Execute)'}
          </button>
        </div>
      </div>

      {/* Error Output */}
      {queryError && (
        <div style={{ padding: 'var(--space-3)', background: 'var(--color-error-muted)', border: '1px solid var(--color-error)', borderRadius: 'var(--radius-md)', color: 'var(--color-error)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-mono)' }}>
          ⚠️ PostgreSQL Error: {queryError}
        </div>
      )}

      {/* Results Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">ผลลัพธ์จาก PostgreSQL (Query Results)</h3>
            <p className="card-subtitle">
              พบ {queryResult.length} แถว (ใช้เวลาประมวลผล {executionTime} ms)
            </p>
          </div>
        </div>

        {queryResult.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
            {queryError ? 'คำสั่งมีข้อผิดพลาด กรุณาตรวจสอบไวยากรณ์ SQL' : 'ไม่มีข้อมูลที่ตรงกับเงื่อนไข หรือคำสั่งสำเร็จโดยไม่มีแถวตอบกลับ'}
          </div>
        ) : (
          <div style={{ overflowX: 'auto', maxHeight: '380px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 'var(--text-sm)' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-border)', color: '#38bdf8', position: 'sticky', top: 0, background: 'var(--color-bg-surface)' }}>
                  {columns.map((col) => (
                    <th key={col} style={{ padding: 'var(--space-3)' }}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {queryResult.map((row, rIdx) => (
                  <tr key={rIdx} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    {columns.map((col, cIdx) => (
                      <td key={cIdx} style={{ padding: 'var(--space-3)' }}>
                        {row[col] !== null && row[col] !== undefined ? String(row[col]) : <span style={{ color: '#64748b', fontStyle: 'italic' }}>NULL</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SqlLab;
