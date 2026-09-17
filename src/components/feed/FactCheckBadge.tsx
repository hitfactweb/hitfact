import React from "react";
import { VerdictType } from "@/types";
import { CheckCircle2, XCircle, AlertTriangle, HelpCircle, ShieldAlert } from "lucide-react";

interface FactCheckBadgeProps {
  verdict: VerdictType | string;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

export const FactCheckBadge: React.FC<FactCheckBadgeProps> = ({
  verdict,
  size = "md",
  showIcon = true,
}) => {
  const normVerdict = (verdict || "UNVERIFIED").toUpperCase() as VerdictType;

  const configs: Record<
    VerdictType,
    { label: string; bg: string; text: string; border: string; icon: React.ReactNode }
  > = {
    TRUE: {
      label: "VERIFIED TRUE",
      bg: "bg-emerald-50 dark:bg-emerald-950/70",
      text: "text-emerald-700 dark:text-emerald-400",
      border: "border-emerald-300 dark:border-emerald-600/50",
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
    },
    FALSE: {
      label: "VERIFIED FALSE",
      bg: "bg-red-50 dark:bg-red-950/70",
      text: "text-red-700 dark:text-red-400",
      border: "border-red-300 dark:border-red-600/50",
      icon: <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />,
    },
    MISLEADING: {
      label: "MISLEADING",
      bg: "bg-amber-50 dark:bg-amber-950/70",
      text: "text-amber-800 dark:text-amber-400",
      border: "border-amber-300 dark:border-amber-600/50",
      icon: <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
    },
    PARTLY_TRUE: {
      label: "PARTLY TRUE",
      bg: "bg-yellow-50 dark:bg-yellow-950/70",
      text: "text-yellow-800 dark:text-yellow-400",
      border: "border-yellow-300 dark:border-yellow-600/50",
      icon: <HelpCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />,
    },
    UNVERIFIED: {
      label: "UNVERIFIED",
      bg: "bg-zinc-100 dark:bg-zinc-800/80",
      text: "text-zinc-800 dark:text-zinc-300",
      border: "border-zinc-300 dark:border-zinc-600/50",
      icon: <ShieldAlert className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />,
    },
  };

  const config = configs[normVerdict] || configs.UNVERIFIED;

  const sizeClasses = {
    sm: "px-2.5 py-0.5 text-[10px] font-extrabold tracking-wider",
    md: "px-3 py-1 text-xs font-bold tracking-wider",
    lg: "px-4 py-1.5 text-sm font-extrabold tracking-widest",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-sm border uppercase shadow-xs ${config.bg} ${config.text} ${config.border} ${sizeClasses[size]}`}
    >
      {showIcon && config.icon}
      <span>{config.label}</span>
    </span>
  );
};
