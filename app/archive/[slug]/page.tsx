import { notFound } from "next/navigation";

const entries: Record<string, { title: string; description: string }> = {
  "vine-crown": {
    title: "The Vine Crown",
    description: "A quiet place in the archive where a private fracture begins to open.",
  },
  "caravanserai-incident-massawa": {
    title: "Caravanserai Incident — Massawa",
    description: "A port-side scene in which systems and hierarchy become visible.",
  },
  "the-arithmetic-on-the-wall": {
    title: "The Arithmetic on the Wall",
    description: "An abstract ledger of control rendered as economic structure.",
  },
  "founding-entry-what-coffee-demands": {
    title: "Founding Entry: What Coffee Demands",
    description: "A framed introduction to the archive's worldview and its forces.",
  },
};

export default function ArchiveEntryPage({ params }: { params: { slug: string } }) {
  const entry = entries[params.slug];

  if (!entry) {
    notFound();
  }

  return (
    <main style={{ maxWidth: "760px", margin: "0 auto", padding: "48px 24px" }}>
      <h1>{entry.title}</h1>
      <p style={{ marginTop: "24px", lineHeight: 1.8 }}>{entry.description}</p>
    </main>
  );
}
