import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Wifi,
  Power,
  Sliders,
  Terminal,
  Activity,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Zap,
  Globe,
  Radio
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface Esp32Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'เริ่มต้น' | 'ปานกลาง' | 'ขั้นสูง';
  targetCondition: string;
  check: (state: { ledOn: boolean; temp: number; humidity: number; buttonPressed: boolean; wifiConnected: boolean }) => boolean;
}

const espChallenges: Esp32Challenge[] = [
  {
    id: 'esp-1',
    title: 'ภารกิจที่ 1: ควบคุมสถานะไฟ LED บนขา GPIO 2 (Blink)',
    difficulty: 'เริ่มต้น',
    description: 'ทดลองเปิดไฟ LED ประจำบอร์ดบนขา GPIO 2 เพื่อทดสอบการทำงานของดิจิทัลเอาต์พุต',
    targetCondition: 'เปิดไฟ LED (GPIO 2 HIGH)',
    check: (s) => s.ledOn,
  },
  {
    id: 'esp-2',
    title: 'ภารกิจที่ 2: จำลองอุณหภูมิห้องแล็บสูงเกินเกณฑ์ (Threshold Alert)',
    difficulty: 'ปานกลาง',
    description: 'ปรับค่าเซ็นเซอร์ DHT22 ให้อุณหภูมิสูงกว่า 35°C เพื่อทดสอบระบบแจ้งเตือนความร้อนบนหน้าจอ OLED',
    targetCondition: 'อุณหภูมิ > 35°C',
    check: (s) => s.temp > 35,
  },
  {
    id: 'esp-3',
    title: 'ภารกิจที่ 3: กดปุ่มภายนอก GPIO 4 เพื่อส่งสัญญาณอินพุต (Interrupt)',
    difficulty: 'ปานกลาง',
    description: 'กดสวิตช์ปุ่มกดบนขา GPIO 4 เพื่อส่งสัญญาณดิจิทัลอินพุตเข้าสู่ไมโครคอนโทรลเลอร์',
    targetCondition: 'กดปุ่ม Push Button (GPIO 4 HIGH)',
    check: (s) => s.buttonPressed,
  },
  {
    id: 'esp-4',
    title: 'ภารกิจที่ 4: เชื่อมต่อ Wi-Fi และเปิดเซิร์ฟเวอร์ควบคุมอุปกรณ์ (Web Control)',
    difficulty: 'ขั้นสูง',
    description: 'เปิดใช้งานการเชื่อมต่อ Wi-Fi ของ ESP32 เพื่อรับ IP Address และเริ่มโหมด Web Server',
    targetCondition: 'เชื่อมต่อ Wi-Fi สำเร็จ (Wi-Fi Connected)',
    check: (s) => s.wifiConnected,
  },
];

interface Esp32LabProps {
  onBack?: () => void;
}

export const Esp32Lab: React.FC<Esp32LabProps> = ({ onBack }) => {
  const { saveLabExercise, isLabExerciseCompleted, addNotification } = useApp();

  // Hardware Simulation State
  const [ledOn, setLedOn] = useState(false);
  const [blinkInterval, setBlinkInterval] = useState<number>(1000);
  const [isBlinking, setIsBlinking] = useState(false);
  const [temperature, setTemperature] = useState(28.5);
  const [humidity, setHumidity] = useState(62);
  const [buttonPressed, setButtonPressed] = useState(false);
  const [wifiConnected, setWifiConnected] = useState(false);
  const [webRelayState, setWebRelayState] = useState(false);

  // Serial Monitor Output
  const [serialLogs, setSerialLogs] = useState<string[]>([
    '[00:00:01] ESP-ROM: esp32-rev1 (240MHz Dual Core)',
    '[00:00:02] Booting Sci-Com Academy IoT Firmware v2.6...',
    '[00:00:03] GPIO 2 configured as OUTPUT',
    '[00:00:03] GPIO 4 configured as INPUT_PULLDOWN',
    '[00:00:04] DHT22 sensor initialized on GPIO 15',
    '[00:00:05] I2C OLED SSD1306 initialized (0x3C)',
  ]);

  const [activeChallengeIdx, setActiveChallengeIdx] = useState<number | null>(0);
  const [challengePassed, setChallengePassed] = useState<boolean | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Auto blink effect
  useEffect(() => {
    let interval: any = null;
    if (isBlinking) {
      interval = setInterval(() => {
        setLedOn((prev) => !prev);
      }, blinkInterval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isBlinking, blinkInterval]);

  // Serial logging helper
  const addSerialLog = (msg: string) => {
    const time = new Date().toTimeString().split(' ')[0];
    setSerialLogs((prev) => [...prev.slice(-40), `[${time}] ${msg}`]);
  };

  // Toggle LED manually
  const handleToggleLed = () => {
    const next = !ledOn;
    setLedOn(next);
    addSerialLog(`GPIO 2 digital write: ${next ? 'HIGH (1)' : 'LOW (0)'}`);
  };

  // Button click
  const handlePressButton = () => {
    setButtonPressed(true);
    addSerialLog('INTERRUPT: Button pressed on GPIO 4 (PULL-DOWN triggered)');
    setTimeout(() => {
      setButtonPressed(false);
      addSerialLog('GPIO 4 returned to LOW');
    }, 1500);
  };

  // Toggle Wi-Fi
  const handleToggleWifi = () => {
    const next = !wifiConnected;
    setWifiConnected(next);
    if (next) {
      addSerialLog('Wi-Fi connecting to SSID "SciCom-Campus-IoT"...');
      setTimeout(() => {
        addSerialLog('Wi-Fi Connected! IP: 192.168.1.184 (RSSI: -58dBm)');
        addSerialLog('HTTP Web Server listening on port 80');
      }, 800);
    } else {
      addSerialLog('Wi-Fi disconnected');
    }
  };

  // Evaluate challenge condition
  const handleEvaluateChallenge = () => {
    if (activeChallengeIdx === null) return;
    const c = espChallenges[activeChallengeIdx];
    const passed = c.check({
      ledOn,
      temp: temperature,
      humidity,
      buttonPressed,
      wifiConnected,
    });
    setChallengePassed(passed);

    if (passed) {
      saveLabExercise('esp32', c.id, true, 45);
      addNotification('success', `ยินดีด้วย! ผ่าน "${c.title}" (+45 XP บันทึกในระบบเรียบร้อย)`);
    } else {
      addNotification('warning', `เงื่อนไขยังไม่สำเร็จ: ต้องการ "${c.targetCondition}"`);
    }
  };

  const sampleArduinoCode = `// ============================================
// Sci-Com Academy — ESP32 Smart IoT Controller
// ============================================
#include <WiFi.h>
#include <DHT.h>
#include <Wire.h>
#include <Adafruit_SSD1306.h>

#define LED_PIN 2       // Onboard Blue LED
#define BUTTON_PIN 4    // Push button with pull-down
#define DHT_PIN 15      // DHT22 data pin
#define DHT_TYPE DHT22

DHT dht(DHT_PIN, DHT_TYPE);
Adafruit_SSD1306 display(128, 64, &Wire, -1);

const char* ssid = "SciCom-Campus-IoT";
const char* password = "science-computer";
WiFiServer server(80);

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  pinMode(BUTTON_PIN, INPUT_PULLDOWN);
  dht.begin();
  
  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\\nWi-Fi Connected! IP: " + WiFi.localIP().toString());
  server.begin();
}

void loop() {
  float temp = dht.readTemperature();
  float hum = dht.readHumidity();
  
  // Print sensor data every 2 seconds
  Serial.printf("Temp: %.1f C, Humidity: %.1f %%\\n", temp, hum);
  
  // Button interrupt check
  if (digitalRead(BUTTON_PIN) == HIGH) {
    digitalWrite(LED_PIN, !digitalRead(LED_PIN));
    delay(300); // Debounce
  }
  
  delay(2000);
}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Top Banner Card */}
      <div className="card" style={{ padding: 'var(--space-4) var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
          <div>
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Cpu color="#f59e0b" /> สมองกลฝังตัวและไอโอที (ESP32 & IoT Hardware Lab)
            </h2>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
              เรียนรู้ไมโครคอนโทรลเลอร์ ESP32 จำลองการต่อวงจรดิจิทัล I/O เซ็นเซอร์ DHT22 จอ OLED และเว็บเซิร์ฟเวอร์ IoT
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span className="badge badge-amber" style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Zap size={12} /> Hardware Simulation Engine Active
            </span>
            <button
              className="btn btn-primary btn-sm"
              onClick={handleEvaluateChallenge}
              style={{ gap: '6px' }}
            >
              <CheckCircle2 size={14} /> ตรวจสอบภารกิจ (Evaluate)
            </button>
          </div>
        </div>

        {/* Challenge Badges */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--color-text-tertiary)' }}>
            🎯 ภารกิจ IoT:
          </span>
          {espChallenges.map((c, idx) => {
            const isCompleted = isLabExerciseCompleted('esp32', c.id);
            const isSelected = activeChallengeIdx === idx;
            return (
              <button
                key={c.id}
                className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-outline'}`}
                style={{ fontSize: '12px', padding: '4px 10px', gap: '6px' }}
                onClick={() => {
                  setActiveChallengeIdx(idx);
                  setChallengePassed(null);
                }}
              >
                {isCompleted && <CheckCircle2 size={13} color="var(--color-success)" />}
                <span>ข้อ {idx + 1}: {c.title.split('(')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Challenge Alert & Criteria */}
      {activeChallengeIdx !== null && (
        <div
          className="card"
          style={{
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            padding: 'var(--space-4) var(--space-5)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                <span className="badge badge-amber">{espChallenges[activeChallengeIdx].difficulty}</span>
                <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold' }}>
                  {espChallenges[activeChallengeIdx].title}
                </h3>
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                {espChallenges[activeChallengeIdx].description} (เป้าหมาย: <strong style={{ color: '#fbbf24' }}>{espChallenges[activeChallengeIdx].targetCondition}</strong>)
              </p>
            </div>
            <button className="btn btn-primary btn-sm" onClick={handleEvaluateChallenge}>
              ส่งตรวจคำตอบ
            </button>
          </div>

          {challengePassed !== null && (
            <div
              style={{
                marginTop: 'var(--space-3)',
                padding: 'var(--space-2) var(--space-3)',
                borderRadius: 'var(--radius-md)',
                background: challengePassed ? 'var(--color-success-muted)' : 'var(--color-error-muted)',
                color: challengePassed ? 'var(--color-success)' : 'var(--color-error)',
                fontSize: 'var(--text-xs)',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {challengePassed ? <CheckCircle2 size={15} /> : <AlertTriangle size={15} />}
              <span>{challengePassed ? 'ยินดีด้วย! ผ่านเงื่อนไขภารกิจนี้สำเร็จ (+45 XP)' : 'ยังไม่ผ่านเงื่อนไข กรุณาปรับแต่งวงจรหรืออุปกรณ์ให้ตรงกับเป้าหมาย'}</span>
            </div>
          )}
        </div>
      )}

      {/* Main Interactive Breadboard & Circuit Simulator */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: 'var(--space-4)' }}>
        {/* Left: Virtual Hardware Simulation Workspace */}
        <div className="card" style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', background: '#090e1a' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Cpu size={16} color="#f59e0b" /> แผงทดลองวงจรเสมือน (Interactive Breadboard)
            </span>
            <span className="badge badge-emerald" style={{ fontSize: '10px' }}>● 3.3V DC POWER ON</span>
          </div>

          {/* Interactive Hardware Blocks Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
            {/* 1. Onboard Blue LED (GPIO 2) */}
            <div style={{ padding: 'var(--space-3)', background: 'rgba(255, 255, 255, 0.04)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
                ขา GPIO 2 (Onboard Blue LED)
              </div>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: ledOn ? '#3b82f6' : '#1e293b',
                  boxShadow: ledOn ? '0 0 25px #3b82f6, inset 0 0 10px #ffffff' : 'none',
                  border: ledOn ? '2px solid #60a5fa' : '2px solid #334155',
                  margin: '0 auto 12px',
                  transition: 'all 0.15s ease',
                }}
              />
              <button
                className={`btn btn-sm ${ledOn ? 'btn-primary' : 'btn-outline'}`}
                style={{ width: '100%', fontSize: '12px' }}
                onClick={handleToggleLed}
              >
                {ledOn ? 'ปิด LED (LOW)' : 'เปิด LED (HIGH)'}
              </button>
            </div>

            {/* 2. External Push Button (GPIO 4) */}
            <div style={{ padding: 'var(--space-3)', background: 'rgba(255, 255, 255, 0.04)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
                ขา GPIO 4 (Push Button Switch)
              </div>
              <button
                onMouseDown={handlePressButton}
                className={`btn btn-sm ${buttonPressed ? 'btn-primary' : 'btn-outline'}`}
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  margin: '0 auto 8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: buttonPressed ? '#10b981' : '#1e293b',
                  boxShadow: buttonPressed ? '0 0 15px #10b981' : 'none',
                }}
              >
                <Power size={22} />
              </button>
              <div style={{ fontSize: '11px', color: buttonPressed ? 'var(--color-success)' : 'var(--color-text-tertiary)' }}>
                {buttonPressed ? 'PRESSED (HIGH)' : 'RELEASED (LOW)'}
              </div>
            </div>
          </div>

          {/* 3. DHT22 Environmental Sensor Sliders */}
          <div style={{ padding: 'var(--space-4)', background: 'rgba(255, 255, 255, 0.04)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
            <div style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)', display: 'flex', justifyContent: 'space-between' }}>
              <span>🌡️ เซ็นเซอร์ DHT22 (ขา GPIO 15)</span>
              <span style={{ color: temperature > 35 ? 'var(--color-error)' : 'var(--color-success)' }}>
                {temperature > 35 ? '⚠️ ความร้อนเกินเกณฑ์' : '● ปกติ'}
              </span>
            </div>

            {/* Temp Slider */}
            <div style={{ marginBottom: 'var(--space-3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', marginBottom: '4px' }}>
                <span>อุณหภูมิ (Temperature):</span>
                <strong style={{ color: '#38bdf8' }}>{temperature.toFixed(1)} °C</strong>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="0.5"
                value={temperature}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setTemperature(val);
                  addSerialLog(`DHT22 Temp update: ${val.toFixed(1)} °C`);
                }}
                style={{ width: '100%' }}
              />
            </div>

            {/* Humidity Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', marginBottom: '4px' }}>
                <span>ความชื้นสัมพัทธ์ (Humidity):</span>
                <strong style={{ color: '#a78bfa' }}>{humidity}% RH</strong>
              </div>
              <input
                type="range"
                min="20"
                max="95"
                value={humidity}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setHumidity(val);
                  addSerialLog(`DHT22 Humidity update: ${val}%`);
                }}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* 4. Virtual I2C OLED Display (128x64) */}
          <div style={{ padding: 'var(--space-3)', background: 'rgba(255, 255, 255, 0.04)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
              📺 จอแสดงผลกราฟฟิก I2C OLED (SSD1306 128x64 ขา SDA: 21, SCL: 22)
            </div>
            <div
              style={{
                background: '#000000',
                border: '2px solid #334155',
                borderRadius: 'var(--radius-md)',
                padding: '12px',
                fontFamily: 'var(--font-mono)',
                color: '#38bdf8',
                fontSize: '11px',
                lineHeight: 1.5,
                boxShadow: '0 0 10px rgba(56, 189, 248, 0.2)',
              }}
            >
              <div style={{ borderBottom: '1px dashed #334155', paddingBottom: '4px', marginBottom: '6px', display: 'flex', justifyContent: 'space-between' }}>
                <span>SCI-COM IOT NODE</span>
                <span>{wifiConnected ? 'WIFI:OK' : 'OFFLINE'}</span>
              </div>
              <div>TEMP : {temperature.toFixed(1)} C {temperature > 35 ? '[HIGH!]' : '[NORMAL]'}</div>
              <div>HUMI : {humidity} %RH</div>
              <div>LED  : {ledOn ? 'ON' : 'OFF'} | BTN : {buttonPressed ? 'HIGH' : 'LOW'}</div>
            </div>
          </div>
        </div>

        {/* Right: Serial Monitor & Wi-Fi IoT Web Server */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* Serial Monitor */}
          <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '240px', background: '#050811' }}>
            <div style={{ padding: '8px 14px', background: 'rgba(10, 15, 29, 0.95)', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
              <span style={{ color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>📟 Serial Monitor (COM3, 115200 Baud)</span>
              <button
                className="btn btn-ghost btn-sm"
                style={{ fontSize: '10px', padding: 0 }}
                onClick={() => setSerialLogs([])}
              >
                ล้างหน้าจอ
              </button>
            </div>
            <div style={{ flex: 1, padding: '10px 14px', overflowY: 'auto', fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#94a3b8', lineHeight: 1.5 }}>
              {serialLogs.map((log, idx) => (
                <div key={idx}>{log}</div>
              ))}
            </div>
          </div>

          {/* Wi-Fi IoT Web Server Controller Simulator */}
          <div className="card" style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Globe size={16} color="#3b82f6" /> ระบบควบคุมอุปกรณ์ผ่านเว็บ (IoT Web Server)
              </div>
              <button
                className={`btn btn-sm ${wifiConnected ? 'btn-primary' : 'btn-outline'}`}
                style={{ fontSize: '11px' }}
                onClick={handleToggleWifi}
              >
                {wifiConnected ? 'ตัดการเชื่อมต่อ Wi-Fi' : 'เชื่อมต่อ Wi-Fi (Connect)'}
              </button>
            </div>

            {wifiConnected ? (
              <div style={{ padding: 'var(--space-3)', background: 'rgba(0, 0, 0, 0.3)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
                  🌐 เบราว์เซอร์เสมือน: <strong>http://192.168.1.184/</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0a0f1d', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ fontSize: '12px' }}>สวิตช์รีเลย์ควบคุมอุปกรณ์ไฟฟ้า:</span>
                  <button
                    className={`btn btn-sm ${webRelayState ? 'btn-primary' : 'btn-outline'}`}
                    style={{ fontSize: '11px' }}
                    onClick={() => {
                      const next = !webRelayState;
                      setWebRelayState(next);
                      addSerialLog(`HTTP GET /relay/${next ? 'on' : 'off'} -> Relay is ${next ? 'ON' : 'OFF'}`);
                    }}
                  >
                    {webRelayState ? 'เปิดอยู่ (ON)' : 'ปิดอยู่ (OFF)'}
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: 'var(--space-4)', color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)' }}>
                กดปุ่ม "เชื่อมต่อ Wi-Fi" ด้านบนเพื่อเริ่มการทำงานของเซิร์ฟเวอร์ควบคุม IoT
              </div>
            )}
          </div>

          {/* Arduino C++ Source Code Preview */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '8px 14px', background: 'rgba(10, 15, 29, 0.95)', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
              <span>💻 โค้ดตัวอย่าง Arduino C++ (firmware.ino)</span>
              <button
                className="btn btn-ghost btn-sm"
                style={{ fontSize: '11px', gap: '4px' }}
                onClick={() => {
                  navigator.clipboard.writeText(sampleArduinoCode);
                  setCopiedCode(true);
                  setTimeout(() => setCopiedCode(false), 2000);
                  addNotification('info', 'คัดลอกโค้ด Arduino ไปยังคลิปบอร์ดแล้ว');
                }}
              >
                {copiedCode ? <Check size={12} color="var(--color-success)" /> : <Copy size={12} />}
                <span>{copiedCode ? 'คัดลอกแล้ว' : 'คัดลอกโค้ด'}</span>
              </button>
            </div>
            <pre style={{ margin: 0, padding: '12px', background: '#070b14', color: '#94a3b8', fontSize: '11px', fontFamily: 'var(--font-mono)', maxHeight: '180px', overflowY: 'auto' }}>
              {sampleArduinoCode}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Esp32Lab;
