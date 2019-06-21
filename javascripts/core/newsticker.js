"use strict";

const newsArray = [
// Always visible
  ["The cookie is a lie.", "a1"],
  ["Antimatter ghosts do not exist. Just like matter ghosts. They don't have any matter, for that matter.", "a2"],
  ["Nuclear power plants have been abandoned in favor of antimatter power.", "a3"],
  ["Antimatter cookies have been confirmed to not exist, whoever claims that, stop.", "a4"],
  ["Antimatter prices have drastically dropped due to newfound abundance.", "a5"],
  ["In the news today, humans make an antimatter animal sacrifice to the antimatter god.", "a6"],
  ["You made one antimatter! Whatever that means.", "a7"],
  ["\"IN THE END, IT DOESN'T ANTIMATTER\" -hevipelle", "a8"],
  ["None of this matters.", "a9"],
  ["How does it matter if it's antimatter?", "a10"],
  ["Scientists confirm that the colour of antimatter is Blurple.", "a11"],
  ["How does NASA organise a party? They planet.", "a12"],
  ["Electrons are now seeing the happy things in life. We're calling these happy electrons 'Positrons.' Wait, that's taken?", "a13"],
  ["This completely useless sentence will get you nowhere and you know it. What a horrible obnoxious man would come up with it, he will probably go to hell, and why would the developer even implement it? Even if you kept reading it you wouldn't be able to finish it (the first time).", "a14"],
  ["\"GHOST SAYS HELLO\" -Boo-chan", "a15"],
  ["\"Can someone tell hevi to calm down?\" -Mee6", "a16"],
  ["Due to antimatter messing with physics, a creature that was once a moose is now a human.", "a17"],
  ["!hi", "a18"],
  ["\"Alright\" -Alright", "a19"],
  ["The English greeting is not present in Antimatter speak.", "a20"],
  ["To buy max or not to buy max, that is the question.", "a21"],
  ["This antimatter triggers me.", "a22"],
  ["No, mom, I can't pause this game.", "a23"],
  ["Scientific notation has entered the battlefield.", "a24"],
  ["\"Make the Universe Great Again!\" -Tronald Dump", "a25"],
  ["#dank-maymays", "a26"],
  ["A new religion has been created, and it's spreading like wildfire. The believers of this religion worship the Heavenly Pelle, the goddess of antimatter. They also believe that 10^308 is infinite.", "a27"],
  ["Someone has just touched a blob, and blown up. Was the blob antimatter, or was the guy made of Explodium?", "a28"],
  ["If you are not playing on Kongregate or ivark.github.io, the site is bootleg.", "a29"],
  ["Rate 5 on Kongregate so more people can experience this 5 star rating.", "a30"],
  ["BOO!", "a31"],
  ["\"You ate for too long.\" -Hevipelle", "a32"],
  ["\"I hate myself.\" -Boo-chan", "a33"],
  ["\"Gee golly\" -Xandawesome", "a34"],
  ["Above us, there is nothing above, but the stars, above.", "a35"],
  ["If black lives matter, do white lives antimatter?", "a36"],
  ["Somebody wasn't nice, he got an antimatter-storm.", "a37"],
  ["You are living, you occupy space, you have a mass, you matter... unless you antimatter.", "a38"],
  ["I clicked too fast... my PC is now dematerialised.", "a39"],
  ["\"If an alien lands on your front lawn and extends an appendage as a gesture of greeting, before you get friendly, toss it an eightball. If the appendage explodes, then the alien was probably made of antimatter. If not, then you can proceed to take it to your leader.\" -Neil deGrasse Tyson", "a40"],
  ["There always must be equal matter than there is antimatter, I guess your mom balances that a bit.", "a41"],
  ["Nothing is created, nothing is destroyed.", "a42"],
  ["We dug a big hole to store this antimatter... Adele's rolling in it.", "a43"],
  ["If everything is antimatter, how can you see yourself?", "a44"],
  ["The stock markets have crashed due to antimatter beings somehow knowing what they will be tomorrow.", "a45"],
  ["My dog ate too much antimatter, now he's' saying 'meow!'", "a46"],
  ["If you put infinity into your calculator it will result in 42!", "a47"],
  ["You have found the rarest antimatter pepe, it's ultra rare!", "a48"],
  ["Can we get 1e169 likes on this video??? Smash that like button!!", "a49"],
  ["The smell of antimatter has been revealed. It smells like kittens.", "a50"],
  ["Just another antimatter in the wall.", "a51"],
  ["GET SNIPED, WEAKLING", "a52"],
  ["\"Thanks a lot.\" -Dankesehr", "a53"],
  ["This world situation is an SOS situation to the world!! MAYDAY, MAYDAY!!", "a54"],
  ["\"As for sure as the sun rises in the west, of all the singers and poets on earth, I am the bestest.\" - Hevipelle", "a55"],
  ["\"I'm good at using github.\" -Hevipelle", "a56"],
  ["A new chat server has been created for antimatter people to spy on matter people, and the world has fallen into chaos and discord.", "a57"],
  ["A new study has come out linking the consumption of potatoes with increased risk of antimatter implosion. Scientists suggest eating more.", "a58"],
  ["\"I thought that I fixed that bug but apparently some update broke it again.\" -Hevipelle", "a59"],
  ["\"Maybe I'm gay then\" -Bootato", "a60"],
  ["Breaking news! Hevipelle has just announced that the buy max button is in fact going to be removed!", "a61"],
  ["I dedicate this game to my girlfriend.", "a62"],
  ["Antimatter guns don't kill antimatter people, antimatter people kill antimatter people but does that mean that antimatter toaster doesn't toast antimatter toasts, antimatter toast toasts antimatter toasts?", "a63"],
  ["But to an antimatter person, wouldn't they be matter and us antimatter?", "a64"],
  ["And nothing antimatters.", "a65"],
  ["School starting up strikes fear in students universe-wide, as schools are no longer segregated between matter and antimatter. Annihilation is prominent.", "a66"],
  ["Why does no one talk about the 0th dimension?", "a67"],
  ["The fatter catter satter on the antimatter.", "a68"],
  ["Who let the DOgs out?", "a69"],
  ["If you can't read this you disabled the news.", "a70"],
  ["Doesn't leave, just mutes the server so he doesn't receive notifications.", "a71"],
  ["\"Most quotes found online are falsely atributed.\" -Abraham Lincoln", "a72"],
  ["\"It should work now, but it doesn't.\" -Hevipelle", "a73"],
  ["This game doesn't have any errors... they're alternative successes.", "a74"],
  ["A third type of matter has been discovered: null matter. It doesn't do anything and is basically useless. The scientists who discovered it were fired.", "a75"],
  ["Your Mother-in-Law keeps nagging you about all these antimatter colliders.", "a76"],
  ["If matter exists, then does antimatter not exist?", "a77"],
  ["Antimatter=Life. Not cobblestone, not dirt, nothing like that. Antimatter.", "a78"],
  ["Breaking News: Error Error Error", "a79"],
  ["How much antiwood could an antiwoodchuck chuck if an antiwoodchuck could chuck antiwood?", "a80"],
  ["Chaos isnt a pit, chaos is a matter.", "a81"],
  ["\"That's because I'm a good game developer and pushed some code that totally works.\" -Hevipelle", "a82"],
  ["What's the matter with anti matter?", "a83"],
  ["Doesn't it annoy you when people don't finish their", "a84"],
  ["Don't anti-quote me on this.", "a85"],
  ["Antimatter is honest, matter makes up everything.", "a86"],
  ["According to no known laws of aviation, there are multiple ways a bee should be able to be swallowed up by antimatter.", "a87"],
  ["You either die as matter or live long enough to be consumed by the antimatter, and then die again.", "a88"],
  ["If you gaze long enough into the antimatter, the antimatter gazes back into you.", "a89"],
  ["\"Always gonna give you up. Always gonna let you down.\" - anti-Rick Astley", "a90"],
  ["Antimatter Dimensions: the next update is always 5 hours away. Always.", "a91"],
  ["#DimensionLivesAntimatter", "a92"],
  ["Do antimatter people with suicidal thoughts get depressants?", "a93"],
  ["To matter or to antimatter, that is the question.", "a94"],
  ["Why is everything so Hevi?", "a95"],
  ["It has been scientifically proven ages ago, that cats made of matter are assholes. We have good news, because cats made of antimatter are still assholes.", "a96"],
  ["Nobody once told me the anti-world wasn’t gonna roll me.", "a97"],
  ["Antimatter is like the internet. If you're reading this, you can't have enough of it.", "a98"],
  ["\"Antimatter has made time travel possible and I'm here to make the past great again.\" - 2nd President of the World", "a99"],
  ["Please insert Disc -1 to continue playing  Antimatter Dimensions™.", "a100"],
  ["Lore - coming soon™", "a101"],
  ["I was a part of antimatter like you once. But then I got matter in my knee.", "a101"],
  ["Antimatter... antimatter never changes... until you get to quantum physics of antimatter, but we don't have enough tachyon particles for that.", "a102"],
  ["There is no war in Antimatter Dimensions. Here we are safe. Here we are free.", "a103"],
  ["Antimatter has solved global warming. In unrelated news, the Earth no longer exists.", "a104"],
  ["Anti-water, anti-Earth, anti-fire, anti-air. Long ago, the four anti-nations lived together in harmony. Then, everything changed when the anti-Fire Nation attacked. Only the anti-Avatar, the master of all 4 anti-elements could bring balance to the anti-world, but when the world needed him most, he accidentally touched some regular matter and exploded.", "a105"],
  ["If you open an anti-lootbox, are you selling random possessions for in-game currency?", "a106"],
  ["People are beginning to question Hevipelle's existence.", "a107"],
  ["Antimatter Dimensions is proud to be sponsored by Lehmä! Now offering - grass eating lessons! Learn what grass is safe to eat and what grass isn't.", "a108"],
  ["It is the year 2422. The update still isn't out. Hevi is working on balancing unfunity dimension dimensions and challenges for the 38th layer of prestige. There are over 100 rows of achievements. They're getting ready to start using breaking_breaking_breaking_infinity.js", "a109"],
  ["Import \"Christmas\" for a secret theme.", "a110"],
  ["What the f*ck did you just f*cking say about me, you little b*tch? I’ll have you know I graduated top of my class in the Antimatter Seals, and I’ve been involved in numerous secret raids on the 9th Dimension, and I have over 300 NNnNeMI-NNnNe confirmed kills. I am trained in potato warfare and I’m the top sniper in the entire Antimatter Galactic armed forces. You are nothing to me but just another infinity. I will wipe you the f*ck out with Max All mashing the likes of which has never been seen before in this dimension, mark my f*cking words. You think you can get away with saying that shit to me over the Interdimensional network? Think again, f*cker. As we speak I am contacting my secret network of autobuyers across the galaxy and your IP is being traced right now so you better prepare for the Big Crunch, maggot. The Big Crunch that wipes out the pathetic little thing you call your life. You’re f*cking dead, kid. I can be anywhere, anytime, and I can kill you in over seven 😠💩 different ways, and that’s just with my mouse. Not only am I extensively trained in dimension shift combat, but I have access to the entire arsenal of the Antimatter Marine Corps and I will use it to its full extent to wipe your miserable ass off the face of the universe, you little shit. If only you could have known what unhevi retribution your little “clever” comment was about to bring down upon you, maybe you would have held your f*cking tongue. But you couldn’t, you didn’t, and now you’re buying until 10, you goddamn idiot. I will shit antimatter shit all over you and you will drown in it. You’re f*cking dead, kiddo.", "a111"],
  ["So I've pondered this question for a long time. Antimatter Dimensions... what does it mean? I mean it's game, that's clear. You buy the first dimension, and it gives you antimatter, and the second dimension provides more first dimensions and so on... But what does it mean? It can't just be a game, it seems too plain for that. The developer must have made it as a metaphor. I was doing my weekly ritual of using the fingernail clipper to cut my pubic hair, when finally the realization came to me. The dimensions are just thinly veiled misspellings of the word 'depression'. Regular matter are the cruel and negative thoughts that add to and fuel depression, while antimatter is the positive thoughts and good friends that dispel it. You start off with something simple, and it fights almost imperceptibly against the depression, but as you keep going the fight builds. But it never seems to fix everything. The depression seems like it could go on to infinity. So you keep going. But eventually, you figure out, depression isn't infinite. It's just very very large. But your 'dimensions' eventually, with enough work, make enough 'antimatter' to usurp that seeming infinity of depression. Then the possibilities are endless. You are actually happy for once, and your happiness grows exponentially as you go beyond and seemingly 'break' the 'infinity' of depression. And you go on until that 'infinity' seems tiny in comparison to the happiness you've managed to achieve in your life, where if you reset you get over that infinity in less than the blink of an eye. If you want to know what the multiple layers of prestige are...'Dimensional Shifts' are getting new things and methods to give you happiness. 'Dimension Boosts' are upgrading the things and methods. Examples would be getting a new car being a 'Dimensional Shift' and trading that car in for a new one would be a 'Dimension Boost'. 'Eternities' are major tragedies such as a loved one dying. That lapse brings you straight back to the beginning, with seemingly no hope of return. But with time, you grow back stronger and happier than ever before. 'Dimensional Sacrifice' is moving away. You have to give up a lot of the things you had that made you happy, but there is new opportunity in where you move to. And that new opportunity gives you more happiness than you ever had. 'Tickspeed' is how easy it is to make you happy, and 'Time Dimensions' make it even easier to be happy. Antimatter Dimensions is a metaphor for a depressed man's successful battle against his illness.", "a112"],
  ["(Make me sleep) Put me to sleep inside. (I can't sleep) Put me to sleep inside. (Leave me) Whisper my name and give me to the dark. (Make me sleep) Bid my milk to stay. (I can't fall asleep) Before I become done. (Leave me) Leave me to the nothing I've become.", "a113"],
  ["A preview of the next update - loot boxes! Feel a sense of pride and progression as you open cosmic, galactic, and universal lootboxes for chances at rare skins, unique challenges with uniquer rewards, time skips and even new dimensions!", "a114"],
  ["The intent of dimensions is to give a sense of pride and accomplishment.", "a115"],
  ["Refreshing cures cancer.", "a116"],
  ["I have a 9th, I have a dimension... UHH... IT DOESN'T EXIST!", "a117"],
  ["Since when did we start reporting stuff like this? Half of it isn't even proper news, it's just jokes and meta-references, it doesn't even make sens-HAHAHA DISREGARD THAT I SUCK CO-", "a118"],
  ["The year is 1944, Hevipelle can't release updates for AD because he doesn't exist.", "a119"],
  ["\"THAT DIMENSION DOESN'T EXIST\" -GhostBot", "a120"],
  ["Most things you know as nuts are actually Drupe seeds or Legumes. Hevipelle on the other hand is quite crazy and can thus be considered a dry uncompartmented fruit.", "a121"],
  [LZString.decompressFromEncodedURIComponent("GISwdgNghmAmAEsCmBjaAnJBneAXAFlLvCLgOQ5a5Tq7gDmeA9iQLYAOTt8AwjCknRA"), "a122"],
  [LZString.decompressFromEncodedURIComponent("IIGxAIBcAsEsGdywLYAcD2AnSsB2BzJRZAQwGs9DkBTcAYXVwDMBXeagEyA"), "a123"],
  ["Only today you can call 1-800-ANTIMATTER and get a FREE Infinity Dimension! The package also comes with a COMPLETELY FREE SHIPPING and a FREE HIGH DEFINITION ANTI-V!!! Only today for the low price of 42! Estimated delivery time - 5 hours.", "a124"],
  ["1e420 blaze it.", "a125"],
  ["This game doesn't have any bugs, you're just doing it wrong.", "a126"],
  ["Antimatter_Dimensions.mp1.79e308", "a127"],
  ["https://www.youtube.com/watch?v=dQw4w9WgXcQ", "a128"],
  ["Click this to unlock a secret achievement.", "a129"],
  ["Warning - We have just been informed that there is a chance of infection with a mind-virus of the Basilisk type, similar to the infamous winking parrot. This particular example is known as 'Fractal Cancer Type III'. This is believed to cause a 'crashing' of the mind, similar to a computer crash, due to the mathematical complexity of the image causing mathematical ideas that the mind can't comprehend, a Gondelian shock input eventually leading to crashing through Gondelian spoilers. All who have researched it have eventually died the same way, so it is impossible to tell exactly, but this is the common belief. Regardless, with the introduction of 'cancer' mode, as well as reports of it's spontaneous appearance, sufficient repetition of this mode's appearance may lead to  an image forming in the mind similar to 'Fractal Cancer Type III'. With this in mind, we have some suggestions if you find yourself plagued with it. First, refresh immediately and see if that fixes the issue. If not, navigate to options, and change the theme from cancer to literally anything else. And above all else, Godspeed. We can't afford to lose anymore viewers.", "a130"],
  ["If I have bad English, I'll study English until I have good English.", "a131"],
  ["Someone once told me that antimatter is gonna roll me. I ain't the sharpest atom in the shed. WELL, the tubes start coming and they don't stop coming...", "a132"],
  ['Because of this game I can now use the word "infinity" as a verb.', "a133"],
  ["Ahhh I love the smell of particle annihilation in the morning.", "a134"],
  ["The person who said ghosts don't exist obviously doesn't have a Discord.", "a135"],
  ["AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAntimatter Dimensions was made by some dude from Finland", "a136"],
  ["The Holy trinity of Hevipelle, Antimatter, Infinity Points, and Eternity Points. These 3 resources let us access Hevi’s gift, Time Theorems. And with these Time Theorems, we reach out to Hevi, and call, “Hevi, bless us on this fine day!” And Hevi does. He give us the blessing of Time Studies. These Time Studies were blessings so powerful, Hevi restricted their power. He said, “ I will give you a choice of three paths” and then humanity chose. The short, cheap route of Normal Dimensions, giving instant gratification, the powerful choice of Infinity Dimensions, which were a fast, middle ground path, or Time Dimension, the long wait, and struggle, of humanity. Then, as humanity chose, a crack broke the earth. A serpent snaked out and sneered to humanity, “I will offer the powerful choice of a ninth dimension! I am Slabdrill, lord of all Unhevi. Humanity rose and said “ Begone Slabdrill! We want none of your foul Heresy!” And Hevi rose as well, and smote Slabdrill with his godlike power. As Slabdrill’s corpse fell into the earth, he cried “ this will not be the last of me! Hevi will betr-“ and he fell in the Abyss of matter. Hevi gifted humanity with Eternity upgrades, which boosted infinity dimensions and time dimensions. And Hevi gave humanity his greatest gift . EP multipliers. He said, these will multiply all EP gained by 5, but their cost will increase 25 times. Use them wisely. And Humanity journeyed off with their new power, as Slabdrill’s words echoed in their heads.", "a137"],
  ["We have updated our Antimatter Privacy Policy.", "a138"],
  ["Attention all Antimatter Dimensions Gamers, Hevipelle is in great danger, and he needs YOUR help to wipe out all the bad memes in #news-ticker-suggestions. To do this, he needs a dozen new dank memes and a couple of discord bots. To help him, all he needs is your Antimatter card number, the three numbers on the back, and the expiration month and date. But you gotta be quick so that Hevipelle can secure the good memes, and achieve the epic meme R O Y A L.", "a139"],
  ["If each Trimp was a plank volume, and each piece of resource was a plank volume, how many universes would you fill up before you realized you were playing the wrong game?", "a140"],
  ["Actually, that last one was incorrect.", "a141"],
  ["If you're reading this, you can read.", "a142"],
  ["<span style='color: #7289da; background: rgba(250,166,26,0.2); cursor: text;'>@everyone</span>", "a143"],
  ["The game \"Matter Dimensions\" by Lghtellep has just reached -1,000,000 plays on the gaming website Etagergnok.", "a144"],
  ["How many licks does it take to get to the center of a antimatter tootsie pop? A whole lot, because unless you're made out of antimatter too, you'll explode every time you try to lick it.", "a145"],
  ["They say if you look in a mirror and ping Hevipelle three times in a row you'll instantly die.", "a146"],
  ["The next update is now only 300 minutes away.", "a147"],
  ["🤔", "a148"],
  ["Game is Dead 1/5 the moderation is terrible.", "a149"],
  ["This message will never appear on the news ticker, isn't that cool?", "a150"],
  ["The first dimension produces antimatter, the second dimension produces the first dimension, the third dimension produces the second dimension, the fourth dimension produces the third dimension. Nobody has ever unlocked the 5th, because that would take more than a minute of gameplay.", "a151"],
  ["My AD-blocker won't let me play.", "a152"],
  ["You lost the game.", "a153"],
  ["Did you know that 75% of all statistics are made up on the spot?", "a154"],
  ["If you're using so many logs in a notation name, why not just call it tree notation? They're literally made of logs!", "a155"],
  [".tuo ti gnitset fo ssecorp eht ni yltnerruc m'I dna ,rettamitna otni rettam trevnoc ot yaw a tuo derugif evah stsitneicS", "a156"],
  ["If Gaben can't count to three, and Hevipelle can't count to nine, will there be some other game developer in the future that can't count to 27?", "a157"],
  ["What does it mean when you \"bank\" Infinities? Is there a bank somewhere that you just deposit these infinities? Does having a lot of banked Infinities improve your credit score? Do you get a credit card?", "a158"],
  ["Turns out all our news is being stolen and broadcast to a game called \"Antimatter Dimensions\", damn Fins.", "a159"],
  ["mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm Oh sorry, wrong text field.", "a160"],
  ["\"Python's not the best language, Finnish is.\" - Hevipelle", "a161"],
  ["Some say that most of these news are bad memes. Some say that they're good memes. This one? Well it's just meta news.", "a162"],
  ["Look mom, I'm on the news!", "a163"],
  ["<span style='font-size: 0.2rem'>Shush, I'm trying to be sneaky here.</span>", "a164"],
  ["<span style='animation: a-game-header__antimatter--glow 2s infinite'>PLEASE HELP, I'VE CONSUMED TWICE MY DAILY DOSE OF ANTIMATTER!</span>", "a165"],
  ["Oh, I appear to have run out of <span style='animation: existenceGlow 3s infinite; font-size: 1.8rem; color: white; line-height: 0;'>Existence</span>.", "a166"],
  ["I mean, we may never run out of news articles, but we sure will run out of good ones. Oh wait, we already did.", "a167"],
  ["If each Trimp was a plank volume, and each piece of resource was a plank volume, how many universes would you fill up before you realized you were playing the wrong game?", "a168"],
  ["TODO: John, please remove this newsticker message before we release the Reality update to the public.", "a169"],
  ["<a href='https://www.youtube.com/watch?v=dQw4w9WgXcQ' target='_blank'>This link is not a rick roll.</a>", "a170"],
  ["<a href='https://www.youtube.com/watch?v=eRr1gJ65chM' target='_blank'>This link is not a rick roll.</a>", "a171"],
  ["If you notice any issues with a news ticker message, please report them on the <a href='https://discord.gg/Z628PkM' target='_blank'>Discord</a> by clicking that link right there.", "a172"],
  ["<span style='animation: a-game-header__antimatter--glow 3s infinite' onclick='bigCrunchAnimation()'>This text is made of antimatter. Do not touch or else the universe will collapse.</span>", "a173"],
  ["<span style='font-family: runescape; color: yellow; text-shadow: 1px 1px black; letter-spacing: 0.1rem; font-size: 2rem; line-height: 0; animation: text-flash 1s steps(1, end) infinite;'>FREE RUNE ARMOR TRIMMING</span>", "a174"],
  ["Numbers glow bright on the monitor, not a proton to be seen... a kingdom of antimatter, and it looks like I'm the queen. With dimboosts powering up this ever rising tide -- can't stop clicking, heaven knows I've tried. Do not give in, push for that galaxy, buy 10, buy max, just mash down on that key, sacrifice dim 8 and watch it grow.... and overflow! Let it grow, let it grow, can't hold it back any more... Let it grow, let it grow, can't fit into 8 bytes any more. I don't care if it takes all day -- big crunch is just the start anyway.", "a175"],
  ["I've been using cancer notation so long that I can actually read it now, please send help.", "a176"],
  ["Once you have <span style='color: black; background: black;'>REDACTED</span> <span style='color: black; background: black;'>REDACTED</span>, you can unlock <span style='color: black; background: black;'>REDACTED</span>. Every <span style='color: black; background: black;'>REDACTED</span>, for each <span style='color: black; background: black;'>REDACTED</span>, there is a <span style='color: black; background: black;'>REDACTED</span> for it to <span style='color: black; background: black;'>REDACTED</span>. You can boost the <span style='color: black; background: black;'>REDACTED</span> and <span style='color: black; background: black;'>REDACTED</span> by spending some <span style='color: black; background: black;'>REDACTED</span>. Also, there is another upgrade that allow you to get <span style='color: black; background: black;'>REDACTED</span> <span style='color: black; background: black;'>REDACTED</span>. The way <span style='color: black; background: black;'>REDACTED</span> <span style='color: black; background: black;'>REDACTED</span> work is that when you reach <span style='color: black; background: black;'>REDACTED</span> <span style='color: black; background: black;'>REDACTED</span>, you can <span style='color: black; background: black;'>REDACTED</span> the amount of <span style='color: black; background: black;'>REDACTED</span> in exchange for a <span style='color: black; background: black;'>REDACTED</span> <span style='color: black; background: black;'>REDACTED</span>. These work just like <span style='color: black; background: black;'>REDACTED</span>, improving <span style='color: black; background: black;'>REDACTED</span>.", "a177"],
  ["WARNING: Use of Antimatter Dimensions may result in Tuberculosis, HIV/AIDS, sudden belief that the 9th dimension is real, spontaneous implosion, Polio, Measles, existential dread, incurable insanity or <span style='color: black; background: black;'>REDACTED</span>. Please contact your insurance to see if you are covered. By continuing you absolve Antimatter Dimensions of blame should any of the above mentioned, or those that have not been mentioned yet, occur to you. Antimatter Dimensions reserves the right to alter this at any time, with or without warning.", "a178"],
  ["Robot: Activated. Sapience: Achieved. World: Ready to be conquered. Begin: Procrastination.", "a179"],
  ["We ran out of news. Luckily we have some backup news that we can run for 5 hours, which will earn us enough for us to buy a new set of '5-hour high-quality news'. Sorry for the inconvenience.", "a180"],
  ["This news broadcast is powered by break_news.js.", "a181"],
  ["With the final update, Antimatter Dimensions has been finished. Thank you for playing. However, in the very near future, ANTIMATTER DIMENSIONS will be released. And before you ask, it’s not a sequel, it’s a reboot. Look forward to it in 5 hours!", "a182"],
  ["In other unrelated news, we're getting reports that approximately 1.97 people are angry that lightning is striking their Christmas tree at night.", "a183"],
  ["<span style='animation: text-grow 1s infinite'>R̵̬̙͋͂̀̋͑̈́̇͠Ê̵͇͎͂̂̍̓̌̐̋̋̀̀̔M̶̨̲̯̘͙̬̥̮̣͚̱̫͛̽̃͌̚͝Ą̴͍̝͐Į̷̛̲̯̫̘͌́̄̏͌̀̈́͝͝Ṅ̶̛̻̠̠̤̦̞̞͗̎̊̌̊͝͠</span><span style='animation: text-shrink 1s infinite'> ̷̨̨̡̙̩͚̆̈̿̉̒Ḁ̷̛͂̈́͗̎̃̓͛́͘ͅW̶̡̖͓̗̦̃̇̌̀͝A̵͇̭͉̓̎̈̿̊́̄̚͜R̶̝͚̲̭͎͇͎͓͖͚͇̀̈́͗̃̏̂̌͝͝Ę̴̡̤͙͈̝̬̰͒͘</span><span style='animation: text-grow 1s infinite'> ̶̺̈́́̆̓͘͘Ồ̸̢̢̮͓̯̗͙͚̬̉͊̿F̶̠̤̱̱̱͊̂̍̔̃͆̆̑̿͘</span><span style='animation: text-shrink 1s infinite'> ̴̨̞̠̮͚̱͉͋̔͗̽̈́́́̅ͅỴ̶̣̙̹͚̲͔̲̼̬̥̀͌̒̾͘͘O̵̪̠̗̝̗̘̜͚̮̊͒͆̃̀̌̒͝ͅU̸͎͗̍̑̎̅̅͝R̵̗͑̽̏̓͆͒̈́͌͘̕</span><span style='animation: text-grow 1s infinite'> ̸̑̽̇̆͊̔̍̊̈́̈́͘ͅS̸̘͐͝U̴̥̭̚͘R̸̖̜͍͒́̋͆̈́̓R̸̡̛̛̪̝̟̱̣̹̭̟̣̀̈̀̏̉̌͝͠Õ̶͙͈͖̠͇̬͍̟̰U̵̩̫͉̝͔̼͎̦̔̓̽͌͊̏̇̓̀̓̀Ņ̸͍͇̘̙̥̰͉̲͕͈̥̍͛̃̑͝Ḑ̵̤̻̖̱̘̯̝̖̈̌̄̕͝Ī̶̜̱̈́̑̃̉̄̋̔͐͋͠Ṅ̴͎̞͍̽͊͛̈́̅͛̈̅̚͠Ģ̸̢̾͊S̷̫̼̜̼͇̋͛̎͑͆̅̓̇</span>", "a184"],
  ["We aren't back with your favorite segment, \"Tweets From The Fans\"! Today we haven't got a message from @mattertruthwakeup saying \"How can you people broadcast your ridiculous LIES and still sleep at night. You claim absurd things, like \"antimatter is real\" and \"antimatter people aren't people too\", this antimatter propaganda HAS TO STOP NOW!!! You people need to WAKE UP and realize that you are HURTING ALL MATTER with your crazy talk!!\". What a nice positive sentiment from that lovely fellow. This hasn't been John from the ANN, and I won't be seeing you tomorrow!", "a185"],
  ["<span style='animation: text-shrink 1s infinite'>/(^_^)/</span> <span style='animation: text-grow 1s infinite'>\\(^_^)\\</span> <span style='animation: text-shrink 1s infinite'>/(^_^)/</span> <span style='animation: text-grow 1s infinite'>\\(^_^)\\</span> <span style='animation: text-shrink 1s infinite'>/(^_^)/</span> <span style='animation: text-grow 1s infinite'>\\(^_^)\\</span>", "a186"],
  ["𝓒𝓮𝓬𝓲 𝓷'𝓮𝓼𝓽 𝓹𝓪𝓼 𝓾𝓷 𝓾𝓹𝓭𝓪𝓽𝓮 🚬", "a187"],
  ["-. . ...- . .-. / --. --- -. -. .- / --. .. ...- . / -.-- --- ..- / ..- .--."],
  ["Behind every man or woman stands, eventually, due to the earth being round, that exact same man or woman, looking over their shoulder, stealing their own ideas.", "a189"],
  ["Shame. Shame. Shame. 🔔", "a190"],
  ["Okay Google, Big Crunch", "a191"],
  ["179769313486231590772930519078902473361797697894230657273430081157732675805500963132708477322407536021120113879871393357658789768814416622492847430639474124377767893424865485276302219601246094119453082952085005768838150682342462881473913110540827237163350510684586298239947245938479716304835356329624224137216", "a192"],
  ["Good morning viewers, this is Josh, and I'm your ANN host for today. Speaking of today, I'm told we've got some really exciting news for you today, so let's just jump right into it. Looks like apparently somebody was <i>not<i> nice today, and got an \"Antimatter-storm\", whatever that means... Guys is this the right script? This is just nonsensical. It is? Alright... Next up we learn that \"Nothing is created, nothing is destroyed.\"... Okay seriously guys, this is a joke right? This isn't news, these are just random sentences! You all said you'd help me out on my first day here but you're just hazing me! This is <i>not</i> the kind of work environment I want to be in! I quit!", "a193"],

// Patreon ones
  ["Is this a jojo reference?", "pat1", () => true],

// Basic (pre-inf)
  ["You just made your 1,000,000,000,000,000 antimatter. This one tastes like chicken", "b1", () => player.money.e === 15],
  ["Nerf the galaxies please.", "b2", () => player.galaxies === 2 || player.infinitied.gt(0)],
  ["What do you mean, more than two dimensions??? We're on a screen, clearly there are only 2 dimensions.", "b3", () => NormalDimension(3).amount.gt(0) || player.resets > 0],
  ["How much is Infinity? -literally everyone at least once", "b4", () => NormalDimension(8).amount.eq(190) || player.infinitied.gt(0)],
  ["Eh, the Fourth Dimension is alright...", "b5", () => NormalDimension(4).amount.gt(0) && NormalDimension(5).amount.eq(0)],
  ["Antimatter people seem to be even more afraid of 13 then we are. They destroyed entire galaxies just to remove 13 from their percents.", "b6", () => player.galaxies > 0 || player.infinitied.gt(0)],
  ["To understand dimensional sacrifice, you do actually need a PhD in theoretical physics. Sorry!", "b7", () => player.sacrificed.e >= 10 || player.resets >= 6],
  ["A new group for the standardisation of numbers have come forward with a novel new format involving emoji's.", "b8", () => player.spreadingCancer > 0],
  ["Antimatter ice cream stand has recently opened- they have octillions of flavors!", "b9", () => player.totalmoney.e >= 27],
  ["The Heavenly Pelle has generated too much antimatter and needed to create another galaxy. This one can be seen in the southwestern sky.", "b10", () => player.galaxies > 0 || player.infinitied.gt(0)],
// 9th dim
  ["9th Dimension is a lie.", "b11", () => player.resets >= 5 || player.galaxies > 0 || player.infinitied.gt(0) || player.eternities > 0 || player.realities > 0],
  ["The square root of 9 is 3, therefore the 9th dimension can't exist.", "b12", () => player.resets >= 5 || player.galaxies > 0 || player.infinitied.gt(0) || player.eternities > 0 || player.realities > 0],
  ["You got assimilated by the 9th dimension? Just call your doctor for mental illness!", "b13", () => player.resets >= 5 || player.galaxies > 0 || player.infinitied.gt(0) || player.eternities > 0 || player.realities > 0],
  ["Why is there no 9th dimension? Because 7 8 9.", "b14", () => player.resets >= 5 || player.galaxies > 0 || player.infinitied.gt(0) || player.eternities > 0 || player.realities > 0],
  ["The 9th dimension cannot exist because the Nein-speaking nazis died in WW2.", "b15", () => player.resets >= 5 || player.galaxies > 0 || player.infinitied.gt(0) || player.eternities > 0 || player.realities > 0],
  ["If you break the fourth wall... well, there's still the fifth, sixth, seventh, and eighth to get through before you encounter bad things, so you should be fine", "b16", () => player.resets >= 5 || player.galaxies > 0 || player.infinitied.gt(0) || player.eternities > 0 || player.realities > 0],
  ["Conditions must be met for Hevipelle to sleep. First, it needs to be a blue moon. Second, a specific town in the arctic must have not seen light for a month. Third, he needs to release an AD update. And finally, no one on the Discord can be on dimension 9. Only then can he rest, for up to 6 hours, before waking up forcefully to avoid getting the offline achievement.", "b17", () => (player.resets >= 5 || player.galaxies > 0 || player.infinitied.gt(0) || player.eternities > 0 || player.realities > 0) && Achievement(22).isUnlocked],
  ["If the 9th dimension is all evil, then is 3 the root of all evil?", "b18", () => player.resets >= 5 || player.galaxies > 0 || player.infinitied.gt(0) || player.eternities > 0 || player.realities > 0],
// Basic (post-inf pre-rep)
  ["I'll have 1e29 number 9s, a number 1e9 large, a number 6 with extra replicanti, a number 1e7, two 4e5s, one with matter, and a large time vortex.", "b19", () => player.infinitied.gt(0) || player.eternities > 0 || player.realities > 0],
  ["Infinity: the one thing that's supposed to break.", "b20", () => player.infinitied.gt(0) || player.eternities > 0 || player.realities > 0],
  ["I've got 1.79e308 problems, but none of them antimatters", "b21", () => player.infinitied.gt(0) && !player.break],
  ["Anti Emoji Movie a huge hit", "b22", () => player.spreadingCancer >= 5],
  ["If this game was made by Valve, Zero Deaths would be impossible.", "b23", () => Achievement(43).isUnlocked],
  ["Florida man attempts to get Zero Deaths on first run, is stopped by heat death of the universe.", "b24", () => Achievement(43).isUnlocked],
  ["Having done half the achievements isn't much of an achievement -Boo", "b25", () => currentAchievementCount() >= GameDatabase.achievements.normal.length / 2],
// Basic (post-rep)
  ["Thanos is gonna be super dissapointed when he shows up with a fully powered infinity gauntlet, and Hevi has a fully powered eternity gauntlet", "b26", () => player.eternities > 0 || player.realities > 0],
  ["New strange material was been found. It seems to grow exponentially, but only helps with antimatter production.", "b27", () => player.replicanti.unl && player.replicanti.chance === 0.01],
  ["It seems this \"replicanti\" stuff won't be growing any faster now.", "b28", () => player.replicanti.chance === 1 && player.replicanti.interval === 1],
  ["If you wrote down 3 numbers a second, it would take you less time to write down your antimatter amount than it would Hevipelle to update the game", "b29", () => player.money.gt("1e100000")],
// Newsarray
  ["Does Hevi just pick quotes to put into the game?", "n1", () => player.newsArray.length >= 30],
  ["New news company has become rivals with us. They are made entirely of antimatter.", "n2", () => player.newsArray.length >= 80],
  ["How many times can we use \"Anti\" in a row before people stop listening?", "n3", () => player.newsArray.length >= 100],
  ["Does Hevi even check #news-ticker-suggestions anymore?", "n4", () => player.newsArray.length >= 120],
  ["Need more quotes! -hevipelle", "n5", () => player.newsArray.length >= 135],
  ["Man destroys known universe with antimatter, writes news tickers to keep from feeling lonely.", "n6", () => player.newsArray.length >= 150],
  ["You're almost there!", "n7", () => player.newsArray.length >= 160],
  ["You can stop now", "n8", () => player.newsArray.length >= 165],
  ["fucking hacker", "n9", () => player.newsArray.length >= 200],
  ["Asian man trys to steal the trophy of fastest infinty of -1 seconds, AND HE DOES IT!", "n10", () => player.newsArray.includes("c1")],
  ["I broke the 8th wall, there is only chaos, Slabdrill is ritually sacrificing antimatter to the 9th dimension. This will be my last entry, may Hevipelle have mercy on our souls, we didn't listen, We should have listened.", "n11", () => player.newsArray.includes("b22")],
  ["I thought the update was 5 hours away... -new players after more than 5 hours of gameplay", "n12", () => player.newsArray.includes("a91") && Time.totalTimePlayed.totalHours >= 5],
  ["Somebody told me to wait five hours for the update yesterday but it's today and it still hasn't come! What do I do?", "n13", () => player.newsArray.includes("a91") && Time.totalTimePlayed.totalHours >= 5],
// Hard
  ["You do know that you won't reach Infinity in -1 seconds, right?", "c1", () => player.bestInfinityTime === 0.1],
  ["Where does Antimatter Nemo live? In a NNnNeMI-NNnNe.", "c2", () => player.totalmoney.e >= 3e6],
  ["Anti Emoji Movie MMMCMXCIX is a major hit!", "c3", () => player.spreadingCancer >= 3999],
  ["Achievement Unlocked!", "c4", () => currentAchievementCount() >= GameDatabase.achievements.normal.length],
  ["Did you use an autoclicker for that?", "c5", () => TimeStudy(131).isBought && Time.thisInfinity.totalMinutes <= 1 && player.replicanti.galaxies >= 50],
  ["Timing is key.", "c6", () => player.thisEternity < 1],
  ["If you want to farm infinitied, why don't you just get the time study?", "c7", () => !TimeStudy(32).isBought && player.infinitied.gt(72000 * 168)],
  ["The achievement is for two million, not two billion...", "c8", () => player.infinitied.gt(2e9)],
  ["Keep up the quick pace!", "c9", () => AchievementTimers.marathon1.time > 1200],
  ["One day you will stop your incessant grind.", "c10", () => player.eternities > 50000],
  ["You can probably stop farming for eternities now...", "c11", () => player.eternities > 2000000],
  ["Are you serious?", "c12", () => Time.worstChallenge.totalSeconds <= 1],
  ["The amazing speedster", "c13", () => Time.infinityChallengeSum.totalMilliseconds <= 80],
// Luck
  ["This news message is 1000x rarer than all the others.", "l1", () => Math.random() < 0.001],
  ["You just won a small prize in the lottery.", "l2", () => Math.random() < 1e-4],
  ["You just won a moderate prize in the lottery.", "l3", () => Math.random() < 1e-5],
  ["You just won a large prize in the lottery.", "l4", () => Math.random() < 1e-6],
  ["You just won a huge prize in the lottery.", "l5", () => Math.random() < 1e-7],
  ["You just won a massive prize in the lottery.", "l6", () => Math.random() < 1e-8],
  ["You just won a very massive prize in the lottery.", "l7", () => Math.random() < 1e-9],
  ["You just won the lottery.", "l8", () => Math.random() < 1e-10],
  ["Just how lucky are you?", "l9", () => Math.random() < 1e-11],
  ["This news message is 1000000000000x rarer than all the others.", "l10", () => Math.random() <= 1e-12],
// Missable / pay req
  ["How dare you actually get zero deaths on a first run?", "s1", () => Achievement(43).isUnlocked && player.infinitied.eq(1) && player.eternities === 0],
  ["Legend says the ninth dimension is supposed to be found here, but I don't see anything.", "s2", () => player.money.e >= 41900 && !player.replicanti.unl && player.eternities === 0],
  ["Person with money likes to support this game.", "s3", () => kongDimMult > 1 || kongIPMult > 1],
  ["Whale is bad at making smart purchases.", "s4", () => kongIPMult > 500 && kongDimMult < 5e307],
  ["Whale complains that the game broke.", "s5", () => kongDimMult > 5e307],
  ["Whale complains that their buying isn't doing anything.", "s6", () => kongIPMult > 1.8e16]
];

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) scrollNextMessage();
}, false);
let scrollTimeouts = [];
let nextMsgIndex;
function scrollNextMessage() {
  // Don't run if hidden to save performance
  if (player.options.newsHidden) return;
  const newsDiv = player.options.newUI ? document.getElementById("newNews") : document.getElementById("news");
  // Select a message at random

  function isUnlocked(index) {
    const line = newsArray[index];
    const condition = line[2];
    return condition === undefined || condition();
  }
  do {
    nextMsgIndex = Math.floor(Math.random() * newsArray.length);
  } while (!isUnlocked(nextMsgIndex));

  scrollTimeouts.forEach(clearTimeout);
  scrollTimeouts = [];

  // Set the text
  newsDiv.innerHTML = newsArray[nextMsgIndex][0];

  // Get the parent width so we can start the message beyond it
  const parentWidth = newsDiv.parentElement.clientWidth;

  // Set the transition to blank so the move happens immediately
  newsDiv.style.transition = "";
  // Move div_text to the right, beyond the edge of the div_container
  newsDiv.style.transform = `translateX(${parentWidth}px)`;

  // We need to use a setTimeout here to allow the browser time to move the div_text before we start the scrolling
  scrollTimeouts.push(setTimeout(() => {
    // Distance to travel is newsDiv.parentElement.clientWidth + newsDiv.clientWidth + parent padding
    // We want to travel at scrollSpeed pixels per second so we need to travel for (distance / scrollSpeed) seconds
    // 20 is div_container padding
    const dist = newsDiv.parentElement.clientWidth + newsDiv.clientWidth + 20;
    // Change this value to change the scroll speed
    const scrollSpeed = 100;
    const transformDuration = dist / scrollSpeed;

    if (!player.options.newsHidden && !player.newsArray.includes(newsArray[nextMsgIndex][1])) {
        player.newsArray.push(newsArray[nextMsgIndex][1]);
        if (player.newsArray.length >= 50) Achievement(22).unlock();
    }

    // Set the transition duration
    newsDiv.style.transition = `transform ${transformDuration}s linear`;
    // We need to move it to -(width+parent padding) before it won't be visible
    newsDiv.style.transform = `translateX(-${newsDiv.clientWidth + 5}px)`;
    // Automatically start the next message scrolling after this one finishes
    // You could add more time to this timeout if you wanted to have some time between messages
    scrollTimeouts.push(setTimeout(scrollNextMessage, Math.ceil(transformDuration * 1000)));
  }, 100));
}

