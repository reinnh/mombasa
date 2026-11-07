import { WardInfo } from "@/types";

// Mombasa County — TND Youth League Mombasa Chapter
// 6 Constituencies · 30 Wards · 229 Polling Stations

export const mombasaConstituencies = [
  "Changamwe",
  "Jomvu",
  "Kisauni",
  "Likoni",
  "Mvita",
  "Nyali",
] as const;

export type MombasaConstituency = (typeof mombasaConstituencies)[number];

export const mombasaWards: WardInfo[] = [
  // ── 1. CHANGAMWE CONSTITUENCY ──────────────────────────────────
  {
    ward: "Port Reitz",
    constituency: "Changamwe",
    registeredVoters: 0,
    pollingStations: [
      "Bomu Primary School",
      "Mwijabu Primary School",
      "Lilongwe Garden",
      "Bomu Stadium",
      "Bomu Secondary School",
      "Full Gospel Church Ground",
    ],
  },
  {
    ward: "Kipevu",
    constituency: "Changamwe",
    registeredVoters: 0,
    pollingStations: [
      "Umoja Primary School",
      "Kisumu Ndogo Ground",
      "Kwa Hola Primary School",
      "Cape Town Ground",
      "Kaloleni Ground",
      "Akamba Handcraft Coop. Society Hall",
    ],
  },
  {
    ward: "Airport",
    constituency: "Changamwe",
    registeredVoters: 0,
    pollingStations: [
      "Bokole Nursery School",
      "Baraka Village",
      "Al-Irshadi Nursery School",
      "Mwidani Social Hall",
      "Portreitz Nursery School",
    ],
  },
  {
    ward: "Changamwe",
    constituency: "Changamwe",
    registeredVoters: 0,
    pollingStations: [
      "Changamwe Social Hall",
      "Changamwe Primary School",
      "St. Lwanga Primary School",
      "Changamwe Secondary School",
      "Gome Primary School",
      "Baptist Church Primary School",
      "Magongo Primary School",
      "Kimbilio Academy",
      "Bishop Mkala Academy",
      "AIC Church Hall",
    ],
  },
  {
    ward: "Chaani",
    constituency: "Changamwe",
    registeredVoters: 0,
    pollingStations: [
      "Chaani Social Hall",
      "Chaani Primary School",
      "Mikadini Primary School",
      "Kipevu Primary School",
      "Chaani Chief's Office",
      "Kasarani Grounds",
      "Chaani Secondary School",
    ],
  },

  // ── 2. JOMVU CONSTITUENCY ───────────────────────────────────────
  {
    ward: "Jomvu Kuu",
    constituency: "Jomvu",
    registeredVoters: 0,
    pollingStations: [
      "Miritini World Bank Primary School",
      "Jomvu Kuu Primary School",
      "Taratibu Social Hall",
      "Mirironi Primary School",
      "Aldinnah Open Grounds",
      "Nuru Community Based Rehabilitation School",
      "Swaleh Khalid Social Hall",
      "Jomvu Narcol Nursery School",
      "Badi Twalib Primary School",
      "Misufini Open Grounds",
    ],
  },
  {
    ward: "Mikindani",
    constituency: "Jomvu",
    registeredVoters: 0,
    pollingStations: [
      "Amani Primary School",
      "Kajembe High School",
      "Mikindani Primary School",
      "St. Mary's Bangladesh Primary School",
      "Ministry of Water Tanks",
      "Kwa Shee Primary School",
      "Owino Uhuru Nursery School",
      "New Kibarani Primary School",
      "Nazarene Nursery School",
      "Mwembeni Open Grounds",
    ],
  },
  {
    ward: "Miritini",
    constituency: "Jomvu",
    registeredVoters: 0,
    pollingStations: [
      "Railway Station Hall",
      "Miritini Primary School",
      "Abu-Ubaida Primary School",
      "Mwamlai Primary School",
      "Bamako Initiative Miritini",
      "Maganda Primary School",
      "Chabeat Open Ground – Chamunyu",
    ],
  },

  // ── 3. KISAUNI CONSTITUENCY ─────────────────────────────────────
  {
    ward: "Mjambere",
    constituency: "Kisauni",
    registeredVoters: 0,
    pollingStations: [
      "Kisauni Baptist Primary School",
      "Kadongo Grounds – Mishomoroni",
      "Kisauni Water & Sewerage Offices",
      "Palani Grounds",
    ],
  },
  {
    ward: "Junda",
    constituency: "Kisauni",
    registeredVoters: 0,
    pollingStations: [
      "IFC Church",
      "Junda Assistant Chief's Camp – Wangwani",
      "Assistant Chief's Camp – Machafuko",
      "Emmas Academy",
      "Manyani Grounds",
      "New Hope Secondary School – Makumba",
    ],
  },
  {
    ward: "Bamburi",
    constituency: "Kisauni",
    registeredVoters: 0,
    pollingStations: [
      "Kiembeni Primary School",
      "Majaoni Primary School",
      "St. Elizabeth Academy",
      "Kashani Primary School",
      "Mdengerekeni Primary School",
    ],
  },
  {
    ward: "Mwakirunge",
    constituency: "Kisauni",
    registeredVoters: 0,
    pollingStations: [
      "Marimani Primary School",
      "Mwakirunge Primary School",
      "Voroni Community Primary School",
      "Colorado Primary School",
      "Maunguja Primary School",
    ],
  },
  {
    ward: "Mtopanga",
    constituency: "Kisauni",
    registeredVoters: 0,
    pollingStations: [
      "Mtopanga Primary School",
      "Kiembeni Baptist Primary School",
      "St. Josephs Herman Primary School",
      "Community of Christ Church – Mtopanga",
      "Concordia Primary School",
      "Perma Sharp Grounds",
    ],
  },
  {
    ward: "Magogoni",
    constituency: "Kisauni",
    registeredVoters: 0,
    pollingStations: [
      "Mwandoni (Kishada) Play Grounds",
      "Mishomoroni Junior Academy",
      "Barsheba Sokoni Grounds",
      "Mwandoni Kwa Mtumwa Grounds",
      "Mwandoni Blue Bench Grounds",
      "Mjahidina Muslim School",
    ],
  },
  {
    ward: "Shanzu",
    constituency: "Kisauni",
    registeredVoters: 0,
    pollingStations: [
      "Shanzu Teachers Training College",
      "Mikoroshoni Primary School",
      "Mwembelegeza Primary School",
      "Bamburi Primary School",
      "Zimlat Primary School",
      "Utange Primary School",
      "Shimo La Tewa Primary School",
    ],
  },

  // ── 4. LIKONI CONSTITUENCY ──────────────────────────────────────
  {
    ward: "Mtongwe",
    constituency: "Likoni",
    registeredVoters: 0,
    pollingStations: [
      "Mtongwe Social Hall",
      "St. Joseph Nursery School",
      "Vijiweni Primary School",
      "Mtongwe Primary School",
      "Longo Primary School",
      "Mweza Primary School",
      "Mkwajuni Market",
      "Mwangala Primary School",
      "Mtongwe Vocational Training Center",
    ],
  },
  {
    ward: "Shika Adabu",
    constituency: "Likoni",
    registeredVoters: 0,
    pollingStations: [
      "Shika Adabu Primary School",
      "Ujamaa Grounds",
      "Consolata Primary School",
      "Vyemani Primary School",
      "Vijiweni Grounds",
      "Inspirations Primary School",
      "Shika Adabu Secondary School",
      "Mishi Mboko Girls Secondary School",
    ],
  },
  {
    ward: "Bofu",
    constituency: "Likoni",
    registeredVoters: 0,
    pollingStations: [
      "Daru Ulum Madrasa",
      "Likoni Muslim Primary School",
      "Jamvi La Wageni Primary School",
      "Peleleza Primary School",
      "Bomani Football Ground",
    ],
  },
  {
    ward: "Likoni",
    constituency: "Likoni",
    registeredVoters: 0,
    pollingStations: [
      "Likoni Primary School",
      "Jesus Celebration Center (Soweto)",
      "Likoni Secondary School",
    ],
  },
  {
    ward: "Timbwani",
    constituency: "Likoni",
    registeredVoters: 0,
    pollingStations: [
      "Ushindi Baptist Primary School",
      "Mrima Primary School",
      "LICODEP",
      "Consolata Nursery School",
      "Likoni Flats Social Hall",
      "Maji Safi Primary School",
      "Timbwani Primary School",
      "Timbwani Secondary School",
      "Caltex Grounds",
      "Timbwani Baptist Primary School",
    ],
  },

  // ── 5. MVITA CONSTITUENCY ───────────────────────────────────────
  {
    ward: "Mji wa Kale/Makadara",
    constituency: "Mvita",
    registeredVoters: 0,
    pollingStations: [
      "Tijara Gardens",
      "Sonara Social Hall",
      "Kaderbhoy Old Town Dispensary",
      "Fort Jesus Museum",
      "Star of the Sea Primary School",
      "Hajam Jamaat Hall",
      "Coast Girls Secondary School",
      "Kenya School of Government",
      "Mombasa Primary School",
      "Allidina Visram High School",
      "Serani Primary School",
      "Mbaraki Primary School",
    ],
  },
  {
    ward: "Tudor",
    constituency: "Mvita",
    registeredVoters: 0,
    pollingStations: [
      "Tudor Village Hall",
      "Municipal Inspectorate Offices",
      "St. Augustine Primary School",
      "Khamisi Secondary School",
      "Tudor Primary School",
      "R. G. Ngala Primary School",
      "Burhania Primary School",
      "Tudor Day Secondary School",
      "Sparki Primary School",
      "KPA Hall Makande",
      "Fahari Primary School",
    ],
  },
  {
    ward: "Tononoka",
    constituency: "Mvita",
    registeredVoters: 0,
    pollingStations: [
      "Tononoka Social Hall",
      "Mwembe-Tayari Public Health Clinic (PHC)",
      "Municipal Stadium",
      "Kumbar Primary School",
      "Chandaria Hall",
      "Tononoka Nursery School",
      "Al-Amani Social Hall – Floringi",
      "Shariff Nassir Secondary School",
      "Buxton Estate Hall",
      "Kikowani Primary School",
      "Central Girls Primary School",
    ],
  },
  {
    ward: "Shimanzi/Ganjoni",
    constituency: "Mvita",
    registeredVoters: 0,
    pollingStations: [
      "Sacred Heart Primary School",
      "Makupa Primary School",
      "Makande KPA Nursery School",
      "KPA Hall High Level",
      "Makande Primary School",
      "Little Theatre Club",
      "Ganjoni Municipal Clinic",
      "Majengo Primary School",
      "Shimanzi KPA Nursery School",
      "King'orani Prison (Jela Baridi)",
      "Bandari College",
      "KPA Social Hall",
      "Public Works Offices",
    ],
  },
  {
    ward: "Majengo",
    constituency: "Mvita",
    registeredVoters: 0,
    pollingStations: [
      "Majengo Village Hall",
      "Mvita Primary School",
      "Mwembe-Tayari Public Health Department (PHD)",
      "Sakina Hall",
      "Patel Samaj Hall",
      "Lohana Hall",
      "Guru Nanak Primary School",
      "Mvita Boys Secondary School",
      "Lasco Social Hall (KPA)",
      "Uhuru Gardens",
      "Koblenz Hall",
    ],
  },

  // ── 6. NYALI CONSTITUENCY ───────────────────────────────────────
  {
    ward: "Frere Town",
    constituency: "Nyali",
    registeredVoters: 0,
    pollingStations: [
      "Frere Town Primary School",
      "Khadija Primary School",
      "Sarajevo Grounds",
      "Mlaleo Primary School",
      "Fadhil-Adhym Primary School",
      "Victoria Baptist Primary School",
      "Mwandoni Kadiria Grounds",
      "Frere Town Secondary School",
      "Khadija Secondary School",
    ],
  },
  {
    ward: "Ziwa La Ng'ombe",
    constituency: "Nyali",
    registeredVoters: 0,
    pollingStations: [
      "Ziwa La Ng'ombe Primary School",
      "Tumaini Academy/Church of Christ",
      "Olive Rehabilitation Centre – Mkunguni",
      "KICODEP Hall",
      "Azhar Primary School",
    ],
  },
  {
    ward: "Mkomani",
    constituency: "Nyali",
    registeredVoters: 0,
    pollingStations: [
      "Pentrose Community Primary School",
      "Maweni Primary School",
      "ASK Ground – Gate A",
      "Mkomani Grounds",
      "Maweni Mixed Secondary School",
    ],
  },
  {
    ward: "Kongowea",
    constituency: "Nyali",
    registeredVoters: 0,
    pollingStations: [
      "Kongowea Primary School",
      "Kwa Karama Grounds",
      "Methodist Church – Kongowea",
      "Municipal Social Hall – Kongowea",
      "Kengeleni Primary School",
      "Kongowea Secondary School",
    ],
  },
  {
    ward: "Kadzandani",
    constituency: "Nyali",
    registeredVoters: 0,
    pollingStations: [
      "Mwatamba Grounds",
      "Kadzandani Primary School",
      "Kwa Bullo Primary/Secondary School",
      "Soweto Grounds",
      "Bashir Primary School",
      "Bahawani Primary School",
      "Bombolulu Cultural Centre Workshop Hall",
      "Marianist Polytechnic",
      "Teman Junior Academy",
    ],
  },
];

export const totalConstituencyVoters = mombasaWards.reduce(
  (sum, ward) => sum + ward.registeredVoters,
  0
);

export const allPollingStations = mombasaWards.flatMap((w) =>
  w.pollingStations.map((station) => ({
    constituency: w.constituency,
    ward: w.ward,
    station,
  }))
);

export const totalPollingStations = allPollingStations.length;
export const totalLandmarks = totalPollingStations;

// Helper lookup functions
export function getConstituencyByWard(wardName: string): string {
  const match = mombasaWards.find((w) => w.ward === wardName);
  return match ? match.constituency : "";
}

export function getWardsByConstituency(constituencyName: string): WardInfo[] {
  if (!constituencyName || constituencyName === "ALL") {
    return mombasaWards;
  }
  return mombasaWards.filter(
    (w) => w.constituency.toLowerCase() === constituencyName.toLowerCase()
  );
}
