import React from 'react';
import {
  Monitor,
  Keyboard,
  Code2,
  Code,
  Globe,
  Terminal,
  Cpu,
  Database,
  FileSpreadsheet,
  Palette,
  Camera,
  Video,
  Wifi,
  Sparkles,
  Trophy,
  Compass,
  BookOpen,
  FolderGit2,
  Award,
  Layers,
  Flame,
  Zap,
  HelpCircle,
  LucideProps
} from 'lucide-react';

interface CategoryIconProps extends LucideProps {
  name: string;
}

const iconMap: Record<string, React.ComponentType<LucideProps>> = {
  Monitor,
  Keyboard,
  Code2,
  Code,
  Globe,
  Terminal,
  Cpu,
  Database,
  FileSpreadsheet,
  Palette,
  Camera,
  Video,
  Wifi,
  Sparkles,
  Trophy,
  Compass,
  BookOpen,
  FolderGit2,
  Award,
  Layers,
  Flame,
  Zap,
  HelpCircle,
};

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, ...props }) => {
  const IconComponent = iconMap[name] || BookOpen;
  return <IconComponent {...props} />;
};

export default CategoryIcon;
