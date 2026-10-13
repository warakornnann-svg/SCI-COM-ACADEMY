// ============================================
// SCI-COM ACADEMY — Course Catalog Data
// Real Thai educational content
// ============================================

import type { CourseCategory, Course, LearningPath, Achievement, DailyChallenge, Project } from '../types';

// --- Course Categories ---
export const courseCategories: CourseCategory[] = [
  {
    id: 'computer-fundamentals',
    name: 'พื้นฐานคอมพิวเตอร์',
    nameEn: 'Computer Fundamentals',
    icon: 'Monitor',
    description: 'เรียนรู้หลักการทำงานของคอมพิวเตอร์ ฮาร์ดแวร์ ซอฟต์แวร์ และระบบปฏิบัติการ',
    color: '#3b82f6',
    courseCount: 2,
  },
  {
    id: 'typing-digital',
    name: 'พิมพ์ดีดและทักษะดิจิทัล',
    nameEn: 'Typing & Digital Skills',
    icon: 'Keyboard',
    description: 'ฝึกทักษะการพิมพ์สัมผัสทั้งภาษาไทยและอังกฤษ พร้อมทักษะดิจิทัลพื้นฐาน',
    color: '#10b981',
    courseCount: 1,
  },
  {
    id: 'programming',
    name: 'พื้นฐานการเขียนโปรแกรม',
    nameEn: 'Programming Fundamentals',
    icon: 'Code2',
    description: 'เรียนรู้หลักคิดเชิงคำนวณ อัลกอริทึม และเริ่มต้นเขียนโปรแกรม',
    color: '#8b5cf6',
    courseCount: 1,
  },
  {
    id: 'web-development',
    name: 'พัฒนาเว็บไซต์',
    nameEn: 'Web Development',
    icon: 'Globe',
    description: 'สร้างเว็บไซต์ด้วย HTML, CSS และ JavaScript ตั้งแต่พื้นฐานจนถึงขั้นสูง',
    color: '#f59e0b',
    courseCount: 3,
  },
  {
    id: 'cpp-programming',
    name: 'เขียนโปรแกรมภาษา C++',
    nameEn: 'C++ Programming',
    icon: 'Terminal',
    description: 'เขียนโปรแกรมภาษา C++ ตั้งแต่พื้นฐาน ตัวแปร ฟังก์ชัน จนถึง OOP',
    color: '#06b6d4',
    courseCount: 1,
  },
  {
    id: 'esp32-iot',
    name: 'ESP32 และ IoT',
    nameEn: 'ESP32 & IoT',
    icon: 'Cpu',
    description: 'เรียนรู้อิเล็กทรอนิกส์ เซ็นเซอร์ และสร้างโปรเจกต์ IoT ด้วย ESP32',
    color: '#ef4444',
    courseCount: 1,
  },
  {
    id: 'database',
    name: 'ฐานข้อมูลสำหรับเว็บ',
    nameEn: 'Database for Web',
    icon: 'Database',
    description: 'เรียนรู้ฐานข้อมูล SQL การออกแบบตาราง และ CRUD Application',
    color: '#ec4899',
    courseCount: 1,
  },
  {
    id: 'ms-office',
    name: 'Microsoft Office',
    nameEn: 'Microsoft Office',
    icon: 'FileSpreadsheet',
    description: 'ใช้งาน Word, Excel และ PowerPoint อย่างมืออาชีพ',
    color: '#14b8a6',
    courseCount: 3,
  },
  {
    id: 'graphic-design',
    name: 'ออกแบบกราฟิกและ UI/UX',
    nameEn: 'Graphic Design & UI/UX',
    icon: 'Palette',
    description: 'เรียนรู้หลักการออกแบบ สีสัน Typography และการออกแบบ UI/UX',
    color: '#f97316',
    courseCount: 1,
  },
  {
    id: 'photography',
    name: 'การถ่ายภาพ',
    nameEn: 'Photography',
    icon: 'Camera',
    description: 'เรียนรู้เทคนิคการถ่ายภาพ Exposure Triangle การจัดองค์ประกอบ และการตกแต่งภาพ',
    color: '#a855f7',
    courseCount: 1,
  },
  {
    id: 'video-production',
    name: 'การผลิตวิดีโอ',
    nameEn: 'Video Production',
    icon: 'Video',
    description: 'สร้างวิดีโอตั้งแต่เขียนบท ถ่ายทำ ตัดต่อ จนถึงส่งออกผลงาน',
    color: '#e11d48',
    courseCount: 1,
  },
  {
    id: 'networking',
    name: 'เครือข่ายและความปลอดภัย',
    nameEn: 'Networking & Cybersecurity',
    icon: 'Wifi',
    description: 'เรียนรู้ระบบเครือข่าย IP Address, TCP/IP และความปลอดภัยไซเบอร์',
    color: '#0ea5e9',
    courseCount: 1,
  },
  {
    id: 'ai-innovation',
    name: 'AI และนวัตกรรมดิจิทัล',
    nameEn: 'AI & Digital Innovation',
    icon: 'Sparkles',
    description: 'เข้าใจ AI, Generative AI, Prompt Engineering และการใช้ AI อย่างรับผิดชอบ',
    color: '#6366f1',
    courseCount: 1,
  },
];

// --- Courses with Full Content ---
export const courses: Course[] = [
  // ====== COMPUTER FUNDAMENTALS ======
  {
    id: 'comp-fund-101',
    categoryId: 'computer-fundamentals',
    title: 'รู้จักคอมพิวเตอร์',
    titleEn: 'Introduction to Computers',
    description: 'เรียนรู้หลักการทำงานของคอมพิวเตอร์ ส่วนประกอบฮาร์ดแวร์และซอฟต์แวร์ ระบบเลขฐาน และการดูแลรักษาคอมพิวเตอร์',
    icon: 'Monitor',
    level: 'ม.4',
    difficulty: 'เริ่มต้น',
    estimatedHours: 12,
    prerequisites: [],
    objectives: [
      'อธิบายหลักการทำงานของคอมพิวเตอร์ได้',
      'ระบุส่วนประกอบของฮาร์ดแวร์และหน้าที่ของแต่ละชิ้นส่วน',
      'เข้าใจความแตกต่างระหว่างซอฟต์แวร์ระบบและซอฟต์แวร์ประยุกต์',
      'แปลงเลขฐานสอง ฐานสิบ และฐานสิบหกได้',
      'แก้ไขปัญหาคอมพิวเตอร์เบื้องต้นได้',
    ],
    tags: ['คอมพิวเตอร์', 'ฮาร์ดแวร์', 'ซอฟต์แวร์', 'เลขฐาน'],
    status: 'published',
    modules: [
      {
        id: 'mod-comp-1',
        courseId: 'comp-fund-101',
        title: 'คอมพิวเตอร์คืออะไร',
        description: 'ทำความรู้จักกับคอมพิวเตอร์ ประวัติความเป็นมา และประเภทของคอมพิวเตอร์',
        order: 1,
        lessons: [
          {
            id: 'les-comp-1-1',
            moduleId: 'mod-comp-1',
            courseId: 'comp-fund-101',
            title: 'คอมพิวเตอร์คืออะไร?',
            type: 'reading',
            estimatedMinutes: 15,
            order: 1,
            status: 'published',
            content: {
              sections: [
                { type: 'heading', content: '🖥️ คอมพิวเตอร์คืออะไร?' },
                { type: 'text', content: 'คอมพิวเตอร์ (Computer) คือเครื่องมืออิเล็กทรอนิกส์ที่สามารถรับข้อมูล (Input) ประมวลผล (Process) จัดเก็บข้อมูล (Storage) และแสดงผลลัพธ์ (Output) ตามคำสั่งที่กำหนดไว้ล่วงหน้า' },
                { type: 'callout', content: 'คำว่า "Computer" มาจากภาษาละตินว่า "Computare" ซึ่งหมายถึง "การคำนวณ" ในอดีตคอมพิวเตอร์หมายถึงคนที่ทำหน้าที่คำนวณ!', variant: 'info' },
                { type: 'heading', content: 'วงจรการทำงานของคอมพิวเตอร์ (IPOS Cycle)' },
                { type: 'text', content: 'คอมพิวเตอร์ทำงานตามวงจร 4 ขั้นตอน ที่เรียกว่า IPOS Cycle:' },
                { type: 'list', content: '', items: [
                  'Input (รับข้อมูล) — รับข้อมูลจากผู้ใช้ผ่านอุปกรณ์อินพุต เช่น คีย์บอร์ด เมาส์ ไมโครโฟน กล้อง สแกนเนอร์',
                  'Process (ประมวลผล) — CPU ประมวลผลข้อมูลตามคำสั่งโปรแกรม เช่น การคำนวณ เปรียบเทียบ จัดเรียง',
                  'Output (แสดงผล) — แสดงผลลัพธ์ผ่านอุปกรณ์เอาต์พุต เช่น จอภาพ ลำโพง เครื่องพิมพ์',
                  'Storage (จัดเก็บ) — บันทึกข้อมูลเพื่อใช้งานในอนาคต เช่น ฮาร์ดดิสก์ SSD แฟลชไดรฟ์',
                ] },
                { type: 'callout', content: 'ลองนึกถึงตัวอย่าง: เมื่อพิมพ์ข้อความ (Input) → คอมพิวเตอร์ประมวลผลตัวอักษร (Process) → แสดงตัวอักษรบนจอ (Output) → บันทึกไฟล์ (Storage)', variant: 'tip' },
                { type: 'heading', content: 'ประเภทของคอมพิวเตอร์' },
                { type: 'list', content: '', items: [
                  'ซูเปอร์คอมพิวเตอร์ (Supercomputer) — คอมพิวเตอร์ที่มีประสิทธิภาพสูงสุด ใช้ในงานวิจัยวิทยาศาสตร์ พยากรณ์อากาศ',
                  'เมนเฟรม (Mainframe) — คอมพิวเตอร์ขนาดใหญ่ รองรับผู้ใช้พร้อมกันหลายพันคน ใช้ในธนาคาร สายการบิน',
                  'เซิร์ฟเวอร์ (Server) — คอมพิวเตอร์ที่ให้บริการแก่คอมพิวเตอร์อื่นในเครือข่าย',
                  'คอมพิวเตอร์ส่วนบุคคล (PC) — เดสก์ท็อปและแล็ปท็อปที่ใช้งานทั่วไป',
                  'แท็บเล็ตและสมาร์ทโฟน — คอมพิวเตอร์พกพาแบบหน้าจอสัมผัส',
                  'สมองกลฝังตัว (Embedded System) — คอมพิวเตอร์ขนาดเล็กที่ฝังอยู่ในอุปกรณ์ เช่น เครื่องซักผ้า รถยนต์ ESP32',
                ] },
              ],
              quiz: {
                id: 'quiz-comp-1-1',
                title: 'ทดสอบความเข้าใจ: คอมพิวเตอร์คืออะไร',
                description: 'ตอบคำถามเพื่อทดสอบความเข้าใจเกี่ยวกับพื้นฐานคอมพิวเตอร์',
                passingScore: 60,
                questions: [
                  {
                    id: 'q1-comp-1',
                    question: 'IPOS ย่อมาจากอะไร?',
                    type: 'multiple-choice',
                    options: [
                      { id: 'a', text: 'Input, Process, Output, Storage', isCorrect: true },
                      { id: 'b', text: 'Internet, Program, Output, System', isCorrect: false },
                      { id: 'c', text: 'Input, Print, Open, Save', isCorrect: false },
                      { id: 'd', text: 'Install, Process, Operate, Setup', isCorrect: false },
                    ],
                    explanation: 'IPOS Cycle คือ Input (รับข้อมูล), Process (ประมวลผล), Output (แสดงผล), Storage (จัดเก็บ) ซึ่งเป็นวงจรการทำงานพื้นฐานของคอมพิวเตอร์',
                    points: 10,
                  },
                  {
                    id: 'q2-comp-1',
                    question: 'อุปกรณ์ใดเป็นอุปกรณ์อินพุต (Input)?',
                    type: 'multiple-choice',
                    options: [
                      { id: 'a', text: 'จอภาพ', isCorrect: false },
                      { id: 'b', text: 'เครื่องพิมพ์', isCorrect: false },
                      { id: 'c', text: 'คีย์บอร์ด', isCorrect: true },
                      { id: 'd', text: 'ลำโพง', isCorrect: false },
                    ],
                    explanation: 'คีย์บอร์ดเป็นอุปกรณ์อินพุตที่ใช้รับข้อมูลจากผู้ใช้ ส่วนจอภาพ เครื่องพิมพ์ และลำโพงเป็นอุปกรณ์เอาต์พุต',
                    points: 10,
                  },
                  {
                    id: 'q3-comp-1',
                    question: 'คอมพิวเตอร์ประเภทใดมีประสิทธิภาพสูงสุด?',
                    type: 'multiple-choice',
                    options: [
                      { id: 'a', text: 'แล็ปท็อป', isCorrect: false },
                      { id: 'b', text: 'เมนเฟรม', isCorrect: false },
                      { id: 'c', text: 'ซูเปอร์คอมพิวเตอร์', isCorrect: true },
                      { id: 'd', text: 'เซิร์ฟเวอร์', isCorrect: false },
                    ],
                    explanation: 'ซูเปอร์คอมพิวเตอร์ (Supercomputer) เป็นคอมพิวเตอร์ที่มีประสิทธิภาพสูงสุด ใช้ในงานคำนวณที่ต้องการพลังประมวลผลมหาศาล',
                    points: 10,
                  },
                ],
              },
            },
          },
          {
            id: 'les-comp-1-2',
            moduleId: 'mod-comp-1',
            courseId: 'comp-fund-101',
            title: 'ฮาร์ดแวร์คอมพิวเตอร์',
            type: 'reading',
            estimatedMinutes: 20,
            order: 2,
            status: 'published',
            content: {
              sections: [
                { type: 'heading', content: '🔧 ฮาร์ดแวร์คอมพิวเตอร์' },
                { type: 'text', content: 'ฮาร์ดแวร์ (Hardware) คือส่วนที่เป็นวัตถุจับต้องได้ของคอมพิวเตอร์ ประกอบด้วยชิ้นส่วนหลายอย่างที่ทำงานร่วมกัน' },
                { type: 'heading', content: 'CPU — หน่วยประมวลผลกลาง' },
                { type: 'text', content: 'CPU (Central Processing Unit) เปรียบเสมือนสมองของคอมพิวเตอร์ ทำหน้าที่ประมวลผลคำสั่งทั้งหมด ความเร็วของ CPU วัดเป็นหน่วย GHz (กิกะเฮิรตซ์) ผู้ผลิตหลักคือ Intel และ AMD' },
                { type: 'callout', content: 'CPU สมัยใหม่มีหลาย Core เช่น 4 Core, 8 Core ยิ่งมี Core มาก ยิ่งทำงานหลายอย่างพร้อมกันได้ดี เหมือนมีคนทำงาน 8 คน แทนที่จะมีคนเดียว', variant: 'tip' },
                { type: 'heading', content: 'GPU — หน่วยประมวลผลกราฟิก' },
                { type: 'text', content: 'GPU (Graphics Processing Unit) เป็นชิปที่ออกแบบมาเพื่อประมวลผลภาพและกราฟิก ปัจจุบันใช้ในงาน AI, Machine Learning และเล่นเกมอีกด้วย ผู้ผลิตหลักคือ NVIDIA และ AMD' },
                { type: 'heading', content: 'RAM — หน่วยความจำชั่วคราว' },
                { type: 'text', content: 'RAM (Random Access Memory) เป็นหน่วยความจำที่เก็บข้อมูลชั่วคราวขณะใช้งาน เมื่อปิดเครื่อง ข้อมูลใน RAM จะหายไป ยิ่ง RAM มากยิ่งเปิดโปรแกรมได้หลายตัวพร้อมกัน' },
                { type: 'callout', content: 'RAM เปรียบเหมือนโต๊ะทำงาน — โต๊ะกว้างก็วางเอกสารได้มาก ส่วนฮาร์ดดิสก์เปรียบเหมือนตู้เก็บเอกสาร', variant: 'info' },
                { type: 'heading', content: 'อุปกรณ์จัดเก็บข้อมูล' },
                { type: 'list', content: '', items: [
                  'HDD (Hard Disk Drive) — ใช้จานแม่เหล็กหมุนในการอ่าน/เขียนข้อมูล ราคาถูก ความจุสูง แต่ช้ากว่า SSD',
                  'SSD (Solid State Drive) — ใช้ชิปหน่วยความจำ Flash เร็วกว่า HDD มาก ไม่มีชิ้นส่วนเคลื่อนที่ ทนทานกว่า',
                  'NVMe SSD — SSD แบบเชื่อมต่อผ่าน PCIe เร็วกว่า SATA SSD หลายเท่า',
                ] },
                { type: 'heading', content: 'เมนบอร์ด (Motherboard)' },
                { type: 'text', content: 'เมนบอร์ดเป็นแผงวงจรหลักที่เชื่อมต่อทุกชิ้นส่วนเข้าด้วยกัน มี Slot สำหรับ CPU, RAM, การ์ดจอ และ Port ต่างๆ เช่น USB, HDMI, Ethernet' },
                { type: 'heading', content: 'พาวเวอร์ซัพพลาย (PSU)' },
                { type: 'text', content: 'PSU (Power Supply Unit) ทำหน้าที่แปลงไฟ AC จากปลั๊กบ้านเป็นไฟ DC ที่คอมพิวเตอร์ใช้ได้ ต้องเลือกขนาดวัตต์ให้เพียงพอกับชิ้นส่วนทั้งหมด' },
              ],
              quiz: {
                id: 'quiz-comp-1-2',
                title: 'ทดสอบความเข้าใจ: ฮาร์ดแวร์คอมพิวเตอร์',
                description: 'ทดสอบความรู้เกี่ยวกับส่วนประกอบฮาร์ดแวร์',
                passingScore: 60,
                questions: [
                  {
                    id: 'q1-comp-2',
                    question: 'ส่วนประกอบใดเปรียบเหมือนสมองของคอมพิวเตอร์?',
                    type: 'multiple-choice',
                    options: [
                      { id: 'a', text: 'RAM', isCorrect: false },
                      { id: 'b', text: 'CPU', isCorrect: true },
                      { id: 'c', text: 'GPU', isCorrect: false },
                      { id: 'd', text: 'SSD', isCorrect: false },
                    ],
                    explanation: 'CPU (Central Processing Unit) เปรียบเสมือนสมองของคอมพิวเตอร์ ทำหน้าที่ประมวลผลคำสั่งทั้งหมด',
                    points: 10,
                  },
                  {
                    id: 'q2-comp-2',
                    question: 'ข้อใดกล่าวถูกต้องเกี่ยวกับ RAM?',
                    type: 'multiple-choice',
                    options: [
                      { id: 'a', text: 'เก็บข้อมูลถาวร ปิดเครื่องข้อมูลไม่หาย', isCorrect: false },
                      { id: 'b', text: 'เก็บข้อมูลชั่วคราว ปิดเครื่องข้อมูลหายไป', isCorrect: true },
                      { id: 'c', text: 'ทำหน้าที่แปลงไฟฟ้า', isCorrect: false },
                      { id: 'd', text: 'ใช้ประมวลผลภาพกราฟิก', isCorrect: false },
                    ],
                    explanation: 'RAM เป็นหน่วยความจำชั่วคราว (Volatile Memory) ข้อมูลจะหายไปเมื่อปิดเครื่อง',
                    points: 10,
                  },
                ],
              },
            },
          },
          {
            id: 'les-comp-1-3',
            moduleId: 'mod-comp-1',
            courseId: 'comp-fund-101',
            title: 'ซอฟต์แวร์และระบบปฏิบัติการ',
            type: 'reading',
            estimatedMinutes: 15,
            order: 3,
            status: 'published',
            content: {
              sections: [
                { type: 'heading', content: '💿 ซอฟต์แวร์และระบบปฏิบัติการ' },
                { type: 'text', content: 'ซอฟต์แวร์ (Software) คือชุดคำสั่งหรือโปรแกรมที่สั่งให้ฮาร์ดแวร์ทำงาน แบ่งออกเป็น 2 ประเภทหลัก' },
                { type: 'heading', content: '1. ซอฟต์แวร์ระบบ (System Software)' },
                { type: 'text', content: 'เป็นซอฟต์แวร์ที่ควบคุมการทำงานของฮาร์ดแวร์และจัดการทรัพยากรคอมพิวเตอร์' },
                { type: 'list', content: '', items: [
                  'ระบบปฏิบัติการ (OS) — เช่น Windows, macOS, Linux, Android, iOS',
                  'ไดรเวอร์อุปกรณ์ (Device Driver) — โปรแกรมสำหรับสื่อสารกับฮาร์ดแวร์',
                  'ยูทิลิตี้ (Utility) — เช่น โปรแกรมแอนตี้ไวรัส โปรแกรมจัดการไฟล์',
                ] },
                { type: 'heading', content: '2. ซอฟต์แวร์ประยุกต์ (Application Software)' },
                { type: 'text', content: 'เป็นซอฟต์แวร์ที่พัฒนาขึ้นเพื่อช่วยผู้ใช้ทำงานเฉพาะด้าน' },
                { type: 'list', content: '', items: [
                  'โปรแกรมสำนักงาน — Microsoft Word, Excel, PowerPoint, Google Docs',
                  'เว็บเบราว์เซอร์ — Chrome, Firefox, Edge, Safari',
                  'โปรแกรมแก้ไขรูปภาพ — Photoshop, GIMP, Canva',
                  'โปรแกรมพัฒนาซอฟต์แวร์ — VS Code, Arduino IDE, Android Studio',
                  'แอปพลิเคชันบนมือถือ — LINE, Facebook, TikTok',
                ] },
                { type: 'heading', content: 'ระบบปฏิบัติการทำหน้าที่อะไร?' },
                { type: 'list', content: '', items: [
                  'จัดการหน่วยความจำ (Memory Management)',
                  'จัดการไฟล์ (File Management)',
                  'จัดการโปรเซส (Process Management)',
                  'จัดการอุปกรณ์ I/O (Device Management)',
                  'จัดการความปลอดภัย (Security)',
                  'ให้ User Interface สำหรับผู้ใช้',
                ] },
                { type: 'callout', content: 'Windows ใช้ระบบไฟล์ NTFS, macOS ใช้ APFS, Linux ใช้ ext4 เป็นระบบไฟล์หลัก', variant: 'info' },
              ],
              quiz: {
                id: 'quiz-comp-1-3',
                title: 'ทดสอบความเข้าใจ: ซอฟต์แวร์',
                description: 'ทดสอบความรู้เรื่องซอฟต์แวร์',
                passingScore: 60,
                questions: [
                  {
                    id: 'q1-comp-3',
                    question: 'ข้อใดเป็นซอฟต์แวร์ระบบ?',
                    type: 'multiple-choice',
                    options: [
                      { id: 'a', text: 'Microsoft Word', isCorrect: false },
                      { id: 'b', text: 'Windows 11', isCorrect: true },
                      { id: 'c', text: 'Google Chrome', isCorrect: false },
                      { id: 'd', text: 'Photoshop', isCorrect: false },
                    ],
                    explanation: 'Windows 11 เป็นระบบปฏิบัติการซึ่งจัดเป็นซอฟต์แวร์ระบบ ส่วน Word, Chrome และ Photoshop เป็นซอฟต์แวร์ประยุกต์',
                    points: 10,
                  },
                ],
              },
            },
          },
        ],
      },
      {
        id: 'mod-comp-2',
        courseId: 'comp-fund-101',
        title: 'ระบบเลขฐาน',
        description: 'เรียนรู้ระบบเลขฐาน 2 ฐาน 10 ฐาน 16 และการแปลง',
        order: 2,
        lessons: [
          {
            id: 'les-comp-2-1',
            moduleId: 'mod-comp-2',
            courseId: 'comp-fund-101',
            title: 'ระบบเลขฐานสองและการแปลง',
            type: 'interactive',
            estimatedMinutes: 25,
            order: 1,
            status: 'published',
            content: {
              sections: [
                { type: 'heading', content: '🔢 ระบบเลขฐานสอง (Binary)' },
                { type: 'text', content: 'คอมพิวเตอร์ทำงานด้วยระบบเลขฐานสอง (Binary) ซึ่งมีเพียง 2 ตัวเลข คือ 0 และ 1 เพราะวงจรอิเล็กทรอนิกส์มี 2 สถานะ คือ ปิด (0) และ เปิด (1)' },
                { type: 'heading', content: 'หน่วยวัดข้อมูล' },
                { type: 'list', content: '', items: [
                  '1 Bit (บิต) = ตัวเลข 0 หรือ 1 หนึ่งตัว',
                  '1 Byte (ไบต์) = 8 Bits',
                  '1 KB (กิโลไบต์) = 1,024 Bytes',
                  '1 MB (เมกะไบต์) = 1,024 KB',
                  '1 GB (กิกะไบต์) = 1,024 MB',
                  '1 TB (เทราไบต์) = 1,024 GB',
                ] },
                { type: 'heading', content: 'วิธีแปลงเลขฐานสองเป็นฐานสิบ' },
                { type: 'text', content: 'แต่ละตำแหน่งของเลขฐานสองมีค่าเป็นเลขยกกำลังของ 2 นับจากขวาไปซ้าย' },
                { type: 'code', content: 'ตัวอย่าง: 1101₂ = ?\n\nตำแหน่ง:  3   2   1   0\nค่า:      8   4   2   1\nเลข:      1   1   0   1\n\nคำนวณ: (1×8) + (1×4) + (0×2) + (1×1)\n      = 8 + 4 + 0 + 1\n      = 13₁₀\n\nดังนั้น 1101₂ = 13₁₀', language: 'text' },
                { type: 'heading', content: 'วิธีแปลงเลขฐานสิบเป็นฐานสอง' },
                { type: 'text', content: 'ใช้วิธีหารด้วย 2 แล้วเก็บเศษ อ่านเศษจากล่างขึ้นบน' },
                { type: 'code', content: 'ตัวอย่าง: 13₁₀ = ?\n\n13 ÷ 2 = 6  เศษ  1  ↑\n 6 ÷ 2 = 3  เศษ  0  |\n 3 ÷ 2 = 1  เศษ  1  | อ่านจากล่างขึ้นบน\n 1 ÷ 2 = 0  เศษ  1  |\n\nดังนั้น 13₁₀ = 1101₂', language: 'text' },
                { type: 'callout', content: 'ลองฝึกแปลงเลขฐานในห้องฝึกปฏิบัติ (Practice Lab) เพื่อทำความเข้าใจให้ลึกซึ้งยิ่งขึ้น!', variant: 'tip' },
              ],
              quiz: {
                id: 'quiz-comp-2-1',
                title: 'ทดสอบ: ระบบเลขฐาน',
                description: 'ทดสอบการแปลงเลขฐาน',
                passingScore: 60,
                questions: [
                  {
                    id: 'q1-bin',
                    question: '1010₂ มีค่าเท่ากับเลขฐานสิบเท่าไร?',
                    type: 'multiple-choice',
                    options: [
                      { id: 'a', text: '8', isCorrect: false },
                      { id: 'b', text: '10', isCorrect: true },
                      { id: 'c', text: '12', isCorrect: false },
                      { id: 'd', text: '5', isCorrect: false },
                    ],
                    explanation: '1010₂ = (1×8) + (0×4) + (1×2) + (0×1) = 8 + 0 + 2 + 0 = 10₁₀',
                    points: 10,
                  },
                  {
                    id: 'q2-bin',
                    question: '1 Byte มีกี่ Bit?',
                    type: 'multiple-choice',
                    options: [
                      { id: 'a', text: '2', isCorrect: false },
                      { id: 'b', text: '4', isCorrect: false },
                      { id: 'c', text: '8', isCorrect: true },
                      { id: 'd', text: '16', isCorrect: false },
                    ],
                    explanation: '1 Byte = 8 Bits ซึ่งสามารถแทนค่าได้ตั้งแต่ 0 ถึง 255 (2⁸ - 1)',
                    points: 10,
                  },
                ],
              },
            },
          },
        ],
      },
    ],
  },

  // ====== TYPING AND DIGITAL SKILLS ======
  {
    id: 'typing-101',
    categoryId: 'typing-digital',
    title: 'ฝึกพิมพ์สัมผัส',
    titleEn: 'Touch Typing Practice',
    description: 'ฝึกทักษะการพิมพ์สัมผัสภาษาไทยและอังกฤษ เรียนรู้ตำแหน่งนิ้วที่ถูกต้อง พัฒนาความเร็วและความแม่นยำ',
    icon: 'Keyboard',
    level: 'ม.4',
    difficulty: 'เริ่มต้น',
    estimatedHours: 10,
    prerequisites: [],
    objectives: [
      'พิมพ์สัมผัสภาษาอังกฤษได้โดยไม่ต้องมองคีย์บอร์ด',
      'พิมพ์ภาษาไทยได้อย่างคล่องแคล่ว',
      'พิมพ์อักขระพิเศษที่ใช้ในการเขียนโปรแกรมได้',
      'มีความเร็วในการพิมพ์อย่างน้อย 30 WPM',
    ],
    tags: ['พิมพ์ดีด', 'คีย์บอร์ด', 'ทักษะพื้นฐาน'],
    status: 'published',
    modules: [
      {
        id: 'mod-typing-1',
        courseId: 'typing-101',
        title: 'พื้นฐานการพิมพ์สัมผัส',
        description: 'เรียนรู้ตำแหน่งนิ้วและหลักการพิมพ์สัมผัส',
        order: 1,
        lessons: [
          {
            id: 'les-typing-1-1',
            moduleId: 'mod-typing-1',
            courseId: 'typing-101',
            title: 'หลักการพิมพ์สัมผัส',
            type: 'reading',
            estimatedMinutes: 10,
            order: 1,
            status: 'published',
            content: {
              sections: [
                { type: 'heading', content: '⌨️ หลักการพิมพ์สัมผัส (Touch Typing)' },
                { type: 'text', content: 'การพิมพ์สัมผัส (Touch Typing) คือการพิมพ์โดยไม่ต้องมองที่คีย์บอร์ด ใช้นิ้วทั้ง 10 นิ้ว แต่ละนิ้วรับผิดชอบปุ่มที่กำหนดไว้' },
                { type: 'heading', content: 'ตำแหน่ง Home Row (แถวหลัก)' },
                { type: 'text', content: 'เริ่มต้นจากแถว Home Row ซึ่งเป็นแถวกลางของคีย์บอร์ด:' },
                { type: 'code', content: 'มือซ้าย:  A  S  D  F  (นิ้วก้อย นิ้วนาง นิ้วกลาง นิ้วชี้)\nมือขวา:   J  K  L  ;  (นิ้วชี้ นิ้วกลาง นิ้วนาง นิ้วก้อย)\nนิ้วโป้ง:  Space Bar (แถบเว้นวรรค)', language: 'text' },
                { type: 'callout', content: 'สังเกตว่าปุ่ม F และ J มีปุ่มนูนเล็กๆ ช่วยให้วางนิ้วได้ถูกตำแหน่งโดยไม่ต้องมอง!', variant: 'tip' },
                { type: 'heading', content: 'เทคนิคสำคัญ' },
                { type: 'list', content: '', items: [
                  'นั่งตัวตรง ข้อมือไม่วางบนโต๊ะ',
                  'มองที่จอ ไม่มองที่คีย์บอร์ด',
                  'เริ่มจากช้าๆ แล้วค่อยๆ เพิ่มความเร็ว',
                  'ความแม่นยำสำคัญกว่าความเร็ว',
                  'ฝึกทุกวัน วันละ 15-30 นาที',
                ] },
                { type: 'callout', content: 'ไปฝึกพิมพ์จริงได้ที่ "ห้องฝึกปฏิบัติ > Typing Lab" เลือกเวลาและภาษาที่ต้องการฝึก!', variant: 'important' },
              ],
            },
          },
        ],
      },
    ],
  },

  // ====== PROGRAMMING FUNDAMENTALS ======
  {
    id: 'prog-fund-101',
    categoryId: 'programming',
    title: 'พื้นฐานการเขียนโปรแกรม',
    titleEn: 'Programming Fundamentals',
    description: 'เรียนรู้หลักคิดเชิงคำนวณ อัลกอริทึม ผังงาน และแนวคิดพื้นฐานในการเขียนโปรแกรม',
    icon: 'Code2',
    level: 'ม.4',
    difficulty: 'เริ่มต้น',
    estimatedHours: 15,
    prerequisites: ['comp-fund-101'],
    objectives: [
      'เข้าใจหลักการคิดเชิงคำนวณ (Computational Thinking)',
      'เขียนอัลกอริทึมและผังงาน (Flowchart) ได้',
      'เข้าใจตัวแปร ชนิดข้อมูล เงื่อนไข และการวนซ้ำ',
      'แก้โจทย์ปัญหาด้วยการเขียนโปรแกรมเบื้องต้น',
    ],
    tags: ['อัลกอริทึม', 'ผังงาน', 'ตัวแปร', 'เงื่อนไข', 'ลูป'],
    status: 'published',
    modules: [
      {
        id: 'mod-prog-1',
        courseId: 'prog-fund-101',
        title: 'การคิดเชิงคำนวณ',
        description: 'เรียนรู้ Computational Thinking และการแก้ปัญหาอย่างเป็นระบบ',
        order: 1,
        lessons: [
          {
            id: 'les-prog-1-1',
            moduleId: 'mod-prog-1',
            courseId: 'prog-fund-101',
            title: 'Computational Thinking คืออะไร?',
            type: 'reading',
            estimatedMinutes: 15,
            order: 1,
            status: 'published',
            content: {
              sections: [
                { type: 'heading', content: '🧠 Computational Thinking' },
                { type: 'text', content: 'Computational Thinking (การคิดเชิงคำนวณ) คือกระบวนการคิดอย่างเป็นระบบเพื่อแก้ปัญหาที่ซับซ้อน ประกอบด้วย 4 ขั้นตอน:' },
                { type: 'list', content: '', items: [
                  'Decomposition (การแยกส่วน) — แบ่งปัญหาใหญ่เป็นปัญหาย่อยที่จัดการได้ง่ายกว่า',
                  'Pattern Recognition (การจดจำรูปแบบ) — หาความเหมือน ซ้ำ หรือรูปแบบในปัญหา',
                  'Abstraction (การคิดเชิงนามธรรม) — เน้นเฉพาะสิ่งสำคัญ ตัดรายละเอียดที่ไม่จำเป็นออก',
                  'Algorithm Design (การออกแบบขั้นตอนวิธี) — ออกแบบขั้นตอนการแก้ปัญหาที่ชัดเจน',
                ] },
                { type: 'heading', content: 'ตัวอย่าง: ทำข้าวผัด' },
                { type: 'text', content: 'สมมติเราต้องการสอนหุ่นยนต์ทำข้าวผัด ลองใช้ Computational Thinking:' },
                { type: 'code', content: 'Decomposition:\n1. เตรียมวัตถุดิบ\n2. เตรียมเครื่องครัว\n3. ผัดข้าว\n4. ปรุงรส\n5. จัดจาน\n\nAlgorithm:\n1. ตั้งกระทะ ใส่น้ำมัน รอจนร้อน\n2. ใส่กระเทียม ผัดจนหอม\n3. ใส่ไข่ คนให้สุก\n4. ใส่ข้าวสวย ผัดรวมกัน\n5. เติมซอสปรุงรส\n6. คนให้เข้ากัน\n7. ตักใส่จาน', language: 'text' },
                { type: 'callout', content: 'การคิดเชิงคำนวณไม่ได้จำกัดแค่คอมพิวเตอร์ เราใช้ได้ในชีวิตประจำวัน เช่น วางแผนเดินทาง จัดตารางเรียน!', variant: 'tip' },
              ],
              quiz: {
                id: 'quiz-prog-1-1',
                title: 'ทดสอบ: Computational Thinking',
                description: 'ทดสอบความเข้าใจเกี่ยวกับ Computational Thinking',
                passingScore: 60,
                questions: [
                  {
                    id: 'q1-ct',
                    question: 'การแบ่งปัญหาใหญ่เป็นปัญหาย่อย เรียกว่าอะไร?',
                    type: 'multiple-choice',
                    options: [
                      { id: 'a', text: 'Pattern Recognition', isCorrect: false },
                      { id: 'b', text: 'Decomposition', isCorrect: true },
                      { id: 'c', text: 'Abstraction', isCorrect: false },
                      { id: 'd', text: 'Algorithm', isCorrect: false },
                    ],
                    explanation: 'Decomposition คือการแยกปัญหาใหญ่ออกเป็นปัญหาย่อยที่จัดการได้ง่ายกว่า',
                    points: 10,
                  },
                ],
              },
            },
          },
          {
            id: 'les-prog-1-2',
            moduleId: 'mod-prog-1',
            courseId: 'prog-fund-101',
            title: 'อัลกอริทึมและผังงาน',
            type: 'reading',
            estimatedMinutes: 20,
            order: 2,
            status: 'published',
            content: {
              sections: [
                { type: 'heading', content: '📊 อัลกอริทึมและผังงาน' },
                { type: 'text', content: 'อัลกอริทึม (Algorithm) คือลำดับขั้นตอนที่ชัดเจนในการแก้ปัญหา ต้องมีจุดเริ่มต้น จุดสิ้นสุด และขั้นตอนที่ทำตามได้' },
                { type: 'heading', content: 'คุณสมบัติของอัลกอริทึมที่ดี' },
                { type: 'list', content: '', items: [
                  'มีขั้นตอนที่ชัดเจน (Definiteness)',
                  'มีจุดสิ้นสุด (Finiteness)',
                  'มี Input และ Output',
                  'มีประสิทธิภาพ (Effectiveness)',
                ] },
                { type: 'heading', content: 'ผังงาน (Flowchart)' },
                { type: 'text', content: 'ผังงานคือแผนภาพที่ใช้สัญลักษณ์มาตรฐานแสดงขั้นตอนอัลกอริทึม:' },
                { type: 'list', content: '', items: [
                  '⬭ วงรี (Oval) — จุดเริ่มต้น/จุดสิ้นสุด',
                  '▭ สี่เหลี่ยม (Rectangle) — กระบวนการ/คำสั่ง',
                  '◇ สี่เหลี่ยมข้าวหลามตัด (Diamond) — เงื่อนไข/การตัดสินใจ',
                  '▱ สี่เหลี่ยมด้านขนาน (Parallelogram) — รับข้อมูล/แสดงผล',
                  '→ ลูกศร — ทิศทางการทำงาน',
                ] },
                { type: 'code', content: 'ตัวอย่าง Pseudocode: ตรวจสอบเลขคู่/คี่\n\nBEGIN\n  INPUT number\n  IF number MOD 2 = 0 THEN\n    PRINT "เลขคู่"\n  ELSE\n    PRINT "เลขคี่"\n  ENDIF\nEND', language: 'text' },
              ],
            },
          },
        ],
      },
      {
        id: 'mod-prog-2',
        courseId: 'prog-fund-101',
        title: 'แนวคิดพื้นฐานการเขียนโปรแกรม',
        description: 'ตัวแปร ชนิดข้อมูล เงื่อนไข และลูป',
        order: 2,
        lessons: [
          {
            id: 'les-prog-2-1',
            moduleId: 'mod-prog-2',
            courseId: 'prog-fund-101',
            title: 'ตัวแปรและชนิดข้อมูล',
            type: 'reading',
            estimatedMinutes: 15,
            order: 1,
            status: 'published',
            content: {
              sections: [
                { type: 'heading', content: '📦 ตัวแปรและชนิดข้อมูล' },
                { type: 'text', content: 'ตัวแปร (Variable) คือที่เก็บข้อมูลในหน่วยความจำ เปรียบเหมือนกล่องที่มีชื่อติดอยู่ เราสามารถใส่ข้อมูลเข้าไป อ่านข้อมูลออกมา หรือเปลี่ยนข้อมูลได้' },
                { type: 'heading', content: 'ชนิดข้อมูลพื้นฐาน (Data Types)' },
                { type: 'list', content: '', items: [
                  'จำนวนเต็ม (Integer) — เช่น 1, 42, -7, 0',
                  'จำนวนทศนิยม (Float/Double) — เช่น 3.14, -0.5, 100.0',
                  'ข้อความ (String) — เช่น "สวัสดี", "Hello World"',
                  'ค่าความจริง (Boolean) — true หรือ false เท่านั้น',
                  'อักขระ (Character) — ตัวอักษรเดียว เช่น \'A\', \'ก\'',
                ] },
                { type: 'code', content: '// ตัวอย่างการประกาศตัวแปร (Pseudocode)\nname = "สมชาย"         // String\nage = 16                // Integer\nheight = 170.5          // Float\nis_student = true       // Boolean\ngrade = \'A\'             // Character', language: 'javascript' },
                { type: 'callout', content: 'การตั้งชื่อตัวแปรที่ดี ควรสื่อความหมาย เช่น student_name, total_score ไม่ควรตั้งชื่อว่า x, y, z (ยกเว้นในกรณีเฉพาะ)', variant: 'tip' },
              ],
            },
          },
        ],
      },
    ],
  },

  // ====== HTML & CSS ======
  {
    id: 'html-css-101',
    categoryId: 'web-development',
    title: 'สร้างเว็บไซต์ด้วย HTML & CSS',
    titleEn: 'Build Websites with HTML & CSS',
    description: 'เรียนรู้การสร้างเว็บไซต์ตั้งแต่พื้นฐาน ใช้ HTML สร้างโครงสร้าง และ CSS ตกแต่งให้สวยงาม',
    icon: 'Globe',
    level: 'ม.4',
    difficulty: 'เริ่มต้น',
    estimatedHours: 20,
    prerequisites: ['comp-fund-101'],
    objectives: [
      'เข้าใจโครงสร้างของเอกสาร HTML',
      'ใช้ Tag HTML พื้นฐานได้',
      'ตกแต่งเว็บไซต์ด้วย CSS',
      'สร้างเว็บไซต์แบบ Responsive',
    ],
    tags: ['HTML', 'CSS', 'เว็บไซต์', 'Responsive'],
    status: 'published',
    modules: [
      {
        id: 'mod-html-1',
        courseId: 'html-css-101',
        title: 'HTML พื้นฐาน',
        description: 'เรียนรู้โครงสร้าง HTML และ Tag พื้นฐาน',
        order: 1,
        lessons: [
          {
            id: 'les-html-1-1',
            moduleId: 'mod-html-1',
            courseId: 'html-css-101',
            title: 'HTML คืออะไร? โครงสร้างเอกสาร HTML',
            type: 'reading',
            estimatedMinutes: 15,
            order: 1,
            status: 'published',
            content: {
              sections: [
                { type: 'heading', content: '🌐 HTML คืออะไร?' },
                { type: 'text', content: 'HTML (HyperText Markup Language) คือภาษามาร์กอัปที่ใช้สร้างโครงสร้างของเว็บเพจ ทุกเว็บไซต์ในโลกล้วนใช้ HTML เป็นพื้นฐาน' },
                { type: 'callout', content: 'HTML ไม่ใช่ภาษาโปรแกรม! HTML เป็นภาษา Markup ที่ใช้ "แท็ก" (Tag) กำหนดโครงสร้างของเนื้อหา', variant: 'important' },
                { type: 'heading', content: 'โครงสร้างพื้นฐานของเอกสาร HTML' },
                { type: 'code', content: '<!DOCTYPE html>\n<html lang="th">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>หน้าแรกของฉัน</title>\n</head>\n<body>\n    <h1>สวัสดีชาวโลก!</h1>\n    <p>นี่คือเว็บไซต์แรกของฉัน</p>\n</body>\n</html>', language: 'html' },
                { type: 'heading', content: 'อธิบายแต่ละส่วน' },
                { type: 'list', content: '', items: [
                  '<!DOCTYPE html> — บอกเบราว์เซอร์ว่าเป็นเอกสาร HTML5',
                  '<html> — แท็กรากของเอกสาร ครอบทุกอย่าง',
                  '<head> — ส่วนหัว เก็บข้อมูลที่ไม่แสดงบนหน้าเว็บ เช่น title, meta',
                  '<body> — ส่วนเนื้อหาที่แสดงบนหน้าเว็บ',
                  '<h1> — หัวข้อหลัก (มี h1 ถึง h6)',
                  '<p> — ย่อหน้า (paragraph)',
                ] },
                { type: 'heading', content: 'แท็ก HTML พื้นฐาน' },
                { type: 'code', content: '<!-- หัวข้อ -->\n<h1>หัวข้อใหญ่สุด</h1>\n<h2>หัวข้อรอง</h2>\n<h3>หัวข้อย่อย</h3>\n\n<!-- ย่อหน้า -->\n<p>นี่คือย่อหน้า</p>\n\n<!-- ลิงก์ -->\n<a href="https://www.google.com">ไปที่ Google</a>\n\n<!-- รูปภาพ -->\n<img src="photo.jpg" alt="คำอธิบายภาพ">\n\n<!-- รายการ -->\n<ul>\n    <li>รายการที่ 1</li>\n    <li>รายการที่ 2</li>\n</ul>\n\n<!-- ตัวหนาและตัวเอียง -->\n<strong>ตัวหนา</strong>\n<em>ตัวเอียง</em>', language: 'html' },
                { type: 'callout', content: 'ลองเขียน HTML จริงใน "ห้องฝึกปฏิบัติ > HTML/CSS Lab" ดูผลลัพธ์ทันที!', variant: 'tip' },
              ],
              quiz: {
                id: 'quiz-html-1-1',
                title: 'ทดสอบ: HTML พื้นฐาน',
                description: 'ทดสอบความเข้าใจเกี่ยวกับ HTML',
                passingScore: 60,
                questions: [
                  {
                    id: 'q1-html',
                    question: 'แท็กใดใช้สร้างหัวข้อใหญ่ที่สุด?',
                    type: 'multiple-choice',
                    options: [
                      { id: 'a', text: '<h6>', isCorrect: false },
                      { id: 'b', text: '<heading>', isCorrect: false },
                      { id: 'c', text: '<h1>', isCorrect: true },
                      { id: 'd', text: '<title>', isCorrect: false },
                    ],
                    explanation: '<h1> เป็นแท็กหัวข้อใหญ่สุด ส่วน <title> ใช้ตั้งชื่อหน้าเว็บในแท็บเบราว์เซอร์',
                    points: 10,
                  },
                  {
                    id: 'q2-html',
                    question: 'ส่วน <head> ของ HTML ใช้ทำอะไร?',
                    type: 'multiple-choice',
                    options: [
                      { id: 'a', text: 'แสดงเนื้อหาบนหน้าเว็บ', isCorrect: false },
                      { id: 'b', text: 'เก็บข้อมูล metadata เช่น title, charset', isCorrect: true },
                      { id: 'c', text: 'สร้างส่วนหัวของตาราง', isCorrect: false },
                      { id: 'd', text: 'ใส่รูปภาพ', isCorrect: false },
                    ],
                    explanation: '<head> เก็บข้อมูล metadata ของเอกสาร เช่น ชื่อเพจ, charset, CSS links ซึ่งไม่แสดงบนหน้าเว็บโดยตรง',
                    points: 10,
                  },
                ],
              },
            },
          },
          {
            id: 'les-html-1-2',
            moduleId: 'mod-html-1',
            courseId: 'html-css-101',
            title: 'ลิงก์ รูปภาพ และรายการ',
            type: 'reading',
            estimatedMinutes: 15,
            order: 2,
            status: 'published',
            content: {
              sections: [
                { type: 'heading', content: '🔗 ลิงก์ รูปภาพ และรายการ' },
                { type: 'heading', content: 'ลิงก์ (Hyperlink)' },
                { type: 'text', content: 'ใช้แท็ก <a> สร้างลิงก์เชื่อมต่อไปยังหน้าอื่น:' },
                { type: 'code', content: '<!-- ลิงก์ภายนอก -->\n<a href="https://www.google.com" target="_blank">ไปที่ Google</a>\n\n<!-- ลิงก์ภายใน -->\n<a href="about.html">เกี่ยวกับเรา</a>\n\n<!-- ลิงก์อีเมล -->\n<a href="mailto:info@school.ac.th">ส่งอีเมล</a>', language: 'html' },
                { type: 'heading', content: 'รูปภาพ' },
                { type: 'code', content: '<!-- รูปภาพพื้นฐาน -->\n<img src="cat.jpg" alt="รูปแมวน่ารัก" width="400">\n\n<!-- รูปภาพจากอินเทอร์เน็ต -->\n<img src="https://example.com/photo.jpg" alt="ภาพตัวอย่าง">', language: 'html' },
                { type: 'callout', content: 'alt attribute สำคัญมาก! ช่วยให้ผู้พิการทางสายตาเข้าใจภาพ และช่วย SEO ด้วย', variant: 'important' },
                { type: 'heading', content: 'รายการ (Lists)' },
                { type: 'code', content: '<!-- Unordered List (รายการไม่เรียงลำดับ) -->\n<ul>\n    <li>HTML</li>\n    <li>CSS</li>\n    <li>JavaScript</li>\n</ul>\n\n<!-- Ordered List (รายการเรียงลำดับ) -->\n<ol>\n    <li>เปิดเบราว์เซอร์</li>\n    <li>พิมพ์ URL</li>\n    <li>กด Enter</li>\n</ol>', language: 'html' },
              ],
            },
          },
        ],
      },
      {
        id: 'mod-html-2',
        courseId: 'html-css-101',
        title: 'CSS พื้นฐาน',
        description: 'เรียนรู้การตกแต่งเว็บไซต์ด้วย CSS',
        order: 2,
        lessons: [
          {
            id: 'les-css-1-1',
            moduleId: 'mod-html-2',
            courseId: 'html-css-101',
            title: 'CSS คืออะไร? Selector และ Property',
            type: 'reading',
            estimatedMinutes: 20,
            order: 1,
            status: 'published',
            content: {
              sections: [
                { type: 'heading', content: '🎨 CSS คืออะไร?' },
                { type: 'text', content: 'CSS (Cascading Style Sheets) คือภาษาที่ใช้ตกแต่งหน้าเว็บ กำหนดสี ขนาดตัวอักษร ระยะห่าง จัดวาง Layout ทำให้เว็บไซต์สวยงาม' },
                { type: 'heading', content: 'วิธีเขียน CSS' },
                { type: 'code', content: '/* โครงสร้าง CSS */\nselector {\n    property: value;\n}\n\n/* ตัวอย่าง */\nh1 {\n    color: blue;\n    font-size: 32px;\n    text-align: center;\n}\n\np {\n    color: #333333;\n    line-height: 1.6;\n    margin-bottom: 16px;\n}', language: 'css' },
                { type: 'heading', content: 'ประเภท Selector' },
                { type: 'code', content: '/* Element Selector */\nh1 { color: blue; }\n\n/* Class Selector */\n.highlight { background: yellow; }\n\n/* ID Selector */\n#header { background: navy; }\n\n/* ใช้ใน HTML */\n<h1>หัวข้อ</h1>\n<p class="highlight">ข้อความเน้น</p>\n<div id="header">ส่วนหัว</div>', language: 'css' },
                { type: 'heading', content: 'วิธีใส่ CSS ให้ HTML' },
                { type: 'list', content: '', items: [
                  'Internal CSS — ใส่ใน <style> ภายใน <head>',
                  'External CSS — สร้างไฟล์ .css แยก แล้วลิงก์ด้วย <link> (แนะนำ!)',
                  'Inline CSS — ใส่ในแอตทริบิวต์ style ของแท็ก (ไม่แนะนำ)',
                ] },
                { type: 'code', content: '<!-- External CSS (แนะนำ!) -->\n<head>\n    <link rel="stylesheet" href="style.css">\n</head>', language: 'html' },
              ],
            },
          },
        ],
      },
    ],
  },

  // ====== C++ Programming ======
  {
    id: 'cpp-101',
    categoryId: 'cpp-programming',
    title: 'เขียนโปรแกรมภาษา C++',
    titleEn: 'C++ Programming',
    description: 'เรียนเขียนโปรแกรมภาษา C++ ตั้งแต่ Hello World, ตัวแปร, เงื่อนไข, ลูป จนถึง OOP',
    icon: 'Terminal',
    level: 'ม.5',
    difficulty: 'ปานกลาง',
    estimatedHours: 30,
    prerequisites: ['prog-fund-101'],
    objectives: [
      'เขียนโปรแกรมภาษา C++ พื้นฐานได้',
      'ใช้ตัวแปร เงื่อนไข ลูป และฟังก์ชันได้',
      'เข้าใจ Array, String และ Pointer',
      'เขียนโปรแกรมเชิงวัตถุ (OOP) เบื้องต้น',
    ],
    tags: ['C++', 'OOP', 'Programming'],
    status: 'published',
    modules: [
      {
        id: 'mod-cpp-1',
        courseId: 'cpp-101',
        title: 'เริ่มต้นกับ C++',
        description: 'เขียนโปรแกรมแรก Input/Output และตัวแปร',
        order: 1,
        lessons: [
          {
            id: 'les-cpp-1-1',
            moduleId: 'mod-cpp-1',
            courseId: 'cpp-101',
            title: 'Hello World! โปรแกรมแรกของคุณ',
            type: 'coding',
            estimatedMinutes: 15,
            order: 1,
            status: 'published',
            content: {
              sections: [
                { type: 'heading', content: '🚀 Hello World! โปรแกรมแรกของคุณ' },
                { type: 'text', content: 'มาเริ่มเขียนโปรแกรมภาษา C++ กันเลย! โปรแกรมแรกที่โปรแกรมเมอร์ทุกคนเขียนคือ "Hello, World!"' },
                { type: 'code', content: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    cout << "สวัสดีชาวโลก!" << endl;\n    return 0;\n}', language: 'cpp' },
                { type: 'heading', content: 'อธิบายโค้ดทีละบรรทัด' },
                { type: 'list', content: '', items: [
                  '#include <iostream> — เรียกใช้ไลบรารี iostream สำหรับรับ-แสดงผลข้อมูล',
                  'using namespace std; — ใช้ namespace มาตรฐาน เพื่อเรียก cout ได้โดยตรง',
                  'int main() { } — ฟังก์ชันหลักที่โปรแกรมเริ่มทำงาน',
                  'cout << "..." — แสดงข้อความออกทางหน้าจอ',
                  'endl — ขึ้นบรรทัดใหม่',
                  'return 0; — บอกว่าโปรแกรมทำงานสำเร็จ',
                ] },
                { type: 'heading', content: 'รับข้อมูลจากผู้ใช้ (Input)' },
                { type: 'code', content: '#include <iostream>\nusing namespace std;\n\nint main() {\n    string name;\n    int age;\n\n    cout << "ชื่ออะไร? ";\n    cin >> name;\n\n    cout << "อายุเท่าไร? ";\n    cin >> age;\n\n    cout << "สวัสดี " << name << " อายุ " << age << " ปี" << endl;\n    return 0;\n}', language: 'cpp' },
                { type: 'callout', content: 'cin >> ใช้รับข้อมูลจากคีย์บอร์ด ส่วน cout << ใช้แสดงผลออกทางหน้าจอ จำง่ายๆ ว่า cin ข้อมูลเข้า cout ข้อมูลออก', variant: 'tip' },
              ],
              quiz: {
                id: 'quiz-cpp-1-1',
                title: 'ทดสอบ: C++ เบื้องต้น',
                description: 'ทดสอบความเข้าใจ C++ พื้นฐาน',
                passingScore: 60,
                questions: [
                  {
                    id: 'q1-cpp',
                    question: 'คำสั่งใดใช้แสดงผลข้อความใน C++?',
                    type: 'multiple-choice',
                    options: [
                      { id: 'a', text: 'print("Hello")', isCorrect: false },
                      { id: 'b', text: 'cout << "Hello"', isCorrect: true },
                      { id: 'c', text: 'echo "Hello"', isCorrect: false },
                      { id: 'd', text: 'printf("Hello")', isCorrect: false },
                    ],
                    explanation: 'ในภาษา C++ ใช้ cout << เพื่อแสดงผลข้อมูล ส่วน printf() เป็นของภาษา C',
                    points: 10,
                  },
                ],
              },
            },
          },
        ],
      },
    ],
  },

  // ====== JAVASCRIPT ======
  {
    id: 'js-101',
    categoryId: 'web-development',
    title: 'JavaScript เบื้องต้น',
    titleEn: 'JavaScript Basics',
    description: 'เรียนรู้ JavaScript สำหรับทำให้เว็บไซต์มีชีวิต ตั้งแต่ตัวแปร ฟังก์ชัน DOM จนถึง API',
    icon: 'Braces',
    level: 'ม.5',
    difficulty: 'ปานกลาง',
    estimatedHours: 25,
    prerequisites: ['html-css-101'],
    objectives: [
      'เข้าใจพื้นฐาน JavaScript',
      'จัดการ DOM ได้',
      'สร้าง Interactive Website ได้',
    ],
    tags: ['JavaScript', 'DOM', 'Web'],
    status: 'published',
    modules: [
      {
        id: 'mod-js-1',
        courseId: 'js-101',
        title: 'JavaScript พื้นฐาน & DOM Manipulation',
        description: 'ตัวแปร ชนิดข้อมูล ฟังก์ชัน และการควบคุมหน้าเว็บด้วย DOM',
        order: 1,
        lessons: [
          {
            id: 'les-js-1-1',
            moduleId: 'mod-js-1',
            courseId: 'js-101',
            title: 'ตัวแปรและฟังก์ชันสมัยใหม่ใน JavaScript',
            type: 'reading',
            estimatedMinutes: 20,
            order: 1,
            status: 'published',
            content: {
              sections: [
                { type: 'heading', content: 'ทำความรู้จักกับ JavaScript' },
                { type: 'text', content: 'JavaScript เป็นภาษาคอมพิวเตอร์ระดับสูงที่ทำงานบนเว็บเบราว์เซอร์ ทำหน้าที่เพิ่มการโต้ตอบ (Interactivity) ตรรกะการประมวลผล และการคำนวณให้กับหน้าเว็บที่สร้างด้วย HTML และ CSS' },
                { type: 'callout', variant: 'tip', content: 'ใน JavaScript ยุคใหม่ (ES6+) แนะนำให้ใช้ let สำหรับตัวแปรที่ต้องการเปลี่ยนค่าได้ และ const สำหรับตัวแปรค่าคงที่ โดยหลีกเลี่ยงการใช้ var' },
                { type: 'heading', content: 'ตัวอย่างการประกาศตัวแปรและฟังก์ชัน' },
                {
                  type: 'code',
                  language: 'javascript',
                  content: `// ตัวแปรค่าคงที่และตัวแปรทั่วไป
const schoolName = "Sci-Com Academy";
let studentScore = 85;

// ฟังก์ชันแบบ Arrow Function
const calculateGrade = (score) => {
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  return "C";
};

console.log(schoolName);
console.log("ผลการประเมิน:", calculateGrade(studentScore));`,
                },
              ],
            },
          },
          {
            id: 'les-js-1-2',
            moduleId: 'mod-js-1',
            courseId: 'js-101',
            title: 'การเชื่อมต่อหน้าเว็บและการจัดการ DOM Events',
            type: 'reading',
            estimatedMinutes: 25,
            order: 2,
            status: 'published',
            content: {
              sections: [
                { type: 'heading', content: 'DOM คืออะไร?' },
                { type: 'text', content: 'DOM (Document Object Model) คือโครงสร้างต้นไม้ (Tree structure) ที่เบราว์เซอร์สร้างขึ้นเพื่อแทนองค์ประกอบทั้งหมดของหน้าเว็บ เราสามารถใช้ JavaScript ในการค้นหา เปลี่ยนแปลงสไตล์ หรือผูกอีเวนต์คลิกได้' },
                {
                  type: 'code',
                  language: 'javascript',
                  content: `// ค้นหา Element ด้วย querySelector
const submitBtn = document.querySelector("#submitBtn");
const messageBox = document.querySelector("#messageBox");

// ดักจับการกดปุ่ม (Event Listener)
submitBtn.addEventListener("click", () => {
  messageBox.textContent = "ระบบบันทึกข้อมูลเรียบร้อยแล้ว!";
  messageBox.style.color = "#10b981";
});`,
                },
              ],
            },
          },
          {
            id: 'les-js-1-3',
            moduleId: 'mod-js-1',
            courseId: 'js-101',
            title: 'แบบทดสอบท้ายบทเรียน: พื้นฐาน JavaScript',
            type: 'quiz',
            estimatedMinutes: 15,
            order: 3,
            status: 'published',
            content: {
              sections: [
                { type: 'heading', content: 'แบบทดสอบความเข้าใจ JavaScript และ DOM' },
                { type: 'text', content: 'ตอบคำถามให้ถูกต้องอย่างน้อย 80% เพื่อผ่านการประเมินและบันทึกความก้าวหน้าลงในระบบ' },
              ],
              quiz: {
                id: 'quiz-js-1',
                title: 'แบบทดสอบ JavaScript เบื้องต้น',
                description: 'ทดสอบความรู้ตัวแปร ฟังก์ชัน และ DOM Manipulation',
                passingScore: 80,
                questions: [
                  {
                    id: 'q-js-1',
                    question: 'คำสั่งใดใช้ประกาศตัวแปรที่ไม่ต้องการให้เปลี่ยนค่าได้ในภายหลัง?',
                    type: 'multiple-choice',
                    options: [
                      { id: 'opt-js-1a', text: 'const', isCorrect: true },
                      { id: 'opt-js-1b', text: 'let', isCorrect: false },
                      { id: 'opt-js-1c', text: 'var', isCorrect: false },
                      { id: 'opt-js-1d', text: 'static', isCorrect: false },
                    ],
                    explanation: 'const (constant) ใช้สำหรับประกาศตัวแปรค่าคงที่ที่ไม่สามารถกำหนดค่าใหม่ได้',
                    points: 10,
                  },
                  {
                    id: 'q-js-2',
                    question: 'เมธอดใดใช้สำหรับผูกฟังก์ชันการทำงานเมื่อผู้ใช้คลิกปุ่มบนหน้าเว็บ?',
                    type: 'multiple-choice',
                    options: [
                      { id: 'opt-js-2a', text: 'addEventListener("click", fn)', isCorrect: true },
                      { id: 'opt-js-2b', text: 'attachClickEvent(fn)', isCorrect: false },
                      { id: 'opt-js-2c', text: 'bindEvent("tap", fn)', isCorrect: false },
                      { id: 'opt-js-2d', text: 'listenClick(fn)', isCorrect: false },
                    ],
                    explanation: 'addEventListener เป็นมาตรฐานสากลในการดักจับอีเวนต์บน DOM Element',
                    points: 10,
                  },
                ],
              },
            },
          },
        ],
      },
    ],
  },

  // ====== ESP32 & IoT ======
  {
    id: 'esp32-101',
    categoryId: 'esp32-iot',
    title: 'เรียนรู้ ESP32 และ IoT',
    titleEn: 'ESP32 & IoT Fundamentals',
    description: 'เรียนรู้อิเล็กทรอนิกส์เบื้องต้น โปรแกรม ESP32 เชื่อมต่อเซ็นเซอร์ Wi-Fi และสร้างโปรเจกต์ IoT',
    icon: 'Cpu',
    level: 'ม.5',
    difficulty: 'ปานกลาง',
    estimatedHours: 30,
    prerequisites: ['prog-fund-101'],
    objectives: [
      'เข้าใจพื้นฐานอิเล็กทรอนิกส์',
      'เขียนโปรแกรม ESP32 ด้วย Arduino IDE ได้',
      'เชื่อมต่อเซ็นเซอร์และ Wi-Fi ได้',
    ],
    tags: ['ESP32', 'IoT', 'Arduino', 'เซ็นเซอร์'],
    status: 'published',
    modules: [
      {
        id: 'mod-esp-1',
        courseId: 'esp32-101',
        title: 'ไมโครคอนโทรลเลอร์ ESP32 และวงจรดิจิทัล',
        description: 'การทำงานของบอร์ดสมองกลฝังตัว ขา GPIO และเซ็นเซอร์ตรวจวัด',
        order: 1,
        lessons: [
          {
            id: 'les-esp-1-1',
            moduleId: 'mod-esp-1',
            courseId: 'esp32-101',
            title: 'โครงสร้างบอร์ด ESP32 และขา GPIO',
            type: 'reading',
            estimatedMinutes: 20,
            order: 1,
            status: 'published',
            content: {
              sections: [
                { type: 'heading', content: 'ไมโครคอนโทรลเลอร์ ESP32 คืออะไร?' },
                { type: 'text', content: 'ESP32 เป็นชิปไมโครคอนโทรลเลอร์ประสิทธิภาพสูง สถาปัตยกรรม 32-bit Dual-core มี Wi-Fi และ Bluetooth ในตัว มีขา GPIO (General Purpose Input/Output) สำหรับรับส่งสัญญาณดิจิทัลและแอนะล็อก' },
                { type: 'callout', variant: 'warning', content: 'ระดับแรงดันไฟฟ้าดิจิทัลของ ESP32 คือ 3.3V (Logic Level) ห้ามป้อนแรงดันไฟเกิน 3.3V เข้าสู่ขา GPIO โดยตรงเพราะอาจทำให้ชิปเสียหาย' },
                {
                  type: 'code',
                  language: 'cpp',
                  content: `// โค้ดตัวอย่างไฟกระพริบ (Blink) บนขา GPIO 2
const int LED_PIN = 2;

void setup() {
  pinMode(LED_PIN, OUTPUT);
  Serial.begin(115200);
}

void loop() {
  digitalWrite(LED_PIN, HIGH);
  delay(1000);
  digitalWrite(LED_PIN, LOW);
  delay(1000);
}`,
                },
              ],
            },
          },
          {
            id: 'les-esp-1-2',
            moduleId: 'mod-esp-1',
            courseId: 'esp32-101',
            title: 'แบบทดสอบท้ายบทเรียน: พื้นฐาน ESP32 และ IoT',
            type: 'quiz',
            estimatedMinutes: 15,
            order: 2,
            status: 'published',
            content: {
              sections: [
                { type: 'heading', content: 'แบบทดสอบความเข้าใจระบบสมองกลฝังตัว' },
                { type: 'text', content: 'ตอบคำถามให้ถูกต้องอย่างน้อย 80% เพื่อผ่านการประเมิน' },
              ],
              quiz: {
                id: 'quiz-esp-1',
                title: 'แบบทดสอบ ESP32 เบื้องต้น',
                description: 'ทดสอบความเข้าใจแรงดันไฟฟ้าและขา GPIO',
                passingScore: 80,
                questions: [
                  {
                    id: 'q-esp-1',
                    question: 'ขา GPIO ของบอร์ด ESP32 รองรับระดับแรงดันสัญญาณดิจิทัลสูงสุดเท่าใด?',
                    type: 'multiple-choice',
                    options: [
                      { id: 'opt-esp-1a', text: '3.3V', isCorrect: true },
                      { id: 'opt-esp-1b', text: '5.0V', isCorrect: false },
                      { id: 'opt-esp-1c', text: '12V', isCorrect: false },
                      { id: 'opt-esp-1d', text: '1.8V', isCorrect: false },
                    ],
                    explanation: 'ESP32 ทำงานที่ระดับแรงดันตรรกะ 3.3V (3.3V Logic Level)',
                    points: 10,
                  },
                ],
              },
            },
          },
        ],
      },
    ],
  },

  // ====== DATABASE ======
  {
    id: 'db-101',
    categoryId: 'database',
    title: 'ฐานข้อมูลและ SQL เบื้องต้น',
    titleEn: 'Database & SQL Fundamentals',
    description: 'เรียนรู้ฐานข้อมูลเชิงสัมพันธ์ การออกแบบตาราง และเขียนคำสั่ง SQL',
    icon: 'Database',
    level: 'ม.5',
    difficulty: 'ปานกลาง',
    estimatedHours: 20,
    prerequisites: ['prog-fund-101'],
    objectives: [
      'เข้าใจแนวคิดฐานข้อมูลเชิงสัมพันธ์',
      'ออกแบบตารางฐานข้อมูลได้',
      'เขียนคำสั่ง SQL พื้นฐานได้',
    ],
    tags: ['SQL', 'Database', 'CRUD'],
    status: 'published',
    modules: [
      {
        id: 'mod-db-1',
        courseId: 'db-101',
        title: 'สถาปัตยกรรมฐานข้อมูลเชิงสัมพันธ์ & ภาษา SQL',
        description: 'แนวคิดพื้นฐานฐานข้อมูล ตาราง แถว คอลัมน์ และการดึงข้อมูล',
        order: 1,
        lessons: [
          {
            id: 'les-db-1-1',
            moduleId: 'mod-db-1',
            courseId: 'db-101',
            title: 'แนวคิดฐานข้อมูลเชิงสัมพันธ์ (Relational Database)',
            type: 'reading',
            estimatedMinutes: 20,
            order: 1,
            status: 'published',
            content: {
              sections: [
                { type: 'heading', content: 'ฐานข้อมูลเชิงสัมพันธ์คืออะไร?' },
                { type: 'text', content: 'ฐานข้อมูลเชิงสัมพันธ์ (Relational Database Management System - RDBMS) จัดเก็บข้อมูลในรูปแบบตาราง 2 มิติ ประกอบด้วยแถว (Row หรือ Record) และคอลัมน์ (Column หรือ Field) โดยมี Primary Key เป็นตัวระบุเอกลักษณ์ของแถว' },
                { type: 'callout', variant: 'info', content: 'ภาษา SQL (Structured Query Language) คือภาษามาตรฐานสากลที่ใช้สั่งการและจัดการฐานข้อมูล RDBMS เช่น PostgreSQL, MySQL, SQLite' },
                {
                  type: 'code',
                  language: 'sql',
                  content: `-- ตัวอย่างคำสั่ง SELECT พื้นฐานใน PostgreSQL
SELECT id, title, estimated_hours
FROM public.courses
WHERE level = 'ม.4'
ORDER BY estimated_hours DESC
LIMIT 5;`,
                },
              ],
            },
          },
          {
            id: 'les-db-1-2',
            moduleId: 'mod-db-1',
            courseId: 'db-101',
            title: 'แบบทดสอบท้ายบทเรียน: ฐานข้อมูลและคำสั่ง SQL',
            type: 'quiz',
            estimatedMinutes: 15,
            order: 2,
            status: 'published',
            content: {
              sections: [
                { type: 'heading', content: 'แบบทดสอบความรู้ฐานข้อมูลเชิงสัมพันธ์' },
                { type: 'text', content: 'ตอบคำถามให้ถูกต้องอย่างน้อย 80% เพื่อผ่านการประเมิน' },
              ],
              quiz: {
                id: 'quiz-db-1',
                title: 'แบบทดสอบ SQL เบื้องต้น',
                description: 'ทดสอบความเข้าใจคีย์หลักและคำสั่ง SQL',
                passingScore: 80,
                questions: [
                  {
                    id: 'q-db-1',
                    question: 'คอลัมน์ที่ทำหน้าที่ระบุแถวข้อมูลในตารางไม่ให้ซ้ำกัน เรียกว่าอะไร?',
                    type: 'multiple-choice',
                    options: [
                      { id: 'opt-db-1a', text: 'Primary Key (คีย์หลัก)', isCorrect: true },
                      { id: 'opt-db-1b', text: 'Foreign Key (คีย์นอก)', isCorrect: false },
                      { id: 'opt-db-1c', text: 'Index (ดัชนี)', isCorrect: false },
                      { id: 'opt-db-1d', text: 'View (มุมมอง)', isCorrect: false },
                    ],
                    explanation: 'Primary Key ทำหน้าที่เป็นตัวระบุข้อมูลประจำแถวโดยมีค่าไม่ซ้ำกันและห้ามเป็นค่าว่าง',
                    points: 10,
                  },
                ],
              },
            },
          },
        ],
      },
    ],
  },

  // ====== MS OFFICE ======
  {
    id: 'excel-101',
    categoryId: 'ms-office',
    title: 'Microsoft Excel เบื้องต้น',
    titleEn: 'Microsoft Excel Basics',
    description: 'ใช้งาน Excel สร้างตาราง สูตรคำนวณ กราฟ และการวิเคราะห์ข้อมูลเบื้องต้น',
    icon: 'FileSpreadsheet',
    level: 'ม.4',
    difficulty: 'เริ่มต้น',
    estimatedHours: 12,
    prerequisites: [],
    objectives: [
      'ใช้งาน Excel จัดการข้อมูลได้',
      'ใช้สูตร SUM, AVERAGE, IF ได้',
      'สร้างกราฟและ Dashboard ได้',
    ],
    tags: ['Excel', 'สูตร', 'กราฟ'],
    status: 'published',
    modules: [
      {
        id: 'mod-excel-1',
        courseId: 'excel-101',
        title: 'เริ่มต้นใช้งาน Excel และสูตรคำนวณ',
        description: 'ทำความรู้จัก Cell, Row, Column และสูตรคณิตศาสตร์',
        order: 1,
        lessons: [
          {
            id: 'les-excel-1-1',
            moduleId: 'mod-excel-1',
            courseId: 'excel-101',
            title: 'การจัดตารางข้อมูลและสูตรคำนวณพื้นฐาน',
            type: 'reading',
            estimatedMinutes: 20,
            order: 1,
            status: 'published',
            content: {
              sections: [
                { type: 'heading', content: 'การทำงานของตารางคำนวณ (Spreadsheet)' },
                { type: 'text', content: 'Microsoft Excel จัดเก็บข้อมูลเป็นเซลล์ (Cell) ที่ตัดกันระหว่างคอลัมน์ (A, B, C...) และแถว (1, 2, 3...) ทุกสูตรคำนวณต้องเริ่มต้นด้วยเครื่องหมายเท่ากับ (=)' },
                { type: 'callout', variant: 'tip', content: 'สูตรยอดนิยม: =SUM(ช่วงข้อมูล) เพื่อหาผลรวม และ =AVERAGE(ช่วงข้อมูล) เพื่อหาค่าเฉลี่ย' },
                {
                  type: 'code',
                  language: 'text',
                  content: `=SUM(B2:B10)          // รวมคะแนนนักเรียนทั้ง 9 คน
=AVERAGE(C2:C10)      // หาคะแนนเฉลี่ยวิชาวิทยาศาสตร์
=IF(D2>=80, "A", "B") // เงื่อนไขตัดเกรดอัตโนมัติ`,
                },
              ],
            },
          },
        ],
      },
    ],
  },

  // ====== GRAPHIC DESIGN ======
  {
    id: 'design-101',
    categoryId: 'graphic-design',
    title: 'หลักการออกแบบกราฟิก',
    titleEn: 'Graphic Design Principles',
    description: 'เรียนรู้ทฤษฎีสี Typography การจัดองค์ประกอบ และหลัก UI/UX',
    icon: 'Palette',
    level: 'ม.5',
    difficulty: 'ปานกลาง',
    estimatedHours: 15,
    prerequisites: [],
    objectives: [
      'เข้าใจหลักทฤษฎีสีและ Typography',
      'จัดองค์ประกอบภาพได้',
      'ออกแบบ UI/UX เบื้องต้น',
    ],
    tags: ['ออกแบบ', 'สี', 'UI/UX'],
    status: 'published',
    modules: [
      {
        id: 'mod-design-1',
        courseId: 'design-101',
        title: 'ทฤษฎีสีและการจัดวางองค์ประกอบ',
        description: 'วงล้อสี สีร้อน สีเย็น การผสมสี และความสมดุล',
        order: 1,
        lessons: [
          {
            id: 'les-design-1-1',
            moduleId: 'mod-design-1',
            courseId: 'design-101',
            title: 'ทฤษฎีสีและจิตวิทยาของสีในงานออกแบบ',
            type: 'reading',
            estimatedMinutes: 15,
            order: 1,
            status: 'published',
            content: {
              sections: [
                { type: 'heading', content: 'วงล้อสีและอารมณ์ความรู้สึก' },
                { type: 'text', content: 'การเลือกใช้คู่สีที่เหมาะสมช่วยให้สื่อสารข้อมูลได้ชัดเจนยิ่งขึ้น เช่น สีน้ำเงินแสดงความน่าเชื่อถือและความมั่นคง สีส้มแสดงความคิดสร้างสรรค์และพลังงาน' },
              ],
            },
          },
        ],
      },
    ],
  },

  // ====== PHOTOGRAPHY ======
  {
    id: 'photo-101',
    categoryId: 'photography',
    title: 'การถ่ายภาพเบื้องต้น',
    titleEn: 'Photography Basics',
    description: 'เรียนรู้ Exposure Triangle การจัดองค์ประกอบ และเทคนิคถ่ายภาพ',
    icon: 'Camera',
    level: 'ม.5',
    difficulty: 'เริ่มต้น',
    estimatedHours: 12,
    prerequisites: [],
    objectives: [
      'เข้าใจ Aperture, Shutter Speed และ ISO',
      'จัดองค์ประกอบภาพได้ถูกหลัก',
      'ตกแต่งภาพเบื้องต้นได้',
    ],
    tags: ['ถ่ายภาพ', 'กล้อง', 'Exposure'],
    status: 'published',
    modules: [
      {
        id: 'mod-photo-1',
        courseId: 'photo-101',
        title: 'พื้นฐานกล้องถ่ายรูปและสามเหลี่ยมแสง',
        description: 'ประเภทกล้อง เลนส์ และเซ็นเซอร์',
        order: 1,
        lessons: [
          {
            id: 'les-photo-1-1',
            moduleId: 'mod-photo-1',
            courseId: 'photo-101',
            title: 'สามเหลี่ยมการรับแสง (Exposure Triangle)',
            type: 'reading',
            estimatedMinutes: 15,
            order: 1,
            status: 'published',
            content: {
              sections: [
                { type: 'heading', content: 'Aperture, Shutter Speed และ ISO' },
                { type: 'text', content: 'การควบคุมแสงในภาพขึ้นอยู่กับ 3 องค์ประกอบหลัก: ขนาดรูรับแสง (Aperture: f-stop), ความเร็วชัตเตอร์ (Shutter Speed), และความไวแสงของเซ็นเซอร์ (ISO)' },
              ],
            },
          },
        ],
      },
    ],
  },

  // ====== VIDEO PRODUCTION ======
  {
    id: 'video-101',
    categoryId: 'video-production',
    title: 'การผลิตวิดีโอเบื้องต้น',
    titleEn: 'Video Production Basics',
    description: 'เรียนรู้การเขียนบท ถ่ายทำ ตัดต่อ และส่งออกวิดีโอ',
    icon: 'Video',
    level: 'ม.6',
    difficulty: 'ปานกลาง',
    estimatedHours: 20,
    prerequisites: [],
    objectives: [
      'เขียนบทและ Storyboard ได้',
      'ถ่ายวิดีโอตามหลักเทคนิค',
      'ตัดต่อวิดีโอเบื้องต้น',
    ],
    tags: ['วิดีโอ', 'ตัดต่อ', 'ถ่ายทำ'],
    status: 'published',
    modules: [
      {
        id: 'mod-video-1',
        courseId: 'video-101',
        title: 'พื้นฐานการผลิตวิดีโอและสตอรี่บอร์ด',
        description: 'Resolution, Frame Rate, Aspect Ratio',
        order: 1,
        lessons: [
          {
            id: 'les-video-1-1',
            moduleId: 'mod-video-1',
            courseId: 'video-101',
            title: 'การวางแผนถ่ายทำและ Storyboard',
            type: 'reading',
            estimatedMinutes: 20,
            order: 1,
            status: 'published',
            content: {
              sections: [
                { type: 'heading', content: 'ขั้นตอนก่อนการถ่ายทำ (Pre-Production)' },
                { type: 'text', content: 'การวางโครงเรื่อง การกำหนดมุมกล้อง (Shot Sizes) เช่น Close-up, Medium Shot, Long Shot ช่วยให้การถ่ายทำและการตัดต่อราบรื่น' },
              ],
            },
          },
        ],
      },
    ],
  },

  // ====== NETWORKING ======
  {
    id: 'network-101',
    categoryId: 'networking',
    title: 'ระบบเครือข่ายคอมพิวเตอร์',
    titleEn: 'Computer Networking',
    description: 'เรียนรู้ระบบเครือข่าย LAN WAN IP Address OSI Model และความปลอดภัยไซเบอร์',
    icon: 'Wifi',
    level: 'ม.6',
    difficulty: 'ปานกลาง',
    estimatedHours: 18,
    prerequisites: ['comp-fund-101'],
    objectives: [
      'เข้าใจระบบเครือข่าย LAN, WAN',
      'เข้าใจ IP Address, DNS, DHCP',
      'แก้ปัญหาเครือข่ายเบื้องต้นได้',
    ],
    tags: ['เครือข่าย', 'IP', 'TCP/IP'],
    status: 'published',
    modules: [
      {
        id: 'mod-net-1',
        courseId: 'network-101',
        title: 'เครือข่ายเบื้องต้นและโพรโทคอล',
        description: 'LAN, WAN, WLAN อุปกรณ์เครือข่าย และไอพีแอดเดรส',
        order: 1,
        lessons: [
          {
            id: 'les-net-1-1',
            moduleId: 'mod-net-1',
            courseId: 'network-101',
            title: 'สถาปัตยกรรมเครือข่ายและแบบจำลอง TCP/IP',
            type: 'reading',
            estimatedMinutes: 20,
            order: 1,
            status: 'published',
            content: {
              sections: [
                { type: 'heading', content: 'เครือข่ายคอมพิวเตอร์คืออะไร?' },
                { type: 'text', content: 'เครือข่ายคอมพิวเตอร์คือการเชื่อมโยงคอมพิวเตอร์และอุปกรณ์ตั้งแต่ 2 เครื่องขึ้นไปเข้าด้วยกัน เพื่อแลกเปลี่ยนข้อมูลและใช้งานทรัพยากรร่วมกัน เช่น เครือข่าย LAN ภายในโรงเรียน' },
                { type: 'callout', variant: 'info', content: 'IP Address (เช่น 192.168.1.1) ทำหน้าที่เปรียบเสมือนบ้านเลขที่บนโลกดิจิทัลในการระบุปลายทางของแพ็กเก็ตข้อมูล' },
              ],
            },
          },
        ],
      },
    ],
  },

  // ====== AI ======
  {
    id: 'ai-101',
    categoryId: 'ai-innovation',
    title: 'AI และนวัตกรรมดิจิทัล',
    titleEn: 'AI & Digital Innovation',
    description: 'เข้าใจ AI, Generative AI, Prompt Engineering และการใช้ AI อย่างรับผิดชอบ',
    icon: 'Sparkles',
    level: 'ม.6',
    difficulty: 'ปานกลาง',
    estimatedHours: 12,
    prerequisites: [],
    objectives: [
      'เข้าใจพื้นฐาน AI และ Machine Learning',
      'ใช้ Generative AI ได้อย่างมีประสิทธิภาพ',
      'เข้าใจจริยธรรมและความรับผิดชอบในการใช้ AI',
    ],
    tags: ['AI', 'Generative AI', 'Prompt Engineering'],
    status: 'published',
    modules: [
      {
        id: 'mod-ai-1',
        courseId: 'ai-101',
        title: 'AI และ Generative AI ในชีวิตประจำวัน',
        description: 'ปัญญาประดิษฐ์ Machine Learning และหลักการสั่งการ Prompt',
        order: 1,
        lessons: [
          {
            id: 'les-ai-1-1',
            moduleId: 'mod-ai-1',
            courseId: 'ai-101',
            title: 'ปัญญาประดิษฐ์ (AI) และหลักการทำงานพื้นฐาน',
            type: 'reading',
            estimatedMinutes: 20,
            order: 1,
            status: 'published',
            content: {
              sections: [
                { type: 'heading', content: 'AI คืออะไร?' },
                { type: 'text', content: 'AI (Artificial Intelligence) คือวิทยาการคอมพิวเตอร์ที่พัฒนาให้ระบบสามารถเรียนรู้ คิด วิเคราะห์ และแก้ปัญหาเลียนแบบความฉลาดของมนุษย์' },
                { type: 'callout', variant: 'tip', content: 'Generative AI สามารถสร้างเนื้อหา ข้อความ โค้ด และรูปภาพใหม่ได้ โดยผู้ใช้ต้องมีทักษะ Prompt Engineering ที่แม่นยำ' },
              ],
            },
          },
        ],
      },
    ],
  },
];

// --- Learning Paths ---
export const learningPaths: LearningPath[] = [
  {
    id: 'path-foundations',
    title: 'Computer Foundations',
    description: 'สร้างพื้นฐานด้านคอมพิวเตอร์และทักษะดิจิทัล ตั้งแต่พิมพ์ดีด ฮาร์ดแวร์ ไปจนถึงการเขียนโปรแกรมเบื้องต้น',
    icon: 'Laptop',
    color: '#3b82f6',
    courses: ['typing-101', 'comp-fund-101', 'prog-fund-101'],
    estimatedWeeks: 8,
  },
  {
    id: 'path-webdev',
    title: 'Web Developer',
    description: 'พัฒนาทักษะสร้างเว็บไซต์ครบวงจร ตั้งแต่ HTML CSS JavaScript API ไปจนถึง Full-Stack',
    icon: 'Globe',
    color: '#f59e0b',
    courses: ['html-css-101', 'js-101', 'db-101'],
    estimatedWeeks: 16,
  },
  {
    id: 'path-software',
    title: 'Software Developer',
    description: 'เส้นทางนักพัฒนาซอฟต์แวร์ เรียนรู้ C++ อัลกอริทึม และการพัฒนาโปรแกรม',
    icon: 'Terminal',
    color: '#06b6d4',
    courses: ['prog-fund-101', 'cpp-101'],
    estimatedWeeks: 12,
  },
  {
    id: 'path-iot',
    title: 'IoT Engineer',
    description: 'เส้นทาง IoT Engineer เรียนรู้อิเล็กทรอนิกส์ ESP32 เซ็นเซอร์ เครือข่าย และฐานข้อมูล',
    icon: 'Cpu',
    color: '#ef4444',
    courses: ['prog-fund-101', 'esp32-101', 'network-101', 'db-101'],
    estimatedWeeks: 20,
  },
  {
    id: 'path-creator',
    title: 'Digital Creator',
    description: 'สร้างสรรค์ผลงานดิจิทัล ออกแบบกราฟิก ถ่ายภาพ ผลิตวิดีโอ และสร้าง Portfolio',
    icon: 'Palette',
    color: '#a855f7',
    courses: ['design-101', 'photo-101', 'video-101'],
    estimatedWeeks: 14,
  },
];

// --- Achievements ---
export const achievements: Achievement[] = [
  { id: 'ach-first-login', title: 'สู่โลกแห่งการเรียนรู้', description: 'เข้าสู่ระบบครั้งแรก', icon: '🎉', category: 'general', condition: 'first-login', xpReward: 10, rarity: 'common' },
  { id: 'ach-first-lesson', title: 'ก้าวแรก', description: 'เรียนจบบทเรียนแรก', icon: '📖', category: 'learning', condition: 'complete-first-lesson', xpReward: 20, rarity: 'common' },
  { id: 'ach-typing-30', title: 'นักพิมพ์มือใหม่', description: 'พิมพ์ได้เร็วกว่า 30 WPM', icon: '⌨️', category: 'typing', condition: 'typing-30-wpm', xpReward: 30, rarity: 'common' },
  { id: 'ach-typing-60', title: 'Typing Master', description: 'พิมพ์ได้เร็วกว่า 60 WPM', icon: '🏆', category: 'typing', condition: 'typing-60-wpm', xpReward: 100, rarity: 'rare' },
  { id: 'ach-first-code', title: 'First Programmer', description: 'เขียนโปรแกรมแรกสำเร็จ', icon: '💻', category: 'coding', condition: 'first-code', xpReward: 30, rarity: 'common' },
  { id: 'ach-web-creator', title: 'Web Creator', description: 'สร้างเว็บไซต์แรกสำเร็จ', icon: '🌐', category: 'web', condition: 'first-website', xpReward: 50, rarity: 'uncommon' },
  { id: 'ach-cpp-explorer', title: 'C++ Explorer', description: 'เรียนจบคอร์ส C++ เบื้องต้น', icon: '🔧', category: 'coding', condition: 'complete-cpp', xpReward: 100, rarity: 'rare' },
  { id: 'ach-iot-builder', title: 'IoT Builder', description: 'สร้างโปรเจกต์ IoT แรก', icon: '🤖', category: 'iot', condition: 'first-iot', xpReward: 80, rarity: 'uncommon' },
  { id: 'ach-db-beginner', title: 'Database Beginner', description: 'เขียน SQL Query แรกสำเร็จ', icon: '🗄️', category: 'database', condition: 'first-sql', xpReward: 30, rarity: 'common' },
  { id: 'ach-design-thinker', title: 'Design Thinker', description: 'เรียนจบหลักการออกแบบ', icon: '🎨', category: 'design', condition: 'complete-design', xpReward: 50, rarity: 'uncommon' },
  { id: 'ach-visual-story', title: 'Visual Storyteller', description: 'เรียนจบคอร์สถ่ายภาพ', icon: '📸', category: 'photo', condition: 'complete-photo', xpReward: 50, rarity: 'uncommon' },
  { id: 'ach-video-creator', title: 'Video Creator', description: 'สร้างวิดีโอโปรเจกต์แรก', icon: '🎬', category: 'video', condition: 'first-video', xpReward: 80, rarity: 'uncommon' },
  { id: 'ach-streak-7', title: 'สม่ำเสมอ 7 วัน', description: 'เรียนต่อเนื่อง 7 วันติดต่อกัน', icon: '🔥', category: 'streak', condition: 'streak-7', xpReward: 50, rarity: 'uncommon' },
  { id: 'ach-streak-30', title: 'มุ่งมั่น 30 วัน', description: 'เรียนต่อเนื่อง 30 วันติดต่อกัน', icon: '⭐', category: 'streak', condition: 'streak-30', xpReward: 200, rarity: 'epic' },
  { id: 'ach-quiz-perfect', title: 'คะแนนเต็ม!', description: 'ทำแบบทดสอบได้คะแนนเต็ม', icon: '💯', category: 'quiz', condition: 'perfect-quiz', xpReward: 40, rarity: 'uncommon' },
];

// --- Daily Challenges ---
export const dailyChallenges: DailyChallenge[] = [
  { id: 'dc-1', title: 'ฝึกพิมพ์โค้ด 3 นาที', description: 'ฝึกพิมพ์อักขระที่ใช้ในโปรแกรม เช่น { } [ ] ( ) < > ; :', type: 'typing', difficulty: 'ง่าย', xpReward: 15, estimatedMinutes: 3, date: '2026-10-13' },
  { id: 'dc-2', title: 'สร้างหน้า HTML แนะนำตัว', description: 'สร้างหน้าเว็บ HTML ง่ายๆ แนะนำตัวเอง มีชื่อ รูปภาพ และงานอดิเรก', type: 'coding', difficulty: 'ง่าย', xpReward: 20, estimatedMinutes: 10, date: '2026-10-13' },
  { id: 'dc-3', title: 'แก้ไขข้อผิดพลาดใน CSS', description: 'หาและแก้ไข Bug ใน CSS ที่ทำให้ Layout เพี้ยน', type: 'coding', difficulty: 'ปานกลาง', xpReward: 25, estimatedMinutes: 5, date: '2026-10-14' },
  { id: 'dc-4', title: 'เขียนคำสั่ง SQL ค้นหาข้อมูล', description: 'เขียน SELECT query เพื่อค้นหาข้อมูลนักเรียนที่มีคะแนนสูงสุด', type: 'coding', difficulty: 'ปานกลาง', xpReward: 25, estimatedMinutes: 5, date: '2026-10-15' },
  { id: 'dc-5', title: 'คำนวณคะแนนด้วย Excel', description: 'สร้างสูตร SUM AVERAGE และ IF เพื่อคำนวณเกรดนักเรียน', type: 'quiz', difficulty: 'ง่าย', xpReward: 15, estimatedMinutes: 5, date: '2026-10-16' },
];

// --- Sample Projects ---
export const sampleProjects: Project[] = [
  {
    id: 'proj-personal-website',
    title: 'สร้างเว็บไซต์แนะนำตัว',
    description: 'สร้างเว็บไซต์ Portfolio ส่วนตัวด้วย HTML และ CSS แสดงข้อมูลส่วนตัว ทักษะ และผลงาน',
    difficulty: 'เริ่มต้น',
    estimatedHours: 3,
    skills: ['HTML', 'CSS'],
    objectives: ['สร้างเว็บไซต์ HTML หลายหน้า', 'ตกแต่งด้วย CSS ให้สวยงาม', 'ทำ Responsive Design'],
    category: 'web-development',
    steps: [
      { title: 'วางแผนโครงสร้าง', description: 'วางแผนว่าเว็บไซต์จะมีกี่หน้า แต่ละหน้ามีอะไรบ้าง' },
      { title: 'สร้างโครงสร้าง HTML', description: 'เขียน HTML สร้างหน้าเว็บ มี Header, Main Content, Footer', code: '<!DOCTYPE html>\n<html lang="th">\n<head>\n    <meta charset="UTF-8">\n    <title>Portfolio ของฉัน</title>\n    <link rel="stylesheet" href="style.css">\n</head>\n<body>\n    <header>\n        <h1>ชื่อของฉัน</h1>\n        <nav>\n            <a href="#about">เกี่ยวกับ</a>\n            <a href="#skills">ทักษะ</a>\n            <a href="#projects">ผลงาน</a>\n        </nav>\n    </header>\n    <main>\n        <section id="about">\n            <h2>เกี่ยวกับฉัน</h2>\n            <p>แนะนำตัวเอง...</p>\n        </section>\n    </main>\n</body>\n</html>', language: 'html' },
      { title: 'ตกแต่งด้วย CSS', description: 'เพิ่ม CSS สร้างสีสัน Layout และทำ Responsive' },
    ],
  },
  {
    id: 'proj-grade-calc',
    title: 'โปรแกรมคำนวณเกรด',
    description: 'สร้างโปรแกรม C++ คำนวณเกรดจากคะแนนสอบ',
    difficulty: 'เริ่มต้น',
    estimatedHours: 2,
    skills: ['C++'],
    objectives: ['ใช้ตัวแปรและเงื่อนไข', 'รับข้อมูลและแสดงผล', 'คำนวณเกรดจากคะแนน'],
    category: 'cpp-programming',
    steps: [
      { title: 'รับคะแนนจากผู้ใช้', description: 'ใช้ cin รับคะแนนสอบ' },
      { title: 'คำนวณเกรด', description: 'ใช้ if-else ตรวจสอบช่วงคะแนนแล้วกำหนดเกรด', code: '#include <iostream>\nusing namespace std;\n\nint main() {\n    float score;\n    cout << "ใส่คะแนน: ";\n    cin >> score;\n    \n    if (score >= 80) cout << "เกรด A";\n    else if (score >= 70) cout << "เกรด B";\n    else if (score >= 60) cout << "เกรด C";\n    else if (score >= 50) cout << "เกรด D";\n    else cout << "เกรด F";\n    \n    return 0;\n}', language: 'cpp' },
    ],
  },
  {
    id: 'proj-quiz-game',
    title: 'เกมตอบคำถาม (Quiz Game)',
    description: 'สร้างเกมตอบคำถามด้วย HTML, CSS และ JavaScript',
    difficulty: 'เริ่มต้น',
    estimatedHours: 4,
    skills: ['HTML', 'CSS', 'JavaScript'],
    objectives: ['สร้าง UI สำหรับเกม', 'ใช้ JavaScript จัดการ Logic', 'คำนวณคะแนน'],
    category: 'web-development',
    steps: [],
  },
  {
    id: 'proj-esp32-led',
    title: 'ESP32 LED Blink',
    description: 'โปรเจกต์แรกกับ ESP32 ทำให้ LED กะพริบ',
    difficulty: 'เริ่มต้น',
    estimatedHours: 1,
    skills: ['ESP32', 'Arduino'],
    objectives: ['ต่อวงจร LED', 'เขียนโปรแกรม Blink', 'Upload โค้ดไปยัง ESP32'],
    category: 'esp32-iot',
    steps: [
      { title: 'ต่อวงจร', description: 'ต่อ LED กับ Resistor 220Ω ที่ GPIO 2 ของ ESP32' },
      { title: 'เขียนโค้ด', description: 'เขียนโปรแกรม Blink ใน Arduino IDE', code: '#define LED_PIN 2\n\nvoid setup() {\n    pinMode(LED_PIN, OUTPUT);\n}\n\nvoid loop() {\n    digitalWrite(LED_PIN, HIGH);\n    delay(1000);\n    digitalWrite(LED_PIN, LOW);\n    delay(1000);\n}', language: 'cpp' },
    ],
  },
];

// --- Typing Practice Data ---
export const typingTexts = {
  en: [
    'The quick brown fox jumps over the lazy dog.',
    'Programming is the art of telling a computer what to do.',
    'HTML stands for HyperText Markup Language.',
    'CSS is used to style and layout web pages.',
    'JavaScript makes websites interactive and dynamic.',
    'A variable is a container for storing data values.',
    'Functions are reusable blocks of code that perform a specific task.',
    'An algorithm is a step-by-step procedure for solving a problem.',
    'The internet is a global network of interconnected computers.',
    'Debugging is the process of finding and fixing errors in code.',
  ],
  th: [
    'คอมพิวเตอร์เป็นเครื่องมือสำคัญในยุคดิจิทัล',
    'การเขียนโปรแกรมคือศิลปะของการสั่งงานคอมพิวเตอร์',
    'เว็บไซต์ทุกเว็บใช้ภาษา HTML เป็นพื้นฐาน',
    'การฝึกพิมพ์ทุกวันช่วยเพิ่มความเร็วในการทำงาน',
    'อัลกอริทึมคือลำดับขั้นตอนการแก้ปัญหาอย่างเป็นระบบ',
    'ตัวแปรเปรียบเสมือนกล่องเก็บข้อมูลที่มีชื่อกำกับ',
    'ฐานข้อมูลเป็นที่เก็บรวบรวมข้อมูลอย่างเป็นระเบียบ',
    'ปัญญาประดิษฐ์กำลังเปลี่ยนแปลงโลกของเรา',
    'ความรู้มีค่าและการฝึกฝนที่ดีทำให้เราเก่งขึ้นทุกวัน',
    'วิทยาศาสตร์และคอมพิวเตอร์เป็นพื้นฐานสำคัญของการพัฒนาเทคโนโลยี',
    'กินข้าวให้อิ่มแล้วฝึกเขียนโค้ดและพิมพ์สัมผัสในคืนนี้',
    'เราเชื่อมั่นว่าน้ำใจและความเพียรพยายามจะนำพาไปสู่ความสำเร็จ',
  ],
  code: [
    'const name = "Sci-Com";',
    'function add(a, b) { return a + b; }',
    'if (score >= 80) { grade = "A"; }',
    'for (let i = 0; i < 10; i++) { sum += i; }',
    '<div class="container"><p>Hello</p></div>',
    'SELECT * FROM students WHERE grade = "A";',
    '#include <iostream>\nint main() { return 0; }',
    'console.log("Hello, World!");',
    '.card { border-radius: 8px; padding: 16px; }',
    'const [count, setCount] = useState(0);',
  ],
};

// Helper to get course by ID
export function getCourseById(id: string): Course | undefined {
  return courses.find(c => c.id === id);
}

// Helper to get category by ID
export function getCategoryById(id: string): CourseCategory | undefined {
  return courseCategories.find(c => c.id === id);
}

// Helper to get all courses in a category
export function getCoursesByCategory(categoryId: string): Course[] {
  return courses.filter(c => c.categoryId === categoryId);
}

// Helper to get all lessons for a course
export function getAllLessons(course: Course) {
  return course.modules.flatMap(m => m.lessons);
}

// Helper to count total lessons with published content
export function getPublishedLessonCount(course: Course): number {
  return course.modules.reduce((total, mod) => 
    total + mod.lessons.filter(l => l.status === 'published').length, 0
  );
}
