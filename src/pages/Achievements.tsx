import React, { useState } from 'react';
import {
  Trophy,
  Zap,
  Flame,
  CheckCircle2,
  Lock,
  Sparkles,
  Award,
  Filter
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { achievements } from '../data/courses';

export const Achievements: React.FC = () => {
  const { state } = useApp();
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  const user = state.user;
  const userXp = user?.xp || 120;
  const streak = user?.streak || 2;

  // Level calculation
  const getLevelInfo = (xp: number) => {
    if (xp >= 1000) return { level: 5, title: 'ปรมาจารย์ไซเบอร์ (Cyber Master)', nextXp: 1500, currentBase: 1000 };
    if (xp >= 500) return { level: 4, title: 'นักพัฒนาชำนาญการ (Pro Developer)', nextXp: 1000, currentBase: 500 };
    if (xp >= 250) return { level: 3, title: 'ผู้สร้างสรรค์ดิจิทัล (Digital Creator)', nextXp: 500, currentBase: 250 };
    if (xp >= 100) return { level: 2, title: 'นักเรียนรู้สายวิทย์-คอม (Active Learner)', nextXp: 250, currentBase: 100 };
    return { level: 1, title: 'ผู้เริ่มต้น (Beginner Explorer)', nextXp: 100, currentBase: 0 };
  };

  const levelData = getLevelInfo(userXp);
  const progressPercent = Math.min(
    100,
    Math.round(((userXp - levelData.currentBase) / (levelData.nextXp - levelData.currentBase)) * 100)
  );

  const unlockedIds = new Set(state.userAchievements.map((ua) => ua.achievementId));

  const filteredAchievements = achievements.filter((ach) => {
    const isUnlocked = unlockedIds.has(ach.id);
    if (filter === 'unlocked') return isUnlocked;
    if (filter === 'locked') return !isUnlocked;
    return true;
  });

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return <span className="badge badge-amber" style={{ border: '1px solid #f59e0b' }}>Legendary</span>;
      case 'epic':
        return <span className="badge badge-violet">Epic</span>;
      case 'rare':
        return <span className="badge badge-blue">Rare</span>;
      case 'uncommon':
        return <span className="badge badge-emerald">Uncommon</span>;
      default:
        return <span className="badge" style={{ background: 'rgba(255,255,255,0.08)' }}>Common</span>;
    }
  };

  return (
    <div className="main-content" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Page Header */}
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
            <Trophy size={22} />
          </div>
          <div>
            <h1 className="page-header-title">ความสำเร็จและเหรียญรางวัล (Achievements)</h1>
            <p className="page-header-desc">
              สะสมคะแนนประสบการณ์ (XP) เลื่อนระดับชั้น และปลดล็อกเหรียญตราเกียรติยศจากการเรียนรู้จริง
            </p>
          </div>
        </div>
      </div>

      {/* Gamification Level Status Card */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(30, 42, 66, 0.95) 0%, rgba(15, 23, 41, 0.95) 100%)',
          border: '1px solid var(--color-border)',
          padding: 'var(--space-6)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: 'var(--radius-xl)',
                background: 'var(--color-gradient-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontSize: 'var(--text-2xl)',
                fontWeight: 'bold',
                boxShadow: '0 8px 16px rgba(59, 130, 246, 0.3)',
              }}
            >
              Lv.{levelData.level}
            </div>
            <div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent-primary)', fontWeight: 'bold' }}>
                ระดับผู้ใช้งานปัจจุบัน
              </div>
              <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold', margin: '2px 0 0' }}>
                {levelData.title}
              </h2>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <div className="badge badge-amber" style={{ padding: '8px 14px', fontSize: 'var(--text-sm)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Flame size={16} color="#f59e0b" />
              <span>{streak} วันติดกัน</span>
            </div>
            <div className="badge badge-violet" style={{ padding: '8px 14px', fontSize: 'var(--text-sm)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Zap size={16} color="#8b5cf6" />
              <span>{userXp} XP รวม</span>
            </div>
          </div>
        </div>

        {/* Progress to Next Level */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', marginBottom: '4px' }}>
            <span style={{ color: 'var(--color-text-secondary)' }}>ความก้าวหน้าสู่เลเวล {levelData.level + 1}</span>
            <span style={{ fontWeight: 'bold', color: 'var(--color-accent-primary)' }}>
              {userXp} / {levelData.nextXp} XP ({progressPercent}%)
            </span>
          </div>
          <div className="progress-bar" style={{ height: '10px' }}>
            <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button
            className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter('all')}
          >
            เหรียญทั้งหมด ({achievements.length})
          </button>
          <button
            className={`btn btn-sm ${filter === 'unlocked' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter('unlocked')}
          >
            ปลดล็อกแล้ว ({unlockedIds.size})
          </button>
          <button
            className={`btn btn-sm ${filter === 'locked' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter('locked')}
          >
            ยังไม่ปลดล็อก ({achievements.length - unlockedIds.size})
          </button>
        </div>

        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
          ปลดล็อกแล้ว {unlockedIds.size} จาก {achievements.length} เหรียญ ({Math.round((unlockedIds.size / achievements.length) * 100)}%)
        </div>
      </div>

      {/* Achievements Cards Grid */}
      <div className="grid grid-cols-3">
        {filteredAchievements.map((ach) => {
          const isUnlocked = unlockedIds.has(ach.id);
          const unlockedItem = state.userAchievements.find((ua) => ua.achievementId === ach.id);

          return (
            <div
              key={ach.id}
              className="card"
              style={{
                background: isUnlocked ? 'var(--color-bg-surface)' : 'rgba(26, 35, 50, 0.4)',
                border: isUnlocked ? '1px solid var(--color-border-hover)' : '1px solid var(--color-border)',
                opacity: isUnlocked ? 1 : 0.65,
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-xl)',
                    background: isUnlocked ? 'var(--color-accent-primary-muted)' : 'var(--color-bg-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    filter: isUnlocked ? 'none' : 'grayscale(100%)',
                  }}
                >
                  {isUnlocked ? ach.icon : <Lock size={20} color="var(--color-text-tertiary)" />}
                </div>
                {getRarityBadge(ach.rarity)}
              </div>

              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', marginBottom: 'var(--space-1)' }}>
                {ach.title}
              </h3>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: 'var(--space-4)', flex: 1 }}>
                {ach.description}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-3)', fontSize: 'var(--text-xs)' }}>
                <span style={{ color: 'var(--color-warning)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Zap size={13} /> +{ach.xpReward} XP
                </span>
                <span style={{ color: isUnlocked ? 'var(--color-success)' : 'var(--color-text-tertiary)', fontWeight: isUnlocked ? 'bold' : 'normal' }}>
                  {isUnlocked ? '✓ ปลดล็อกแล้ว' : 'ยังไม่ได้รับ'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Achievements;
