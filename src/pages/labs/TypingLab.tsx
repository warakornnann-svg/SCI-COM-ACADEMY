import React, { useState, useEffect, useRef } from 'react';
import {
  Keyboard,
  Clock,
  RotateCcw,
  Sparkles,
  Zap,
  Flame,
  CheckCircle2,
  Trophy,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { typingTexts } from '../../data/courses';

interface TypingLabProps {
  onBack?: () => void;
}

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

export const TypingLab: React.FC<TypingLabProps> = ({ onBack }) => {
  const { state, dispatch, saveLabExercise, addNotification } = useApp();
  const [lang, setLang] = useState<'th' | 'en' | 'code'>('th');
  const [duration, setDuration] = useState<number>(60); // seconds
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [targetText, setTargetText] = useState<string>('');
  const [userInput, setUserInput] = useState<string>('');
  const [stats, setStats] = useState({ wpm: 0, cpm: 0, accuracy: 100, correctChars: 0, incorrectChars: 0 });

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<any>(null);

  // Unicode code points for exact character tracking
  const targetChars = Array.from(targetText);
  const userChars = Array.from(userInput);

  // Initialize text
  const loadNewText = (selectedLang: 'th' | 'en' | 'code') => {
    const list = typingTexts[selectedLang];
    const randomItem = list[Math.floor(Math.random() * list.length)];
    setTargetText(randomItem);
    setUserInput('');
    setIsRunning(false);
    setIsFinished(false);
    setTimeLeft(duration);
    setStats({ wpm: 0, cpm: 0, accuracy: 100, correctChars: 0, incorrectChars: 0 });
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  useEffect(() => {
    loadNewText(lang);
  }, [lang, duration]);

  // Handle countdown
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            finishTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timeLeft]);

  // Auto-focus input on mount or reset
  useEffect(() => {
    inputRef.current?.focus();
  }, [targetText, isFinished]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFinished) return;
    const value = e.target.value;
    const valChars = Array.from(value);
    const tgtChars = Array.from(targetText);

    if (!isRunning && valChars.length === 1) {
      setIsRunning(true);
    }

    setUserInput(value);

    // Calculate metrics using Unicode code points
    let correct = 0;
    let incorrect = 0;
    for (let i = 0; i < valChars.length; i++) {
      if (i < tgtChars.length && valChars[i] === tgtChars[i]) {
        correct++;
      } else {
        incorrect++;
      }
    }

    const elapsed = Math.max(1, duration - timeLeft);
    const minutes = elapsed / 60;
    const words = correct / 5;
    const currentWpm = Math.round(words / minutes);
    const currentCpm = Math.round(correct / minutes);
    const accuracy = valChars.length > 0 ? Math.max(0, Math.round((correct / valChars.length) * 100)) : 100;

    setStats({
      wpm: currentWpm,
      cpm: currentCpm,
      accuracy,
      correctChars: correct,
      incorrectChars: incorrect,
    });

    // Check if finished entire text
    if (valChars.length >= tgtChars.length) {
      finishTest(currentWpm, currentCpm, accuracy, correct, incorrect, valChars.length);
    }
  };

  const finishTest = (
    finalWpm?: number,
    finalCpm?: number,
    finalAccuracy?: number,
    finalCorrect?: number,
    finalIncorrect?: number,
    finalTotal?: number
  ) => {
    setIsRunning(false);
    setIsFinished(true);
    if (timerRef.current) clearInterval(timerRef.current);

    const w = finalWpm !== undefined ? finalWpm : stats.wpm;
    const c = finalCpm !== undefined ? finalCpm : stats.cpm;
    const acc = finalAccuracy !== undefined ? finalAccuracy : stats.accuracy;
    const cor = finalCorrect !== undefined ? finalCorrect : stats.correctChars;
    const incor = finalIncorrect !== undefined ? finalIncorrect : stats.incorrectChars;
    const tot = finalTotal !== undefined ? finalTotal : userChars.length;

    const result = {
      wpm: w,
      cpm: c,
      accuracy: acc,
      correctChars: cor,
      incorrectChars: incor,
      totalChars: tot,
      duration,
      language: lang,
      date: new Date().toISOString(),
    };

    dispatch({ type: 'ADD_TYPING_RESULT', payload: result });
    addNotification('success', `การฝึกพิมพ์เสร็จสิ้น! ความเร็วของคุณ: ${w} WPM (ความแม่นยำ ${acc}%) +15 XP`);

    // Persist to database if logged in
    if (state.user?.id) {
      saveLabExercise('typing', `typing-${lang}`, w >= 20, w);
    }

    if (w >= 30) {
      dispatch({
        type: 'ADD_ACHIEVEMENT',
        payload: {
          userId: state.user?.id || 'guest',
          achievementId: 'ach-typing-30',
          unlockedAt: new Date().toISOString(),
        },
      });
    }
    if (w >= 60) {
      dispatch({
        type: 'ADD_ACHIEVEMENT',
        payload: {
          userId: state.user?.id || 'guest',
          achievementId: 'ach-typing-60',
          unlockedAt: new Date().toISOString(),
        },
      });
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)', width: '100%' }}>
      {/* Top Banner with 3D glass effect - fully responsive */}
      <div className="card-3d glass-panel" style={{ padding: 'clamp(var(--space-3), 3vw, var(--space-5))', borderRadius: 'var(--radius-xl)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
              <span className="badge badge-primary">ทักษะพื้นฐาน</span>
              <span className="badge badge-success">Speed & Accuracy</span>
              <span className="badge badge-cyan">Unicode-Aware</span>
            </div>
            <h2 style={{ fontSize: 'clamp(var(--text-lg), 4vw, var(--text-2xl))', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
              ห้องปฏิบัติการฝึกพิมพ์สัมผัส (Typing Speed Lab)
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'clamp(var(--text-xs), 2.5vw, var(--text-sm))', marginTop: '2px' }}>
              ฝึกฝนความเร็วและความแม่นยำในการพิมพ์ภาษาไทย สระวรรณยุกต์ ภาษาอังกฤษ และโค้ดโปรแกรม
            </p>
          </div>
          {onBack && (
            <button className="btn btn-outline btn-sm" onClick={onBack} style={{ minHeight: '36px' }}>
              ← กลับสู่แดชบอร์ดแล็บ
            </button>
          )}
        </div>
      </div>

      {/* Controls Bar - Responsive Wrap */}
      <div
        className="card glass-panel"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--space-3)',
          padding: 'clamp(var(--space-3), 2.5vw, var(--space-4))',
        }}
      >
        <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--color-text-secondary)' }}>ภาษา:</span>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            <button
              className={`btn btn-sm ${lang === 'th' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setLang('th')}
              style={{ minHeight: '34px' }}
            >
              ภาษาไทย
            </button>
            <button
              className={`btn btn-sm ${lang === 'en' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setLang('en')}
              style={{ minHeight: '34px' }}
            >
              English
            </button>
            <button
              className={`btn btn-sm ${lang === 'code' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setLang('code')}
              style={{ minHeight: '34px' }}
            >
              สัญลักษณ์โค้ด
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--color-text-secondary)' }}>ระยะเวลา:</span>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {[30, 60, 180].map((t) => (
              <button
                key={t}
                className={`btn btn-sm ${duration === t ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setDuration(t)}
                style={{ minHeight: '34px' }}
              >
                {t === 60 ? '1 นาที' : t === 180 ? '3 นาที' : `${t} วินาที`}
              </button>
            ))}
          </div>
        </div>

        <button
          className="btn btn-outline btn-sm"
          onClick={() => loadNewText(lang)}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', minHeight: '34px' }}
        >
          <RotateCcw size={14} /> เปลี่ยนข้อความ
        </button>
      </div>

      {/* Main Typing Arena */}
      <div
        className="card glass-panel"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-5)',
          padding: 'clamp(var(--space-4), 3.5vw, var(--space-8))',
          position: 'relative',
        }}
      >
        {/* Realtime Stats Badges - Responsive Grid (2 columns on mobile, 4 on desktop) */}
        <div className="typing-stats" style={{ margin: 0 }}>
          <div className="card-3d" style={{ background: 'rgba(56, 189, 248, 0.08)', padding: 'clamp(var(--space-2), 2vw, var(--space-3))', borderRadius: 'var(--radius-lg)', textAlign: 'center', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>เวลาคงเหลือ</span>
            <div style={{ fontSize: 'clamp(var(--text-xl), 3vw, var(--text-2xl))', fontWeight: 'bold', color: 'var(--color-accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <Clock size={18} /> {timeLeft}s
            </div>
          </div>
          <div className="card-3d" style={{ background: 'rgba(236, 72, 153, 0.08)', padding: 'clamp(var(--space-2), 2vw, var(--space-3))', borderRadius: 'var(--radius-lg)', textAlign: 'center', border: '1px solid rgba(236, 72, 153, 0.2)' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>ความเร็ว (WPM)</span>
            <div style={{ fontSize: 'clamp(var(--text-xl), 3vw, var(--text-2xl))', fontWeight: 'bold', color: 'var(--color-accent-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <Zap size={18} /> {stats.wpm}
            </div>
          </div>
          <div className="card-3d" style={{ background: 'rgba(34, 197, 94, 0.08)', padding: 'clamp(var(--space-2), 2vw, var(--space-3))', borderRadius: 'var(--radius-lg)', textAlign: 'center', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>ความแม่นยำ</span>
            <div style={{ fontSize: 'clamp(var(--text-xl), 3vw, var(--text-2xl))', fontWeight: 'bold', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <CheckCircle2 size={18} /> {stats.accuracy}%
            </div>
          </div>
          <div className="card-3d" style={{ background: 'rgba(249, 115, 22, 0.08)', padding: 'clamp(var(--space-2), 2vw, var(--space-3))', borderRadius: 'var(--radius-lg)', textAlign: 'center', border: '1px solid rgba(249, 115, 22, 0.2)' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>ตัวอักษรต่อนาที</span>
            <div style={{ fontSize: 'clamp(var(--text-xl), 3vw, var(--text-2xl))', fontWeight: 'bold', color: 'var(--color-warning)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <Flame size={18} /> {stats.cpm}
            </div>
          </div>
        </div>

        {/* Progress Bar & Next Keystroke Helper */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 'var(--text-xs)', flexWrap: 'wrap', gap: '4px' }}>
            {/* Keystroke hint */}
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
            <div
              className="progress-bar-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Text Display Canvas - Fixed Thai Unicode highlighting with ZWNJ */}
        <div
          className="typing-display"
          onClick={() => inputRef.current?.focus()}
          style={{
            cursor: 'text',
            fontFamily: lang === 'code' ? 'var(--font-mono)' : 'var(--font-body)',
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

            // Inspect previous character status
            const prevStatus = index > 0
              ? (index - 1 < userChars.length
                  ? (userChars[index - 1] === targetChars[index - 1] ? 'correct' : 'incorrect')
                  : (index - 1 === userChars.length ? 'current' : 'pending'))
              : null;

            // Thai Unicode combining marks (upper vowels, tone marks)
            // Prepending \u200C (ZWNJ) when mark status differs from preceding base
            // stops Chromium/WebKit/Gecko from fusing mark into the base consonant's color.
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

        {/* Focused / Touch-friendly Input Element */}
        {!isFinished ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <input
              ref={inputRef}
              type="text"
              className="form-input"
              value={userInput}
              onChange={handleInputChange}
              placeholder="พิมพ์ข้อความตามด้านบนที่นี่เพื่อเริ่มจับเวลา..."
              autoFocus
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              style={{
                fontSize: 'clamp(var(--text-base), 3vw, var(--text-lg))',
                padding: 'clamp(var(--space-3), 2.5vw, var(--space-4))',
                textAlign: 'center',
                fontFamily: lang === 'code' ? 'var(--font-mono)' : 'inherit',
                border: '2px solid var(--color-accent-primary)',
                background: 'var(--color-bg-input)',
                borderRadius: 'var(--radius-lg)',
              }}
            />
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', textAlign: 'center' }}>
              💡 พิมพ์ตามตัวอักษรที่ไฮไลท์สีฟ้า เมื่อถูกต้องตัวอักษรจะเปลี่ยนเป็นสีเขียวทีละตัวอักษร
            </span>
          </div>
        ) : (
          <div
            style={{
              padding: 'clamp(var(--space-4), 3vw, var(--space-6))',
              background: 'rgba(34, 197, 94, 0.1)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--color-success)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--space-4)',
            }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-success)' }}>
              <Trophy size={28} />
            </div>
            <div>
              <h3 style={{ fontSize: 'clamp(var(--text-lg), 3vw, var(--text-xl))', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
                ยอดเยี่ยมมาก! การฝึกพิมพ์เสร็จสิ้น
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginTop: '4px' }}>
                ความเร็วของคุณคือ <strong>{stats.wpm} WPM</strong> ด้วยความแม่นยำ <strong>{stats.accuracy}%</strong> ({stats.correctChars} อักขระถูกต้อง)
              </p>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => loadNewText(lang)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', minHeight: '40px' }}
            >
              <RotateCcw size={16} /> ฝึกฝนรอบใหม่
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
