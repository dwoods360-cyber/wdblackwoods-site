import Link from "next/link";
import { createPageMetadata } from "@/lib/siteMetadata";

export const metadata = createPageMetadata({
  title: "Begin — What Coffee Demands",
  description:
    "A threshold into the archive, beginning with The Vine Crown and the first quiet fracture of the record.",
  path: "/begin",
});

export default function BeginPage() {
  return (
    <main className="gateway-page">
      <section className="gateway-hero">
        <p className="gateway-hero-text">
          You are no longer reading about this work. You are inside its structure.
        </p>
      </section>

      <section className="gateway-primary">
        <p className="gateway-subtext">
          The archive is not a menu. It is a passage. Begin with the entry that
          invites you into the emotional architecture of the story.
        </p>
        <h1>The Vine Crown</h1>
        <p className="gateway-lead">
          A quiet domestic fracture inside the plantation household.
        </p>
        <p className="gateway-lead">
          Katherine found the vine crown on a Tuesday.
        </p>
        <Link href="/archive/vine-crown" className="primary-cta">
          Read “The Vine Crown” →
        </Link>
      </section>

      <section className="gateway-secondary">
        <p className="gateway-secondary-label">
          Secondary passages, held in reserve.
        </p>
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
        <p className="gateway-bottom-line">
          You do not need to choose what to read. You only need to begin.
        </p>
      </section>
    </main>
  );
}
