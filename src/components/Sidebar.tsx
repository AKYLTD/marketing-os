"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useTheme } from "./ThemeProvider";
import {
  LayoutDashboard, Palette, Image, CalendarDays, Share2, Send,
  BarChart3, Megaphone, FlaskConical, Star, Settings, Bot,
  ShieldCheck, LogOut, Sun, Moon, Menu, X,
} from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { key: "brand", label: "Brand DNA", icon: Palette, href: "/brand" },
  { key: "media", label: "Media Studio", icon: Image, href: "/media" },
  { key: "calendar", label: "Calendar", icon: CalendarDays, href: "/calendar" },
  { key: "channels", label: "Channels", icon: Share2, href: "/channels" },
  { key: "publishing", label: "Publishing", icon: Send, href: "/publishing" },
  { key: "analytics", label: "Analytics", icon: BarChart3, href: "/analytics" },
  { key: "campaigns", label: "Campaigns", icon: Megaphone, href: "/campaigns" },
  { key: "growth", label: "Growth Lab", icon: FlaskConical, href: "/growth" },
  { key: "dates", label: "Special Dates", icon: Star, href: "/dates" },
  { key: "settings", label: "Settings", icon: Settings, href: "/settings" },
  { key: "agent", label: "AI Agent", icon: Bot, href: "/agent", tier: "enterprise" },
  { key: "admin", label: "Admin", icon: ShieldCheck, href: "/admin", tier: "enterprise" },
];

const TIER_ACCESS: Record<string, string[]> = {
  basic: ["dashboard"],
  gold: ["dashboard","brand","media","calendar","channels","publishing","analytics","campaigns","growth","dates","settings"],
  enterprise: ["dashboard","brand","media","calendar","channels","publishing","analytics","campaigns","growth","dates","settings","agent","admin"],
};

interface SidebarProps {
  user: { name?: string | null; email?: string | null; tier?: string; };
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const tier = (user?.tier as string) || "basic";
  const allowed = TIER_ACCESS[tier] || TIER_ACCESS.basic;

  const tierColors: Record<string, string> = {
    basic: "#9CA3AF", gold: "#F59E0B", enterprise: "#6366F1",
  };

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-[var(--bg2)] border border-[var(--border)] shadow-sm md:hidden"
        aria-label="Open menu"
      >
        <Menu size={20} className="text-[var(--text)]" />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 z-50 h-screen w-[240px] bg-[var(--bg2)]
          border-r border-[var(--border)] flex flex-col overflow-y-auto
          transition-transform duration-200 shrink-0
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="px-5 py-5 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2.5 no-underline">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6366F1] to-[#818CF8] flex items-center justify-center text-white text-sm font-bold">
              M
            </div>
            <span className="text-[15px] font-semibold tracking-tight text-[var(--text)]">
              Marketing OS
            </span>
          </Link>
          <button onClick={() => setOpen(false)} className="md:hidden p-1 text-[var(--text3)]">
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 pb-3 flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            const accessible = allowed.includes(item.key);
            const Icon = item.icon;

            return (
              <Link
                key={item.key}
                href={accessible ? item.href : "#"}
                onClick={(e) => {
                  if (!accessible) e.preventDefault();
                  else setOpen(false);
                }}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium
                  transition-all duration-150 no-underline
                  ${active
                    ? "bg-[var(--accent-bg)] text-[var(--accent)]"
                    : accessible
                      ? "text-[var(--text2)] hover:bg-[var(--bg3)] hover:text-[var(--text)]"
                      : "text-[var(--text3)] opacity-40 cursor-not-allowed"
                  }
                `}
                title={!accessible ? `Upgrade to ${item.tier === "enterprise" ? "Enterprise" : "Gold"}` : ""}
              >
                <Icon size={17} />
                <span>{item.label}</span>
                {!accessible && (
                  <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg3)] text-[var(--text3)]">
                    {item.tier === "enterprise" ? "ENT" : "GOLD"}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="px-3 pb-4 flex flex-col gap-2 border-t border-[var(--border)] pt-3">
          <button
            onClick={toggle}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium
              text-[var(--text2)] hover:bg-[var(--bg3)] transition-colors w-full"
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
          </button>
          <button
            onClick={() => signOut({ callbackUrl: "/signin" })}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium
              text-[var(--text2)] hover:bg-[var(--bg3)] transition-colors w-full"
          >
            <LogOut size={17} />
            <span>Sign Out</span>
          </button>

          {/* User */}
          <div className="flex items-center gap-3 px-3 py-2 mt-1">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0"
              style={{ background: tierColors[tier] || "#6366F1" }}
            >
              {user?.name?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <div className="min-w-0">
              <div className="text-[12px] font-medium text-[var(--text)] truncate">{user?.name || "User"}</div>
              <div className="text-[11px] text-[var(--text3)] capitalize">{tier} Plan</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
