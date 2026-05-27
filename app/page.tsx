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
      {/* HEADER */}
      <section>
        <h1 style={{ fontSize: "52px", fontWeight: 600, marginBottom: "24px" }}>
          W.D. Blackwoods
        </h1>

        <p style={{ fontSize: "20px", lineHeight: 1.8, color: "#333" }}>
          Historical fiction, systems-driven storytelling, and cinematic
          narratives built around empire, labor, and the invisible structures beneath power.
        </p>

        <p style={{ marginTop: "16px", fontSize: "20px", lineHeight: 1.8, color: "#333" }}>
          Empires rise on ledgers, roads, and harvests — and the silent assumption that some lives are worth less than others.
        </p>
      </section>

      <hr style={{ margin: "56px 0", borderTop: "1px solid #d6d1c7" }} />

      {/* SYSTEM TEXT */}
      <section>
        <p style={{ fontSize: "17px", lineHeight: 1.9, marginBottom: "20px" }}>
          These stories operate as systems under pressure: trade routes, labor economies, imperial logistics, and the mathematics of survival.
        </p>

        <p style={{ fontSize: "17px", lineHeight: 1.9 }}>
          Characters are not isolated individuals. They are shaped by distance, extraction, and the invisible accounting systems of empire.
        </p>
      </section>
    </main>
  );
}