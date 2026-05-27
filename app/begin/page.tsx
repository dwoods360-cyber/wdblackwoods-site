import Link from "next/link";

export default function BeginPage() {
  return (
    <main>
      <h1>Begin Here — The Archive of What Coffee Demands</h1>

      <p>
        This is a literary archive of interconnected narrative fragments about empire,
        labor, and memory. Each entry is a restrained invitation into the world of
        What Coffee Demands.
      </p>

      <div className="suggested-order">
        <strong>Suggested Order:</strong>
        <ol>
          <li className="primary">
            <div>Recommended first entry</div>
            The Vine Crown
          </li>
          <li>Caravanserai Incident — Massawa</li>
          <li>The Arithmetic on the Wall</li>
          <li>Founding Entry: What Coffee Demands</li>
        </ol>
      </div>

      <p>
        Most readers begin here without realizing why.
      </p>

      <section>
        <h2>Start Here</h2>

        <ul className="story-list">
          <li>
            <Link href="/archive/vine-crown" className="story-link">
              The Vine Crown
            </Link>
            <p className="story-description">
              A private domestic fracture, where intimacy collides with a discovery that should not exist.
            </p>
          </li>

          <li>
            <Link href="/archive/caravanserai-incident-massawa" className="story-link">
              Caravanserai Incident — Massawa
            </Link>
            <p className="story-description">
              A scene where systems and hierarchy are revealed through movement, duty, and unseen rules.
            </p>
          </li>

          <li>
            <Link href="/archive/the-arithmetic-on-the-wall" className="story-link">
              The Arithmetic on the Wall
            </Link>
            <p className="story-description">
              Structural abstraction arrives as economic calculus written on a surface of control.
            </p>
          </li>

          <li>
            <Link href="/archive/founding-entry-what-coffee-demands" className="story-link">
              Founding Entry: What Coffee Demands
            </Link>
            <p className="story-description">
              A meta framing of the archive, setting the worldview and the forces that shape it.
            </p>
          </li>
        </ul>
      </section>

      <p>
        <em>Each entry reveals a different layer of the same system.</em>
      </p>
    </main>
  );
}
