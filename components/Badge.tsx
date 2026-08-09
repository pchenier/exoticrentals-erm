import { ShieldCheck, UserCheck, ClipboardCheck, Star, Lock, Award, Zap, Sparkles } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  "shield-check": ShieldCheck,
  "user-check": UserCheck,
  "clipboard-check": ClipboardCheck,
  "star": Star,
  "lock": Lock,
  "award": Award,
  "zap": Zap,
  "sparkles": Sparkles,
};

interface BadgeProps {
  name: string;
  label: string;
  description?: string;
  icon?: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export default function Badge({ name, label, description, icon, size = "md", showLabel = true }: BadgeProps) {
  const IconComponent = icon ? iconMap[icon] : ShieldCheck;
  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-base px-4 py-2",
  };
  const iconSizes = { sm: 12, md: 14, lg: 16 };

  return (
    <div
      className={`inline-flex items-center gap-1.5 border border-champagne/30 bg-obsidian/80 backdrop-blur-sm ${sizeClasses[size]} group relative`}
      title={description || label}
    >
      {IconComponent && (
        <IconComponent size={iconSizes[size]} className="text-champagne" />
      )}
      {showLabel && (
        <span className="font-spec tracking-[0.1em] text-champagne">
          {label}
        </span>
      )}
      {/* Tooltip */}
      {description && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-graphite text-warm-white text-xs max-w-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 border border-graphite">
          <div className="font-spec text-champagne mb-1">{label}</div>
          <div className="text-silver">{description}</div>
        </div>
      )}
    </div>
  );
}
