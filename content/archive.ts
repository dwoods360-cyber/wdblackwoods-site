export type ArchiveEntry = {
  title: string;
  subline: string;
  hook: string;
  context: string;
  body: string[];
  publishedAt?: string;
  descriptor?: string;
  openingLine?: string;
  bookLine?: string;
};

export type ArchiveCardMeta = {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  publishedAt?: string;
};

export const archiveEntries: Record<string, {
  title: string;
  subline: string;
  hook: string;
  context: string;
  body: string[];
  publishedAt?: string;
  descriptor?: string;
  openingLine?: string;
  bookLine?: string;
}> = {
  "vine-crown": {
    title: "The Vine Crown",
    subline: "From the Archive of What Coffee Demands — an archive excerpt",
    hook: "Katherine found the vine crown on a Tuesday.",
    context:
      "Location: Plantation household — Thread: Domestic discovery — Temporal Layer: Post-arrival settlement",
    body: [
      "Katherine found the vine crown on a Tuesday.",
      "She had been reorganising Sarah’s wardrobe — the girl was growing so fast that last season’s dresses were already too short — when her hand brushed something dry and brittle on the top shelf of the closet. She pulled it down carefully: a ring of woven vines, brown and desiccated, threaded with the papery remains of wildflowers that had once been bright.",
      "She turned it over in her hands. It was old—months, perhaps a year. Made with careful, patient fingers. Not Sarah’s work. Sarah’s craft projects were enthusiastic and chaotic. This was patient. Skilled. The work of a child who had learned to weave from the land itself.",
      "She set it on the bed and looked at it for a long time.",
      "Then she called Alice.",
      "Alice Clover had managed the Cartier household for eight years — through a sea crossing, a continent, and the building of a coffee plantation from bare highland soil. She examined the crown without touching it, the way she examined all evidence: with her eyes first, her hands never.",
      "“It is a vine crown,” she said. “The flowers are highland species. They grow near the waterfall.”",
      "“The waterfall,” Katherine repeated. “Where Sarah used to play. With the overseer’s son.”",
      "Alice said nothing. Her silence was its own confirmation.",
      "Katherine sat on the edge of the bed. She was not angry — not yet. She was assembling the picture the way she assembled the household accounts: methodically, looking for the discrepancy that would explain the sum.",
      "Sarah’s sudden interest in Amharic phrases. The afternoons she vanished between Alice’s rounds and supper. The way she had stopped asking permission to go outside and simply went. The careful, almost diplomatic language she used when speaking of the village — Berihun’s family, the workers’ children, never a specific name.",
      "“How long?” Katherine asked.",
      "“Since they were seven, Mrs. Cartier. I have monitored the situation.”",
      "“Monitored.” Katherine’s voice was flat. “You knew, and you did not tell me.”",
      "“I judged it to be a childhood friendship. Harmless, and in many ways beneficial — Sarah was learning the land, the language, the culture of this place. I would have intervened if I had seen cause.”",
      "“And now? She is twelve years old. He is twelve years old. At what point does your monitoring become negligence?”",
      "The word hung between them. Alice absorbed it without visible reaction, though a muscle tightened in her jaw.",
      "“With respect, Mrs. Cartier — Adathun kept her safe. He taught her the terrain, the animals, the boundaries of the wild. He was, in many respects, the best guardian she could have had in a land none of us fully understood.”",
      "Katherine paced to the window. Below, the plantation stretched in its orderly rows — Irwin’s grid imposed on the highland earth. Beyond it, the village. The distance between the two was perhaps half a mile. It might as well have been an ocean.",
      "“It cannot continue,” Katherine said. “She is approaching an age where perceptions matter. Where the wrong association could —”",
      "“Could what, Mrs. Cartier?” Alice’s voice was quiet, but it carried an edge Katherine rarely heard. “Could embarrass her in London? Could compromise her prospects with a suitable gentleman? We are not in London. We are in the Abyssinian highlands, and the son of the overseer is the closest thing your daughter has to a peer.”",
      "The conversation ended there — not resolved, but suspended, as so many things between them were. Katherine replaced the vine crown on the shelf, but she did not throw it away. She was not cruel. She simply understood, with the cold clarity of a woman who had navigated a world built to diminish her, that the crown belonged to a chapter of Sarah’s life that was closing.",
      "That evening, Katherine spoke to Sarah. The conversation was calm, measured, and devastating — not because Katherine raised her voice, but because she did not need to. She spoke of propriety, of stations, of the future that awaited Sarah in England or wherever the family’s fortunes carried them. She did not forbid. She simply made the cost of continued friendship so visible that Sarah would have to choose, consciously, to pay it.",
      "Sarah listened with the stillness she had learned from Alice. She did not argue. She did not cry. She went to her room, closed the door, and sat on her bed holding the vine crown, running her thumb along the brittle vines until a piece crumbled in her fingers.",
      "The next morning, she walked to the boundary shrubs—and did not go through.",
      "What Coffee Demands is a historical-adventure trilogy set in a composite vision of 1880s–1890s Abyssinia, following a British family, their household, and the people whose land they have come to cultivate.",
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
  "the-compass": {
    title: "The Compass",
    subline: "From the Archive of What Coffee Demands — an archive excerpt",
    hook: "Irwin stood alone in the dimly lit library, the document folder feeling impossibly heavy in his hands.",
    context:
      "Thread: Private reckoning / Inheritance — Temporal Layer: Pre-departure",
    publishedAt: "2026-06-15T13:00:00Z",
    descriptor:
      "A private reckoning, where a man discovers his father’s final measure of worth.",
    openingLine:
      "Irwin stood alone in the dimly lit library, the document folder feeling impossibly heavy in his hands.",
    bookLine: "What Coffee Demands — Book 1: Hold the Earth.",
    body: [
      "Irwin stood alone in the dimly lit library, the document folder feeling impossibly heavy in his hands. Thousands of unread books loomed around him, silent witnesses to the unraveling of his carefully constructed facade.",
      "His gaze drifted, unbidden, to the tall mahogany display case standing sentinel beside the library’s fireplace. He’d passed it a thousand times without a second glance. But now, among the donated curiosities of former members — a Peninsular War medal, a fragment of Roman tile, a surgeon’s brass telescope — his eye caught and held on a small, battered compass. A brass Dollond pocket compass, its face yellowed with age, its needle long since stilled. The engraved plate on the shelf beneath it read:",
      "Donated by Sir Edmund Cartier, 1871. “Navigation is not the art of finding safe harbor. It is the discipline of holding course.”",
      "His father’s compass. In a club full of inherited relics, his father had donated the one instrument that measured whether a man knew where he was going.",
      "Irwin looked away.",
      "He stared at the folder. Abyssinia. Highlands. Coffee plantations. The kind of audacious, ill-conceived scheme that had brought ruin to countless desperate men.",
      "But coffee merchants, when successful, amassed wealth beyond imagination. If he succeeded — when he succeeded — he would return vindicated, triumphant.",
      "A grim smile flickered across his face.",
      "He straightened his shoulders, smoothed the creases from his waistcoat, tucked the folder securely under his arm with the practiced bearing of a man who had made a deliberate choice, rather than had one brutally forced upon him.",
      "The late afternoon sun caught the brass nameplate affixed to the folder tucked beneath his arm, and for a fleeting moment, the refracted light created the illusion of gold.",
      "It wasn’t.",
    ],
  },
  "alice-and-the-spear": {
    title: "Alice and the Spear",
    subline: "From the Archive of What Coffee Demands — an archive excerpt",
    hook: "Sarah’s cries tore through the air.",
    context:
      "Thread: Protection / Combat memory — Temporal Layer: Massawa crossing",
    publishedAt: "2026-06-22T13:00:00Z",
    descriptor:
      "A transformation measured in the space between heartbeats.",
    openingLine: "Sarah’s cries tore through the air.",
    bookLine: "What Coffee Demands — Book 1: Hold the Earth.",
    body: [
      "Sarah’s cries tore through the air.",
      "Alice didn’t wait. As she passed a merchant’s stand, her hand closed around the shaft of a hunting spear without breaking stride — the way a cavalry trooper draws a saber from its scabbard, without thought, without hesitation, a motion burned into the muscle and bone by years of drill in the Bristol mud and worse.",
      "The weight of it was different from her Pattern 1853 — lighter, the balance forward of the grip — but her body adjusted in the space between heartbeats. She was no longer Alice Clover, household manager. She was the girl who had fired a twelve-pounder into a charging line and met the survivors with cold steel. The transformation was instantaneous and absolute, as if the domestic woman had been a costume she could shrug off like a shawl.",
      "She saw the kidnappers ahead, two men dragging Katherine’s limp form toward a darkened alley. She calculated distance, angle, the wobble of the unfamiliar shaft in her grip. Her breath steadied. The screaming market fell silent in her ears — the old, familiar tunnel vision of combat.",
      "Just before the kidnappers reached the safety of the dark alley, Alice hurled the weapon with terrifying precision.",
    ],
  },
  "berihuns-terms": {
    title: "Berihun’s Terms",
    subline: "From the Archive of What Coffee Demands — an archive excerpt",
    hook: "Berihun looked toward the men behind him, then toward the fields.",
    context:
      "Thread: Labor / Agreement — Temporal Layer: Plantation formation",
    publishedAt: "2026-06-29T13:00:00Z",
    descriptor:
      "An agreement sealed without hospitality, where the coffee is left to grow cold.",
    openingLine:
      "Berihun looked toward the men behind him, then toward the fields.",
    bookLine: "What Coffee Demands — Book 1: Hold the Earth.",
    body: [
      "Berihun looked toward the men behind him, then toward the fields. He remained silent long enough for one elder to shift his weight and another to lower his eyes.",
      "At last, Berihun straightened and agreed to move forward.",
      "“Understand this,” he said, stepping closer, ensuring Irwin saw the fire that still burned beneath the capitulation. “They work for the coin, to feed their families. Do not mistake their labor for loyalty.”",
      "The woman at the low table began to pour the first round of coffee into the small ceramic cups, the steam rising in thin, fragrant plumes. An elder reached out, his fingers trembling with the anticipation of the ritual — and the relief of the deal.",
      "But Berihun did not reach for a cup. He didn’t even look at it.",
      "“We start at dawn,” he said, his voice flat and final.",
      "Before the first sip could be taken, before the hospitality was sealed, Berihun turned his back and walked into the shadows of his home. He dismissed Irwin before Irwin could dismiss him, leaving the coffee to grow cold on the table.",
    ],
  },
  "the-hoe": {
    title: "The Hoe",
    subline: "From the Archive of What Coffee Demands — an archive excerpt",
    hook: "“Why did you come here?”",
    context:
      "Thread: Confession / Repair — Temporal Layer: Book 2",
    publishedAt: "2026-07-06T13:00:00Z",
    descriptor:
      "A midnight confession between a man who did something wrong and a boy who asks the only question that matters.",
    openingLine: "“Why did you come here?”",
    bookLine: "What Coffee Demands — Book 2: The Crown and the Bean.",
    body: [
      "“Why did you come here?”",
      "The old instinct surged: deflect, redirect, offer a useful lie. But the boy’s face was open, expecting honesty.",
      "“Because I did something wrong,” Ezra said. “And I needed a place where I could try to do something right.”",
      "Adathun considered this with the gravity of a ten-year-old who understood more than adults credited.",
      "“Did it work?”",
      "Ezra looked at the freshly sharpened hoe in the boy’s hands — a tool that would cut clean furrows tomorrow, that would help feed the village, that existed because he had stopped walking and knelt in the dirt.",
      "“I think it is starting to,” he said.",
      "He walked back to his hut. Yashoda was awake, waiting in the doorway. She saw something in his face she hadn’t seen before — not the anxiety of a fugitive, but the quiet steadiness of a man who had, for one small moment, been exactly where he was supposed to be.",
      "She said nothing. She simply took his hand and led him inside.",
    ],
  },
  "the-waterfall": {
    title: "The Waterfall",
    subline: "From the Archive of What Coffee Demands — an archive excerpt",
    hook: "Adathun knelt dramatically, holding up the box as if it were a priceless gift.",
    context:
      "Thread: Childhood / Hidden object — Temporal Layer: Highland settlement",
    publishedAt: "2026-07-13T13:00:00Z",
    descriptor:
      "Two children crown themselves rulers of a kingdom that exists behind falling water and will not survive the decade.",
    openingLine:
      "Adathun knelt dramatically, holding up the box as if it were a priceless gift.",
    bookLine: "What Coffee Demands — Book 1: Hold the Earth.",
    body: [
      "Adathun knelt dramatically, holding up the box as if it were a priceless gift.",
      "“Since we were talking about the royals, maybe I should present this to you, Your Majesty. A treasure fit for a queen.”",
      "Sarah raised an eyebrow, adopting a regal tone. “Oh? And what exactly am I supposed to do with it?”",
      "“Hold it for me, of course. A queen must protect her kingdom’s riches.”",
      "The object wasn’t gold or jewels, but the dull, dark grey of iron that had seen too many seasons. A strongbox, its surface etched with faint, scrolling patterns — ancient, geometric Serk’ motifs that looked like the tilet on her mother’s dress, but older, almost architectural. The metal felt bitingly cold against her skin. A sharp, unnatural chill that seemed to defy the humid mist of the alcove.",
      "Three distinct openings for keys. No keys.",
      "It didn’t rattle. Whatever was inside was packed tight, or perhaps it was lined with velvet.",
      "Sarah saw the importance he placed on the find and nodded, carefully taking the metallic weight into her hands. “Very well. I shall safeguard this treasure… for now.”",
      "“Then our kingdom is safe,” Adathun beamed.",
      "The light filtering through the waterfall began to dim as the sun set. A cool breeze drifted into the alcove. She sighed, tucking the cold box under her arm. “We should head back before Alice starts a search party.”",
      "As they neared the compound, they spotted May gathering wash from the clothesline. They froze in unison, clutching their crowns. For a heartbeat, the order of the house hung in the balance.",
      "May paused, a damp sheet draped over her arm, taking in their disheveled hair and the red dust on their shins. But then she offered a knowing, silent smile — the look of a fellow survivor who still remembered the grit of the road — and returned to her baskets.",
      "She would not be the one to break their perimeter.",
    ],
  },
};


export const archiveSlugs = Object.keys(archiveEntries);

export function isArchiveEntryPublished(entry: ArchiveEntry, now = new Date()) {
  return !entry.publishedAt || new Date(entry.publishedAt).getTime() <= now.getTime();
}

export function getPublishedArchiveSlugs(now = new Date()) {
  return archiveSlugs.filter((slug) => isArchiveEntryPublished(archiveEntries[slug], now));
}

export function getArchiveEntry(slug: string) {
  return archiveEntries[slug];
}

export function getPublishedArchiveEntry(slug: string, now = new Date()) {
  const entry = getArchiveEntry(slug);

  if (!entry || !isArchiveEntryPublished(entry, now)) {
    return undefined;
  }

  return entry;
}

export const archiveCardMeta: ArchiveCardMeta[] = [
  {
    slug: 'vine-crown',
    title: 'The Vine Crown',
    description:
      'A private domestic fracture, where intimacy collides with a discovery that should not exist.',
    excerpt: 'Katherine found the vine crown on a Tuesday.',
  },
  {
    slug: 'the-arithmetic-on-the-wall',
    title: 'The Arithmetic on the Wall',
    description:
      'Structural abstraction arrives as economic calculus written on a surface of control.',
    excerpt: 'This is not a companion essay. It is a map of the systems beneath the story.',
  },
  {
    slug: 'caravanserai-incident-massawa',
    title: 'Caravanserai Incident — Massawa',
    description:
      'A scene where systems and hierarchy are revealed through movement, duty, and unseen rules.',
    excerpt: 'Irwin expected to find the caravan where their cargo was being stored, but the camels had moved.',
  },
  {
    slug: 'founding-entry-what-coffee-demands',
    title: 'Founding Entry: What Coffee Demands',
    description:
      'A meta framing of the archive, setting the worldview and the forces that shape it.',
    excerpt: 'This publication begins as an archive, not an announcement.',
  },
  {
    slug: 'the-compass',
    title: 'The Compass',
    description:
      'A private reckoning, where a man discovers his father’s final measure of worth.',
    excerpt: 'Irwin stood alone in the dimly lit library, the document folder feeling impossibly heavy in his hands.',
    publishedAt: '2026-06-15T13:00:00Z',
  },
  {
    slug: 'alice-and-the-spear',
    title: 'Alice and the Spear',
    description:
      'A transformation measured in the space between heartbeats.',
    excerpt: 'Sarah’s cries tore through the air.',
    publishedAt: '2026-06-22T13:00:00Z',
  },
  {
    slug: 'berihuns-terms',
    title: 'Berihun’s Terms',
    description:
      'An agreement sealed without hospitality, where the coffee is left to grow cold.',
    excerpt: 'Berihun looked toward the men behind him, then toward the fields.',
    publishedAt: '2026-06-29T13:00:00Z',
  },
  {
    slug: 'the-hoe',
    title: 'The Hoe',
    description:
      'A midnight confession between a man who did something wrong and a boy who asks the only question that matters.',
    excerpt: '“Why did you come here?”',
    publishedAt: '2026-07-06T13:00:00Z',
  },
  {
    slug: 'the-waterfall',
    title: 'The Waterfall',
    description:
      'Two children crown themselves rulers of a kingdom that exists behind falling water and will not survive the decade.',
    excerpt: 'Adathun knelt dramatically, holding up the box as if it were a priceless gift.',
    publishedAt: '2026-07-13T13:00:00Z',
  },
];

export function getPublishedArchiveCardMeta(now = new Date()) {
  return archiveCardMeta.filter((item) => {
    const entry = archiveEntries[item.slug];

    return entry ? isArchiveEntryPublished(entry, now) : false;
  });
}
