import React, { useState } from 'react';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Send,
  Mail,
  Keyboard,
  CheckCircle2,
  AlertCircle,
  FileQuestion,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HelpCenter: React.FC = () => {
  const { addNotification } = useApp();
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);

  const faqs = [
    {
      q: 'แพลตฟอร์ม Sci-Com Academy นี้เหมาะกับใครบ้าง?',
      a: 'เหมาะสำหรับนักเรียนระดับชั้น มัธยมศึกษาปีที่ 4 - 6 โดยเฉพาะนักเรียนในแผนการเรียนวิทยาศาสตร์-คอมพิวเตอร์ และห้องเรียนพิเศษด้านเทคโนโลยี รวมถึงนักเรียนทั่วไปที่ต้องการสร้างทักษะดิจิทัลภาคปฏิบัติอย่างแท้จริง',
    },
    {
      q: 'ผลงานจากห้องสร้างโปรเจกต์ (Project Studio) นำไปใส่ Portfolio ยื่นเข้ามหาวิทยาลัยได้หรือไม่?',
      a: 'สามารถนำไปใช้ได้แน่นอน ทุกโปรเจกต์บน Sci-Com Academy มีการจัดระเบียบตามมาตรฐานวิชาการ พร้อมลิงก์ซอร์สโค้ด GitHub และ Live Demo ซึ่งนักเรียนสามารถส่งออกเป็นเอกสารแฟ้มผลงานดิจิทัล (Digital Portfolio) เพื่อยื่น TCAS รอบ 1 (Portfolio) ได้อย่างมั่นใจ',
    },
    {
      q: 'จำเป็นต้องซื้อบอร์ด ESP32 จริงก่อนเริ่มเรียนคอร์ส IoT หรือไม่?',
      a: 'ไม่จำเป็นต้องมีในวันแรก ในบทเรียนเบื้องต้นจะมีแผนภาพการต่อวงจรและโค้ดตัวอย่างที่สามารถศึกษาทำความเข้าใจได้ทันที และเมื่อนักเรียนพร้อมลงมือทำจริง สามารถยืมอุปกรณ์จากห้องปฏิบัติการคอมพิวเตอร์ของโรงเรียนหรือจัดหามาทดลองได้',
    },
    {
      q: 'ระบบคะแนนประสบการณ์ (XP) และระดับชั้นคำนวณอย่างไร?',
      a: 'นักเรียนจะได้รับ XP จากกิจกรรมต่างๆ ได้แก่: เรียนจบบทเรียน (+25 XP), ทำแบบทดสอบผ่านเกณฑ์ (+25-40 XP), ทำแบบทดสอบได้คะแนนเต็ม (+50 XP), ทำภารกิจประจำวัน (+15-25 XP), และฝึกพิมพ์ดีด (+15 XP) เมื่อสะสมครบเกณฑ์จะเลื่อนระดับเลเวลโดยอัตโนมัติ',
    },
    {
      q: 'หากพบข้อผิดพลาดในบทเรียนหรือระบบแล็บ สามารถแจ้งได้อย่างไร?',
      a: 'สามารถกรอกแบบฟอร์ม "ติดต่ออาจารย์ผู้ดูแลระบบ" ด้านล่างของหน้านี้ หรือโพสต์ในกระทู้ชุมชนการเรียนรู้เพื่อให้เพื่อนๆ และอาจารย์ช่วยตรวจสอบได้ทันที',
    },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactSubject.trim() || !contactMessage.trim()) return;

    setContactSent(true);
    addNotification('success', 'ส่งข้อความถึงอาจารย์ผู้ดูแลระบบเรียบร้อยแล้ว อาจารย์จะตอบกลับทางอีเมล');
    setContactSubject('');
    setContactMessage('');
    setTimeout(() => setContactSent(false), 4000);
  };

  return (
    <div className="main-content" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: '900px' }}>
      {/* Header */}
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--space-2)' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--color-accent-primary-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-accent-primary)',
            }}
          >
            <HelpCircle size={22} />
          </div>
          <div>
            <h1 className="page-header-title">ศูนย์ช่วยเหลือและคำถามที่พบบ่อย (Help Center)</h1>
            <p className="page-header-desc">
              คู่มือการใช้งาน คำถามที่พบบ่อย และช่องทางติดต่ออาจารย์ผู้สอน
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="card">
        <h2 className="card-title" style={{ marginBottom: 'var(--space-4)' }}>
          ❓ คำถามที่พบบ่อย (Frequently Asked Questions)
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div
                key={idx}
                style={{
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  background: 'var(--color-bg-secondary)',
                }}
              >
                <div
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  style={{
                    padding: 'var(--space-4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    background: isOpen ? 'var(--color-bg-surface)' : 'transparent',
                  }}
                >
                  <span style={{ fontWeight: 'bold', fontSize: 'var(--text-sm)', color: isOpen ? 'var(--color-accent-primary)' : 'var(--color-text-primary)' }}>
                    {faq.q}
                  </span>
                  {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>

                {isOpen && (
                  <div
                    style={{
                      padding: 'var(--space-4)',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-text-secondary)',
                      lineHeight: 1.6,
                      borderTop: '1px solid var(--color-border)',
                      background: 'var(--color-bg-surface)',
                    }}
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Keyboard Shortcuts Guide */}
      <div className="card">
        <h3 className="card-title" style={{ marginBottom: 'var(--space-3)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Keyboard size={18} color="var(--color-accent-primary)" />
          <span>คีย์ลัดที่มีประโยชน์ (Keyboard Shortcuts)</span>
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-3)', fontSize: 'var(--text-xs)' }}>
          <div style={{ padding: 'var(--space-3)', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>ค้นหาหลักสูตร</span>
            <kbd style={{ background: 'var(--color-bg-surface)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--color-border)' }}>Ctrl + K</kbd>
          </div>
          <div style={{ padding: 'var(--space-3)', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>รันโค้ดในแล็บ</span>
            <kbd style={{ background: 'var(--color-bg-surface)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--color-border)' }}>Ctrl + Enter</kbd>
          </div>
          <div style={{ padding: 'var(--space-3)', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>ปิดหน้าต่าง Modal</span>
            <kbd style={{ background: 'var(--color-bg-surface)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--color-border)' }}>Esc</kbd>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="card">
        <h3 className="card-title" style={{ marginBottom: 'var(--space-2)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Mail size={18} color="var(--color-accent-primary)" />
          <span>ส่งข้อความถึงอาจารย์ผู้ดูแลหลักสูตร</span>
        </h3>
        <p className="card-subtitle" style={{ marginBottom: 'var(--space-4)' }}>
          มีคำถามเกี่ยวกับเนื้อหา หรือต้องการความช่วยเหลือเรื่องโครงงาน กรอกข้อความด้านล่างได้เลย
        </p>

        <form onSubmit={handleSendMessage} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="form-group">
            <label className="form-label">หัวข้อเรื่องที่ต้องการติดต่อ</label>
            <input
              type="text"
              className="form-input"
              placeholder="เช่น ปรึกษาเรื่องการเลือกหัวข้อโครงงาน ม.5"
              value={contactSubject}
              onChange={(e) => setContactSubject(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">รายละเอียดข้อความ</label>
            <textarea
              className="form-input"
              style={{ minHeight: '100px' }}
              placeholder="พิมพ์ข้อความของคุณที่นี่..."
              value={contactMessage}
              onChange={(e) => setContactMessage(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary" disabled={!contactSubject.trim() || !contactMessage.trim()}>
              <Send size={15} /> ส่งข้อความ
            </button>
          </div>
        </form>

        {contactSent && (
          <div style={{ marginTop: 'var(--space-3)', padding: 'var(--space-3)', background: 'var(--color-success-muted)', borderRadius: 'var(--radius-md)', color: 'var(--color-success)', fontSize: 'var(--text-xs)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={16} /> ส่งข้อความสำเร็จ! อาจารย์จะติดต่อกลับเร็วๆ นี้
          </div>
        )}
      </div>
    </div>
  );
};

export default HelpCenter;
