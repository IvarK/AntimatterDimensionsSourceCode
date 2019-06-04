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
      name: "<b>start</b> - start Eternity Challenge or Time Dilation",
      syntax: "<b>start</b> [ec<i>X</i>|dilation]",
      examples: [
        "start ec12",
        "start dilation"
      ]
    },
  ]
};
