"use client";

import { motion } from "framer-motion";

const fade = {
  hidden: { opacity: 0, y: 18 },
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
    <div style={{ background: "#f4f1ea", minHeight: "100vh" }}>
      <motion.main
        variants={container}
        initial="hidden"
        animate="show"
        style={{
          maxWidth: "820px",
          margin: "0 auto",
          padding: "140px 24px",
          fontFamily: "Georgia, serif",
          color: "#111",
        }}
      >
        {/* SYSTEM IDENTITY */}
        <motion.section variants={fade} style={{ marginBottom: "120px" }}>
          <h1 style={{ fontSize: "60px", letterSpacing: "-1px" }}>
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

        {/* CURRENT NARRATIVE STATE (ENGINE CORE) */}
        <motion.section variants={fade} style={{ marginBottom: "160px" }}>
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
            A historical adventure trilogy set in a composite 19th-century Abyssinia,
            tracing coffee, capital, violence, and survival through trade routes and
            collapsing empires.
          </p>

          <div style={{ marginTop: "22px" }}>
            <a
              href="#"
              style={{
                fontSize: "16px",
                color: "#111",
                borderBottom: "1px solid #111",
                textDecoration: "none",
              }}
            >
              Enter active narrative →
            </a>
          </div>
        </motion.section>

        {/* FIELD NOTE ENGINE (SCALABLE SYSTEM) */}
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
            Field Note System
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

        {/* SYSTEM FOOTER (STATE SIGNAL) */}
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
            System Status
          </p>

          <p style={{ fontSize: "16px", lineHeight: 1.8, color: "#333" }}>
            Narrative engine active. Publishing pipeline stable.
          </p>
        </motion.section>

        <footer
          style={{
            marginTop: "80px",
            fontSize: "14px",
            color: "#777",
            borderTop: "1px solid #ddd",
            paddingTop: "40px",
          }}
        >
          © 2026 W.D. Blackwoods
        </footer>
      </motion.main>
    </div>
  );
}