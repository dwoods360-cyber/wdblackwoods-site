"use client";

import { motion } from "framer-motion";

const section = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.18,
    },
  },
};

export default function Home() {
  return (
    <div
      style={{
        background: "#f5f2ec",
        minHeight: "100vh",
      }}
    >
      <motion.main
        variants={container}
        initial="hidden"
        animate="show"
        style={{
          maxWidth: "760px",
          margin: "0 auto",
          padding: "140px 24px",
          fontFamily: "Georgia, serif",
          color: "#111",
        }}
      >
        {/* ACT I — IDENTITY */}
        <motion.section
          variants={section}
          style={{ marginBottom: "140px" }}
        >
          <h1
            style={{
              fontSize: "60px",
              letterSpacing: "-1px",
              marginBottom: "22px",
            }}
          >
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

        {/* ACT II — SYSTEMS */}
        <motion.section
          variants={section}
          style={{ marginBottom: "160px" }}
        >
          <p style={{ fontSize: "18px", lineHeight: 2, color: "#333" }}>
            These stories operate as systems under pressure: trade routes, labor economies,
            imperial logistics, and the mathematics of survival.
          </p>

          <p
            style={{
              fontSize: "18px",
              lineHeight: 2,
              color: "#333",
              marginTop: "18px",
            }}
          >
            Characters are not isolated individuals. They are shaped by distance,
            extraction, and the invisible accounting systems of empire.
          </p>
        </motion.section>

        {/* ACT III — THE PROJECT */}
        <motion.section
          variants={section}
          style={{ marginBottom: "180px" }}
        >
          <p
            style={{
              fontSize: "12px",
              letterSpacing: "2px",
              color: "#777",
              textTransform: "uppercase",
              marginBottom: "14px",
            }}
          >
            Current Project
          </p>

          <h2 style={{ fontSize: "44px", marginBottom: "16px" }}>
            What Coffee Demands
          </h2>

          <p style={{ fontSize: "19px", lineHeight: 1.9, color: "#333" }}>
            A historical adventure trilogy set in a composite 19th-century Abyssinia,
            tracing coffee, capital, violence, and survival through trade routes and
            collapsing empires.
          </p>

          <div style={{ marginTop: "26px" }}>
            <a
              href="#"
              style={{
                fontSize: "16px",
                color: "#111",
                textDecoration: "none",
                borderBottom: "1px solid #111",
              }}
            >
              Enter the system →
            </a>
          </div>
        </motion.section>

        {/* ACT IV — FIELD NOTES (ARCHIVAL SPACE) */}
        <motion.section
          variants={section}
          style={{ marginBottom: "180px" }}
        >
          <p
            style={{
              fontSize: "12px",
              letterSpacing: "2px",
              color: "#777",
              textTransform: "uppercase",
              marginBottom: "28px",
            }}
          >
            Field Notes
          </p>

          <article style={{ marginBottom: "60px" }}>
            <h3 style={{ fontSize: "28px", marginBottom: "10px" }}>
              The Arithmetic on the Wall
            </h3>
            <p style={{ fontSize: "18px", lineHeight: 1.9, color: "#333" }}>
              Routes are not geography. They are control. Prices are not economics.
              They are distance made visible.
            </p>
          </article>

          <article>
            <h3 style={{ fontSize: "28px", marginBottom: "10px" }}>
              Caravanserai Incident — Massawa
            </h3>
            <p style={{ fontSize: "18px", lineHeight: 1.9, color: "#333" }}>
              Inside the caravanserai, hierarchy reveals itself before language does.
            </p>
          </article>
        </motion.section>

        {/* ACT V — EXIT / SUBSCRIPTION */}
        <motion.section variants={section} style={{ marginBottom: "140px" }}>
          <p
            style={{
              fontSize: "12px",
              letterSpacing: "2px",
              color: "#777",
              textTransform: "uppercase",
              marginBottom: "18px",
            }}
          >
            Stay Connected
          </p>

          <p style={{ fontSize: "18px", lineHeight: 1.9, color: "#333" }}>
            Occasional dispatches: essays, system maps, and early excerpts.
          </p>

          <div style={{ marginTop: "18px" }}>
            <input
              placeholder="Email address"
              style={{
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
              }}
            >
              Subscribe
            </button>
          </div>
        </motion.section>

        {/* END */}
        <footer
          style={{
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