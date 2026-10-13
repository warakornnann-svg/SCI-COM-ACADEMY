// ============================================
// SCI-COM ACADEMY — Type Definitions
// ============================================

export interface User {
  id: string;
  email: string;
  displayName: string;
  avatar?: string;
  role: 'guest' | 'student' | 'teacher' | 'admin';
  level: 'ม.4' | 'ม.5' | 'ม.6';
  xp: number;
  streak: number;
  createdAt: string;
}

export interface CourseCategory {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  description: string;
  color: string;
  courseCount: number;
}

export interface Course {
  id: string;
  categoryId: string;
  title: string;
  titleEn?: string;
  description: string;
  thumbnail?: string;
  icon: string;
  level: 'ม.4' | 'ม.5' | 'ม.6' | 'ทุกระดับ';
  difficulty: 'เริ่มต้น' | 'ปานกลาง' | 'ขั้นสูง';
  estimatedHours: number;
  prerequisites: string[];
  objectives: string[];
  modules: Module[];
  status: 'draft' | 'published' | 'archived';
  tags: string[];
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  moduleId: string;
  courseId: string;
  title: string;
  type: 'reading' | 'interactive' | 'quiz' | 'coding' | 'project';
  content: LessonContent;
  estimatedMinutes: number;
  order: number;
  status: 'draft' | 'published';
}

export interface LessonContent {
  sections: ContentSection[];
  quiz?: Quiz;
}

export interface ContentSection {
  type: 'text' | 'heading' | 'code' | 'image' | 'callout' | 'list' | 'diagram' | 'interactive';
  content: string;
  language?: string;
  items?: string[];
  variant?: 'info' | 'tip' | 'warning' | 'important';
  alt?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  passingScore: number;
  timeLimit?: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'ordering';
  options: QuizOption[];
  explanation: string;
  points: number;
}

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Enrollment {
  userId: string;
  courseId: string;
  enrolledAt: string;
  progress: number;
  completedLessons: string[];
  lastAccessedAt: string;
  lastLessonId?: string;
}

export interface LessonProgress {
  userId: string;
  lessonId: string;
  courseId: string;
  completed: boolean;
  completedAt?: string;
  quizScore?: number;
  timeSpent: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  condition: string;
  xpReward: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export interface UserAchievement {
  userId: string;
  achievementId: string;
  unlockedAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  difficulty: 'เริ่มต้น' | 'ปานกลาง' | 'ขั้นสูง';
  estimatedHours: number;
  skills: string[];
  objectives: string[];
  steps: ProjectStep[];
  category: string;
  thumbnail?: string;
}

export interface ProjectStep {
  title: string;
  description: string;
  code?: string;
  language?: string;
  tips?: string[];
}

export interface ProgrammingChallenge {
  id: string;
  category: 'variables' | 'conditions' | 'loops' | 'functions' | 'arrays' | 'problem-solving';
  categoryLabel: string;
  title: string;
  grade: 'ม.4' | 'ม.5' | 'ม.6';
  difficulty: 'เริ่มต้น' | 'ปานกลาง' | 'ขั้นสูง';
  description: string;
  inputDescription: string;
  outputDescription: string;
  sampleInput: string;
  sampleOutput: string;
  hint: string;
  testCases: Array<{ input: string; expectedOutput: string }>;
  initialJsCode: string;
  initialCppCode: string;
  solutionRunner?: (input: string) => string;
  createdBy?: string;
  createdAt?: string;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  type: 'typing' | 'coding' | 'quiz' | 'design';
  difficulty: 'ง่าย' | 'ปานกลาง' | 'ยาก';
  xpReward: number;
  estimatedMinutes: number;
  date: string;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  courses: string[];
  estimatedWeeks: number;
}

export interface TypingResult {
  wpm: number;
  cpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
  duration: number;
  language: 'th' | 'en' | 'code';
  date: string;
}

export interface SearchResult {
  id: string;
  type: 'course' | 'lesson' | 'project' | 'topic';
  title: string;
  description: string;
  url: string;
  category?: string;
}

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  badge?: string | number;
  section?: string;
  children?: NavItem[];
}

export interface StudentProject {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'เริ่มต้น' | 'ปานกลาง' | 'ขั้นสูง';
  tags: string[];
  demoUrl?: string;
  repoUrl?: string;
  skills: string[];
  createdAt: string;
  updatedAt: string;
}

export interface LabProgress {
  userId: string;
  labId: string;
  exerciseId: string;
  completed: boolean;
  score?: number;
  completedAt?: string;
  savedCode?: string;
}

export interface PortfolioProfile {
  bio: string;
  isPublic: boolean;
  theme: 'slate' | 'cyber' | 'minimal';
  contactEmail?: string;
  githubUrl?: string;
  customSkills: string[];
}

