"use client";

import { useState } from "react";

type Thread = "empire" | "expedition" | "logistics";

const THREADS = {
  empire: {
    title: "What Coffee Demands",
    desc: "Empire-scale extraction, trade, and economic violence.",
  },
  expedition: {
    title: "Southern Expedition",
    desc: "Personal pursuit across unstable terrain.",
  },
  logistics: {
    title: "Caravan Network Logs",
    desc: "Movement systems, routes, controlled geography.",
  },
};

export default function Home() {
  const [activeThread, setActiveThread] = useState<Thread>("empire");

  return (
    <main
      style={{
        fontFamily: "Georgia, serif",
        maxWidth: 820,
        margin: "0 auto",
        padding: "110px 24px",
        background: "#f6f4ef",
        color: "#111",
      }}
    >
      {/* HERO — RESTORED STORY LEAD */}
      <section style={{ marginBottom: 80 }}>
        <p style={{ fontSize: 20, lineHeight: 1.9, color: "#222" }}>
          Inside the caravanserai, hierarchy reveals itself before language does.
        </p>
      </section>

      {/* IDENTITY */}
      <section style={{ marginBottom: 70 }}>
        <h1 style={{ fontSize: 52, letterSpacing: "-1px" }}>
          W.D. Blackwoods
        </h1>

        <p style={{ fontSize: 18, lineHeight: 1.8, color: "#333" }}>
          Historical fiction built as a system of extraction, movement, and power.
        </p>
      </section>

      {/* FIELD CONTEXT (light, not dominant) */}
      <section style={{ marginBottom: 70 }}>
        <p style={{ fontSize: 12, letterSpacing: 2, color: "#777" }}>
          FIELD INCIDENT
        </p>

        <h2 style={{ fontSize: 28 }}>
          Caravanserai Incident — Massawa
        </h2>

        <p style={{ fontSize: 18, lineHeight: 1.8, color: "#333" }}>
          A controlled trade space where power reveals itself in increments.
        </p>
      </section>

      {/* SYSTEM (kept, but secondary) */}
      <section style={{ marginBottom: 80 }}>
        <p style={{ fontSize: 12, letterSpacing: 2, color: "#777" }}>
          ACTIVE THREAD
        </p>

        <h3 style={{ fontSize: 26, marginTop: 10 }}>
          {THREADS[activeThread].title}
        </h3>

        <p style={{ fontSize: 16, color: "#333", lineHeight: 1.7 }}>
          {THREADS[activeThread].desc}
        </p>

        <div style={{ marginTop: 18, display: "flex", gap: 10 }}>
          {Object.keys(THREADS).map((key) => (
            <button
              key={key}
              onClick={() => setActiveThread(key as Thread)}
              style={{
                padding: "8px 12px",
                border:
                  activeThread === key ? "2px solid #111" : "1px solid #bbb",
                background: activeThread === key ? "#111" : "#fff",
                color: activeThread === key ? "#fff" : "#111",
                cursor: "pointer",
                fontSize: 14,
              }}
            >
              {key}
            </button>
          ))}
        </div>
      </section>

      <footer style={{ marginTop: 100, color: "#777", fontSize: 14 }}>
        © 2026 W.D. Blackwoods — Narrative OS v3
      </footer>
    </main>
  );
}