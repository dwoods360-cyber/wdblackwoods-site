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
      staggerChildren: 0.1,
    },
  },
};

export default function Home() {
  return (
    <div style={{ background: "#f2efe6", minHeight: "100vh" }}>
      <motion.main
        variants={container}
        initial="hidden"
        animate="show"
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "140px 24px",
          fontFamily: "Georgia, serif",
          color: "#111",
        }}
      >
        {/* IDENTITY LAYER */}
        <motion.section variants={fade} style={{ marginBottom: "110px" }}>
          <h1 style={{ fontSize: "62px", letterSpacing: "-1px" }}>
            W.D. Blackwoods
          </h1>

          <p style={{ fontSize: "21px", lineHeight: 1.9, color: "#333" }}>
            Historical fiction, systems-driven storytelling, and cinematic narratives
            built around empire, labor, and the invisible structures beneath power.
          </p>
        </motion.section>

        {/* THREAD ROUTER */}
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
            Active Narrative Threads
          </p>

          {/* THREAD 1 */}
          <div style={{ marginBottom: "42px" }}>
            <h2 style={{ fontSize: "34px", marginBottom: "8px" }}>
              What Coffee Demands
            </h2>
            <p style={{ fontSize: "17px", lineHeight: 1.8, color: "#333" }}>
              Empire-scale logistics, extraction economies, and trade-route violence.
            </p>
            <a
              href="#"
              style={{
                fontSize: "15px",
                color: "#111",
                borderBottom: "1px solid #111",
                textDecoration: "none",
              }}
            >
              Enter thread →
            </a>
          </div>

          {/* THREAD 2 */}
          <div style={{ marginBottom: "42px" }}>
            <h2 style={{ fontSize: "34px", marginBottom: "8px" }}>
              Southern Expedition
            </h2>
            <p style={{ fontSize: "17px", lineHeight: 1.8, color: "#333" }}>
              Personal pursuit, fractured identity, and pursuit across unstable terrain.
            </p>
            <a
              href="#"
              style={{
                fontSize: "15px",
                color: "#111",
                borderBottom: "1px solid #111",
                textDecoration: "none",
              }}
            >
              Enter thread →
            </a>
          </div>

          {/* THREAD 3 */}
          <div>
            <h2 style={{ fontSize: "34px", marginBottom: "8px" }}>
              Caravan Network Logs
            </h2>
            <p style={{ fontSize: "17px", lineHeight: 1.8, color: "#333" }}>
              Movement systems, military corridors, and controlled geography.
            </p>
            <a
              href="#"
              style={{
                fontSize: "15px",
                color: "#111",
                borderBottom: "1px solid #111",
                textDecoration: "none",
              }}
            >
              Enter thread →
            </a>
          </div>
        </motion.section>

        {/* SHARED FIELD SYSTEM */}
        <motion.section variants={fade} style={{ marginBottom: "150px" }}>
          <p
            style={{
              fontSize: "12px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "#777",
              marginBottom: "26px",
            }}
          >
            Shared Field Nodes
          </p>

          <article style={{ marginBottom: "60px" }}>
            <h3 style={{ fontSize: "28px" }}>
              The Arithmetic on the Wall
            </h3>
            <p style={{ fontSize: "18px", lineHeight: 1.9, color: "#333" }}>
              Appears across all threads: trade logic, distance pricing, imperial accounting.
            </p>
          </article>

          <article>
            <h3 style={{ fontSize: "28px" }}>
              Caravanserai Incident — Massawa
            </h3>
            <p style={{ fontSize: "18px", lineHeight: 1.9, color: "#333" }}>
              A convergence point where all narrative threads intersect under control systems.
            </p>
          </article>
        </motion.section>

        {/* SYSTEM LAYER */}
        <motion.section variants={fade} style={{ marginBottom: "120px" }}>
          <p
            style={{
              fontSize: "12px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "#777",
              marginBottom: "14px",
            }}
          >
            System Layer
          </p>

          <p style={{ fontSize: "17px", lineHeight: 1.9, color: "#333" }}>
            All narratives operate under shared constraints: extraction, movement,
            scarcity, and institutional control. Stories diverge in perspective, not in physics.
          </p>
        </motion.section>

        {/* OUTPUT LAYER */}
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
            Subscribe to multi-thread narrative dispatches.
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

        <footer
          style={{
            marginTop: "90px",
            fontSize: "14px",
            color: "#777",
            borderTop: "1px solid #ddd",
            paddingTop: "40px",
          }}
        >
          © 2026 W.D. Blackwoods — Narrative OS v2 (Multi-Threaded)
        </footer>
      </motion.main>
    </div>
  );
}