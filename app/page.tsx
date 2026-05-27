export default function Home() {
  return (
    <main
      style={{
        maxWidth: "780px",
        margin: "0 auto",
        padding: "110px 24px",
        fontFamily: "Georgia, serif",
        color: "#111",
        background: "#f7f5f0",
        minHeight: "100vh",
      }}
    >
      {/* IDENTITY BLOCK */}
      <header style={{ marginBottom: "90px" }}>
        <h1 style={{ fontSize: "56px", fontWeight: 600, letterSpacing: "-1px" }}>
          W.D. Blackwoods
        </h1>

        <p style={{ fontSize: "20px", lineHeight: 1.8, color: "#333", marginTop: "18px" }}>
          Historical fiction, systems-driven storytelling, and cinematic narratives
          built around empire, labor, and the invisible structures beneath power.
        </p>

        <p style={{ fontSize: "20px", lineHeight: 1.8, color: "#333", marginTop: "18px" }}>
          Empires rise on ledgers, roads, and harvests — and the silent assumption
          that some lives are worth less than others.
        </p>
      </header>

      {/* SYSTEM LENS */}
      <section style={{ marginBottom: "90px" }}>
        <p style={{ fontSize: "17px", lineHeight: 1.9, marginBottom: "18px" }}>
          These stories operate as systems under pressure: trade routes, labor economies,
          imperial logistics, and the mathematics of survival.
        </p>

        <p style={{ fontSize: "17px", lineHeight: 1.9 }}>
          Characters are not isolated individuals. They are shaped by distance,
          extraction, and the invisible accounting systems of empire.
        </p>
      </section>

      {/* CURRENT PROJECT */}
      <section style={{ marginBottom: "110px" }}>
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

        <p style={{ fontSize: "18px", lineHeight: 1.8, color: "#333" }}>
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
              textDecoration: "none",
              borderBottom: "1px solid #111",
              paddingBottom: "2px",
            }}
          >
            Enter the system →
          </a>
        </div>
      </section>

      {/* FIELD NOTES */}
      <section style={{ marginBottom: "110px" }}>
        <p
          style={{
            fontSize: "12px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: "#777",
            marginBottom: "26px",
          }}
        >
          Field Notes
        </p>

        <article style={{ marginBottom: "44px" }}>
          <h3 style={{ fontSize: "26px", marginBottom: "10px" }}>
            The Arithmetic on the Wall
          </h3>
          <p style={{ fontSize: "17px", lineHeight: 1.8, color: "#333" }}>
            Routes are not geography. They are control. Prices are not economics.
            They are distance made visible.
          </p>
        </article>

        <article>
          <h3 style={{ fontSize: "26px", marginBottom: "10px" }}>
            Caravanserai Incident — Massawa
          </h3>
          <p style={{ fontSize: "17px", lineHeight: 1.8, color: "#333" }}>
            Inside the caravanserai, hierarchy reveals itself before language does.
          </p>
        </article>
      </section>

      {/* SUBSCRIBE */}
      <section style={{ marginBottom: "80px" }}>
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

        <p style={{ fontSize: "17px", lineHeight: 1.8, color: "#333", marginBottom: "18px" }}>
          Occasional dispatches: essays, system maps, and early excerpts.
        </p>

        <input
          placeholder="Email address"
          style={{
            padding: "14px 16px",
            border: "1px solid #ccc",
            fontSize: "15px",
            width: "100%",
            maxWidth: "320px",
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
      </section>

      {/* FOOTER */}
      <footer style={{ fontSize: "14px", color: "#777" }}>
        © 2026 W.D. Blackwoods
      </footer>
    </main>
  );
}