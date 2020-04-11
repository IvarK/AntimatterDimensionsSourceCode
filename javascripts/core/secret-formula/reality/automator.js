"use strict";

GameDatabase.reality.automator = {
  commands: [
    {
      id: 0,
      keyword: "wait",
      name: "<b>wait</b> - wait for something",
      syntax: "<b>wait</b> condition",
      description: "Forces automator to wait for some condition or event",
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
              header: "<i>completions</i> <i>comparison</i> <i>number</i>",
              description: `
                Wait for a certain <b>total</b> number of EC completions that you'd get at eternity.<br>
                <b>Comparisons</b>: >, >=
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
        "wait am >= 1e308",
        "wait completions >= 5",
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
      name: "<b>auto</b> - turn Infinity/Eternity/Reality autobuyers on or off and change their modes",
      syntax: "<b>auto</b> [infinity|eternity|reality] [setting]",
      sections: [
        {
          name: "SETTINGS",
          items: [
            {
              header: "<i>on</i> | <i>off</i>",
              description: "Turns autobuyer on or off",
            },
            {
              header: "<i>number</i> <i>time units</i>",
              description: "Usable with infinity/eternity only. Turn automator on and set it to trigger at the given interval"
            },
            {
              header: "<i>number</i> x last",
              description: 'Usable with infinity/eternity only. Turn automator on and sets it to "X times last" mode'
            },
            {
              header: "<i>number currency</i>",
              description: `Turn automator on and sets it to trigger at a specific amount. The currency must match the
                            autobuyer type (ip, ep, or rm). For the reality autobuyer, this will select "reality
                            machines" mode`,
            },
          ]
        }
      ],
      examples: [
        "auto infinity on",
        "auto eternity off",
        "auto infinity 30s",
        "auto eternity 10 seconds",
        "auto eternity 1e100 x last",
        "auto infinity 1e1e4 ip"
      ]
    },
    {
      id: 8,
      keyword: "if",
      name: "<b>if</b> - compares your amount to the game's amount of something, such as a currency",
      syntax: "<b>if</b> [am|ip|ep|dt|tp|rg|rep|tt|completions] (comparison) [number]",
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
    {
      id: 10,
      keyword: "until",
      name: "<b>until</b> - repeats commands until a condition or event",
      syntax: `<b>until</b> [condition | event] {<br>
        <blockquote>commands</blockquote>
      }<br>
      <b>condition</b>: [quantity] (comparison) [number]<br>
      <b>quantity</b>: [am|ip|ep|dt|tp|rg|rep|tt|completions]<br>
      <b>event</b>: [infinity|eternity|reality] (can happen at any time after loop starts)`,
      description: `Commands are repeated; the condition is checked at the start and every
      time the loop repeats. If an event is specified, then the loop will repeat until the
      event occurs. (The event has to happen after the loop begins).<br>
      A variable name may be used in place of <b>number</b>, see <b>define</b>`,
      examples: [
        `until ep > 1e500 {<br>
          <blockquote>
          tt max<br>
          studies nowait 11-62</blockquote>
        }`,
      ]
    },
    {
      id: 11,
      keyword: "while",
      name: "<b>while</b> - repeats commands while a condition is met",
      syntax: `<b>while</b> [quantity] (comparison) [number]{<br>
        <blockquote>commands</blockquote>
      }<br>
      <b>quantity</b>: [am|ip|ep|dt|tp|rg|rep|tt|completions]<br>
      <b>comparison</b>: [<|<=|>=|>]<br>
      <b>number</b>: Number in normal or scientific notation`,
      description: `Commands are repeated; the condition is checked at the start and every
      time the loop repeats.<br>
      A variable name may be used in place of <b>number</b>, see <b>define</b>`,
      examples: [
        `while ep < 1e500 {<br>
          <blockquote>
          tt max<br>
          studies nowait 11-62</blockquote>
        }`,
        `while myThreshold > am { ...`,
      ]
    },
    {
      id: 12,
      keyword: "studies respec",
      name: "<b>studies respec</b> - respec time studies on next eternity",
      syntax: `<b>studies respec</b>`,
      examples: [
        `studies respec`,
      ]
    },
    {
      id: 13,
      keyword: "studies load preset",
      name: "<b>studies load preset</b> - Load a saved study preset",
      syntax: `<b>studies load preset [name | number]</b>`,
      description: `Loads a study preset, as if you'd clicked on the button in the time
        study tab. Number is 1 to 6 (corresponding to slot). The given name can also be used.`,
      examples: [
        `studies load preset 2`,
        `studies load preset dil`,
      ]
    },
    {
      id: 14,
      keyword: "studies",
      name: "<b>studies</b> - Purchase time studies",
      syntax: `<b>studies [nowait] <i>[study list]</i></b>`,
      description: `Purchase time studies specified. If <b>nowait</b> is present, then
        the automator will purchase as many studies as possible at the moment, and move on
        to the next command.<br>
        If <b>nowait</b> is <i>not</i> present, then the automator will buy the studies in order,
        waiting for them to become available/affordable if necessary.<br>
        The study list can consist of study numbers, separated by spaces or commas, ranges of
        studies (for example, <i>11-62</i>) and the following aliases:<br>
        <blockquote><b>normal, infinity, time, active, passive, idle</b></blockquote>
        A variable name may be used in place of study list, see <b>define</b>
        The string produced by "export" in the time study tab can be used with this command.`,
      examples: [
        "studies nowait 11,21,31",
        "studies 11-62, normal, 111, idle",
        "studies nowait ec6Studies",
      ]
    },
  ]
};
