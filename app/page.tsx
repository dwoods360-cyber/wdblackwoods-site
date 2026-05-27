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
        maxWidth: 900,
        margin: "0 auto",
        padding: "120px 24px",
        minHeight: "100vh",
        background: "#f6f4ef",   // ✅ FIX: consistent page surface
        color: "#111",
      }}
    >
      {/* IDENTITY */}
      <section style={{ marginBottom: 80 }}>
        <h1 style={{ fontSize: 60, letterSpacing: "-1px" }}>
          W.D. Blackwoods
        </h1>

        <p style={{ fontSize: 20, lineHeight: 1.8, color: "#333" }}>
          Historical fiction built as a system of extraction, movement, and power.
        </p>
      </section>

      {/* THREAD SELECTOR */}
      <section style={{ marginBottom: 80 }}>
        <p style={{ fontSize: 12, letterSpacing: 2, color: "#777" }}>
          ACTIVE THREAD
        </p>

        <h2 style={{ fontSize: 36, marginTop: 10 }}>
          {THREADS[activeThread].title}
        </h2>

        <p style={{ fontSize: 18, color: "#333", lineHeight: 1.8 }}>
          {THREADS[activeThread].desc}
        </p>

        <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
          {Object.entries(THREADS).map(([key]) => (
            <button
              key={key}
              onClick={() => setActiveThread(key as Thread)}
              style={{
                padding: "10px 14px",
                border:
                  activeThread === key ? "2px solid #111" : "1px solid #bbb",
                background: activeThread === key ? "#111" : "#fff",
                color: activeThread === key ? "#fff" : "#111",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {key}
            </button>
          ))}
        </div>
      </section>

      {/* SYSTEM VIEW */}
      <section style={{ marginBottom: 80 }}>
        <p style={{ fontSize: 12, letterSpacing: 2, color: "#777" }}>
          SYSTEM STATE
        </p>

        <p style={{ fontSize: 18, lineHeight: 1.9, color: "#333" }}>
          The narrative system is currently simulating the{" "}
          <strong>{activeThread}</strong> thread. Field nodes and excerpts will
          resolve dynamically in v3.1.
        </p>
      </section>

      {/* FIELD NODE PREVIEW */}
      <section>
        <p style={{ fontSize: 12, letterSpacing: 2, color: "#777" }}>
          FIELD NODE
        </p>

        <h3 style={{ fontSize: 28 }}>
          Caravanserai Incident — Massawa
        </h3>

        <p style={{ fontSize: 18, lineHeight: 1.8, color: "#333" }}>
          Inside the caravanserai, hierarchy reveals itself before language does.
        </p>
      </section>

      <footer style={{ marginTop: 100, color: "#777", fontSize: 14 }}>
        © 2026 W.D. Blackwoods — Narrative OS v3
      </footer>
    </main>
  );
}