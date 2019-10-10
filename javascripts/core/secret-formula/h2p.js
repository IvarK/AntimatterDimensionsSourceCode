"use strict";

GameDatabase.h2p = {
  /**
   * @template
   * {
   *  name: {String}
   *  alias: {String}
   *  id: {Number}
   *  info: {function: @return String}
   *  isUnlocked: {function: @return Boolean}
   *  tags: {Array: String}
   *  tab: {String} "tab/subtab"
   * }
   */
  tabs: [
    {
      name: "Dimensions",
      info: () => `
Dimensions are your production units in game. The first Dimension produces your Antimatter.
Each consecutive dimension produces the previous one, allowing you to have steady growth.
There are eight dimensions total.
<br>
<br>
<b>Dimension Multiplier:</b> Beside the dimension there is a multiplier (example: First Dimension x1.0).
The base production of each dimension is multiplied by this number.
This multiplier increases by 2x(Base) for every 10 of that dimension purchased. Each time this occurs,
the price of the dimension will increase.
<br>
<br>
<b>Accumulated Dimension Quantity:</b> The next column is your current amount of that dimension you own.
This is a combination of how many you have purchased with antimatter,
as well as produced from the higher dimension.
<br>
<br>
<b>Purchased Dimensions Quantity:</b> Next to each accumulated quantity of owned dimensions,
the amount of that dimension purchased toward the next multiplier upgrade is displayed in brackets.
If you have (4) next to your accumulated dimension quaintly,
you will need 6 more of that dimension for the next multiplier increase.
<br>
<br>
<b>Dimension Growth Percent:</b> This number represents the amount of growth that
dimensions experiences per second. +100% means the dimension is doubling each second.
This allows you to judge overall growth.
<br>
<br>
<b>Cost &amp; until 10:</b>
You can buy a single quantity of each dimension with antimatter when the cost button is highlighted.
Alternatively, if the Until 10 buttons is highlighted,
you can buy whatever quantity gets you to that dimensions next dimension multiplier.
<br>
<br>
<b>Max all:</b> Max all will buy max tickspeed (see below),
then will buy until 10 of 1st dimension until it can't anymore, then 2nd, and so on.
<br>
<br>
<b>Dimension base prices:</b> ${format(10)}, ${format(100)}, ${format(1e4)}, ${format(1e6)}, ${format(1e9)},
${format(1e14)}, ${format(1e18)}, ${format(1e24)}
<br>
<b>Base per 10 bought dimension price increases:</b>${format(1e3)}, ${format(1e4)}, ${format(1e5)}, ${format(1e6)},
${format(1e8)}, ${format(1e10)}, ${format(1e12)}, ${format(1e15)}
<br>
<br>
<b>Hotkeys: 1, 2, 3, 4, 5, 6, 7, 8</b> for buy until 10 Xth dimension
(you can also hold down shift while buying dimensions, it will only buy 1 instead of 10), <b>M</b> for Max all
`,
      isUnlocked: () => true,
      tags: ["dims", "normal", "antimatter", "nd"],
      tab: "dimensions/normal"
    }, {
      name: "Tickspeed",
      info: () => `
<b>Tick:</b> Production in the game happens on each “tick”.
<br>
<br>
<b>Interval:</b> The length of time between ticks. This is lowered by purchasing tick interval reductions.
<br>
<b>Cost:</b> The cost of antimatter for reducing the tick interval by the % displayed above
(Without Galaxies your base tickspeed decrease is 11% per purchase)
<br>
<br>
<b>Buy Max:</b> This will buy the maximum amount of tick interval decreases available
with your current amount of Antimatter.
<br>
<br>
<b>Hotkeys: T</b> will purchase as many tickspeed upgrades as possible, or <b>Shift+T</b> to buy a single upgrade.
Note that the actual tickspeed time is fake and the game always runs at your update rate in Options.
`,
      isUnlocked: () => Tickspeed.isUnlocked,
      tags: ["dimension", "earlygame", "time"],
      tab: "dimensions/normal"
    }, {
      name: "Dimension Shift/Boost",
      info: () => `
<b>Dimension Shift:</b> This resets your current game,
but unlocks another dimension for your next run.
Each one requires 20 (base) of your highest unlocked dimension.
<br>
<br>
<b>Dimension Boost:</b> A dimension shift, but you don't unlock a new dimension.
This happens after 4 dimension shifts. Each one requires 20+(boosts×15) (base) eighth dimensions.
<br>
<br>
Each dimension shift and boost will provide a ×2 (base) multiplier to first dimension,
and each dimension after will have half (base) multiplier as the previous (min 1).
<br>
<br>
<b>Hotkey: D</b>
`,
      isUnlocked: () => true,
      tags: ["dimboost", "dimshift", "reset", "earlygame"],
      tab: "dimensions/normal"
    }, {
      name: "Antimatter Galaxies",
      info: () => `
Purchasing an Antimatter Galaxy will reset your game back to
the point where only 4 Dimensions are available,
but will increase the effect of your tick speed interval reduction by 2%.
<br>
<br>
Though it will have very little impact for the first few purchases,
the increase is multiplicative and won’t take long to be visible.
<br>
<br>
Your first galaxy will increase your tickspeed interval upgrade as if it were 10% originally,
so you will have 12% after 1 galaxy.
<br>
<br>
Galaxies require 80+(galaxies×60) (base) Eighth Dimensions.
(80+galaxies×60+(galaxies-99)<sup>2</sup>×2 when above 100 non-replicanti galaxies,
and an extra 1.002× on top of that past 800 non-replicanti galaxies.)
<br>
<br>
<b>Hotkey: G</b>
`,
      isUnlocked: () => true,
      tags: ["8th", "reset", "earlygame"],
      tab: "dimensions/normal"
    }, {
      name: "Dimensional Sacrifice",
      info: () => `
<b>You unlock Dimensional Sacrifice after your first dimension boost.</b>
<br>
<br>
Sacrificing will immediately reduce the owned quantity of dimensions 1 through 7 to zero.
This does not reduce the multiplier or the current cost.
In return, it will multiply the Eighth Dimension Multiplier by the shown value.
It will take time to get back to the production you previously had,
but you will end up with a net increase.
<br>
<br>
<b>When should I Sacrifice?</b> Depends on your percentages (+%/s),
but if they are over ~2% and the multiplier is over 2×, it's usually worth it.
The lower the percentage, the longer it takes to gain back your dimensions.
<br>
<br>
<b>Dimensional Sacrifice Checkbox:</b> This allows you to complete dimensional sacrifices without
having the warning popup.
<br>
<br>
<br>
<br>
The dimensional sacrifice formula (where n is the total amount of first dimensions you've had) is:
<br>
<br>
Base: (log(n)/10)<sup>m</sup>, where m is 2 at base, 2.2 with the "The Gods are pleased" achievement,
and 2.5 with the "Gift from the Gods" achievement.
<br>
<br>
Eighth Dimension Autobuyer Challenge: m<sup>0.05</sup>/n<sup>0.04</sup>×j,
where m is the current number of first dimensions you have and j is your previous sacrifice multiplier.
<br>
<br>
After Infinity Challenge 2: n<sup>m</sup>, where m is 0.01 at base and 0.011 with the
"Yet another infinity reference" achievement.
<br>
<br>
<b>Hotkey: S</b>
`,
      isUnlocked: () => Sacrifice.isUnlocked || PlayerProgress.infinityUnlocked,
      tags: ["8th", "reset", "earlygame", "gods", "earlygame"],
      tab: "dimensions/normal"
    }, {
      name: "Achievements",
      // This one could use some work!
      info: () => `
Each achievement has conditions that must be met before they are earned.
Some are very simple, and some are significantly trickier.
You may have to infinity or start a challenge before attempting some of the harder ones.
<br>
<br>
You will recieve a ×1.5 multiplier to all normal dimensions for each completed row.
In addition, most achievements have their own rewards.
`,
      isUnlocked: () => true,
      tags: ["earlygame", "awards", "earlygame"],
      tab: "achievements"
    }, {
      name: "Infinity",
      info: () => `
Once you have too much Antimatter for the world to
handle (2<sup>1024</sup>, or 1.7976931348623159e308) you’ll reach infinity and be
able to perform a “Big Crunch”.
<br>
<br>
Each Infinity completed will give an Infinity Point.
These can be spent on upgrades in the new infinity tab.
You must purchase these upgrades from top to bottom.
<br>
<br>
The "x2 IP from all sources" upgrade can be bought multiple times,
but each purchase requires 10 times as much IP.
You must buy all 16 previous infinity upgrades to buy the first level.
<br>
<br>
<b>When should I try to reach Infinity?</b>
It's recommend to get 2 galaxies before attempting to reach it.
On the way there, you should dimension boost as many times as you can.
<b>Hotkey: C</b> Big Crunches.
`,
      isUnlocked: () => PlayerProgress.infinityUnlocked || player.galaxies > 0,
      tags: ["crunch", "big", "upgrades", "ip", "reset", "prestige", "earlygame"],
      tab: "infinity/upgrades"
    }, {
      name: "Challenges",
      info: () => `
Challenges are unlocked after first infinity;
they change in-game mechanics in different ways to create more difficult infinity circumstances.
<br>
<br>
Each completed challenge will award an auto buyer.
You can run them multiple times (though only the first time grants a reward),
and they can be exited at any time via the “Exit Challenge” button on the challenge tab.
<br>
<br>
The rightmost row of Infinity Upgrades does not work in challenges.
`,
      isUnlocked: () => PlayerProgress.infinityUnlocked,
      tags: ["infinity", "autobuyer", "earlygame"],
      tab: "challenges/normal"
    }, {
      name: "Autobuyers",
      info: () => `
<b>Autobuyers:</b>
<br>
Autobuyers (awarded by completing challenges) allow the
automatic purchase of dimensions, dimension shifts/boosts, galaxies,
tickspeed interval decreases, Big Crunches, and Dimensional Sacrifice (later).
They are located under the Infinity tab in "Autobuyers".
<br>
<br>
<b>Priority:</b> Priorities tell the game which autobuyer will buy
if two are affordable in the same tick. Priority 1 is bought 1st,
Priority 2 is bought 2nd, etc. Two equal priorities will pick their
buying order randomly.
<br>
<br>
<b>Autobuyer Speed:</b>The cooloff period before the autobuyer makes another puchase.
This rounds up to the nearest 100ms, so 200ms and 101ms are the same speed.
<br>
<br>
<b>Bulk Buy:</b> Once the Speed of an Autobuyer is maxed, all future
upgrades will double the amount the autobuyer purchases per tick. This can be disabled.
<br>
<br>
<b>Dimension Autobuyer Buy Quantity:</b> Autobuyers for dimensions can be set to buy a single,
or until 10, on each cooldown. Bulk buy does not work when the autobuyer is set to singles.
<br>
<br>
<b>Tickspeed Autobuyer Buy Quantity:</b> The tickspeed autobuyer can be set to buy a
single or the max available on each cooldown.
<br>
<br>
<b>Automatic Dimboost Customization:</b> With the Dimboost autobuyer you can set the max
amount of 8th dimensions to use for the autobuyer,
the amount of galaxies before dimboosts are always autopurchased, and (when unlocked)
the ability to buy dimboosts in bulk (at a fixed amount).
<br>
<br>
<b>Max Galaxies:</b> The highest amount of galaxies the galaxies autobuyer will buy.
<br>
<br>
<b>IP on crunch:</b> Once you break Infinity,
you can set how many IP you would like to wait for before crunching.
It accepts e notation (12.34e5 is 1234000).
<br>
<br>
<b>Sacrifice Autobuyer:</b> This autobuyer has a maxed timer from the start.
You can set how much multiplier it waits for before sacrificing. It accepts e notation.
<br>
<br>
The double autobuyer tick speed upgrade will have all autobuyers buy twice as fast.
<br>
<br>
<b>Toggle All Autobuyers:</b> This button will turn all of your autobuyers on or off.
If dimension autobuyer 1-6 are on, but 7, 8, and tickspeed aren't, it will turn on 7, 8, and tickspeed.
<br>
<br>
<b>Hotkey: A</b> (for toggle all autobuyers).
`,
      isUnlocked: () => PlayerProgress.infinityUnlocked,
      tags: ["infinity", "automation", "challenges", "rewards", "interval", "earlygame"],
      tab: "infinity/autobuyers"
    }, {
      name: "Break Infinity",
      info: () => `
Originally Antimatter Dimensions was restricted by "Infinity".
Since a significant update, you can now "Break Infinity" once your
Big Crunch autobuyer has been maxed.
This opens up a selection of new upgrades as well as the ability to gain more than 1
infinity point per run.
<br>
<br>
<b>Fixing Infinity:</b>You can revert the breaking at anytime by
clicking fix infinity.
<br>
<br>
<b>IP Gain Formula:</b>10<sup>log(antimatter)/n-0.75</sup>×bonuses,
where n is 308 at default${PlayerProgress.eternityUnlocked ? ", " : " or "}307.8 with the
"This achievement doesn't exist II"
achievement${PlayerProgress.eternityUnlocked ? ", or 290 with time study 111" : ""}.
`,
      isUnlocked: () => Autobuyer.bigCrunch.hasMaxedInterval || PlayerProgress.eternityUnlocked,
      tags: ["limit", "crunch", "upgrades", "midgame"],
      tab: "infinity/break"
    }, {
      name: "Infinity Dimensions",
      info: () => `
<b>Unlocking Infinity Dimensions:</b>Infinity Dimensions are unlocked by
reaching a certain amount of antimatter.
<br>
<br>
<b>Infinity Dimension Cost:</b>Infinity dimensions are only purchasable in sets of 10,
and cost Infinity points.
<br>
<br>
<b>Infinity Dimension Production:</b>Similar to the original dimensions,
each infinity dimension produces the dimension above it.
Dimension 3 produce 2, 2 produces 1.
Instead of antimatter, Infinity Dimension produces Infinity power,
which translates to an overall multiplier on all original dimensions.
<br>
<br>
Infinity Power gives a boost to all dimensions equal to (power<sup>7</sup>).
`,
      isUnlocked: () => Autobuyer.bigCrunch.hasMaxedInterval || PlayerProgress.eternityUnlocked,
      tags: ["id", "power", "new", "dims", "unlock", "break", "midgame"],
      tab: "dimensions/infinity"
    }, {
      name: "Infinity Challenges",
      // This one could use some work!
      info: () => `
Infinity Challenges are like regular challenges, but they have higher end goals
and are generally harder than regular challenges (but have a different kind of reward).
<br>
<br>
They unlock at set amounts of antimatter - the ones unlocking later are (generally) more difficult.
`,
      isUnlocked: () => Autobuyer.bigCrunch.hasMaxedInterval || PlayerProgress.eternityUnlocked,
      tags: ["rewards", "break", "ic", "midgame"],
      tab: "challenges/infinity"
    }, {
      name: "Replicanti",
      info: () => `
Each replicanti has an upgradable chance to update every replicanti tick.
You will gain a bonus to infinity dimensions based on much replicanti you have.
<br>
<br>
When replicanti reach infinity, you can buy a galaxy.
This will not increase the cost of normal galaxies.
The amount of replicanti galaxies you can have is capped (upgradable).
Once you reach infinity replicanti, they will not continue growing.
<br>
<br>
When offline, in an inactive tab, lagging, or a tickspeed under 50ms,
replicanti get calculated with an approximation. This can cause wildly varying results,
especially at extremely low numbers (1-5).
<br>
<br>
When at low values (100-1000) (when none of the conditions above are true),
there may be some minor variances in the expected amount of replicanti gain.
<br>
<br>
<b>Hotkey: R</b> will buy a Replicanti Galaxy.
<b>Formulas:
<br>
Infinity Dimension power increase:</b> log2(replicanti)<sup>2</sup>,
plus replicanti<sup>0.032</sup> if you have the relevant time study, times 5<sup>galaxies</sup>
if you have that time study.
<br>
<br>
<b>Chance upgrade cost:</b>x(1e15) per upgrade
<br>
<b>Speed upgrade cost:</b>x(1e10) per upgrade
<br>
<b>Galaxy upgrade cost:</b>1e(170+n×25+n<sup>2</sup>×5)
`,
      isUnlocked: () => Replicanti.areUnlocked || PlayerProgress.eternityUnlocked,
      tags: ["interval", "chance", "infinity", "galaxy", "midgame"],
      tab: "infinity/replicanti"
    }, {
      name: "Eternity",
      info: () => `
Upon reaching infinity Infinity Points, you can eternity.
Eternities will reset everything before this point except challenge times, achievements,
and total antimatter. You also unlock a new tab.
<br>
<br>
You can pass infinity Infinity Points whenever.
You will recieve more Eternity Points the nore Infinity Points you had before going Eternal.
<br>
<br>
<b>EP gain formula:</b> floor(5<sup>floor(log10(IP))/308-0.7</sup>)×bonuses.
The x10 EP time study gives the bonus before the outer floor.
<b>Hotkey: E</b> will Eternity.
`,
      isUnlocked: () => PlayerProgress.eternityUnlocked,
      tags: ["eternal", "ep", "reset", "prestige", "midgame"],
      tab: "eternity/upgrades"
    }, {
      name: "Eternity Milestones",
      info: () => `
To make eternities faster and more convenient,
you will unlock various buffs as you get more eternities.
These buffs are either making you start with something on eternity or unlock an autobuyer.
<br>
<br>
For the buffs at the the start of an eternity,
you will keep the relevant statistic on the run you unlock the milestone.
<br>
eg: On 1 > 2, you will keep your autobuyers.
<br>
<br>
The last milestone is at 100 eternities and allows full automation.
`,
      isUnlocked: () => PlayerProgress.eternityUnlocked,
      tags: ["eternities", "rewards", "automation", "midgame"],
      tab: "eternity/milestones"
    }, {
      name: "Time Dimensions",
      info: () => `
After your first eternity, you unlock Time Dimensions.
You buy them with EP and they provide time shards, which give free tickspeed upgrades
(which don't increase the price).
These free tickspeed upgrades stay on infinity
(applying retroactively to your tickspeed mult through more galaxies).
<br>
<br>
Similarly to the other dimensions, a Time Dimension 2 produces a Time Dimension 1 and so on.
<br>
Each tick threshold takes 33% more time shards than the previous (25% with the relevant time study).
`,
      isUnlocked: () => PlayerProgress.eternityUnlocked,
      tags: ["dims", "td", "shards", "eternity", "midgame"],
      tab: "dimensions/time"
    }, {
      name: "Time Studies",
      info: () => `
A Time Study is a powerful post-eternity upgrade, which costs Time Theorems.
Time Studies are laid out in a tree-like fashion, where you must buy preresiquites before continuing.
There are sometimes choices to make with which Time Study to buy,
as you cannot get all of them even if affordable.
<br>
<br>
Time Theorems are a limited resource which costs more for each one you buy.
They can be bought with antimatter, infinity points, or eternity points.
<br>
<br>
You are able to hold down shift and then click on a time study to buy all studies until that point.
<br>
<br>
<b>Respecs:</b> A Respec allows you to reset the upgrades you have in the tree to retreive the
Time Theorems spent on them. It can be done for free on eternity.
<br>
<br>
<b>Costs:</b>
<br>
<b>Antimatter:</b> 1e20000<sup>times bought + 1</sup>
<br>
<b>Infinity Points:</b> 1e100<sup>times bought</sup>
<br>
<b>Eternity Points:</b> 2<sup>times bought</sup>
`,
      isUnlocked: () => PlayerProgress.eternityUnlocked,
      tags: ["eternity", "ts", "theorems", "tree", "study", "midgame"],
      tab: "eternity/studies"
    }, {
      name: "Eternity Challenges",
      info: () => `
Eternity Challenges are another set of challenges which are unlocked by the Time Study tree.
They require a certain amount of Time Theorems to enter, plus a secondary requirement.
<br>
<br>
You can only complete each Eternity Challenge five times, and each completion the goal increases
and the rewards grow stronger.
<br>
<br>
You do not need to have the Eternity Challenge's study unlocked for the reward to take effect.
<br>
<br>
There are a total of twelve Eternity Challenges,
and each one introduces different challenges which might requirre you to change your tactics.
<br>
The goals are in Infinity Points.
`,
      isUnlocked: () => PlayerProgress.eternityUnlocked,
      tags: ["ec", "study", "time", "rewards", "completions", "midgame"],
      tab: "challenges/eternity"
    }, {
      name: "Time Dilation",
      // This could use a rewrite the sentence structure and grammer is kind rough
      info: () => `
Time dilation is unlocked when you purchase the 5,000 TT time study after
beating both EC11 and EC12 five times, and after acquiring a total of 13,000 TT.
Dilating time will start a new eternity, which causes all of your Normal/Infinity/Time
Dimension multipliers’ exponents and the tickspeed multipliers’ exponent will be reduced to ^0.75.
<br>
<br>
If you can reach 1.79e308 IP and eternity within a dilated eternity,
you are rewarded with Tachyon Particles upon the dilated eternity.
You can dilate as many times as you want.
<br>
<br>
Tachyon Particles generate another currency, Dilated Time.
Dilated Time is translated into free galaxies by reaching a certain threshold.
These galaxies are permanent except when you buy a certain Dilation Upgrade.
<br>
<br>
Dilation Upgrades are upgrades that are purchasable with Dilated Time.
Some upgrades improve the amount of Dilated Time you gain or reset your
free galaxies but decrease the threshold required to get to them.
In addition, there is also a TT generator as one of the Dilation upgrades.
The first row of dilation upgrades can be purchased any number of times,
but the rest cannot.
`,
      isUnlocked: () => DilationTimeStudyState.studies[1].isBought || PlayerProgress.realityUnlocked,
      tags: ["dial", "dt", "dilated", "tachyon", "particle", "study", "free", "galaxy", "midgame"],
      tab: "eternity/dilation"
    }, {
      name: "Reality",
      info: () => `
Reality is unlocked when you reach 5 billion time theorems and 1e4000 EP.
Unlocking it opens a new tab.
Under this new tab, you can find the button to make a new Reality.
You can either click it immediatly after unlocking it,
or wait to obtain a higher glyph level and more Reality Machines.
<br>
<br>
Starting a new Reality gives you a new currency known as Reality Machines, a glyph, and a perk point.
Reality Machines can be spent on different upgrades throughout the Reality tab,
such as Reality Upgrades, Black Hole boosts and many other feature that will be unlocked later.
A glyph is an equippable item that can have multiple types.
Each type has four effects. Glyphs can have any number of these effects based on its level and rarity.
A perk point is a currency that can be spent in the Perks subtab on different Perks.
<br>
<br>
<b>Formulas:</b>
<br>
<b>Glyph level:</b> your 3 or 4 factors (ep/replicanti/dt/eternities) + perks × perk shop / instability.
(Instability: Let's say T = 1000 and K = 500. X is base glyph level.
E (a scaled value of the overflow) = (X - T) / K. Y (final glyph level output) = T + K/2 × (sqrt(1+4E) - 1)).
<br>
<b>Reality Machines gained:</b> 1000<sup>log10(EP)/4000 - 1</sup>.
`,
      isUnlocked: () => PlayerProgress.realityUnlocked,
      tags: ["rm", "machines", "glyph", "perk", "reset", "prestige", "endgame", "lategame"],
      tab: "reality/upgrades"
    }, {
      name: "Glyphs",
      info: () => `
A glyph is an equippable item that can have multiple types.
Each type has four effects.
<br>
<br>
To equip the Glyph, drag a Glyph icon from your Glyph "inventory" into
one of the circles in the middle of the screen.
This should apply the glyph. If you look to the right of the glyph menu,
you should see the glyph effects that are applied.
<br>
The five basic Glyph types are as follows: <font color="#22aa48">Power</font>,
<font color="#b67f33">Infinity</font>, <font color="#03a9f4">Replication</font>,
<font color="#b241e3">Time</font>, and <font color="#64dd17">Dilation</font>.
<br>
<br>
The eight rarities are as follows:
<font color="white",
span style="text-shadow: black -1px 1px 1px,
black 1px 1px 1px, black -1px -1px 1px,
black 1px -1px 1px, rgb(255, 255, 255) 0 0 3px;">Common</font>,
<font color="#43a047">Uncommon</font>,
<font color="#2196f3">Rare</font>,
<font color="#9c27b0">Epic</font>,
<font color="#ff9800">Legendary</font>,
<font color="#d50000">Mythical</font>,
<font color="#03ffec">Trancendent</font>, and
<font color="#5151ec">Celestial.</font>
<br>
<br>
Each glyph can have up to 4 effects at once.
You can find the full glyph effect list and their corresponding type
<a href="https://pastebin.com/raw/TyQbs4vX">here</a>
<br>
<br>
When you reach 1,500 RM, have a total of 30 glyphs, and have bought the Reality upgrade,
you unlock "Glyph Sacrificing".
You can now sacrifice power and time glyphs for boosts to parts of the game corresponding to that glyph type.
At ${format(100000)} RM, you unlock the ability to sacrifice all glyph types.
<br>
To sacrifice a glyph, simply shift+click on top of a glyph.
This should create a pop-up that confirms if you want to sacrifice it.
To speed up the sacrificing process, ctrl+shift+click to skip the confirmation.
`,
      isUnlocked: () => PlayerProgress.realityUnlocked,
      tags: ["reality", "sacrifice", "level", "endgame", "lategame"],
      tab: "reality/glyphs"
    }, {
      name: "Perks",
      info: () => `
Perks are a type of upgrade unlocked upon Reality.
Each perk effect varies, but most are QoL (quality of life) improvements.
All perks only require 1 perk point to buy.
<br>
<br>
Each Reality you gain 1 perk point which can be spent on a upgrade on the tree,
starting with "You can now choose from 3 glyphs on reality".
<br>
<br>
The perk tree works like a skill tree, as in it requires the previous perk to buy the next.
<br>
Once you complete the perk tree, you are awarded an achievement.
`,
      isUnlocked: () => PlayerProgress.realityUnlocked,
      tags: ["pp", "reality", "tree", "endgame", "lategame"],
      tab: "reality/perks"
    }, {
      name: "Automator",
      info: () => `
The Automator is unlocked upon reaching 5 Realities and grants you an achievement.
It is like a scripting language inside the game that allows you to nearly automate the entire game.
<br>
A good place to start when beginning to use the automator is by reading the documents on the side.
They begin to help you understand what each command does.
<br>
<br>
You can use as many rows as you need, and the only thing limiting you is whether
you have certain features (like the Black Hole and Stored Time) to be able to use those commands.
<br>
The Automator automatically saves scripts your scripts in the dropdown,
and you are able to create new scripts by clicking on the dropdown,
and then create new. To rename a script, click the pencil next to the dropdown.
<br>
To use the Automator, click the play button.
To pause the automator at the current command, press pause.
To stop the Automator completely, click stop. To go all the way back to the beginning of your script,
click back. If you wish to repeat your script over and over,
use the repeat button. If you want a larger workspace, you can press the
button in the top right corner of the Automator to expand it to fullscreen.
`,
      isUnlocked: () => PlayerProgress.realityUnlocked,
      tags: ["automation", "reality", "code", "script", "endgame", "lategame"],
      tab: "reality/automator"
    }, {
      name: "Black Hole",
      info: () => `
The Black Hole is a time multiplying feature in-game.
It is unlocked by buying it for 50 Reality Machines.
<br>
<br>
You can buy upgrades for the Black Hole by using Reality Machines.
There are three upgrades for the Black Hole: Cooldown, Intensity, and Duration.
<br>
<br>
Once you reach 2 years of playtime (that two years is affected by the Black Hole),
you unlock a Reality Upgrade that allows you to have two Black Holes.
<br>
<br>
The second Black Hole takes time active from your 1st Black Hole to decrease Cooldown
(i.e. if the 1st Black Hole was active for 30 seconds, it would take
30 seconds away from the waiting time until activation of the second Black Hole.)
When your Black Hole reaches a 0.1 second interval, that Black Hole becomes permanent.
<br>
<b>Hotkey: B</b> turns the Black Hole on and off.
`,
      isUnlocked: () => BlackHole(1).isUnlocked,
      tags: ["reality", "time", "speed", "duration", "interval", "rm", "endgame", "lategame"],
      tab: "reality/hole"
    }, {
      name: "Celestials",
      info: () => `
Once you get all of the Reality Upgrades, the first Celestial is unlocked.
This opens up a new tab to the right of Reality.
<br>
<br>
Each Celestial has unique mechanics and upgrades,
and you need to defeat all seven.
To defeat a Celestial, you must enter into that Celestial's Reality, and complete it.
<br>
<br>
All Celestials offer new gameplay mechanics to shift the meta of the game.
It is always a good idea to try some new strategies after completing a Celestial,
because often times what's best before a Celestial won't be the best after the Celestial>
Due to the buffs granted by the Celestial, so pay close attention to those.
`,
      isUnlocked: () => RealityUpgrades.allBought,
      tags: ["reality", "challenges", "endgame", "lategame"],
      tab: ""
    }, {
      name: "Teresa, Celestial of Reality",
      alias: "Teresa",
      info: () => `
Teresa is the first Celestial. It is unlocked by obtaining all of the Reality Upgrades.
<br>
On the main screen, you see a bar with a button above it that says "Pour RM".
This allows you to put your RM into the container for a Reality Machine multiplier.
The container loses RM over time, which means that the RM multiplier decreases over time.
When you reach 1e14 RM inside of the container, you permanately unlock Teresa's Reality.
In game, it is described as the following:
<br>
<div style="text-align: center">
<i>"Start Teresa's Reality. Glyph TT generation is disabled and you gain less IP and EP (x<sup>0.6</sup>).
The more antimatter you reach, the better the reward."</i>
</div>
When you complete Teresa's reality, your glyph sacrifice isw multiplied based on the amount of
antimatter gained during the run. [(log10(antimatter)/${format(1.5e8)})<sup>12</sup>]
<br>
<br>
At ${format(1e18)} RM, you unlock Teresa's Eternity Point generator.
This works like Time Study 181, in the sense that you gain 1% of your peaked EP/Min per second.
<br>
Once you are at ${format(1e21)} RM in the container, you unlock Effarig, the second Celestial.
<br>
Teresa's final unlock is at ${format(1e24)} RM, at which point you unlock the Perk Shop,
where you can spend spare Perk points on upgrades to glyph level, rm multipliers and Dilation Autobuyer Bulk buy.
`,
      isUnlocked: () => RealityUpgrades.allBought,
      tags: ["rm", "endgame", "lategame", "perks", "sacrifice", "boo", "ghost"],
      tab: "celestials/teresa"
    }, {
      name: "Effarig, Celestial of Ancient Relics",
      alias: "Effarig",
      info: () => `
Effarig is the second Celestial you encounter.
It is unlocked by pouring atleast ${format(1e21)} RM into Teresa's container.
<br>
Effarig introduces a currency called Relic Shards,
which are obtained by using different kinds of glyph effects during a reality;
the more EP you get and the more different types of glyphs you use the more Relic Shards earned from said reality.
Relic Shards are the currency for Effarig unlocks.
<br>
<br>
You can buy the first unlock; Glyph level Adjustment, at ${format(1e7)} Relic Shards.
This allows you to set weights for each resource(EP, DT, replicanti, eternities),
in how much they effect the level of glyphs gained on reality.
<br>
<br>
Next, with ${format(2e8)} RS(Relic Shards), you unlock, Automatic Glyph Sacrifice.
This does exactly what you'd expect it to; automatically sacrifices your glyphs.
Auto glyph sacrifice comes with many options which can be found the glyph tab once unlocked.
Options such as sacrificing all glyphs gain, filtering glyphs by a rarity threshold,
or even filtering by specific effects
<br>
<br>
At ${format(3e9)} RS, as third unlock, Automatic Glyph Picking, is unlocked.
This allows to control which glyph is picked from your selection of 3-4 glyphs on reality.
Up until now this had been done randomly. There are two options:
either it picks the highest rarity glyph,
or it picks the glyph which best matches your automatic glyph sacrifice filters.
<br>
<br>
Effarig's final unlock is of its own Reality at ${format(5e11)} RS.
Its Reality is divided into three sections: Infinity, Eternity, and Reality.
Its Reality's description in game is:
<br>
<div style="text-align: center">
<i>"Start Effarig's Reality; all production, gamespeed, and tickspeed are severely lowered,
infinity power reduces the production and gamespeed penalties and time shards reduce the tickspeed penalty.
Glyph levels are temporarily capped."</i>
</div>
Each tier of his reality has different rewards. Some are to help during its Reality,
yet there are many that also aid general progression.
The main rewards are for completing Effarig's Eternity and Reality.
<br>
Effarig's Eternity unlocks the next Celestial, The Enslaved Ones.
It also allows Eternities to generate Infinities, and disables the Infinity Point multiplier cap in its Reality.
<br>
Completing Effarig's Reality unlocks a new glyph type: <font color="#e21717">Effarig</font> Glyphs.
<br>
Effarig Glyphs have 7 different possible effects.
A list of these can be found <a href="https://pastebin.com/992cYUY3">here.</a>
<br>
You can only have one Effarig glyph equipped at a time.
`,
      isUnlocked: () => Teresa.has(TERESA_UNLOCKS.EFFARIG),
      tags: ["glyph", "sacrifice", "shards", "reality", "spectralflame", "lategame", "endgame"],
      tab: "celestials/effarig"
    }, {
      name: "The Enslaved Ones, Celestial of Time",
      alias: "Enslaved Ones",
      info: () => `
The Enslaved Ones are the third Celestial, unlocked by completing Effarig's Eternity.
<br>
The interface for The Enslaved Ones has a few buttons on it.
The top left button should say <i>"0.000 seconds"</i>, and then <i>"Store Black Hole time"</i>.
This button allows you to store the speed multiplier of your black holes as time.
The button directly below it allows you instantly spend all the accumulated time.
<br>
<br>
On the right hand side, there are two more buttons. The top button isn't actually a button,
instead it is used to display info about the amount of <i><b>REAL</b></i> time you have stored,
the real time does not account for any Black Hole time multipliers.
The button below is the real time storage settings.
By default, it states: "Offline time used for production".
This button can be toggled to second setting: "Offline time stored".
This toggle allows you to switch between storing your offline time at a 33% effeciency by default,
or using offline time as it had been used previously(to calculate offline production).
<br>
To use stored real time, you must go to the Glyphs tab and find the button that says
<i>"Amplify using stored real time"</i>. When pressed, the button will change to a yellow color.
Now, upon your next Reality, you will gain the benefit as if you had completed the amount
of realities indicated by the multiplier listed on the yellow button.
<br>
<br>
The Enslaved Ones unlocks required having several years of stored time saved up.
<br>
Their first unlock cost, ${format(1e35)} years;
this upgrade increases the free tickspeed softcap by 100,000 upgrades.
<br>
At ${format(1e40)} years, you are able to finally unlock its Reality, which is described as:
<br>
<div style="text-align: center">
<i>"Start Enslaved Ones Reality. ID, TD, and 8th dimension purchases are limited to 1 each,
Normal dimension multipliers are always dilated (the glyph effect still only applies in actual dilation),
Time Study 192 is locked, the Black Holes are disabled, Tachyon production and
Dilated Time production are severely reduced, Time Theorem generation from dilation Glyphs is much slower,
certain challenge goals have been increased, and Stored Time is much less effective."</i>
</div>
Enslaved's reality is much like a puzzle, however there are many hints
sprinkled throughout to help you complete it.
<br>
The reward for completing The Enslaved Ones:
"Infinity Dimension purchase caps are increased by 1000 for every 1000 free Tickspeed upgrades."
`,
      isUnlocked: () => EffarigUnlock.eternity.isUnlocked,
      tags: ["reality", "time", "blackhole", "lategame", "endgame", "testers",
        "ikerstream", "realrapidjazz", "saturnus", "earth", "garnet", "pichusuperlover"],
      tab: "celestials/enslaved"
    }, {
      name: "V, Celestial of Achievements",
      alias: "V",
      // Proofread up until unlock condition
      info: () => `
V is a special Celestial in the sense that it is not unlocked by another Celestial,
but by instead by completing an achievement.
She is unlocked by completing achievement r151 (row 15, column 1, "You really didn't need it anyway")
which requires you to get 800 Antimatter Galaxies without buying 8th Dimensions in your current infinity.
<br>
After being unlocked, you are met with another set of requirements to fully unlock V.
You are required to reach ${format(1e4)} Realities, ${format(1e70)} Eternities, ${format(1e160)} Infinities,
${format(1e320)} Dilated Time, and ${format(new Decimal("1e320000"))} Replicanti, all in the same run.
<br>
<br>
When you meet those requirements, you are now in the V interface.
On the screen, you should see six white hexagons surrounding one orange hexagon.
The six white hexagons represent what are known as "V-achievements",
which are unlocked by reaching their requirements inside of V's Reality.
The orange hexagon in the middle is the button to enter into the Reality,
which contains the nerfs to V's reality, which are as follows:
<br>
<div style="text-align: center">
<i>"Start V's Reality. All dimension multipliers, EP gain, IP gain,
and dilated time gain per second are square-rooted, and Replicanti interval is squared."</i>
</div>
When you reach the requirements for a V-Achievement in her Reality, you are awarded with that achievement.
V-achievements go to two different things: unlocking rewards and being able to add more studies to your tree.
<br>
V has three rewards unlockable with the V-Achievements.
The first one requires you to have ten V-Achievements,
and increases the speed of the Auto-EC perk by your Achievement multiplier.
<br>
The second unlockable needs thirty V-Achievements to unlock,
and it multiplies black hole power by your achievement count.
It also unlocks Ra, the next Celestial.
<br>
The final unlockable takes all thirty-six V-Achievements to unlock,
and doubles the amount of locked studies you can buy.
<br>
One of V's passive unlocks is the ability to buy studies that you are not normally able to buy.
This requires six (three with the final unlock) V-Achievements to be completed to buy one locked study.
`,
      isUnlocked: () => Achievement(151).isEnabled,
      tags: ["reality", "lategame", "endgame", "girlfriend", "challenges"],
      tab: "celestials/v"
    }, {
      name: "Ra, Celestial of the Forgotten",
      alias: "Ra",
      info: () => `
<h1>Work in Progress</h1>
`,
      isUnlocked: () => V.has(V_UNLOCKS.RUN_UNLOCK_THRESHOLDS[1]),
      tags: ["reality", "memories", "razenpok", "levels", "glyphs", "lategame", "endgame",
        "effarig", "teresa", "enslaved", "v"],
      tab: "celestials/ra"
    }, {
      name: "Lai'tela, Celestial of Matter",
      alias: "Lai'tela",
      info: () => `
<h1>Work in Progress</h1>
`,
      isUnlocked: () => Ra.has(RA_LAITELA_UNLOCK),
      tags: ["omsi", "reality", "matter", "dimensions", "lategame", "endgame"],
      tab: "celestials/laitela"
    }, {
      name: "Pelle, Celestial of Antimatter",
      alias: "Pelle",
      info: () => `
<h1>Work in Progress</h1>
`,
      isUnlocked: () => Laitela.has(LAITELA_UNLOCKS.PELLE),
      tags: ["reality", "antimatter", "lategame", "endgame", "final", "hevipelle"],
      tab: "celestials/pelle"
    }
  ]
};

(function() {
  for (let i = 0; i < GameDatabase.h2p.tabs.length; i++) {
    const tab = GameDatabase.h2p.tabs[i];
    tab.id = i;
    if (tab.alias === undefined) tab.alias = tab.name;
  }

  const searchIndex = {};

  const addTerm = (term, tab) => {
    let entry = searchIndex[term];
    if (entry === undefined) {
      entry = [];
      searchIndex[term] = entry;
    }
    if (entry.includes(tab)) return;
    entry.push(tab);
  };

  const addWord = (word, tab) => {
    const lowerCase = word.toLowerCase();
    for (let i = 0; i < lowerCase.length; i++) {
      addTerm(lowerCase.slice(0, i + 1), tab);
    }
  };

  const addPhrase = (phrase, tab) => {
    for (const part of phrase.split(" ")) {
      addWord(part, tab);
    }
  };

  for (const tab of GameDatabase.h2p.tabs) {
    addPhrase(tab.name, tab);
    for (const tag of tab.tags) {
      addPhrase(tag, tab);
    }
    addPhrase(tab.alias, tab);
  }

  GameDatabase.h2p.search = query => {
    if (query === "") return GameDatabase.h2p.tabs;
    const searchWords = query.toLowerCase().split(" ").filter(str => str !== "");
    const result = new Set();
    for (const searchWord of searchWords) {
      const matches = searchIndex[searchWord];
      if (matches === undefined) continue;
      for (const match of matches) {
        result.add(match);
      }
    }
    return Array.from(result);
  };
}());
