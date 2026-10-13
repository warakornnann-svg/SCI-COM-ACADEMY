-- =====================================================================
-- SCI-COM ACADEMY — Comprehensive SQL Seed Script
-- Realistic Thai High School Computer Science Content (สสวท. / สอวน.)
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Roles
-- ---------------------------------------------------------------------
INSERT INTO public.roles (id, name, description) VALUES
('00000000-0000-0000-0000-000000000001', 'admin', 'ผู้ดูแลระบบสูงสุด มีสิทธิ์จัดการทุกตารางและหลักสูตร'),
('00000000-0000-0000-0000-000000000002', 'teacher', 'ครูผู้สอน มีสิทธิ์สร้างคอร์ส ตรวจการบ้าน และดูแลห้องเรียน'),
('00000000-0000-0000-0000-000000000003', 'student', 'นักเรียน มีสิทธิ์เรียน ทำแบบทดสอบ และบันทึกแฟ้มผลงาน'),
('00000000-0000-0000-0000-000000000004', 'guest', 'ผู้มาเยือน สามารถดูคอร์สเรียนสาธารณะได้')
ON CONFLICT (name) DO NOTHING;

-- ---------------------------------------------------------------------
-- 2. Profiles (Production Ready: No hardcoded demo test accounts)
-- ---------------------------------------------------------------------
-- Real student and teacher accounts are created dynamically upon registration.
-- Guest accounts are ephemeral and never persisted in database.

-- ---------------------------------------------------------------------
-- 4. Course Categories
-- ---------------------------------------------------------------------
INSERT INTO public.course_categories (id, name, name_en, icon, description, color, course_count, order_index) VALUES
('computer-fundamentals', 'พื้นฐานคอมพิวเตอร์', 'Computer Fundamentals', 'Monitor', 'เรียนรู้หลักการทำงานของคอมพิวเตอร์ ฮาร์ดแวร์ ซอฟต์แวร์ และระบบปฏิบัติการ', '#3b82f6', 2, 1),
('typing-digital', 'พิมพ์ดีดและทักษะดิจิทัล', 'Typing & Digital Skills', 'Keyboard', 'ฝึกทักษะการพิมพ์สัมผัสทั้งภาษาไทยและอังกฤษ พร้อมทักษะดิจิทัลพื้นฐาน', '#10b981', 1, 2),
('programming', 'พื้นฐานการเขียนโปรแกรม', 'Programming Fundamentals', 'Code2', 'เรียนรู้หลักคิดเชิงคำนวณ อัลกอริทึม และเริ่มต้นเขียนโปรแกรม', '#8b5cf6', 1, 3),
('web-development', 'พัฒนาเว็บไซต์', 'Web Development', 'Globe', 'สร้างเว็บไซต์ด้วย HTML, CSS และ JavaScript ตั้งแต่พื้นฐานจนถึงขั้นสูง', '#f59e0b', 3, 4),
('cpp-programming', 'เขียนโปรแกรมภาษา C++', 'C++ Programming', 'Terminal', 'เขียนโปรแกรมภาษา C++ ตั้งแต่พื้นฐาน ตัวแปร ฟังก์ชัน จนถึง OOP', '#06b6d4', 1, 5),
('esp32-iot', 'ESP32 และ IoT', 'ESP32 & IoT', 'Cpu', 'เรียนรู้อิเล็กทรอนิกส์ เซ็นเซอร์ และสร้างโปรเจกต์ IoT ด้วย ESP32', '#ef4444', 1, 6),
('database-sql', 'ฐานข้อมูลและ SQL', 'Database & SQL', 'Database', 'เข้าใจการออกแบบฐานข้อมูลเชิงสัมพันธ์ และการเขียนคำสั่ง SQL', '#ec4899', 1, 7)
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------
-- 5. Courses
-- ---------------------------------------------------------------------
INSERT INTO public.courses (id, category_id, title, title_en, description, icon, level, difficulty, estimated_hours, prerequisites, objectives, status, tags, created_by) VALUES
(
    'comp-fund-101',
    'computer-fundamentals',
    'พื้นฐานคอมพิวเตอร์และเทคโนโลยีสารสนเทศ',
    'Computer Fundamentals & IT',
    'ทำความเข้าใจระบบคอมพิวเตอร์ ฮาร์ดแวร์ ซอฟต์แวร์ สถาปัตยกรรม IPOS Cycle เลขฐานสอง และระบบเครือข่ายเบื้องต้น เหมาะสำหรับนักเรียน ม.4',
    'Monitor',
    'ม.4',
    'เริ่มต้น',
    12,
    ARRAY[]::TEXT[],
    ARRAY['อธิบายหลักการทำงานของคอมพิวเตอร์แบบ IPOS ได้', 'แปลงเลขฐานสองเป็นฐานสิบและฐานสิบเป็นฐานสองได้', 'แยกแยะความแตกต่างระหว่างฮาร์ดแวร์และซอฟต์แวร์ได้']::TEXT[],
    'published',
    ARRAY['ฮาร์ดแวร์', 'ซอฟต์แวร์', 'เลขฐาน', 'IPOS', 'ม.4']::TEXT[],
    '22222222-2222-2222-2222-222222222222'
),
(
    'html-css-101',
    'web-development',
    'สร้างเว็บแรกด้วย HTML5 & Modern CSS',
    'First Web with HTML5 & Modern CSS',
    'ปูพื้นฐานสร้างเว็บเพจตั้งแต่โครงสร้าง HTML5 Semantic Elements การจัดเลย์เอาต์ด้วย Flexbox, Grid จนถึงการทำ Responsive Design สำหรับสมาร์ตโฟน',
    'Globe',
    'ม.4',
    'เริ่มต้น',
    18,
    ARRAY['comp-fund-101']::TEXT[],
    ARRAY['สร้างโครงสร้างเว็บด้วย HTML5 ถูกต้องตามหลัก Semantic', 'จัดสไตล์และเลย์เอาต์ด้วย CSS Flexbox และ Grid ได้', 'สร้างหน้าเว็บ Portfolio ส่วนตัวที่เปิดบนมือถือได้สมบูรณ์']::TEXT[],
    'published',
    ARRAY['HTML5', 'CSS3', 'Flexbox', 'WebDesign', 'Portfolio']::TEXT[],
    '22222222-2222-2222-2222-222222222222'
),
(
    'cpp-fund-101',
    'cpp-programming',
    'เขียนโปรแกรมภาษา C++ ฉบับ สอวน. คอมพิวเตอร์',
    'C++ Programming for Olympiad & CS',
    'ฝึกกระบวนการคิดเชิงคำนวณและทักษะการเขียนโปรแกรมเชิงตรรกะด้วยภาษา C++ ครอบคลุมชนิดข้อมูล เงื่อนไข ลูป อาร์เรย์ ฟังก์ชัน และพอยน์เตอร์',
    'Terminal',
    'ม.5',
    'ปานกลาง',
    24,
    ARRAY['comp-fund-101']::TEXT[],
    ARRAY['เขียนโปรแกรม C++ จัดการ Input/Output ได้คล่องแคล่ว', 'ประยุกต์ใช้ Control Structures และ Loop แก้ปัญหาทางคณิตศาสตร์ได้', 'เข้าใจการทำงานของ Array และฟังก์ชันสำหรับการแข่งขันคอมพิวเตอร์โอลิมปิก']::TEXT[],
    'published',
    ARRAY['C++', 'สอวน', 'Algorithms', 'Logic', 'ม.5']::TEXT[],
    '22222222-2222-2222-2222-222222222222'
),
(
    'esp32-iot-101',
    'esp32-iot',
    'ระบบสมองกลฝังตัวและการสร้าง IoT ด้วย ESP32',
    'Embedded Systems & IoT with ESP32',
    'เรียนรู้วิธีการควบคุมฮาร์ดแวร์ การอ่านค่าเซ็นเซอร์อุณหภูมิ/ความชื้น (DHT22) การควบคุมมอเตอร์ และการส่งข้อมูลแจ้งเตือนผ่าน Wi-Fi ไปยัง LINE Notify และคลาวด์',
    'Cpu',
    'ม.5',
    'ปานกลาง',
    20,
    ARRAY['cpp-fund-101']::TEXT[],
    ARRAY['เข้าใจสถาปัตยกรรมไมโครคอนโทรลเลอร์ ESP32 และการใช้ GPIO', 'ต่อวงจรและเขียนโค้ดอ่านค่าเซ็นเซอร์วัดสภาพแวดล้อมได้จริง', 'พัฒนาระบบ Smart IoT ส่งแจ้งเตือนผ่าน Wi-Fi ได้']::TEXT[],
    'published',
    ARRAY['ESP32', 'IoT', 'Arduino', 'Sensors', 'Microcontroller']::TEXT[],
    '22222222-2222-2222-2222-222222222222'
),
(
    'sql-db-101',
    'database-sql',
    'พื้นฐานฐานข้อมูลเชิงสัมพันธ์และคำสั่ง SQL',
    'Relational Databases & SQL Essentials',
    'เรียนรู้หลักการฐานข้อมูลเชิงสัมพันธ์ ตาราง Primary Key, Foreign Key, ความสัมพันธ์ 1-to-N, M-to-N และคำสั่ง SELECT, JOIN, INSERT, UPDATE, DELETE',
    'Database',
    'ม.5',
    'ปานกลาง',
    16,
    ARRAY['comp-fund-101']::TEXT[],
    ARRAY['ออกแบบตารางฐานข้อมูลที่ผ่านการ Normalization ได้', 'เขียนคำสั่ง SQL SELECT พร้อมเงื่อนไขและการจัดเรียงได้ถูกต้อง', 'เชื่อมโยงข้อมูลระหว่างตารางด้วย INNER JOIN ได้']::TEXT[],
    'published',
    ARRAY['SQL', 'Database', 'PostgreSQL', 'Normalization', 'Relational']::TEXT[],
    NULL
),
(
    'draft-ai-innov-201',
    'computer-fundamentals',
    '[ฉบับร่าง] ปัญญาประดิษฐ์และการประยุกต์ใช้ในชีวิตประจำวัน',
    'AI & Modern Applications (Draft)',
    'หลักสูตรใหม่ที่อยู่ระหว่างการจัดทำโดยกลุ่มสาระเทคโนโลยี เพื่อเตรียมความพร้อมนักเรียน ม.6',
    'Sparkles',
    'ม.6',
    'ขั้นสูง',
    15,
    ARRAY['comp-fund-101']::TEXT[],
    ARRAY['เข้าใจโมเดลภาษาขนาดใหญ่ (LLM)', 'สร้างแอปพลิเคชันจำแนกภาพด้วย AI']::TEXT[],
    'draft',
    ARRAY['AI', 'MachineLearning', 'Draft']::TEXT[],
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    status = EXCLUDED.status;

-- ---------------------------------------------------------------------
-- 6. Course Modules
-- ---------------------------------------------------------------------
INSERT INTO public.course_modules (id, course_id, title, description, order_index) VALUES
('mod-comp-1', 'comp-fund-101', 'โมดูล 1: สถาปัตยกรรมคอมพิวเตอร์และวงจร IPOS', 'ศึกษาชิ้นส่วนฮาร์ดแวร์และการไหลของข้อมูลในระบบ', 1),
('mod-comp-2', 'comp-fund-101', 'โมดูล 2: ระบบเลขฐานสองและการแทนข้อมูลดิจิทัล', 'เรียนรู้ Binary, Byte, และรหัส ASCII', 2),
('mod-html-1', 'html-css-101', 'โมดูล 1: โครงสร้างเอกสารเว็บ HTML5', 'เริ่มต้นสร้างแท็กพื้นฐาน หัวเรื่อง ข้อความ และรูปภาพ', 1),
('mod-html-2', 'html-css-101', 'โมดูล 2: การจัดรูปแบบและการตกแต่งด้วย CSS3', 'การใช้ Selectors, Box Model และ Flexbox', 2),
('mod-cpp-1', 'cpp-fund-101', 'โมดูล 1: พื้นฐานภาษา C++ และโครงสร้างโปรแกรม', 'การประกาศตัวแปร cin/cout และเงื่อนไข if-else', 1),
('mod-sql-1', 'sql-db-101', 'โมดูล 1: สถาปัตยกรรมฐานข้อมูลเชิงสัมพันธ์', 'ทำความเข้าใจ Table, Row, Column, และ Keys', 1),
('mod-draft-1', 'draft-ai-innov-201', 'โมดูลร่าง: บทนำ AI', 'เนื้อหาร่างเฉพาะอาจารย์', 1)
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------
-- 7. Lessons
-- ---------------------------------------------------------------------
INSERT INTO public.lessons (id, module_id, course_id, title, type, content, estimated_minutes, order_index, status) VALUES
(
    'les-comp-1-1',
    'mod-comp-1',
    'comp-fund-101',
    'วงจรการทำงาน IPOS Cycle และบทบาทของอุปกรณ์คอมพิวเตอร์',
    'reading',
    '{
        "sections": [
            {"type": "heading", "content": "ทำไมต้องเข้าใจ IPOS Cycle?"},
            {"type": "text", "content": "ไม่ว่าจะเป็นสมาร์ตโฟนในมือคุณ ซูเปอร์คอมพิวเตอร์ หรือไมโครคอนโทรลเลอร์ขนาดเล็ก ทุกระบบคอมพิวเตอร์ทำงานตามวัฏจักรพื้นฐานเดียวกัน 4 ขั้นตอนที่เรียกว่า IPOS Cycle ได้แก่ Input, Processing, Output และ Storage"},
            {"type": "callout", "variant": "info", "content": "IPOS ย่อมาจาก Input (นำเข้าข้อมูล) → Processing (ประมวลผล) → Output (แสดงผลลัพธ์) และ Storage (บันทึกจัดเก็บข้อมูล)"},
            {"type": "heading", "content": "1. หน่วยรับเข้า (Input Unit)"},
            {"type": "text", "content": "ทำหน้าที่แปลงสัญญาณกายภาพจากโลกภายนอกให้อยู่ในรูปสัญญาณดิจิทัลที่ซีพียูเข้าใจ เช่น แป้นพิมพ์ (Keyboard), เมาส์ (Mouse), เซ็นเซอร์วัดอุณหภูมิ, และกล้องดิจิทัล"},
            {"type": "heading", "content": "2. หน่วยประมวลผลกลาง (CPU & RAM)"},
            {"type": "text", "content": "CPU (Central Processing Unit) เปรียบเสมือนสมองกล ทำหน้าที่คำนวณและประมวลผลคำสั่ง โดยทำงานร่วมกับ RAM (Random Access Memory) ซึ่งเป็นหน่วยความจำหลักที่มีความเร็วสูงมาก แต่เป็นแบบชั่วคราว (Volatile)"}
        ]
    }'::JSONB,
    15,
    1,
    'published'
),
(
    'les-comp-1-2',
    'mod-comp-1',
    'comp-fund-101',
    'แบบทดสอบท้ายโมดูล: โครงสร้างฮาร์ดแวร์และ IPOS',
    'quiz',
    '{"sections": []}'::JSONB,
    10,
    2,
    'published'
),
(
    'les-comp-2-1',
    'mod-comp-2',
    'comp-fund-101',
    'ระบบเลขฐานสอง (Binary System) และการแทนค่าข้อมูล',
    'reading',
    '{
        "sections": [
            {"type": "heading", "content": "ทำไมคอมพิวเตอร์ถึงใช้เลขฐานสอง?"},
            {"type": "text", "content": "เพราะคอมพิวเตอร์สร้างจากทรานซิสเตอร์สารกึ่งตัวนำนับพันล้านตัว ซึ่งเปรียบเสมือนสวิตช์ไฟฟ้าที่มีสถานะเพียง 2 สถานะ คือ ปิด (0 = ไม่มีกระแสไฟ) และ เปิด (1 = มีกระแสไฟ)"},
            {"type": "code", "language": "text", "content": "น้ำหนักของแต่ละบิต (8-bit binary weights):\n128 | 64 | 32 | 16 |  8 |  4 |  2 |  1\n--------------------------------------\n  0 |  0 |  1 |  0 |  1 |  0 |  1 |  0  = 32 + 8 + 2 = 42"}
        ]
    }'::JSONB,
    20,
    1,
    'published'
),
(
    'les-html-1-1',
    'mod-html-1',
    'html-css-101',
    'โครงสร้างหลักของเอกสาร HTML5 และ Semantic Tags',
    'reading',
    '{
        "sections": [
            {"type": "heading", "content": "โครงสร้างเอกสารเว็บมาตรฐาน"},
            {"type": "text", "content": "HTML5 นำเสนอแท็กเชิงความหมาย (Semantic Elements) เช่น <header>, <nav>, <main>, <article>, <section> และ <footer> ซึ่งช่วยให้เบราว์เซอร์และระบบค้นหา (SEO) เข้าใจโครงสร้างของหน้าเว็บได้อย่างถูกต้อง"},
            {"type": "code", "language": "html", "content": "<!DOCTYPE html>\n<html lang=\"th\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>แฟ้มผลงานของฉัน</title>\n</head>\n<body>\n  <header>\n    <h1>ยินดีต้อนรับสู่พอร์ตโฟลิโอ</h1>\n  </header>\n</body>\n</html>"}
        ]
    }'::JSONB,
    15,
    1,
    'published'
),
(
    'les-html-1-2',
    'mod-html-1',
    'html-css-101',
    'แบบทดสอบ: ความเข้าใจแท็ก HTML5',
    'quiz',
    '{"sections": []}'::JSONB,
    10,
    2,
    'published'
),
(
    'les-draft-hidden',
    'mod-draft-1',
    'draft-ai-innov-201',
    'บทเรียนร่างที่ยังไม่เผยแพร่ (เฉพาะ Admin)',
    'reading',
    '{
        "sections": [
            {"type": "heading", "content": "เนื้อหาทดลองของคณะครู"},
            {"type": "text", "content": "หน้านี้ยังอยู่ระหว่างจัดทำ นักเรียนทั่วไปจะไม่สามารถมองเห็นหรือเปิดอ่านได้จนกว่าครูจะกดเผยแพร่"}
        ]
    }'::JSONB,
    10,
    1,
    'draft'
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    status = EXCLUDED.status;

-- ---------------------------------------------------------------------
-- 8. Lesson Resources
-- ---------------------------------------------------------------------
INSERT INTO public.lesson_resources (lesson_id, title, url, resource_type, file_size) VALUES
('les-comp-1-1', 'สไลด์ประกอบการสอน IPOS Cycle (PDF)', 'https://assets.scicom.ac.th/slides/ipos-cycle.pdf', 'pdf', 2450000),
('les-comp-1-1', 'ผังมโนทัศน์สถาปัตยกรรมคอมพิวเตอร์', 'https://assets.scicom.ac.th/diagrams/comp-arch.png', 'slide', 850000),
('les-html-1-1', 'Cheat Sheet โครงสร้าง HTML5 มาตรฐาน W3C', 'https://assets.scicom.ac.th/cheatsheet/html5-cheat.pdf', 'pdf', 1200000),
('les-html-1-1', 'โค้ดตัวอย่าง Template สำหรับ Portfolio', 'https://github.com/scicom-academy/portfolio-template', 'code', 45000)
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------
-- 9. Quizzes
-- ---------------------------------------------------------------------
INSERT INTO public.quizzes (id, lesson_id, course_id, title, description, passing_score, time_limit) VALUES
(
    'quiz-comp-1',
    'les-comp-1-2',
    'comp-fund-101',
    'แบบทดสอบ: พื้นฐานสถาปัตยกรรมคอมพิวเตอร์และ IPOS',
    'ทดสอบความเข้าใจเกี่ยวกับขั้นตอนการทำงานของระบบคอมพิวเตอร์ และหน้าที่ของอุปกรณ์ต่างๆ',
    80,
    10
),
(
    'quiz-html-1',
    'les-html-1-2',
    'html-css-101',
    'แบบทดสอบ: ความเข้าใจโครงสร้างแท็ก HTML5',
    'ทดสอบการใช้แท็ก Semantic HTML5 เพื่อจัดโครงสร้างหน้าเว็บอย่างมีมาตรฐาน',
    80,
    10
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    passing_score = EXCLUDED.passing_score;

-- ---------------------------------------------------------------------
-- 10. Quiz Questions & Normalized Options
-- ---------------------------------------------------------------------
INSERT INTO public.quiz_questions (id, quiz_id, question, type, points, explanation, order_index) VALUES
('q-comp-1-1', 'quiz-comp-1', 'ข้อใดเรียงลำดับขั้นตอนในวงจร IPOS Cycle ได้อย่างถูกต้อง?', 'multiple-choice', 10, 'IPOS เริ่มจากการรับข้อมูลเข้า (Input) ส่งไปประมวลผลที่ CPU (Processing) แสดงผลออกมาทางจอหรือเครื่องพิมพ์ (Output) และจัดเก็บบันทึกลงหน่วยความจำสำรอง (Storage)', 1),
('q-comp-1-2', 'quiz-comp-1', 'หน่วยความจำชนิดใดเป็นหน่วยความจำชั่วคราว (Volatile) ข้อมูลจะหายไปเมื่อปิดเครื่อง?', 'multiple-choice', 10, 'RAM เป็นหน่วยความจำหลักที่ต้องการกระแสไฟฟ้าหล่อเลี้ยงเพื่อเก็บข้อมูล หากไฟฟ้าดับหรือปิดเครื่อง ข้อมูลใน RAM จะสูญหายทั้งหมด', 2),
('q-comp-1-3', 'quiz-comp-1', 'เลขฐานสอง 00101010 มีค่าเท่ากับเลขฐานสิบใด?', 'multiple-choice', 10, 'คำนวณตามน้ำหนักบิต: 32 + 8 + 2 = 42', 3),
('q-html-1-1', 'quiz-html-1', 'แท็กใดใน HTML5 ที่ควรใช้เป็นพื้นที่ใส่เนื้อหาหลักของหน้าเว็บเพียงจุดเดียวต่อ 1 หน้า?', 'multiple-choice', 10, 'แท็ก <main> ใช้ครอบเนื้อหาหลักที่ไม่ซ้ำซ้อนกับส่วนหัว ส่วนท้าย หรือเมนูนำทาง และควรมีเพียงอันเดียวต่อหน้า', 1),
('q-html-1-2', 'quiz-html-1', 'attribute ใดของแท็ก <img> ที่จำเป็นต้องใส่เพื่อระบุข้อความอธิบายภาพเมื่อภาพโหลดไม่สำเร็จ หรือเพื่อ Accessibility?', 'multiple-choice', 10, 'alt (alternative text) เป็นข้อความบรรยายภาพที่มีความสำคัญอย่างยิ่งต่อเครื่องอ่านหน้าจอ (Screen Reader) และคะแนน SEO', 2)
ON CONFLICT (id) DO UPDATE SET
    question = EXCLUDED.question,
    explanation = EXCLUDED.explanation;

-- Normalized Options
INSERT INTO public.quiz_options (id, question_id, option_text, is_correct, order_index) VALUES
-- q-comp-1-1
('opt-c1-1', 'q-comp-1-1', 'Input → Processing → Output → Storage', true, 1),
('opt-c1-2', 'q-comp-1-1', 'Input → Storage → Output → Processing', false, 2),
('opt-c1-3', 'q-comp-1-1', 'Processing → Input → Output → Storage', false, 3),
('opt-c1-4', 'q-comp-1-1', 'Storage → Input → Processing → Output', false, 4),
-- q-comp-1-2
('opt-c2-1', 'q-comp-1-2', 'SSD (Solid State Drive)', false, 1),
('opt-c2-2', 'q-comp-1-2', 'RAM (Random Access Memory)', true, 2),
('opt-c2-3', 'q-comp-1-2', 'Hard Disk Drive (HDD)', false, 3),
('opt-c2-4', 'q-comp-1-2', 'Flash Drive USB', false, 4),
-- q-comp-1-3
('opt-c3-1', 'q-comp-1-3', '24', false, 1),
('opt-c3-2', 'q-comp-1-3', '36', false, 2),
('opt-c3-3', 'q-comp-1-3', '42', true, 3),
('opt-c3-4', 'q-comp-1-3', '50', false, 4),
-- q-html-1-1
('opt-h1-1', 'q-html-1-1', '<header>', false, 1),
('opt-h1-2', 'q-html-1-1', '<main>', true, 2),
('opt-h1-3', 'q-html-1-1', '<section>', false, 3),
('opt-h1-4', 'q-html-1-1', '<div>', false, 4),
-- q-html-1-2
('opt-h2-1', 'q-html-1-2', 'title', false, 1),
('opt-h2-2', 'q-html-1-2', 'src', false, 2),
('opt-h2-3', 'q-html-1-2', 'alt', true, 3),
('opt-h2-4', 'q-html-1-2', 'caption', false, 4)
ON CONFLICT (id) DO UPDATE SET
    option_text = EXCLUDED.option_text,
    is_correct = EXCLUDED.is_correct;

-- ---------------------------------------------------------------------
-- 11. Coding Challenges
-- ---------------------------------------------------------------------
INSERT INTO public.coding_challenges (id, title, description, language, difficulty, starter_code, solution_code, xp_reward) VALUES
(
    'code-sum-even',
    'หาผลรวมของเลขคู่ในช่วง 1 ถึง N',
    'เขียนโปรแกรมรับค่าจำนวนเต็มบวก N แล้วคำนวณหาผลรวมของจำนวนเต็มคู่ทั้งหมดตั้งแต่ 2 ถึง N',
    'cpp',
    'ง่าย',
    '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // เขียนโค้ดของคุณตรงนี้\n    return 0;\n}',
    '#include <iostream>\nusing namespace std;\nint main() {\n    int n; cin >> n;\n    long long sum = 0;\n    for(int i=2; i<=n; i+=2) sum += i;\n    cout << sum;\n    return 0;\n}',
    30
),
(
    'code-palindrome',
    'ตรวจสอบคำพาบินโดรม (Palindrome Checker)',
    'รับข้อความหนึ่งคำ แล้วตรวจสอบว่าเป็นคำที่อ่านจากหน้าไปหลังและหลังไปหน้าเหมือนกันหรือไม่ พิมพ์ "YES" หรือ "NO"',
    'cpp',
    'ปานกลาง',
    '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n    return 0;\n}',
    '#include <iostream>\n#include <string>\nusing namespace std;\nint main() {\n    string s;\n    cin >> s;\n    int l = 0, r = s.length() - 1;\n    while(l < r) {\n        if(s[l] != s[r]) { cout << "NO"; return 0; }\n        l++; r--;\n    }\n    cout << "YES";\n    return 0;\n}',
    45
)
ON CONFLICT (id) DO NOTHING;

-- Challenge Test Cases
INSERT INTO public.challenge_test_cases (challenge_id, input, expected_output, is_hidden, order_index) VALUES
('code-sum-even', '10', '30', false, 1),
('code-sum-even', '5', '6', false, 2),
('code-sum-even', '100', '2550', true, 3),
('code-palindrome', 'radar', 'YES', false, 1),
('code-palindrome', 'hello', 'NO', false, 2),
('code-palindrome', 'level', 'YES', true, 3)
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------
-- 12. Projects & Student Projects
-- ---------------------------------------------------------------------
INSERT INTO public.projects (id, title, description, category, difficulty, estimated_hours, skills, objectives, steps) VALUES
(
    'proj-portfolio-web',
    'พัฒนาเว็บไซต์ประวัติส่วนตัวและผลงาน (Portfolio)',
    'สร้างเว็บ Portfolio หน้าเดียวด้วย HTML5 และ CSS3 พร้อม Responsive Design',
    'web-development',
    'เริ่มต้น',
    8,
    ARRAY['HTML5', 'CSS3', 'Responsive Design', 'Flexbox']::TEXT[],
    ARRAY['เข้าใจโครงสร้าง HTML', 'ออกแบบเว็บตามหลัก Responsive', 'นำผลงานขึ้น GitHub Pages ได้']::TEXT[],
    '[
        {"title": "ร่างแบบ Wireframe", "description": "วาดโครงสร้างหน้าเว็บลงบนกระดาษหรือ Figma"},
        {"title": "สร้างโครงสร้าง HTML5", "description": "เขียนแท็ก Header, Main, Section, และ Footer"},
        {"title": "จัดสไตล์ด้วย CSS", "description": "กำหนดสี ฟอนต์ และจัดเลย์เอาต์ด้วย Flexbox"}
    ]'::JSONB
),
(
    'proj-esp32-temp',
    'ระบบตรวจวัดอุณหภูมิห้องแล็บด้วย ESP32 & LINE Notify',
    'อ่านค่าเซ็นเซอร์ DHT22 แล้วส่งแจ้งเตือนผ่าน Wi-Fi เข้ากลุ่ม LINE ประจำห้องแล็บ',
    'esp32-iot',
    'ปานกลาง',
    12,
    ARRAY['ESP32', 'C++', 'IoT', 'Sensors']::TEXT[],
    ARRAY['ต่อวงจรเซ็นเซอร์ DHT22 กับ ESP32', 'เชื่อมต่อ Wi-Fi และใช้งาน LINE Notify API ได้']::TEXT[],
    '[
        {"title": "ต่อวงจรบน Breadboard", "description": "เชื่อมต่อขา Data ของ DHT22 เข้ากับขา GPIO 4 ของ ESP32"},
        {"title": "เขียนโค้ดอ่านค่าเซ็นเซอร์", "description": "ใช้ไลบรารี DHT.h อ่านค่าอุณหภูมิและความชื้น"},
        {"title": "เชื่อมต่อ LINE Notify", "description": "สร้าง Line Token และส่งข้อความผ่าน HTTPS Request"}
    ]'::JSONB
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.student_projects (id, project_id, user_id, title, description, category, difficulty, tags, demo_url, repo_url, skills, status) VALUES
(
    'sp-1',
    'proj-portfolio-web',
    '33333333-3333-3333-3333-333333333333',
    'เว็บไซต์ประวัติส่วนตัวและผลงาน (Portfolio)',
    'พัฒนาด้วย HTML5, CSS3 และ JavaScript พร้อม Responsive Design สำหรับมือถือและเดสก์ท็อป',
    'web-development',
    'เริ่มต้น',
    ARRAY['HTML', 'CSS', 'Portfolio', 'Responsive']::TEXT[],
    'https://example.com/demo-portfolio',
    'https://github.com/scicom-student/portfolio',
    ARRAY['HTML', 'CSS', 'Responsive Design']::TEXT[],
    'published'
),
(
    'sp-2',
    'proj-esp32-temp',
    '33333333-3333-3333-3333-333333333333',
    'ระบบแจ้งเตือนอุณหภูมิห้องแล็บด้วย ESP32',
    'โปรเจกต์ IoT ตรวจวัดอุณหภูมิและความชื้นด้วยเซ็นเซอร์ DHT22 แล้วส่งแจ้งเตือนผ่าน LINE Notify และแสดงผลบน OLED',
    'esp32-iot',
    'ปานกลาง',
    ARRAY['ESP32', 'IoT', 'DHT22', 'Arduino']::TEXT[],
    '',
    'https://github.com/scicom-student/esp32-temp-monitor',
    ARRAY['ESP32', 'C++', 'IoT', 'Sensors']::TEXT[],
    'published'
)
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------
-- 13. Portfolio Settings
-- ---------------------------------------------------------------------
INSERT INTO public.portfolio_settings (user_id, bio, is_public, theme, contact_email, github_url, custom_skills) VALUES
(
    '33333333-3333-3333-3333-333333333333',
    'นักเรียนชั้น ม.4 แผนการเรียนวิทยาศาสตร์-คอมพิวเตอร์ สนใจการพัฒนาเว็บไซต์ ระบบเครือข่าย และระบบสมองกลฝังตัว IoT',
    true,
    'slate',
    'student.somchai@scicom.ac.th',
    'https://github.com/scicom-student',
    ARRAY['HTML5', 'CSS3', 'JavaScript', 'C++', 'ESP32', 'Figma']::TEXT[]
)
ON CONFLICT (user_id) DO UPDATE SET
    bio = EXCLUDED.bio,
    is_public = EXCLUDED.is_public;

-- ---------------------------------------------------------------------
-- 14. Achievements & Gamification
-- ---------------------------------------------------------------------
INSERT INTO public.achievements (id, title, description, icon, category, condition, xp_reward, rarity) VALUES
('ach-first-login', 'ก้าวแรกสู่นักพัฒนา', 'เข้าสู่ระบบแพลตฟอร์ม Sci-Com Academy ครั้งแรก', 'Sparkles', 'ทั่วไป', 'เข้าสู่ระบบครั้งแรก', 30, 'common'),
('ach-first-lesson', 'ผู้ใฝ่รู้', 'เรียนจบบทเรียนแรกในหลักสูตรใดก็ได้', 'BookOpen', 'การเรียน', 'เรียนจบ 1 บทเรียน', 50, 'common'),
('ach-quiz-perfect', 'คะแนนเต็มร้อย!', 'ทำแบบทดสอบได้คะแนนเต็ม 100% ในครั้งเดียว', 'Award', 'แบบทดสอบ', 'ได้คะแนน 100%', 100, 'rare'),
('ach-coder-start', 'นักเขียนโปรแกรมหน้าใหม่', 'ผ่านโจทย์การฝึกเขียนโค้ดข้อแรกใน Practice Lab', 'Code2', 'โค้ดดิ้ง', 'ผ่านโจทย์ 1 ข้อ', 60, 'common'),
('ach-iot-maker', 'นักประดิษฐ์ IoT', 'ส่งผลงานโปรเจกต์ฮาร์ดแวร์หรือ ESP32 ลงใน Studio', 'Cpu', 'โปรเจกต์', 'สร้างโปรเจกต์ IoT', 150, 'epic')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.user_achievements (user_id, achievement_id) VALUES
('33333333-3333-3333-3333-333333333333', 'ach-first-login'),
('33333333-3333-3333-3333-333333333333', 'ach-first-lesson'),
('33333333-3333-3333-3333-333333333333', 'ach-quiz-perfect')
ON CONFLICT (user_id, achievement_id) DO NOTHING;

-- Daily Challenges
INSERT INTO public.daily_challenges (id, title, description, type, difficulty, xp_reward, estimated_minutes) VALUES
('daily-1', 'ฝึกพิมพ์สัมผัสคำสั่ง HTML 1 นาที', 'พิมพ์โค้ด HTML ให้ได้ WPM ไม่ต่ำกว่า 30 คำต่อนาที', 'typing', 'ง่าย', 40, 5),
('daily-2', 'คำนวณบิตเลขฐานสอง 5 ข้อ', 'แปลงเลขฐานสองเป็นฐานสิบในใจให้ถูกต้อง', 'quiz', 'ง่าย', 30, 5)
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------
-- 15. Classroom Management
-- ---------------------------------------------------------------------
INSERT INTO public.classes (id, code, name, description, teacher_id, level, academic_year, is_active) VALUES
(
    'c0000000-0000-0000-0000-000000000001',
    'SCI401-2569',
    'วิทยาการคำนวณ ม.4/1',
    'ห้องเรียนวิชาวิทยาการคำนวณและเทคโนโลยีสารสนเทศ ภาคเรียนที่ 1/2569',
    '22222222-2222-2222-2222-222222222222',
    'ม.4',
    '2569',
    true
)
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.class_members (class_id, student_id) VALUES
('c0000000-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333333')
ON CONFLICT (class_id, student_id) DO NOTHING;

INSERT INTO public.assignments (id, class_id, title, description, course_id, lesson_id, due_date, max_points, created_by) VALUES
(
    'a0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    'ใบงานที่ 1: วิเคราะห์วงจร IPOS Cycle ในชีวิตประจำวัน',
    'ให้นักเรียนยกตัวอย่างอุปกรณ์เทคโนโลยีรอบตัว 1 ชิ้น แล้วอธิบายขั้นตอนการทำงานของ Input, Processing, Output และ Storage',
    'comp-fund-101',
    'les-comp-1-1',
    now() + INTERVAL '7 days',
    20,
    '22222222-2222-2222-2222-222222222222'
)
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------
-- 16. Enrollments and Lesson Progress
-- ---------------------------------------------------------------------
INSERT INTO public.enrollments (user_id, course_id, progress, completed_lessons, last_lesson_id) VALUES
(
    '33333333-3333-3333-3333-333333333333',
    'comp-fund-101',
    50,
    ARRAY['les-comp-1-1', 'les-comp-1-2']::TEXT[],
    'les-comp-2-1'
),
(
    '33333333-3333-3333-3333-333333333333',
    'html-css-101',
    33,
    ARRAY['les-html-1-1']::TEXT[],
    'les-html-1-2'
)
ON CONFLICT (user_id, course_id) DO NOTHING;

INSERT INTO public.lesson_progress (user_id, lesson_id, course_id, completed, completed_at, quiz_score, time_spent) VALUES
('33333333-3333-3333-3333-333333333333', 'les-comp-1-1', 'comp-fund-101', true, now() - INTERVAL '2 days', NULL, 900),
('33333333-3333-3333-3333-333333333333', 'les-comp-1-2', 'comp-fund-101', true, now() - INTERVAL '2 days', 100, 360),
('33333333-3333-3333-3333-333333333333', 'les-html-1-1', 'html-css-101', true, now() - INTERVAL '1 day', NULL, 850)
ON CONFLICT (user_id, lesson_id) DO NOTHING;

-- ---------------------------------------------------------------------
-- 17. Community Discussions & Comments
-- ---------------------------------------------------------------------
INSERT INTO public.discussions (id, author_id, title, content, category, likes, status) VALUES
(
    'disc-1',
    '33333333-3333-3333-3333-333333333333',
    'เด็ก ม.4 เพิ่งเริ่มต้น ควรเรียนเขียนโปรแกรมภาษา C++ หรือสร้างเว็บก่อนดีครับ?',
    'สวัสดีครับเพื่อนๆ และอาจารย์ อยากขอคำแนะนำว่าสำหรับคนที่ไม่มีพื้นฐานการเขียนโค้ดมาก่อนเลย ควรเริ่มจากภาษา C++ ตามหลักสูตร สอวน. หรือเริ่มจาก HTML/CSS/JS เพื่อเห็นผลลัพธ์เป็นภาพก่อนดีครับ',
    'เขียนโปรแกรม',
    12,
    'active'
),
(
    'disc-2',
    '44444444-4444-4444-4444-444444444444',
    'แชร์เทคนิคการต่อวงจร ESP32 กับเซ็นเซอร์ DHT22 โดยไม่ให้เกิดค่าผิดพลาด (NaN)',
    'สำหรับเพื่อนๆ ที่เจอปัญหา DHT22 อ่านค่าได้เป็น nan ให้ตรวจเช็คว่าต่อตัวต้านทาน Pull-up 10k ระหว่างขา VCC กับขา DATA แล้วหรือยังนะคะ และอย่าลืมใส่ delay อย่างน้อย 2 วินาทีระหว่างการอ่านค่าแต่ละครั้งด้วยค่ะ',
    'ESP32 & IoT',
    24,
    'active'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.comments (id, discussion_id, author_id, content, likes) VALUES
(
    'c-1',
    'disc-1',
    '22222222-2222-2222-2222-222222222222',
    'แนะนำให้เริ่มจากพื้นฐานการคิดเชิงคำนวณ (Computational Thinking) ควบคู่กับ HTML/CSS ก่อนครับ เพื่อให้เห็นภาพการทำงานและมีกำลังใจ จากนั้นค่อยต่อยอดไป C++ สำหรับการฝึกตรรกะและอัลกอริทึมที่เข้มข้นครับ',
    5
),
(
    'c-2',
    'disc-1',
    '44444444-4444-4444-4444-444444444444',
    'พี่แนะนำให้ลองเล่นใน Practice Lab ของที่นี่ก่อนเลยครับ มีทั้ง Web Studio และ C++ Lab ลองพิมพ์ตามตัวอย่างดูว่าเราชอบทางไหนมากกว่ากัน!',
    3
),
(
    'c-3',
    'disc-2',
    '33333333-3333-3333-3333-333333333333',
    'ขอบคุณมากครับ! ผมติดปัญหานี้มาสองวันแล้ว พอใส่ตัวต้านทาน Pull-up ค่าขึ้นทันทีเลยครับ',
    4
)
ON CONFLICT (id) DO NOTHING;
