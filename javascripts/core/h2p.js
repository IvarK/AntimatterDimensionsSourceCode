"use strict";
/**
 * @template
 * {
 *  name: {String}
 *  id: {Number}
 *  info: {function: @return String}
 *  unlock: {function: @return Boolean}
 *  tags: {Array: String}
 *  tab: {String} "tab/subtab"
 * }
 */

const H2P_TABS = [
  {
    name: "Dimensions",
    id: 0,
    info: () => `Dimensions are your production units in game. The first Dimension produces your Antimatter.
    Each consecutive dimension produces the previous one, allowing you to have steady growth.
    There are eight dimensions total. <br> <br>
    <b>Dimension Multiplier:</b> Beside the dimension there is a multiplier (example: First Dimension x1.0).
    The base production of each dimension is multiplied by this number.
    This multiplier increases by 2x(Base) for every 10 of that dimension purchased. Each time this occurs,
    the price of the dimension will increase. <br> <br>
    <b>Accumulated Dimension Quantity:</b> The next column is your current amount of that dimension you own.
    This is a combination of how many you have purchased with antimatter,
    as well as produced from the higher dimension. <br> <br>
    <b>Purchased Dimensions Quantity:</b> Next to each accumulated quantity of owned dimensions,
    the amount of that dimension purchased toward the next multiplier upgrade is displayed in brackets.
    If you have (4) next to your accumulated dimension quaintly,
    you will need 6 more of that dimension for the next multiplier increase. <br> <br>
    <b>Dimension Growth Percent:</b> This number represents the amount of growth that
    dimensions experiences per second. +100% means the dimension is doubling each second.
    This allows you to judge overall growth. <br> <br>
    <b>Cost &amp; until 10:</b>
    You can buy a single quantity of each dimension with antimatter when the cost button is highlighted.
    Alternatively, if the Until 10 buttons is highlighted,
    you can buy whatever quantity gets you to that dimensions next dimension multiplier. <br> <br>
    <b>Max all:</b> Max all will buy max tickspeed (see below),
    then will buy until 10 of 1st dimension until it can't anymore, then 2nd, and so on. <br> <br>
    <b>Dimension base prices:</b> ${format(10)}, ${format(100)}, ${format(1e4)}, ${format(1e6)}, ${format(1e9)},
    ${format(1e14)}, ${format(1e18)}, ${format(1e24)} <br>
    <b>Base per 10 bought dimension price increases:</b>${format(1e3)}, ${format(1e4)}, ${format(1e5)}, ${format(1e6)},
    ${format(1e8)}, ${format(1e10)}, ${format(1e12)}, ${format(1e15)} <br> <br>
    <b>Hotkeys: 1, 2, 3, 4, 5, 6, 7, 8</b> for buy until 10 Xth dimension
    (you can also hold down shift while buying dimensions, it will only buy 1 instead of 10), <b>M</b> for Max all`,
    unlock: () => true,
    tags: ["dims", "normal", "antimatter"],
    tab: "dimensions/normal"
  }, {
    name: "Tickspeed",
    id: 1,
    info: () => `<b>Tick:</b> Production in the game happens on each “tick”. <br><br>
    <b>Interval:</b> The length of time between ticks. This is lowered by purchasing tick interval reductions. <br>
    <b>Cost:</b> The cost of antimatter for reducing the tick interval by the % displayed above
    (Without Galaxies your base tickspeed decrease is 11% per purchase) <br><br>
    <b>Buy Max:</b> This will buy the maximum amount of tick interval decreases available
    with your current amount of Antimatter. <br><br>
    <b>Hotkeys: T</b> will purchase as many tickspeed upgrades as possible, or <b>Shift+T</b> to buy a single upgrade.
    Note that the actual tickspeed time is fake and the game always runs at your update rate in Options.`,
    unlock: () => Tickspeed.isUnlocked,
    tags: ["dimension", "earlygame", "time"],
    tab: "dimensions/normal"
  }, {
    name: "Dimension Shift/Boost",
    id: 2,
    info: () => `<b>Dimension Shift:</b> This resets your current game,
    but unlocks another dimension for your next run.
    Each one requires 20 (base) of your highest unlocked dimension. <br><br>
    <b>Dimension Boost:</b> A dimension shift, but you don't unlock a new dimension.
    This happens after 4 dimension shifts. Each one requires 20+(boosts*15) (base) eighth dimensions. <br><br>
    Each dimension shift and boost will provide a x2 (base) multiplier to first dimension,
    and each dimension after will have half (base) multiplier as the previous (min 1). <br><br>
    <b>Hotkey: D</b>`,
    unlock: () => true,
    tags: ["dimboost", "dimshift", "reset", "earlygame"],
    tab: "dimensions/normal"
  }, {
    name: "Antimatter Galaxies",
    id: 3,
    info: () => `Purchasing an Antimatter Galaxy will reset your game back to
    the point where only 4 Dimensions are available,
    but will increase the effect of your tick speed interval reduction by 2%. <br><br>
    Though it will have very little impact for the first few purchases,
    the increase is multiplicative and won’t take long to be visible. <br><br>
    Your first galaxy will increase your tickspeed interval upgrade as if it were 10% originally,
    so you will have 12% after 1 galaxy. <br><br>
    Galaxies require 80+(galaxies*60) (base) Eighth Dimensions.
    (80+galaxies*60+(galaxies-99)^2*2 when above 100 non-replicanti galaxies,
    and an extra 1.002x on top of that past 800 non-replicanti galaxies.) <br><br>
    <b>Hotkey: G</b>`,
    unlock: () => true,
    tags: ["8th", "reset", "earlygame"],
    tab: "dimensions/normal"
  }, {
    name: "Dimensional Sacrifice",
    id: 4,
    info: () => `<b>You unlock Dimensional Sacrifice after your first dimension boost.</b> <br><br>
    Sacrificing will immediately reduce the owned quantity of dimensions 1 through 7 to zero.
    This does not reduce the multiplier or the current cost.
    In return, it will multiply the Eighth Dimension Multiplier by the shown value.
    It will take time to get back to the production you previously had,
    but you will end up with a net increase. <br><br>
    <b>When should I Sacrifice?</b> Depends on your percentages (+%/s),
    but if they are over ~2% and the multiplier is over 2x, it's usually worth it.
    The lower the percentage, the longer it takes to gain back your dimensions. <br><br>
    <b>Dimensional Sacrifice Checkbox:</b> This allows you to complete dimensional sacrifices without
    having the warning popup. <br><br><br><br>
    The dimensional sacrifice formula (where n is the total amount of first dimensions you've had) is: <br><br>
    Base: (log(n)/10)^m, where m is 2 at base, 2.2 with the "The Gods are pleased" achievement,
    and 2.5 with the "Gift from the Gods" achievement. <br><br>
    Eighth Dimension Autobuyer Challenge: m^0.05/n^0.04*j,
    where m is the current number of first dimensions you have and j is your previous sacrifice multiplier. <br><br>
    After Infinity Challenge 2: n^m, where m is 0.01 at base and 0.011 with the
    "Yet another infinity reference" achievement. <br><br>
    <b>Hotkey: S</b>`,
    unlock: () => Sacrifice.isUnlocked,
    tags: ["8th", "reset", "earlygame", "gods"],
    tab: "dimensions/normal"
  }, {
    name: "Achievements",
    id: 5,
    info: () => `Each achievement has conditions that must be met before they are earned.
    Some are very simple, and some are significantly trickier.
    You may have to infinity or start a challenge before attempting some of the harder ones. <br><br>
    You will recieve a x1.5 multiplier to all normal dimensions for each completed row.
    In addition, most achievements have their own rewards.`,
    unlock: () => true,
    tags: ["earlygame"],
    tab: "achievements"
  }
];
