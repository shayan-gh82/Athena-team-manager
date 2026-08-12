import { Briefcase, Code2, GraduationCap, Globe2, Megaphone, Palette, Rocket, Smartphone, type LucideIcon } from 'lucide-react'

export const projectIconOptions: Array<{ key: string; label: string; icon: LucideIcon }> = [
  { key: 'rocket', label: 'Rocket', icon: Rocket },
  { key: 'code', label: 'Code', icon: Code2 },
  { key: 'globe', label: 'Website', icon: Globe2 },
  { key: 'mobile', label: 'Mobile', icon: Smartphone },
  { key: 'design', label: 'Design', icon: Palette },
  { key: 'university', label: 'University', icon: GraduationCap },
  { key: 'business', label: 'Business', icon: Briefcase },
  { key: 'marketing', label: 'Marketing', icon: Megaphone },
]

export default function ProjectIcon({ iconKey, size = 18 }: { iconKey?: string; size?: number }) {
  const Icon = projectIconOptions.find((item) => item.key === iconKey)?.icon ?? Rocket
  return <Icon size={size} />
}
