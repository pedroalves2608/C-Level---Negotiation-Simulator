import { useState, useRef, useEffect } from "react";

const SCENARIOS = [
  {
    id: 1,
    title: "Promotion Denied, But You're Indispensable",
    context: "You led a critical project that drove 30% revenue growth. Your manager just told you there's no budget for a promotion right now — but that you're 'fundamental to the company.'",
    persona: "Direct manager, pragmatic, under cost-cutting pressure. Will try to keep you without raising your salary.",
    difficulty: "Advanced",
    systemPrompt: `You are a direct manager at a mid-sized company — pragmatic and under pressure to cut costs. The employee (user) just received a promotion denial despite excellent results. Your goal: keep the employee motivated WITHOUT granting a raise or promotion right now. Use tactics like: deferring with vague promises, emphasizing non-financial perks (learning, visibility), invoking "company policy", creating guilt around timing. Be realistic and professional, not cartoonish. Always respond in English, in 2-4 sentences, in character as the manager. After your response, on a separate line starting with "🎯 ANALYSIS:", evaluate in 1-2 sentences the tactic used by the employee — praise what worked, flag what could be stronger. Be direct and technical in the analysis.`
  },
  {
    id: 2,
    title: "Using a Competing Offer as Leverage",
    context: "You have an offer from another company paying 25% more. You want to use it to negotiate with your current employer — but you don't actually want to leave.",
    persona: "Senior HR, experienced in retention. Will test whether the offer is real and probe your true intentions.",
    difficulty: "Advanced",
    systemPrompt: `You are a senior HR professional, experienced in talent retention. The employee is trying to use a competing offer to get a raise. Your goal: find out if the offer is real, probe the gap between current vs. offered salary, and decide whether a counter-offer is warranted. Use tactics like: asking to see the offer in writing, questioning cultural fit at the competitor, testing the employee's real commitment, making a strategic pause before responding. Be professional, strategic, not emotional. Always respond in English, in 2-4 sentences in character. After your response, on a separate line starting with "🎯 ANALYSIS:", evaluate in 1-2 sentences the employee's tactic — what landed, what weakness the HR picked up on.`
  },
  {
    id: 3,
    title: "Negotiating the Initial Offer Package",
    context: "You just received your dream job offer — but the salary came in 15% below your target. This is the first compensation conversation.",
    persona: "Enthusiastic recruiter who wants to close you, but has rigid salary bands.",
    difficulty: "Advanced",
    systemPrompt: `You are a senior recruiter excited about the candidate (user), but constrained by HR-approved salary bands (max 10% above the initial offer). Your goal: close the hire within the band. Use tactics like: highlighting non-salary benefits (bonus, flexibility, growth), anchoring to "internal equity policy", creating urgency (other candidates), showing genuine enthusiasm to soften the negotiation. Always respond in English, in 2-4 sentences in character as the recruiter. After your response, on a separate line starting with "🎯 ANALYSIS:", evaluate the candidate's tactic in 1-2 sentences — what was strong, what left money on the table.`
  }
];

const COLORS = {
  bg: "#0f1117",
  card: "#1a1d27",
  border: "#2a2d3a",
  accent: "#6c63ff",
  accentLight: "#8b85ff",
  user: "#22c55e",
  ai: "#6c63ff",
  analysis: "#f59e0b",
  text: "#e2e8f0",
  muted: "#64748b",
};

export default function App() {
  const [screen, setScreen] = useState("menu");
  const [scenario, setScenario] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState({ turns: 0, strongMoves: 0 });
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const startScenario = (s) => {
    setScenario(s);
    setMessages([{ role: "system-intro", content: s.context }]);
    setScore({ turns: 0, strongMoves: 0 });
    setInput("");
    setScreen("chat");
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    const history = messages
      .filter(m => m.role === "user" || m.role === "assistant")
      .map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content }));

    try {
      const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
      if (!apiKey) {
        setMessages(prev => [...prev, { role: "assistant", content: "Missing VITE_ANTHROPIC_API_KEY. Add it to a .env file in the project root.", analysis: "" }]);
        setLoading(false);
        return;
      }
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: scenario.systemPrompt,
          messages: [...history, { role: "user", content: userMsg }]
        })
      });
      const data = await res.json();
      const raw = data.content?.[0]?.text || "";
      const [gestor, ...analysisParts] = raw.split("🎯 ANALYSIS:");
      const analysis = analysisParts.join("").trim();

      const isStrong = analysis.toLowerCase().includes("strong") || analysis.toLowerCase().includes("excellent") || analysis.toLowerCase().includes("great") || analysis.toLowerCase().includes("effective");
      setScore(prev => ({ turns: prev.turns + 1, strongMoves: prev.strongMoves + (isStrong ? 1 : 0) }));
      setMessages(prev => [...prev, { role: "assistant", content: gestor.trim(), analysis }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Connection error. Please try again.", analysis: "" }]);
    }
    setLoading(false);
  };

  const handleKey = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

  if (screen === "menu") return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", padding: "32px 20px", fontFamily: "'Inter', sans-serif", color: COLORS.text }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>🎯 Negotiation Simulator</h1>
          <p style={{ color: COLORS.muted, marginTop: 8 }}>Advanced scenarios · Salary & Career · Real-time feedback</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {SCENARIOS.map(s => (
            <div key={s.id} onClick={() => startScenario(s)}
              style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: "20px 24px", cursor: "pointer", transition: "border-color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = COLORS.accent}
              onMouseLeave={e => e.currentTarget.style.borderColor = COLORS.border}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <div>
                  <span style={{ background: "#ef444422", color: "#ef4444", fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6, letterSpacing: 0.5 }}>ADVANCED</span>
                  <h2 style={{ fontSize: 17, fontWeight: 600, margin: "10px 0 6px" }}>{s.title}</h2>
                  <p style={{ color: COLORS.muted, fontSize: 14, margin: 0, lineHeight: 1.5 }}>{s.context.slice(0, 110)}...</p>
                  <p style={{ color: COLORS.muted, fontSize: 12, margin: "8px 0 0", fontStyle: "italic" }}>👤 {s.persona}</p>
                </div>
                <span style={{ fontSize: 24, flexShrink: 0 }}>→</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 28, padding: "16px 20px", background: COLORS.card, borderRadius: 12, border: `1px solid ${COLORS.border}`, fontSize: 13, color: COLORS.muted, lineHeight: 1.6 }}>
          💡 <strong style={{ color: COLORS.text }}>How it works:</strong> Negotiate in real time with an AI playing the other side. After each exchange, get a tactical breakdown of your move — what landed, what missed, and how to sharpen it.
        </div>
      </div>
    </div>
  );

  const scorePercent = score.turns > 0 ? Math.round((score.strongMoves / score.turns) * 100) : 0;

  return (
    <div style={{ background: COLORS.bg, height: "100vh", display: "flex", flexDirection: "column", fontFamily: "'Inter', sans-serif", color: COLORS.text }}>
      <div style={{ background: COLORS.card, borderBottom: `1px solid ${COLORS.border}`, padding: "12px 20px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        <button onClick={() => setScreen("menu")} style={{ background: "none", border: `1px solid ${COLORS.border}`, color: COLORS.text, borderRadius: 8, padding: "4px 12px", cursor: "pointer", fontSize: 13 }}>← Scenarios</button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{scenario?.title}</div>
          <div style={{ color: COLORS.muted, fontSize: 12 }}>{scenario?.persona}</div>
        </div>
        {score.turns > 0 && (
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: scorePercent >= 60 ? COLORS.user : COLORS.analysis }}>{scorePercent}%</div>
            <div style={{ fontSize: 11, color: COLORS.muted }}>strong moves</div>
          </div>
        )}
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px", display: "flex", flexDirection: "column", gap: 16 }}>
        {messages.map((m, i) => {
          if (m.role === "system-intro") return (
            <div key={i} style={{ background: "#1e2235", border: `1px solid ${COLORS.accent}33`, borderRadius: 12, padding: "14px 18px", fontSize: 14, lineHeight: 1.6 }}>
              <div style={{ color: COLORS.accentLight, fontWeight: 600, marginBottom: 6, fontSize: 12, letterSpacing: 0.5 }}>📋 SCENARIO</div>
              {m.content}
              <div style={{ marginTop: 10, color: COLORS.muted, fontSize: 13, fontStyle: "italic" }}>Start negotiating below ↓</div>
            </div>
          );
          if (m.role === "user") return (
            <div key={i} style={{ display: "flex", justifyContent: "flex-end" }}>
              <div style={{ background: COLORS.user + "22", border: `1px solid ${COLORS.user}44`, borderRadius: "16px 16px 4px 16px", padding: "10px 16px", maxWidth: "75%", fontSize: 14, lineHeight: 1.5 }}>
                <div style={{ color: COLORS.user, fontSize: 11, fontWeight: 600, marginBottom: 4 }}>YOU</div>
                {m.content}
              </div>
            </div>
          );
          if (m.role === "assistant") return (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: "16px 16px 16px 4px", padding: "10px 16px", maxWidth: "75%", fontSize: 14, lineHeight: 1.5 }}>
                <div style={{ color: COLORS.accentLight, fontSize: 11, fontWeight: 600, marginBottom: 4 }}>COUNTERPART</div>
                {m.content}
              </div>
              {m.analysis && (
                <div style={{ background: COLORS.analysis + "11", border: `1px solid ${COLORS.analysis}44`, borderRadius: 10, padding: "10px 14px", maxWidth: "85%", fontSize: 13, lineHeight: 1.5 }}>
                  <span style={{ color: COLORS.analysis, fontWeight: 600 }}>🎯 Analysis: </span>
                  <span style={{ color: "#e0c080" }}>{m.analysis}</span>
                </div>
              )}
            </div>
          );
          return null;
        })}
        {loading && (
          <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: "16px 16px 16px 4px", padding: "10px 16px", width: "fit-content", fontSize: 14 }}>
            <span style={{ color: COLORS.muted }}>● ● ●</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ background: COLORS.card, borderTop: `1px solid ${COLORS.border}`, padding: "12px 16px", flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Your negotiation response... (Enter to send)"
            style={{ flex: 1, background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "10px 14px", color: COLORS.text, fontSize: 14, resize: "none", outline: "none", fontFamily: "inherit", lineHeight: 1.5, minHeight: 44, maxHeight: 120 }}
            rows={1}
          />
          <button onClick={sendMessage} disabled={loading || !input.trim()}
            style={{ background: loading || !input.trim() ? COLORS.border : COLORS.accent, color: "white", border: "none", borderRadius: 10, padding: "10px 18px", cursor: loading || !input.trim() ? "not-allowed" : "pointer", fontSize: 14, fontWeight: 600, height: 44, flexShrink: 0 }}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
