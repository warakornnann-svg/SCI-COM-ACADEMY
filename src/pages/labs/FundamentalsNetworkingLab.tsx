import React, { useState } from 'react';
import {
  Wifi,
  Cpu,
  Layers,
  ShieldCheck,
  Send,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Zap,
  Key,
  Lock,
  Globe,
  Radio,
  Share2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface FundamentalsNetworkingLabProps {
  onBack?: () => void;
}

export const FundamentalsNetworkingLab: React.FC<FundamentalsNetworkingLabProps> = ({ onBack }) => {
  const { saveLabExercise, isLabExerciseCompleted, addNotification } = useApp();

  // Active section inside this lab
  const [activeSection, setActiveSection] = useState<'binary' | 'hardware' | 'subnet' | 'security'>('binary');

  // --- 1. Binary Studio State ---
  const [bits, setBits] = useState<number[]>([0, 0, 1, 0, 1, 0, 1, 1]); // 43
  const bitWeights = [128, 64, 32, 16, 8, 4, 2, 1];
  const decimalVal = bits.reduce((sum, b, idx) => sum + b * bitWeights[idx], 0);
  const hexVal = '0x' + decimalVal.toString(16).toUpperCase().padStart(2, '0');

  // Bitwise calculator
  const [bitOp, setBitOp] = useState<'AND' | 'OR' | 'XOR'>('AND');
  const [opOperand, setOpOperand] = useState<number>(15); // 00001111
  const bitwiseResult = bitOp === 'AND' ? (decimalVal & opOperand) : bitOp === 'OR' ? (decimalVal | opOperand) : (decimalVal ^ opOperand);

  const toggleBit = (idx: number) => {
    const next = [...bits];
    next[idx] = next[idx] === 1 ? 0 : 1;
    setBits(next);
  };

  // --- 2. Hardware Identification State ---
  const [selectedComponent, setSelectedComponent] = useState<string>('cpu');
  const hardwareData: Record<string, { title: string; desc: string; icon: string; spec: string }> = {
    cpu: {
      title: 'ซีพียู (Central Processing Unit - CPU)',
      desc: 'สมองหลักของคอมพิวเตอร์ ทำหน้าที่ประมวลผลคำสั่งทางคณิตศาสตร์และตรรกะ (ALU) และควบคุมการทำงานของระบบ (CU)',
      icon: '🧠',
      spec: 'ความเร็ว 3.0 - 5.5 GHz, 6-16 Cores, Socket LGA1700 / AM5',
    },
    ram: {
      title: 'แรม (Random Access Memory - RAM)',
      desc: 'หน่วยความจำหลักชั่วคราว (Volatile Memory) เก็บข้อมูลและโปรแกรมที่กำลังประมวลผลอยู่เพื่อให้ CPU ดึงไปใช้งานได้อย่างรวดเร็ว',
      icon: '⚡',
      spec: 'DDR4 / DDR5, ความจุ 8GB - 32GB, บัส 3200 - 6000 MHz',
    },
    ssd: {
      title: 'เอสเอสดี (Solid State Drive - NVMe M.2)',
      desc: 'หน่วยเก็บข้อมูลถาวรความเร็วสูง (Non-volatile) ใช้ชิป Flash Memory เชื่อมต่อผ่านบัส PCIe ทำให้อ่านเขียนได้เร็วกว่าฮาร์ดดิสก์แบบจานหมุนหลายสิบเท่า',
      icon: '💾',
      spec: 'PCIe Gen 4.0 x4, ความเร็วอ่าน 3500 - 7400 MB/s',
    },
    gpu: {
      title: 'การ์ดจอ (Graphics Processing Unit - GPU)',
      desc: 'ชิปประมวลผลกราฟฟิกขนานสูง สำหรับเรนเดอร์ภาพ 3D วิดีโอความละเอียดสูง และงานด้านปัญญาประดิษฐ์ (AI & Machine Learning)',
      icon: '🎮',
      spec: 'VRAM GDDR6 8GB - 16GB, เชื่อมต่อผ่านสล็อต PCIe x16',
    },
    motherboard: {
      title: 'เมนบอร์ด (Mainboard / Motherboard)',
      desc: 'แผงวงจรหลักที่เชื่อมต่อทุกชิ้นส่วนเข้าด้วยกัน ควบคุมทางเดินของสัญญาณข้อมูล (Bus) และแจกจ่ายพลังงานไฟฟ้า',
      icon: '🎛️',
      spec: 'Form Factor ATX / Micro-ATX, Chipset B760 / B650',
    },
    psu: {
      title: 'พาวเวอร์ซัพพลาย (Power Supply Unit - PSU)',
      desc: 'แปลงกระแสไฟฟ้าสลับ (AC 220V) เป็นกระแสตรง (DC +12V, +5V, +3.3V) จ่ายพลังงานที่เสถียรให้กับชิ้นส่วนทั้งหมด',
      icon: '🔌',
      spec: 'มาตรฐาน 80 Plus Bronze/Gold, กำลังไฟ 650W - 850W',
    },
  };

  // --- 3. Subnet Calculator State ---
  const [ipAddress, setIpAddress] = useState('192.168.10.45');
  const [cidr, setCidr] = useState(24);
  const [packetState, setPacketState] = useState<'idle' | 'sending' | 'success'>('idle');

  const calculateSubnet = () => {
    const totalHosts = Math.pow(2, 32 - cidr);
    const usableHosts = Math.max(0, totalHosts - 2);
    const maskBits = ('1'.repeat(cidr) + '0'.repeat(32 - cidr)).match(/.{1,8}/g) || [];
    const maskStr = maskBits.map((b) => parseInt(b, 2)).join('.');
    return {
      maskStr,
      totalHosts,
      usableHosts,
      networkAddress: `192.168.10.0/${cidr}`,
      broadcastAddress: `192.168.10.${Math.min(255, totalHosts - 1)}`,
      hostRange: `192.168.10.1 - 192.168.10.${Math.max(1, totalHosts - 2)}`,
    };
  };

  const subnet = calculateSubnet();

  const handleSimulatePing = () => {
    setPacketState('sending');
    setTimeout(() => {
      setPacketState('success');
      setTimeout(() => setPacketState('idle'), 3500);
    }, 1200);
  };

  // --- 4. Password Security Analyzer State ---
  const [pwdInput, setPwdInput] = useState('SciCom@2026!');
  const checkPwdSecurity = (p: string) => {
    let score = 0;
    if (p.length >= 8) score += 25;
    if (p.length >= 12) score += 20;
    if (/[A-Z]/.test(p)) score += 20;
    if (/[0-9]/.test(p)) score += 15;
    if (/[^A-Za-z0-9]/.test(p)) score += 20;

    let strength = 'ง่ายเกินไป';
    let color = 'var(--color-error)';
    let crackTime = 'ไม่ถึง 1 วินาที';

    if (score >= 80) {
      strength = 'ปลอดภัยมาก (Strong)';
      color = 'var(--color-success)';
      crackTime = 'หลายร้อยปี (300+ Years)';
    } else if (score >= 55) {
      strength = 'ปานกลาง (Medium)';
      color = 'var(--color-warning)';
      crackTime = 'ประมาณ 2-3 สัปดาห์';
    }

    return { score: Math.min(100, score), strength, color, crackTime };
  };

  const pwdAnalysis = checkPwdSecurity(pwdInput);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Top Banner */}
      <div className="card" style={{ padding: 'var(--space-4) var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
          <div>
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Wifi color="#10b981" /> พื้นฐานคอมพิวเตอร์และเครือข่าย (Computer Fundamentals & Networking)
            </h2>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
              เรียนรู้ชิ้นส่วนฮาร์ดแวร์, แปลงเลขฐานสองและบิตไวส์, คำนวณ Subnet Mask, จำลองส่งแพ็กเก็ต และความปลอดภัยไซเบอร์
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                saveLabExercise('fundamentals', 'fn-all', true, 40);
                addNotification('success', 'บันทึกความก้าวหน้าแล็บพื้นฐานคอมพิวเตอร์และเครือข่ายแล้ว (+40 XP)');
              }}
              style={{ gap: '6px' }}
            >
              <CheckCircle2 size={14} /> บันทึกภารกิจแล็บ (+40 XP)
            </button>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            className={`btn btn-sm ${activeSection === 'binary' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveSection('binary')}
          >
            🔢 สวิตช์เลขฐานสอง & บิตไวส์
          </button>
          <button
            className={`btn btn-sm ${activeSection === 'hardware' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveSection('hardware')}
          >
            🖥️ แยกแยะชิ้นส่วนฮาร์ดแวร์
          </button>
          <button
            className={`btn btn-sm ${activeSection === 'subnet' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveSection('subnet')}
          >
            🌐 เครื่องคำนวณซับเน็ต & Ping
          </button>
          <button
            className={`btn btn-sm ${activeSection === 'security' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveSection('security')}
          >
            🛡️ วิเคราะห์ความปลอดภัยไซเบอร์
          </button>
        </div>
      </div>

      {/* SECTION 1: BINARY & BITWISE */}
      {activeSection === 'binary' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <div className="card">
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', marginBottom: '4px' }}>
              สวิตช์เลขฐานสอง 8 บิต (Interactive 8-Bit Binary Switch)
            </h3>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
              คลิกที่แต่ละกล่องบิตเพื่อเปิด (1) หรือปิด (0) และสังเกตการคำนวณค่าน้ำหนักบิต (2^n)
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-3)', flexWrap: 'wrap', margin: 'var(--space-4) 0' }}>
              {bits.map((b, idx) => {
                const weight = bitWeights[idx];
                const isOn = b === 1;
                return (
                  <div
                    key={idx}
                    onClick={() => toggleBit(idx)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      userSelect: 'none',
                    }}
                  >
                    <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                      2^{7 - idx} = {weight}
                    </span>
                    <div
                      style={{
                        width: '54px',
                        height: '64px',
                        borderRadius: 'var(--radius-lg)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '26px',
                        fontWeight: 'bold',
                        background: isOn ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(255, 255, 255, 0.04)',
                        color: isOn ? '#ffffff' : '#64748b',
                        border: isOn ? '2px solid #34d399' : '1px solid var(--color-border)',
                        boxShadow: isOn ? '0 0 20px rgba(16, 185, 129, 0.4)' : 'none',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {b}
                    </div>
                    <span style={{ fontSize: '11px', color: isOn ? 'var(--color-success)' : 'var(--color-text-tertiary)' }}>
                      {isOn ? `+${weight}` : '0'}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Results Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
              <div style={{ padding: 'var(--space-3)', background: 'rgba(0, 0, 0, 0.3)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>เลขฐานสอง (Binary):</div>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', color: '#34d399', letterSpacing: '2px', fontFamily: 'var(--font-mono)' }}>
                  {bits.join('')}₂
                </div>
              </div>
              <div style={{ padding: 'var(--space-3)', background: 'rgba(0, 0, 0, 0.3)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>เลขฐานสิบ (Decimal):</div>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', color: '#f1f5f9', fontFamily: 'var(--font-mono)' }}>
                  {decimalVal}₁₀
                </div>
              </div>
              <div style={{ padding: 'var(--space-3)', background: 'rgba(0, 0, 0, 0.3)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>เลขฐานสิบหก (Hexadecimal):</div>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                  {hexVal}
                </div>
              </div>
            </div>
          </div>

          {/* Bitwise Operations Calculator */}
          <div className="card">
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', marginBottom: 'var(--space-3)' }}>
              เครื่องคำนวณตัวดำเนินการระดับบิต (Bitwise Operator Studio)
            </h3>
            <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap', marginBottom: 'var(--space-4)' }}>
              <span>คำนวณ: <strong>{decimalVal}</strong> ({bits.join('')}₂)</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                {(['AND', 'OR', 'XOR'] as const).map((op) => (
                  <button
                    key={op}
                    className={`btn btn-sm ${bitOp === op ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setBitOp(op)}
                  >
                    {op}
                  </button>
                ))}
              </div>
              <span>กับค่า:</span>
              <input
                type="number"
                min="0"
                max="255"
                value={opOperand}
                onChange={(e) => setOpOperand(parseInt(e.target.value, 10) || 0)}
                className="form-input"
                style={{ width: '80px', padding: '4px 8px' }}
              />
              <span>= ผลลัพธ์: <strong style={{ color: 'var(--color-success)', fontSize: 'var(--text-base)' }}>{bitwiseResult}</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: HARDWARE IDENTIFICATION */}
      {activeSection === 'hardware' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-4)' }}>
          <div className="card">
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', marginBottom: 'var(--space-3)' }}>
              คลิกเลือกชิ้นส่วนฮาร์ดแวร์เพื่อดูหน้าที่และสเปก
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {Object.entries(hardwareData).map(([key, data]) => (
                <button
                  key={key}
                  className={`btn ${selectedComponent === key ? 'btn-primary' : 'btn-outline'}`}
                  style={{ justifyContent: 'flex-start', padding: '10px 14px', gap: '8px', fontSize: '13px' }}
                  onClick={() => setSelectedComponent(key)}
                >
                  <span>{data.icon}</span>
                  <span>{data.title.split('(')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="card" style={{ background: 'rgba(0, 0, 0, 0.25)' }}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>
              {hardwareData[selectedComponent].icon}
            </div>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', color: '#f1f5f9', marginBottom: '8px' }}>
              {hardwareData[selectedComponent].title}
            </h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 'var(--space-4)' }}>
              {hardwareData[selectedComponent].desc}
            </p>
            <div style={{ padding: 'var(--space-3)', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: 'var(--radius-md)', fontSize: '12px', color: '#60a5fa' }}>
              ⚙️ <strong>สเปกมาตรฐานสำหรับ ม.ปลาย:</strong> {hardwareData[selectedComponent].spec}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: SUBNETTING & PACKET FLOW */}
      {activeSection === 'subnet' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <div className="card">
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', marginBottom: 'var(--space-4)' }}>
              เครื่องคำนวณซับเน็ต IPv4 (CIDR Subnet Calculator)
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label">หมายเลข IP Address:</label>
                <input
                  type="text"
                  className="form-input"
                  value={ipAddress}
                  onChange={(e) => setIpAddress(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">คำนำหน้าซับเน็ต (CIDR Prefix): /{cidr}</label>
                <input
                  type="range"
                  min="8"
                  max="30"
                  value={cidr}
                  onChange={(e) => setCidr(parseInt(e.target.value, 10))}
                  style={{ width: '100%', marginTop: '8px' }}
                />
              </div>
            </div>

            {/* Calculations Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-3)' }}>
              <div style={{ padding: 'var(--space-3)', background: 'rgba(0, 0, 0, 0.3)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>Subnet Mask</div>
                <div style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', color: '#f1f5f9', fontFamily: 'var(--font-mono)' }}>{subnet.maskStr}</div>
              </div>
              <div style={{ padding: 'var(--space-3)', background: 'rgba(0, 0, 0, 0.3)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>จำนวนเครื่องที่ใช้งานได้ (Usable Hosts)</div>
                <div style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', color: 'var(--color-success)', fontFamily: 'var(--font-mono)' }}>{subnet.usableHosts.toLocaleString()} เครื่อง</div>
              </div>
              <div style={{ padding: 'var(--space-3)', background: 'rgba(0, 0, 0, 0.3)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>ช่วง IP สำหรับคอมพิวเตอร์</div>
                <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>{subnet.hostRange}</div>
              </div>
            </div>
          </div>

          {/* Packet Ping Flow Simulation */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <div>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold' }}>จำลองการเดินทางของแพ็กเก็ต (Packet Route Flow)</h3>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>จำลองการส่งข้อมูล ICMP Ping จากเครื่องนักเรียนไปยังเว็บเซิร์ฟเวอร์ปลายทาง</p>
              </div>
              <button
                className="btn btn-primary btn-sm"
                onClick={handleSimulatePing}
                disabled={packetState === 'sending'}
                style={{ gap: '6px' }}
              >
                <Send size={14} />
                <span>{packetState === 'sending' ? 'กำลังส่งข้อมูล...' : 'ส่ง Ping ทดสอบ'}</span>
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.3)', padding: 'var(--space-5)', borderRadius: 'var(--radius-lg)', overflowX: 'auto', gap: 'var(--space-3)' }}>
              {[
                { name: 'เครื่องนักเรียน', ip: '192.168.10.45', icon: '💻' },
                { name: 'สวิตช์ห้องแล็บ', ip: 'Layer 2 Switch', icon: '🔀' },
                { name: 'เราเตอร์โรงเรียน', ip: 'Gateway 192.168.10.1', icon: '🌐' },
                { name: 'ไฟร์วอลล์ตรวจจับ', ip: 'Cyber Firewall', icon: '🛡️' },
                { name: 'คลาวด์เซิร์ฟเวอร์', ip: '203.150.10.5', icon: '☁️' },
              ].map((node, idx) => (
                <React.Fragment key={idx}>
                  <div style={{ textAlign: 'center', minWidth: '100px' }}>
                    <div style={{ fontSize: '28px', marginBottom: '4px' }}>{node.icon}</div>
                    <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{node.name}</div>
                    <div style={{ fontSize: '10px', color: 'var(--color-text-tertiary)' }}>{node.ip}</div>
                  </div>
                  {idx < 4 && (
                    <div style={{ color: packetState === 'sending' ? 'var(--color-accent-primary)' : 'var(--color-text-tertiary)', fontSize: '18px', fontWeight: 'bold' }}>
                      →
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>

            {packetState === 'success' && (
              <div style={{ marginTop: 'var(--space-3)', padding: 'var(--space-3)', background: 'var(--color-success-muted)', borderRadius: 'var(--radius-md)', color: 'var(--color-success)', fontSize: 'var(--text-xs)', fontWeight: 'bold', textAlign: 'center' }}>
                ✅ การส่งข้อมูลสำเร็จ: 64 bytes from 203.150.10.5: icmp_seq=1 ttl=56 time=14.2 ms (0% packet loss)
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 4: SECURITY & PHISHING */}
      {activeSection === 'security' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 'var(--space-4)' }}>
          {/* Password Strength Analyzer */}
          <div className="card">
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', marginBottom: 'var(--space-2)' }}>
              🔑 ตรวจสอบความปลอดภัยรหัสผ่าน (Password Entropy)
            </h3>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
              ทดสอบความยาวและการผสมตัวอักษรเพื่อประเมินระยะเวลาในการถูกแฮก
            </p>

            <div className="form-group" style={{ marginBottom: 'var(--space-3)' }}>
              <input
                type="text"
                className="form-input"
                value={pwdInput}
                onChange={(e) => setPwdInput(e.target.value)}
                placeholder="กรอกรหัสผ่านเพื่อทดสอบ"
              />
            </div>

            <div style={{ marginBottom: 'var(--space-3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', marginBottom: '4px' }}>
                <span>ระดับความปลอดภัย: <strong style={{ color: pwdAnalysis.color }}>{pwdAnalysis.strength}</strong></span>
                <span>{pwdAnalysis.score}%</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{ width: `${pwdAnalysis.score}%`, height: '100%', background: pwdAnalysis.color, transition: 'width 0.3s' }} />
              </div>
            </div>

            <div style={{ padding: 'var(--space-3)', background: 'rgba(0, 0, 0, 0.3)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)' }}>
              ⏱️ <strong>เวลาโดยประมาณในการแคร็กด้วย Brute-Force:</strong> <span style={{ color: '#38bdf8' }}>{pwdAnalysis.crackTime}</span>
            </div>
          </div>

          {/* Phishing Warning Rules */}
          <div className="card">
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', marginBottom: 'var(--space-2)' }}>
              🎣 วิธีจับผิดอีเมลและลิงก์หลอกลวง (Phishing Detector)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
              <div>⚠️ <strong>โดเมนปลอมที่สะกดคล้ายกัน:</strong> เช่น <code>scic0m-school.ac.th</code> (เลข 0 แทนตัว O)</div>
              <div>⚠️ <strong>สร้างความตื่นตระหนก:</strong> "บัญชีของคุณจะถูกระงับใน 2 ชั่วโมง กรุณากดลิงก์นี้ทันที"</div>
              <div>⚠️ <strong>ร้องขอรหัสผ่านหรือ OTP:</strong> เจ้าหน้าที่และผู้ดูแลระบบตัวจริงจะไม่มีวันถามรหัสผ่านนักเรียน</div>
              <div>⚠️ <strong>โปรโตคอลที่ไม่ปลอดภัย:</strong> ตรวจสอบว่าเว็บไซต์มีกุญแจเขียว <code>HTTPS</code> และใบรับรองที่ถูกต้องเสมอ</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FundamentalsNetworkingLab;
