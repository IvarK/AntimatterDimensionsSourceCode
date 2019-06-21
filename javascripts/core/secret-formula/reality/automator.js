"use strict";

GameDatabase.reality.automator = {
  commands: [
    {
      id: 0,
      keyword: "wait",
      name: "<b>wait</b> - wait for something",
      syntax: "<b>wait</b> condition",
      description: "Forces automator to wait for some condition or specified amount of time",
      sections: [
        {
          name: "CONDITIONS",
          items: [
            {
              header: "<i>resource</i> <i>comparison</i> <i>number</i>",
              description: `
                Wait until resource amount satisfies the comparison.<br>
                <b>Resources</b>: am (Antimatter), ip (Infinity Points), ep (Eternity Points), dt (Dilated Time),
                tp (Tachyon Particles), rg (Replicanti Galaxies), rep/replicanti, tt/time theorems<br>
                <b>Comparisons</b>: <, <=, > >=<br>
                <b>Number</b> should be in scientific format, e.g. 1000, 1e100, 1.8e308
              `
            },
            {
              header: "<i>prestige</i>",
              description: `
                Wait until certain prestige has been triggered.<br>
                <b>Prestiges</b>: infinity, eternity, reality
              `
            }
          ]
        }
      ],
      examples: [
        "wait infinity",
        "wait am >= 1e308"
      ]
    },
    {
      id: 1,
      keyword: "start",
      name: "<b>start</b> - start Eternity Challenge (this also unlocks said EC) or Time Dilation",
      syntax: "<b>start</b> [ec<i>X</i>|dilation]",
      examples: [
        "start ec12",
        "start dilation"
      ]
    },
    {
      id: 2,
      keyword: "infinity / eternity / reality",
      name: "<b>infinity|eternity|reality</b> - triggers Infinity, Eternity, or Reality",
      syntax: "<b>infinity</b>,<br> <b>eternity</b>,<br> <b>reality</b>",
      examples: [
        "infinity", 
        "reality",
      ]
    },
    {
      id: 3,
      keyword: "tt",
      name: "<b>tt</b> - purchases Time Theorems with a resource or buys the maximum possible",
      syntax: 
        "<b>tt</b> action",
      sections: [
        {
          name: "ACTIONS",
          items: [
            {
              header: "<i>resources</i>",
              description: `
              Buys with a specific resource.<br>
              <b>Resources</b>: am (Antimatter), ip (Infinity Points), ep (Eternity Points)
              `
            },
            {
              header: "<i>max</i>",
              description: `
              Buys the maximum number of time theorems from all resources.
              `
            },
          ]
        }
      ]
    },
    {
      id: 4,
      keyword: "black hole",
      name: "<b>black hole</b> - turns the Black Hole on and off",
      syntax: "<b>black hole</b> on/off",
      examples: [
        "black hole on",
        "black hole off",
      ]
    },
    {
      id: 5,
      keyword: "store time",
      name: "<b>store time</b> - either turns on/off the storing of time or can be used to use stored time",
      syntax: "<b>store time</b> action",
      sections: [
        {
          name: "ACTIONS",
          items: [
            {
            header: "<i>on/off</i>",
            description: `
            Turns storing time on or off.
            `
            },
            {
              header: "<i>use</i>",
              description: `
              Uses stored time.
              `
            }
          ]
        }
      ]
    },
    {
      id: 6,
      keyword: "unlock",
      name: "<b>unlock</b> - can be used to unlock certain features",
      syntax: "<b>unlock</b> feature",
      examples: [
        "unlock dilation",
        "unlock ec<i>X</i>"
      ]
    },
    {
      id: 7,
      keyword: "auto",
      name: "<b>auto</b> - can turn the Infinity/Eternity/Reality autobuyers on or off and can edit the inputs on the infinity and eternity autobuyers (editing will turn them on)",
      syntax: "<b>auto</b> [infinity|eternity] [interval]",
      examples: [
        "auto infinity on",
        "auto eternity off",
        "auto infinity 30s",
        "auto eternity 10 seconds"
      ]
    },
    {
      id: 8,
      keyword: "if",
      name: "<b>if</b> - compares your amount to the game's amount of something, such as a currency",
      syntax: "<b>if</b> [am|ip|ep|dt|tp|rg|rep|tt] (comparison) [number]",
      examples: [
        "if ep <= 1e3000",
        "if dt >= 1e50",
        "if ip < 1e1500000"
      ]
    },
    {
      id: 9,
      keyword: "pause",
      name: "<b>pause</b> - pauses the automator for a set amount of time",
      syntax: "<b>pause</b> [interval]",
      examples: [
        "pause 10s",
        "pause 1 minute",
        "pause 34 seconds"
      ]
    },
  ]
}
