export type ArchiveArtifact = {
  filename: string;
  title: string;
  description: string;
  storyEmphasis: string;
};

export type ArchiveArtifactPage = {
  slug: string;
  title: string;
  excerptTitle: string;
  publishedAt: string;
  description: string;
  artifacts: ArchiveArtifact[];
};

export const artifactDownloadBasePath = "/downloads/artifacts";

export const archiveArtifactPages: ArchiveArtifactPage[] = [
  {
    slug: "the-compass",
    title: "Objects from “The Compass”",
    excerptTitle: "The Compass",
    publishedAt: "2026-06-15T13:00:00Z",
    description:
      "Three archive objects from Irwin’s private reckoning in the Stirling Club library.",
    artifacts: [
      {
        filename: "03_brass_compass.png",
        title: "Brass Expedition Compass",
        description:
          "A battered brass Dollond pocket compass donated by Sir Edmund Cartier and displayed in the Stirling Club library.",
        storyEmphasis:
          "This is Irwin’s father’s compass, not a generic navigation tool. It represents inherited judgment, direction, ambition, and the illusion of holding course.",
      },
      {
        filename: "14_stirling_club_library.png",
        title: "Stirling Club Library",
        description:
          "A private club library of dark shelves, inherited relics, and quiet institutional pressure.",
        storyEmphasis:
          "The room frames Irwin’s reckoning: a place of influence, judgment, display, and social inheritance.",
      },
      {
        filename: "15_leather_bound_portfolio.png",
        title: "Leather-Bound Document Portfolio",
        description:
          "A worn leather-bound document folder carrying the Abyssinian coffee scheme, its brass nameplate briefly catching the light like gold.",
        storyEmphasis:
          "This is Irwin’s scheme made physical: papers, routes, ambition, and the illusion that planning can master danger.",
      },
    ],
  },
  {
    slug: "alice-and-the-spear",
    title: "Objects from “Alice and the Spear”",
    excerptTitle: "Alice and the Spear",
    publishedAt: "2026-06-22T13:00:00Z",
    description:
      "Three archive objects tracing Alice’s market reaction back to military discipline and cavalry memory.",
    artifacts: [
      {
        filename: "23_alice_hunting_spear.png",
        title: "Alice’s Market Spear",
        description:
          "The hunting spear Alice seizes in the market without breaking stride.",
        storyEmphasis:
          "This is the immediate object of the scene: unfamiliar in balance, but instantly absorbed into Alice’s old combat training.",
      },
      {
        filename: "24_alice_lance.png",
        title: "Alice’s 17th Lancers Lance",
        description:
          "A field lance of the 17th Lancers, representing cavalry discipline, mounted readiness, and combat training.",
        storyEmphasis:
          "The lance belongs to Alice’s cavalry past before household service. It explains the old military training beneath her market reaction with the spear.",
      },
      {
        filename: "25_alice_riding_gear.png",
        title: "Alice’s Riding Gear",
        description:
          "Worn riding gear connected to mounted service, readiness, and the physical memory of drill.",
        storyEmphasis:
          "The gear reinforces the discipline beneath Alice’s domestic role: balance, movement, and trained readiness under pressure.",
      },
    ],
  },
  {
    slug: "berihuns-terms",
    title: "Objects from “Berihun’s Terms”",
    excerptTitle: "Berihun’s Terms",
    publishedAt: "2026-06-29T13:00:00Z",
    description:
      "Three archive objects from a negotiation where hospitality is offered but not accepted.",
    artifacts: [
      {
        filename: "33_coffee_ceremony_cups.png",
        title: "Coffee Ceremony Cups",
        description:
          "Small ceramic coffee cups from the negotiation with Berihun, poured but left untouched.",
        storyEmphasis:
          "The coffee represents hospitality offered but not accepted; the agreement proceeds without loyalty or warmth.",
      },
      {
        filename: "16_thatch_hut.png",
        title: "Thatch Hut",
        description:
          "A modest thatch hut marking the domestic edge of the negotiation.",
        storyEmphasis:
          "The hut holds the social world Irwin cannot command simply by contract, coin, or plantation logic.",
      },
      {
        filename: "21_route_ii_massawa_to_kaffa_highlands.png",
        title: "Route II: Massawa to Kaffa Highlands",
        description:
          "A route artifact tracing movement from Massawa toward the highland interior.",
        storyEmphasis:
          "The route places the negotiation inside the larger pressure of inland movement, land, labor, and distance.",
      },
    ],
  },
  {
    slug: "the-hoe",
    title: "Objects from “The Hoe”",
    excerptTitle: "The Hoe",
    publishedAt: "2026-07-06T13:00:00Z",
    description:
      "Three archive objects from Ezra’s midnight confession and first small act of usefulness.",
    artifacts: [
      {
        filename: "34_sharpened_hoe.png",
        title: "Sharpened Hoe",
        description:
          "A worn field hoe with a freshly sharpened iron blade.",
        storyEmphasis:
          "The hoe is the emotional artifact of Ezra’s confession and first small act of usefulness.",
      },
      {
        filename: "16_thatch_hut.png",
        title: "Thatch Hut",
        description:
          "A modest rural hut at the edge of work, shelter, and uneasy repair.",
        storyEmphasis:
          "The hut grounds Ezra’s confession in a lived place rather than an abstract wish to become useful.",
      },
      {
        filename: "21_route_ii_massawa_to_kaffa_highlands.png",
        title: "Route II: Massawa to Kaffa Highlands",
        description:
          "A route artifact tracing movement from Massawa toward the highland interior.",
        storyEmphasis:
          "The route keeps Ezra’s small act within the larger geography of displacement, labor, and attempted repair.",
      },
    ],
  },
  {
    slug: "the-waterfall",
    title: "Objects from “The Waterfall”",
    excerptTitle: "The Waterfall",
    publishedAt: "2026-07-13T13:00:00Z",
    description:
      "Three archive objects from Sarah and Adathun’s private kingdom behind falling water.",
    artifacts: [
      {
        filename: "30_sarah_hidden_box.png",
        title: "Sarah’s Iron Hidden Box",
        description:
          "A small, heavy, dull dark-grey iron box with faint Serk’ motifs and three distinct keyholes.",
        storyEmphasis:
          "The box is not gold or wood. It is cold iron, sealed, heavy, ancient, never opened, and stored behind the vine crown.",
      },
      {
        filename: "35_vine_crown.png",
        title: "The Vine Crown",
        description:
          "A fragile child-made crown of woven vines and dried flowers.",
        storyEmphasis:
          "The crown belongs to Sarah and Adathun’s private kingdom behind the waterfall, childhood secrecy, and what Sarah later keeps hidden.",
      },
      {
        filename: "06_wooden_elephant.png",
        title: "Wooden Elephant",
        description:
          "A small carved wooden elephant tied to Sarah’s childhood objects and private keeping.",
        storyEmphasis:
          "The elephant sits beside the hidden box and vine crown as part of Sarah’s guarded interior world.",
      },
    ],
  },
];

export function isArchiveArtifactPagePublished(page: ArchiveArtifactPage, now = new Date()) {
  return new Date(page.publishedAt).getTime() <= now.getTime();
}

export function getArchiveArtifactPage(slug: string) {
  return archiveArtifactPages.find((page) => page.slug === slug);
}

export function getPublishedArchiveArtifactPage(slug: string, now = new Date()) {
  const page = getArchiveArtifactPage(slug);

  if (!page || !isArchiveArtifactPagePublished(page, now)) {
    return undefined;
  }

  return page;
}

export function getPublishedArchiveArtifactPages(now = new Date()) {
  return archiveArtifactPages.filter((page) => isArchiveArtifactPagePublished(page, now));
}

export function getPublishedArchiveArtifactSlugs(now = new Date()) {
  return getPublishedArchiveArtifactPages(now).map((page) => page.slug);
}

export function getArtifactAssetPath(filename: string) {
  return `${artifactDownloadBasePath}/${filename}`;
}
