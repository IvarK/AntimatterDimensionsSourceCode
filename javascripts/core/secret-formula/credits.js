import { GameDatabase } from "./game-database";

GameDatabase.credits = {
  // Must be placed in the order it is desired they appear in the credits
  roles: {
    1: "Creator",
    2: "Technical Architect",
    3: "Lead Developer",
    4: "Android Developer",
    5: "Library Developer",
    6: "Developer",
    7: "Lead Design Consultant",
    8: "Design Consultant",
    9: "Modal Maker, Lady Taker, Pie Baker",
    10: "Lurker Tester",
    11: "Web Tester",
    12: "Android Tester"
  },

  // Each person must have a name and at least one role (the index of the desired role in roles). They can also have a
  // second name, which will appear in parentheses besides their first.
  people: [
    {
      name: "Hevipelle",
      name2: "Ivar Kerajärvi",
      roles: 1
    }, {
      name: "Razenpok",
      name2: "Andrei Andreev",
      roles: 2
    }, {
      name: "garnet420",
      roles: 3
    }, {
      name: "Omsi",
      roles: 3
    }, {
      name: "SpectralFlame",
      name2: "Christopher Yip",
      roles: 3
    }, {
      name: "WaitingIdly",
      roles: [3, 6, 8, 11, 12]
    }, {
      name: "kajfik",
      name2: "Jakub Kajfosz",
      roles: 4
    }, {
      name: "Patashu",
      roles: [5, 6, 11]
    }, {
      name: "Dan",
      roles: [6, 11]
    }, {
      name: "earth",
      name2: "Jace Royer",
      roles: [6, 9, 11, 12]
    }, {
      name: "Hira",
      roles: [6, 11, 12]
    }, {
      name: "IkerStream",
      name2: "Iker de Aguirre",
      roles: [6, 11]
    }, {
      name: "L4R5",
      name2: "Lars Wolf",
      roles: [6, 11, 12]
    }, {
      name: "Pichusuperlover",
      roles: [6, 8, 11]
    }, {
      name: "realrapidjazz",
      roles: [6, 7]
    }, {
      name: "Scarlet",
      roles: [6, 11, 12]
    }, {
      name: "slabdrill",
      roles: 6
    }, {
      name: "Acamaeda",
      roles: [8, 11]
    }, {
      name: "Dravitar",
      name2: "Alex Henderson",
      roles: 10
    }, {
      name: "Aesis",
      roles: 11
    }, {
      name: "AFYINEE",
      name2: "Gabriel HADDAG",
      roles: 11
    }, {
      name: "Alexitato",
      roles: 11
    }, {
      name: "Anno",
      roles: 11
    }, {
      name: "Archa",
      name2: "Myresa",
      roles: [11, 12]
    }, {
      name: "ArrowBounce",
      name2: "Timothy Su",
      roles: 11
    }, {
      name: "Birb",
      name2: "Kelsey Black",
      roles: 11
    }, {
      name: "Boo",
      name2: "Jean-Christophe Bourgault",
      roles: 11
    }, {
      name: "CaptainGalaxy",
      name2: "Ovidijus Točelis",
      roles: 11
    }, {
      name: "ChaoticHans",
      roles: [11, 12]
    }, {
      name: "cubic frog",
      roles: 11
    }, {
      name: "dankesehr",
      roles: 11
    }, {
      name: "Davixx",
      name2: "Davide Fedele",
      roles: 11
    }, {
      name: "Empireus",
      roles: 11
    }, {
      name: "GirixK",
      name2: "Nikola Jelinčić",
      roles: [11, 12]
    }, {
      name: "GoldenTritium",
      roles: [11, 12]
    }, {
      name: "Kael",
      roles: 11
    }, {
      name: "Lynn",
      roles: 11
    }, {
      name: "Merp",
      roles: 11
    }, {
      name: "philipebreaker",
      name2: "Philipe",
      roles: 11
    }, {
      name: "Phillip Marshall",
      roles: 11
    }, {
      name: "Phoenix",
      roles: 11
    }, {
      name: "Reda Kotob",
      roles: 11
    }, {
      name: "Saturnus",
      roles: 11
    }, {
      name: "SereKabii",
      roles: 11
    }, {
      name: "Sheer",
      roles: 11
    }, {
      name: "sirusi",
      name2: "Vinícius Oliveira Martins",
      roles: 11
    }, {
      name: "Spanosa",
      name2: "Jared K",
      roles: 11
    }, {
      name: "Sparticle999",
      roles: 11
    }, {
      name: "SpicyCrusader13",
      roles: [11, 12]
    }, {
      name: "Storm",
      roles: 11
    }, {
      name: "SzyszakS",
      roles: 11
    }, {
      name: "Tacitus",
      roles: 11
    }, {
      name: "Typh",
      roles: 11
    }, {
      name: "Vnge",
      name2: "Ben Parrish",
      roles: [11, 12]
    }, {
      name: "Xemadus",
      name2: "Jonathan Gibson",
      roles: 11
    }, {
      name: "Young Woo Joo",
      roles: 11
    }, {
      name: "Zipi",
      roles: 11
    }, {
      name: "about:blank",
      roles: 12
    }, {
      name: "ÆiOuF",
      roles: 12
    }, {
      name: "Anjinho01",
      roles: 12
    }, {
      name: "Anthios",
      roles: 12
    }, {
      name: "Auti",
      name2: "Alice Tolle",
      roles: 12
    }, {
      name: "Buck",
      roles: 12
    }, {
      name: "Barrin84",
      roles: 12
    }, {
      name: "ChizuX",
      roles: 12
    }, {
      name: "Circle",
      roles: 12
    }, {
      name: "Crinkly Weasel",
      name2: "Aaryan Sarawgi",
      roles: 12
    }, {
      name: "DarthDie",
      name2: "Briar Bowser",
      roles: 12
    }, {
      name: "Epsilon",
      name2: "Coolguystorm",
      roles: 12
    }, {
      name: "Firecracker",
      roles: 12
    }, {
      name: "Gaunter",
      roles: 12
    }, {
      name: "HarrisL2",
      roles: 12
    }, {
      name: "Hellbach",
      name2: "Asher Günther",
      roles: 12
    }, {
      name: "hen-ben",
      name2: "Henry Ellenberg",
      roles: 12
    }, {
      name: "ImpossibleSalsa",
      roles: 12
    }, {
      name: "Johanniklas",
      name2: "Jan-Niklas Petersen",
      roles: 12
    }, {
      name: "kaislash",
      name2: "Lily",
      roles: 12
    }, {
      name: "Kirku",
      name2: "Fabian Makowski",
      roles: 12
    }, {
      name: "Kirin",
      name2: "Arthur",
      roles: 12
    }, {
      name: "Mirai",
      roles: 12
    }, {
      name: "Monoma",
      name2: "ARoman Ruiz",
      roles: 12
    }, {
      name: "Nani",
      roles: 12
    }, {
      name: "NotBrewst",
      name2: "Luc Leblanc",
      roles: 12
    }, {
      name: "opdollar",
      name2: "Zane Coole",
      roles: 12
    }, {
      name: "Pavlxiiv",
      roles: 12
    }, {
      name: "Porygon-Z",
      roles: 12
    }, {
      name: "PotatoTIAB",
      roles: 12
    }, {
      name: "Razor",
      roles: 12
    }, {
      name: "Razvan Cercel",
      roles: 12
    }, {
      name: "ReacTivity",
      roles: 12
    }, {
      name: "Rukimix",
      roles: 12
    }, {
      name: "Skunky",
      name2: "Lukas",
      roles: 12
    }, {
      name: "Socks",
      name2: "Hannah Pocks",
      roles: 12
    }, {
      name: "Taylor Reeves",
      roles: 12
    }, {
      name: "Tim Wong",
      roles: 12
    }, {
      name: "tragedt",
      name2: "Ethan Manninen",
      roles: 12
    }, {
      name: "Valentine Clarissa Alanis Star Z",
      roles: 12
    }, {
      name: "vanadium_void",
      roles: 12
    }, {
      name: "X3N0_32",
      roles: 12
    }, {
      name: "ZylaKat",
      name2: "Katherine Goforth-Harbin",
      roles: 12
    }
  ]
};

GameDatabase.credits.roles.count = Object.keys(GameDatabase.credits.roles).length;
