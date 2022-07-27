import { GameDatabase } from "../game-database";

GameDatabase.reality.automator = {
  commands: [
    {
      id: 0,
      isUnlocked: () => true,
      keyword: "wait",
      name: "<b>wait</b> - wait for something",
      syntax: "<b>wait</b> condition",
      description: "Forces Automator to wait for some condition or event",
      sections: [
        {
          name: "CONDITIONS",
          items: [
            {
              header: "<i>resource</i> <i>comparison</i> <i>number</i>",
              description: `
                Wait until resource amount satisfies the comparison.<br>
                <b>Resources</b>: am (Antimatter), ip (Infinity Points), ep (Eternity Points), dt (Dilated Time),
                tp (Tachyon Particles), rg (Replicanti Galaxies), rep/replicanti, tt/time theorems, total tt<br>
                <b>Comparisons</b>: <, <=, > >=<br>
                <b>Number</b> should be in scientific format, e.g. 1000, 1e100, 1.8e308
              `
            },
            {
              header: "<b>pending completions</b> <i>comparison</i> <i>number</i>",
              description: `
                Wait for a certain <b>total</b> number of EC completions that you'd get at eternity.
              `
            },
            {
              header: "<b>EC</b><i>number</i> <b>completions</b> <i>comparison</i> <i>number</i>",
              description: `
                Wait for a certain <b>total</b> number of completions of that EC.
              `
            },
            {
              header: "<i>prestige</i>",
              description: `
                Wait until that prestige has been triggered.<br>
                <b>Prestiges</b>: infinity, eternity, reality
              `
            }
          ]
        }
      ],
      examples: [
        "wait infinity",
        "wait am >= 1e308",
        "wait pending completions >= 5",
        "wait ec9 completions >= 4",
      ]
    },
    {
      id: 1,
      isUnlocked: () => true,
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
      isUnlocked: () => true,
      keyword: "infinity / eternity / reality",
      name: "<b>infinity|eternity|reality</b> - triggers Infinity, Eternity, or Reality",
      syntax: "<b>infinity [nowait]</b>,<br> <b>eternity [nowait] [respec]</b>,<br> <b>reality [nowait] [respec]</b>",
      sections: [
        {
          name: "MODIFIERS",
          items: [
            {
              header: "<i>nowait</i>",
              description: `
                If it is not possible to prestige, move on to the next command.
              `
            },
            {
              header: "<i>respec</i>",
              description: `
                Eternity: respec Time Studies and Eternity.<br>
                Reality: unequip Glyphs and Reality.
              `
            },
          ]
        }
      ],
      examples: [
        "infinity",
        "eternity respec",
        "reality nowait",
      ]
    },
    {
      id: 3,
      isUnlocked: () => BlackHole(1).isUnlocked,
      keyword: "black hole",
      name: "<b>black hole</b> - turns the Black Hole on and off",
      syntax: "<b>black hole</b> on/off",
      examples: [
        "black hole on",
        "black hole off",
      ]
    },
    {
      id: 4,
      isUnlocked: () => Enslaved.isUnlocked,
      keyword: "store game time",
      name: `<b>store game time</b> - either turns on/off the storing of game time or can be used to use
          stored game time`,
      syntax: "<b>store game time</b> action",
      sections: [
        {
          name: "ACTIONS",
          items: [
            {
              header: "<i>on/off</i>",
              description: `
                Turns storing game time on or off.
              `
            },
            {
              header: "<i>use</i>",
              description: `
                Uses stored game time.
              `
            }
          ]
        }
      ]
    },
    {
      id: 5,
      isUnlocked: () => true,
      keyword: "unlock",
      name: "<b>unlock</b> - can be used to unlock certain features",
      syntax: "<b>unlock [nowait]</b> feature",
      sections: [
        {
          name: "MODIFIERS",
          items: [
            {
              header: "<i>nowait</i>",
              description: `
                If it is not possible to unlock, move on to the next command.
              `
            },
          ]
        }
      ],
      examples: [
        "unlock dilation",
        "unlock ec<i>X</i>"
      ]
    },
    {
      id: 6,
      isUnlocked: () => true,
      keyword: "auto",
      name: "<b>auto</b> - turn Infinity/Eternity/Reality autobuyers on or off and change their modes",
      syntax: "<b>auto</b> [infinity|eternity|reality] [setting]",
      sections: [
        {
          name: "SETTINGS",
          items: [
            {
              header: "<i>on</i> | <i>off</i>",
              description: "Turns autobuyer on or off.",
            },
            {
              header: "<i>number</i> <i>time units</i>",
              description: `Usable with infinity/eternity only.
                Turns the autobuyer on and set it to trigger at the given interval`
            },
            {
              header: "<i>number</i> x highest",
              description: `Usable with infinity/eternity only. Turns the autobuyer on and sets it to
                "X times highest" mode`
            },
            {
              header: "<i>number currency</i>",
              description: `Turns the autobuyer on and sets it to trigger at a specific amount. The currency must
                match the autobuyer type (ip, ep, or rm). For the reality autobuyer, this will select "reality
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
        "auto eternity 1e100 x highest"
      ]
    },
    {
      id: 7,
      isUnlocked: () => true,
      keyword: "if",
      name: "<b>if</b> - compares your amount to the game's amount of something, such as a currency",
      syntax: `<b>if</b> [am|ip|ep|dt|tp|rg|rep|infinities|banked infinities|eternities|realities|tt|total tt|
      pending glyph level|pending completions|ec[number] completions] (comparison) [number]`,
      examples: [
        "if ep <= 1e3000",
        "if dt >= 1e50",
        "if ip < 1e1500000",
        "if ec10 completions < 5"
      ]
    },
    {
      id: 8,
      isUnlocked: () => true,
      keyword: "pause",
      name: "<b>pause</b> - pauses the Automator for a set amount of time",
      syntax: "<b>pause</b> [interval]",
      examples: [
        "pause 10s",
        "pause 1 minute",
        "pause 34 seconds"
      ],
      sections: [
        {
          name: "OTHER",
          items: [
            {
              header: "<b>Undesirable effects</b>",
              description: `This command may behave undesirably when it runs during offline progress due to limited
                tick count. A 1-second pause that is usually 20-30 ticks might be only 1 game tick when processing 8
                hours of offline progress, which might not be enough for the resources needed for the next line of the
                script`,
            },
            {
              header: "<b>Alternatives</b>",
              description: "Using something like 'wait' will allow you to set it for a certain resource amount."
            }
          ]
        }
      ]
    },
    {
      id: 9,
      isUnlocked: () => true,
      keyword: "until",
      name: "<b>until</b> - repeats commands until a condition or event",
      syntax: `<b>until</b> [condition | event] {<br>
          <blockquote>commands</blockquote>
        }<br>
        <b>condition</b>: [quantity] (comparison) [number]<br>
        <b>quantity</b>: [am|ip|ep|dt|tp|rg|rep|tt|total tt|pending completions|ecx completions]<br>
        <b>event</b>: [infinity|eternity|reality] (can happen at any time after loop starts)`,
      description: `Commands are repeated; the condition is checked at the start and every
        time the loop repeats. If an event is specified, then the loop will repeat until the
        event occurs. (The event has to happen after the loop begins).<br>
        A variable name may be used in place of <b>number</b>, see <b>define</b>`,
      examples: [
        `until ep > 1e500 {<br>
          <blockquote>
          tt all<br>
          studies nowait 11-62</blockquote>
        }`,
      ]
    },
    {
      id: 10,
      isUnlocked: () => true,
      keyword: "while",
      name: "<b>while</b> - repeats commands while a condition is met",
      syntax: `<b>while</b> [quantity] (comparison) [number]{<br>
          <blockquote>commands</blockquote>
        }<br>
        <b>quantity</b>: [am|ip|ep|dt|tp|rg|rep|tt|total tt|pending completions|ec[number] completions]<br>
        <b>comparison</b>: [<|<=|>=|>]<br>
        <b>number</b>: Number in normal or scientific notation`,
      description: `Commands are repeated; the condition is checked at the start and every
        time the loop repeats.<br>
        A variable name may be used in place of <b>number</b>, see <b>define</b>`,
      examples: [
        `while ep < 1e500 {<br>
          <blockquote>
          tt all<br>
          studies nowait 11-62</blockquote>
        }`,
        `while myThreshold > am { ...`,
      ]
    },
    {
      id: 11,
      isUnlocked: () => true,
      keyword: "studies respec",
      name: "<b>studies respec</b> - respec Time Studies on next Eternity",
      syntax: `<b>studies respec</b>`,
      description: `Note that this does not actually perform an Eternity, but only turns on the respec option on
        to trigger on the next manual or automatic Eternity.`,
      examples: [
        `studies respec`,
      ]
    },
    {
      id: 12,
      isUnlocked: () => true,
      keyword: "studies load (name / id)",
      name: "<b>studies load (name / id)</b> - Load a saved Time Study preset",
      syntax: `<b>studies [nowait] load [id | name] [selector]</b><br>
        <b>selector</b>: [1-6] for id, preset name for name`,
      description: `Loads a Time Study preset, as if you'd clicked on the button in the Time Study tab.<br>
        If it is loaded by id, the Number must be between 1 to 6 (corresponding to slot).<br>
        If it is instead loaded by name, the <b>case sensitive</b> name given to the preset by the player must be used.
        <br>
        If <b>nowait</b> is present, then the Automator will purchase as many Time Studies as
        possible from the preset before moving on to the next command, even if some cannot be bought.<br>
        If <b>nowait</b> is <i>not</i> present, then the Automator will repeatedly attempt to buy the studies in order.
        It will repeat this line indefinitely until all of the studies in the preset are bought; the automator may get
        stuck indefinitely if the preset contains studies in a configuration which cannot be bought simultaneously,
        for example 71, 72, and 73 before the Dimension Split Dilation upgrade is purchased.`,
      examples: [
        `studies load id 2`,
        `studies load name ANTI`,
        `studies nowait load name dil`,
      ]
    },
    {
      id: 13,
      isUnlocked: () => true,
      keyword: "studies purchase",
      name: "<b>studies</b> - Purchase Time Studies",
      syntax: `<b>studies [nowait] purchase <i>[study list]</i></b>`,
      description: `Purchase Time Studies specified from a list formatted like a Tree export.
        If <b>nowait</b> is present, then the Automator will purchase as many Time Studies as
        possible from the text string before moving on to the next command, even if some cannot be bought.<br>
        If <b>nowait</b> is <i>not</i> present, then the Automator will repeatedly attempt to buy the studies in order.
        It will repeat this line indefinitely until all of the studies in the preset are bought; the automator may get
        stuck indefinitely if the preset contains studies in a configuration which cannot be bought simultaneously,
        for example 71, 72, and 73 before the Dimension Split Dilation upgrade is purchased.<br>
        The Time Study list here has more flexibility and can consist of Time Study numbers, separated by
        spaces or commas, ranges of studies (for example, <i>11-62</i>) and the following aliases:<br>
        <blockquote><b>antimatter, infinity, time, active, passive, idle, light, dark</b></blockquote>
        A variable name may be used in place of Time Study list, see <b>define</b>.`,
      examples: [
        "studies nowait 11,21,31",
        "studies 11-62, antimatter, 111, idle",
        "studies nowait ec6Studies",
      ]
    },
    {
      id: 14,
      isUnlocked: () => true,
      keyword: "define",
      name: "<b>define</b> - defining constants",
      syntax: `<b>define [constant_name] = [constant]</b>`,
      description: `Define constants for either numbers or Time Study tree imports`,
      examples: [
        "define inf = 1e308",
        "define studytree = 11,21,22,31,32,33"
      ]
    },
    {
      id: 15,
      isUnlocked: () => true,
      keyword: "currencies",
      name: "List of <b>currencies</b>",
      syntax: "You can use these in any if, while, until, or wait command.",
      description: `This is a list of "currencies" or numbers that you can use.<br>
        Note that when used, most currencies will need to be in scientific notation.<br>
        <b>am</b> - antimatter amount  <br>
        <b>ip</b> - current infinity point amount  <br>
        <b>ep</b> - current eternity point amount  <br>
        <b>rm</b> - current reality machine amount  <br>
        <b>infinities</b> - current infinity amount <br>
        <b>banked infinities</b> - current banked infinity amount <br>
        <b>eternities</b> - current eternity amount <br>
        <b>realities</b> - current reality amount <br>
        <b>pending ip</b> - IP gained on crunch (0 if not available)<br>
        <b>pending ep</b> - EP gained on eternity (0 if not available)<br>
        <b>pending tp</b> - TP gained on exiting dilation<br>
        <b>pending rm</b> - RM gained on reality (0 if not available)<br>
        <b>pending glyph level</b> - glyph level gained on reality (0 if not available)<br>
        <b>dt</b> - dilated time amount  <br>
        <b>tp</b> - tachyon particle amount  <br>
        <b>rg</b> - replicanti galaxy amount (does not use scientific)<br>
        <b>rep</b> - replicanti amount <br>
        <b>tt</b> - time theorem amount <br>
        <b>total tt</b> - TOTAL time theorems, includes all forms of generated TT <br>
        <b>total completions</b> - total completions of all eternity challenges <br>
        <b>pending completions</b> - total completions of current EC at eternity <br>
        <b>ec[number] completions</b> - amount of EC completions for a certain EC <br>
      `,
      examples: [
        `if total tt >= 5
        <blockquote>commands</blockquote>
        `,
        `while ec10 completions >= 1
        <blockquote>commands</blockquote>`
      ]
    },
    {
      id: 16,
      isUnlocked: () => true,
      keyword: "notify",
      name: "<b>notify</b> - send a progress notification",
      syntax: "<b>notify</b> \"text\"",
      description: `Takes the specified text and posts it in the top-right corner as
        a text notification, in the same spot as other notifications such as auto-save
        and achievement/upgrade unlocks. Can be useful for seeing automator status while
        on tabs other than the Automator tab.`,
      examples: [
        "notify \"Dilation reached\"",
        "notify \"ECs completed\""
      ]
    },
    {
      id: 17,
      isUnlocked: () => true,
      keyword: "(Comments)",
      name: "<b>#|//</b> - leaves a comment in your script",
      syntax: "<b>#</b> text<br><b>//</b> text",
      description: `Allows you to leave a note to yourself within your script. This may be
        useful for organizing or keeping track of which parts of your script do various things,
        in a way that appears more readable than just the commands. These commands will do nothing
        positive or negative for the automator's functionality, and only serve as a tool to
        help you keep the steps of your scripts easier to follow if desired.`,
      examples: [
        "# get 1e20 before starting ec1",
        "// this loop alternates dilation and pushing"
      ]
    },
  ]
};
