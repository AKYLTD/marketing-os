"use client";

import { ReactNode } from "react";

interface MetricCardProps {
  value: string;
  label: string;
  change?: string;
  changeDir?: "up" | "down";
  color?: string;
  info?: ReactNode;
}

export default function MetricCard({ value, label, change, changeDir = "up", color, info }: MetricCardProps) {
  return (
    <div className="bg-[var(--bg2)] rounded-xl border border-[var(--border)] p-4 transition-shadow hover:shadow-md">
      <div className="text-2xl font-light tracking-tight" style={color ? { color } : {}}>
        {value}
      </div>
      <div className="text-[12px] text-[var(--text3)] mt-1 flex items-center gap-1">
        {label}
        {info}
      </div>
      {change && (
        <div className={`text-[12px] font-medium mt-1 ${changeDir === "up" ? "text-green-600" : "text-red-500"}`}>
          {changeDir === "up" ? "↑" : "↓"} {change}
        </div>
      )}
    </div>
  );
}
