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
      name: "Your savefile",
      info: () => `
Your game's save data is stored on your computer's browser data, which means that clearing your browser's cache and
cookies will also delete your save file. Similarly, if you are playing in a private or incognito window, your save
will not be there the next time you open up your browser. The saves are browser-specific as well, so for example
if you play the game on Chrome, you won't find your save on Firefox.
<br>
<br>
You can transfer your save between places by using the export function, which will copy a <i>very</i> long string of
random-looking characters into your clipboard. That text contains your save data, which you can load back into the
game by pasting it into the text box on the import prompt. You need the entirety of the save text for importing to
work properly, or else the game might not recognize the text as a valid save. Keep in mind that certain messaging
applications may cut off part of the text if you are using one to transfer the save between devices.
In addition to importing and exporting to your clipboard, you can also import and export from text files as well.
<br>
<br>
You can use the "Choose save" button to pick between three separate saves on your browser. These saves are, for most
intents and purposes, completely separate from each other. Importing and exporting will only affect the current save
slot. The only exception is clearing your broswer data, in which case all three saves will be reset.
<br>
<br>
The game automatically saves periodically, by default once every ${formatInt(30)} seconds, and it will notify you in
the top-right corner of the screen whenever it saves. Keep this in mind if you need to close the game - anything you
do right before closing it might not be saved unless you wait for the autosave interval or manually save again. The
length of the autosave interval is adjustable.
<br>
<br>
You can completely reset your save at any point if desired by clicking the button, which brings up a prompt you need
to fill out in order to make sure you intentionally wanted to reset. Going through with this reset will only clear
your current save; the other save slots will be unaffected. <b>Resetting your game in this way is completely
irreversible and gives you no permanent benefits, secret or otherwise.</b>
`,
      isUnlocked: () => true,
      tags: ["choose", "save", "import", "export", "reset"],
      tab: "options/saving"
    },
    {
      name: "Customization",
      info: () => `
The game has two different UI layouts - the "old" UI maintains the style of Antimatter Dimensions from before the
Reality update, while the "new" UI is a redesign based on more modern dark theme styles. Additionally, there are
various themes which can be applied to modify the appearance of everything in the game. There are a few secret
themes which can be unlocked through various means. Both UI layouts support all the different possible themes.
<br>
<br>
The notation used to display numbers in the game defaults to Mixed Scientific, but can be changed to one of numerous
options in the drop-down menu. Many of these notations are intended as jokes and in some cases will format numbers
in a way that causes text to spill over into other parts of the screen - this is not a bug. "Exponent formatting" is
a setting affecting some notations which lets you toggle between showing the number in an exponent itself (with commas
every three digits) or also applying the notation formatting to the exponent. Note that notation formatting is forced
when exponents are larger than ${format(1e9)}.
<br>
<br>
Many events in the game trigger full-screen animations or pop-up modals which require you to confirm that you want to
continue. All of these animations and confirmations can be disabled on an individual basis through the options,
although the ability to disable any given animation or confirmation will only appear after then have already shown up
at least once.
`,
      isUnlocked: () => true,
      tags: ["UI", "update", "news", "theme", "notation", "comma", "exponent", "animation", "retry", "confirmation",
        "offline", "hotkey"],
      tab: "options/visual"
    },
    {
      name: "Offline Progress",
      info: () => `
Antimatter Dimensions has a catch-up mechanic which attempts to simulate the game's behavior if the game is closed for
an extended period of time. The simulation behavior is only somewhat accurate, as the game is too mathematically
complicated to be run at full accuracy in a reasonable amount of time. At the end of the simulation, the game will
summarize how various relevant resources have changed while you were gone.
<br>
<br>
The game runs on a system where everything is updated once per tick - all dimensions and resources do one unit of
production, all autobuyers trigger once, all multipliers and values are changed accordingly, and all the displayed
numbers are updated. There are normally ${formatInt(20)} ticks per second when the game is running, although lag and
internal javascript behavior may cause tick length to vary by a few milliseconds.
<br>
<br>
When offline simulation is active, these ticks have an adjusted length in order to fill the amount of time you were
away - for example having a setting for ${formatInt(1000)} offline ticks and closing the game for an hour will result in
ticks which are ${format(3.6, 1, 1)} seconds long each. For most things in the game, this is not an issue because this
will still result in approximately the same amount of resources after the simulation completes. A notable exception is
autobuyers - in this situation autobuyers will effectively only trigger once every ${format(3.6, 1, 1)} seconds, which
may have a strong impact depending on the part of the game.
<br>
<br>
Offline tick count can be adjusted between ${formatInt(100)} and ${formatInt(10000)} ticks. Smaller counts will result
in faster but less accurate simulations, while larger counts will result in more accurate simulations which take longer
to complete.
<br>
<br>
Offline progress can be disabled entirely if desired, for example for diagnostic or timing purposes, or in order
to do an "online only" playthrough of the game. Otherwise, offline progress is on by default from the very beginning
of the game. Note that if offline progress is disabled, the statistic for total time played will also be paused while
the game closed.
`,
      isUnlocked: () => true,
      tags: ["offline", "away", "progress"],
      tab: "options/gameplay"
    },
    {
      name: "Dimensions",
      info: () => `
Dimensions are your production units in game. The first Dimension produces your antimatter.
Each consecutive Dimension produces the previous one, allowing you to have steady growth.
There are eight Dimensions total.
<br>
<br>
<b>Dimension Multiplier:</b> Beside the Dimension there is a multiplier (example: First Dimension ${formatX(1, 1, 1)}).
The base production of each Dimension is multiplied by this number.
This multiplier increases by ${formatX(2)} for every ${formatInt(10)} of that Dimension purchased.
Each time this occurs, the price of the dimension will increase.
<br>
<br>
<b>Accumulated Dimension Quantity:</b> The next column is your current amount of that Dimension you own.
This is a combination of how many you have purchased with antimatter,
as well as produced from the higher Dimension.
<br>
<br>
<b>Purchased Dimensions Quantity:</b> Next to each accumulated quantity of owned Dimensions,
the amount of that Dimension purchased toward the next multiplier upgrade is displayed in brackets.
For example if you have (${formatInt(4)}) next to your accumulated dimension quantity,
you will need ${formatInt(6)} more of that dimension for the next multiplier increase.
<br>
<br>
<b>Dimension Growth Percent:</b> This number represents the amount of growth that each
Dimension experiences per second. ${formatPercents(1)} means the dimension is doubling each second.
This allows you to judge overall growth.
<br>
<br>
<b>Cost &amp; until ${formatInt(10)}:</b>
You can buy a single quantity of each Dimension with antimatter when the cost button is highlighted.
Alternatively, if the Until ${formatInt(10)} button is highlighted,
you can buy whatever quantity gets you to that Dimension's next Dimension multiplier.
<br>
<br>
<b>Max all:</b> Max all will buy until ${formatInt(10)} of the first Antimatter Dimension until it can't anymore,
then second, and so on until the 8th Antimatter Dimension, and then buy max Tickspeed upgrades.
<br>
<br>
<b>Dimension base prices:</b> ${Array.range(1, 8)
    .map(tier => format(AntimatterDimension(tier)._baseCost, 2, 2))
    .join(", ")}
<br>
<b>Base per ${formatInt(10)} bought dimension price increases:</b> ${Array.range(1, 8)
  .map(tier => format(AntimatterDimension(tier)._baseCostMultiplier, 2, 2))
  .join(", ")}
<br>
<br>
<b>Hotkeys: 1, 2, 3, 4, 5, 6, 7, 8</b> for buy until ${formatInt(10)} Xth Dimension
(you can also hold down shift while buying Dimensions, which will only buy
${formatInt(1)} instead of ${formatInt(10)}), <b>M</b> for Max all
`,
      isUnlocked: () => true,
      tags: ["dims", "normal", "antimatter", "ad"],
      tab: "dimensions/antimatter"
    }, {
      name: "Tickspeed",
      info: () => `
Production in the game happens on each “tick" which initially occurs once per second. By buying Tickspeed upgrades,
you can make your Dimensions produce faster, as if multiple ticks occur in each second.
<br>
<br>
<b>Tickspeed:</b> This states how many game ticks are occurring every second. Fractional ticks are accounted for,
boosting production as if part of a game tick has passed.
<br>
<br>
<b>Cost:</b> The cost of antimatter for multiplying ticks/sec by the displayed multiplier.
(without any Galaxies, this is ${formatX(1.1245, 0, 3)} per purchase)
<br>
<br>
<b>Buy Max:</b> This will buy the maximum amount of Tickspeed upgrades available
with your current amount of antimatter.
<br>
<br>
<b>Hotkeys: T</b> will purchase as many Tickspeed upgrades as possible, or <b>Shift+T</b> to buy a single upgrade.
Note that the actual Tickspeed time is simulated and the game always runs calculations at the update rate you've chosen
in the Options tab.
`,
      isUnlocked: () => Tickspeed.isUnlocked,
      tags: ["dimension", "earlygame", "time"],
      tab: "dimensions/antimatter"
    }, {
      name: "Dimension Boost",
      info: () => `
<b>Dimension Boost:</b> This resets all of your Dimensions and your Antimatter, but unlocks another Dimension for
you to purchase and boosts your Dimension multipliers. The 1st Dimension Boost requires ${formatInt(20)} 4th
Dimensions, the 2nd requires ${formatInt(20)} 5th Dimensions, etc. After unlocking all ${formatInt(8)} Dimensions,
every additional boost will cost ${formatInt(15)} more 8th Dimensions than the previous Boost and will no longer
unlock a Dimension, but will continue to increase your Dimension multipliers.
<br>
<br>
You gain a ${formatX(2)} multiplier to the 1st Dimension for every Dimension Boost you have. Each higher
Dimension will have the multiplier applied one less time as the previous, down to a minimum of ${formatInt(0)}.
For example, with ${formatInt(3)} Boosts, the 1st Dimension will gain ${formatX(8)}, the 2nd Dimension ${formatX(4)},
the 3rd Dimension ${formatX(2)}, and all other Dimensions are unaffected.
<br>
<br>
<b>Hotkey: D</b>
`,
      isUnlocked: () => true,
      tags: ["dimboost", "reset", "earlygame"],
      tab: "dimensions/antimatter"
    }, {
      name: "Antimatter Galaxies",
      info: () => `
Purchasing an Antimatter Galaxy will reset your game back to the point where only ${formatInt(4)} Dimensions are
available, but will increase the effect of your Tickspeed upgrades by +${format(0.02, 0, 2)} for your first two
galaxies. As you get more galaxies, the multiplier will continue becoming stronger and stronger.
<br>
<br>
Though it will have very little impact for the first few purchases,
the increase is multiplicative and won’t take long to be visible.
<br>
<br>
Your first Antimatter Galaxy requires ${formatInt(80)} Eighth dimensions, and each additional Galaxy will cost
another ${formatInt(60)} more.
<br>
Distant Galaxy scaling: Above ${formatInt(100)} Antimatter Galaxies the cost increase between Galaxies will increase by
${formatInt(2)} per Galaxy, making the next Galaxy cost ${formatInt(62)} more, then ${formatInt(64)} more, etc.
<br>
Remote Galaxy scaling: Above ${formatInt(REMOTE_SCALING_START)} Antimatter Galaxies, the <i>total</i> cost
increases by another ${formatPercents(0.002, 1)} per Galaxy, on top of Distant scaling.
<br>
<br>
<b>Hotkey: G</b>
`,
      isUnlocked: () => true,
      tags: ["8th", "reset", "earlygame"],
      tab: "dimensions/antimatter"
    }, {
      name: "Dimensional Sacrifice",
      info: () => `
<b>You unlock Dimensional Sacrifice after your first Dimension Boost.</b>
<br>
<br>
Sacrificing will immediately reset the owned quantity of all non-Eighth Dimensions to zero, without reducing the
multiplier or the current cost. In return, it will multiply the Eighth Dimension Multiplier by the shown value.
It will take time to get back to the production you previously had, but you will end up with a net increase.
<br>
<br>
The Dimensional Sacrifice multiplier scales with the number of First Dimensions you had at the time of sacrifice,
and the scaling can be improved by completing certain Achievements and challenges. The multiplier is kept between
sacrifices, meaning that sacrificing once at ${formatX(10)} and then once at ${formatX(4)} will be the same as
${formatX(8)} then ${formatX(5)}; in both cases you will end up with a total sacrifice multiplier of ${formatX(40)}.
<br>
<br>
<b>Hotkey: S</b>
`,
      isUnlocked: () => Sacrifice.isVisible,
      tags: ["8th", "reset", "earlygame", "gods", "earlygame"],
      tab: "dimensions/antimatter"
    }, {
      name: "Achievements",
      // This one could use some work!
      info: () => `
Each Achievement has conditions that must be met before they are earned.
Some are very simple, and some are significantly trickier.
<br>
<br>
You will recieve a ${formatX(1.03, 2, 2)} multiplier to all Antimatter Dimensions for each completed Achievement, as
well as an additional ${formatX(1.25, 2, 2)} for each fully completed row. In addition, many Achievements have their
own rewards.
`,
      isUnlocked: () => true,
      tags: ["earlygame", "awards", "earlygame"],
      tab: "achievements"
    }, {
      name: "Infinity",
      info: () => `
Once you have too much antimatter for the world to handle (${formatInt(2)}<sup>${formatInt(1024)}</sup>
or about ${formatPostBreak(Number.MAX_VALUE, 6)},
sometimes called "Infinity"), you’ll be forced to do a “Big Crunch”. This will reset your Antimatter, Antimatter
Dimensions, Dimension Boosts, and your Antimatter Galaxies. Doing a Big Crunch is also sometimes referred to as
"Infinitying".
<br>
<br>
You will eventually be able to pass ${formatPostBreak(Number.MAX_VALUE, 6)}, but until then any larger numbers will
display as ${format(Infinity)}.
<br>
<br>
Each Infinity completed will give an Infinity Point, which can be spent on upgrades in the new Infinity tab.
You must purchase these upgrades from top to bottom. You will also gain one "Infinity", which is effectively
the number of times you have crunched.
<br>
<br>
The "Multiply Infinity Points from all sources by ${formatInt(2)}" upgrade can be bought multiple times,
but each purchase requires ${formatInt(10)} times as much IP.
You must buy all ${formatInt(16)} previous Infinity Upgrades to start purchasing this particular upgrade.
<br>
<br>
<b>Hotkey: C</b> Big Crunches.
`,
      isUnlocked: () => PlayerProgress.infinityUnlocked(),
      tags: ["crunch", "big", "upgrades", "ip", "reset", "prestige", "earlygame"],
      tab: "infinity/upgrades"
    }, {
      name: "Challenges",
      info: () => `
Challenges are unlocked after your first Infinity; they change in-game mechanics in different ways to create more
difficult Infinity circumstances. To complete a challenge, you must reach ${formatPostBreak(Number.MAX_VALUE, 2)}
antimatter again.
<br>
<br>
Each completed challenge will award an autobuyer.
You can run them multiple times (though only the first time grants a reward),
and they can be exited at any time via the “Exit Challenge” button on the challenge tab.
<br>
<br>
Your first Infinity is considered to be the first challenge, and is thus automatically completed once
you unlock challenges.
<br>
<br>
The rightmost column of Infinity Upgrades does not work in challenges.
`,
      isUnlocked: () => PlayerProgress.infinityUnlocked(),
      tags: ["infinity", "autobuyer", "earlygame"],
      tab: "challenges/normal"
    }, {
      name: "Autobuyers",
      info: () => `
<b>Autobuyers:</b>
<br>
Autobuyers (awarded by completing challenges) allow the
automatic purchase of Dimensions, Dimension Boosts, Antimatter Galaxies,
Tickspeed upgrades, Big Crunches, and Dimensional Sacrifice (later).
They are located under the Infinity tab in "Autobuyers".
<br>
<br>
<b>Priority:</b> Priorities tell the game which autobuyer will buy
if two are affordable in the same tick. Priority 1 is bought 1st,
Priority 2 is bought 2nd, etc. Two equal priorities will pick their
buying order randomly.
<br>
<br>
<b>Autobuyer Interval:</b> The cooldown period before the autobuyer attempts to make another puchase.
<br>
<br>
<b>Bulk Buy:</b> Once the interval of an autobuyer reaches its minimum (at ${formatInt(100)} ms), all
future upgrades will double the maximum amount the autobuyer can purchase per tick. This can be disabled.
<br>
<br>
<b>Dimension Autobuyer Buy Quantity:</b> Autobuyers for Dimensions can be set to buy a single Dimension,
or until ${formatInt(10)}. Bulk buy is disabled when the autobuyer is set to singles.
<br>
<br>
<b>Tickspeed Autobuyer Buy Quantity:</b> The Tickspeed autobuyer can be set to buy a single upgrade per activation
or to buy the max possible.
available.
<br>
<br>
<b>Automatic Dimboost Customization:</b> With the Dimboost autobuyer you can set the max number of Boosts it will
attempt to buy, a minimum number of Galaxies before Dimboosts are always auto-purchased, and (when unlocked) the
ability to buy an exact number of Dimboosts in bulk. If you reach your specified Galaxy threshold, the autobuyer
will ignore your max Boost limit.
<br>
<br>
<b>Max Galaxies:</b> The highest amount of Galaxies the Galaxies autobuyer will buy.
<br>
<br>
<b>IP on crunch:</b> Once you Break Infinity, you can set how many IP you would like to wait for before crunching.
<br>
<br>
<b>Sacrifice Autobuyer:</b> This autobuyer starts with a maxed interval, potentially triggering every tick.
<br>
<br>
<b>Toggle All Autobuyers:</b> This button will turn all of your autobuyers on or off. This will not change your
individual autobuyer settings.
<br>
<br>
<b>Hotkey: A</b> (for toggle all autobuyers).
`,
      isUnlocked: () => PlayerProgress.infinityUnlocked(),
      tags: ["infinity", "automation", "challenges", "rewards", "interval", "earlygame"],
      tab: "infinity/autobuyers"
    }, {
      name: "Break Infinity",
      info: () => `
Once you Break Infinity, you are no longer limited to ${formatPostBreak(Number.MAX_VALUE, 2)} antimatter and can start
gaining more than ${formatInt(1)} IP per crunch depending on how much more antimatter you have when you crunch.
<br>
<br>
You now gain ~${format(1.78, 2, 2)} IP for crunching at ${formatPostBreak(Number.MAX_VALUE, 2)} antimatter. The IP you
gain for crunching is multiplied by ${formatInt(10)} for every additional factor of
${formatPostBreak(Number.MAX_VALUE, 2)} antimatter you gain (in a continuous manner). This is rounded down to the
nearest integer <i>after</i> all multipliers are applied.
<br>
<br>
The antimatter costs of all Dimensions begin to increase faster after they pass
${formatPostBreak(Number.MAX_VALUE, 2)}. The cost <i>between</i> upgrades will increase by ${formatX(10)}
<i>per upgrade</i> above ${formatPostBreak(Number.MAX_VALUE, 2)}, and a similar scaling happens to
Tickspeed upgrade costs as well.
`,
      isUnlocked: () => Autobuyer.bigCrunch.hasMaxedInterval || PlayerProgress.eternityUnlocked(),
      tags: ["limit", "crunch", "upgrades", "midgame"],
      tab: "infinity/break"
    }, {
      name: "Infinity Dimensions",
      info: () => `
<b>Unlocking Infinity Dimensions:</b> Infinity Dimensions are unlocked by reaching a certain amount of antimatter.
<br>
<br>
<b>Infinity Dimension Purchasing:</b> Infinity Dimensions are only purchasable in sets of ${formatInt(10)}, and cost
Infinity Points. They give a permanent multiplier per purchase, similar to the other dimensions. The actual multiplier
applied depends on which Infinity Dimension you purchase. <!-- Sorry Garnet :/ -->
<br>
<br>
<b>Infinity Dimension Production:</b> Just like Antimatter Dimensions, each Infinity Dimension produces the
next highest Infinity Dimension.
<br>
<br>
Every crunch, your produced Infinity Dimensions are reset to the amount you purchased. While the production
of Infinity Dimensions doesn't carry between crunches, all the multipliers you got from purchasing them do.
<br>
<br>
<b>Infinity Dimension unlock thresholds (antimatter):</b> ${Array.range(1, 8)
    .map(tier => formatPostBreak(InfinityDimension(tier)._unlockRequirement))
    .join(", ")}
<br>
<b>Infinity Dimension purchase multipliers:</b> ${Array.range(1, 8)
    .map(tier => format(InfinityDimension(tier)._powerMultiplier))
    .join(", ")}
<br>
<b>Infinity Dimension base prices (IP):</b> ${Array.range(1, 8)
    .map(tier => format(InfinityDimension(tier)._baseCost))
    .join(", ")}
<br>
<b>Infinity Dimension price increases:</b> ${Array.range(1, 8)
    .map(tier => format(InfinityDimension(tier)._costMultiplier))
    .join(", ")}
<br>
<br>
Instead of antimatter, the First Infinity Dimension produces Infinity Power, which translates to a multiplier applied
to all Antimatter Dimensions. This multiplier is equal to (power<sup>${formatInt(7)}</sup>). Infinity Dimensions are not
affected by Tickspeed upgrades.
`,
      isUnlocked: () => Autobuyer.bigCrunch.hasMaxedInterval || PlayerProgress.eternityUnlocked(),
      tags: ["id", "power", "new", "dims", "unlock", "break", "midgame"],
      tab: "dimensions/infinity"
    }, {
      name: "Infinity Challenges",
      // This one could use some work!
      info: () => `
Infinity Challenges are like Normal Challenges, but they have higher end goals and are generally harder. Instead of
unlocking autobuyers, they give you boosts to your various forms of production in more unique ways. Similarly to
Normal Challenges, the rightmost column of Infinity Upgrades are also disabled within Infinity Challenges.
<br>
<br>
Unlike the Normal Challenges, which are all unlocked at once, Infinity Challenges require you to reach a certain
amount of antimatter before you can attempt them.
<br>
<br>
<b>Infinity Challenge unlock thresholds:</b> ${GameDatabase.challenges.infinity
    .map(ic => formatPostBreak(ic.unlockAM)).join(", ")}
`,
      isUnlocked: () => Autobuyer.bigCrunch.hasMaxedInterval || PlayerProgress.eternityUnlocked(),
      tags: ["rewards", "break", "ic", "midgame"],
      tab: "challenges/infinity"
    }, {
      name: "Replicanti",
      info: () => `
Replicanti are another resource you unlock at ${format(1e140)} IP. Rather
than producing something else, Replicanti actually produces <i>itself</i> up to a maximum of
${formatPostBreak(Number.MAX_VALUE, 2)}. Replicanti are produced at their own pace, unaffected by Tickspeed upgrades.
Each individual Replicanti has a certain chance (initially ${formatPercents(0.01)}) of producing another Replicanti
every Replicanti tick (initially every second), and both of these can be upgraded by spending IP.
<br>
<br>
If you have purchased a Replicanti Galaxy upgrade, then you can get a "free" Replicanti Galaxy in exchange for
resetting your replicanti count back to ${formatInt(1)}. This Galaxy is free in that it will act as if it was an
Antimatter Galaxy, but it will not make your next Antimatter Galaxy more expensive.
<br>
<br>
<b>Hotkey: R</b> will buy a Replicanti Galaxy.
<br>
Replicanti give a multiplier to all Infinity Dimensions, which will reach a maximum of
${formatX(Math.pow(2, 20), 2, 2)} at ${formatPostBreak(Number.MAX_VALUE, 2)} Replicanti.
<br>
<br>
<b>Chance upgrade cost:</b> Base ${format(1e140)} IP, cost increment ${formatX(1e15)} IP
<br>
<b>Speed upgrade cost:</b> Base ${format(1e150)} IP, cost increment ${formatX(1e10)} IP
<br>
<b>Galaxy upgrade cost:</b> Base ${format(1e170)} IP, cost increment ${formatX(1e25)} IP and an additional
${formatX(1e5)} IP per upgrade, scaling similarly to distant Antimatter Galaxies. Above ${formatInt(100)} Replicanti
Galaxies, this ${formatX(1e5)} per upgrade changes to ${formatX(1e55)}. Above ${formatInt(1000)}, the scaling switches
from quadratic to cubic, with the ${formatX(1e55)} multiplier itself increasing by ${formatX(1e5)} per upgrade.
`,
      isUnlocked: () => Replicanti.areUnlocked || PlayerProgress.eternityUnlocked(),
      tags: ["interval", "chance", "infinity", "galaxy", "midgame"],
      tab: "infinity/replicanti"
    }, {
      name: "Eternity",
      info: () => `
Upon reaching ${formatPostBreak(Number.MAX_VALUE, 2)} IP, you can Eternity. Eternities will reset everything before this
point except challenge times, Achievements, and total antimatter. You will be able to access more content after your
first Eternity.
<br>
<br>
You can pass ${formatPostBreak(Number.MAX_VALUE, 2)} IP without anything being forced upon you, unlike the first time
you reached ${formatPostBreak(Number.MAX_VALUE, 2)} antimatter. You will recieve more Eternity Points the more
Infinity Points you had before going Eternal. You will also gain one "Eternity" for completing an Eternity.
<br>
<br>
Eternity Point gain scales similarly to Infinity Point gain, but scaling off of Infinity Points instead of antimatter.
The base amount of EP gained at ${formatPostBreak(Number.MAX_VALUE, 2)} IP is ~${format(1.62, 2, 2)} EP, multiplied by
${formatInt(5)} for every factor of ${formatPostBreak(Number.MAX_VALUE, 2)} more IP you have. This is always rounded
down, which means that you will get ${formatInt(1)} EP at ${formatPostBreak(Number.MAX_VALUE, 2)} IP but will not reach
${formatInt(2)} EP until ${formatPostBreak("1e349")}.
<b>Hotkey: E</b> will Eternity.
`,
      isUnlocked: () => PlayerProgress.eternityUnlocked(),
      tags: ["eternal", "ep", "reset", "prestige", "midgame"],
      tab: "eternity/upgrades"
    }, {
      name: "Eternity Milestones",
      info: () => `
To make Eternities faster and more convenient, you will unlock various buffs as you get more "Eternity". These
buffs will generally let you start with certain upgrades you would otherwise lose after Eternity, give you new
autobuyers for better automation, or give you a way to passively gain resources offline at a reduced rate.
<br>
<br>
Milestones which give you upgrades will automatically purchase and upgrade them to their maximum when first starting
the Eternity, effectively letting you have them permanently.
<br>
<br>
All of the new autobuyers will have toggles next to their respective manual buttons (for example, Infinity Dimension
autobuyers can be found on the Infinity Dimension tab). The exceptions are the improvements to the Dimboost, Galaxy,
and Crunch autobuyers, as well as the new Eternity autobuyer, which will be on the autobuyers page.
<br>
<br>
The passive generation milestones only work offline by design and may need certain autobuyer settings to work
properly, as noted on the milestone page itself.
`,
      isUnlocked: () => PlayerProgress.eternityUnlocked(),
      tags: ["eternities", "rewards", "automation", "midgame"],
      tab: "eternity/milestones"
    }, {
      name: "Time Dimensions",
      info: () => `
After your first Eternity, you unlock Time Dimensions. You buy them with Eternity Points and they provide Time Shards,
which generate Tickspeed upgrades. These Tickspeed upgrades function like normal Tickspeed upgrades but don't increase
their cost. These Tickspeed upgrades are kept on Infinity, but reset every Eternity.
<br>
<br>
Similarly to the other dimensions, Second Time Dimensions produce First Time Dimensions and so on. Similarly to Infinity
Dimensions, your production will be reset to the amount you purchased after every Eternity, but you will keep any
upgrades to your multipliers you purchased.
<br>
<br>
Each purchase increases the multiplier of that specific Time Dimension by ${formatX(4)}. The cost multiplier between
upgrades has a base value, but is increased by ${formatX(1.5, 1, 1)} at
${format(TimeDimension(1)._costIncreaseThresholds[0], 2)} EP and ${formatX(2.2, 1, 1)} (of the base value) at
${format(TimeDimension(1)._costIncreaseThresholds[1])} EP. These increases apply retroactively, causing the cost to
jump when they reach those thresholds, and only apply to the first four dimensions. Beyond
${format(TimeDimension(1)._costIncreaseThresholds[2])} EP each dimension purchase counts as four purchases for the
purpose of cost increases, causing the price to rise much more steeply.
<br>
<b>Time Dimension base prices (EP):</b> ${Array.range(1, 8)
  .map(tier => format(TimeDimension(tier)._baseCost))
  .join(", ")}
<br>
<b>Time Dimension base price increases:</b> ${Array.range(1, 8)
  .map(tier => format(TimeDimension(tier)._costMultiplier))
  .join(", ")}
<br>
<br>
Each threshold to gain another Tickspeed upgrade is ${formatPercents(0.33)} more Time Shards than the previous,
or ${formatPercents(0.25)} with the relevant time study. After ${formatInt(FreeTickspeed.softcap)} upgrades, the
multiplier between each successive free Tickspeed upgrade will gradually increase at a rate of ~${formatX(1.35, 0, 2)}
per ${formatInt(50000)} upgrades (${formatX(1.000006, 0, 6)} per upgrade).
`,
      isUnlocked: () => PlayerProgress.eternityUnlocked(),
      tags: ["dims", "td", "shards", "eternity", "midgame"],
      tab: "dimensions/time"
    }, {
      name: "Time Studies",
      info: () => `
A Time Study is a powerful post-Eternity upgrade, which costs a new resource called Time Theorems. Time Studies can
boost the production of anything you have seen so far in the game, or even change the way some formulas work.
<br>
<br>
Time Theorems are a limited resource which costs more for each one you buy. They can be bought with antimatter,
Infinity Points, or Eternity Points. Their cost increases by a set factor per purchase. Time Theorems are permanent
and don't reset after Eternity.
<br>
<br>
Studies are laid out in a tree-like fashion, where you must buy prerequisites before continuing. The only study you
can buy at first is the very top one, and then from there you can purchase any study directly below it which you can
afford. However, there are three exceptions:
<br>
Where the lines between studies have a color, you can only choose one of the three paths at a time.
<br>
When a study for an Eternity Challenge is in the way, you need to complete all challenges connected to it at least
once in order to access the study. You don't need to have the challenge study purchased in order to access it.
<br>
Near the bottom, where all the edges join together again, you can only pick one study out of each pair.
<br>
<br>
You are able to hold down shift and then click on a time study to buy all studies until that point. This might not buy
the studies you want if you shift-click a study in a position where you would have to choose between two or more
different options which you can't get together (see above), or you can't afford all the studies needed to reach that
point. Shift-click will buy studies greedily, getting as many as possible per row before moving farther downward.
<br>
<br>
<b>Presets:</b> The buttons initially labeled 1 through 6 allow you to save your current set of studies into the slot,
letting you quickly buy that particular set of studies again with a single click. You can hover over the button and
use the tooltip to load/save a slot, or click to load and shift-click to save.
<br>
<br>
<b>Respecs:</b> A Respec allows you to reset the upgrades you have in the tree to retreive all of the Time Theorems
spent on them. It can be done for free, but only triggers on finishing an Eternity; you can't respec Time Studies in
the middle of an Eternity.
<br>
<br>
<b>Costs multipliers per purchase:</b>
<br>
<b>Antimatter:</b> ${formatPostBreak("1e20000")}
<br>
<b>Infinity Points:</b> ${format(1e100)}
<br>
<b>Eternity Points:</b> ${formatInt(2)}
`,
      isUnlocked: () => PlayerProgress.eternityUnlocked(),
      tags: ["eternity", "ts", "theorems", "tree", "study", "midgame"],
      tab: "eternity/studies"
    }, {
      name: "Eternity Challenges",
      info: () => `
Eternity Challenges are another set of challenges which are unlocked by the Time Study tree. They require a certain
amount of Time Theorems to enter, plus a secondary requirement which you must meet when you unlock the challenge.
<br>
<br>
When you enter an Eternity Challenge, your goal becomes reaching a certain target IP. After completing the challenge,
you do not need to have the Eternity Challenge's study unlocked for the reward to take effect. The rewards for these
challenges are similar to Time Studies, but often even stronger and permanent since they don't require you to spend
theorems to have their effects.
<br>
<br>
You can complete each Eternity Challenge up to five times. After each completion, the rewards grow stronger but the
goal to the next completion also increases. Additionally, the secondary requirement to unlock the challenge again will
also increase.
<br>
<br>
You can unlock an Eternity Challenge with one set of studies, and then respec to a different set of studies without
having to complete the secondary requirement again.
`,
      isUnlocked: () => PlayerProgress.eternityUnlocked(),
      tags: ["ec", "study", "time", "rewards", "completions", "midgame"],
      tab: "challenges/eternity"
    }, {
      name: "Time Dilation",
      // This could use a rewrite the sentence structure and grammer is kind rough
      info: () => `
Time Dilation is unlocked when you purchase the ${formatInt(5000)} TT time study after
beating both EC11 and EC12 five times, and after acquiring a total of ${formatInt(13000)} TT.
Dilating time will start a modified Eternity, called Time Dilation, in which all of your Antimatter/Infinity/Time
Dimension multipliers’ <i>exponents</i> and the Tickspeed multipliers’ <i>exponent</i> will raised to the power of
${format(0.75, 2, 2)}, significantly reducing them.
<br>
<br>
If you can reach ${formatPostBreak(Number.MAX_VALUE, 2)} IP and then complete the Eternity while Dilated, you will be
rewarded with Tachyon Particles. You can dilate as many times as you want, but Tachyon Particles cannot be "farmed" like
other resources. Instead, you can only gain more Tachyon Particles by passing your previous highest antimatter within
Time Dilation, and you will only gain more based on your <i>new</i> highest antimatter from this new run.
<br>
<br>
Tachyon Particles generate another currency called Dilated Time. Dilated Time is translated into Tachyon Galaxies by
reaching thresholds similarly to the Tickspeed upgrades gained from Time Dimensions. These Tachyon Galaxies are like
Replicanti Galaxies in that they affect Tickspeed as if they were Antimatter Galaxies but they don't increase the cost
of your next Antimatter Galaxy.
<br>
<br>
Unlocking Time Dilation also unlocks upgrades you can purchase using Dilated Time. The first row of Dilation upgrades
can be repeatedly purchased as many times as you can afford them.
`,
      isUnlocked: () => DilationTimeStudyState.studies[1].isBought || PlayerProgress.realityUnlocked(),
      tags: ["dial", "dt", "dilated", "tachyon", "particle", "study", "free", "galaxy", "midgame"],
      tab: "eternity/dilation"
    }, {
      name: "Reality",
      info: () => `
When you reach ${format(5e9)} time theorems, ${formatPostBreak("1e4000")} EP, and have completed the first
${formatInt(13)} rows of Achievements, you will be able to purchase the Time Study that unlocks Reality.
Unlocking it opens a new tab, where you can find the button to make a new Reality. Starting a new Reality
will reset everything you have done so far except challenge times and total antimatter, but in exchange gives
you a new currency known as Reality Machines, a Glyph, and a Perk Point.
<br>
<br>
Unlike the other resets so far, you also lose the first ${formatInt(13)} rows of Achievements - that is, all of
the pre-Reality Achievements and all of their associated rewards. You need to re-do them in order to get their
rewards again, but you will also passively unlock the next incomplete Achievement every half hour without any
effort even if you otherwise don't have the requirements to do so. This also happens offline at the same rate.
<br>
<br>
Reality Machines can be spent on different upgrades throughout the Reality tab and are your primary currency from this
point onwards. Glyphs are equippable objects which you must equip in order to use their boosts. Perk points are another
currency that can be spent in the Perks subtab on different Perks.
<br>
<br>
Reality Machines scale purely off of EP, and the Reality button will tell you how much EP you need in order to gain
the next one. The first ${formatInt(10)} RM scale linearly in the exponent between
${formatPostBreak("1e4000")} EP and ${formatPostBreak(Decimal.pow(10, 16000 / 3))} EP, and then past that
RM = ${formatInt(1000)}<sup>log<sub>${formatInt(10)}</sub>(EP)/${formatInt(4000)}-${formatInt(1)}</sup>.
<br>
<br>
Glyph level scales off of a combination of Eternity Points, Replicanti, and Dilated Time.
The minimum level is ${formatInt(1)}.
<br>
<br>
You get exactly ${formatInt(1)} Perk Point per Reality.
`,
      isUnlocked: () => PlayerProgress.realityUnlocked(),
      tags: ["rm", "machines", "glyph", "perk", "reset", "prestige", "endgame", "lategame"],
      tab: "reality/upgrades"
    }, {
      name: "Glyphs",
      info: () => `
A Glyph is an equippable object that has four attributes:
<br>
Type - This is a name given to the Glyph based on what part of the game it will tend to boost (eg. "Glyph of X"). This
determines the possible effects it may have.
<br>
Level - This contributes to how strong your Glyph is, and it scales based on how well you did in the Reality you got
it from.
<br>
Rarity - This is a percentage, between ${formatPercents(0)} and ${formatPercents(1)}, which also affects the strength
of your Glyph. This is random, but can be influenced by various upgrades.
<br>
Effects - These are the boosts that equipping the Glyph will give you, and can contain up to four effects. Stronger
Glyphs will generally have more effects than weaker Glyphs.
<br>
<b>Note: Your first Glyph will have a fixed effect and rarity, but its level will scale based on your progress before
any Reality content. Once you receive a Glyph, its attributes can't be changed.</b>
<br>
<br>
To equip a Glyph, drag the icon from your inventory into one of the active circles in the middle of the screen. If
you equipped the glyph properly, the effect list to the right should change and the Glyph icon should now be circular.
Active Glyphs can't be unequipped or swapped with other Glyphs without restarting your current Reality, but you can
equip Glyphs into <i>empty</i> active slots at any time during a Reality.
<br>
<br>
The slots in the first rows of your inventory are "protected" slots. New glyphs will never be placed into them (even if
there is no more room in your inventory), and they are unaffected by the Sort and Auto clean buttons.
<br>
<br>
You can delete Glyphs from your inventory by shift-clicking them, which will prompt you with a confirmation dialog
asking if you are sure you want to delete the Glyph. Holding shift and ctrl together while clicking will bypass this
dialog. <b>However, deleting Glyphs will give you no benefit beyond clearing up inventory space if you do so before
unlocking Glyph Sacrifice from a Reality upgrade!</b>
`,
      isUnlocked: () => PlayerProgress.realityUnlocked(),
      tags: ["reality", "sacrifice", "level", "endgame", "lategame"],
      tab: "reality/glyphs"
    }, {
      name: "Perks",
      info: () => `
Perks are a type of upgrade unlocked upon Reality. Each Perk effect varies, but most are QoL (quality of life)
improvements which you can choose your own path through. All Perks only require ${formatInt(1)} Perk Point to buy.
<br>
<br>
Each Reality you gain ${formatInt(1)} Perk Point which can be spent on a upgrade on the tree, starting with
"You can now choose from ${formatInt(3)} glyphs on Reality". You can only unlock Perks which are directly adjacent
to Perks you already have, although there are loops in the tree which you can go through in either direction.
`,
      isUnlocked: () => PlayerProgress.realityUnlocked(),
      tags: ["pp", "reality", "tree", "endgame", "lategame"],
      tab: "reality/perks"
    }, {
      name: "Automator",
      info: () => `
The Automator is unlocked upon reaching ${formatInt(5)} Realities.
It uses a scripting language that allows you to automate nearly the entire game.
The interface has two panes, a script pane on the left where you enter the commands to automate the game, and a
documentation pane on the right that has information on all the commands available to you.
<br>
<br>
You can use as many rows as you need, and the only thing limiting you is whether
you have certain features (like the Black Hole and Stored Time) to be able to use those commands.
<br>
<br>
You are able to create new scripts by clicking on the dropdown, and then clicking the "Create New..." option.
To rename a script, click the pencil next to the dropdown. Scripts are automativally saved as you edit them.
You can create as many scripts as you want.
<br>
<br>
If you want a larger workspace, you can press the button in the top right corner of the documentation pane of the
Automator to expand it to fullscreen. You can also drag the boundary between the panes horizontally to resize the
panes if you want more room to write your script or read documentation.
<br>
<br>
By pressing the top-right button on the script pane, you can switch to block mode, which may be more approachable if
you are unfamiliar with programming. To enter commands in block mode, drag the box for the relevant command from the
documentation pane into the script pane and drop it where you want the command to go. Commands can be freely
rearranged by dragging the blocks around if needed. Clicking the top-right button in block mode will switch back to
text mode, and switching between block and text mode will automatically translate your script as well.
`,
      isUnlocked: () => Player.automatorUnlocked,
      tags: ["automation", "reality", "code", "script", "endgame", "lategame"],
      tab: "reality/automator"
    }, {
      name: "Black Hole",
      info: () => `
The Black Hole is a feature which speeds up how fast the game runs, on a periodic cycle.
The game will run at normal speed for some amount of time, then have a burst of running extremely fast for a short
period of time before going back to normal speed and repeating the cycle.
<br>
<br>
Increased game speed from Black Holes is much stronger than tickspeed because unlike tickspeed, it affects
<i>everything equally</i>, including things which are only partially affected (eg. Infinity/Time Dimensions), things
which are normally completely unaffected (eg. DT/TT generation), and effects which are boosted purely on time spent
(eg. idle path IP/EP multipliers).
<br>
<br>
You can buy upgrades for the Black Hole by using Reality Machines. There are three upgrades for the Black Hole:
<br>
Interval - How long the Black Hole is inactive between bursts,
reduced by ${formatPercents(0.2)} per upgrade.
<br>
Power - How much faster the game runs during the temporary speed bursts,
increased by ${formatPercents(0.35)} per upgrade.
<br>
Duration - How long each speed burst lasts before going back to normal speed,
increased by ${formatPercents(0.3)} per upgrade.
<br>
<br>
Once you reach ${formatInt(1)} year of game playtime, you unlock a Reality upgrade that allows you to have
a second Black Hole. The time spent for this requirement is itself affected by the first Black Hole, so it
takes much less than ${formatInt(1)} actual real-time year.
<br>
<br>
Once the Black Hole is active at least ${formatPercents(0.9999, 2)} of the time, it becomes permanently active.
This is tracked separately for the two Black Holes.
<br>
<br>
The timer on the second Black Hole only advances when the first Black Hole is active. So, for example, if the first
Black Hole has a duration of ${formatInt(4)} minutes and the second has an interval of ${formatInt(8)} minutes, the
second Black Hole will only activate once every two cycles of the first Black Hole regardless of how short the
first Black Hole's interval is. Note that the timer shown in the in-game header takes account of this and shows
the actual time until the second Black Hole activates; in the Black Hole tab, you can see the amount of time with
the first Black Hole active needed for the second Black Hole to activate.
<br>
<br>
The Black Holes can be paused, completely halting their interval/duration cycle. However, when unpausing them, it will
take ${BlackHoles.ACCELERATION_TIME} real-time seconds for them to reach maximum speed if they were paused while their
speed boost was active. Pausing and unpausing affects both Black Holes; they can't be paused or unpaused independently.
<br>
<b>Hotkey: B</b> pauses and unpauses the Black Holes.
`,
      isUnlocked: () => BlackHole(1).isUnlocked,
      tags: ["reality", "time", "speed", "duration", "interval", "rm", "endgame", "lategame"],
      tab: "reality/hole"
    }, {
      name: "Celestials",
      info: () => `
Once you get all of the Reality upgrades, the first Celestial is unlocked.
This opens up a new tab to the right of Reality.
<br>
<br>
Each Celestial has unique mechanics and upgrades, and you need to defeat all seven.
Defeating a Celestial has different conditions depending on the Celestial's mechanics.
<br>
<br>
All Celestials have their own Celestial Reality, but how the Reality is relevant will depend on the celestial.
`,
      isUnlocked: () => RealityUpgrades.allBought,
      tags: ["reality", "challenges", "endgame", "lategame"],
      tab: ""
    }, {
      name: "Teresa, Celestial of Reality",
      alias: "Teresa",
      info: () => `
Teresa is the first Celestial. They are unlocked by obtaining all of the Reality upgrades.
<br>
On the main screen, there is a bar with a button above it that says "Pour RM". This allows you to put your RM into the
container for a Reality Machine multiplier. RM which has been poured into the container can't be retrieved.
When you reach ${format(TERESA_UNLOCKS.RUN.price)} RM inside of the container, you unlock Teresa's Reality.
<br>
<br>
When you complete Teresa's Reality,
${Teresa.runCompleted
    ? "your Glyph Sacrifice is multiplied based on the amount of antimatter gained during the run"
    : "<div style='color: var(--color-bad);'>(complete Teresa's Reality to see this text)</div>"}.
Completing Teresa's Reality is only part of the story; you need to keep pouring RM in order to progress. Once
you are at ${format(TERESA_UNLOCKS.EFFARIG.price)} RM in the container, you will unlock the next Celestial.
`,
      isUnlocked: () => RealityUpgrades.allBought,
      tags: ["rm", "endgame", "lategame", "perks", "sacrifice", "boo", "ghost"],
      tab: "celestials/teresa"
    }, {
      name: "Effarig, Celestial of Ancient Relics",
      alias: "Effarig",
      info: () => `
Effarig is the second Celestial you encounter.
They are unlocked by pouring at least ${format(TERESA_UNLOCKS.EFFARIG.price)} RM into Teresa's container.
<br>
Effarig introduces a currency called Relic Shards, which are obtained by using different kinds of Glyph effects during
a Reality. The number of distinct effects active during the Reality very strongly affects Relic Shard gain, and EP
affects it to a much lesser degree. Relic Shards are the currency for Effarig unlocks, and will be gained from every
Reality from now on.
<br>
<br>
Using Relic Shards, you can purchase multiple upgrades (see "Advanced Glyph Mechanics") which improve your Glyphs and
allow you to filter them based on their effects and rarity when you are doing fully automated Realities.
<br>
<br>
Effarig's final unlock is their own Reality at ${format(GameDatabase.celestials.effarig.unlocks.run.cost)} Relic
Shards.
${EffarigUnlock.run.isUnlocked
    ? "Their Reality is divided into three layers: Infinity, Eternity, and Reality. You must complete each layer " +
    "before getting access to the next one. Completing Effarig's Eternity unlocks the next Celestial."
    : "<div style='color: var(--color-bad);'>(unlock Effarig's Reality to see this text)</div>"
}
<br>
<br>
Completing Effarig's Reality unlocks
${EffarigUnlock.reality.isUnlocked
  // Can't really make a nested template here without generally making a mess of the code
  // eslint-disable-next-line prefer-template
    ? "a new Glyph type: <div style='color: var(--color-bad);'>Effarig</div> Glyphs. Effarig Glyphs have " +
    formatInt(7) + " different possible effects, which you can view in the \"Advanced Mode\" settings. You can only " +
    "have one Effarig Glyph equipped at a time, and they can still only have at most " + formatInt(4) + " effects."
    : "<div style='color: var(--color-bad);'>(complete Effarig's Reality to see this text)</div>"}
`,
      isUnlocked: () => Teresa.has(TERESA_UNLOCKS.EFFARIG),
      tags: ["glyph", "sacrifice", "shards", "reality", "spectralflame", "lategame", "endgame"],
      tab: "celestials/effarig"
    }, {
      name: "Advanced Glyph Mechanics",
      info: () => `
Glyph level Adjustment is purchasable for ${format(GameDatabase.celestials.effarig.unlocks.adjuster.cost)} Relic
Shards. This allows you to set weights for each resource (EP, DT, Replicanti, Eternities), in how much they affect the
level of Glyphs gained on Reality.
<br>
<br>
Automatic Glyph Filtering is purchaseable for ${format(GameDatabase.celestials.effarig.unlocks.glyphFilter.cost)}
Relic Shards. This system uses one of many methods to assign a score to your glyph choices, and then picks the choice
with the highest score. After picking this glyph, it checks the score against a threshold and either keeps it if the
score is above the threshold, or sacrifices it instead. There are three basic modes:
<br>
<b>Lowest total sacrifice</b> - Glyphs are given a score based on how much sacrifice value you have of that
particular glyph's type. Glyphs of the type you have the least sacrifice value in will have the highest score.
This mode doesn't have a threshold and always sacrifices your glyphs.
<br>
<b>Number of effects</b> - Glyphs are given a score equal to the number of effects they have, and when multiple
glyphs have the same effect count, glyphs with higher rarity will be picked. The threshold they are
compared to is specified by your input in the text box.
<br>
<b>Rarity Threshold Mode</b> - Glyphs are given a score equal to their rarity percent. The comparison threshold
can be set individually per glyph type.
<br>
<br>
Additionaly, there are two more advanced modes with some additional flexibility:
<br>
<b>Specified Effect Mode</b> - Glyphs are given a score equal to their rarity and checked against the rarity threshold
you specify, but this score is modified based on your inputs for effects. The Glyph will be checked for having a minimum
number of effects and having all of the effects you choose, and its score is lowered by ${formatInt(200)} for every
missing effect. This guarantees that any glyph that doesn't have the effects you want will be below the threshold.
<br>
<b>Advanced Mode</b> - This mode is like Specified Effect Mode, but you have even finer control over the effects of
your Glyphs. The score of a Glyph is calculated from its rarity plus the score of each effect it has, and you can set
the threshold to any value you want. One possible way you can use this behavior is to give a weaker effect a value of
${formatInt(5)}, which allows you to keep Glyphs without that effect as long as they are rarer.
<br>
<br>
Glyph Set Saves are purchasable for ${format(GameDatabase.celestials.effarig.unlocks.setSaves.cost)} Relic
Shards. This unlocks ${formatInt(5)} slots that allow you to save your currently equipped glyphs into sets.
You cannot overwrite a set, you must delete it first. When you load a set, each glyph in it is found and equipped.
If any are not found, it will display a warning, but equip all the rest regardless. You can only load a set when
there are no equipped glyphs. When loading a set, you can be Level and/or Rarity sensitive. The best glyph from
the possible glyphs will always be the one equipped.
<br>
<br>
<i>Note: If desired, "Specified Effect Mode" and "Advanced Mode" can be used to filter out some Glyph types entirely;
for example setting impossible conditions like "at least ${formatInt(6)} effects" or "Minimum score ${formatInt(999)}
and all effects worth ${formatInt(0)}" on Power Glyphs will make it so that a Power Glyph is never picked.</i>
`,
      isUnlocked: () => EffarigUnlock.adjuster.isUnlocked,
      tags: ["glyph", "weight", "adjustment", "sacrifice", "filter", "threshold", "set", "save", "reality", "lategame",
        "endgame"],
      tab: "celestials/glyphfilter"
    }, {
      name: "The Enslaved Ones, Celestial of Time",
      alias: "Enslaved Ones",
      info: () => `
The Enslaved Ones are the third Celestial, unlocked by completing Effarig's Eternity.
<br>
<br>
When unlocking The Enslaved Ones, you immediately gain access to two new mechanics related to time. You can store
"game time" by charging your Black Hole, and you can store "real time" by intentionally halting your production.
Stored game time is also used as a currency for purchasing unlocks from The Enslaved Ones.
<br>
<br>
Charging your Black Hole gives you stored time, which it does at the expense of setting your game speed to
${formatInt(1)}. The game is in effect using your increased game speed in order to store time itself. Its
main use is to discharge the Black Hole, which takes uses your stored time to skip forward in time by a duration
equal to the time stored. This is different than regular game speed multipliers in that discharging is not subject to
any modifiers to game speed when it is used, only when it is stored.
<br>
<br>
Storing real time completely stops all production, effectively pausing your game. For every real-time second that
passes, you gain stored real time (modified by some efficiency factor). You can use stored real time in order to
amplify a Reality in the Glyphs tab. This uses all of your stored real time at once in order to attempt to repeat that
exact Reality over and over, giving you all the rewards you would normally get from the repetitions. For example, if
you have ${formatInt(50)} minutes stored and amplify a Reality which has lasted ${formatInt(10)} minutes and would
give ${format(1e30)} RM and ${format(1e12)} Relic Shards, the amplified Reality will give you ${format(5e30)} RM,
${format(5e12)} Relic Shards, ${formatInt(5)} Glyphs (subject to your filtering settings),
and ${formatInt(5)} Perk Points.
<br>
You can toggle a setting to automatically store offline time as stored real time.
<br>
<br>
Their first unlock costs ${format(TimeSpan.fromMilliseconds(ENSLAVED_UNLOCKS.FREE_TICKSPEED_SOFTCAP.price).totalYears)}
years of stored time. It increases the softcap to Tickspeed upgrades gained from Time Dimensions
(the point at which their cost starts increasing faster)
by ${format(1e5)} Tickspeed upgrades.
<br>
<br>
At ${format(TimeSpan.fromMilliseconds(ENSLAVED_UNLOCKS.RUN.price).totalYears)} years, you are able to finally unlock
their Reality. The reward for completing The Enslaved Ones' Reality is
${Enslaved.isCompleted
    ? "unlocking Tesseracts, which have their own How To Play entry."
    : "<div style='color: var(--color-bad);'>(complete The Enslaved Ones' Reality to see this text)</div>"}
The Enslaved Ones will not directly unlock the next Celestial.
`,
      isUnlocked: () => EffarigUnlock.eternity.isUnlocked,
      tags: ["reality", "time", "blackhole", "lategame", "endgame", "testers",
        "ikerstream", "realrapidjazz", "saturnus", "earth", "garnet", "pichusuperlover"],
      tab: "celestials/enslaved"
    }, {
      name: "Tesseracts",
      info: () => `
Tesseracts are a new resource you unlock for completing The Enslaved Ones' Reality.
<br>
<br>
Infinity Dimensions are normally capped at ${format(InfinityDimensions.HARDCAP_PURCHASES)} total purchases,
which limits how large their multipliers can grow since eventually you can't upgrade them any more.
Tesseracts allow you to raise this cap by spending Infinity Points.
<br>
<br>
The cost of Tesseracts increases super-exponentially, but each successive Tesseract is significantly stronger than
the last in order to make up for that. Tesseract count is never reset, meaning that once purchased, you don't need
to reach the IP cost again in order to take advantage of the raised cap in later realities.
`,
      isUnlocked: () => Enslaved.isCompleted,
      tags: ["reality", "lategame", "endgame", "tesseract", "id"],
      tab: "celestials/tesseract"
    }, {
      name: "V, Celestial of Achievements",
      alias: "V",
      info: () => `
V is a special Celestial in the sense that they are not unlocked by another Celestial,
but are instead unlocked by completing a certain Achievement.
They are unlocked by completing Achievement ID 151 (row ${formatInt(15)}, column ${formatInt(1)},
"You really didn't need it anyway"), which requires you to get ${formatInt(800)} Antimatter Galaxies
without buying 8th Antimatter Dimensions in your current Infinity.
<br>
<br>
After being unlocked from the Achievement, you are met with another set of requirements to fully unlock V.
You must have completed ${formatInt(GameDatabase.celestials.v.mainUnlock.realities)} Realities and have
${format(GameDatabase.celestials.v.mainUnlock.rm)} RM (which is not spent).
Additionally you need to reach  ${format(GameDatabase.celestials.v.mainUnlock.eternities)} Eternities,
${format(GameDatabase.celestials.v.mainUnlock.infinities)} Infinities,
${format(GameDatabase.celestials.v.mainUnlock.dilatedTime)} Dilated Time, and
${format(GameDatabase.celestials.v.mainUnlock.replicanti)} Replicanti, all in the same reality.
<br>
<br>
When you meet all of those requirements, you will be able to access V's Reality. However, completing the
Reality itself is only the beginning. V has six different requirements, each of which require you to make a
certain amount of progress within V's Reality. Completing a requirement rewards you with a V-Achievement.
V-Achievements are permanent and persist after exiting V's reality, and do not all need to be done simultaneously.
<br>
<br>
After completing the requirement, the V-Achievement threshold then increases and can be completed again
if you can reach the new goal.  You can complete each category of V-Achievement up to six times.
Completed V-Achievements do two things:
<br>
- Upon reaching certain totals of V-Achievements, you automatically unlock upgrades on the V tab without needing
to spend any resources.
<br>
- Each V-Achievement also gives you one Space Theorem.
<br>
<br>
Space Theorems allow you to purchase Time Studies which are normally forbidden, such as multiple paths in the
split after the improved IP formula, or both Time Studies within a dark/light pair near the bottom. Like Time
Theorems, they are freely given back every time you respec your studies.
With enough Space Theorems you will eventually be able to purchase every single Time Study at once!
<br>
<br>
Reaching ${formatInt(36)} V-Achievements (and therefore completing all of V's Achievements) unlocks the next Celestial.
`,
      isUnlocked: () => Achievement(151).isUnlocked,
      tags: ["reality", "lategame", "endgame", "girlfriend", "challenges", "achievement", "space", "theorems",
        "study", "triad"],
      tab: "celestials/v"
    }, {
      name: "Ra, Celestial of the Forgotten",
      alias: "Ra",
      info: () => `
Ra is the fifth Celestial, unlocked by fully completing all of V's Achievements. They bring back mechanics from
older Celestials in a stronger way, by using their memories. Over time, you will unlock the previous four
Celestials <i>within</i> Ra, with each Celestial offering additional upgrades related to their original themes.
<br>
<br>
Each previous Celestial within Ra gains levels based on memories, which are generated passively over time from
memory chunks. Memory chunks can only be gained by entering Ra's Reality, but inside of the Reality chunks will
be generated passively based on certain resource totals. If you are storing real time, you will not gain any
chunks inside of Ra's Reality, but memories will still be generated normally. Having a total of
${formatInt(RA_UNLOCKS.RA_RECOLLECTION_UNLOCK.totalLevels)} levels across all Celestials unlocks Recollection,
which allows you to choose a particular Celestial to gain more chunks while inside of Ra's Reality.
<br>
<br>
You start Ra with only Teresa unlocked, and each successive Celestial is unlocked by reaching level ${formatInt(10)}
with the previous Celestial. Levels have no cap, but are significantly harder to gain above ${formatInt(25)}.
<br>
<br>
Teresa unlocks the ability to charge your Infinity Upgrades, making them much stronger. They also
improve your glyph effects once you reach certain thresholds in glyph sacrifice value.
<br>
<br>
At level ${formatInt(2)}, Effarig unlocks
${Ra.has(RA_UNLOCKS.EFFARIG_UNLOCK)
    ? "a new mechanic called Glyph Alchemy and also makes Effarig glyphs stronger while gradually removing almost " +
    "all random elements of glyph generation. This also has its own How To Play entry."
    : "<div style='color: var(--color-bad);'>(unlock Effarig within Ra to see this text)</div>"}
<br>
<br>
The Enslaved Ones unlocks
${Ra.has(RA_UNLOCKS.ENSLAVED_UNLOCK)
    ? "additional mechanics related to charging the Black Holes, as well as making them significantly stronger."
    : "<div style='color: var(--color-bad);'>(unlock The Enslaved Ones within Ra to see this text)</div>"}
<br>
<br>
V unlocks
${Ra.has(RA_UNLOCKS.V_UNLOCK)
    ? "Triad Studies, which are Time Studies near the bottom of the tree which cost Space Theorems. " +
    "They also unlock a smaller set of more difficult V Achievements to complete for additional Space Theorems."
    : "<div style='color: var(--color-bad);'>(unlock V within Ra to see this text)</div>"}
<br>
<br>
Having a level ${formatInt(25000)} Reality Glyph, a total of ${formatInt(100)} Ra levels, and
${formatPostBreak("1e2000")} Reality Machines will allow you to unlock the next Celestial.`,
      isUnlocked: () => V.has(V_UNLOCKS.RA_UNLOCK),
      tags: ["reality", "memories", "razenpok", "levels", "glyphs", "lategame", "endgame",
        "effarig", "teresa", "enslaved", "v"],
      tab: "celestials/ra"
    }, {
      name: "Glyph Alchemy",
      info: () => `
Glyph Alchemy is a mechanic unlocked by reaching Effarig level ${formatInt(2)} in Ra. It unlocks the ability to
use up your glyphs by refining them into alchemy resources associated with their type. Each resource gives some
kind of a boost to certain parts of the game based on how much of them you have.
<br>
<br>
The amount of a resource you get from a glyph is based on the cube of the glyph's level, scaled so that level
${formatInt(10000)} glyphs correspond to ${formatInt(10000)} alchemy resources. A single glyph itself,
however, only gives ${formatPercents(GlyphSacrificeHandler.glyphRefinementEfficiency)} of this maximum value, and
also can't give you more resources than the cap. This cap is applied per glyph, and you will never lose resources
when you try to refine a glyph.
<br>
(This calculation applies for perfect ${formatPercents(1)}
rarity glyphs. Glyphs of lesser rarity still have the same cap, but give less resources.)
<br>
<br>
As an example of how the cap works, a level ${formatInt(10000)} glyph is worth
${formatInt(10000 * GlyphSacrificeHandler.glyphRefinementEfficiency)} resources normally, but will be worth less if you
already have at least ${formatInt(10000 * (1 - GlyphSacrificeHandler.glyphRefinementEfficiency))} of that resource
(bringing you up to a maximum of ${formatInt(10000)} after refinement). The glyph is worth nothing at all if you
already have ${formatInt(10000)} resources or more, as that is the cap for level ${formatInt(10000)} glyphs.
<br>
<br>
Alchemy resources can be combined together in certain combinations in order to create new compound resources, which
are unlocked at certain Effarig levels. Resources are combined once per Reality, unaffected by real time
amplification. The amount of compound resources you can have after a reaction is limited to the amount of the reagents
that go into it, which means all of your resources are ultimately limited by your glyph level.
<br>
<br>
To activate or deactivate a reaction, click the circle corresponding to the reaction's product. When the reaction can
be applied, moving lines will be shown from all reagents to the product. If a connection is a solid line, that means
that the reaction can't proceed due to not having enough of that reagent to get more of the product due to its cap.
`,
      isUnlocked: () => Ra.has(RA_UNLOCKS.GLYPH_ALCHEMY),
      // Oh god I'm so sorry this is so many words
      tags: ["reality", "lategame", "endgame", "ra", "effarig", "alchemy", "power", "infinity", "time", "replication",
        "dilation", "cardinality", "eternity", "dimensionality", "inflation", "alternation", "synergism", "momentum",
        "decoherence", "force", "exponential", "uncountability", "boundless", "unpredictability", "multiversal"],
      tab: "celestials/alchemy"
    }, {
      name: "Lai'tela, Celestial of Dimensions",
      alias: "Lai'tela",
      info: () => `
Lai'tela is the sixth Celestial, unlocked by having a level ${formatInt(25000)} Reality Glyph,
a total of ${formatInt(100)} Ra levels, and spending ${formatPostBreak("1e2000")} Reality Machines.
<br>
<br>
When you unlock Lai'tela, your Antimatter Dimensions and Tickspeed upgrades switch to a new mode of production
called Continuum, which gives the same effect as previously but allows for buying fractions of dimensions or
Tickspeed upgrades. Additionally, these fractional purchases are given for free without spending your antimatter.
This makes your autobuyers for Antimatter Dimensions obsolete, which is noted on the autobuyers page.
<br>
<br>
Lai'tela gives a new currency called Dark Matter, which gives a multiplier to purchases of dimensions and Tickspeed
upgrades from Continuum based on the highest amount of Dark Matter you have ever had. Dark Matter is produced by
Dark Matter Dimensions, in a similar way to all other types of dimensions in the game. There are four Dark Matter
Dimensions; you start with the first one unlocked immediately and the higher ones are unlocked at increasing amounts
of Dark Matter. When unlocking dimensions, you are given ${formatInt(1)} of the dimension and cannot gain more without
having it produced from the next tier up.
<br>
<br>
Each Dark Matter Dimension, after a certain interval of time, generates two things: Dark Matter or the next lower
Dark Matter Dimension and another currency called Dark Energy. Dark Matter and Dark Matter Dimension production
per interval is equal to the product of your Dark Matter multiplier and the number of dimensions you have, while
Dark Energy production is independent of your dimension amount. Dark Energy is used to produce Singularities, which
have their own How to Play entry.
<br>
<br>
Dark Matter Dimensions can have their intervals upgraded down to a minimum of ${formatInt(10)}ms, at which point
you cannot upgrade the interval any further. You can choose to ascend Dark Matter Dimensions which reach
that point, which multiplies Dark Matter and Dark Energy values for that Dimension by ${formatInt(1000)}. The interval
gets multiplied ${formatInt(10000)} (can be reduced with more progress in Lai'tela), but can be upgraded once again.
Reaching ${formatInt(10)}ms again allows you to ascend again if you choose to.
<br>
<br>
When you get ${format(Laitela.annihilationDMRequirement)} Dark Matter, you unlock a prestige called Annihilation.
Annihilation resets your Dark Matter, Dark Matter Dimensions, and Dark Energy, but adds to a permanent multiplier
to Dark Matter. You can Annihilate multiple times, the additions to the multiplier stack additively, and there is
no need to annihilate for a greater addition each time.
<br>
<br>
Lai'tela has a Reality which gives a multiplier to Dark Matter Dimensions' Dark Matter power based on how well you
do in the Reality.
<br>
<br>
<b>Dark Matter Dimension unlock thresholds (Dark Matter):</b> ${Array.range(1, 4)
  // DM1 is 10 instead of 0 here, so make a special case to display it properly
    .map(tier => format(tier === 1 ? 0 : MatterDimension(tier).adjustedStartingCost))
    .join(", ")}
<br>
<b>Dark Matter Dimension initial interval (seconds):</b> ${Array.range(1, 4)
    .map(tier => formatInt(Math.pow(4, tier)))
    .join(", ")}
`,
      isUnlocked: () => Laitela.isUnlocked,
      tags: ["omsi", "reality", "dark", "matter", "dimensions", "lategame", "endgame", "ascend"],
      tab: "celestials/laitela"
    }, {
      name: "Singularities",
      info: () => `
Singularities are a new resource which you can obtain using features within Lai'tela.
<br>
<br>
In order to obtain Singularities, you need to reach ${format(2e3)} Dark Energy. When you do, you get the option to
condense all your Dark Energy into a Singularity, resetting it back to zero. Any extra Dark Energy above this amount
does not carry over, and is thus wasted. Note that only Dark Energy is reset, the status of your Dark Matter and its
dimensions stays the same when condensing Singularities.
<br>
<br>
At any point, you can freely increase or decrease the Dark Energy requirement to condense Singularities by a factor of
${formatInt(10)} (with a minimum of ${format(2e3)}). This increases or decreases the number of Singularities gained
from resetting at the cap by <i>more than</i> a factor of ${formatInt(10)}, making higher caps worth more if you
are willing to wait.
<br>
<br>
Reaching a certain number of Singularities will unlock Singularity milestones, which act similarly to Eternity
milestones. Unlocking these milestones simply requires you to reach the total number of Singularities specified.
There are three types of milestones - one-time milestones, milestones repeatable a limited number of times, and
milestones which can be repeated indefinitely. Additionally, milestones also have an icon indicating what kind of
upgrade they generally give:
<br>
<b>ᛝ</b> These milestones help mechanics specific to Lai'tela
<br>
<i class="fas fa-arrows-alt"></i> These milestones let a resource in Lai'tela affect the rest of the game
<br>
<i class="fas fa-compress-arrows-alt"></i> These milestones improve Lai'tela based on something outside of Lai'tela
`,
      isUnlocked: () => Laitela.isUnlocked,
      tags: ["reality", "lategame", "endgame", "laitela", "dark"],
      tab: "celestials/singularity"
    }, {
      name: "Pelle, Celestial of Antimatter",
      alias: "Pelle",
      info: () => `
<h1>Work in Progress</h1>
`,
      isUnlocked: () => false,
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
    addWord(phrase, tab);
    for (const part of phrase.split(" ")) {
      addWord(part, tab);
    }
  };

  for (const tab of GameDatabase.h2p.tabs) {
    addPhrase(tab.name, tab);
  }
  for (const tab of GameDatabase.h2p.tabs) {
    for (const tag of tab.tags) {
      addPhrase(tag, tab);
    }
  }
  for (const tab of GameDatabase.h2p.tabs) {
    addPhrase(tab.alias, tab);
  }

  GameDatabase.h2p.search = query => {
    if (query === "") return GameDatabase.h2p.tabs;
    const words = query.toLowerCase().split(" ").filter(str => str !== "");
    /* eslint-disable-next-line no-unused-vars*/
    const searchTerms = words.map((_word, i, arr) => arr.slice(0, arr.length - i).join(" "));
    const result = new Set();
    for (const searchWord of searchTerms) {
      const matches = searchIndex[searchWord];
      if (matches === undefined) continue;
      for (const match of matches) {
        result.add(match);
      }
    }
    return Array.from(result);
  };
}());
