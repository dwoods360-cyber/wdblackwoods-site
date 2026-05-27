import Link from "next/link";

export default function AboutPage() {
  return (
    <main>
      <nav>
        <Link href="/">Home</Link>
        <Link href="/begin">Begin</Link>
        <Link href="/archive">Archive</Link>
        <Link href="/about">About</Link>
      </nav>

      <section>
        <h1>About</h1>
      </section>
    </main>
  );
}
