import React, { useState } from 'react';
import {
  FolderGit2,
  Plus,
  ExternalLink,
  CheckCircle2,
  Clock,
  Award,
  Layers,
  Code2,
  Trash2,
  Sparkles,
  Check,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sampleProjects } from '../data/courses';
import type { StudentProject, Project } from '../types';

const GithubIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export const ProjectStudio: React.FC = () => {
  const { state, saveProject, deleteProject, addNotification } = useApp();
  const [activeTab, setActiveTab] = useState<'catalog' | 'saved'>('catalog');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'เริ่มต้น' | 'ปานกลาง' | 'ขั้นสูง'>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(sampleProjects[0] || null);

  // Modal for submitting/saving a new project
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('web-development');
  const [newDifficulty, setNewDifficulty] = useState<'เริ่มต้น' | 'ปานกลาง' | 'ขั้นสูง'>('เริ่มต้น');
  const [newDemoUrl, setNewDemoUrl] = useState('');
  const [newRepoUrl, setNewRepoUrl] = useState('');
  const [newSkills, setNewSkills] = useState('HTML, CSS, JavaScript');

  // Checklist state for selected project
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});

  const filteredCatalog = sampleProjects.filter((p) => {
    if (selectedDifficulty !== 'all' && p.difficulty !== selectedDifficulty) return false;
    return true;
  });

  const handleToggleStep = (stepIdx: number) => {
    const key = `${selectedProject?.id}_${stepIdx}`;
    setCheckedSteps((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveStudentProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const project: StudentProject = {
      id: 'proj-' + Date.now(),
      userId: state.user?.id || 'guest',
      title: newTitle.trim(),
      description: newDesc.trim() || 'โครงงานที่พัฒนาขึ้นเพื่อการเรียนรู้',
      category: newCategory,
      difficulty: newDifficulty,
      tags: newSkills.split(',').map((s) => s.trim()).filter(Boolean),
      demoUrl: newDemoUrl.trim(),
      repoUrl: newRepoUrl.trim(),
      skills: newSkills.split(',').map((s) => s.trim()).filter(Boolean),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveProject(project);
    setShowSubmitModal(false);
    setNewTitle('');
    setNewDesc('');
    setNewDemoUrl('');
    setNewRepoUrl('');
    setActiveTab('saved');
  };

  return (
    <div className="main-content" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Page Header */}
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
              <FolderGit2 size={22} />
            </div>
            <div>
              <h1 className="page-header-title">ห้องสร้างโปรเจกต์ (Project Studio)</h1>
              <p className="page-header-desc">
                สร้างชิ้นงานจริงตามแนวทางปฏิบัติ บันทึกผลงาน และสะสมลงในแฟ้มผลงานดิจิทัล
              </p>
            </div>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => setShowSubmitModal(true)}
            style={{ gap: '6px' }}
          >
            <Plus size={16} /> บันทึกผลงานโปรเจกต์ใหม่
          </button>
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
          <button
            className={`btn btn-sm ${activeTab === 'catalog' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('catalog')}
          >
            คลังโจทย์โปรเจกต์แนะนำ ({sampleProjects.length})
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'saved' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('saved')}
          >
            โปรเจกต์ที่บันทึกแล้วของฉัน ({state.savedProjects.length})
          </button>
        </div>
      </div>

      {activeTab === 'saved' ? (
        /* Saved Projects List */
        <div>
          {state.savedProjects.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--color-accent-primary-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-accent-primary)',
                  margin: '0 auto var(--space-4)',
                }}
              >
                <FolderGit2 size={28} />
              </div>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', marginBottom: 'var(--space-2)' }}>
                ยังไม่มีโปรเจกต์ที่บันทึกไว้
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
                เริ่มสร้างผลงานชิ้นแรก แล้วกด "บันทึกผลงานโปรเจกต์ใหม่" ด้านบนเพื่อนำไปจัดแสดงใน Portfolio
              </p>
              <button className="btn btn-primary btn-sm" onClick={() => setShowSubmitModal(true)}>
                <Plus size={14} /> บันทึกโปรเจกต์ตอนนี้
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2">
              {state.savedProjects.map((proj) => (
                <div key={proj.id} className="card card-hover" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-2)' }}>
                    <span className="badge badge-blue">{proj.difficulty}</span>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => deleteProject(proj.id)}
                      style={{ color: 'var(--color-error)', padding: '2px 6px' }}
                      title="ลบโปรเจกต์"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', marginBottom: 'var(--space-1)' }}>
                    {proj.title}
                  </h3>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: 'var(--space-4)', flex: 1 }}>
                    {proj.description}
                  </p>

                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: 'var(--space-4)' }}>
                    {proj.skills.map((s, idx) => (
                      <span key={idx} className="badge badge-emerald" style={{ fontSize: '10px' }}>
                        {s}
                      </span>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: 'var(--space-2)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-3)' }}>
                    {proj.demoUrl && (
                      <a
                        href={proj.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-outline btn-sm"
                        style={{ flex: 1, gap: '4px' }}
                      >
                        <ExternalLink size={13} /> ลิงก์สาธิต (Demo)
                      </a>
                    )}
                    {proj.repoUrl && (
                      <a
                        href={proj.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-outline btn-sm"
                        style={{ flex: 1, gap: '4px' }}
                      >
                        <GithubIcon size={13} /> ซอร์สโค้ด (GitHub)
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Project Catalog & Step-by-Step Guide */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)', alignItems: 'flex-start' }}>
          {/* Left Project List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ display: 'flex', gap: '4px', background: 'var(--color-bg-surface)', padding: '4px', borderRadius: 'var(--radius-md)' }}>
              {(['all', 'เริ่มต้น', 'ปานกลาง'] as const).map((diff) => (
                <button
                  key={diff}
                  className={`btn btn-sm ${selectedDifficulty === diff ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ flex: 1, fontSize: 'var(--text-xs)' }}
                  onClick={() => setSelectedDifficulty(diff)}
                >
                  {diff === 'all' ? 'ทุกระดับ' : diff}
                </button>
              ))}
            </div>

            {filteredCatalog.map((proj) => {
              const isSelected = selectedProject?.id === proj.id;
              return (
                <div
                  key={proj.id}
                  onClick={() => setSelectedProject(proj)}
                  className={`card ${isSelected ? 'selected' : 'card-hover'}`}
                  style={{
                    cursor: 'pointer',
                    borderColor: isSelected ? 'var(--color-accent-primary)' : 'var(--color-border)',
                    background: isSelected ? 'var(--color-accent-primary-muted)' : 'var(--color-bg-surface)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                    <span className="badge badge-blue">{proj.difficulty}</span>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                      ⏱️ ~{proj.estimatedHours} ชม.
                    </span>
                  </div>

                  <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', marginBottom: 'var(--space-1)' }}>
                    {proj.title}
                  </h3>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                    {proj.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right Selected Project Details & Step-by-Step Guide */}
          {selectedProject && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
              <div>
                <div style={{ display: 'flex', gap: '6px', marginBottom: 'var(--space-2)' }}>
                  <span className="badge badge-blue">{selectedProject.difficulty}</span>
                  <span className="badge badge-violet">ใช้เวลาประมาณ {selectedProject.estimatedHours} ชั่วโมง</span>
                </div>
                <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold', marginBottom: 'var(--space-2)' }}>
                  {selectedProject.title}
                </h2>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                  {selectedProject.description}
                </p>
              </div>

              {/* Objectives */}
              <div>
                <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', marginBottom: 'var(--space-2)' }}>
                  🎯 จุดประสงค์การเรียนรู้:
                </h4>
                <ul style={{ paddingLeft: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {selectedProject.objectives.map((obj, idx) => (
                    <li key={idx} style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                      {obj}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Steps with Code snippets and Checklist */}
              <div>
                <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', marginBottom: 'var(--space-3)' }}>
                  📝 ขั้นตอนการลงมือทำ (Step-by-Step Checklist):
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  {selectedProject.steps.map((step, sIdx) => {
                    const stepKey = `${selectedProject.id}_${sIdx}`;
                    const isDone = checkedSteps[stepKey] || false;

                    return (
                      <div
                        key={sIdx}
                        style={{
                          padding: 'var(--space-4)',
                          background: 'var(--color-bg-secondary)',
                          borderRadius: 'var(--radius-lg)',
                          border: isDone ? '1px solid var(--color-success)' : '1px solid var(--color-border)',
                        }}
                      >
                        <div
                          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
                          onClick={() => handleToggleStep(sIdx)}
                        >
                          <div
                            style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '4px',
                              border: isDone ? 'none' : '2px solid var(--color-border)',
                              background: isDone ? 'var(--color-success)' : 'transparent',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                            }}
                          >
                            {isDone && <Check size={14} />}
                          </div>
                          <div style={{ fontWeight: 'bold', fontSize: 'var(--text-sm)', color: isDone ? 'var(--color-success)' : 'var(--color-text-primary)' }}>
                            ขั้นตอนที่ {sIdx + 1}: {step.title}
                          </div>
                        </div>

                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: '8px', paddingLeft: '30px' }}>
                          {step.description}
                        </p>

                        {step.code && (
                          <div style={{ marginTop: 'var(--space-3)', paddingLeft: '30px' }}>
                            <pre
                              style={{
                                background: '#0a0f1d',
                                padding: 'var(--space-3)',
                                borderRadius: 'var(--radius-md)',
                                fontSize: 'var(--text-xs)',
                                fontFamily: 'var(--font-mono)',
                                overflowX: 'auto',
                                color: '#38bdf8',
                              }}
                            >
                              <code>{step.code}</code>
                            </pre>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Submit CTA */}
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setNewTitle(selectedProject.title);
                    setNewCategory(selectedProject.category);
                    setNewDifficulty(selectedProject.difficulty);
                    setNewSkills(selectedProject.skills.join(', '));
                    setShowSubmitModal(true);
                  }}
                  style={{ gap: '6px' }}
                >
                  <Sparkles size={16} /> ส่งผลงานโปรเจกต์นี้
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Submit / Save Project Modal */}
      {showSubmitModal && (
        <div className="modal-overlay" onClick={() => setShowSubmitModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">💾 บันทึกผลงานโครงงานดิจิทัล</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowSubmitModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveStudentProject}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">ชื่อผลงาน / โครงงาน</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="เช่น เว็บไซต์แนะนำโรงเรียน, เครื่องวัดอุณหภูมิ ESP32"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">คำอธิบายโครงงานและแนวคิด</label>
                  <textarea
                    className="form-input"
                    style={{ minHeight: '80px' }}
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="อธิบายว่าโปรเจกต์นี้ทำงานอย่างไร ใช้วิธีการใดแก้ปัญหา..."
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                  <div className="form-group">
                    <label className="form-label">ระดับความยาก</label>
                    <select
                      className="form-input"
                      value={newDifficulty}
                      onChange={(e) => setNewDifficulty(e.target.value as any)}
                    >
                      <option value="เริ่มต้น">เริ่มต้น</option>
                      <option value="ปานกลาง">ปานกลาง</option>
                      <option value="ขั้นสูง">ขั้นสูง</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">ทักษะที่ใช้ (คั่นด้วยจุลภาค)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={newSkills}
                      onChange={(e) => setNewSkills(e.target.value)}
                      placeholder="HTML, CSS, C++, ESP32"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">ลิงก์สาธิตออนไลน์ (Demo URL - ถ้ามี)</label>
                  <input
                    type="url"
                    className="form-input"
                    value={newDemoUrl}
                    onChange={(e) => setNewDemoUrl(e.target.value)}
                    placeholder="https://myproject.web.app"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">ลิงก์โค้ด GitHub (Repository URL - ถ้ามี)</label>
                  <input
                    type="url"
                    className="form-input"
                    value={newRepoUrl}
                    onChange={(e) => setNewRepoUrl(e.target.value)}
                    placeholder="https://github.com/username/project"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowSubmitModal(false)}>
                  ยกเลิก
                </button>
                <button type="submit" className="btn btn-primary" disabled={!newTitle.trim()}>
                  บันทึกลงแฟ้มผลงาน
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectStudio;
