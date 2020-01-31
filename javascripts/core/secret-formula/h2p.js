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
Dimensions are your production units in game. The first Dimension produces your antimatter.
Each consecutive Dimension produces the previous one, allowing you to have steady growth.
There are eight Dimensions total.
<br>
<br>
<b>Dimension Multiplier:</b> Beside the Dimension there is a multiplier (example: First Dimension ${formatX(1, 1, 1)}).
The base production of each Dimension is multiplied by this number.
This multiplier increases by ${formatX(2)} for every 10 of that Dimension purchased. Each time this occurs,
the price of the dimension will increase.
<br>
<br>
<b>Accumulated Dimension Quantity:</b> The next column is your current amount of that Dimension you own.
This is a combination of how many you have purchased with antimatter,
as well as produced from the higher Dimension.
<br>
<br>
<b>Purchased Dimensions Quantity:</b> Next to each accumulated quantity of owned Dimensions,
the amount of that Dimension purchased toward the next multiplier upgrade is displayed in brackets.
For example if you have (4) next to your accumulated dimension quantity,
you will need 6 more of that dimension for the next multiplier increase.
<br>
<br>
<b>Dimension Growth Percent:</b> This number represents the amount of growth that each
Dimension experiences per second. +100% means the dimension is doubling each second.
This allows you to judge overall growth.
<br>
<br>
<b>Cost &amp; until 10:</b>
You can buy a single quantity of each Dimension with antimatter when the cost button is highlighted.
Alternatively, if the Until 10 button is highlighted,
you can buy whatever quantity gets you to that Dimension's next Dimension multiplier.
<br>
<br>
<b>Max all:</b> Max all will buy max tickspeed,
then will buy until 10 of 1st Dimension until it can't anymore, then 2nd, and so on.
<br>
<br>
<b>Dimension base prices:</b> ${Array.range(1, 8)
  .map(tier => format(NormalDimension(tier)._baseCost, 2, 2))
  .join(", ")}
<br>
<b>Base per 10 bought dimension price increases:</b> ${Array.range(1, 8)
  .map(tier => format(NormalDimension(tier)._baseCostMultiplier, 2, 2))
  .join(", ")}
<br>
<br>
<b>Hotkeys: 1, 2, 3, 4, 5, 6, 7, 8</b> for buy until 10 Xth Dimension
(you can also hold down shift while buying Dimensions, which will only buy 1 instead of 10), <b>M</b> for Max all
`,
      isUnlocked: () => true,
      tags: ["dims", "normal", "antimatter", "nd"],
      tab: "dimensions/normal"
    }, {
      name: "Tickspeed",
      info: () => `
Production in the game happens on each “tick" which initially occurs once per second. By buying tickspeed upgrades,
you can make your Dimensions produce faster, as if multiple ticks occur in each second.
<br>
<br>
<b>Tickspeed:</b> This states how many game ticks are occurring every second. Fractional ticks are accounted for,
boosting production as if part of a game tick has passed.
<br>
<br>
<b>Cost:</b> The cost of antimatter for reducing the time between ticks by the % displayed above
(Without any Galaxies, this is -11% per purchase)
<br>
<br>
<b>Buy Max:</b> This will buy the maximum amount of tickspeed upgrades available
with your current amount of antimatter.
<br>
<br>
<b>Hotkeys: T</b> will purchase as many tickspeed upgrades as possible, or <b>Shift+T</b> to buy a single upgrade.
Note that the actual tickspeed time is fake and the game always runs calculations at the update rate you've chosen
in the Options tab.
`,
      isUnlocked: () => Tickspeed.isUnlocked,
      tags: ["dimension", "earlygame", "time"],
      tab: "dimensions/normal"
    }, {
      name: "Dimension Shift/Boost",
      info: () => `
<b>Dimension Shift:</b> This resets all of your Dimensions and your antimatter, but unlocks another Dimension for
you to purchase. Each one requires 20 of your highest unlocked Dimension.
<br>
<br>
<b>Dimension Boost:</b> A Dimension Shift, but you don't unlock a new Dimension. This happens after 4 Dimension Shifts.
The first Dimension Boost requires 20 Eighth Dimensions and every additional boost will cost 15 more than the previous
Boost.
<br>
<br>
You gain a ${formatX(2)} multiplier to the first Dimension for every Dimension Shift and Boost you have. Each higher
dimension will have the multiplier applied one less time as the previous, down to a minimum of 0. For example, with 3
Shifts, the First Dimension will gain ${formatX(8)}, the Second Dimension ${formatX(4)}, the Third Dimension
${formatX(2)}, and all other Dimensions are unaffected.
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
Purchasing an Antimatter Galaxy will reset your game back to the point where only 4 Dimensions are available,
but will increase the effect of your tickspeed upgrades by +1.5% for your first two galaxies.
As you get more galaxies, the reduction will continue becoming stronger and stronger.
<br>
<br>
Though it will have very little impact for the first few purchases,
the increase is multiplicative and won’t take long to be visible.
<br>
<br>
Your first Galaxy requires 80 Eighth dimensions, and each additional Galaxy will cost another 60 more.
<br>
Distant Galaxy scaling: Above 100 Galaxies the cost increase between Galaxies will increase by 2 per Galaxy, making
the next Galaxy cost 62 more, then 64 more, etc.
<br>
Remote Galaxy scaling: Above 800 Galaxies, the <i>total</i> cost increases by another 0.2% per Galaxy.
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
<b>You unlock Dimensional Sacrifice after your first Dimension Boost.</b>
<br>
<br>
Sacrificing will immediately reset the owned quantity of Dimensions 1 through 7 to zero, without reducing the
multiplier or the current cost. In return, it will multiply the Eighth Dimension Multiplier by the shown value.
It will take time to get back to the production you previously had, but you will end up with a net increase.
<br>
<br>
The Dimensional Sacrifice multiplier scales with the number of First Dimensions you had at the time of sacrifice,
and the scaling can be improved by completing certain achievements and challenges. The multiplier is kept between
sacrifices, meaning that sacrificing once at ${formatX(10)} and then once at ${formatX(4)} will be the same as
${formatX(8)} then ${formatX(5)}; in both cases you will end up with a total sacrifice multiplier of ${formatX(40)}.
<br>
<br>
<b>Hotkey: S</b>
`,
      isUnlocked: () => Sacrifice.isVisible,
      tags: ["8th", "reset", "earlygame", "gods", "earlygame"],
      tab: "dimensions/normal"
    }, {
      name: "Achievements",
      // This one could use some work!
      info: () => `
Each achievement has conditions that must be met before they are earned.
Some are very simple, and some are significantly trickier.
<br>
<br>
You will recieve a ${formatX(1.03, 2, 2)} multiplier to all normal Dimensions for each completed achievement, as well
as an additional ${formatX(1.25, 2, 2)} for each fully completed row. In addition, many achievements have their own
rewards.
`,
      isUnlocked: () => true,
      tags: ["earlygame", "awards", "earlygame"],
      tab: "achievements"
    }, {
      name: "Infinity",
      info: () => `
Once you have too much antimatter for the world to handle (2<sup>1024</sup> or about ${format(Number.MAX_VALUE, 6)},
sometimes called "Infinity"), you’ll be forced to do a “Big Crunch”. This will reset your antimatter, Dimensions,
Shifts/Boosts, and your Galaxies. Doing a Big Crunch is also sometimes referred to as "Infinitying".
<br>
<br>
Each Infinity completed will give an Infinity Point, which can be spent on upgrades in the new Infinity tab.
You must purchase these upgrades from top to bottom. You will also gain one "infinitied stat", which is effectively
the number of times you have crunched.
<br>
<br>
The "Multiply Infinity Points from all sources by 2" upgrade can be bought multiple times,
but each purchase requires 10 times as much IP.
You must buy all 16 previous Infinity upgrades to start purchasing this particular upgrade.
<br>
<br>
<b>Hotkey: C</b> Big Crunches.
`,
      isUnlocked: () => PlayerProgress.infinityUnlocked,
      tags: ["crunch", "big", "upgrades", "ip", "reset", "prestige", "earlygame"],
      tab: "infinity/upgrades"
    }, {
      name: "Challenges",
      info: () => `
Challenges are unlocked after your first Infinity; they change in-game mechanics in different ways to create more
difficult Infinity circumstances. To complete a challenge, you must reach ${format(Number.MAX_VALUE, 2)} antimatter
again.
<br>
<br>
Each completed challenge will award an autobuyer.
You can run them multiple times (though only the first time grants a reward),
and they can be exited at any time via the “Exit Challenge” button on the challenge tab.
<br>
<br>
Your first Infinity is considered "Challenge 1" and is thus automatically completed once you unlock challenges.
<br>
<br>
The rightmost row of Infinity upgrades does not work in challenges.
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
automatic purchase of Dimensions, Dimension Shifts/Boosts, Galaxies,
tickspeed upgrades, Big Crunches, and Dimensional Sacrifice (later).
They are located under the Infinity tab in "Autobuyers".
<br>
<br>
<b>Priority:</b> Priorities tell the game which autobuyer will buy
if two are affordable in the same tick. Priority 1 is bought 1st,
Priority 2 is bought 2nd, etc. Two equal priorities will pick their
buying order randomly.
<br>
<br>
<b>Autobuyer Speed:</b>The cooloff period before the autobuyer attempts to make another puchase.
<br>
<br>
<b>Bulk Buy:</b> Once the Speed of an autobuyer is maxed (at 100ms), all future upgrades will double the maximum
amount the autobuyer can purchase per tick. This can be disabled.
<br>
<br>
<b>Dimension Autobuyer Buy Quantity:</b> Autobuyers for Dimensions can be set to buy a single Dimension,
or until 10. Bulk buy is disabled when the autobuyer is set to singles.
<br>
<br>
<b>Tickspeed Autobuyer Buy Quantity:</b> The tickspeed autobuyer can be set to buy a single upgrade, or the max
available.
<br>
<br>
<b>Automatic Dimboost Customization:</b> With the Dimboost autobuyer you can set the max number of Boosts it will
attempt to buy, a minimum number of Galaxies before Dimboosts are always auto-purchased, and (when unlocked) the
ability to buy an exact number of Dimboosts in bulk. If you reach your specified Galaxy threshold, the autobuyer
will ignore your max Boost limit. For the purposes of this autobuyer, your first four Shifts also count as Boosts.
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
      isUnlocked: () => PlayerProgress.infinityUnlocked,
      tags: ["infinity", "automation", "challenges", "rewards", "interval", "earlygame"],
      tab: "infinity/autobuyers"
    }, {
      name: "Break Infinity",
      info: () => `
Once you Break Infinity, you are no longer limited to ${format(Number.MAX_VALUE, 2)} antimatter and can start gaining
more than 1 IP per crunch depending on how much more antimatter you have when you crunch.
<br>
<br>
You now gain ~1.78 IP for crunching at ${format(Number.MAX_VALUE, 2)} antimatter. The IP you gain for crunching is
multiplied by 10 for every additional factor of ${format(Number.MAX_VALUE, 2)} antimatter you gain (in a continuous
manner). This is rounded down to the nearest integer.
<br>
<br>
The antimatter costs of all Dimensions begin to increase faster after they pass ${format(Number.MAX_VALUE, 2)}. The
cost <i>between</i> upgrades will increase by ${formatX(10)} <i>per upgrade</i> above ${format(Number.MAX_VALUE, 2)},
and a similar scaling happens to tickspeed upgrade costs as well.
`,
      isUnlocked: () => Autobuyer.bigCrunch.hasMaxedInterval || PlayerProgress.eternityUnlocked,
      tags: ["limit", "crunch", "upgrades", "midgame"],
      tab: "infinity/break"
    }, {
      name: "Infinity Dimensions",
      info: () => `
<b>Unlocking Infinity Dimensions:</b>Infinity Dimensions are unlocked by reaching a certain amount of antimatter.
<br>
<br>
<b>Infinity Dimension Purchasing:</b>Infinity Dimensions are only purchasable in sets of 10, and cost Infinity Points.
They give a permanent multiplier per purchase, similar to the other dimensions. The actual multiplier applied depends
on which Infinity Dimension you purchase. <!-- Sorry Garnet :/ -->
<br>
<br>
<b>Infinity Dimension Production:</b>Just like Normal Dimensions, each Infinity Dimension produces the
next highest Infinity Dimension.
<br>
<br>
Every crunch, your produced Infinity Dimensions are reset to the amount you purchased. While the production
of Infinity Dimensions doesn't carry between crunches, all the multipliers you got from purchasing them do.
<br>
<br>
<b>Infinity Dimension unlock thresholds (antimatter):</b> ${Array.range(1, 8)
  .map(tier => format(InfinityDimension(tier)._unlockRequirement))
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
<b>Infinity Dimension price increases:</b>${Array.range(1, 8)
  .map(tier => format(InfinityDimension(tier)._costMultiplier))
  .join(", ")}
<br>
<br>
Instead of antimatter, the First Infinity Dimension produces Infinity Power, which translates to a multiplier applied
to all Normal Dimensions. This multiplier is equal to (power<sup>7</sup>). Infinity Dimensions are not affected by
tickspeed upgrades.
`,
      isUnlocked: () => Autobuyer.bigCrunch.hasMaxedInterval || PlayerProgress.eternityUnlocked,
      tags: ["id", "power", "new", "dims", "unlock", "break", "midgame"],
      tab: "dimensions/infinity"
    }, {
      name: "Infinity Challenges",
      // This one could use some work!
      info: () => `
Infinity Challenges are like Normal Challenges, but they have higher end goals and are generally harder. Instead of
unlocking autobuyers, they give you boosts to your various forms of production in more unique ways.
<br>
<br>
Unlike the Normal Challenges, which are all unlocked at once, Infinity Challenges require you to reach a certain
amount of antimatter before you can attempt them.
<br>
<br>
<b>Infinity Challenge unlock thresholds:</b> ${GameDatabase.challenges.infinity
  .map(ic => format(ic.unlockAM)).join(", ")}
`,
      isUnlocked: () => Autobuyer.bigCrunch.hasMaxedInterval || PlayerProgress.eternityUnlocked,
      tags: ["rewards", "break", "ic", "midgame"],
      tab: "challenges/infinity"
    }, {
      name: "Replicanti",
      info: () => `
Replicanti are another resource you unlock at ${format(1e140)} IP. Rather
than producing something else, Replicanti actually produces <i>itself</i> up to a maximum of
${format(Number.MAX_VALUE, 2)}. Replicanti are produced at their own pace, unaffected by tickspeed upgrades. Each
individual Replicanti has a certain chance (initially 1%) of producing another Replicanti every Replicanti tick
(initially every second), and both of these can be upgraded by spending IP.
<br>
<br>
If you have purchased a Replicanti Galaxy upgrade, then you can get a "free" Replicanti Galaxy in exchange for
resetting your replicanti count back to 1. This Galaxy is free in that it will act as if it was an Antimatter Galaxy,
but it will not make your next Antimatter Galaxy more expensive.
<br>
<br>
<b>Hotkey: R</b> will buy a Replicanti Galaxy.
<br>
Replicanti give a multiplier to all Infinity Dimensions, which will reach a maximum of
${formatX(Math.pow(2, 20), 2, 2)} at ${format(Number.MAX_VALUE, 2)} replicanti.
<br>
<br>
<b>Chance upgrade cost:</b> Base ${format(1e140)} IP, cost increment ${formatX(1e15)} IP
<br>
<b>Speed upgrade cost:</b> Base ${format(1e150)} IP, cost increment ${formatX(1e10)} IP
<br>
<b>Galaxy upgrade cost:</b> Base ${format(1e170)} IP, cost increment ${formatX(1e25)} IP and an additional
${formatX(1e5)} IP per upgrade, scaling similarly to distant Antimatter Galaxies. Above 100 Replicanti Galaxies, this
${formatX(1e5)} per upgrade changes to ${formatX(1e55)}. Above 1000, the scaling switches from quadratic to cubic, with
the ${formatX(1e55)} multiplier itself increasing by ${formatX(1e5)} per upgrade.
`,
      isUnlocked: () => Replicanti.areUnlocked || PlayerProgress.eternityUnlocked,
      tags: ["interval", "chance", "infinity", "galaxy", "midgame"],
      tab: "infinity/replicanti"
    }, {
      name: "Eternity",
      info: () => `
Upon reaching ${format(Number.MAX_VALUE, 2)} IP, you can Eternity. Eternities will reset everything before this point
except challenge times, achievements, and total antimatter. You will be able to access more content after your first
Eternity.
<br>
<br>
You can pass ${format(Number.MAX_VALUE, 2)} IP without anything being forced upon you, unlike the first time you
reached ${format(Number.MAX_VALUE, 2)} antimatter. You will recieve more Eternity Points the more Infinity Points you
had before going Eternal. You will also gain one "eternitied stat" for completing an Eternity.
<br>
<br>
Eternity Point gain scales similarly to Infinity Point gain, but scaling off of Infinity Points instead of antimatter.
The base amount of EP gained at ${format(Number.MAX_VALUE, 2)} IP is ~1.62 EP, multiplied by 5 for every factor of
${format(Number.MAX_VALUE, 2)} more IP you have. This is always rounded down, which means that you will get 1 EP at
${format(Number.MAX_VALUE, 2)} IP but will not reach 2 EP until ${format(new Decimal("1e349"))}.
<b>Hotkey: E</b> will Eternity.
`,
      isUnlocked: () => PlayerProgress.eternityUnlocked,
      tags: ["eternal", "ep", "reset", "prestige", "midgame"],
      tab: "eternity/upgrades"
    }, {
      name: "Eternity Milestones",
      info: () => `
To make Eternities faster and more convenient, you will unlock various buffs as you get more "eternitied stat". These
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
      isUnlocked: () => PlayerProgress.eternityUnlocked,
      tags: ["eternities", "rewards", "automation", "midgame"],
      tab: "eternity/milestones"
    }, {
      name: "Time Dimensions",
      info: () => `
After your first Eternity, you unlock Time Dimensions. You buy them with EP and they provide Time Shards, which give
free tickspeed upgrades. These tickspeed upgrades are free in a similar manner to Replicanti Galaxies, in that they
function like normal tickspeed upgrades but don't increase their cost. These free tickspeed upgrades stay on Infinity,
but reset every Eternity.
<br>
<br>
Similarly to the other dimensions, a Time Dimension 2 produces a Time Dimension 1 and so on. Similarly to Infinity
Dimensions, your production will be reset to the amount you purchased after every Eternity, but you will keep any
upgrades to your multipliers you purchased.
<br>
<br>
Each tick threshold takes 33% more time shards than the previous (25% with the relevant time study). After
${format(300000)} upgrades, each successive free tickspeed upgrade will start counting as an additional 0.1 upgrades
for the purposes of calculating shard thresholds. For example, your ${format(300010)}th upgrade will require
1.33<sup>2</sup> (or 1.25<sup>2</sup>) times more shards than your ${format(300009)}th upgrade.
`,
      isUnlocked: () => PlayerProgress.eternityUnlocked,
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
<b>Antimatter:</b> ${format(new Decimal("1e20000"))}
<br>
<b>Infinity Points:</b> ${format(1e100)}
<br>
<b>Eternity Points:</b> ${formatInt(2)}
`,
      isUnlocked: () => PlayerProgress.eternityUnlocked,
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
challenges are similar to time studies, but often even more powerful and permanent since they don't require you to
spend theorems to have their effects.
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
      isUnlocked: () => PlayerProgress.eternityUnlocked,
      tags: ["ec", "study", "time", "rewards", "completions", "midgame"],
      tab: "challenges/eternity"
    }, {
      name: "Time Dilation",
      // This could use a rewrite the sentence structure and grammer is kind rough
      info: () => `
Time Dilation is unlocked when you purchase the 5,000 TT time study after
beating both EC11 and EC12 five times, and after acquiring a total of 13,000 TT.
Dilating time will start a modified Eternity, called Time Dilation, in which all of your Normal/Infinity/Time
Dimension multipliers’ <i>exponents</i> and the tickspeed multipliers’ <i>exponent</i> will raised to the power of
0.75, significantly reducing them.
<br>
<br>
If you can reach ${format(Number.MAX_VALUE, 2)} IP and then complete the Eternity while dilated, you will be rewarded
with Tachyon Particles. You can dilate as many times as you want, but Tachyon Particles cannot be "farmed" like other
resources. Instead, you can only gain more Tachyon Particles by passing your previous highest antimatter within Time
Dilation, and you will only gain more based on your <i>new</i> highest antimatter from this new run.
<br>
<br>
Tachyon Particles generate another currency called Dilated Time. Dilated Time is translated into Dilated Galaxies by
reaching thresholds similarly to free tickspeed upgrades from Time Dimensions. These Dilated Galaxies are like
Replicanti Galaxies in that they affect tickspeed as if they were Antimatter Galaxies but they don't increase the cost
of your next Antimatter Galaxy.
<br>
<br>
Unlocking Time Dilation also unlocks upgrades you can purchase using Dilated Time. The first row of Dilation upgrades
can be repeatedly purchased as many times as you can afford them.
`,
      isUnlocked: () => DilationTimeStudyState.studies[1].isBought || PlayerProgress.realityUnlocked,
      tags: ["dial", "dt", "dilated", "tachyon", "particle", "study", "free", "galaxy", "midgame"],
      tab: "eternity/dilation"
    }, {
      name: "Reality",
      info: () => `
When you reach ${format(5e9)} time theorems, ${format(new Decimal("1e4000"))} EP, and have completed the first 13 rows
of achievements, you will be able to purchase the time study that unlocks Reality. Unlocking it opens a new tab, where
you can find the button to make a new Reality. Starting a new Reality will reset everything you have done so far
except challenge times and total antimatter, but in exchange gives you a new currency known as Reality Machines, a
Glyph, and a Perk Point.
<br>
<br>
Unlike the other resets so far, you also lose the first 13 rows of achievements - that is, all of the pre-Reality
achievements and all of their associated rewards. You need to re-do them in order to get their rewards again, but
you will also passively unlock the next incomplete achievement every half hour without any effort even if you
otherwise don't have the requirements to do so. This also happens offline at the same rate.
<br>
<br>
Reality Machines can be spent on different upgrades throughout the Reality tab and are your primary currency from this
point onwards. Glyphs are equippable objects which you must equip in order to use their boosts. Perk points are another
currency that can be spent in the Perks subtab on different Perks.
<br>
<br>
Reality Machines scale purely off of EP, and the Reality button will tell you how much EP you need in order to gain
the next one. The first 10 RM scale linearly in the exponent between ${format(new Decimal("1e4000"))} EP and
${format(new Decimal("1e5334"))} EP, and then past that RM = 1000<sup>log10(EP)/4000 - 1</sup>.
<br>
<br>
Glyph level scales off of a combination of Eternity Points, Replicanti, and Dilated Time. The minimum level is 1.
<br>
<br>
You get exactly 1 Perk Point per Reality.
`,
      isUnlocked: () => PlayerProgress.realityUnlocked,
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
Rarity - This is a percentage, between 0% and 100%, which also affects the strength of your Glyph. This is random, but
can be influenced by various upgrades.
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
The slots in the first row of your inventory are "protected" slots. New glyphs will never be placed into them (even if
there is no more room in your inventory), and they are unaffected by the Sort and Auto clean buttons.
<br>
<br>
You can delete Glyphs from your inventory by shift-clicking them, which will prompt you with a confirmation dialog
asking if you are sure you want to delete the Glyph. Holding shift and ctrl together while clicking will bypass this
dialog. <b>However, deleting Glyphs will give you no benefit beyond clearing up inventory space if you do so before
unlocking Glyph Sacrifice from a Reality upgrade!</b>
`,
      isUnlocked: () => PlayerProgress.realityUnlocked,
      tags: ["reality", "sacrifice", "level", "endgame", "lategame"],
      tab: "reality/glyphs"
    }, {
      name: "Perks",
      info: () => `
Perks are a type of upgrade unlocked upon Reality. Each Perk effect varies, but most are QoL (quality of life)
improvements which you can choose your own path through. All Perks only require 1 Perk Point to buy.
<br>
<br>
Each Reality you gain 1 Perk Point which can be spent on a upgrade on the tree, starting with "You can now choose
from 3 glyphs on Reality". You can only unlock Perks which are directly adjacent to Perks you already have,
although there are loops in the tree which you can go through in either direction.
`,
      isUnlocked: () => PlayerProgress.realityUnlocked,
      tags: ["pp", "reality", "tree", "endgame", "lategame"],
      tab: "reality/perks"
    }, {
      name: "Automator",
      info: () => `
The Automator is unlocked upon reaching 5 Realities.
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
      isUnlocked: () => player.realities >= 5,
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
Interval - How long the Black Hole is inactive between bursts, reduced by 20% per upgrade.
<br>
Power - How much faster the game runs during the temporary speed bursts, increased by 35% per upgrade.
<br>
Duration - How long each speed burst lasts before going back to normal speed, increased by 30% per upgrade.
<br>
<br>
Once you reach 2 years of game playtime, you unlock a Reality upgrade that allows you to have two Black Holes. This
requirement is itself boosted by the Black Holes, so it takes much less than 2 real-time years.
<br>
<br>
Once the interval upgrade goes below 100ms of inactive time, it drops to 0ms and the Black Hole becomes permanently
active. This is tracked separately for the two Black Holes.
<br>
<br>
The timer on the second Black Hole only advances when the first Black Hole is active. So, for example, if the first
Black Hole has a duration of 4 minutes and the second has an interval of 8 minutes, Black Hole 2 will only activate
once every two cycles of Black Hole 1 regardless of how short Black Hole 1's interval is.
<br>
<br>
The Black Holes can be paused, completely halting their interval/duration cycle. However, when unpausing them, it will
take ${BlackHoles.ACCELERATION_TIME} real-time seconds for them to reach maximum speed if they were paused while their
speed boost was active.
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
Teresa is the first Celestial. It is unlocked by obtaining all of the Reality upgrades.
<br>
On the main screen, there is a bar with a button above it that says "Pour RM". This allows you to put your RM into the
container for a Reality Machine multiplier. RM which has been poured into the container can't be retrieved.
When you reach ${format(TERESA_UNLOCKS.RUN.price)} RM inside of the container, you unlock Teresa's Reality.
<br>
<br>
When you complete Teresa's Reality, your Glyph Sacrifice is multiplied based on the amount of antimatter gained during
the run. Completing Teresa's Reality is only part of the story; you need to keep pouring RM in order to progress. Once
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
It is unlocked by pouring at least ${format(TERESA_UNLOCKS.EFFARIG.price)} RM into Teresa's container.
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
Effarig's final unlock is its own Reality at ${format(GameDatabase.celestials.effarig.unlocks.run.cost)} Relic
Shards. Its Reality is divided into three layers: Infinity, Eternity, and Reality. You must complete each layer before
getting access to the next one. Completing Effarig's Eternity unlocks the next Celestial.
<br>
<br>
Completing Effarig's Reality unlocks a new Glyph type: <font color="#e21717">Effarig</font> Glyphs. Effarig Glyphs have
7 different possible effects, which you can view in the "Advanced Mode" settings. You can only have one Effarig Glyph
equipped at a time, and they can still only have at most 4 effects.
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
Automatic Glyph Sacrifice is purchaseable for ${format(GameDatabase.celestials.effarig.unlocks.autosacrifice.cost)}
Relic Shards. This lets you automatically reject the Glyph you would get from finishing the Reality if it doesn't meet
a requirement you specify. You have five options:
<br>
<b>Auto sacrifice disabled</b> - This is the original behavior you had before this upgrade. New Glyphs you get every
Reality will be untouched by this feature.
<br>
<b>Auto sacrifice all</b> - Every Glyph you would normally get is instead immediately sacrificed and adds to your Glyph
Sacrifice totals appropriately.
<br>
<b>Rarity Threshold Mode</b> - The Glyph you get will be compared to a type-specific rarity threshold you specify. If
it's above the threshold then the Glyph is kept and put into your inventory, otherwise it is sacrificed.
<br>
<b>Specified Effect Mode</b> - In addition to the behavior in Rarity Threshold Mode, the Glyph will also be checked for
having a minimum number of effects and having all of the effects you choose. It must satisfy all three of these
conditions to be chosen, otherwise it is sacrificed.
<br>
<b>Advanced Mode</b> - Like Specified Effect Mode, but you have even finer control over the effects of your Glyphs. The
"score" of a Glyph is calculated from its rarity plus the score of each effect it has, and this score must be higher
than an amount you specify in order for the Glyph to be chosen. One possible way you can use this behavior is to give
a weaker effect a value of 5, which allows you to keep Glyphs without that effect as long as they are rarer.
<br>
<br>
<i>Note: If desired, "Specified Effect Mode" and "Advanced Mode" can be used to filter out some Glyph types entirely;
for example setting impossible conditions like "at least 6 effects" or "Minimum score 999 and all effects worth 0" on
Power Glyphs will make it so that a Power Glyph is never picked.</i>
<br>
<br>
Automatic Glyph Picking is purchaseable for ${format(GameDatabase.celestials.effarig.unlocks.autopicker.cost)} Relic
Shards. This gives you three options for choosing Glyphs after each Reality:
<br>
<b>Auto pick random</b> - This is the behavior before this upgrade; the game looks at your possible choices and just
takes one of them at random before considering your filtering settings on that single Glyph.
<br>
<b>Auto pick rarest</b> - Out of all your choices, it chooses the one with the highest rarity. Then it takes that Glyph
and checks your filter settings to see if it should be kept. The rarest Glyph will be guaranteed to have the highest
sacrifice value out of all your options.
<br>
<b>Auto pick farthest above threshold</b> - This checks your filter settings against <i>all</i> of your Glyph choices,
and then picks which one is the best according to your settings. For disabled/all, this effectively picks at random.
For rarity/effect, it calculates (rarity - threshold) for each choice and chooses the one with the highest value,
ignoring Glyphs without the right effects on effect mode. For advanced, it picks the Glyph that is the farthest above
the minimum score for its type.
`,
      isUnlocked: () => EffarigUnlock.adjuster.isUnlocked,
      tags: ["glyph", "weight", "adjustment", "sacrifice", "filter", "advanced", "threshold", "reality", "lategame",
        "endgame"],
      tab: "celestials/effarig"
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
Charging your Black Hole gives you stored time, which it does at the expense of setting your game speed to 1. The game
is in effect using your increased game speed in order to store time itself. Its main use is to discharge the Black
Hole, which takes your stored time and applies it all at once in a single tick, making the game run as if you had an
effective game speed even higher than you normally have for a single instant.
<br>
<br>
Storing real time completely stops all production, effectively pausing your game. For every real-time second that
passes, you gain stored real time (modified by some efficiency factor). You can use stored real time in order to
amplify a Reality in the Glyphs tab. This uses all of your stored real time at once in order to attempt to repeat that
exact Reality over and over, giving you all the rewards you would normally get from the repetitions. For example, if
you have 50 minutes stored and amplify a Reality which has lasted 10 minutes and would give ${format(1e30)} RM and
${format(1e12)} Relic Shards, the amplified Reality will give you ${format(5e30)} RM, ${format(5e12)} Relic Shards,
5 Glyphs (subject to your filtering settings), and 5 Perk Points.
<br>
You can toggle a setting to automatically store offline time as stored real time.
<br>
<br>
Their first unlock costs ${format(TimeSpan.fromMilliseconds(ENSLAVED_UNLOCKS.FREE_TICKSPEED_SOFTCAP.price).totalYears)}
years of stored time. It increases the free tickspeed softcap (the point at which their cost starts increasing faster)
by ${format(1e5)} tickspeed upgrades.
<br>
<br>
At ${format(TimeSpan.fromMilliseconds(ENSLAVED_UNLOCKS.RUN.price).totalYears)} years, you are able to finally unlock
their Reality. The reward for completing The Enslaved Ones' Reality is unlocking Tesseracts. The Enslaved Ones will not
directly unlock the next Celestial.
`,
      isUnlocked: () => EffarigUnlock.eternity.isUnlocked,
      tags: ["reality", "time", "blackhole", "lategame", "endgame", "testers",
        "ikerstream", "realrapidjazz", "saturnus", "earth", "garnet", "pichusuperlover"],
      tab: "celestials/enslaved"
    }, {
      name: "Tesseracts",
      // TODO Expand upon this when mechanics are finalized
      info: () => `
Tesseracts are a new resource you unlock for completing The Enslaved Ones' Reality.
<br>
<br>
Infinity Dimensions are normally capped at ${format(HARDCAP_ID_PURCHASES)} total purchases, which limits how large
their multipliers can grow since eventually you can't upgrade them any more. Tesseracts allow you to raise this cap
by spending Infinity Points.
<br>
<br>
The cost of Tesseracts increases super-exponentially, but each successive Tesseract is significantly more powerful than
the last in order to make up for that. Tesseract count is never reset, meaning that once purchased, you don't need to
reach the IP cost again in order to take advantage of the raised cap in later realities.
`,
      isUnlocked: () => Enslaved.isCompleted,
      tags: ["reality", "lategame", "endgame", "tesseract", "id"],
      tab: "celestials/v"
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
which contains the nerfs to V's Reality, which are as follows:
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
      isUnlocked: () => Achievement(151).isUnlocked,
      tags: ["reality", "lategame", "endgame", "girlfriend", "challenges"],
      tab: "celestials/v"
    }, {
      name: "Ra, Celestial of the Forgotten",
      alias: "Ra",
      info: () => `
<h1>Work in Progress</h1>
`,
      isUnlocked: () => V.has(V_UNLOCKS.RUN_UNLOCK_THRESHOLDS[3]),
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
