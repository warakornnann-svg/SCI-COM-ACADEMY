import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Code2,
  Sparkles,
  Terminal,
  HelpCircle,
  FileCode,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { ProgrammingChallenge } from '../types';

interface CreateChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (challenge: ProgrammingChallenge) => void;
}

const CATEGORY_OPTIONS: Array<{ value: ProgrammingChallenge['category']; label: string }> = [
  { value: 'variables', label: '1. ตัวแปรและชนิดข้อมูล' },
  { value: 'conditions', label: '2. เงื่อนไขและการตัดสินใจ' },
  { value: 'loops', label: '3. การวนซ้ำและลูป' },
  { value: 'functions', label: '4. ฟังก์ชันและโมดูล' },
  { value: 'arrays', label: '5. อาร์เรย์และโครงสร้างข้อมูล' },
  { value: 'problem-solving', label: '6. การแก้ปัญหาเชิงคำนวณ' },
];

export const CreateChallengeModal: React.FC<CreateChallengeModalProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const { state, saveCustomChallenge, addNotification } = useApp();

  const [title, setTitle] = useState('');
  const [grade, setGrade] = useState<'ม.4' | 'ม.5' | 'ม.6'>('ม.4');
  const [category, setCategory] = useState<ProgrammingChallenge['category']>('variables');
  const [difficulty, setDifficulty] = useState<'เริ่มต้น' | 'ปานกลาง' | 'ขั้นสูง'>('เริ่มต้น');
  const [description, setDescription] = useState('');
  const [inputDescription, setInputDescription] = useState('');
  const [outputDescription, setOutputDescription] = useState('');
  const [sampleInput, setSampleInput] = useState('');
  const [sampleOutput, setSampleOutput] = useState('');
  const [hint, setHint] = useState('');

  // Test cases
  const [testCases, setTestCases] = useState<Array<{ input: string; expectedOutput: string }>>([
    { input: '', expectedOutput: '' },
    { input: '', expectedOutput: '' },
  ]);

  // Code templates
  const [jsCode, setJsCode] = useState(`function solve(input) {
  // เขียนโค้ดประมวลผลที่นี่
  const val = input.trim();
  return val;
}`);

  const [cppCode, setCppCode] = useState(`#include <iostream>
#include <string>
using namespace std;

int main() {
    string input;
    if (cin >> input) {
        cout << input;
    }
    return 0;
}`);

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAddTestCase = () => {
    setTestCases((prev) => [...prev, { input: '', expectedOutput: '' }]);
  };

  const handleRemoveTestCase = (index: number) => {
    if (testCases.length <= 1) {
      addNotification('warning', 'ต้องมี Test Case อย่างน้อย 1 ชุดสำหรับการตรวจ');
      return;
    }
    setTestCases((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleTestCaseChange = (index: number, field: 'input' | 'expectedOutput', value: string) => {
    setTestCases((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      addNotification('warning', 'กรุณาระบุชื่อโจทย์');
      return;
    }
    if (!description.trim()) {
      addNotification('warning', 'กรุณาระบุคำอธิบายโจทย์');
      return;
    }

    const validTestCases = testCases.filter(
      (tc) => tc.input.trim() !== '' || tc.expectedOutput.trim() !== ''
    );

    if (validTestCases.length === 0) {
      addNotification('warning', 'กรุณากำหนดชุดทดสอบ (Test Case) อย่างน้อย 1 ชุด');
      return;
    }

    setIsSubmitting(true);
    try {
      const categoryObj = CATEGORY_OPTIONS.find((c) => c.value === category);
      const newChallenge: ProgrammingChallenge = {
        id: 'custom-prog-' + Date.now(),
        title: title.trim(),
        grade,
        category,
        categoryLabel: categoryObj?.label || 'การเขียนโปรแกรม',
        difficulty,
        description: description.trim(),
        inputDescription: inputDescription.trim() || 'ข้อมูลนำเข้าตามโจทย์กำหนด',
        outputDescription: outputDescription.trim() || 'ผลลัพธ์ตามโจทย์กำหนด',
        sampleInput: sampleInput.trim() || validTestCases[0]?.input || '',
        sampleOutput: sampleOutput.trim() || validTestCases[0]?.expectedOutput || '',
        hint: hint.trim() || 'อ่านโจทย์และสังเกตเงื่อนไขอย่างรอบคอบ',
        testCases: validTestCases,
        initialJsCode: jsCode,
        initialCppCode: cppCode,
        createdBy: state.user?.displayName || 'ครูผู้สอน',
        createdAt: new Date().toISOString(),
      };

      await saveCustomChallenge(newChallenge);
      if (onCreated) {
        onCreated(newChallenge);
      }
      onClose();
    } catch (err: any) {
      addNotification('error', `เกิดข้อผิดพลาดในการสร้างโจทย์: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1100 }}>
      <div
        className="modal glass-panel card-3d"
        style={{
          maxWidth: '820px',
          width: '95%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(139, 92, 246, 0.2)'
        }}
      >
        {/* Modal Header */}
        <div
          className="modal-header"
          style={{
            padding: 'var(--space-4) var(--space-6)',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(15, 23, 42, 0.6)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}
            >
              <Code2 size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', margin: 0 }}>
                สร้างโจทย์ฝึกเขียนโปรแกรมใหม่ (Teacher / Admin Lab Editor)
              </h3>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', margin: 0 }}>
                เพิ่มโจทย์ปัญหาพร้อมระบบตรวจ Test Cases อัตโนมัติ บันทึกลง PostgreSQL ทันที
              </p>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            style={{ padding: '6px', borderRadius: '50%' }}
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <form
          onSubmit={handleSubmit}
          style={{
            overflowY: 'auto',
            padding: 'var(--space-6)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-4)',
            flex: 1
          }}
        >
          {/* Row 1: Title & Grade */}
          <div className="grid grid-cols-3" style={{ gap: 'var(--space-4)' }}>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label" style={{ fontWeight: 'bold' }}>
                ชื่อโจทย์ปัญหา (Challenge Title) *
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="เช่น คำนวณหาพื้นที่สามเหลี่ยม หรือ ตรวจสอบเลขคู่/คี่"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 'bold' }}>ระดับชั้น</label>
              <select
                className="form-input form-select"
                value={grade}
                onChange={(e) => setGrade(e.target.value as any)}
              >
                <option value="ม.4">มัธยมศึกษาปีที่ 4</option>
                <option value="ม.5">มัธยมศึกษาปีที่ 5</option>
                <option value="ม.6">มัธยมศึกษาปีที่ 6</option>
              </select>
            </div>
          </div>

          {/* Row 2: Category & Difficulty */}
          <div className="grid grid-cols-2" style={{ gap: 'var(--space-4)' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 'bold' }}>หมวดหมู่โจทย์</label>
              <select
                className="form-input form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 'bold' }}>ระดับความยาก</label>
              <select
                className="form-input form-select"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
              >
                <option value="เริ่มต้น">เริ่มต้น (Easy)</option>
                <option value="ปานกลาง">ปานกลาง (Medium)</option>
                <option value="ขั้นสูง">ขั้นสูง (Hard / Advanced)</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 'bold' }}>
              คำอธิบายรายละเอียดโจทย์ (Problem Description) *
            </label>
            <textarea
              className="form-input"
              rows={3}
              placeholder="อธิบายสิ่งที่ต้องการให้นักเรียนคำนวณหรือแก้ปัญหา พร้อมเงื่อนไข..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Input & Output Description */}
          <div className="grid grid-cols-2" style={{ gap: 'var(--space-4)' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: 'var(--text-xs)' }}>คำอธิบายข้อมูลนำเข้า (Input Format)</label>
              <input
                type="text"
                className="form-input"
                placeholder="เช่น ตัวเลขจำนวนเต็ม 1 บรรทัด"
                value={inputDescription}
                onChange={(e) => setInputDescription(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontSize: 'var(--text-xs)' }}>คำอธิบายผลลัพธ์ (Output Format)</label>
              <input
                type="text"
                className="form-input"
                placeholder="เช่น แสดงผลข้อความ PASS หรือ FAIL"
                value={outputDescription}
                onChange={(e) => setOutputDescription(e.target.value)}
              />
            </div>
          </div>

          {/* Sample I/O & Hint */}
          <div className="grid grid-cols-3" style={{ gap: 'var(--space-4)' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: 'var(--text-xs)' }}>ตัวอย่าง Input (Sample Input)</label>
              <input
                type="text"
                className="form-input"
                placeholder="เช่น 15"
                value={sampleInput}
                onChange={(e) => setSampleInput(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontSize: 'var(--text-xs)' }}>ตัวอย่าง Output (Sample Output)</label>
              <input
                type="text"
                className="form-input"
                placeholder="เช่น ODD"
                value={sampleOutput}
                onChange={(e) => setSampleOutput(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontSize: 'var(--text-xs)' }}>คำใบ้สำหรับนักเรียน (Hint)</label>
              <input
                type="text"
                className="form-input"
                placeholder="เช่น ใช้เครื่องหมาย % 2 เพื่อเช็คเศษ"
                value={hint}
                onChange={(e) => setHint(e.target.value)}
              />
            </div>
          </div>

          {/* Automated Test Cases */}
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.25)',
              padding: 'var(--space-4)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} color="var(--color-success)" />
                <span style={{ fontWeight: 'bold', fontSize: 'var(--text-sm)' }}>
                  ชุดทดสอบอัตโนมัติ (Automated Test Cases) *
                </span>
              </div>
              <button
                type="button"
                className="btn btn-outline btn-xs"
                onClick={handleAddTestCase}
                style={{ gap: '4px' }}
              >
                <Plus size={13} /> เพิ่ม Test Case
              </button>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', marginBottom: '10px' }}>
              ระบบจะรันโค้ดของนักเรียนด้วย Input เหล่านี้ และตรวจสอบว่าได้ผลลัพธ์ตรงกับ Expected Output หรือไม่
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {testCases.map((tc, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    padding: '8px',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  <span style={{ fontSize: '12px', fontWeight: 'bold', width: '60px', color: 'var(--color-text-secondary)' }}>
                    เคสที่ {idx + 1}:
                  </span>
                  <input
                    type="text"
                    className="form-input"
                    style={{ flex: 1, fontSize: '12px', padding: '6px 10px' }}
                    placeholder="Input (ข้อมูลนำเข้า)"
                    value={tc.input}
                    onChange={(e) => handleTestCaseChange(idx, 'input', e.target.value)}
                  />
                  <input
                    type="text"
                    className="form-input"
                    style={{ flex: 1, fontSize: '12px', padding: '6px 10px' }}
                    placeholder="Expected Output (ผลลัพธ์ที่ถูกต้อง)"
                    value={tc.expectedOutput}
                    onChange={(e) => handleTestCaseChange(idx, 'expectedOutput', e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-ghost btn-xs text-error"
                    onClick={() => handleRemoveTestCase(idx)}
                    title="ลบชุดทดสอบนี้"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Starter Code Templates */}
          <div className="grid grid-cols-2" style={{ gap: 'var(--space-4)' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: 'var(--text-xs)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Terminal size={13} color="#f59e0b" /> โค้ดตั้งต้น JavaScript (Starter JS)
              </label>
              <textarea
                className="form-input font-mono"
                style={{ fontSize: '11px', minHeight: '120px' }}
                value={jsCode}
                onChange={(e) => setJsCode(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontSize: 'var(--text-xs)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileCode size={13} color="#3b82f6" /> โค้ดตั้งต้น C++ (Starter C++)
              </label>
              <textarea
                className="form-input font-mono"
                style={{ fontSize: '11px', minHeight: '120px' }}
                value={cppCode}
                onChange={(e) => setCppCode(e.target.value)}
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 'var(--space-3)',
              paddingTop: 'var(--space-3)',
              borderTop: '1px solid var(--color-border)',
              marginTop: 'var(--space-2)'
            }}
          >
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting || !title.trim()}
              style={{ gap: '6px' }}
            >
              <Sparkles size={16} /> {isSubmitting ? 'กำลังบันทึกลงฐานข้อมูล...' : 'บันทึกโจทย์ลงระบบ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateChallengeModal;
