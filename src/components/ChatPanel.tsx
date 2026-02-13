"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, X, MessageCircle } from "lucide-react";

interface Msg {
  role: "user" | "agent";
  content: string;
  time: string;
}

export default function ChatPanel({ tier }: { tier: string }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "agent", content: "Hi! I'm your Marketing Chief. How can I help today?", time: "Now" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    boxRef.current?.scrollTo(0, boxRef.current.scrollHeight);
  }, [msgs]);

  if (tier !== "enterprise") return null;

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const now = new Date();
    const time = now.getHours().toString().padStart(2, "0") + ":" + now.getMinutes().toString().padStart(2, "0");
    setMsgs((m) => [...m, { role: "user", content: text, time }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      setMsgs((m) => [...m, { role: "agent", content: data.reply || "I'll work on that right away!", time }]);
    } catch {
      setMsgs((m) => [...m, { role: "agent", content: "I'm on it! Let me analyze that and get back to you.", time }]);
    }
    setLoading(false);
  }

  // Desktop: always-visible panel. Mobile: floating toggle.
  return (
    <>
      {/* Desktop sidebar panel */}
      <aside className="hidden lg:flex w-[320px] shrink-0 flex-col border-l border-[var(--border)] bg-[var(--bg2)] h-screen sticky top-0">
        <div className="px-4 py-3 border-b border-[var(--border)] flex items-center gap-2">
          <Bot size={18} className="text-[var(--accent)]" />
          <span className="text-[13px] font-semibold text-[var(--text)]">Marketing Chief</span>
          <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-green-100 text-green-700">Online</span>
        </div>
        <div ref={boxRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {msgs.map((m, i) => (
            <div key={i} className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}>
              <div className={`max-w-[85%] rounded-xl px-3 py-2 text-[12px] leading-relaxed ${
                m.role === "user"
                  ? "bg-[var(--accent)] text-white rounded-br-sm"
                  : "bg-[var(--bg3)] text-[var(--text)] border-l-2 border-green-500 rounded-bl-sm"
              }`}>
                {m.content}
              </div>
              <span className="text-[10px] text-[var(--text3)] mt-1">{m.time}</span>
            </div>
          ))}
          {loading && (
            <div className="text-[12px] text-[var(--text3)] animate-pulse">Thinking...</div>
          )}
        </div>
        <div className="p-3 border-t border-[var(--border)]">
          <div className="flex gap-2">
            <input
              className="flex-1 px-3 py-2 rounded-lg bg-[var(--bg3)] border border-[var(--border)]
                text-[12px] text-[var(--text)] placeholder:text-[var(--text3)]
                focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
              placeholder="Ask your Marketing Chief..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <button
              onClick={send}
              className="px-3 py-2 rounded-lg bg-[var(--accent)] text-white hover:opacity-90 transition-opacity"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile floating chat */}
      <div className="lg:hidden">
        {!open && (
          <button
            onClick={() => setOpen(true)}
            className="fixed bottom-20 right-4 z-40 w-12 h-12 rounded-full bg-[var(--accent)]
              text-white shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
          >
            <MessageCircle size={22} />
          </button>
        )}
        {open && (
          <div className="fixed inset-0 z-50 bg-[var(--bg)] flex flex-col">
            <div className="px-4 py-3 border-b border-[var(--border)] flex items-center gap-2 bg-[var(--bg2)]">
              <Bot size={18} className="text-[var(--accent)]" />
              <span className="text-[13px] font-semibold">Marketing Chief</span>
              <button onClick={() => setOpen(false)} className="ml-auto p-1"><X size={18} /></button>
            </div>
            <div ref={boxRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {msgs.map((m, i) => (
                <div key={i} className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}>
                  <div className={`max-w-[85%] rounded-xl px-3 py-2 text-[13px] leading-relaxed ${
                    m.role === "user"
                      ? "bg-[var(--accent)] text-white rounded-br-sm"
                      : "bg-[var(--bg3)] text-[var(--text)] border-l-2 border-green-500 rounded-bl-sm"
                  }`}>
                    {m.content}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-[var(--border)] bg-[var(--bg2)]">
              <div className="flex gap-2">
                <input
                  className="flex-1 px-3 py-2.5 rounded-lg bg-[var(--bg3)] border border-[var(--border)]
                    text-[13px] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
                  placeholder="Ask your Marketing Chief..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                />
                <button onClick={send} className="px-4 py-2.5 rounded-lg bg-[var(--accent)] text-white">
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
