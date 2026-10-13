import React, { useState, useEffect, useRef } from 'react';
import {
  Keyboard,
  RotateCcw,
  Zap,
  Award,
  CheckCircle2,
  Clock,
  Flame,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { typingTexts } from '../data/courses';

// Unicode Mark detection for Thai upper/lower vowels, tone marks, and diacritics
const isCombiningMark = (ch: string): boolean => /\p{M}/u.test(ch);

// Thai character friendly names for typing hints
const THAI_CHAR_HINTS: Record<string, string> = {
  '่': 'ไม้เอก',
  '้': 'ไม้โท',
  '๊': 'ไม้ตรี',
  '๋': 'ไม้จัตวา',
  '์': 'ทัณฑฆาต (การันต์)',
  'ั': 'ไม้หันอากาศ',
  'ิ': 'สระอิ',
  'ี': 'สระอี',
  'ึ': 'สระอึ',
  'ื': 'สระอือ',
  'ุ': 'สระอุ',
  'ู': 'สระอู',
  '็': 'ไม้ไต่คู้',
  'ำ': 'สระอำ',
  'ะ': 'สระอะ',
  'า': 'สระอา',
  'เ': 'สระเอ',
  'แ': 'สระแอ',
  'โ': 'สระโอ',
  'ใ': 'สระใอม้วน',
  'ไ': 'สระไอไม้มลาย',
  ' ': 'เว้นวรรค (Space)',
};

export const TypingLab: React.FC = () => {
  const { state, dispatch, addNotification } = useApp();

  const [mode, setMode] = useState<'th' | 'en' | 'code'>('th');
  const [textIndex, setTextIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errors, setErrors] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Available texts for current mode
  const currentList = typingTexts[mode] || typingTexts.th;
  const targetText = currentList[textIndex % currentList.length];

  // Unicode code points for exact character tracking
  const targetChars = Array.from(targetText);
  const userChars = Array.from(userInput);

  // Auto-focus input
  useEffect(() => {
    inputRef.current?.focus();
  }, [mode, textIndex, isFinished]);

  // Reset test
  const handleReset = () => {
    setUserInput('');
    setStartTime(null);
    setEndTime(null);
    setWpm(0);
    setAccuracy(100);
    setErrors(0);
    setIsFinished(false);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const handleNextText = () => {
    setTextIndex((prev) => (prev + 1) % currentList.length);
    handleReset();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFinished) return;

    const value = e.target.value;
    const now = Date.now();
    const valChars = Array.from(value);
    const tgtChars = Array.from(targetText);

    // Start timer on first keystroke
    let activeStart = startTime;
    if (!startTime && valChars.length > 0) {
      activeStart = now;
      setStartTime(now);
    }

    // Check accuracy and errors using Unicode code points
    let errCount = 0;
    for (let i = 0; i < valChars.length; i++) {
      if (i >= tgtChars.length || valChars[i] !== tgtChars[i]) {
        errCount++;
      }
    }
    setErrors(errCount);

    const calculatedAccuracy =
      valChars.length > 0 ? Math.max(0, Math.round(((valChars.length - errCount) / valChars.length) * 100)) : 100;
    setAccuracy(calculatedAccuracy);

    // Live WPM calculation
    if (activeStart && valChars.length > 3) {
      const elapsedMinutes = (now - activeStart) / 1000 / 60;
      if (elapsedMinutes > 0.02) {
        const wordsTyped = (valChars.length - errCount) / 5;
        const liveWpm = Math.max(0, Math.round(wordsTyped / elapsedMinutes));
        setWpm(liveWpm);
      }
    }

    setUserInput(value);

    // Check completion
    if (valChars.length >= tgtChars.length) {
      const finalEndTime = now;
      setEndTime(finalEndTime);
      setIsFinished(true);

      const elapsedSeconds = activeStart ? (finalEndTime - activeStart) / 1000 : 1;
      const finalWpm = Math.max(0, Math.round(((valChars.length - errCount) / 5) / (elapsedSeconds / 60)));
      setWpm(finalWpm);

      // Save typing result
      const result = {
        wpm: finalWpm,
        cpm: Math.round(valChars.length / (elapsedSeconds / 60)),
        accuracy: calculatedAccuracy,
        correctChars: valChars.length - errCount,
        incorrectChars: errCount,
        totalChars: valChars.length,
        duration: Math.round(elapsedSeconds),
        language: mode,
        date: new Date().toISOString(),
      };

      dispatch({ type: 'ADD_TYPING_RESULT', payload: result });
      addNotification('success', `ฝึกพิมพ์เสร็จสิ้น! ความเร็ว: ${finalWpm} WPM · ความแม่นยำ: ${calculatedAccuracy}% (+10 XP)`);

      // Check achievements
      if (finalWpm >= 60) {
        dispatch({
          type: 'ADD_ACHIEVEMENT',
          payload: {
            userId: state.user?.id || 'guest',
            achievementId: 'ach-typing-60',
            unlockedAt: new Date().toISOString(),
          },
        });
      } else if (finalWpm >= 30) {
        dispatch({
          type: 'ADD_ACHIEVEMENT',
          payload: {
            userId: state.user?.id || 'guest',
            achievementId: 'ach-typing-30',
            unlockedAt: new Date().toISOString(),
          },
        });
      }
    }
  };

  // Progress percentage
  const progressPercent = targetChars.length > 0
    ? Math.min(100, Math.round((userChars.length / targetChars.length) * 100))
    : 0;

  // Next expected character hint
  const nextChar = targetChars[userChars.length];
  const nextHint = nextChar ? THAI_CHAR_HINTS[nextChar] : null;

  return (
    <div className="main-content" style={{ width: '100%' }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="badge badge-green" style={{ marginBottom: 'var(--space-2)' }}>
          <Keyboard size={14} /> ห้องฝึกปฏิบัติการพิมพ์ดีดสัมผัส (Unicode-Aware)
        </div>
        <h1 className="page-header-title" style={{ fontSize: 'clamp(var(--text-xl), 4vw, var(--text-3xl))' }}>
          Typing Lab: ฝึกพิมพ์เร็วและแม่นยำ
        </h1>
        <p className="page-header-desc" style={{ fontSize: 'clamp(var(--text-xs), 2.5vw, var(--text-base))' }}>
          ทดสอบความเร็วในการพิมพ์สัมผัสทั้งภาษาไทย ภาษาอังกฤษ และโค้ดคำสั่ง พร้อมระบบไฮไลท์อักขระสระและวรรณยุกต์แบบเรียลไทม์
        </p>
      </div>

      {/* Mode Selector and Controls - Responsive */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-3)',
          marginBottom: 'var(--space-5)',
        }}
      >
        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          <button
            className={`btn btn-sm ${mode === 'th' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => {
              setMode('th');
              setTextIndex(0);
              handleReset();
            }}
            style={{ minHeight: '34px' }}
          >
            ภาษาไทย
          </button>
          <button
            className={`btn btn-sm ${mode === 'en' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => {
              setMode('en');
              setTextIndex(0);
              handleReset();
            }}
            style={{ minHeight: '34px' }}
          >
            English
          </button>
          <button
            className={`btn btn-sm ${mode === 'code' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => {
              setMode('code');
              setTextIndex(0);
              handleReset();
            }}
            style={{ minHeight: '34px' }}
          >
            สัญลักษณ์โค้ด
          </button>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
            ข้อความที่ {textIndex + 1} จาก {currentList.length}
          </span>
          <button className="btn btn-ghost btn-sm" onClick={handleNextText} style={{ minHeight: '34px' }}>
            เปลี่ยนข้อความ <ArrowRight size={14} />
          </button>
          <button className="btn btn-outline btn-sm" onClick={handleReset} style={{ minHeight: '34px' }}>
            <RotateCcw size={14} /> รีเซ็ต
          </button>
        </div>
      </div>

      {/* Main Typing Area */}
      <div className="card" style={{ padding: 'clamp(var(--space-4), 3.5vw, var(--space-8))', marginBottom: 'var(--space-6)', position: 'relative' }}>
        {/* Next Character Hint & Progress Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: 'var(--space-4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 'var(--text-xs)', flexWrap: 'wrap', gap: '4px' }}>
            {!isFinished && nextChar ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: 'var(--color-accent-primary)', fontWeight: 'bold' }}>รอพิมพ์:</span>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '1px 8px',
                    background: 'rgba(56, 189, 248, 0.15)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid rgba(56, 189, 248, 0.35)',
                    color: 'var(--color-accent-primary)',
                    fontWeight: 'bold',
                    fontSize: 'var(--text-xs)',
                  }}
                >
                  {isCombiningMark(nextChar) ? `◌${nextChar}` : (nextChar === ' ' ? '␣ Space' : nextChar)}
                </span>
                {nextHint && <span style={{ color: 'var(--color-text-secondary)' }}>({nextHint})</span>}
              </div>
            ) : (
              <span style={{ color: 'var(--color-text-secondary)' }}>ความคืบหน้า</span>
            )}
            <span style={{ color: 'var(--color-text-secondary)', marginLeft: 'auto' }}>
              {userChars.length}/{targetChars.length} อักขระ ({progressPercent}%)
            </span>
          </div>

          <div className="progress-bar progress-bar-sm">
            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        {/* Character Display - Unicode & ZWNJ Aware */}
        <div
          className="typing-display"
          onClick={() => inputRef.current?.focus()}
          style={{
            cursor: 'text',
            marginBottom: 'var(--space-5)',
            fontFamily: mode === 'code' ? 'var(--font-mono)' : 'var(--font-body)',
          }}
          title="คลิกที่นี่เพื่อเริ่มพิมพ์"
        >
          {targetChars.map((char, index) => {
            let status: 'correct' | 'incorrect' | 'current' | 'pending' = 'pending';
            if (index < userChars.length) {
              status = userChars[index] === char ? 'correct' : 'incorrect';
            } else if (index === userChars.length) {
              status = 'current';
            }

            const prevStatus = index > 0
              ? (index - 1 < userChars.length
                  ? (userChars[index - 1] === targetChars[index - 1] ? 'correct' : 'incorrect')
                  : (index - 1 === userChars.length ? 'current' : 'pending'))
              : null;

            // Combining marks (upper vowels, tone marks)
            const needsZwnj = isCombiningMark(char) && (status !== prevStatus || status !== 'correct');
            const displayChar = needsZwnj ? `\u200C${char}` : char;

            return (
              <span
                key={index}
                className={`typing-char ${status} ${char === ' ' ? 'space' : ''}`}
              >
                {char === ' ' && status === 'current' ? (
                  <span style={{ opacity: 0.6, fontSize: '0.8em' }}>␣</span>
                ) : (
                  displayChar
                )}
              </span>
            );
          })}
        </div>

        {/* Input Field */}
        <div style={{ position: 'relative' }}>
          <input
            ref={inputRef}
            type="text"
            className="form-input"
            style={{
              fontSize: 'clamp(var(--text-base), 3vw, var(--text-lg))',
              fontFamily: mode === 'code' ? 'var(--font-mono)' : 'var(--font-body)',
              padding: 'clamp(var(--space-3), 2.5vw, var(--space-4))',
              background: 'var(--color-bg-input)',
              border: '2px solid var(--color-accent-primary)',
              borderRadius: 'var(--radius-lg)',
              textAlign: 'center',
            }}
            placeholder={isFinished ? 'การทดสอบเสร็จสมบูรณ์! กด "รีเซ็ต" หรือ "ข้อความถัดไป"' : 'เริ่มพิมพ์ที่นี่เพื่อจับเวลา...'}
            value={userInput}
            onChange={handleInputChange}
            disabled={isFinished}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
        </div>

        {/* Live Metrics Grid - Responsive (2 on mobile, 4 on desktop) */}
        <div className="typing-stats" style={{ marginTop: 'var(--space-5)' }}>
          <div className="stat-card" style={{ padding: 'clamp(var(--space-2), 2vw, var(--space-4))' }}>
            <div className="stat-card-icon blue">
              <Zap size={20} />
            </div>
            <div className="stat-card-info">
              <div className="stat-card-label">ความเร็ว (WPM)</div>
              <div className="stat-card-value">{wpm}</div>
              <div className="stat-card-sub">คำต่อนาที</div>
            </div>
          </div>

          <div className="stat-card" style={{ padding: 'clamp(var(--space-2), 2vw, var(--space-4))' }}>
            <div className="stat-card-icon green">
              <CheckCircle2 size={20} />
            </div>
            <div className="stat-card-info">
              <div className="stat-card-label">ความแม่นยำ</div>
              <div className="stat-card-value">{accuracy}%</div>
              <div className="stat-card-sub">ความถูกต้อง</div>
            </div>
          </div>

          <div className="stat-card" style={{ padding: 'clamp(var(--space-2), 2vw, var(--space-4))' }}>
            <div className="stat-card-icon amber">
              <Flame size={20} />
            </div>
            <div className="stat-card-info">
              <div className="stat-card-label">พิมพ์ผิด</div>
              <div className="stat-card-value">{errors}</div>
              <div className="stat-card-sub">ตัวอักษร</div>
            </div>
          </div>

          <div className="stat-card" style={{ padding: 'clamp(var(--space-2), 2vw, var(--space-4))' }}>
            <div className="stat-card-icon cyan">
              <Clock size={20} />
            </div>
            <div className="stat-card-info">
              <div className="stat-card-label">ความคืบหน้า</div>
              <div className="stat-card-value">{progressPercent}%</div>
              <div className="stat-card-sub">{userChars.length}/{targetChars.length} อักขระ</div>
            </div>
          </div>
        </div>

        {/* Completion Result Overlay Banner */}
        {isFinished && (
          <div
            style={{
              marginTop: 'var(--space-6)',
              padding: 'clamp(var(--space-4), 3vw, var(--space-6))',
              borderRadius: 'var(--radius-xl)',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)',
              border: '1px solid var(--color-success)',
              textAlign: 'center',
            }}
          >
            <div style={{ width: '48px', height: '48px', margin: '0 auto var(--space-3)', background: 'var(--color-success)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <Award size={28} />
            </div>
            <h3 style={{ fontSize: 'clamp(var(--text-lg), 3vw, var(--text-xl))', fontWeight: 'bold', marginBottom: 'var(--space-2)' }}>
              เยี่ยมมาก! คุณพิมพ์เสร็จสมบูรณ์
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
              คุณทำความเร็วได้ <strong>{wpm} WPM</strong> ด้วยความแม่นยำ <strong>{accuracy}%</strong>
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={handleNextText} style={{ minHeight: '38px' }}>
                ฝึกข้อความถัดไป <ArrowRight size={16} />
              </button>
              <button className="btn btn-outline" onClick={handleReset} style={{ minHeight: '38px' }}>
                <RotateCcw size={16} /> ลองพิมพ์ข้อความนี้อีกครั้ง
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Typing History & Real Stats */}
      <div className="card" style={{ padding: 'clamp(var(--space-4), 3vw, var(--space-6))' }}>
        <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', marginBottom: 'var(--space-4)' }}>
          ประวัติการฝึกพิมพ์ของคุณ ({state.typingHistory.length} ครั้ง)
        </h3>

        {state.typingHistory.length > 0 ? (
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)', textAlign: 'left', minWidth: '480px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-tertiary)' }}>
                  <th style={{ padding: 'var(--space-2) var(--space-3)' }}>ครั้งที่</th>
                  <th style={{ padding: 'var(--space-2) var(--space-3)' }}>หมวด</th>
                  <th style={{ padding: 'var(--space-2) var(--space-3)' }}>ความเร็ว (WPM)</th>
                  <th style={{ padding: 'var(--space-2) var(--space-3)' }}>ความแม่นยำ</th>
                  <th style={{ padding: 'var(--space-2) var(--space-3)' }}>วันที่และเวลา</th>
                </tr>
              </thead>
              <tbody>
                {state.typingHistory.slice().reverse().slice(0, 5).map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: 'var(--space-3)' }}>#{state.typingHistory.length - idx}</td>
                    <td style={{ padding: 'var(--space-3)' }}>
                      <span className="badge badge-blue">
                        {item.language === 'th' ? 'ภาษาไทย' : item.language === 'en' ? 'English' : 'Code'}
                      </span>
                    </td>
                    <td style={{ padding: 'var(--space-3)', fontWeight: 'bold', color: 'var(--color-accent-primary)' }}>
                      {item.wpm} WPM
                    </td>
                    <td style={{ padding: 'var(--space-3)' }}>{item.accuracy}%</td>
                    <td style={{ padding: 'var(--space-3)', color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)' }}>
                      {new Date(item.date).toLocaleString('th-TH')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', textAlign: 'center', padding: 'var(--space-4)' }}>
            ยังไม่มีประวัติการฝึกพิมพ์ ลองเริ่มพิมพ์ข้อความแรกด้านบนได้เลย!
          </p>
        )}
      </div>
    </div>
  );
};

export default TypingLab;
