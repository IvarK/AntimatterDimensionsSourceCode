import { automatorTemplates } from "../script-templates";

export const automator = {
  categoryNames: [
    "Time Studies",
    "Event Triggers",
    "Alter Settings",
    "Information",
    "Script Flow",
  ],
  commands: [
    {
      id: 0,
      isUnlocked: () => true,
      keyword: "STUDIES RESPEC",
      category: 0,
      syntax: `<b>studies respec</b>`,
      description: `This command turns on the respec option, which will respec your Time Studies on the next manual or
        automatic Eternity. Note that this does not actually perform an Eternity on its own; make sure your Autobuyer
        is on or you manually run the ETERNITY command (although ETERNITY has its own built-in respec option).`,
      examples: [
        `studies respec`,
      ]
    },
    {
      id: 1,
      isUnlocked: () => true,
      keyword: "STUDIES LOAD",
      category: 0,
      syntax: `<b>studies</b> [nowait] <b>load id</b> <u>selector</u><br>
        <b>studies</b> [nowait] <b>load name</b> <u>name</u>`,
      description: `Loads a Time Study preset, as if you had clicked on the button in the Time Study tab.`,
      sections: [
        {
          name: "INPUTS",
          items: [
            {
              header: "<i>nowait</i>",
              description: `
                If present, the Automator will purchase as many studies as possible before continuing onward. By default
                (ie. without "nowait") this command will repeat this line indefinitely until all of the studies in the
                preset are bought; this may cause the Automator to get stuck indefinitely if you are not careful.
              `
            },
            {
              header: "<i>selector</i>",
              description: `
                Finds and loads the specified Time Study preset by its slot number. This is numbered one through six,
                ordered from left to right.`
            },
            {
              header: "<i>name</i>",
              description: "Finds and loads the specified Time Study preset by its given name. This is case-sensitive."
            },
          ]
        }
      ],
      examples: [
        `studies load id 2`,
        `studies load name ANTI`,
        `studies nowait load name dil`,
      ]
    },
    {
      id: 2,
      isUnlocked: () => true,
      keyword: "STUDIES PURCHASE",
      category: 0,
      syntax: `<b>studies</b> [nowait] <b>purchase <u>study_list</u></b>`,
      description: "Purchase Time Studies specified from a list of Time Studies.",
      sections: [
        {
          name: "INPUTS",
          items: [
            {
              header: "<i>nowait</i>",
              description: `
                If present, the Automator will purchase as many studies as possible before continuing onward. By default
                (ie. without "nowait") this command will repeat this line indefinitely until all of the studies in the
                preset are bought; this may cause the Automator to get stuck indefinitely if you are not careful.
              `
            },
            {
              header: "<i>study_list</i>",
              description: `
                The exported Time Study tree format is supported here, which is simply a list of Time Study IDs
                separated by commas. This command also supports a more flexible formatting, additionally allowing
                ranges of studies (for example, <u>11-62</u>) and the following aliases:<br>
                <blockquote><b>antimatter, infinity, time, active, passive, idle, light, dark</b></blockquote>
                A variable name may be used in place of the entire Time Study list as well (see the definition panel),
                although in that case the shorthand ranges and aliases are not allowed.`
            },
          ]
        }
      ],
      examples: [
        "studies nowait purchase 11,21,31",
        "studies purchase 11-62, antimatter, 111, idle",
        "studies nowait purchase ec6Studies",
      ]
    },
    {
      id: 3,
      isUnlocked: () => true,
      keyword: "PRESTIGE",
      category: 1,
      syntax: `
        <b>infinity</b> [nowait]<br>
        <b>eternity</b> [nowait] [respec]<br>
        <b>reality</b> [nowait] [respec]`,
      description: `Triggers an Infinity, Eternity, or Reality reset if possible, otherwise the automator will wait at
        this command until it becomes possible. If you find that your script often gets stuck on this command, an
        Autobuyer may be triggering a prestige before the Automator reaches this line - consider using <i>nowait</i> or
        adjusting your Autobuyer settings using AUTO.`,
      sections: [
        {
          name: "MODIFIERS",
          items: [
            {
              header: "<i>nowait</i>",
              description: `
                If present, the Automator will move on to the next command instead of repeatedly trying on this
                command in situations where the prestige is not possible (eg. within an EC below the goal).
              `
            },
            {
              header: "<i>respec</i>",
              description: `
                For non-Infinity prestiges, also does the related respec action when triggering prestige.
                Eternity: Respec Time Studies and Eternity.<br>
                Reality: Unequip Glyphs and Reality.
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
      id: 4,
      isUnlocked: () => true,
      keyword: "UNLOCK",
      category: 1,
      syntax: "<b>unlock</b> [nowait] <u>feature</u>",
      description: "Unlocks the specified Eternity Challenge or Time Dilation.",
      sections: [
        {
          name: "MODIFIERS",
          items: [
            {
              header: "<i>nowait</i>",
              description: `
                If present, the Automator will move on to the next command even if unlocking the feature fails. By
                default, the Automator will keep running this command until the unlock succeeds.
              `
            },
          ]
        }
      ],
      examples: [
        "unlock dilation",
        "unlock ec7"
      ]
    },
    {
      id: 5,
      isUnlocked: () => true,
      keyword: "START",
      category: 1,
      syntax: `
        <b>start</b> ec<u>N</u><br>
        <b>start</b> dilation`,
      description: `Start a specified Eternity Challenge or a Dilated Eternity. This command will also attempt
        to unlock the EC if not unlocked, but will not do the same for Dilation (use UNLOCK command to do that).
        If you are already in the specified EC or Dilated Eternity, running this command again will do nothing;
        otherwise, the Automator will keep attempting to start the Eternity until it succeeds.`,
      examples: [
        "start ec12",
        "start dilation"
      ]
    },
    {
      id: 6,
      isUnlocked: () => true,
      keyword: "AUTO",
      category: 2,
      syntax: `<b>auto infinity</b> [setting]<br>
        <b>auto eternity</b> [setting]<br>
        <b>auto reality</b> [setting]`,
      description: `Turns prestige Autobuyers on or off and allows you to change their settings. If the setting option
        is not present, this command will toggle the Autobuyer state, turning it off if it is on and turning it on if
        it is off. <b>This command will not work if you try to modify an Autobuyer or setting you do not have.</b>`,
      sections: [
        {
          name: "SETTINGS",
          items: [
            {
              header: "<i>on</i> | <i>off</i>",
              description: "Turns specified Autobuyer on or off.",
            },
            {
              header: "<u><i>number</i></u> <u><i>time units</i></u>",
              description: `Usable with Infinity and Eternity only.
                Turns the Autobuyer on and set it to trigger at the given interval.`
            },
            {
              header: "<u><i>number</i></u> x highest",
              description: `Usable with Infinity and Eternity only. Turns the Autobuyer on and sets it to
                "X times highest" mode.`
            },
            {
              header: "<i><u>number</u> <u>currency</u></i>",
              description: `Turns the Autobuyer on and sets it to trigger at a specific amount. The currency must
                match the autobuyer type (IP, EP, or RM). This will select "Reality Machines" mode for the Reality
                Autobuyer. Glyph Level mode cannot be changed or set via the Automator, only manually.`,
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
      isUnlocked: () => BlackHole(1).isUnlocked,
      keyword: "BLACK HOLE",
      category: 2,
      syntax: "<b>black hole</b> <u>state</u>",
      description: `Toggles the speedup effect from the Black Hole on or off. Turning the Black Hole on via the
        Automator does not bypass the gradual acceleration from off to max speed which occurs before they are
        permanent.`,
      examples: [
        "black hole on",
        "black hole off",
      ]
    },
    {
      id: 8,
      isUnlocked: () => Enslaved.isUnlocked,
      keyword: "STORE GAME TIME",
      category: 2,
      syntax: "<b>store game time</b> <u>action</u>",
      description: `Changes whether or not the Black Hole is storing time. Also allows usage of stored time.`,
      sections: [
        {
          name: "ACTIONS",
          items: [
            {
              header: "<i>on</i> | <i>off</i>",
              description: `
                Turns storing game time on or off.
              `
            },
            {
              header: "<i>use</i>",
              description: `
                Uses all stored game time. Does not alter the on/off state of time storage.
              `
            }
          ]
        }
      ],
      examples: [
        "store game time on",
        "store game time off",
        "store game time use",
      ]
    },
    {
      id: 9,
      isUnlocked: () => true,
      keyword: "NOTIFY",
      category: 3,
      syntax: "<b>notify</b> \"<u>text</u>\"",
      description: `Takes the specified text and posts it in the top-right corner as
        a text notification, in the same spot and style as other notifications such as auto-save
        and achievement/upgrade unlocks. Can be useful for seeing automator status while
        on tabs other than the Automator tab.`,
      examples: [
        "notify \"Dilation reached\"",
        "notify \"ECs completed\""
      ]
    },
    {
      id: 10,
      isUnlocked: () => true,
      keyword: "Adding Comments",
      category: 3,
      syntax: "<b>#</b> text<br><b>//</b> text",
      description: `Allows you to leave a note to yourself within your script. This may be
        useful for organizing or keeping track of which parts of your script do various things,
        in a way that appears more readable than just the commands. These commands mainly serve as a tool to
        help you keep the steps of your scripts easier to follow if desired.`,
      sections: [
        {
          name: "NOTES",
          items: [
            {
              header: "<i>Inline comments</i>",
              description: `
                The Automator does not support comments which are placed after an already functional
                line of code, on the same line. As an example, the single line "studies load name TDI // Load push"
                will be an invalid command. In this case, you will need to move the comment to a separate line
                in the automator.
              `
            },
            {
              header: "<i>Execution speed</i>",
              description: `
                Having comments will not slow down your script, as they are completely skipped during
                execution and do not count as a command for the purposes of running. For example, even if you have
                a really long explanation in the form of comments on lines 20-40, the Automator will still
                <i>immediately</i> skip from line 19 to 41 during execution.
              `
            },
          ]
        }
      ],
      examples: [
        "# get 1e20 before starting ec1",
        "// this loop alternates dilation and pushing"
      ]
    },
    {
      id: 11,
      isUnlocked: () => true,
      keyword: "WAIT",
      category: 4,
      syntax: "<b>wait</b> <u>condition</u>",
      description: `Forces Automator to wait for some condition or event. To wait for a certain duration of time,
        use the PAUSE command instead.`,
      sections: [
        {
          name: "POSSIBLE CONDITIONS",
          items: [
            {
              header: "<i>comparison</i>",
              description: `
                Wait until the comparison statement is true. Check the entry for "Formatting Comparisons" for details
                on how to properly input this option.
              `
            },
            {
              header: "<i>prestige</i>",
              description: `
                Wait until the specified prestige (Infinity, Eternity, or Reality) has been triggered by its respective
                Autobuyer. This must happen <i>after</i> this command is reached; if the Autobuyer triggers
                <i>before</i> the command is reached, your script may get stuck.
              `
            },
            {
              header: "<i>black hole (state)</i>",
              description: `
                Wait until the Black Hole(s) are in the specified state. Valid inputs for state are
                "off", "bh1", and "bh2", corresponding to no active Black Hole(s), at least the first Black Hole active,
                and both Black Holes active.
              `
            }
          ]
        }
      ],
      examples: [
        "wait am >= 1e308",
        "wait pending completions >= 5",
        "wait ec9 completions >= 4",
        "wait infinity",
        "wait black hole bh1",
      ]
    },
    {
      id: 12,
      isUnlocked: () => true,
      keyword: "PAUSE",
      category: 4,
      syntax: "<b>pause</b> <u>interval</u>",
      description: `Tells the automator to stop moving forward and executing commands for a certain amount of time.
        Note that if the pause duration is shorter than the automator's execution speed, the automator will wait until
        the next execution tick before moving on.`,
      examples: [
        "pause 10s",
        "pause 1 minute",
        "pause 34 seconds"
      ],
      sections: [
        {
          name: "INTERVAL FORMATTING",
          items: [
            {
              header: "<i>Specified Interval</i>",
              description: `This command accepts time units of milliseconds ("ms"), seconds ("s", "sec", or "seconds"),
                minutes ("m", "min", or "minutes"), and hours ("h" or "hours"). You cannot provide just a number and
                nothing else; a unit of time must be specified.`,
            },
            {
              header: "<i>Defined Constant</i>",
              description: `A defined constant may be used instead, see the definition panel. The defined value will
                be assumed to be in units of seconds.`
            },
          ]
        },
        {
          name: "OTHER",
          items: [
            {
              header: "<i>Offline Side-effects</i>",
              description: `This command may behave undesirably when it runs during offline progress due to limited
                tick count. A 1-second pause that is usually 20-30 ticks might be only 1 game tick when processing
                hours of offline progress, which might not be enough for the resources needed for the rest of the
                script.`,
            },
            {
              header: "<i>Alternatives</i>",
              description: `Using another command like 'WAIT' will allow you to set it for a certain resource amount,
                in order to ensure that the game has the proper state before moving onward.`
            },
            {
              header: "<i>Manual Skip</i>",
              description: `You can manually force the Automator to continue execution past a PAUSE command without
                waiting the entire specified time by stepping forward one line (to put it on the next one) and then
                resuming execution. If you find yourself doing this regularly, consider modifying your script.`
            }
          ]
        }
      ]
    },
    {
      id: 13,
      isUnlocked: () => true,
      keyword: "IF",
      category: 4,
      syntax: `<b>if</b> <u>condition</u> {<br>
        <blockquote>commands</blockquote>
        }`,
      description: `Defines an inner block of block of the automator script which will only be executed if the specified
        comparison is true when this line is reached. If the comparison is false, the automator will instead skip to the
        first line after the block and continue execution from there.`,
      examples: [
        "if ec10 completions < 5",
        "if ep > 1e6000"
      ]
    },
    {
      id: 14,
      isUnlocked: () => true,
      keyword: "UNTIL",
      category: 4,
      syntax: `<b>until</b> <u>comparison</u> {<br>
        <blockquote>commands</blockquote>
        }<br><b>until</b> <u>prestige_event</u> {<br>
          <blockquote>commands</blockquote>
        }`,
      description: `Defines an inner block of the script where commands are repeated; the comparison is checked at the
        start and every time the loop repeats. If the condition is true when the UNTIL statement is first reached, the
        inner block of commands will be skipped entirely.
        <br><br>
        If an prestige event (ie. Infinity, Eternity, or Reality) is specified instead of a condition, then the block
        will always be entered and the commands within the block will repeat until the event occurs for the first time
        <i>after</i> entering the block. Note that the Automator will finish the rest of the loop and then exit after
        the prestige event occurs - it will not immediately exit the loop in the middle.`,
      examples: [
        "until ep > 1e500",
        "until reality",
      ]
    },
    {
      id: 15,
      isUnlocked: () => true,
      keyword: "WHILE",
      category: 4,
      syntax: `<b>while</b> <u>comparison</u> {<br>
        <blockquote>commands</blockquote>
      }`,
      description: `Defines an inner block of the script where commands are repeated; the comparison is checked at the
        start and every time the loop repeats. If the condition is false when the WHILE statement is first reached, the
        inner block of commands will be skipped entirely.`,
      examples: [
        `while ep < 1e500`,
        `while myThreshold > am`,
      ]
    },
    {
      id: 16,
      isUnlocked: () => true,
      keyword: "STOP",
      category: 4,
      syntax: `<b>stop</b>`,
      description: `When the Automator runs this line, it will stop execution as if you clicked the
        <i class="fas fa-stop"></i> button on the control panel in the top-left of the Automator. This
        does not need to be placed at the end of every script in order to stop them, as turning off the
        <i class="fas fa-sync-alt"></i> option on the left panel will do this automatically.
        This command may be useful when used inside of an IF command, in order to stop execution
        only under certain conditions.`,
      examples: [
        `stop`,
      ]
    },
    {
      id: 17,
      isUnlocked: () => true,
      keyword: "Currency List",
      category: 4,
      syntax: "<i>You can use these in any IF, WHILE, UNTIL, or WAIT command</i>",
      description: () => {
        const filterText = EffarigUnlock.glyphFilter.isUnlocked
          ? `<b>filter score</b> - Glyph filter score of the Glyph which your filter will select this Reality<br>`
          : "";
        const stText = V.spaceTheorems > 0
          ? `<b>space theorems</b> - Current unspent Space Theorem amount<br>
            <b>total space theorems</b> - TOTAL Space Theorems, including ones spent on current Studies<br>`
          : "";
        return `This is a list of "currencies" or numbers that you can use within the Automator.<br>
          Note that when used, most currencies will need to be in scientific notation.<br>
          <b>am</b> - Current Antimatter amount  <br>
          <b>ip</b> - Current Infinity Point amount  <br>
          <b>ep</b> - Current Eternity Point amount  <br>
          <b>rm</b> - Current Reality Machine amount  <br>
          <b>infinities</b> - Current Infinity amount <br>
          <b>banked infinities</b> - Current Banked Infinity amount <br>
          <b>eternities</b> - Current Eternity amount <br>
          <b>realities</b> - Current Reality amount <br>
          <b>pending ip</b> - IP gained on Infinity (0 if not available)<br>
          <b>pending ep</b> - EP gained on Eternity (0 if not available)<br>
          <b>pending tp</b> - TP gained on exiting Dilation<br>
          <b>pending rm</b> - RM gained on Reality (0 if not available)<br>
          <b>pending glyph level</b> - Glyph Level gained on Reality (0 if not available)<br>
          <b>dt</b> - Current Dilated Time amount <br>
          <b>tp</b> - Current Tachyon Particle amount<br>
          <b>rg</b> - Current Replicanti Galaxy amount (does not use scientific)<br>
          <b>rep</b> - Current Replicanti amount <br>
          <b>tt</b> - Current Time Theorem amount <br>
          <b>total tt</b> - TOTAL Time Theorems, includes all forms of generated TT and any spent on Studies <br>
          <b>spent tt</b> - Time Theorems currently spent on all Time Studies <br>
          <b>total completions</b> - Total completions of all Eternity Challenges <br>
          <b>pending completions</b> - Total completions of current EC at Eternity <br>
          <b>ec<u>X</u> completions</b> - Amount of EC completions for a certain EC (eg. "ec6 completions")<br>
          ${filterText}
          ${stText}
        `;
      }
    },
    {
      id: 18,
      isUnlocked: () => true,
      keyword: "Formatting Comparisons",
      category: 4,
      syntax: "<u>resource1</u> <u>condition</u> <u>resource2</u>",
      description: `
        Comparisons are used within certain commands, which allow you to control the behavior of the automator based
        on the game's current state. They have a standard format with two value inputs and a comparison operator, but
        the value inputs can be anything as long as it is formatted correctly overall.`,
      sections: [
        {
          name: "CONDITIONS",
          items: [
            {
              header: "<i>resource</i>",
              description: `
                This can be any Automator Currency, a defined constant, or a number which must be formatted in
                scientific notation (eg. 1000, 1e100, 1.8e308). Unlike more general programming languages, this must
                be a single value (ie. math expressions such as "ip + pending ip" are not allowed).
              `
            },
            {
              header: "<i>condition</i>",
              description: `
                This must be an inequality operator (<, <=, >, >=), which takes on its typical mathematical meaning.
                Equality operators (==, !=) are not allowed, as the nature of the game means that numbers will often
                never be exactly equal and thus checking based on direct equality may lead to unexpected script
                behavior.
              `
            },
          ]
        }
      ],
      examples: [
        "ep < 1e20",
        "total tt > 14000",
      ]
    },
    {
      id: 19,
      isUnlocked: () => true,
      keyword: "Commands with inner blocks",
      category: 4,
      syntax: `<b>header_command</b> {<br>
        <blockquote>inner_commands</blockquote>
        }`,
      description: `Some commands are associated with an "inner block" of commands. This inner block can contain still
        contain any other valid command, but may or may not actually get executed based on what the state of the game is
        when <b>header_command</b> is executed. This allows you to repeat some commands over and over (eg. Time Study
        purchasing), or to skip them entirely (eg. not entering an EC if it already has full completions). These blocks
        can be nested if desired, with inner blocks being placed within one another.
        <br><br>
        In the text editor mode: Specify the inner block with curly braces, with the opening brace { on the same line as
        the comparison and the closing brace } on its own line after the last line you want inside the block. Inner
        commands do not need to be indented, although it may be visually helpful to do so.
        <br><br>
        In the block editor mode: These commands come with an empty dotted rectangle which indicates which commands are
        within the inner block. Subsequent blocks can then be dragged inside the dotted rectangle.
        `,
      examples: [
        `if ec10 completions < 5 {<br>
          <blockquote>
          unlock ec10<br>
          start ec10</blockquote>
        }`,
        `until ep > 1e8 {<br>
          <blockquote>
          studies nowait purchase 11-62<br>
          pause 10s<br>
          eternity respec</blockquote>
        }`
      ]
    },
  ],
  otherAutomatorPoints: [
    {
      name: "Reality Count",
      automatorPoints: () => 2 * Math.clampMax(Currency.realities.value, 50),
      shortDescription: () => `+${formatInt(2)} per Reality, up to ${formatInt(50)} Realities`,
      symbol: "Ϟ",
    },
    {
      name: "Black Hole",
      automatorPoints: () => (BlackHole(1).isUnlocked ? 10 : 0),
      shortDescription: () => `Unlocking gives ${formatInt(10)} AP`,
      symbol: "<i class='fas fa-circle'></i>",
    },
  ],
  templates: automatorTemplates
};
