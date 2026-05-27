"use client";

import { motion } from "framer-motion";

const fade = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

export default function Home() {
  return (
    <div style={{ background: "#f3efe7", minHeight: "100vh" }}>
      <motion.main
        variants={container}
        initial="hidden"
        animate="show"
        style={{
          maxWidth: "860px",
          margin: "0 auto",
          padding: "140px 24px",
          fontFamily: "Georgia, serif",
          color: "#111",
        }}
      >
        {/* LAYER 1 — IDENTITY */}
        <motion.section variants={fade} style={{ marginBottom: "120px" }}>
          <h1 style={{ fontSize: "62px", letterSpacing: "-1px" }}>
            W.D. Blackwoods
          </h1>

          <p style={{ fontSize: "21px", lineHeight: 1.9, color: "#333" }}>
            Historical fiction, systems-driven storytelling, and cinematic narratives
            built around empire, labor, and the invisible structures beneath power.
          </p>

          <p style={{ fontSize: "21px", lineHeight: 1.9, color: "#333", marginTop: "18px" }}>
            Empires rise on ledgers, roads, and harvests — and the silent assumption
            that some lives are worth less than others.
          </p>
        </motion.section>

        {/* LAYER 2 — ACTIVE THREAD */}
        <motion.section variants={fade} style={{ marginBottom: "140px" }}>
          <p
            style={{
              fontSize: "12px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "#777",
              marginBottom: "14px",
            }}
          >
            Active Narrative Thread
          </p>

          <h2 style={{ fontSize: "44px", marginBottom: "16px" }}>
            What Coffee Demands
          </h2>

          <p style={{ fontSize: "19px", lineHeight: 1.9, color: "#333" }}>
            A historical adventure trilogy tracing coffee, capital, violence, and survival
            through trade routes and collapsing imperial systems in 19th-century Abyssinia.
          </p>

          <a
            href="#"
            style={{
              display: "inline-block",
              marginTop: "22px",
              fontSize: "16px",
              color: "#111",
              textDecoration: "none",
              borderBottom: "1px solid #111",
            }}
          >
            Enter active thread →
          </a>
        </motion.section>

        {/* LAYER 3 — FIELD NODES (SYSTEM OUTPUT) */}
        <motion.section variants={fade} style={{ marginBottom: "160px" }}>
          <p
            style={{
              fontSize: "12px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "#777",
              marginBottom: "28px",
            }}
          >
            Field Node Registry
          </p>

          <article style={{ marginBottom: "60px" }}>
            <h3 style={{ fontSize: "28px" }}>
              The Arithmetic on the Wall
            </h3>
            <p style={{ fontSize: "18px", lineHeight: 1.9, color: "#333" }}>
              Routes are not geography. They are control. Prices are not economics.
              They are distance made visible.
            </p>
          </article>

          <article>
            <h3 style={{ fontSize: "28px" }}>
              Caravanserai Incident — Massawa
            </h3>
            <p style={{ fontSize: "18px", lineHeight: 1.9, color: "#333" }}>
              Inside the caravanserai, hierarchy reveals itself before language does.
            </p>
          </article>
        </motion.section>

        {/* LAYER 4 — SYSTEM RULESET */}
        <motion.section variants={fade} style={{ marginBottom: "140px" }}>
          <p
            style={{
              fontSize: "12px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "#777",
              marginBottom: "18px",
            }}
          >
            System Ruleset
          </p>

          <p style={{ fontSize: "17px", lineHeight: 1.9, color: "#333" }}>
            Narrative units are structured by extraction, distance, and economic pressure.
            Characters exist as outputs of systems, not as isolated psychological units.
          </p>

          <p style={{ fontSize: "17px", lineHeight: 1.9, color: "#333", marginTop: "14px" }}>
            Every scene must reflect a system: trade, labor, logistics, empire, or survival mathematics.
          </p>
        </motion.section>

        {/* LAYER 5 — OUTPUT / EXIT */}
        <motion.section variants={fade}>
          <p
            style={{
              fontSize: "12px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "#777",
              marginBottom: "18px",
            }}
          >
            Output Interface
          </p>

          <p style={{ fontSize: "18px", lineHeight: 1.9, color: "#333" }}>
            Subscribe to system outputs: essays, field notes, and narrative expansions.
          </p>

          <input
            placeholder="Email address"
            style={{
              marginTop: "18px",
              padding: "14px 16px",
              border: "1px solid #ccc",
              fontSize: "15px",
              width: "100%",
              maxWidth: "340px",
            }}
          />

          <button
            style={{
              marginTop: "12px",
              padding: "12px 18px",
              background: "#111",
              color: "#fff",
              border: "none",
              fontSize: "15px",
              cursor: "pointer",
              display: "block",
            }}
          >
            Subscribe
          </button>
        </motion.section>

        {/* FOOTER */}
        <footer
          style={{
            marginTop: "90px",
            fontSize: "14px",
            color: "#777",
            borderTop: "1px solid #ddd",
            paddingTop: "40px",
          }}
        >
          © 2026 W.D. Blackwoods — Narrative OS v1
        </footer>
      </motion.main>
    </div>
  );
}