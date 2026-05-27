export default function BeginPage() {
  return (
    <main style={{ maxWidth: "760px", margin: "0 auto", padding: "48px 24px" }}>
      <h1>Begin Here — The Archive of What Coffee Demands</h1>

      <p style={{ marginTop: "24px", lineHeight: 1.8 }}>
        This is a literary archive of interconnected narrative fragments about empire,
        labor, and memory. Each entry is a restrained invitation into the world of
        What Coffee Demands.
      </p>

      <section style={{ marginTop: "40px" }}>
        <h2>Start Here</h2>

        <ul style={{ listStyle: "none", padding: 0, marginTop: "24px", display: "grid", gap: "24px" }}>
          <li>
            <a href="#vine-crown" style={{ fontSize: "18px", textDecoration: "none" }}>
              The Vine Crown
            </a>
            <p style={{ margin: "8px 0 0", lineHeight: 1.6 }}>
              A quiet chronicle of a title earned and the market forces rippling beneath it.
            </p>
          </li>

          <li>
            <a href="#caravanserai" style={{ fontSize: "18px", textDecoration: "none" }}>
              Caravanserai Incident — Massawa
            </a>
            <p style={{ margin: "8px 0 0", lineHeight: 1.6 }}>
              A fragmentary scene where distance, duty, and violence meet at a harbor outpost.
            </p>
          </li>

          <li>
            <a href="#arithmetic" style={{ fontSize: "18px", textDecoration: "none" }}>
              The Arithmetic on the Wall
            </a>
            <p style={{ margin: "8px 0 0", lineHeight: 1.6 }}>
              The ledger of control is rendered in chalk and silence, revealing unseen priorities.
            </p>
          </li>

          <li>
            <a href="#founding-entry" style={{ fontSize: "18px", textDecoration: "none" }}>
              Founding Entry: What Coffee Demands
            </a>
            <p style={{ margin: "8px 0 0", lineHeight: 1.6 }}>
              The original dispatch that anchors the archive in a landscape of trade and loss.
            </p>
          </li>
        </ul>
      </section>

      <p style={{ marginTop: "48px", fontStyle: "italic" }}>
        Read in order, or follow the fractures.
      </p>
    </main>
  );
}
