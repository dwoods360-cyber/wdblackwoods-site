import Link from "next/link";
import { notFound } from "next/navigation";

const entries: Record<string, {
  title: string;
  subline: string;
  hook: string;
  context: string;
  body: string[];
}> = {
  "vine-crown": {
    title: "The Vine Crown",
    subline: "An extracted field record from the Abyssinian highlands, 1880s",
    hook: "The room held the weight of an unsettled household. The silence was not empty; it was listening for a mistake to be named.",
    context:
      "Location: Abyssinian Highlands — Thread: Domestic / Plantation Household — Temporal Layer: Post-arrival settlement phase",
    body: [
      "The door had been left unlatched, not out of carelessness, but because the line between guest and servant was frayed beyond repair. The scent of boiled coffee and damp wool lingered in the timber, a residue of a long night of counting and quiet rage.",
      "A young woman moved through the kitchen as if cataloguing the shape of each breath. Her ledger was not the book on the table; it was the way the hearth fell silent when the master’s shadow passed.",
      "On the other side of the yard, a crown of vines had been trimmed and bound, the stems arrested in a circle as if the plant itself had been asked to keep watch over something forbidden.",
    ],
  },
  "caravanserai-incident-massawa": {
    title: "Caravanserai Incident — Massawa",
    subline: "A placeholder archive record",
    hook: "A fragmentary scene from the caravanserai.",
    context:
      "Location: Massawa — Thread: Trade / Interface — Temporal Layer: Arrival phase",
    body: ["A port-side scene where distant systems press inward."],
  },
  "the-arithmetic-on-the-wall": {
    title: "The Arithmetic on the Wall",
    subline: "A placeholder archive record",
    hook: "A ledger written on plaster struck the same note as a command.",
    context:
      "Location: Interior — Thread: Calculation / Control — Temporal Layer: Daily operations",
    body: ["An abstract record of totals and absences."],
  },
  "founding-entry-what-coffee-demands": {
    title: "Founding Entry: What Coffee Demands",
    subline: "A placeholder archive record",
    hook: "The archive opens in a mapped urgency, not in explanation.",
    context:
      "Location: Archive — Thread: Origin / Worldview — Temporal Layer: Foundational narrative",
    body: ["A framed introduction to the forces that shape the archive."],
  },
};

export default function ArchiveEntryPage({ params }: { params: { slug: string } }) {
  const entry = entries[params.slug];

  if (!entry) {
    notFound();
  }

  return (
    <main>
      <nav>
        <Link href="/">Home</Link>
        <Link href="/begin">Begin</Link>
        <Link href="/archive">Archive</Link>
        <Link href="/about">About</Link>
      </nav>

      <section>
        <p className="meta">From the Archive of What Coffee Demands</p>
        <h1>{entry.title}</h1>
        <p className="meta">{entry.subline}</p>
        <p>{entry.hook}</p>
        <p className="meta">{entry.context}</p>
        {entry.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <p className="meta">End of extracted field record</p>
      </section>
    </main>
  );
}
