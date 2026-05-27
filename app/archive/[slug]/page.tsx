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
    subline: "From the Archive of What Coffee Demands — an excerpt",
    hook: "Katherine found the vine crown on a Tuesday.",
    context:
      "Location: Plantation household — Thread: Domestic discovery — Temporal Layer: Post-arrival settlement",
    body: [
      "Katherine found the vine crown on a Tuesday.",
      "She had been reorganising Sarah’s wardrobe — the girl was growing so fast that last season’s dresses were already too short — when her hand brushed something dry and brittle on the top shelf of the closet. She pulled it down carefully: a ring of woven vines, brown and desiccated, threaded with the papery remains of wildflowers that had once been bright.",
      "She turned it over in her hands. It was old— months, perhaps a year. Made with careful, patient fingers. Not Sarah’s work. Sarah’s craft projects were enthusiastic and chaotic. This was patient. Skilled. The work of a child who had learned to weave from the land itself.",
      "She set it on the bed and looked at it for a long time.",
      "Then she called Alice.",
      "Alice Clover had managed the Cartier household for eight years — through a sea crossing, a continent, and the building of a coffee plantation from bare highland soil. She examined the crown without touching it, the way she examined all evidence: with her eyes first, her hands never.",
      "\"It is a vine crown,\" she said. \"The flowers are highland species. They grow near the waterfall.\"",
      "\"The waterfall,\" Katherine repeated. \"Where Sarah used to play. With the overseer’s son.\"",
      "Alice said nothing. Her silence was its own confirmation.",
      "Katherine sat on the edge of the bed. She was not angry — not yet. She was assembling the picture the way she assembled the household accounts: methodically, looking for the discrepancy that would explain the sum.",
      "Sarah’s sudden interest in Amharic phrases. The afternoons she vanished between Alice’s rounds and supper. The way she had stopped asking permission to go outside and simply went. The careful, almost diplomatic language she used when speaking of the village — Berihun’s family, the workers’ children, never a specific name.",
      "\"How long?\" Katherine asked.",
      "\"Since they were seven, Mrs. Cartier. I have monitored the situation.\"",
      "\"\"Monitored.\" Katherine’s voice was flat. \"You knew, and you did not tell me.\"\n",
      "\"I judged it to be a childhood friendship. Harmless, and in many ways beneficial — Sarah was learning the land, the language, the culture of this place. I would have intervened if I had seen cause.\"",
      "\"And now? She is twelve years old. He is twelve years old. At what point does your monitoring become negligence?\"",
      "The word hung between them. Alice absorbed it without visible reaction, though a muscle tightened in her jaw.",
      "\"With respect, Mrs. Cartier — Adathun kept her safe. He taught her the terrain, the animals, the boundaries of the wild. He was, in many respects, the best guardian she could have had in a land none of us fully understood.\"",
      "Katherine paced to the window. Below, the plantation stretched in its orderly rows — Irwin’s grid imposed on the highland earth. Beyond it, the village. The distance between the two was perhaps half a mile. It might as well have been an ocean.",
      "\"It cannot continue,\" Katherine said. \"She is approaching an age where perceptions matter. Where the wrong association could —\"",
      "Katherine rarely heard. \"Could embarrass her in London? Could compromise her prospects with a suitable gentleman? We are not in London. We are in the Abyssinian highlands, and the son of the overseer is the closest thing your daughter has to a peer.\"",
      "The conversation ended there — not resolved, but suspended, as so many things between them were. Katherine replaced the vine crown on the shelf, but she did not throw it away. She was not cruel. She simply understood, with the cold clarity of a woman who had navigated a world built to diminish her, that the crown belonged to a chapter of Sarah’s life that was closing.",
      "That evening, Katherine spoke to Sarah. The conversation was calm, measured, and devastating — not because Katherine raised her voice, but because she did not need to. She spoke of propriety, of stations, of the future that awaited Sarah in England or wherever the family’s fortunes carried them. She did not forbid. She simply made the cost of continued friendship so visible that Sarah would have to choose, consciously, to pay it.",
      "Sarah listened with the stillness she had learned from Alice. She did not argue. She did not cry. She went to her room, closed the door, and sat on her bed holding the vine crown, running her thumb along the brittle vines until a piece crumbled in her fingers.",
      "The next morning, she walked to the boundary shrubs— and did not go through.",
      "What Coffee Demands is a trilogy set in composite 1880s–1890s Abyssinia, following a British family, their household, and the people whose land they have come to cultivate. Book 1: Hold the Earth. Book 2: The Crown and the Bean. Book 3: The Price.",
    ],
  },
  "caravanserai-incident-massawa": {
    title: "Caravanserai Incident — Massawa",
    subline: "Inside the caravanserai, hierarchy reveals itself before language does.",
    hook: "Irwin expected to find the caravan where their cargo was being stored, but the camels had moved.",
    context:
      "Location: Massawa port — Thread: Trade / Interface — Temporal Layer: Arrival phase",
    body: [
      "Irwin expected to find the caravan where their cargo was being stored, but the camels had moved.",
      "The clerk at the port office gave him directions with casual certainty. Left at the spice tents. Past the tether lines. Second storage lane beyond the wells.",
      "Ten minutes later, Irwin was lost.",
      "The deeper he wandered into the caravanserai, the more the port seemed to rearrange itself around him. Canvas walls shifted in the heat haze. Camels groaned beneath stacked cargo. Men shouted in languages he did not understand while the smell of livestock, sweat, saltwater, and charcoal pressed against him like physical weight.",
      "Finally, he found the correct caravan markings.",
      "Their trunks sat beneath stretched canvas, apparently untouched.",
      "Then he noticed the knots.",
      "The ropes securing Katherine’s household crates had been retied—looser and clumsier than the tight professional lashings used aboard the Malwa.",
      "Irwin frowned.",
      "He pulled back the canvas.",
      "Nothing appeared stolen.",
      "But someone had searched the contents.",
      "A brass lamp Katherine had packed facing left now faced right. Folded linens had been disturbed and restacked unevenly. A jewelry case sat slightly ajar.",
      "\"Someone’s been through these,\" he muttered.",
      "A chill prickled the back of his neck despite the heat.",
      "He scanned the caravanserai instinctively—the merchant tents, kneeling camels, stacked cargo, shadowed gaps between wagons. Anyone could have done it.",
      "But thieves stole valuables.",
      "This had not been theft.",
      "Someone had been looking for something specific.",
      "And apparently had not found it.",
      "Trying to steady himself, Irwin opened his ledger and checked the shipment inventory again.",
      "The farming tools.",
      "The saws.",
      "The axes.",
      "The spades Wilfred had insisted they bring from London.",
      "He searched the stacks twice before the realization finally struck him.",
      "The equipment had never been loaded onto the Malwa.",
      "It had been shipped separately.",
      "On the Victoria.",
      "The ship now resting at the bottom of the Red Sea.",
      "Irwin gripped the edge of a crate as the full weight of the mistake settled onto him.",
      "They were traveling into the highlands to build a plantation.",
      "And they had no tools to clear the land.",
      "He turned to leave.",
      "The heat rising from the packed earth distorted the air ahead of him. Familiar landmarks dissolved into shimmering mirage. Every passage between the cargo lanes looked identical.",
      "The claustrophobia arrived suddenly.",
      "Cold.",
      "Sharp.",
      "Total.",
      "Irwin rounded a stack of crates too quickly and slammed directly into something solid.",
      "He stumbled backward.",
      "\"I’m terribly sorr—\"",
      "The apology died in his throat.",
      "The man standing before him was enormous.",
      "Dust coated the warrior’s bare forearms and shield. His spear tip hovered inches from Irwin’s chest before Irwin even realized it had moved.",
      "The warrior barked something in Tigrinya.",
      "Irwin raised his hands immediately.",
      "\"I’m lost,\" he said. \"I’m leaving.\"",
      "The spear did not lower.",
      "Panic surged through him.",
      "He stepped backward—",
      "—and collided with someone else.",
      "A hand clamped onto his shoulder with terrifying ease.",
      "Irwin looked up slowly.",
      "The man behind him wore crimson robes layered over chainmail that flashed beneath the fabric whenever he moved. Rings glinted across heavy fingers. His beard was thick. His expression utterly calm.",
      "Not angry.",
      "Not excited.",
      "Worse.",
      "Bored.",
      "The warrior with the spear froze instantly.",
      "Irwin understood the hierarchy immediately.",
      "This man did not merely command violence.",
      "He inhabited it.",
      "The giant studied him briefly, as though evaluating whether Irwin represented a genuine inconvenience.",
      "Apparently deciding he did not, the man spoke a single low command to his guard.",
      "Then he shoved Irwin aside.",
      "Not violently.",
      "Casually.",
      "Like moving furniture from a walkway.",
      "Irwin hit the dirt hard enough to lose his breath.",
      "By the time he looked up again, the crimson-robed giant and his retinue were already disappearing through the haze of the caravan lanes without once looking back.",
      "To them, he had never existed at all.",
    ],
  },
  "the-arithmetic-on-the-wall": {
    title: "The Arithmetic on the Wall",
    subline: "Routes, Labour, and Distance in What Coffee Demands",
    hook: "This is not a companion essay. It is a map of the systems beneath the story.",
    context:
      "Thread: Systems / Economy / Distance — Temporal Layer: Structural overview",
    body: [
      "This is not a companion essay. It is a map of the systems beneath the story.",
      "How to Read This",
      "What follows is not background.",
      "It is not context.",
      "It is the operating logic of the story — the systems that determine who moves, who is paid, who survives, and who disappears without record.",
      "If you understand this map, you will understand how events are made inevitable.",
      "If you do not, you will still feel it.",
      "Empires are not held together by flags.",
      "They are held together by roads cut into mountain passes, by ledgers balanced in distant offices, by harvest seasons timed to foreign markets, and by the quiet understanding — never written down, never spoken aloud — that some people will always eat differently than others.",
      "The Route",
      "Southampton to Aden. Aden to Massawa. Massawa overland through the Tigrayan plateau, where the air thins and the mules pick their way along cliff paths wide enough for one animal at a time. Down into the Gibe River Gorge — the ropes groaning under the weight of carriages lowered by hand over a descent steep enough to kill anyone who loses their grip. Then south through highland forest where the canopy closes overhead, to the Kaffa region, where coffee has grown wild since before anyone called it coffee.",
      "Eight years later, the return route runs in the opposite direction and at a different speed. Over a mountain ridge in the dark. Rope-assisted. Hand-over-hand. Through the Afar Depression — salt flats, heat haze, thorn scrub that scratches at boots and flanks — to a harbour town where a ship called the Talisman is waiting.",
      "Between these two routes: a civil war, a burning house, and four dead men in doorways who bought the family thirty seconds each.",
      "The Coffee",
      "Wild coffee grows in the Kaffa highlands at altitudes between 1,500 and 2,100 metres. The trees are ancient, gnarled, heavy with cherries that ripen according to rainfall, altitude, and the particular volcanic composition of the soil.",
      "For centuries, local farmers harvested these cherries and sold them to Arab traders who came up from the coast with camels. The trade was steady. It was controlled by the people who lived on the land.",
      "Then Europeans arrived with surveys and land grants signed in distant capitals. They built processing sheds with sorting tables and drying beds — long wooden racks where parchment-covered beans dried precisely beneath the sun. They posted the London auction results on the shed wall, printed in English, for the owner to admire.",
      "Twelve shillings a pound. Premium grade.",
      "The men who picked it earned three birr a week. The same as last year. The same as the year before.",
      "The Distance",
      "Half a mile separates the main house from the village compound. The house has glass windows, reinforced doors, a kitchen with a cast-iron stove, and a veranda where the owner drinks T’ej and watches the fields. The village has woven bamboo huts with latches on the doors and roofs that do not leak.",
      "The overseer walks between both every morning. His skin absorbs the early light. The carved wooden bead on his wrist belonged to his father, and his father’s father, and the men before them who walked this land when it answered to no one’s ledger.",
      "He has kept accounts since the first season. They are more complete than the owner’s.",
      "He has never said this aloud. He has never needed to. The numbers speak for themselves, and the numbers are on the wall.",
      "The Names",
      "A stone arena in the capital. Tall pillars rising toward a ceiling that depicts the unbroken imperial line of succession. The benches hold warlords in lion-mane headdresses beside nomadic horsemen in road-worn leather, desert elders beside black-robed priests whose authority predates every dynasty in the room.",
      "An emperor has died. A successor must be chosen. The air inside is thick with frankincense and the particular tension of men who carry swords and disagree about the future.",
      "They reach consensus by morning.",
      "By evening, three of them have met in a room with a single torch and planned the assassinations that will undo everything the morning agreed to. The killings will be disguised as bandit raids. The roads will run with blood before the capital understands what has happened.",
      "The warlord who orchestrated this sits rigid in his tent, a map of the plantation spread before him. His finger traces the route from camp to house. The nail leaves a faint white line on the paper.",
      "\"Burn it,\" he says. \"Bring the foreigners alive.\"",
      "A pause.",
      "\"I want to kill them myself.\"",
      "Villages alter their planting patterns based on rumours of his movement. Entire communities reroute their travel, their trade, their marriage alliances. His name is spoken the way weather is spoken — not with anger, but with the flat recognition that certain forces do not negotiate.",
      "The Household",
      "In a London gentleman’s club, a chair is designed to discourage departure. The scotch is a Macallan — offensively expensive, a luxury the man holding it cannot afford but will never decline. His stipend is terminated. His solicitor hands him a leather folder full of contracts for land he has never seen, in a country he cannot locate on a map.",
      "His wife is already packing. Not the obvious preparations — the trunks, the linens, the servants’ instructions. The private ones. The ones her husband does not know about and will not know about until the money runs out, and she is the only person in the household who has any.",
      "Eight years later, this same woman ties a rope to a rock face in the dark using a knot she learns at seventeen in a barracks, and nine people climb it, and all nine survive, and she sits at the top with her chest heaving and her arms trembling and says nothing, because saying something would imply she expects gratitude, and she has never expected gratitude for keeping people alive. She considers it a job specification.",
      "The Ground Hornbills",
      "A boy tells a girl about the ground hornbills.",
      "They are large birds — black-feathered, red-throated, territorial. They walk the highland ridges in pairs, watching. They have rules the boy has learned from years of observation: where they nest, how they hunt, what sounds they make when a predator approaches, what sounds they make when the predator leaves.",
      "The girl listens carefully. She is seven. He is seven. They are sitting behind a waterfall in a place they will later call a fortress, sharing a game played with stones in shallow pits, and neither of them understands what it will eventually cost.",
      "Not because of what it is.",
      "Because of what it costs.",
      "His father’s land was taken. Her father’s contract sits on that land. He steadies the ox yoke. She rides the horse. He earns a work card at ten. She learns French deportment at twelve. He sharpens a hoe by moonlight. She hides an iron box on the top shelf of her closet and tells no one.",
      "Seven years later, a column of refugees moves north through the dark, and they walk side by side without speaking, because everything that needed saying was said behind a waterfall when they were too young to know it mattered.",
      "The ground hornbills watched them then.",
      "The ground hornbills are not watching now.",
      "What the Wall Does Not Measure",
      "A woman stands at a kitchen window in a harbour town, looking at a ship she is supposed to board in the morning. Behind her, the broth she made from dried meat and the last of the herbs is cooling on a stove that is not hers, in a country that is not hers, at the end of a road she did not choose.",
      "She touches her chest. Beneath her shirt, a piece of folded paper. Handwriting she has carried for eight years. Ink faded. Paper soft as cloth.",
      "Tomorrow the ship sails west.",
      "The man who wrote those words is somewhere east. In the hills. If he is still alive.",
      "She will board the ship. Or she will not.",
      "The arithmetic on the wall has no column for this.",
      "What Coffee Demands — a trilogy set in composite 1880s–1890s Abyssinia. Book 1: Hold the Earth. Book 2: The Crown and the Bean. Book 3: The Price.",
    ],
  },
  "founding-entry-what-coffee-demands": {
    title: "Founding Entry: What Coffee Demands",
    subline: "A developing literary universe of empire, survival, and memory.",
    hook: "This publication begins as an archive, not an announcement.",
    context:
      "Thread: Archive framing / Authorial note — Temporal Layer: Publication origin",
    body: [
      "This publication begins as an archive, not an announcement.",
      "What Coffee Demands is a developing historical fiction trilogy set within a wider literary universe of empire, survival, and memory.",
      "It follows individuals moving through collapsing political landscapes shaped by trade, war, and the systems built around coffee—its cultivation, its movement, and the power structures that grow from it.",
      "This is not a finished world.",
      "It is a record of one being built in real time.",
      "The work that follows will appear in fragments:",
      "• excerpts from the trilogy",
      "• character perspectives",
      "• historical inspirations",
      "• worldbuilding records",
      "• narrative passages from a larger unfolding structure",
      "W.D. Blackwoods is the authorial identity behind this work.",
      "Not a persona, but a signature attached to an ongoing literary construction.",
      "If you are reading this at the beginning, you are not early to a story.",
      "You are present at its formation.",
      "This is the record of What Coffee Demands.",
    ],
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
