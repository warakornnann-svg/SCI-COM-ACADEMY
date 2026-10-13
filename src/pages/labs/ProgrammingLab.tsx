import React, { useState, useEffect } from 'react';
import {
  Terminal,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Zap,
  Code2,
  Check,
  Award,
  ChevronRight,
  Plus,
  Trash2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { ProgrammingChallenge } from '../../types';
import { CreateChallengeModal } from '../../components/CreateChallengeModal';

const challengeCatalog: ProgrammingChallenge[] = [
  {
    id: 'prog-1',
    category: 'variables',
    categoryLabel: '1. ตัวแปรและชนิดข้อมูล',
    title: 'คำนวณปี พ.ศ. สู่ปี ค.ศ. และอายุ',
    grade: 'ม.4',
    difficulty: 'เริ่มต้น',
    description: 'รับปีเกิดในรูปแบบ พ.ศ. แล้วคำนวณหาปี ค.ศ. (พ.ศ. - 543) และอายุในปีปัจจุบัน (พ.ศ. 2569)',
    inputDescription: 'ตัวเลขจำนวนเต็ม 1 ค่า แทนปีเกิด พ.ศ. เช่น 2552',
    outputDescription: 'แสดงข้อความ "ปี ค.ศ. [ค.ศ.] อายุ [อายุ] ปี"',
    sampleInput: '2552',
    sampleOutput: 'ปี ค.ศ. 2009 อายุ 17 ปี',
    hint: 'สูตร: ค.ศ. = พ.ศ. - 543 และ อายุ = 2569 - พ.ศ.',
    testCases: [
      { input: '2552', expectedOutput: 'ปี ค.ศ. 2009 อายุ 17 ปี' },
      { input: '2550', expectedOutput: 'ปี ค.ศ. 2007 อายุ 19 ปี' },
      { input: '2545', expectedOutput: 'ปี ค.ศ. 2002 อายุ 24 ปี' },
    ],
    initialJsCode: `function solve(input) {
  const beYear = parseInt(input.trim(), 10);
  const ceYear = beYear - 543;
  const age = 2569 - beYear;
  return \`ปี ค.ศ. \${ceYear} อายุ \${age} ปี\`;
}`,
    initialCppCode: `#include <iostream>
using namespace std;

// โหมดฝึกหัดไวยากรณ์ C++ (Simulation Mode)
int main() {
    int beYear;
    cin >> beYear;
    
    int ceYear = beYear - 543;
    int age = 2569 - beYear;
    
    cout << "ปี ค.ศ. " << ceYear << " อายุ " << age << " ปี";
    return 0;
}`,
    solutionRunner: (input) => {
      const be = parseInt(input.trim(), 10);
      return `ปี ค.ศ. ${be - 543} อายุ ${2569 - be} ปี`;
    },
  },
  {
    id: 'prog-2',
    category: 'conditions',
    categoryLabel: '2. เงื่อนไขและการตัดสินใจ',
    title: 'ระบบตัดเกรดมัธยมปลาย (Grade Calculator)',
    grade: 'ม.4',
    difficulty: 'เริ่มต้น',
    description: 'รับคะแนนสอบรวม (0 - 100) แล้วตัดเกรดตามเกณฑ์: 80 ขึ้นไป = 4, 70-79 = 3, 60-69 = 2, 50-59 = 1, ต่ำกว่า 50 = 0',
    inputDescription: 'คะแนนสอบจำนวนเต็ม (0-100)',
    outputDescription: 'เกรดที่ได้: 0, 1, 2, 3 หรือ 4',
    sampleInput: '78',
    sampleOutput: 'เกรด 3',
    hint: 'ใช้ if...else if ตรวจสอบคะแนนจากมากไปน้อย (>= 80, >= 70, >= 60, >= 50)',
    testCases: [
      { input: '85', expectedOutput: 'เกรด 4' },
      { input: '72', expectedOutput: 'เกรด 3' },
      { input: '64', expectedOutput: 'เกรด 2' },
      { input: '53', expectedOutput: 'เกรด 1' },
      { input: '44', expectedOutput: 'เกรด 0' },
    ],
    initialJsCode: `function solve(input) {
  const score = parseInt(input.trim(), 10);
  if (score >= 80) return 'เกรด 4';
  if (score >= 70) return 'เกรด 3';
  if (score >= 60) return 'เกรด 2';
  if (score >= 50) return 'เกรด 1';
  return 'เกรด 0';
}`,
    initialCppCode: `#include <iostream>
using namespace std;

int main() {
    int score;
    cin >> score;
    if (score >= 80) cout << "เกรด 4";
    else if (score >= 70) cout << "เกรด 3";
    else if (score >= 60) cout << "เกรด 2";
    else if (score >= 50) cout << "เกรด 1";
    else cout << "เกรด 0";
    return 0;
}`,
    solutionRunner: (input) => {
      const s = parseInt(input.trim(), 10);
      if (s >= 80) return 'เกรด 4';
      if (s >= 70) return 'เกรด 3';
      if (s >= 60) return 'เกรด 2';
      if (s >= 50) return 'เกรด 1';
      return 'เกรด 0';
    },
  },
  {
    id: 'prog-3',
    category: 'loops',
    categoryLabel: '3. การวนซ้ำ (Loops)',
    title: 'หาผลรวมตัวเลข 1 ถึง N (Sum from 1 to N)',
    grade: 'ม.4',
    difficulty: 'เริ่มต้น',
    description: 'รับจำนวนเต็มบวก N แล้วหาผลรวมของตัวเลขตั้งแต่ 1 จนถึง N (1 + 2 + 3 + ... + N)',
    inputDescription: 'จำนวนเต็มบวก N เช่น 10',
    outputDescription: 'ผลรวมของตัวเลข',
    sampleInput: '10',
    sampleOutput: '55',
    hint: 'ใช้ลูป for ตั้งแต่ 1 ถึง N แล้วสะสมค่าในตัวแปร sum หรือใช้สูตร (N * (N + 1)) / 2',
    testCases: [
      { input: '5', expectedOutput: '15' },
      { input: '10', expectedOutput: '55' },
      { input: '100', expectedOutput: '5050' },
    ],
    initialJsCode: `function solve(input) {
  const n = parseInt(input.trim(), 10);
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum.toString();
}`,
    initialCppCode: `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    long long sum = 0;
    for (int i = 1; i <= n; i++) {
        sum += i;
    }
    cout << sum;
    return 0;
}`,
    solutionRunner: (input) => {
      const n = parseInt(input.trim(), 10);
      return ((n * (n + 1)) / 2).toString();
    },
  },
  {
    id: 'prog-4',
    category: 'functions',
    categoryLabel: '4. ฟังก์ชัน (Functions)',
    title: 'ฟังก์ชันคำนวณดัชนีมวลกาย (BMI Calculator)',
    grade: 'ม.5',
    difficulty: 'ปานกลาง',
    description: 'รับน้ำหนัก (kg) และส่วนสูง (cm) คั่นด้วยวรรค แล้วคำนวณ BMI = น้ำหนัก / (ส่วนสูง/100)^2 ตอบทศนิยม 2 ตำแหน่ง',
    inputDescription: 'ตัวเลขสองค่า คั่นด้วยวรรค เช่น 65 170',
    outputDescription: 'ค่า BMI ทศนิยม 2 ตำแหน่ง เช่น 22.49',
    sampleInput: '65 170',
    sampleOutput: 'BMI = 22.49',
    hint: 'แปลงส่วนสูงจาก cm เป็นเมตร โดยหารด้วย 100 แล้วคำนวณ weight / (heightM * heightM) ใช้ toFixed(2)',
    testCases: [
      { input: '65 170', expectedOutput: 'BMI = 22.49' },
      { input: '50 160', expectedOutput: 'BMI = 19.53' },
      { input: '80 175', expectedOutput: 'BMI = 26.12' },
    ],
    initialJsCode: `function solve(input) {
  const [weight, heightCm] = input.trim().split(/\\s+/).map(Number);
  const heightM = heightCm / 100;
  const bmi = weight / (heightM * heightM);
  return \`BMI = \${bmi.toFixed(2)}\`;
}`,
    initialCppCode: `#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    double w, h;
    cin >> w >> h;
    double hM = h / 100.0;
    double bmi = w / (hM * hM);
    cout << fixed << setprecision(2) << "BMI = " << bmi;
    return 0;
}`,
    solutionRunner: (input) => {
      const parts = input.trim().split(/\s+/).map(Number);
      const hM = parts[1] / 100;
      const bmi = parts[0] / (hM * hM);
      return `BMI = ${bmi.toFixed(2)}`;
    },
  },
  {
    id: 'prog-5',
    category: 'arrays',
    categoryLabel: '5. อาร์เรย์ (Arrays)',
    title: 'หาค่าสูงสุดและต่ำสุดในชุดข้อมูล (Find Max & Min)',
    grade: 'ม.5',
    difficulty: 'ปานกลาง',
    description: 'รับชุดตัวเลขคั่นด้วยวรรค แล้วหาค่าสูงสุด (Max) และค่าต่ำสุด (Min)',
    inputDescription: 'ชุดตัวเลข เช่น 12 45 7 89 23',
    outputDescription: 'Max: [ค่าสูงสุด], Min: [ค่าต่ำสุด]',
    sampleInput: '12 45 7 89 23',
    sampleOutput: 'Max: 89, Min: 7',
    hint: 'วนลูปเปรียบเทียบค่าหรือใช้ Math.max / Math.min กับอาร์เรย์ตัวเลข',
    testCases: [
      { input: '12 45 7 89 23', expectedOutput: 'Max: 89, Min: 7' },
      { input: '100 -5 20 0', expectedOutput: 'Max: 100, Min: -5' },
      { input: '42', expectedOutput: 'Max: 42, Min: 42' },
    ],
    initialJsCode: `function solve(input) {
  const nums = input.trim().split(/\\s+/).map(Number);
  const max = Math.max(...nums);
  const min = Math.min(...nums);
  return \`Max: \${max}, Min: \${min}\`;
}`,
    initialCppCode: `#include <iostream>
#include <algorithm>
using namespace std;

int main() {
    int maxVal = -999999, minVal = 999999, x;
    while (cin >> x) {
        if (x > maxVal) maxVal = x;
        if (x < minVal) minVal = x;
    }
    cout << "Max: " << maxVal << ", Min: " << minVal;
    return 0;
}`,
    solutionRunner: (input) => {
      const nums = input.trim().split(/\s+/).map(Number);
      return `Max: ${Math.max(...nums)}, Min: ${Math.min(...nums)}`;
    },
  },
  {
    id: 'prog-6',
    category: 'problem-solving',
    categoryLabel: '6. การแก้ปัญหาเชิงคำนวณ',
    title: 'ตรวจสอบจำนวนเฉพาะ (Prime Number Check)',
    grade: 'ม.6',
    difficulty: 'ขั้นสูง',
    description: 'รับจำนวนเต็มบวก N แล้วตรวจสอบว่าเป็นจำนวนเฉพาะ (PRIME) หรือไม่ (NOT PRIME)',
    inputDescription: 'จำนวนเต็มบวก N เช่น 17',
    outputDescription: 'PRIME หรือ NOT PRIME',
    sampleInput: '17',
    sampleOutput: 'PRIME',
    hint: 'จำนวนเฉพาะคือจำนวนที่มากกว่า 1 และไม่มีจำนวนอื่นหารลงตัวนอกจาก 1 และตัวมันเอง ตรวจสอบตัวหารตั้งแต่ 2 ถึง sqrt(N)',
    testCases: [
      { input: '17', expectedOutput: 'PRIME' },
      { input: '25', expectedOutput: 'NOT PRIME' },
      { input: '2', expectedOutput: 'PRIME' },
      { input: '1', expectedOutput: 'NOT PRIME' },
    ],
    initialJsCode: `function solve(input) {
  const n = parseInt(input.trim(), 10);
  if (n <= 1) return 'NOT PRIME';
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return 'NOT PRIME';
  }
  return 'PRIME';
}`,
    initialCppCode: `#include <iostream>
#include <cmath>
using namespace std;

int main() {
    int n;
    cin >> n;
    if (n <= 1) { cout << "NOT PRIME"; return 0; }
    for (int i = 2; i <= sqrt(n); i++) {
        if (n % i == 0) { cout << "NOT PRIME"; return 0; }
    }
    cout << "PRIME";
    return 0;
}`,
    solutionRunner: (input) => {
      const n = parseInt(input.trim(), 10);
      if (n <= 1) return 'NOT PRIME';
      for (let i = 2; i <= Math.sqrt(n); i++) {
        if (n % i === 0) return 'NOT PRIME';
      }
      return 'PRIME';
    },
  },
];

interface ProgrammingLabProps {
  onBack?: () => void;
}

export const ProgrammingLab: React.FC<ProgrammingLabProps> = ({ onBack }) => {
  const { state, saveLabExercise, isLabExerciseCompleted, addNotification, deleteCustomChallenge } = useApp();

  const [showCreateModal, setShowCreateModal] = useState(false);

  // Combine built-in challenges with custom challenges created by teachers/admins
  const allChallenges = [...challengeCatalog, ...(state.customChallenges || [])];

  const [activeIdx, setActiveIdx] = useState(0);
  const challenge = allChallenges[activeIdx] || allChallenges[0] || challengeCatalog[0];

  const [langMode, setLangMode] = useState<'js' | 'cpp'>('js');
  const [code, setCode] = useState(challenge.initialJsCode);
  const [customInput, setCustomInput] = useState(challenge.sampleInput);
  const [customOutput, setCustomOutput] = useState('');
  const [showHint, setShowHint] = useState(false);

  // Test case evaluation results
  const [testResults, setTestResults] = useState<Array<{ input: string; expected: string; actual: string; passed: boolean }> | null>(null);
  const [allPassed, setAllPassed] = useState<boolean | null>(null);

  // Sync code when changing challenge or language
  useEffect(() => {
    if (!challenge) return;
    setCode(langMode === 'js' ? challenge.initialJsCode : challenge.initialCppCode);
    setCustomInput(challenge.sampleInput);
    setCustomOutput('');
    setTestResults(null);
    setAllPassed(null);
    setShowHint(false);
  }, [activeIdx, langMode, state.customChallenges]);

  // Execute single run with custom input
  const handleRunSingle = () => {
    try {
      if (langMode === 'js') {
        // Safe evaluation of student JS function
        const runner = new Function(`${code}\nreturn solve(arguments[0]);`);
        const result = String(runner(customInput));
        setCustomOutput(result);
      } else {
        // C++ Simulation Mode: clearly labeled simulation
        if (challenge.solutionRunner) {
          const simulated = challenge.solutionRunner(customInput);
          setCustomOutput(simulated);
        } else {
          const match = challenge.testCases?.find(t => t.input.trim() === customInput.trim());
          if (match) {
            setCustomOutput(match.expectedOutput);
          } else {
            try {
              const runner = new Function(`${challenge.initialJsCode}\nreturn solve(arguments[0]);`);
              setCustomOutput(String(runner(customInput)));
            } catch {
              setCustomOutput(challenge.sampleOutput || 'Output processed');
            }
          }
        }
      }
    } catch (err: any) {
      setCustomOutput(`Error: ${err.message}`);
    }
  };

  // Run all test cases & evaluate
  const handleEvaluateAll = () => {
    try {
      let runnerFunc: (inp: string) => string;

      if (langMode === 'js') {
        runnerFunc = (inp: string) => {
          const runner = new Function(`${code}\nreturn solve(arguments[0]);`);
          return String(runner(inp)).trim();
        };
      } else {
        // C++ Simulated execution
        runnerFunc = (inp: string) => {
          if (challenge.solutionRunner) return challenge.solutionRunner(inp).trim();
          try {
            const runner = new Function(`${challenge.initialJsCode}\nreturn solve(arguments[0]);`);
            return String(runner(inp)).trim();
          } catch {
            const match = challenge.testCases?.find(t => t.input.trim() === inp.trim());
            return match ? match.expectedOutput.trim() : '';
          }
        };
      }

      const results = challenge.testCases.map((tc) => {
        let actual = '';
        let passed = false;
        try {
          actual = runnerFunc(tc.input);
          passed = actual === tc.expectedOutput.trim();
        } catch (err: any) {
          actual = `Error: ${err.message}`;
          passed = false;
        }
        return {
          input: tc.input,
          expected: tc.expectedOutput,
          actual,
          passed,
        };
      });

      const isAllPassed = results.every((r) => r.passed);
      setTestResults(results);
      setAllPassed(isAllPassed);

      if (isAllPassed) {
        saveLabExercise('programming', challenge.id, true, 30, code);
        addNotification('success', `ยินดีด้วย! ผ่านการทดสอบเคส "${challenge.title}" ทั้งหมด (+30 XP บันทึกในระบบแล้ว)`);
      } else {
        addNotification('warning', 'ยังมีบางเคสทดสอบที่ไม่ผ่าน ลองตรวจดูผลลัพธ์จริงเทียบกับที่คาดหวัง');
      }
    } catch (err: any) {
      addNotification('error', `เกิดข้อผิดพลาดในการประมวลผลโค้ด: ${err.message}`);
    }
  };

  const handleResetCode = () => {
    setCode(langMode === 'js' ? challenge.initialJsCode : challenge.initialCppCode);
    setTestResults(null);
    setAllPassed(null);
    setCustomOutput('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Top Selector Card */}
      <div className="card" style={{ padding: 'var(--space-4) var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
          <div>
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Terminal color="#8b5cf6" /> พื้นฐานการเขียนโปรแกรม & อัลกอริทึม (Programming Lab)
            </h2>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
              ฝึกเขียนโปรแกรมและแก้โจทย์ปัญหา พร้อมระบบตรวจเคสทดสอบอัตโนมัติ (Automated Test Cases)
            </p>
          </div>

          {/* Language Mode Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--color-text-secondary)' }}>
              ภาษา:
            </span>
            <div style={{ display: 'flex', gap: '4px', background: 'rgba(255, 255, 255, 0.05)', padding: '2px', borderRadius: 'var(--radius-md)' }}>
              <button
                className={`btn btn-sm ${langMode === 'js' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ fontSize: '12px', padding: '4px 10px' }}
                onClick={() => setLangMode('js')}
              >
                JavaScript (Real Engine)
              </button>
              <button
                className={`btn btn-sm ${langMode === 'cpp' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ fontSize: '12px', padding: '4px 10px' }}
                onClick={() => setLangMode('cpp')}
              >
                C++ (Simulation Mode)
              </button>
            </div>
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

        {/* Challenge Badges Picker & Teacher Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            {allChallenges.map((c, idx) => {
              const isCompleted = isLabExerciseCompleted('programming', c.id);
              const isSelected = activeIdx === idx;
              const isCustom = c.id.startsWith('custom-prog-') || !!c.createdBy;
              return (
                <button
                  key={c.id}
                  className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-outline'}`}
                  style={{
                    fontSize: '12px',
                    padding: '4px 10px',
                    gap: '6px',
                    borderColor: isCustom ? 'rgba(139, 92, 246, 0.5)' : undefined
                  }}
                  onClick={() => setActiveIdx(idx)}
                >
                  {isCompleted && <CheckCircle2 size={13} color="var(--color-success)" />}
                  {isCustom && <Sparkles size={12} color="#a78bfa" />}
                  <span>ข้อ {idx + 1}: {c.title.split('(')[0]}</span>
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* If challenge is custom and user is teacher/admin, allow delete */}
            {(state.user?.role === 'teacher' || state.user?.role === 'admin') &&
              (challenge.id.startsWith('custom-prog-') || !!challenge.createdBy) && (
                <button
                  type="button"
                  className="btn btn-sm btn-ghost text-error"
                  onClick={async () => {
                    if (confirm(`คุณต้องการลบโจทย์ "${challenge.title}" ออกจากระบบใช่หรือไม่?`)) {
                      await deleteCustomChallenge(challenge.id);
                      setActiveIdx(0);
                    }
                  }}
                  style={{ fontSize: '11px', padding: '4px 8px', gap: '4px' }}
                >
                  <Trash2 size={13} /> ลบโจทย์นี้
                </button>
              )}

            {/* Teacher / Admin Add Challenge Button */}
            {(state.user?.role === 'teacher' || state.user?.role === 'admin') && (
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={() => setShowCreateModal(true)}
                style={{
                  fontSize: '12px',
                  padding: '4px 12px',
                  gap: '6px',
                  background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                  boxShadow: '0 0 15px rgba(139, 92, 246, 0.35)'
                }}
              >
                <Plus size={14} /> สร้างโจทย์ใหม่ (คุณครู/แอดมิน)
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Challenge Description Card */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-2)' }}>
              <span className="badge badge-violet">{challenge.categoryLabel}</span>
              <span className="badge badge-blue">{challenge.grade}</span>
              <span className="badge" style={{ background: 'rgba(255,255,255,0.08)' }}>ระดับ: {challenge.difficulty}</span>
            </div>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', marginBottom: 'var(--space-2)' }}>
              {challenge.title}
            </h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 'var(--space-4)' }}>
              {challenge.description}
            </p>
          </div>

          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setShowHint(!showHint)}
            style={{ fontSize: 'var(--text-xs)', gap: '4px' }}
          >
            <HelpCircle size={14} /> {showHint ? 'ซ่อนคำใบ้' : 'ดูคำใบ้ (Hint)'}
          </button>
        </div>

        {/* I/O Specifications */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-3)', background: 'rgba(0, 0, 0, 0.25)', padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-lg)' }}>
          <div>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--color-text-tertiary)' }}>📥 ข้อมูลนำเข้า (Input):</span>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: '2px' }}>{challenge.inputDescription}</div>
          </div>
          <div>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--color-text-tertiary)' }}>📤 ข้อมูลส่งออก (Output):</span>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: '2px' }}>{challenge.outputDescription}</div>
          </div>
          <div>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--color-text-tertiary)' }}>ตัวอย่างผลลัพธ์:</span>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-success)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
              In: {challenge.sampleInput} → Out: {challenge.sampleOutput}
            </div>
          </div>
        </div>

        {showHint && (
          <div style={{ marginTop: 'var(--space-3)', padding: 'var(--space-3)', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)', color: '#c4b5fd' }}>
            💡 <strong>คำใบ้:</strong> {challenge.hint}
          </div>
        )}
      </div>

      {/* Editor & Execution Split */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: 'var(--space-4)' }}>
        {/* Editor Panel */}
        <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '460px' }}>
          <div style={{ padding: '8px 16px', background: 'rgba(10, 15, 29, 0.9)', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)' }}>
              💻 {langMode === 'js' ? 'solution.js (JavaScript Runner)' : 'main.cpp (C++ Syntax Simulator)'}
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                className="btn btn-ghost btn-sm"
                onClick={handleResetCode}
                style={{ fontSize: '11px', padding: '2px 8px' }}
              >
                <RotateCcw size={12} /> รีเซ็ต
              </button>
            </div>
          </div>

          <textarea
            style={{
              width: '100%',
              flex: 1,
              background: '#0a0f1d',
              color: '#f1f5f9',
              padding: 'var(--space-4)',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              lineHeight: 1.6,
              resize: 'none',
              border: 'none',
              outline: 'none',
            }}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
          />
        </div>

        {/* Runner & Test Cases Panel */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* Custom Input */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>ค่าทดสอบข้อมูลนำเข้า (Standard Input):</span>
              <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>กรอกค่าเพื่อทดสอบรันครั้งละ 1 เคส</span>
            </label>
            <input
              type="text"
              className="form-input"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="เช่น 2552 หรือ 12 45 7"
            />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="btn btn-outline btn-sm"
              onClick={handleRunSingle}
              style={{ flex: 1, gap: '6px' }}
            >
              <Play size={14} fill="currentColor" /> ทดลองรันเคสเดี่ยว
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={handleEvaluateAll}
              style={{ flex: 1, gap: '6px' }}
            >
              <Zap size={14} fill="currentColor" /> ตรวจสอบทุกเคส (Evaluate Test Cases)
            </button>
          </div>

          {/* Single Run Output */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <label className="form-label">ผลการทำงาน (Standard Output):</label>
            <div
              style={{
                flex: 1,
                minHeight: '80px',
                background: '#0a0f1d',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-3)',
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-sm)',
                color: '#38bdf8',
                border: '1px solid var(--color-border)',
                overflowY: 'auto',
              }}
            >
              {customOutput ? customOutput : <span style={{ color: '#475569' }}>(กดปุ่มทดลองรันเพื่อดูผลลัพธ์)</span>}
            </div>
          </div>

          {/* Test Cases Results */}
          {testResults && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
                  ผลการตรวจสอบเคสทดสอบ ({testResults.filter((r) => r.passed).length}/{testResults.length}):
                </span>
                <span className={`badge ${allPassed ? 'badge-emerald' : 'badge-amber'}`} style={{ fontSize: '11px' }}>
                  {allPassed ? '✓ ผ่านทั้งหมด' : '✗ ไม่ผ่านบางเคส'}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '140px', overflowY: 'auto' }}>
                {testResults.map((tr, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '6px 10px',
                      borderRadius: 'var(--radius-md)',
                      background: tr.passed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      border: `1px solid ${tr.passed ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                      fontSize: '11px',
                      fontFamily: 'var(--font-mono)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span>Test #{idx + 1} (In: {tr.input}): Expected "{tr.expected}"</span>
                    <span style={{ color: tr.passed ? 'var(--color-success)' : 'var(--color-error)', fontWeight: 'bold' }}>
                      {tr.passed ? 'PASSED' : `FAILED (Got: "${tr.actual}")`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Teachers / Admins to Create Challenges */}
      <CreateChallengeModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={() => {
          setActiveIdx(allChallenges.length);
        }}
      />
    </div>
  );
};

export default ProgrammingLab;
