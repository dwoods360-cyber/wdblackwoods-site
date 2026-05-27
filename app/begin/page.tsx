export default function BeginPage() {
  return (
    <main style={{ maxWidth: "760px", margin: "0 auto", padding: "48px 24px" }}>
      <h1>Begin Here — The Archive of What Coffee Demands</h1>

      <p style={{ marginTop: "24px", lineHeight: 1.8 }}>
        This is a literary archive of interconnected narrative fragments about empire,
        labor, and memory. Each entry is a restrained invitation into the world of
        What Coffee Demands.
      </p>

      <div style={{ marginTop: "32px", color: "#555", fontSize: "15px", lineHeight: 1.7 }}>
        <strong>Suggested Order:</strong>
        <ol style={{ marginTop: "12px", paddingLeft: "20px", marginBottom: "0" }}>
          <li style={{ marginBottom: "8px" }}>
            <div style={{ fontSize: "14px", color: "#777", marginBottom: "4px" }}>
              Recommended first entry
            </div>
            <span style={{ fontWeight: 600, fontSize: "16px" }}>The Vine Crown</span>
          </li>
          <li>Caravanserai Incident — Massawa</li>
          <li>The Arithmetic on the Wall</li>
          <li>Founding Entry: What Coffee Demands</li>
        </ol>
      </div>

      <p style={{ marginTop: "24px", color: "#555", fontSize: "15px", lineHeight: 1.7 }}>
        Most readers begin here without realizing why.
      </p>

      <section style={{ marginTop: "40px" }}>
        <h2>Start Here</h2>

        <ul style={{ listStyle: "none", padding: 0, marginTop: "24px", display: "grid", gap: "24px" }}>
          <li>
            <a href="#vine-crown" style={{ fontSize: "18px", textDecoration: "none" }}>
              The Vine Crown
            </a>
            <p style={{ margin: "8px 0 0", lineHeight: 1.6 }}>
              A private domestic fracture, where intimacy collides with a discovery that should not exist.
            </p>
          </li>

          <li>
            <a href="#caravanserai" style={{ fontSize: "18px", textDecoration: "none" }}>
              Caravanserai Incident — Massawa
            </a>
            <p style={{ margin: "8px 0 0", lineHeight: 1.6 }}>
              A scene where systems and hierarchy are revealed through movement, duty, and unseen rules.
            </p>
          </li>

          <li>
            <a href="#arithmetic" style={{ fontSize: "18px", textDecoration: "none" }}>
              The Arithmetic on the Wall
            </a>
            <p style={{ margin: "8px 0 0", lineHeight: 1.6 }}>
              Structural abstraction arrives as economic calculus written on a surface of control.
            </p>
          </li>

          <li>
            <a href="#founding-entry" style={{ fontSize: "18px", textDecoration: "none" }}>
              Founding Entry: What Coffee Demands
            </a>
            <p style={{ margin: "8px 0 0", lineHeight: 1.6 }}>
              A meta framing of the archive, setting the worldview and the forces that shape it.
            </p>
          </li>
        </ul>
      </section>

      <p style={{ marginTop: "48px", fontStyle: "italic" }}>
        Each entry reveals a different layer of the same system.
      </p>
    </main>
  );
}
