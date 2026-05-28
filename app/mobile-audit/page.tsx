import Link from "next/link"

const proseParagraphs = [
  "This route exists to test whether the archive can hold a long line without becoming ornamental, cramped, or brittle at smaller widths.",
  "A literary page needs enough air for the sentence to settle, but not so much that each paragraph feels stranded from the one that follows.",
  "On narrow screens, the rhythm should remain continuous: headings should wrap with dignity, metadata should stay quiet, and links should feel deliberate rather than interruptive.",
]

export default function MobileAuditPage() {
  return (
    <main className="document-page">
      <nav>
        <Link href="/">Home</Link>
        <Link href="/begin">Begin</Link>
        <Link href="/archive">Archive</Link>
        <Link href="/about">About</Link>
      </nav>

      <section>
        <p className="meta">Internal typography calibration route.</p>
        <h1>Mobile Reading Rhythm and Archive Typography Audit</h1>
        <p>
          A private calibration surface for inspecting line length, heading wraps,
          paragraph rhythm, metadata weight, navigation interruption, and CTA
          spacing across mobile, tablet, and desktop widths.
        </p>
      </section>

      <section className="home">
        <p className="meta">Homepage hero example</p>
        <h1>W.D. Blackwoods</h1>
        <p className="meta">From the archive of What Coffee Demands.</p>
        <div className="threshold">
          <p>
            This is not a blog.
            <br />
            It is a structured record of a world under construction.
          </p>
        </div>
      </section>

      <section className="gateway-hero">
        <p className="meta">Begin threshold example</p>
        <p className="gateway-hero-text">
          You are no longer reading about this work. You are inside its
          structure.
        </p>
      </section>

      <section className="gateway-primary">
        <p className="gateway-subtext">
          The archive is not a menu. It is a passage. Begin with the entry that
          invites you into the emotional architecture of the story.
        </p>
        <h1>The Vine Crown</h1>
        <p className="gateway-lead">
          A quiet, decisive movement from observation into the first interior
          scene of the archive.
        </p>
        <Link href="/archive/vine-crown" className="primary-cta">
          Continue into the archive →
        </Link>
      </section>

      <section className="gateway-secondary">
        <p className="gateway-secondary-label">Secondary passages, held in reserve.</p>
        <ul className="gateway-links">
          <li>
            <Link href="/archive/the-arithmetic-on-the-wall" className="gateway-secondary-link">
              The Arithmetic on the Wall
            </Link>
          </li>
          <li>
            <Link href="/archive/caravanserai-incident-massawa" className="gateway-secondary-link">
              Caravanserai Incident — Massawa
            </Link>
          </li>
          <li>
            <Link href="/archive/founding-entry-what-coffee-demands" className="gateway-secondary-link">
              Founding Entry: What Coffee Demands
            </Link>
          </li>
        </ul>
      </section>

      <section className="archive-entry-section">
        <div className="archive-entry-framing">
          <p>
            Archive index example: a threshold entry should feel dominant without
            turning the page into a presentation card.
          </p>
        </div>

        <article className="archive-featured-entry">
          <h1>The Vine Crown</h1>
          <p className="story-description">
            A private domestic fracture, where intimacy collides with a discovery
            that should not exist.
          </p>
          <p className="story-excerpt">
            Katherine found the vine crown on a Tuesday.
          </p>
          <Link href="/archive/vine-crown" className="primary-entry-link">
            Enter the archive
          </Link>
        </article>
      </section>

      <section className="archive-descent-section">
        <p className="archive-descent-lead">
          What follows is not a roster of options. It is a descent through
          related textures and frames that grow quieter after the threshold is
          crossed.
        </p>
        <article className="secondary-entry">
          <h2>The Arithmetic on the Wall</h2>
          <p className="story-description">
            Structural abstraction arrives as economic calculus written on a
            surface of control.
          </p>
          <p className="story-excerpt">
            This is not a companion essay. It is a map of the systems beneath
            the story.
          </p>
        </article>
      </section>

      <div className="archive-document-page">
        <section>
          <p className="meta">Archive document example</p>
          <h1>A Deliberately Long Archive Entry Title for Testing Mobile Heading Wraps</h1>
          <p className="meta">
            Location: Plantation household — Thread: Domestic discovery —
            Temporal Layer: Post-arrival settlement
          </p>
          <p>Katherine found the vine crown on a Tuesday.</p>
          {proseParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <p className="meta">End of extracted field record</p>
        </section>
      </div>

      <section>
        <p className="meta">Metadata and edge-case wrapping example</p>
        <h2>Short Heading</h2>
        <p>
          A short heading should not collapse the page rhythm or leave the
          following paragraph feeling detached from its label.
        </p>
        <h2>
          Long Heading With Several Archive-Weighted Phrases That Should Wrap
          Without Becoming Grandiose
        </h2>
        <p>
          This sentence tests a narrow viewport with names, clauses, and archival
          phrasing that may wrap across several lines while preserving a calm
          reading measure.
        </p>
        <p>
          SupercalibratedArchiveContinuityWithoutUnwantedOverflow should remain
          visible as a stress test for unusual language and long compounds.
        </p>
      </section>
    </main>
  )
}
