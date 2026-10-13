import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  BookOpen,
  Clock,
  Layers,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { courses, courseCategories } from '../data/courses';
import CategoryIcon from '../components/common/CategoryIcon';

export const CourseCatalog: React.FC = () => {
  const { state, enrollCourse, getCourseProgress } = useApp();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Search and filter states
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'all';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'ม.4' | 'ม.5' | 'ม.6'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'เริ่มต้น' | 'ปานกลาง' | 'ขั้นสูง'>('all');

  const allCourses = [...courses, ...state.customCourses];

  // Filtering logic
  const filteredCourses = useMemo(() => {
    return allCourses.filter((course) => {
      // Search query match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = course.title.toLowerCase().includes(query);
        const matchesTitleEn = course.titleEn?.toLowerCase().includes(query) || false;
        const matchesDesc = course.description.toLowerCase().includes(query);
        const matchesTags = course.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchesTitle && !matchesTitleEn && !matchesDesc && !matchesTags) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'all' && course.categoryId !== selectedCategory) {
        return false;
      }

      // Level filter
      if (selectedLevel !== 'all' && course.level !== selectedLevel && course.level !== 'ทุกระดับ') {
        return false;
      }

      // Difficulty filter
      if (selectedDifficulty !== 'all' && course.difficulty !== selectedDifficulty) {
        return false;
      }

      return true;
    });
  }, [allCourses, searchQuery, selectedCategory, selectedLevel, selectedDifficulty]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedLevel('all');
    setSelectedDifficulty('all');
    setSearchParams({});
  };

  return (
    <div className="main-content" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
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
            <BookOpen size={22} />
          </div>
          <div>
            <h1 className="page-header-title">คลังบทเรียน (Course Catalog)</h1>
            <p className="page-header-desc">
              หลักสูตรเทคโนโลยีครบวงจรสำหรับ ม.4 - ม.6 สายวิทย์-คอม จากพื้นฐานจนถึงโครงงานระดับสูง
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ position: 'relative', marginTop: 'var(--space-4)', maxWidth: '600px' }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-text-tertiary)',
            }}
          />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '42px', fontSize: 'var(--text-base)' }}
            placeholder="ค้นหาชื่อคอร์ส, ภาษาโปรแกรม, ฮาร์ดแวร์, หรือคีย์เวิร์ด เช่น C++, HTML, ESP32..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: 'var(--color-text-tertiary)',
                cursor: 'pointer',
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Chips Carousel */}
      <div>
        <div style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-2)', textTransform: 'uppercase' }}>
          หมวดหมู่วิชา ({courseCategories.length} หมวด)
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)', overflowX: 'auto', paddingBottom: 'var(--space-2)' }}>
          <button
            className={`btn btn-sm ${selectedCategory === 'all' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setSelectedCategory('all')}
            style={{ whiteSpace: 'nowrap' }}
          >
            ทั้งหมด ({allCourses.length})
          </button>
          {courseCategories.map((cat) => {
            const count = allCourses.filter((c) => c.categoryId === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setSelectedCategory(cat.id)}
                style={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <CategoryIcon name={cat.icon} size={15} />
                <span>{cat.name}</span>
                <span style={{ opacity: 0.7, fontSize: '11px' }}>({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-Filters: Level & Difficulty */}
      <div
        style={{
          display: 'flex',
          gap: 'var(--space-4)',
          alignItems: 'center',
          flexWrap: 'wrap',
          background: 'var(--color-bg-surface)',
          padding: 'var(--space-3) var(--space-4)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={16} color="var(--color-text-tertiary)" />
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--color-text-secondary)' }}>ระดับชั้น:</span>
          <div style={{ display: 'flex', gap: '4px' }}>
            {(['all', 'ม.4', 'ม.5', 'ม.6'] as const).map((lvl) => (
              <button
                key={lvl}
                className={`btn btn-sm ${selectedLevel === lvl ? 'btn-primary' : 'btn-ghost'}`}
                style={{ padding: '2px 8px', fontSize: 'var(--text-xs)' }}
                onClick={() => setSelectedLevel(lvl)}
              >
                {lvl === 'all' ? 'ทุกระดับ' : lvl}
              </button>
            ))}
          </div>
        </div>

        <div style={{ height: '20px', width: '1px', background: 'var(--color-border)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--color-text-secondary)' }}>ระดับความยาก:</span>
          <div style={{ display: 'flex', gap: '4px' }}>
            {(['all', 'เริ่มต้น', 'ปานกลาง', 'ขั้นสูง'] as const).map((diff) => (
              <button
                key={diff}
                className={`btn btn-sm ${selectedDifficulty === diff ? 'btn-primary' : 'btn-ghost'}`}
                style={{ padding: '2px 8px', fontSize: 'var(--text-xs)' }}
                onClick={() => setSelectedDifficulty(diff)}
              >
                {diff === 'all' ? 'ทั้งหมด' : diff}
              </button>
            ))}
          </div>
        </div>

        {(searchQuery || selectedCategory !== 'all' || selectedLevel !== 'all' || selectedDifficulty !== 'all') && (
          <button
            className="btn btn-ghost btn-sm"
            onClick={handleResetFilters}
            style={{ marginLeft: 'auto', color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)' }}
          >
            ล้างตัวกรองทั้งหมด
          </button>
        )}
      </div>

      {/* Results Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
          พบทั้งหมด <strong style={{ color: 'var(--color-text-primary)' }}>{filteredCourses.length}</strong> คอร์สเรียน
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--color-bg-surface-hover)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-text-tertiary)',
              margin: '0 auto var(--space-4)',
            }}
          >
            <Search size={32} />
          </div>
          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', marginBottom: 'var(--space-2)' }}>
            ไม่พบคอร์สเรียนที่ตรงกับเงื่อนไขการค้นหา
          </h3>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>
            ลองเปลี่ยนคำค้นหา หรือล้างตัวกรองเพื่อดูคอร์สทั้งหมด
          </p>
          <button className="btn btn-outline btn-sm" onClick={handleResetFilters}>
            ล้างตัวกรองและแสดงทั้งหมด
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3">
          {filteredCourses.map((course) => {
            const isCourseEnrolled = state.enrollments.some((e) => e.courseId === course.id);
            const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
            const progress = getCourseProgress(course.id, totalLessons);

            return (
              <div
                key={course.id}
                className="card card-hover"
                style={{ display: 'flex', flexDirection: 'column' }}
              >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: 'var(--radius-lg)',
                      background: 'var(--color-accent-primary-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-accent-primary)',
                    }}
                  >
                    <CategoryIcon name={course.icon} size={24} />
                  </div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <span className="badge badge-blue">{course.level}</span>
                    <span className="badge badge-violet">{course.difficulty}</span>
                  </div>
                </div>

                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', marginBottom: 'var(--space-1)' }}>
                  {course.title}
                </h3>
                {course.titleEn && (
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-2)' }}>
                    {course.titleEn}
                  </p>
                )}
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: 'var(--space-4)', flex: 1 }}>
                  {course.description}
                </p>

                {/* Tags */}
                {course.tags.length > 0 && (
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: 'var(--space-3)' }}>
                    {course.tags.slice(0, 3).map((tag, tIdx) => (
                      <span key={tIdx} style={{ fontSize: '10px', background: 'var(--color-bg-secondary)', padding: '2px 6px', borderRadius: '4px', color: 'var(--color-text-secondary)' }}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Meta info */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                  <span>⏳ ~{course.estimatedHours} ชั่วโมง</span>
                  <span>📑 {course.modules.length} โมดูล ({totalLessons} บท)</span>
                </div>

                {/* Progress bar if enrolled */}
                {isCourseEnrolled && (
                  <div style={{ marginBottom: 'var(--space-3)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', marginBottom: '2px' }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>ความก้าวหน้า</span>
                      <span style={{ fontWeight: 'bold', color: 'var(--color-accent-primary)' }}>{progress}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <button
                    className={`btn ${isCourseEnrolled ? 'btn-primary' : 'btn-outline'} btn-sm`}
                    style={{ width: '100%' }}
                    onClick={() => {
                      if (!isCourseEnrolled) enrollCourse(course.id);
                      navigate(`/courses/${course.id}`);
                    }}
                  >
                    {isCourseEnrolled ? 'เรียนต่อ' : 'ดูรายละเอียดคอร์ส'} <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CourseCatalog;
