import { GameDatabase } from "./game-database";

GameDatabase.changelog = [
  /**
   * @template
   * {
   *  @property {Array: Number} date  Date of the release of the update, stored in order of year-month-date.
   *  @property {String} name         Name of the update entry. Optional.
   *  @property {Number} id           Unique ID for each entry (generated in-game, not explicitly stated)
   *  @property {function: @return String} info  Text body of information for the entry.
   * }
   */
  {
    date: [2018, 6, 17],
    name: "This Update Sucks",
    info: `
<b>MAJOR STUFF:</b><br>
<ul>
<li>TIME DILATION</li>
<li>3 ROWS OF SECRET ACHIEVEMENTS</li>
<li>Added more Nicholas Cage.</li>
<li>1 new row of achievements.</li>
<li>Added 3 study tree save slots.</li>
<li>Greatly improved performance. (up to 5x in certain cases, ~3x in almost all cases)</li>
<li>Nerfed EC10 reward. ((infinities * EC10 completions * 0.000002+1) >
(infinities ^ 0.9 * EC10 completions * 0.000002+1))</li>
<li>Added even more Nicholas Cage.</li>
<li>Time study 11 has been capped at 1e2500 and now displays its current multiplier.</li>
<li>Time study 193 has been buffed, requires ~1012680 eternities to cap, rather than 1.5m, and is now capped at 1e13000
instead of ~1.81e12900/1.5m eternities. (1.02^x) > (1.03^x)</li>
<li>The second eternity upgrade has been buffed, and now soft caps at 100k, rather than 125k. The end result is very
slightly higher. ((x/300)^log4(2x)) > ((x/200)^log4(2x))</li>
<li>EC1 now requires 20k eternities per tier to unlock, down from 25k.</li>
<li>TD cost scaling has been increased after costs of 1e1300. (this is in addition to the current increase)</li>
<li>Added additional galaxy cost scaling after 800 galaxies.</li>
<li>Added a button to buy the maximum amount of eternity point multipliers at once.</li>
<li>Offline progress processes ~5x faster, and now simulates autobuyers. (please note that offline progress is still
capped at 1000 ticks, with additional ticks increasing the production of said 1000 ticks)</li>
<li>Added a new save file system that allows 3 different save files at once all with cloud save enabled, along with
a new cloud save UI.</li>
<li>Added an animation to visualize your multiplier gain when you purchase 10 of a dimension, dimension boost/shift,
or sacrifice.</li>
<li>Nicholas Cage.</li>
<li>Added an animation to big crunches. This will only trigger if you haven't eternitied, have a fastest infinity time
above 1 minute, and haven't broken infinity.</li>
<li>Added a button in the options menu to disable individual animations.</li>
<li>Added more news ticker entries</li>
</ul>
<br>
<b>Minor stuff:</b><br>
<ul>
<li>Reduced the space between the secondary eternity tab buttons.</li>
<li>The EC3 description now specifies that dimensional sacrifice is disabled.</li>
<li>Autobuyer inputs now support commas and notation on exponents.</li>
<li>When purchasing the EP or IP multipliers, autobuyer inputs will now always format the updated value above 1000.</li>
<li>The size and placement of the auto IP multiplier and auto RG toggles have been adjusted to fit with the other auto
toggles.</li>
<li>Total time played now increases at a normal rate inside EC12.</li>
<li>Fastest infinity time now updates normally inside EC12.</li>
<li>The time theorem purchasing background is now 20 pixels wider.</li>
<li>Changed the wording on time study 133 for clarity.</li>
<li>Added various missing periods to achievements.</li>
<li>Improved chart performance. (it's still pretty laggy if your settings are too high)</li>
<li>You can now purchase study 201 while you have EC11/12 bought, but you cannot purchase another path.</li>
<li>Purchasing study 131 no longer turns off your replicanti galaxy autobuyer, but instead displays it as disabled.</li>
<li>You can now purchase another split using shift while you have study 201.</li>
<li>You now purchase max galaxies manually by clicking or using the hotkey with more than 6 eternities.</li>
<li>You can now purchase single dimension boosts and galaxies by holding shift while purchasing.</li>
<li>ID8 will now display a rate of change after completing EC7 at least once.</li>
<li>Added an oxford comma to formatted time values.</li>
<li>Made the dimensional sacrifice button 40px wider to prevent the text overflowing.</li>
<li>Made the all tab eternity and infinity point displays 30px wider to prevent the text overflowing.</li>
<li>Moved the big crunch button up to prevent blocking the statistics and achievement tab buttons.</li>
<li>Moved the eternity and infinity buttons inwards to prevent the HTML layout jumping around.</li>
<li>Fixed the placement of certain footers.</li>
<li>Fixed a typo where a news ticker said "Dimesional Sacrifice" instead of "Dimensional Sacrifice"</li>
<li>Fixed a bug where TDs displayed a 2x multiplier per purchase when they actually gave a 4x multiplier.</li>
<li>Fixed a bug where study 51 wouldn't respect notation.</li>
<li>Fixed a bug where the infinity challenges tab would always show.</li>
<li>Fixed a bug where the auto RG toggle would jiggle left and right 1 pixel in certain cases.</li>
<li>Fixed a bug where the rate of change on the 7th dimension wouldn't take into account ID1 while in EC7.</li>
<li>Fixed a bug where EC12 displayed 0.1 seconds after 5 completions, but actually required 0.0 seconds.</li>
<li>Fixed a bug where tickspeed elements wouldn't hide correctly in certain cases.</li>
<li>Fixed a bug where bought eternity challenge unlock studies would show as gray in the dark theme rather than a deep
purple.</li>
<li>Fixed a bug where dimensions 5-8 would hide upon eternity even with the 30 eternity milestone.</li>
<li>Fixed a bug where popup colors weren't inverted in the inverted and inverted metro themes.</li>
<li>Fixed a bug where the eternity point amount wouldn't show when you imported a save with eternity points into a save
without them.</li>
<li>Fixed a bug where locked eternity challenges didn't have a hover effect in the dark metro theme.</li>
<li>Fixed a bug where popups weren't properly centered.</li>
<li>Fixed a bug where ID autobuyers would purchase IDs upon unlock even while disabled.</li>
<li>Fixed a bug where study tree branches drawn to row 22 were off-centered.</li>
<li>Fixed a bug where EP/min and IP/min peaks wouldn't update properly upon import.</li>
<li>Fixed a bug where infinity dimension autobuyers wouldn't hide properly upon import.</li>
<li>Fixed a bug where the IP multiplier autobuyer wouldn't hide properly upon import.</li>
<li>Fixed a bug where the option to change big crunch modes wouldn't hide properly upon import.</li>
<li>Fixed a bug where the max buy galaxy interval setting wouldn't hide properly upon import.</li>
<li>Fixed a bug where the RG autobuyer wouldn't hide properly upon import.</li>
<li>Fixed a bug where the eternity confirmation option wouldn't hide properly upon import.</li>
<li>Fixed a bug where the replicanti upgrade autobuyers wouldn't hide properly upon import.</li>
<li>Fixed a bug where your update rate wouldn't update upon import.</li>
<li>Fixed a bug where the chart line color wouldn't update properly upon import.</li>
<li>Fixed a bug where achievement images were being cut off by 4 pixels on the right and bottom sides.</li>
<li>Fixed a bug where "Yo dawg, I heard you liked infinities..." only required 1e300 times the previous infinity.</li>
<li>Fixed a bug where the auto sacrifice interval would still display as 0.10 seconds even with the
double autobuyer speed breaking infinity upgrade.</li>
<li>Fixed a bug where certain time studies were 1 pixel too far to the left or right.</li>
<li>Fixed a bug where studies 223 & 224 weren't taken into account when displaying antimatter galaxies as
distant antimatter galaxies.</li>
<li>Fixed a bug where study 227 would multiply your 4th time dimension production by 0
if you had no sacrifice bonus.</li>
<li>Fixed a bug where the game would say "You have 1 eternity points." rather than "You have 1 eternity point.".</li>
<li>Fixed a bug where popups would remain open after changing tabs.</li>
<li>Fixed a bug where you were able to select the achievement images by clicking and dragging over them.</li>
<li>Fixed a bug where studies 233 and 234 had the wrong classes assigned to them on load.</li>
</ul>
`
  },
  {
    date: [2018, 4, 1],
    name: "Fixed a Bug where there wasn't an Update",
    info: `
Huge thanks to Omsi for helping me a ton with this.<br><br>
<b>MAJOR STUFF:</b><br>
<ul>
<li>2 NEW ETERNITY CHALLENGES</li>
<li>12 NEW TIME STUDIES</li>
<li>Time study 132 has been buffed from a 30% bonus to a 40% bonus.</li>
<li>Added an achievement bonus for "Popular music": "Replicanti galaxies divide your replicanti by 1.79e308 instead of
resetting them to 1."</li>
<li>Added an achievement bonus for "IT'S OVER 9000": "Sacrifice doesn't reset your dimensions."</li>
<li>Added an achievement bonus for "Like feasting on a behind": "IP multiplier based on time spent this infinity."</li>
<li>Added an achievement bonus for "What do I have to do to get rid of you": "Time dimensions are multiplied by
the number of studies you have."</li>
<li>Added "Infinity" notation.</li>
<li>Added "Brackets" notation.</li>
<li>Added an import/export system for the time study tree.</li>
<li>Added an EP/min & peak EP/min display to the eternity button.</li>
<li>Added an eternity hotkey.</li>
<li>Added something to help you pick your theme.</li>
<li>Added a few more IAPs.</li>
<li>Reduced the cost of "Double IP gain from all sources" IAP from 50 ➜ 40</li>
</ul>
<br>
<b>Minor stuff:</b><br>
<ul>
<li>Added an option to not plot drops in production on the chart. (It will instead copy the newest data point)</li>
<li>Added displays for the current bonuses from time studies 71, 72, and 73.</li>
<li>Built up speed for 6 hours to do it in 0.5x A presses.</li>
<li>Changed study 72 to only work on the 4th infinity dimension, but doubled its power. (No effective change)</li>
<li>Alchemy 120 (Vivification) scaling decreased.</li>
<li>Fixed a bug where the buttons to purchase time studies wouldn't move in inverted themes on firefox.</li>
<li>Fixed a bug. Antman, you're good to go.</li>
<li>Fixed a bug that gave you the ability to set a custom name for your theme when using a secret theme.</li>
<li>Fixed BLJ. Shoutout to SimpleFlips.</li>
<li>Fixed a bug that caused purchasing the EP multiplier to require multiple clicks.</li>
<li>Removed the ghost from the game. Was annoying.</li>
<li>Fixed a bug that allowed you to earn "Long lasting relationship" in EC7.</li>
<li>Monkeys no longer eat humans, as intended.</li>
<li>Fixed a bug where the reward from EC7 could display -1.</li>
<li>Increased the drop rate of collector's pendant items by 20%.</li>
<li>Fixed a bug where the infinity requirement for EC4 could be less than 0.</li>
<li>Transcension gives less Ancient Souls.</li>
<li>Fixed a bug where the visual display for autobuyer bulk buy settings wouldn't update upon your first eternity.</li>
<li>Fixed the rickroll. Now it's properly not working.</li>
<li>Fixed a bug where the EP multiplier would break if its power exceeded 1.79e308.</li>
<li>Leeroy Jenkins' Battlecry now doesn't trigger Patches.</li>
<li>Fixed a bug where the confirmation for starting an infinity challenge would say you need to reach infinity.</li>
<li>Cursors now do circles around the cookie.</li>
<li>Fixed a bug where the offline progress popup would simply say "While you were away" if nothing happened.</li>
<li>Traction has been slightly increased to reduce unwanted drifts.</li>
<li>Fixed a bug that in rare cases would cause the offline progress popup to say you gained "NaNeInfinity" time shards
or infinity power.</li>
<li>Fixed a bug where the tickspeed visual display wouldn't update upon any form of reset.</li>
<li>Bugged a fix where eternity was dumb.</li>
<li>CS now makes notes go faster in mania.</li>
<li>Fixed a bug where replicanti were hidden but still unlocked if you eternitied for the 50th time
while they were locked.</li>
<li>Dirt is now more abundant.</li>
<li>Fixed a bug where the 1st dimension wasn't producing the 0th dimension.</li>
<li>Fixed a bug where The Nameless Ones were too easy.</li>
<li>Fixed a bug where in a specific case, 2 eternity challenges would appear as running at the same time.</li>
<li>Increased TukkunFCG YC rewards by 15%.</li>
<li>Added more space. SPAAAAAAACE</li>
<li>Fixed a bug where the eternity challenges tab would hide after refreshing with less than 1e2000 antimatter.</li>
<li>Fixed a bug where eternity challenges wouldn't update correctly upon import.</li>
<li>Fixed a bug where dimension display values wouldn't update in certain cases.</li>
<li>Portals are now not red.</li>
<li>Fixed a bug where the ON/OFF text on the challenge confirmation option wasn't capitalized upon load.</li>
<li>Reduced GRB's autokill threshold to 2500/2000 power/toughness.</li>
<li>Fixed a typo where the eternity confirmation option said "Eternity confimation".</li>
<li>Added bugs because Omsi wants more bugs to fix. Absolute legend, I'm telling you, the queen is legendary.</li>
<li>Fixed a typo where the reward for "That's faster!" said you started with 20000 antimatter, rather than 200000.</li>
<li>Added depression to your themes.</li>
<li>Fixed inconsistencies with the standard notation naming convention.</li>
<li>Tried to fix a bug where the game was bad but failed. The game is still bad.</li>
<li>Changed the wording on EC4 to say "X or less" rather than "less than X".
(It always worked this way, this is just a correction)</li>
<li>Made donkeys less fast, so you can actually catch them now.</li>
<li>Changed the wording on the EC2 reward to say "affects 1st Infinity Dimension" rather than
"affects Infinity Dimensions". (It always worked this way, this is just a correction)</li>
<li>Increased the base breeding speed of trimps by 10%.</li>
<li>You can now click through the footer and progress bar to access buttons that they are overlapping.
(This is for smaller screens)</li>
<li>Made periods longer.</li>
<li>Added loot boxes.</li>
<li>Removed loot boxes.</li>
<li>Added various missing periods to achievement descriptions.</li>
<li>Added a missing period to time spent in this eternity.</li>       
Increased the price of creation count increases from 50 god power to 60.</li>
<li>Added a missing space to the "Autobuyers work twice as fast." upgrade.</li>
<li>Manually buying max dimension boosts no longer requires 10 eternities or more, and now only requires the bulk buy
dimension boosts breaking infinity upgrade.</li>
<li>Did a barrel roll.</li>
<li>Added more useless patch notes</li>
</ul>
`
  },
  {
    date: [2018, 2, 1],
    name: "Eternity Challenges",
    info: `
<ul>
<li>NEW TIME STUDIES</li>
<li>2 new achievement rows</li>
<li>Made certain news messages only show if you have reached certain levels of progression</li>
<li>Massively improved performance of calculating dimension costs thanks to SpectralFlame.
(Cuts cpu usage by up to 2/3 in late-game)</li>
<li>New news (get it?) ticker entries.</li>
<li>Added a production chart.</li>
<li>Added new statistics to replace the scale statistic after 1e100000 antimatter.</li>
<li>Added a new milestone for 30 eternities: "Start with all normal dimensions available for purchase".</li>
<li>Added an option to change the update rate of the game, ranging from 33ms to 200ms.
(before this, it was locked at 50ms)</li>
<li>The game now partially simulates offline progress, instead of estimating it.</li>
<li>Added 3 new eternity upgrades.</li>
<li>Added a reward to the "NEW DIMENSIONS???" achievement, "Your achievement bonus affects Infinity Dimensions."</li>
<li>Buffed time study 111. (10 ^ (log10(antimatter) / 290- 0.75)) > (10 ^ (log10(antimatter) / 285- 0.75))</li>
<li>Buffed time study 83. (1.0001^x) > (1.0004^x)</li>
<li>Nerfed eternity upgrade 1. ((x+1)^3) > (x+1)</li>
<li>Nerfed eternity upgrade 2. (x^log4(2x)) > ((x/300)^log4(2x) with harsher formula above 125,000)</li>
<li>Fixed a bunch of bugs and changed a bunch of things. (more detail below)</li>
<li>Added buy max buttons to Time Dimensions and Time Theorems.</li>
<li>Added a hotkey for replicanti galaxies. (R)</li><br>
<li>Nitty gritty:</li>
<li>Greatly improved the performance of calculating bonus tickspeed from time dimensions.</li>
<li>Replaced all references to soft resets with references to dimension boosts.</li>
<li>Made achievements update on import/hardreset.</li>
<li>Made the game take into account your infinity points gained on crunch for the purposes of
eternity point gain when you eternity.</li>
<li>The replicanti interval is now displayed after and reductions / increases.</li>
<li>Added missing periods to various achievements.</li>
<li>Made the bonus from time study 131 display next to max replicanti galaxies.</li>
<li>Added time dimensions to the info scale.</li>
<li>Changed the description of time study 31 to "Powers up bonuses that are based on your infinitied stat
(to the power of 4)" from "Powers up existing upgrades based on infinitied stat (to the power of 4)".</li>
<li>Changed the description of "MAXIMUM OVERDRIVE" to say "Big Crunch with X" instead of "Reach X".</li>
<li>Added "with reduced effect" to the description of time study 71, 72, and 73.</li>
<li>Changed the text on autobuy max dimension boosts to "Buy max dimboosts every X seconds:"
from "Max dimboost interval:". (To achieve parity with the autobuy max galaxies text)</li>
<li>Made the challenges button always show if you have more than 1 eternity.</li>
<li>Fixed centering issues with infinity and eternity upgrades.</li>
<li>Various minor changes to themes to improve consistency. (Too minute to list, even here)</li>
<li>Made the eternity autobuyer number multiply by 5 when you buy the eternity point multiplier.</li>
<li>Increased the requirement for "Is This Hell?". (5 > 6.66 seconds)</li>
<li>Reduced the starting replicanti interval upgrade cost. (1e160 > 1e140)</li>
<li>Galaxies are labeled "Distant Antimatter Galaxies" when the cost scaling starts. (At 100 galaxies)</li>
<li>Dimensions no longer produce anything after reaching challenge goal, or after reaching infinity with fixed infinity.
This is due to the c6 being abusable.</li>
<li>Made the 7 and 25 eternity milestones work much faster.</li>
<li>After unlocking bulk dimboosts, clicking dimension boost or pressing D will buy max dimension boosts.</li>
<li>Moved fake news, don't you dare to sleep, spreading cancer, and one for each dimension to rows 2, 3, 4,
and 7 respectively.</li>
<li>Added a visual display of how many galaxies/dim boosts you have next to the cost.</li>
<li>Added an explanation of hotkeys to the options page.</li>
<li>Made shift+1-8 purchase singular dimensions and shift+T purchase a singular tickspeed upgrade.</li>
<li>Reworked the display of the buy time theorem buttons.</li>
<li>The milestones page now has 2 columns.</li>
<li>Extended support for standard notation to e3e18, and letter/cancer notation (almost) infinitely.</li>
<li>Added support for standard, letter and logrithm notation in autobuyer inputs.</li>
<li>Added "in a challenge" to the description of "Zero Deaths".</li>
<li>Made most large numbers in achievements be listed in your chosen notation.</li>
<li>Nerfed "Gift From The Gods"'s achievement reward.</li>
<li>Made purchasing time theorems with EP require at least 1 time dimension.</li>
<li>First eternity now takes you to the time dimensions tab.</li>
<li>Time dimension prices now have 2 decimal places.</li>
<li>Reformatted the tick interval reduction text for very small numbers.</li>
<li>The game now keeps track of when you automatically do an infinity, and you can passively gain IP based off the
IP/min in that run if you go offline (but only if infinity isn't broken).</li>
<li>Made time study 171 apply retroactively. This was causing an issue with production being much lower than expected
when going into a long run on the same run as respeccing.</li>
<li>Fixed a bug where max all wasn't giving achievements when buying dimensions.</li>
<li>Fixed a bug where the game wouldn't show the default dimensions tab upon hard resetting.</li>
<li>Fixed a bug where time dimensions were called "X Dimension" rather than "X Time Dimension".</li>
<li>Fixed a bug where the replicanti galaxy button would show as locked if you had more than
the listed max replicanti galaxies and study 131.</li>
<li>Fixed a bug where the last ten eternities average said IP/X rather than EP/X.</li>
<li>Fixed a bug where the big crunch autobuyer said "X times since last crunch" instead of "X times last crunch".</li>
<li>Fixed a bug where the challenge records display wouldn't update upon import.</li>
<li>Fixed a bug where hotkeys wouldn't work sometimes.</li>
<li>Fixed a bug where secret theme names would display as "0" after refreshing.</li>
<li>Fixed a bug where time studies would move around when your window size was too small.</li>
<li>Fixed a bug where infinity dimensions would reset when clicking on a challenge and not entering while
challenge confirmations were on.</li>
<li>Fixed a bug where you always had the infinity challenge 1 reward.</li>
<li>Fixed a bug where eternity milestone classes weren't set correctly upon import.</li>
<li>Fixed a bug where the eternity autobuyer, sacrifice autobuyer, time dimension tab, and replicanti
wasn't hiding correctly upon import.</li>
<li>Fixed a bug where buy max dim boosts was able to buy 1 too many boosts.</li>
<li>Fixed a bug where the study tree would be off-centered if the game windows wasn't wide enough.</li>
<li>Fixed a bug where you could buy factions of dimension boosts with dimension boost bulk buy.</li>
<li>Fixed a bug where your autobuy max dimension boost interval would set itself to itself
if you eternitied while changing it.</li>
<li>Fixed a bug where secondary statistic tabs weren't hiding upon import.</li>
<li>Fixed a bug where replicanti galaxies wouldn't give a bonus if you had less than 3 galaxies.</li>
<li>Fixed a bug where the dimension boost autobuyer would ignore dimension boost costs until they costed 8th dimensions.
</li>
<li>Fixed a bug where the future shop multipliers were displayed before the x rather than after.</li>
<li>Fixed a bug where the challenge confirmation button's off and on were lowercase.</li>
<li>Fixed a bug where the static infinity point display would disappear after eternity.</li>
</ul>`
  },
  {
    date: [2017, 12, 1],
    name: "\"Eternity\" update",
    info: `
<ul>
<li>Time studies tree with free respec</li>
<li>Eternity Milestones with tons of automation</li>
<li>Eternity upgrades</li>
<li>TIME DIMENSIONS</li>
<li>REPLICANTIS</li>
<li>More themes made by Omsi</li>
<li>Disable hotkeys option</li>
<li>Current IP/min post-break</li>
<li>Infinity Challenge times</li>
<li>Past 10 eternities</li>
<li>Lowered IP multiplier cost by 1 Order of magnitude.</li>
<li>3 more rows of achievements</li>
<li>Infinity challenge reward nerfs (1st: 1.5x ➜ 1.3x; 3rd: lowered; 4th: mult^1.1 ➜ mult^1.05)</li>
<li>More news ticker entries</li>
<li>Immensely improved performance thanks to break_infinity.js made by Patashu, it replaces decimal.js</li>
<li>Added LZString for cloud saving purposes.</li>
<li>Achievement refractoring to reduce save string size made by StrangeTim.</li>
<li>Commas between exponents option for numbers higher than e100000</li>
<li>Added logarithm notation</li>
<li>Made letter and cancer notation last longer.
</ul>
`
  },
  {
    date: [2017, 10, 10],
    info: `
<ul>
<li>Complete refactoring for all upgrade UI.</li>
<li>Minor Upgrade Changes. (Capping some upgrades)</li>
<li>Kred shop- 3 paid Upgrades- More upgrades (and upgrade improvements) coming in the future.</li>
<li>8 new Achievements- Achievement Rewards have also been added.</li>
<li>Infinity Challenges- additional challenges to do going from Inf Dim 2 to current end game and beyond.</li>
<li>Main Screen UI updates- IP points are now visible everywhere.</li>
<li>Hotkeys- C for Big Crunch, M for Max All, S for Dimensional Sacrifice, D for Dimension Shift/Boost,
G for Antimatter Galaxy, Numbers 1-8 for Buy 10 (D1-8), A for Toggle Autobuyers.</li>
<li>Bug Fixes- At least 2, including a percentage buff.</li>
</ul>`
  },
  {
    date: [2017, 9, 25],
    info: `
<ul>
<li>NEW DIMENSIONS?</li>
<li>Super Secret Post-Infinity Dimensions added. Get more antimatter to find out!</li>
<li>Post-break double galaxy upgrade nerfed. It now gives 50% more.</li>
<li>Four new post-break upgrades added.</li>
<li>Scaling of the dimension cost multiplier increased.</li>
<li>Eight new achievements added.</li>
<li>Cloud saving maybe added.</li>
<li>Refunded Dimension cost increase multiplier and changed the cost.</li>
</ul>`
  },
  {
    date: [2017, 9, 19],
    name: "Breaking Infinity",
    info: `
<ul>
<li>Post infinity content added (Breaking infinity), requires big crunch speed to be maxed.</li>
<li>New upgrade tree pre-breaking, included one upgrade that be taken multiple times to
increase infinity point gains.</li>
<li>Eight late game post-breaking upgrades.</li>
<li>Eight new achievements.</li>
<li>Reworked autobuyer prices and times, full refund for all points spent on them.</li>
<li>Autobuyers now can be upgraded beyond 0.1 seconds, and they also now 'wait' after their interval has passed,
instantly buying once they are able to.</li>
<li>Automatic DimBoosts, Galaxies, and Big Crunches now have an input box.</li>
<li>Unique achievement rewards for multiple achievements.</li>
<li>Zero galaxies now gives 11% tickspeed.</li>
<li>Galaxies past two give diminishing returns, Faster than a Potato made easier to compensate.</li>
<li>Game now updates 20 times a second with increased performance, max autobuyer speed is not impacted.</li>
<li>Autobuyer settings are now saved in between sessions.</li>
<li>Monitor scaling issues mainly fixed.</li>
<li>Priority should be working properly.</li>
<li>Big crunch button is now less obtrusive.</li>
<li>Your screen no longer defaults to the dimensions tab when you reach infinity
(if you have broken infinity or if your fastest time to reach infinity is less than one minute).</li>
<li>More statistics have been added such as record challenge times and last ten infinities.</li>
<li>Times below one minute are now kept at two decimal points of precision.</li>
<li>Percentage increase per second for dimensions 1-8 are now kept to two decimal points of precision.</li>
<li>The reset button works better now.</li>
</ul>`
  },
  {
    date: [2017, 9, 7],
    name: "Challenges",
    info: `
<ul>
<li>Added 12 challenges.</li>
<li>Added 8 new achievements.</li>
<li>Added autobuyers.</li>
</ul>`
  },
  {
    // These were originally spread throughout 28/8 to 30/8.
    // But they would otherwise hold too little content on their own
    date: [2017, 8, 30],
    info: `
<ul>
<li>Added news on top of the page.</li>
<li>Added a multiplier for completing a row of achievements.</li>
<li>New letter notation option.</li>
<li>Nerfed galaxies from +3% to +2%.</li>
<li>Added 8 new achievements.</li>
<li>Added Dimensional Sacrifice, appears at 5th dimension shift/boost.</li>
<li>More notations!</li>
<li>Bar until infinity at the bottom.</li>
<li>Some UI changes.</li>
</ul>`
  },
  {
    date: [2017, 8, 24],
    name: "Infinity",
    info: `
<ul>
<li>Now when you get to 1.7e308 antimatter, you reach infinity, and you can reset again at infinity,
gaining infinity points.</li>
<li>You can use infinity points for upgrades.</li>
<li>The game also now runs 6 hours while it is closed.</li>
<li>In addition there are some graphic updates.</li>
</ul>`
  },
  // These were originally spread throughout 3/5 to 7/5.
  // But they would otherwise hold too little content on their own
  {
    date: [2017, 5, 7],
    info: `
<ul>
<li>Added this changelog, fixed money displaying problem. Added a title to the HTML.</li>
<li>The game now works offtab.</li>
<li>Fixed the bug with costs showing for example 1000 SxTg.</li>
<li>Visual update! And statistics.</li>
<li>Added export and import options.</li>
<li>Added save button although game saves every 10 seconds.</li>
<li>Slightly smaller text and added a max all button.</li>
<li>Saves should now FINALLY work properly.</li>
</ul>`
  }
];


for (let i = 0; i < GameDatabase.changelog.length; i++) {
  const entry = GameDatabase.changelog[i];
  entry.id = i;
}