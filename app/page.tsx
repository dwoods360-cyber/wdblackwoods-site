export default function Home() {
  return (
    <main
      style={{
        maxWidth: "760px",
        margin: "0 auto",
        padding: "96px 24px",
        fontFamily: "Georgia, serif",
        color: "#111",
        background: "#f8f6f2",
        minHeight: "100vh",
      }}
    >
      {/* IDENTITY */}
      <section>
        <h1
          style={{
            fontSize: "52px",
            fontWeight: 600,
            letterSpacing: "-1px",
            marginBottom: "18px",
          }}
        >
          W.D. Blackwoods
        </h1>

        <p
          style={{
            fontSize: "20px",
            lineHeight: 1.8,
            color: "#333",
            maxWidth: "680px",
            marginBottom: "28px",
          }}
        >
          Historical fiction, systems-driven storytelling, and cinematic
          narratives built around empire, labor, and the invisible structures
          beneath power.
        </p>

        {/* THESIS (PRIMARY HOOK) */}
        <p
          style={{
            fontSize: "20px",
            lineHeight: 1.8,
            fontStyle: "italic",
            color: "#111",
            maxWidth: "680px",
            marginBottom: "40px",
          }}
        >
          Empires rise on ledgers, roads, and harvests — and the silent
          assumption that some lives are worth less than others.
        </p>
      </section>

      {/* SYSTEM FRAME */}
      <section>
        <p
          style={{
            fontSize: "17px",
            lineHeight: 1.9,
            marginBottom: "18px",
          }}
        >
          These stories operate as systems under pressure: trade routes, labor
          economies, imperial logistics, and the mathematics of survival.
        </p>

        <p
          style={{
            fontSize: "17px",
            lineHeight: 1.9,
          }}
        >
          Characters are not isolated individuals. They are shaped by distance,
          extraction, and the invisible accounting systems of empire.
        </p>
      </section>

      {/* DIVIDER */}
      <hr
        style={{
          margin: "56px 0",
          border: "none",
          borderTop: "1px solid #d6d1c7",
        }}
      />

      {/* CURRENT PROJECT */}
      <section>
        <p
          style={{
            fontSize: "12px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: "#777",
            marginBottom: "14px",
          }}
        >
          Current Project
        </p>

        <h2 style={{ fontSize: "38px", marginBottom: "16px" }}>
          What Coffee Demands
        </h2>

        <p
          style={{
            fontSize: "18px",
            lineHeight: 1.8,
            color: "#333",
            maxWidth: "680px",
          }}
        >
          A historical adventure trilogy set in a composite 19th-century
          Abyssinia, tracing coffee, capital, violence, and survival through
          trade routes and collapsing empires.
        </p>

        <div style={{ marginTop: "22px" }}>
          <a
            href="#"
            style={{
              textDecoration: "none",
              color: "#111",
              fontSize: "16px",
              borderBottom: "1px solid #111",
              paddingBottom: "2px",
            }}
          >
            Enter the system →
          </a>
        </div>
      </section>

      {/* FIELD NOTE (SINGLE STRONG ENTRY) */}
      <section style={{ marginTop: "80px" }}>
        <p
          style={{
            fontSize: "12px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: "#777",
            marginBottom: "20px",
          }}
        >
          Field Note
        </p>

        <h3 style={{ fontSize: "28px", marginBottom: "12px" }}>
          Caravanserai Incident — Massawa
        </h3>

        <p
          style={{
            fontSize: "17px",
            lineHeight: 1.8,
            color: "#333",
          }}
        >
          Inside the caravanserai, hierarchy reveals itself before language does.
        </p>
      </section>

      {/* SUBSCRIBE */}
      <section style={{ marginTop: "100px" }}>
        <p
          style={{
            fontSize: "12px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: "#777",
            marginBottom: "18px",
          }}
        >
          Stay Connected
        </p>

        <p
          style={{
            fontSize: "17px",
            lineHeight: 1.8,
            color: "#333",
            marginBottom: "20px",
          }}
        >
          Occasional dispatches: essays, system maps, and early excerpts.
        </p>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <input
            type="email"
            placeholder="Email address"
            style={{
              padding: "14px 16px",
              border: "1px solid #ccc",
              background: "#fff",
              minWidth: "260px",
              fontSize: "15px",
            }}
          />

          <button
            style={{
              padding: "14px 22px",
              background: "#111",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              fontSize: "15px",
            }}
          >
            Subscribe
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          marginTop: "110px",
          fontSize: "14px",
          color: "#777",
        }}
      >
        © 2026 W.D. Blackwoods
      </footer>
    </main>
  );
}