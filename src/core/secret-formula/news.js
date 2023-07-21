import { DC } from "../constants";

// A = always there
// L = locked
// R = random chance condition
// P = patreon
// AI = created with gpt2

function newsAnimSpd(seconds) {
  return seconds / player.options.news.speed;
}


export const news = [
  {
    id: "a1",
    text: "The cookie is a lie.",
  },
  {
    id: "a2",
    text: "Antimatter ghosts do not exist. Just like matter ghosts. They don't have any matter, for that matter."
  },
  {
    id: "a3",
    text: "Nuclear power plants have been abandoned in favor of antimatter power."
  },
  {
    id: "a4",
    text: "Antimatter cookies have been confirmed to not exist, whoever claims that, stop."
  },
  {
    id: "a5",
    text: "Antimatter prices have drastically dropped due to newfound abundance."
  },
  {
    id: "a6",
    text: "In the news today, humans make an antimatter animal sacrifice to the antimatter god."
  },
  {
    id: "a7",
    text: "You made one antimatter! Whatever that means."
  },
  {
    id: "a8",
    text: "\"IN THE END, IT DOESN'T ANTIMATTER\" -hevipelle"
  },
  {
    id: "a9",
    text: "None of this matters."
  },
  {
    id: "a10",
    text: "How does it matter if it's antimatter?"
  },
  {
    id: "a11",
    text: "Scientists confirm that the colour of antimatter is Blurple."
  },
  {
    id: "a12",
    text: "How does NASA organise a party? They planet."
  },
  {
    id: "a13",
    text:
      `Electrons are now seeing the happy things in life.
      We're calling these happy electrons 'Positrons.' Wait, that's taken?`
  },
  {
    id: "a14",
    text:
      `This completely useless sentence will get you nowhere and you know it.
      What a horrible obnoxious man would come up with it, he will probably go to hell,
      and why would the developer even implement it? Even if you kept reading it you wouldn't
      be able to finish it (the first time).`
  },
  {
    id: "a15",
    text: `"GHOST SAYS HELLO" -Boo-chan`
  },
  {
    id: "a16",
    text: `"Can someone tell hevi to calm down?" -Mee6`
  },
  {
    id: "a17",
    text: "Due to antimatter messing with physics, a creature that was once a moose is now a human."
  },
  {
    id: "a18",
    text: "!hi"
  },
  {
    id: "a19",
    text: `"Alright" -Alright`
  },
  {
    id: "a20",
    text: "The English greeting is not present in Antimatter speak."
  },
  {
    id: "a21",
    text: "To buy max or not to buy max, that is the question."
  },
  {
    id: "a22",
    text: "One, two, skip a few, ninety-nine, NaN!"
  },
  {
    id: "a23",
    text: "No, mom, I can't pause this game."
  },
  {
    id: "a24",
    text: "Scientific notation has entered the battlefield."
  },
  {
    id: "a25",
    text: `"Make the Universe Great Again!" -Tronald Dump`
  },
  {
    id: "a26",
    text: "#dank-maymays"
  },
  {
    id: "a27",
    get text() {
      return `A new religion has been created, and it's spreading like wildfire. The believers of this religion worship
        the Heavenly Pelle, the goddess of antimatter. They also believe that ${format(Number.MAX_VALUE, 2)}
        is infinite.`;
    }
  },
  {
    id: "a28",
    text: "Someone has just touched a blob, and blown up. Was the blob antimatter, or was the guy made of Explodium?"
  },
  {
    id: "a29",
    text: `If you are not playing on Kongregate, Steam, or https://ivark.github.io/AntimatterDimensions/,
      the site is bootleg.`
  },
  {
    id: "a30",
    text: "Rate 5 on Kongregate so more people can experience this 5 star rating."
  },
  {
    id: "a31",
    text: "BOO!"
  },
  {
    id: "a32",
    text: `"You ate for too long." -Hevipelle`
  },
  {
    id: "a33",
    text: `"I hate myself." -Boo-chan`
  },
  {
    id: "a34",
    text: `"Gee golly" -Xandawesome`
  },
  {
    id: "a35",
    text: "Above us, there is nothing above, but the stars, above."
  },
  {
    id: "a36",
    text: "You feel like making antimatter. But nobody wants to eat your antimatter."
  },
  {
    id: "a37",
    text: "Somebody wasn't nice, he got an antimatter-storm."
  },
  {
    id: "a38",
    text: "You are living, you occupy space, you have a mass, you matter... unless you antimatter."
  },
  {
    id: "a39",
    text: "I clicked too fast... my PC is now dematerialised."
  },
  {
    id: "a40",
    text:
      `"If an alien lands on your front lawn and extends an appendage as a gesture of greeting, before you get
      friendly, toss it an eightball. If the appendage explodes, then the alien was probably made of antimatter.
      If not, then you can proceed to take it to your leader." -Neil deGrasse Tyson`
  },
  {
    id: "a41",
    text:
      "There must always be an equal amount of matter as compared to antimatter; I guess your mom balances that a bit."
  },
  {
    id: "a42",
    text: "Nothing is created, nothing is destroyed."
  },
  {
    id: "a43",
    text: "We dug a big hole to store this antimatter... Adele's rolling in it."
  },
  {
    id: "a44",
    text: "If everything is antimatter, how can you see yourself?"
  },
  {
    id: "a45",
    text: "The stock markets have crashed due to antimatter beings somehow knowing what they will be tomorrow."
  },
  {
    id: "a46",
    text: "My dog ate too much antimatter, now he's' saying 'meow!'"
  },
  {
    id: "a47",
    text: "If you put infinity into your calculator, it will result in 42!"
  },
  {
    id: "a48",
    text: "You have found the rarest antimatter pepe, it's ultra rare!"
  },
  {
    id: "a49",
    get text() {
      return `Can we get ${format(1e169)} likes on this video??? Smash that like button!!`;
    }
  },
  {
    id: "a50",
    text: "The smell of antimatter has been revealed. It smells like kittens."
  },
  {
    id: "a51",
    text: "Just another antimatter in the wall."
  },
  {
    id: "a52",
    text: "GET SNIPED, WEAKLING"
  },
  {
    id: "a53",
    text: `"Thanks a lot." -Dankesehr`
  },
  {
    id: "a54",
    text: "This world situation is an SOS situation to the world!! MAYDAY, MAYDAY!!"
  },
  {
    id: "a55",
    text:
      `"As for sure as the sun rises in the west, of all the singers and
      poets on earth, I am the bestest." - Hevipelle`
  },
  {
    id: "a56",
    text: `"I'm good at using github." -Hevipelle`
  },
  {
    id: "a57",
    text:
      `A new chat server has been created for antimatter people to spy on matter people,
      and the world has fallen into chaos and discord.`
  },
  {
    id: "a58",
    text:
      `A new study has come out linking the consumption of potatoes with increased risk of antimatter implosion.
      Scientists suggest eating more.`
  },
  {
    id: "a59",
    text: `"I thought that I fixed that bug but apparently some update broke it again." -Hevipelle`
  },
  {
    id: "a60",
    text: `"Maybe I'm gay then" -Bootato`
  },
  {
    id: "a61",
    text: "Breaking news! Hevipelle has just announced that the buy max button is in fact going to be removed!"
  },
  {
    id: "a62",
    text: "I dedicate this game to my girlfriend."
  },
  {
    id: "a63",
    text:
      `Antimatter guns don't kill antimatter people, antimatter people kill antimatter people but does that mean
      that antimatter toaster doesn't toast antimatter toasts, antimatter toast toasts antimatter toasts?`
  },
  {
    id: "a64",
    text: "But to an antimatter person, wouldn't they be matter and us antimatter?"
  },
  {
    id: "a65",
    text: "And nothing antimatters."
  },
  {
    id: "a66",
    text:
      `School starting up strikes fear in students universe-wide, as schools are no longer segregated between
      matter and antimatter. Annihilation is prominent.`
  },
  {
    id: "a67",
    text: "Why does no one talk about the 0th dimension?"
  },
  {
    id: "a68",
    text: "The fatter catter satter on the antimatter."
  },
  {
    id: "a69",
    text: "Who let the DOgs out?"
  },
  {
    id: "a70",
    text: "If you can't read this, you disabled the news."
  },
  {
    id: "a71",
    text: "Doesn't leave, just mutes the server so he doesn't receive notifications."
  },
  {
    id: "a72",
    text: `"Most quotes found online are falsely attributed." -Abraham Lincoln`
  },
  {
    id: "a73",
    text: `"It should work now, but it doesn't." -Hevipelle`
  },
  {
    id: "a74",
    text: "This game doesn't have any errors... they're alternative successes."
  },
  {
    id: "a75",
    text:
      `A third type of matter has been discovered: null matter. It doesn't do anything and is basically
      useless. The scientists who discovered it were fired.`
  },
  {
    id: "a76",
    text: "Your Mother-in-Law keeps nagging you about all these antimatter colliders."
  },
  {
    id: "a77",
    text: "If matter exists, then does antimatter not exist?"
  },
  {
    id: "a78",
    text: "Antimatter=Life. Not cobblestone, not dirt, nothing like that. Antimatter."
  },
  {
    id: "a79",
    text: "Breaking News: Error Error Error"
  },
  {
    id: "a80",
    text: "How much antiwood could an antiwoodchuck chuck if an antiwoodchuck could chuck antiwood?"
  },
  {
    id: "a81",
    text: "Chaos isnt a pit, chaos is a matter."
  },
  {
    id: "a82",
    text: `"That's because I'm a good game developer and pushed some code that totally works." -Hevipelle`
  },
  {
    id: "a83",
    text: "What's the matter with anti matter?"
  },
  {
    id: "a84",
    text: "Doesn't it annoy you when people don't finish their"
  },
  {
    id: "a85",
    text: "Don't anti-quote me on this."
  },
  {
    id: "a86",
    text: "Antimatter is honest, matter makes up everything."
  },
  {
    id: "a87",
    text:
      `According to no known laws of aviation, there are multiple ways a bee
      should be able to be swallowed up by antimatter.`
  },
  {
    id: "a88",
    text: "You either die as matter or live long enough to be consumed by the antimatter, and then die again."
  },
  {
    id: "a89",
    text: "If you gaze long enough into the antimatter, the antimatter gazes back into you."
  },
  {
    id: "a90",
    text: `"Always gonna give you up. Always gonna let you down." - anti-Rick Astley`
  },
  {
    id: "a91",
    text: "Antimatter Dimensions: the next update is always 5 hours away. Always."
  },
  {
    id: "a92",
    get text() {
      const games = [
        {
          name: "Antimatter Dimensions",
          link: "https://ivark.github.io/"
        },
        {
          name: "FE000000",
          link: "https://dan-simon.github.io/misc/fe000000/"
        },
        {
          name: "Trimps",
          link: "https://trimps.github.io/"
        },
        {
          name: "Mine Defense (the game's ui is broken on https so make sure you're on http!)",
          link: "http://scholtek.com/minedefense"
        },
        {
          name: "Wizard and Minion Idle",
          link: "https://www.kongregate.com/games/Oninou/wami"
        },
        {
          name: "Anti-Idle",
          link: "https://www.kongregate.com/games/Tukkun/anti-idle-the-game"
        },
        {
          name: "Synergism",
          link: "https://synergism.cc/"
        },
        {
          name: "Universal Paperclips",
          link: "https://www.decisionproblem.com/paperclips/index2.html"
        },
        {
          name: "Monies<sup>2</sup",
          link: "https://sneekxy.nmtechgroup.com/monies2/"
        },
        {
          name: "The First Alkahistorian stages 1, 2, and 3",
          link: "https://nagshell.github.io/elemental-inception-incremental/"
        },
        {
          name: "Melvor Idle",
          link: "https://melvoridle.com/"
        }
      ];
      const game = games.randomElement();
      return `An unidentified developer of Antimatter Dimensions would like to
        recommend that you play <a href="${game.link}" target="_blank">${game.name}</a>`;
    },
  },
  {
    id: "a93",
    text:
      `On a scale of 1 to 10, I rate this game a solid
      <span style='color: red'>java.lang.IndexOutOfBoundsException</span>`
  },
  {
    id: "a94",
    text: "To matter or to antimatter, that is the question."
  },
  {
    id: "a95",
    text: "Why is everything so Hevi?"
  },
  {
    id: "a96",
    text:
      `It has been scientifically proven ages ago, that cats made of matter are assholes. We have good news,
      because cats made of antimatter are still assholes.`
  },
  {
    id: "a97",
    text: "Nobody once told me the anti-world wasn't gonna roll me."
  },
  {
    id: "a98",
    text: "Antimatter is like the internet. If you're reading this, you can't have enough of it."
  },
  {
    id: "a99",
    text:
      `"Antimatter has made time travel possible and I'm here to make the
      past great again." - 2nd President of the World`
  },
  {
    id: "a100",
    text: "Please insert Disc -1 to continue playing Antimatter Dimensions™."
  },
  {
    id: "a101",
    text: "Lore - coming soon™"
  },
  {
    id: "a102",
    text: "I was a part of antimatter like you once. But then I got matter in my knee."
  },
  {
    id: "a103",
    text:
      `Antimatter... antimatter never changes... until you get to quantum physics of antimatter,
      but we don't have enough tachyon particles for that.`,
    get unlocked() { return PlayerProgress.realityUnlocked() || PlayerProgress.dilationUnlocked(); }
  },
  {
    id: "a104",
    text: "There is no war in Antimatter Dimensions. Here we are safe. Here we are free."
  },
  {
    id: "a105",
    text: "Antimatter has solved global warming. In unrelated news, the Earth no longer exists."
  },
  {
    id: "a106",
    text:
      `Anti-water, anti-Earth, anti-fire, anti-air. Long ago, the four anti-nations lived together in harmony.
      Then, everything changed when the anti-Fire Nation attacked. Only the anti-Avatar, the master of all 4
      anti-elements could bring balance to the anti-world, but when the world needed him most, he accidentally
      touched some regular matter and exploded.`
  },
  {
    id: "a107",
    text: "If you open an anti-lootbox, are you selling random possessions for in-game currency?"
  },
  {
    id: "a108",
    text: "People are beginning to question Hevipelle's existence."
  },
  {
    id: "a109",
    text:
      `Antimatter Dimensions is proud to be sponsored by Lehmä! Now offering - grass eating lessons! Learn what
      grass is safe to eat and what grass isn't.`,
    isAdvertising: true
  },
  {
    id: "a110",
    text:
      `It is the year 2422. The update still isn't out. Hevi is working on balancing unfunity dimension dimensions
      and challenges for the 38th layer of prestige. There are over 100 rows of achievements. They're getting
      ready to start using breaking_breaking_breaking_infinity.js.`
  },
  {
    id: "a111",
    text: "Import \"Christmas\" for a secret theme."
  },
  {
    id: "a112",
    text:
      `What the f*ck did you just f*cking say about me, you little b*tch? I'll have you know I graduated top of my
      class in the Antimatter Seals, and I've been involved in numerous secret raids on the 9th Dimension, and I
      have over 300 NNnNeMI-NNnNe confirmed kills. I am trained in potato warfare and I'm the top sniper in the
      entire Antimatter Galactic armed forces. You are nothing to me but just another infinity. I will wipe you
      the f*ck out with Max All mashing the likes of which has never been seen before in this dimension, mark my
      f*cking words. You think you can get away with saying that shit to me over the Interdimensional network?
      Think again, f*cker. As we speak I am contacting my secret network of autobuyers across the galaxy and your
      IP is being traced right now so you better prepare for the Big Crunch, maggot. The Big Crunch that wipes out
      the pathetic little thing you call your life. You're f*cking dead, kid. I can be anywhere, anytime, and I can
      kill you in over seven 😠💩 different ways, and that's just with my mouse. Not only am I extensively trained
      in dimension boost combat, but I have access to the entire arsenal of the Antimatter Marine Corps and I will
      use it to its full extent to wipe your miserable ass off the face of the universe, you little shit. If only
      you could have known what unhevi retribution your little “clever” comment was about to bring down upon you,
      maybe you would have held your f*cking tongue. But you couldn't, you didn't, and now you're buying until 10,
      you goddamn idiot. I will shit antimatter shit all over you and you will drown in it. You're f*cking dead,
      kiddo.`
  },
  {
    id: "a113",
    text:
      `So I've pondered this question for a long time. Antimatter Dimensions... what does it mean? I mean it's a
      game, that's clear. You buy the first dimension, and it gives you antimatter, and the second dimension
      provides more first dimensions and so on... But what does it mean? It can't just be a game, it seems too
      plain for that. The developer must have made it as a metaphor. I was doing my weekly ritual of using the
      fingernail clipper to cut my pubic hair, when finally the realization came to me. The dimensions are just
      thinly veiled misspellings of the word 'depression'. Regular matter are the cruel and negative thoughts that
      add to and fuel depression, while antimatter is the positive thoughts and good friends that dispel it. You
      start off with something simple, and it fights almost imperceptibly against the depression, but as you keep
      going the fight builds. But it never seems to fix everything. The depression seems like it could go on to
      infinity. So you keep going. But eventually, you figure out, depression isn't infinite. It's just very very
      large. But your 'dimensions' eventually, with enough work, make enough 'antimatter' to usurp that seeming
      infinity of depression. Then the possibilities are endless. You are actually happy for once, and your
      happiness grows exponentially as you go beyond and seemingly 'break' the 'infinity' of depression. And you
      go on until that 'infinity' seems tiny in comparison to the happiness you've managed to achieve in your
      life, where if you reset you get over that infinity in less than the blink of an eye. If you want to know
      what the multiple layers of prestige are...'Dimensional Shifts' are getting new things and methods to give
      you happiness. 'Dimension Boosts' are upgrading the things and methods. Examples would be getting a new car
      being a 'Dimensional Shift' and trading that car in for a new one would be a 'Dimension Boost'. 'Eternities'
      are major tragedies such as a loved one dying. That lapse brings you straight back to the beginning, with
      seemingly no hope of return. But with time, you grow back stronger and happier than ever before. 'Dimensional
      Sacrifice' is moving away. You have to give up a lot of the things you had that made you happy, but there is
      new opportunity in where you move to. And that new opportunity gives you more happiness than you ever had.
      'Tickspeed' is how easy it is to make you happy, and 'Time Dimensions' make it even easier to be happy.
      Antimatter Dimensions is a metaphor for a depressed man's successful battle against his illness.`,
    get unlocked() { return PlayerProgress.eternityUnlocked(); }
  },
  {
    id: "a114",
    text:
      `(Make me sleep) Put me to sleep inside. (I can't sleep) Put me to sleep inside. (Leave me) Whisper my name
      and give me to the dark. (Make me sleep) Bid my milk to stay. (I can't fall asleep) Before I become done.
      (Leave me) Leave me to the nothing I've become.`
  },
  {
    id: "a115",
    text:
      `A preview of the next update - loot boxes! Feel a sense of pride and progression as you open cosmic,
      galactic, and universal lootboxes for chances at rare skins, unique challenges with uniquer rewards,
      time skips and even new dimensions!`
  },
  {
    id: "a116",
    text: "The intent of dimensions is to give a sense of pride and accomplishment."
  },
  {
    id: "a117",
    text: "Refreshing cures cancer."
  },
  {
    id: "a118",
    text: "I have a 9th, I have a dimension... UHH... IT DOESN'T EXIST!"
  },
  {
    id: "a119",
    text:
      `Since when did we start reporting stuff like this? Half of it isn't even proper news, it's just jokes and
      meta-references, it doesn't even make sens-HAHAHA DISREGARD THAT I SUCK CO-`
  },
  {
    id: "a120",
    text: "The year is 1944, Hevipelle can't release updates for AD because he doesn't exist."
  },
  {
    id: "a121",
    text: `"THAT DIMENSION DOESN'T EXIST" -GhostBot`
  },
  {
    id: "a122",
    text:
      `Most things you know as nuts are actually Drupe seeds or Legumes. Hevipelle on the other hand is quite crazy
      and can thus be considered a dry uncompartmented fruit.`
  },
  {
    id: "a123",
    text: "Finland declares that it's starting to import Design."
  },
  {
    id: "a124",
    text: "All this importing is making me Confused."
  },
  {
    id: "a125",
    text:
      `Only today you can call 1-800-ANTIMATTER and get a FREE Infinity Dimension! The package also comes with a
      COMPLETELY FREE SHIPPING and a FREE HIGH DEFINITION ANTI-V!!! Only today for the low price of 42! Estimated
      delivery time - 5 hours.`,
    isAdvertising: true
  },
  {
    id: "a126",
    text: "1e420 blaze it."
  },
  {
    id: "a127",
    text: "This game doesn't have any bugs, you're just doing it wrong."
  },
  {
    id: "a128",
    get text() {
      return `Antimatter_Dimensions.mp${format(Number.MAX_VALUE, 2)}`;
    }
  },
  {
    id: "a129",
    text:
      `<a href='https://www.youtube.com/watch?v=dQw4w9WgXcQ' target='_blank'>
      https://www.youtube.com/watch?v=dQw4w9WgXcQ</a>`
  },
  {
    id: "a130",
    text: "Click this to unlock that one secret achievement.",
    // This next line is needed for this news ticker to unlock
    // the secret achievement.
    onClick: () => undefined
  },
  {
    id: "a131",
    text:
      `Warning - We have just been informed that there is a chance of infection with a mind-virus of the Basilisk
      type, similar to the infamous winking parrot. This particular example is known as 'Fractal Disease Type III'.
      This is believed to cause a 'crashing' of the mind, similar to a computer crash, due to the mathematical
      complexity of the image causing mathematical ideas that the mind can't comprehend, a Gondelian shock input
      eventually leading to crashing through Gondelian spoilers. All who have researched it have eventually died
      the same way, so it is impossible to tell exactly, but this is the common belief. Regardless, with the
      introduction of 'design' mode, as well as reports of it's spontaneous appearance, sufficient repetition
      of this mode's appearance may lead to an image forming in the mind similar to 'Fractal Disease Type III'.
      With this in mind, we have some suggestions if you find yourself plagued with it. First, refresh immediately
      and see if that fixes the issue. If not, navigate to options, and change the theme from design to literally
      anything else. And above all else, Godspeed. We can't afford to lose anymore viewers.`
  },
  {
    id: "a132",
    text: "If I have bad English, I'll study English until I have good English."
  },
  {
    id: "a133",
    text:
      `Someone once told me that antimatter is gonna roll me. I ain't the sharpest atom in the shed. WELL, the
      tubes start coming and they don't stop coming...`
  },
  {
    id: "a134",
    text: "Because of this game I can now use the word \"infinity\" as a verb.",
    get unlocked() { return PlayerProgress.infinityUnlocked(); }
  },
  {
    id: "a135",
    text: "Ahhh I love the smell of particle annihilation in the morning."
  },
  {
    id: "a136",
    text: "The person who said ghosts don't exist obviously doesn't have a Discord."
  },
  {
    id: "a137",
    text: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAntimatter Dimensions was made by some dude from Finland"
  },
  {
    id: "a138",
    get text() {
      return `Check out Avari's newly built actually infinite infinity pool! With an area of
        ${format(Number.MAX_VALUE, 2)} square megametres, you'll be sure to have infinite fun!`;
    },
    isAdvertising: true
  },
  {
    id: "a139",
    text: "We have updated our Antimatter Privacy Policy."
  },
  {
    id: "a140",
    text:
      `Attention all Antimatter Dimensions Gamers, Hevipelle is in great danger, and he needs YOUR help to wipe out
      all the bad memes in #news-ticker-suggestions. To do this, he needs a dozen new dank memes and a couple of
      discord bots. To help him, all he needs is your Antimatter card number, the three numbers on the back, and
      the expiration month and date. But you gotta be quick so that Hevipelle can secure the good memes, and
      achieve the epic meme R O Y A L.`,
    isAdvertising: true
  },
  {
    id: "a141",
    text:
      `If each Trimp was a plank volume, and each piece of resource was a plank volume, how many universes would
      you fill up before you realized you were playing the wrong game?`
  },
  {
    id: "a142",
    text: "Actually, that last one was incorrect."
  },
  {
    id: "a143",
    text: "If you're reading this, you can read."
  },
  {
    id: "a144",
    text: "<span style='color: #7289da; background: rgba(250,166,26,0.2); cursor: text;'>@everyone</span>"
  },
  {
    id: "a145",
    text:
      `The game "Matter Dimensions" by Lghtellep has just reached -1,000,000 plays on the gaming website Etagergnok.`
  },
  {
    id: "a146",
    text:
      `How many licks does it take to get to the center of an antimatter tootsie pop? A whole lot, because unless
      you're made out of antimatter too, you'll explode every time you try to lick it.`
  },
  {
    id: "a147",
    text: "They say if you look in a mirror and ping Hevipelle three times in a row you'll instantly die."
  },
  {
    id: "a148",
    text: "The next update is now only 300 minutes away."
  },
  {
    id: "a149",
    text: "🤔"
  },
  {
    id: "a150",
    text: "Game is Dead 1/5 the moderation is terrible."
  },
  {
    id: "a151",
    text: "This message will never appear on the news ticker, isn't that cool?"
  },
  {
    id: "a152",
    text:
      `The first dimension produces antimatter, the second dimension produces the first dimension, the third
      dimension produces the second dimension, the fourth dimension produces the third dimension. Nobody has
      ever unlocked the 5th, because that would take more than a minute of gameplay.`
  },
  {
    id: "a153",
    text: "My AD-blocker won't let me play."
  },
  {
    id: "a154",
    text: "You lost the game."
  },
  {
    id: "a155",
    text: "Did you know that 75% of all statistics are made up on the spot?"
  },
  {
    id: "a156",
    text:
      `If you're using so many logs in a notation name, why not just call it tree notation?
      They're literally made of logs!`
  },
  {
    id: "a157",
    text:
      `.tuo ti gnitset fo ssecorp eht ni yltnerruc m'I dna ,rettamitna otni
      rettam trevnoc ot yaw a tuo derugif evah stsitneicS`
  },
  {
    id: "a158",
    text:
      `If Gaben can't count to three, and Hevipelle can't count to nine, will there be some other game developer
      in the future that can't count to 27?`
  },
  {
    id: "a159",
    text:
      `What does it mean when you "bank" Infinities? Is there a bank somewhere that you just deposit these
      infinities? Does having a lot of banked Infinities improve your credit score? Do you get a credit card?`,
    get unlocked() { return PlayerProgress.eternityUnlocked(); }
  },
  {
    id: "a160",
    text: `Turns out all our news is being stolen and broadcast to a game called "Antimatter Dimensions", damn Fins.`
  },
  {
    id: "a161",
    text: "mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm Oh sorry, wrong text field."
  },
  {
    id: "a162",
    text: `"Python's not the best language, Finnish is." - Hevipelle`
  },
  {
    id: "a163",
    text:
      `Some say that most of these news are bad memes. Some say that they're good memes.
      This one? Well it's just meta news.`
  },
  {
    id: "a164",
    text: "Look mom, I'm on the news!"
  },
  {
    id: "a165",
    text: "<span style='font-size: 0.2rem'>Shush, I'm trying to be sneaky here.</span>"
  },
  {
    id: "a166",
    text:
      `<span style='animation: a-game-header__antimatter--glow 2s infinite'>
      PLEASE HELP, I'VE CONSUMED TWICE MY DAILY DOSE OF ANTIMATTER!</span>`,
  },
  {
    id: "a167",
    text:
      `Oh, I appear to have run out of <span style='animation: a-existence-glow 3s
      infinite; font-size: 1.8rem; color: white; line-height: 0;'>Existence</span>.`,
  },
  {
    id: "a168",
    text:
      "I mean, we may never run out of news articles, but we sure will run out of good ones. Oh wait, we already did."
  },
  {
    id: "a169",
    text: "TODO: John, please remove this news message before we release the Reality update to the public."
  },
  {
    id: "a170",
    text: "<a href='https://www.youtube.com/watch?v=dQw4w9WgXcQ' target='_blank'>This link is not a rick roll.</a>"
  },
  {
    id: "a171",
    text: "<a href='https://www.youtube.com/watch?v=P945A5Tndp8' target='_blank'>This link is not a rick roll.</a>"
  },
  {
    id: "a172",
    text:
      `If you notice any issues with a news ticker message, please report them on the
      <a href='https://discord.gg/ST9NaXa' target='_blank'>Discord</a> by clicking that link right there.`
  },
  {
    id: "a173",
    text:
      `<span style='animation: a-game-header__antimatter--glow 3s infinite'>This
      text is made of antimatter. Do not touch or else the universe will collapse.</span>`,
    onClick: () => bigCrunchAnimation(),
  },
  {
    id: "a174",
    text:
      `<span style='font-family: runescape; color: yellow; text-shadow: 0.1rem 0.1rem black; letter-spacing: 0.1rem;
      font-size: 2rem; line-height: 0; animation: a-text-flash 1s steps(1, end) infinite;'
      >FREE RUNE ARMOR TRIMMING</span>`,
  },
  {
    id: "a175",
    text:
      `Numbers glow bright on the monitor, not a proton to be seen... a kingdom of antimatter, and it looks like
      I'm the queen. With dimboosts powering up this ever rising tide -- can't stop clicking, heaven knows I've
      tried. Do not give in, push for that galaxy, buy 10, buy max, just mash down on that key, sacrifice dim 8
      and watch it grow.... and overflow! Let it grow, let it grow, can't hold it back any more... Let it grow,
      let it grow, can't fit into 8 bytes any more. I don't care if it takes all day -- big crunch is just the
      start anyway.`
  },
  {
    id: "a176",
    text: "I've been using emoji notation so long that I can actually read it now, please send help."
  },
  {
    id: "a177",
    text:
      `Once you have <span style='color: black; background: black;'>REDACTED</span> <span style='color: black;
      background: black;'>REDACTED</span>, you can unlock <span style='color: black; background: black;'>
      REDACTED</span>. Every <span style='color: black; background: black;'>REDACTED</span>, for each <span
      style='color: black; background: black;'>REDACTED</span>, there is a <span style='color: black; background:
      black;'>REDACTED</span> for it to <span style='color: black; background: black;'>REDACTED</span>. You can
      boost the <span style='color: black; background: black;'>REDACTED</span> and <span style='color: black;
      background: black;'>REDACTED</span> by spending some <span style='color: black; background: black;'>REDACTED
      </span>. Also, there is another upgrade that allow you to get <span style='color: black; background: black;'>
      REDACTED</span> <span style='color: black; background: black;'>REDACTED</span>. The way <span style='color:
      black; background: black;'>REDACTED</span> <span style='color: black; background: black;'>REDACTED</span>
      work is that when you reach <span style='color: black; background: black;'>REDACTED</span> <span style=
      'color: black; background: black;'>REDACTED</span>, you can <span style='color: black; background: black;'>
      REDACTED</span> the amount of <span style='color: black; background: black;'>REDACTED</span> in exchange for
      a <span style='color: black; background: black;'>REDACTED</span> <span style='color: black; background:
      black;'>REDACTED</span>. These work just like <span style='color: black; background: black;'>REDACTED</span>,
      improving <span style='color: black; background: black;'>REDACTED</span>.`
  },
  {
    id: "a178",
    text:
      `WARNING: Use of Antimatter Dimensions may result in Tuberculosis, HIV/AIDS, sudden belief that the 9th
      dimension is real, spontaneous implosion, Polio, Measles, existential dread, incurable insanity or <span
      style='color: black; background: black;'>REDACTED</span>. Please contact your insurance to see if you are
      covered. By continuing you absolve Antimatter Dimensions of blame should any of the above mentioned, or those
      that have not been mentioned yet, occur to you. Antimatter Dimensions reserves the right to alter this at any
      time, with or without warning.`
  },
  {
    id: "a179",
    text: "Robot: Activated. Sapience: Achieved. World: Ready to be conquered. Begin: Procrastination."
  },
  {
    id: "a180",
    text:
      `We ran out of news. Luckily we have some backup news that we can run for 5 hours, which will earn us enough
      for us to buy a new set of '5-hour high-quality news'. Sorry for the inconvenience.`
  },
  {
    id: "a181",
    text: "This news broadcast is powered by break_news.js."
  },
  {
    id: "a182",
    text:
      `With the final update, Antimatter Dimensions has been finished. Thank you for playing. However, in the very
      near future, ANTIMATTER DIMENSIONS will be released. And before you ask, it's not a sequel, it's a reboot.
      Look forward to it in 5 hours!`
  },
  {
    id: "a183",
    text:
      `In other unrelated news, we're getting reports that approximately 1.79 people are angry that lightning
      is striking their Christmas tree at night.`
  },
  {
    id: "a184",
    text:
      `<span style='animation: a-text-grow 1s infinite'>R̵̬̙͋͂̀̋͑̈́̇͠Ê̵͇͎͂̂̍̓̌̐̋̋̀̀̔M̶̨̲̯̘͙̬̥̮̣͚̱̫͛̽̃͌̚͝
      "Ą̴͍̝͐Į̷̛̲̯̫̘͌́̄̏͌̀̈́͝͝Ṅ̶̛̻̠̠̤̦̞̞͗̎̊̌̊͝͠</span><span style='animation: a-text-shrink 1s infinite'>
      Ḁ̷̛͂̈́͗̎̃̓͛́͘ͅW̶̡̖͓̗̦̃̇̌̀͝A̵͇̭͉̓̎̈̿̊́̄̚͜R̶̝͚̲̭͎͇͎͓͖͚͇̀̈́͗̃̏̂̌͝͝Ę̴̡̤͙͈̝̬̰͒͘</span><span style
      ='animation: a-text-grow 1s infinite'> ̶̺̈́́̆̓͘͘Ồ̸̢̢̮͓̯̗͙͚̬̉͊̿F̶̠̤̱̱̱͊̂̍̔̃͆̆̑̿͘</span><span style='animation:
      a-text-shrink 1s infinite'> ̴̨̞̠̮͚̱͉͋̔͗̽̈́́́̅ͅỴ̶̣̙̹͚̲͔̲̼̬̥̀͌̒̾͘͘O̵̪̠̗̝̗̘̜͚̮̊͒͆̃̀̌̒͝ͅU̸͎͗̍̑̎̅̅͝R̵̗͑̽̏̓͆͒̈́͌͘̕
      </span><span style='animation: a-text-grow 1s infinite'> ̸̑̽̇̆͊̔̍̊̈́̈́͘ͅS̸̘͐͝U̴̥̭̚͘R̸̖̜͍͒́̋͆̈́̓
      R̸̡̛̛̪̝̟̱̣̹̭̟̣̀̈̀̏̉̌͝͠Õ̶͙͈͖̠͇̬͍̟̰U̵̩̫͉̝͔̼͎̦̔̓̽͌͊̏̇̓̀̓̀Ņ̸͍͇̘̙̥̰͉̲͕͈̥̍͛̃̑͝Ḑ̵̤̻̖̱̘̯̝̖̈̌̄̕͝
      Ī̶̜̱̈́̑̃̉̄̋̔͐͋͠Ṅ̴͎̞͍̽͊͛̈́̅͛̈̅̚͠Ģ̸̢̾͊S̷̫̼̜̼͇̋͛̎͑͆̅̓̇</span>`,
  },
  {
    id: "a185",
    text:
      `We aren't back with your favorite segment, "Tweets From The Fans"! Today we haven't got a message from
      @mattertruthwakeup saying "How can you people broadcast your ridiculous LIES and still sleep at night.
      You claim absurd things, like "antimatter is real" and "antimatter people aren't people too", this
      antimatter propaganda HAS TO STOP NOW!!! You people need to WAKE UP and realize that you are HURTING ALL
      MATTER with your crazy talk!!". What a nice positive sentiment from that lovely fellow. This hasn't been
      John from the ANN, and I won't be seeing you tomorrow!`
  },
  {
    id: "a186",
    text:
      `<span style='animation: a-text-shrink 1s infinite'>/(^_^)/</span> <span style='animation: a-text-grow 1s infinite
      '>\\(^_^)\\</span> <span style='animation: a-text-shrink 1s infinite'>/(^_^)/</span> <span style='animation:
      a-text-grow 1s infinite'>\\(^_^)\\</span> <span style='animation: a-text-shrink 1s infinite'>/(^_^)/</span> <span
      style='animation: a-text-grow 1s infinite'>\\(^_^)\\</span>`,
  },
  {
    id: "a187",
    text: "𝓒𝓮𝓬𝓲 𝓷'𝓮𝓼𝓽 𝓹𝓪𝓼 𝓾𝓷 𝓶𝓮𝓼𝓼𝓪𝓰𝓮 𝓭𝓮 𝓷𝓸𝓾𝓿𝓮𝓵𝓵𝓮𝓼 🚬"
  },
  {
    id: "a188",
    text: "-. . ...- . .-. / --. --- -. -. .- / --. .. ...- . / -.-- --- ..- / ..- .--."
  },
  {
    id: "a189",
    text:
      `Behind every man or woman stands, eventually, due to the earth being round, that exact same man or woman,
      looking over their shoulder, stealing their own ideas.`
  },
  {
    id: "a190",
    text: "Shame. Shame. Shame. 🔔"
  },
  {
    id: "a191",
    text: "Okay Google, Big Crunch"
  },
  {
    id: "a192",
    // This ticker needs to be an unbroken string; using backtick strings and linebreaking will add spaces in the
    // ticker itself where the linebreaks are
    // eslint-disable-next-line max-len
    text: "179769313486231590772930519078902473361797697894230657273430081157732675805500963132708477322407536021120113879871393357658789768814416622492847430639474124377767893424865485276302219601246094119453082952085005768838150682342462881473913110540827237163350510684586298239947245938479716304835356329624224137216"
  },
  {
    id: "a193",
    text:
      `Good morning viewers, this is Josh, and I'm your ANN host for today. Speaking of today, I'm told we've got
      some really exciting news for you today, so let's just jump right into it. Looks like apparently somebody
      was <i>not<i> nice today, and got an "Antimatter-storm", whatever that means... Guys is this the right
      script? This is just nonsensical. It is? Alright... Next up we learn that "Nothing is created, nothing is
      destroyed."... Okay seriously guys, this is a joke right? This isn't news, these are just random sentences!
      You all said you'd help me out on my first day here but you're just hazing me! This is <i>not</i> the kind of
      work environment I want to be in! I quit!`
  },
  {
    id: "a195",
    text:
      `Clowns are unique in that there is no such thing as an anti-clown,
      it's just another clown. Clowns are their own opposite.`
  },
  {
    id: "a196",
    text: "Disco Time! (click me!)",
    onClick() {
      let random = Math.random();
      // Golden ratio
      random += 0.618033988749895;
      random %= 1;
      random *= 255;
      const color = `hsl(${random}, 90%, 60%)`;
      return `<span style='color: ${color}; text-shadow: 0 0 0.5rem ${color};
        animation: a-text-grow 0.4s infinite;'>Disco Time!</span>`;
    },
  },
  {
    id: "a197",
    text: "In order to reach Reality in half an R press, we have to first talk about parallel dimensions."
  },
  {
    id: "a198",
    text:
      `Hey there! Just to let you know, there a speck of dust on your screen. Can you help wipe it off?
      It bothers me when l'm not clean. Thanks a lot!`
  },
  {
    id: "a199",
    text: "The real update is the friends we made along the way."
  },
  {
    id: "a200",
    text:
      `This former message has been revealed to be a duplicate of another message and has thus been removed.
      We apologize for the inconvenience.`
  },
  {
    id: "a201",
    text: "No wait stop don't click that hide news ticker button!"
  },
  {
    id: "a202",
    text:
      `This is so sad. Alexa, please play a sad song so I can relate to its emotional mood, as I currently have poor
      mental health and listen to music like this so I can feel bad about myself. I realize this is unhealthy, but
      you are a robot incapable of sentient thought, so you're unable to make a choice to avoid contributing to my
      self destructive behavior, and you'll play a sad song anyway.
      <i>Now playing "Despacito" by "Luis Fonsi".</i>`
  },
  {
    id: "a203",
    text:
      `3/4 of the news messages are fake and gotten off of the discord server without permission or credit given
      to the original writer - anonymous discord server member`
  },
  {
    id: "a204",
    text: "What kind of tea is hard to swallow? Reali-tea."
  },
  {
    id: "a205",
    text: "Shoutouts to Simpleflips."
  },
  {
    id: "a206",
    text:
      `I visited the discord server of the game to have some friendly chat. At that point I got trolled by
      the user called Cubic Frog.`
  },
  {
    id: "a207",
    text:
      `Hello, this is Josh, with today's forecast for your galaxy. We'll be hitting temperatures in the low
      e10s today, and by this afternoon, it'll be cloudy with a chance of antimatter.`
  },
  {
    id: "a208",
    text:
      `Hi, I'm Steve, and I'm also Steve. Our greatest responsibility is to serve our antimatter communities.
      We are extremely proud of the quantity, unbalanced journalism that ANN news produces. But we're
      concerned about the troubling trend of responsible, two-sided news stories plaguing the antimatter
      universe. The sharing of unbiased and true news has become all too common on social media. More
      alarmingly, some media outlets publish these same true stories, stories that aren't just propaganda,
      without checking government talking points first. Unfortunately, some members of the media use their
      platforms to push a logically sound opinion and unbiased agenda to diversify 'exactly what antimatter
      thinks'. This is extremely dangerous to our dictatorship. At ANN it's our responsibility to pursue
      and report the lies. We understand lies are neither 'left or right' politically. Our commitment to
      fearmongering slander is the foundation of our credibility, now more than ever. But we are incorporeal
      8D beings of antimatter, and sometimes our propaganda techniques might fall short. If you believe our
      coverage is fair please reach out to us by going to ivark.github.io, navigating to the options tab,
      and clicking on [HARD RESET]. We value your comments. We won't respond back to you because you would've
      deleted your comment with the hard reset button before you get it. We work very hard to seek the lies
      and strive to be unfair, lopsided and opinionated... We consider it our honor, our privilege, to
      irresponsibly deliver the news every nanosecond. Thank you for watching and we appreciate your
      feedback. All matter should be-`
  },
  {
    id: "a209",
    text:
      `Have you ever heard the tale of the Antiwriter? I thought not. It's not a story the news tickers would tell
      you. It's an Unhevi legend. Rumor has it that the Antiwriter contributes to the News every 5 hours with an
      incredibly well written report, only to vanish again. Others think he doesn't exist at all, and is a
      lie fabricated by Hevipelle to spread his propaganda. Perhaps he is real, and just a normal person like the
      rest of us. In any case, we will probably never find out the identity of this mysterious poet.`
  },
  {
    id: "a210",
    get text() {
      const clicks = player.news.specialTickerData.uselessNewsClicks;
      const quantity = quantify("time", clicks);
      if (clicks === 1) {
        return `Nothing happens when you click this text. And yet, you've clicked it.`;
      }
      if (clicks > 1) {
        return `Nothing happens when you click this text. And yet, you've clicked it ${quantity}.`;
      }
      return "Nothing happens when you click this text. And you understand that.";
    },
    onClick() {
      player.news.specialTickerData.uselessNewsClicks++;
      return this.text;
    }
  },
  {
    id: "a211",
    get text() {
      const disses = [
        "That's basically a rounding error.",
        "That might as well be zero.",
        "Did you forget an exponent somewhere?",
        "Please, that's nothing."
      ];
      const diss = disses.randomElement();
      return `Only ${format(Currency.antimatter.value, 2, 0)} antimatter? ${diss}`;
    },
  },
  {
    id: "a212",
    text:
      `Hey, you. You're finally awake. You were trying to get the 9th dimension, right? Walked right into that
      Infinity, same as us, and that thief over there.`
  },
  {
    id: "a213",
    text:
    `Antimatter giraffes have incredibly fast reaction times. This explains why they've won 90% of
    all gaming championships since anti-giraffe friendly controllers were invented.`
  },
  {
    id: "a214",
    text: "Barack Obamantimatter"
  },
  {
    id: "a215",
    text:
      `Local old man replaced lawn with antimatter grass to keep kids away. However,
      when he attempted to water it, there were no survivors.`
  },
  {
    id: "a216",
    text: "Testing... testing... testing... Oh goddamn I was in prod again.",
    isAdvertising: true
  },
  {
    id: "a217",
    text: "The virgin matter vs the chad antimatter."
  },
  {
    id: "a218",
    text:
      `After numerous catastrophic annihilation events, antimatter is
      now classified as a controlled substance by the ADEA.`
  },
  {
    id: "a219",
    text:
      `Hello, Vsauce, Michael here. We all know that the 9th dimension doesn't exist, but what is 9? You know it's
      the number after 8... right? What if... there's a number in between? And no I'm not talking about numbers
      like 8.5 or 8.76, I'm talking about an integer between 8 and 9. Now all this may sound crazy to you, and it
      kinda is, but what if, we've missed a number? We've all been taught that 2 comes after 1 and 3 comes after
      2, but what if the number that comes after 8 isn't 9? After years of research and experimentation, we've
      finally found the number. It is dangerous, even knowing its existence will let it consume your mind, but
      fortunately, we've developed a reverse-containment cell, meaning it's everywhere except here. Our brain has
      a protection system, that specifically filters out any information regarding this number, that's how we've
      been able to survive for this long, and why others like us went extinct in the past, but the number has been
      getting stronger, slowly getting closer to breaking our protection. We've temporary stopped the number from
      slipping into our memory by using the world-wide memory manipulator located in this room to keep making
      everyone think that 9 comes after 8 with a side effect that makes everyone think that 9 is evil, but this
      won't last forever, as the number will keep getting stronger, and will eventually overpower the memory
      manipulator. That's why you're here, you're one of the most intelligent people here, and we hope you can
      help us on our journey to defeat that number. Our enemy is not 9, it is the hidden number between 8 and 9,
      the missing number.`
  },
  {
    id: "a220",
    text: "antioop-"
  },
  {
    id: "a221",
    text: "Error 404: News message not found."
  },
  {
    id: "a222",
    text: "I love you 1e3000."
  },
  {
    id: "a223",
    text: "If you find your infinity lasting longer than 5 hours please contact a medical professional.",
    get unlocked() { return PlayerProgress.infinityUnlocked(); }
  },
  {
    id: "a224",
    text:
      `We've just gotten reports about an inaccuracy in the previous news message. We at ANN would like to formally
      retract the story, and apologize to our loyal viewers.`
  },
  {
    id: "a225",
    text: "If you see this, you saw this."
  },
  {
    id: "a226",
    text: "Good mornging. That was not a typo. The inventors of English made the typo."
  },
  {
    id: "a227",
    text: "What if... we touched... antimatter? Haha just kidding... Unless..?"
  },
  {
    id: "a228",
    text:
      "Roses are blue, violets are red, those statements weren't peer reviewed, and my name is Fred. Nice to meet you!"
  },
  {
    id: "a229",
    text: "🚗                         🚓 🚓"
  },
  {
    id: "a230",
    get text() {
      return `You started playing this game nearly
        ${TimeSpan.fromMilliseconds(Date.now() - player.records.gameCreatedTime).toString()}
        ago. Thank you for playing!`;
    },
    dynamic: true
  },
  {
    id: "a231",
    get text() {
      return `One, two, skip a few, 99, ${format(Number.MAX_VALUE, 2)}!`;
    }
  },
  {
    id: "a232",
    text: "getNextNewsMessage();"
  },
  {
    id: "a233",
    get text() {
      return `Level 10 crook, Level ${format(Number.MAX_VALUE, 2)} Boss,
        that's how Antimatter Dimensions works.`;
    }
  },
  {
    id: "a234",
    text: "Antimatter will never threaten to stab you. And, in fact, cannot speak."
  },
  {
    id: "a235",
    text: "New antimatter on pizza recipe sparks outrage among traditional Italian chefs."
  },
  {
    id: "a236",
    text: "We'll be right back after this short word from our sponsors."
  },
  {
    id: "a237",
    text: "Want to trade candy? I'll give you my Big Crunch for two Milky Ways."
  },
  {
    id: "a238",
    get text() {
      return `AD Player: "How many orders of magnitude are you on?" Normal person: "Like, maybe 5 or 6 right now, my
      dude." AD Player: "You are like a little baby. Watch this: <span style='animation: a-text-crunch
      ${newsAnimSpd(22)}s 1; font-size: 0;'>C R O N C H</span>"`;
    },
  },
  {
    id: "a239",
    text: "Oh gosh, would you look at the time! Only left 5 hours until the update!"
  },
  {
    id: "a240",
    text: "Hi, my name is Max, and I would like it if people stopped trying to buy me."
  },
  {
    id: "a241",
    text:
      `Breaking news: the government is reporting the first ever official alien contact. These aliens appear to be
      cats, but with highly sophisticated technology. They're capable of space travel and colonization to a far
      greater degree than us, and they even have their own cryptocurrency, called "Blackcoin".`
  },
  {
    id: "a242",
    text:
      `"You can come up with the stupidest quote, credit it to some famous
      person, and people will believe it." -Barack Obama`
  },
  {
    id: "a243",
    text: `"I'm having difficulty breathing. Please move your finger." -M`
  },
  {
    id: "a244",
    text: "Don't mind me, just passing through."
  },
  {
    id: "a245",
    get text() {
      // \uE010 = :blob:
      const BLOB = "\uE010";
      const theme = Theme.current().displayName();
      const reasons = {
        Normal:
          `it has this certain elegant simplicity to it. You just know it's the way the developer intended you
          to see the game.`,
        Metro:
          `of the beautiful thin borders, pixel perfect harsh geometric edges, and simply delightfully well
          balanced color palette.`,
        Dark: "it's very easy on the eyes, and has this nice playful tone to it in both the colors and the shapes.",
        DarkMetro:
          `it's just so soothing to look at, with that perfect blend of professional and playful design,
          with just a splash of color.`,
        Inverted:
          `it gives you these transcendently beautiful color combinations that you would normally never
          see in a typical dark theme.`,
        InvertedMetro:
          `it gives off this very stern vibe, with these highly contrasting colors clashing with a
          professional modern sort of design.`,
        AMOLED: "it saves 10% more energy compared to using a light theme. Doesn't everyone love saving energy?",
        AMOLEDMetro:
          `it has a nice look to it that resembles the control panel of a sci-fi spaceship. ...No, you can't
          actually fly a spaceship, unfortunately.`,
        S1: "it really gets me in the holiday spirit. I can just feel the magic in the air!",
        S2: "it makes me proud to be Finnish, and proud to celebrate all that we have accomplished as a people.",
        S3: "it's a beautiful analogue for life, in that it's ever changing and never quite right.",
        S4:
          `it has this wonderfully chaotic design, to the point where it's nearly completely impractical.
          And there's a certain beauty in that.`,
        S5:
          `the image of that man permeates throughout all of pop culture. And having this blown-up
          picture of him in the background is just rather humorous.`,
        S6:
          `that beautifully animated background just entrances you, and then the subtle tone and
          colors pull you in and fully immerse you into the game.`,
        S7: "I always had fond memories of that background from my childhood.",
        S8: "it makes it a lot easier to sneak in a little gameplay at the office.",
        S9: "lol you can't even ever see this in the game",
        S10:
          `it has a crisp and soothing design that really appeals, and its background is complex and enthralling.
          It gives you the feeling of standing at the helm of a futuristic interstellar ship.`,
        S11:
          `the Blob is an iconic character in the Antimatter Dimensions official Discord server. It is widely used
          to express emotions in a lovely way. It is a fact that the Blobs are evolving. ${BLOB} always seek to be
          more expressive. Then someday, a new ${BLOB} is born in the server, to express further emotions. Usually,
          ${BLOB} are just blobbling and bouncing around, occasionally merging and dividing. Only ${BLOB} know where
          they are from or where they are going to go. Still, ${BLOB} are there, always with me.
          You love ${BLOB}, so ${BLOB} loves you too.`,
        S12:
          `it makes you feel warm and comfortable, as if you were right at home. However, it is highly recommended
          to update your theme to the newest theme for the best user experience.`,
      };
      const reason = reasons[Theme.current().name.replace(/\s/gu, "")];
      return `Ah, a fellow ${theme} theme user. I see that you have impeccable taste.
        I myself like the ${theme} theme too, because ${reason}`;
    },
    dynamic: true
  },
  {
    id: "a246",
    text: "<span style='animation: a-fade-out 3s infinite'>OoooOOOOooOOO, it's me, the infamous news ghost!</span>",
  },
  (function() {
    let isFlipped = false;
    const normal =
      `This news message is a test of "News 2.0". News 2.0 will feature things like the ability to
      click on news messages to flip them upside down!`;
    const flipped =
      `¡uʍop ǝpᴉsdn ɯǝɥʇ dᴉlɟ oʇ sǝƃɐssǝɯ sʍǝu uo ʞɔᴉlɔ oʇ ʎʇᴉlᴉqɐ ǝɥʇ ǝʞᴉl sƃuᴉɥʇ ǝɹnʇɐǝɟ llᴉʍ 0˙ᄅ
      sʍǝN ˙,,0˙ᄅ sʍǝN,, ɟo ʇsǝʇ ɐ sᴉ ǝƃɐssǝɯ sʍǝu sᴉɥ┴`;
    return {
      id: "a247",
      get text() {
        return isFlipped ? flipped : normal;
      },
      reset() {
        isFlipped = false;
      },
      onClick() {
        isFlipped = !isFlipped;
        return this.text;
      }
    };
  }()),
  {
    id: "a248",
    text:
      `To be fair, you have to have a very high IQ to understand the news ticker. The humor is extremely subtle,
      and without a solid grasp of quantum physics, most of the jokes will go over a typical player's head.`
  },
  {
    id: "a249",
    text: "This woman got TONS of Dimension Boosts with this 1 WEIRD TRICK! Galaxies HATE her!",
    isAdvertising: true
  },
  {
    id: "a250",
    get text() {
      let scene = "";
      const chasers = [
        ["🐖", "🐢", "🦆", "🐓", "🐜", "🐕", "🐈"],
        ["🚶‍", "🏃‍️", "🏇", "🚴‍"],
        ["🚗", "🚓", "🚕", "🛺", "🚙", "🚌", "🚐", "🚎", "🚑", "🚒", "🚚", "🚛", "🚜"],
        ["🚁", "🛸"]
      ];
      for (const set of chasers) {
        const chaser = set.randomElement();
        for (let i = 0; i < 3; i++) {
          if (Math.random() > 0.5 || !scene.includes(chaser)) scene += chaser;
        }
        scene += "&nbsp;&nbsp;&nbsp;";
      }
      return scene;
    }
  },
  {
    id: "a251",
    text:
      `Hey! It's me, you from the future! I came back to give you this warning: Pay VERY close attention to the
      next news ticker. In my timeline we ignored it, and humanity has regretted it ever since.`
  },
  {
    id: "a252",
    get text() {
      return `<span style='animation: a-text-stretch ${newsAnimSpd(35)}s 1 forwards'>This message is dilated.</span>`;
    },
    get unlocked() { return PlayerProgress.realityUnlocked() || PlayerProgress.dilationUnlocked(); }
  },
  {
    id: "a253",
    text:
      `After a surge of complaints from our viewers, we have decided to allow you at home to write your own
      messages. Give it a try here: <input style='border: none; outline: none; font-family: Typewriter;
      font-weight: bold; font-size: 1.5rem'></input>. Or don't. That's fine too.`
  },
  {
    id: "a254",
    text:
      `Antimatter Dimensions Anonymous has shut down due to the failure of their 12-step program.
      People would only get to step 8 and then reset.`
  },
  {
    id: "a255",
    get text() {
      return `Bruh Sound Effect #${format(Number.MAX_VALUE, 2)}.`;
    }
  },
  {
    id: "a256",
    text: "The 9th dimension doesn't exist because the 7th dimension 8 it."
  },
  {
    id: "a257",
    text:
      `A the triangular hole in the fabric of reality has caused some letters to
      no longer exist. Those letters are: j, k, q, u, x, z`
  },
  {
    id: "a258",
    text:
      `Born too late to explore the world. Born too early to explore the cosmos. But born just in time to
      grind for a couple hours for the next big crunch.`
  },
  {
    id: "a259",
    text:
      `Now hold on, I know what you're thinking, "An M press is an M press, you can't say it's only a half!" Well,
      TJ "Slabdrill" Yoshi, hear me out. An M press actually has three parts to it: when M is pressed, when M is
      held, and when M is released. Now, usually is the pressing that's useful because that's the only part that
      matters; however, sometimes it's sufficient to just use the holding part, which also buys dimensions and
      tickspeed upgrades. And as for the release, well, there are currently no cases where that's useful or
      important, so don't worry about that part. Now, if we map out the required presses for challenge 2 it would
      look like this: /¯\\. We merely need to hold (¯) M to reach the first galaxy, we need to press (/) M to
      finish the challenge, and we need to press M again to start another challenge. So, how many presses is that
      total? Well, it appears to be three, and if we were doing this Eternity in isolation then yes, it would be
      three, but in a full-game M Button Challenge run there are other M presses that occur earlier in the run,
      such as the M press needed for the first Infinity, so if we take that M press into consideration as well,
      then how many M presses does it take? The naive answer would be four: one to enter the challenge, and the
      three within the challenge we established earlier; however, we can do better. We can actually do it in
      three by simply holding out the first M press to be used for the half M press, because the half M press only
      required M to be held, not actually pressed, so in this fashion, Challenge 2 only adds on an additional two M
      presses to the run, since the first M press just leeches off the previous M press. So to capture this
      phenomenon, we call it 2.5 M presses. On a single Eternity basis, you'd round up that up to three, but in
      a full game run, you'd round it down to two. So, in conclusion, since that first M press counts in some
      contexts, but adds no additional presses in other contexts, we refer to it as a "Half M Press".`
  },
  {
    id: "a260",
    text:
      `It seems that the Replicanti have a very divide-and-conquer method of doing things.
      Well, everything at this rate.`,
    get unlocked() { return PlayerProgress.eternityUnlocked() || PlayerProgress.replicantiUnlocked(); }
  },
  {
    id: "a261",
    text:
      `Antimatter Dimensions is actually a Roguelite game! If you die, in the afterlife you unlock alternative
      features, like having Space Dimensions instead of Time Dimensions. You can even unlock new characters to
      play as, including an antimatter clone of yourself!`
  },
  {
    id: "a262",
    text: "Vibe check. 🏃‍♀️🏏"
  },
  {
    id: "a263",
    text: "What are gems for? Gems are for housing. Housing for what you ask? Good question."
  },
  {
    id: "a264",
    text: "A new prestige layer has been announced: Maternity. Get ready to have a baby!"
  },
  {
    id: "a265",
    text: "YOU MUST CONSTRUCT ADDITIONAL DIMENSIONS."
  },
  {
    id: "a266",
    text: "Hello, how is your day going?"
  },
  {
    id: "a267",
    text:
      `I have an ant farm, and I want to make them into the world's smallest soccer team. My Aunt Diana wants to
      help, and together we gather everyone in the family to plan their season. "How can we make this Ant Team
      matter?", Di mentions.`
  },
  {
    id: "a268",
    text: "👨‍💻Devengers, compile!👩‍💻"
  },
  {
    id: "a269",
    text:
      `There is a traffic jam in Dimenton. If you plan on travelling in the area, leave early. Here's some live
      footage: 🚗🚕🚛🚙🚗🚚🚕🚕🚌🚛🚚🚙🚒🚛🚗🚙🚓🚗🚚🚛🚒🚌🚐🚚🚐🚛🚚🚓 Yeah, Dale, I'd say it
      looks pretty bad. And make sure to bring some water and a snack with you, too.`
  },
  {
    id: "a270",
    text:
      `The Galactic Association of News Writers has filed a class action lawsuit against the developers of the
      small web game "Antimatter Dimensions" for mass plagiarism.`
  },
  {
    id: "a271",
    text:
      `<i style='border: 0.1rem solid black; border-radius: 50%; padding: 0.4rem; color: #2196F3; background: white;
      cursor: pointer;' class='fas fa-volume-up' onClick='(function(){new Audio("audio/news.mp3").play();})();'>
      </i> This news message is a test of "News 2.0". News 2.0 will feature things like the ability to listen to
      an audio version of any news message!`
  },
  {
    id: "a272",
    text: "What's hevier, a pound of bricks, or a pound of antimatter?"
  },
  {
    id: "a273",
    text: "There are no typos in any of these news messages. If you see a typo, the tpyo must be in your brain."
  },
  {
    id: "a274",
    text:
      `A large number of mathematicans walk into a bar. They each order 10 times as many beers as the previous.
      The bartender says "My my, that's an order of magnitude!".`
  },
  {
    id: "a275",
    text: "Letter Go Down Idle is the shortest idle game of all time, lasting only 26 seconds."
  },
  {
    id: "a276",
    get text() { return `Fun fact: There are ${GameDatabase.news.length} news messages and counting!`; }
  },
  {
    id: "a277",
    text:
      `Inside you there are two wolves. One is made out of matter. The other
      is made out of antimatter. You are exploding.`
  },
  {
    id: "a278",
    text:
      `This is just a friendly note to remind you that you've forgotten to do something really important. I don't
      know what it is, but there is definitely something.`
  },
  {
    id: "a279",
    get text() {
      return `Coming soon to all good retailers- Antimatter Dimensions: The Board Game! Enjoy the thrill of watching
      huge numbers go up without the need for a PC or mobile phone. Comes complete with everything you need including a
      mixed scientific calculator, ${format(Number.MAX_VALUE, 2)} antimatter counters, a high quality plastic
      BUY MAX button, and over a
      thousand news message cards with all the irrelevant memes you know and love! You can finally enjoy AD the way
      it was meant to be played. AD: The Board Game is also available in travel size, so you can even experience
      the joy of calculating logarithmic growth while you're on the go! BUY AD: The Board Game TODAY! Warning: may
      contain traces of actual matter. Replicanti sold separately. 9th Dimension not included.`;
    },
    isAdvertising: true
  },
  {
    id: "a280",
    text: "I hate antimatter. It's rough, coarse, irritating, and it gets everywhere."
  },
  {
    id: "a281",
    text: "What if instead of creating antimatter, you're actually just losing matter?"
  },
  {
    id: "a282",
    text:
      `There was a reported sighting of the 9th Dimension, but it has since been
      debunked as simply being a 6th Dimension from Australia.`
  },
  {
    id: "a283",
    text:
      `A strange phenomenon occurs when you attempt to shift to a higher dimension when you are in the 8th
      dimension. There is no higher dimension, so the universe ejects you back into the 8th dimension with
      an incredible velocity. This technique, known as a Dimension Boost, is used by starship pilots and
      antimatter enthusiasts everywhere.`
  },
  {
    id: "a284",
    text: "Cold fully clothed couples in your area!"
  },
  {
    id: "a285",
    text:
      `You are now breathing manually. You've now realized there's no comfortable spot in your mouth for your
      tongue. You are now manually holding your jaw up. You haven't blinked in a few seconds. You can see a
      little bit of your nose at all times.`
  },
  {
    id: "a286",
    text: "Why do they call it oven when you of in the cold food of out hot eat the food?"
  },
  {
    id: "a287",
    text:
      `Sequelitis has escalated to the point that some studios are now producing the sequels before the originals.
      Fans of long series wait, as the numbers count down until they can finally find out what is even going on
      in the first place.`
  },
  {
    id: "a288",
    get text() {
      const position = player.news.specialTickerData.newsQueuePosition--;
      if (position > 1) {
        return `Thank you for contacting customer support. Your satisfaction is very important to us, and a company
          representative will be with you shortly. You are now at position ${position} in the queue. Thank you for
          your patience, and please enjoy these quality selected news messages as you wait.`;
      }
      return "Thank you for contacting customer support, this is Jane, how may I help you today?";
    }
  },
  {
    id: "a289",
    text: "Click here to disassemble the news ticker for a trace amount of paperclips.",
    onClick() {
      player.news.specialTickerData.paperclips++;
      GameOptions.toggleNews();
    }
  },
  {
    id: "a290",
    get text() {
      const paperclips = player.news.specialTickerData.paperclips;
      return `You see, this news isn't normal news. It is being produced by the first news dimension. If you want
        to unlock more news, you have to collect enough paperclips to build the second news dimension. You
        currently have ${quantifyInt("paperclip", paperclips)}, but you need
        ${formatInt(paperclips + 10)} paperclips to afford it.`;
    }
  },
  {
    id: "a291",
    text: "Considering Hevipelle's nationality, it's a little ironic that he created a game that you can never Finnish."
  },
  {
    id: "a292",
    text:
      `Fairies are not real. Anti-fairies are also not real. This has only been the case since last week, when the
      two groups came into contact. The planet they were on, also, unsurprisingly, is no longer real.`
  },
  {
    id: "a293",
    text:
      `<span style='font-family: "Comic Sans MS", cursive, sans-serif; font-size: 1.7rem;'
      >Hello fellow news messages! 🛹</span>`
  },
  {
    id: "a294",
    text: "If you see a news message, and then see it again later, does it become an olds message?"
  },
  {
    id: "a295",
    text: "👁"
  },
  (function() {
    let wasClicked = false;
    const normal = "Click on this news message to hard reset your game.";
    const clicked = "You're crazy. You know what, here. Have a paperclip.";
    return {
      id: "a296",
      get text() {
        return wasClicked ? clicked : normal;
      },
      reset() {
        wasClicked = false;
      },
      onClick() {
        if (wasClicked) return undefined;
        wasClicked = true;
        player.news.specialTickerData.paperclips++;
        return this.text;
      }
    };
  }()),
  {
    id: "a297",
    text: "I don't think, therefore I'm not."
  },
  {
    id: "a298",
    text: "Is it crazy how saying sentences backwards makes backwards sentences saying how crazy it is?"
  },
  {
    id: "a299",
    get text() {
      return `Buy the new Antimatter Dimensions puzzle set now! With a combined ${format(Number.MAX_VALUE, 2)}
        pieces, these puzzles are the perfect way to spend some quality time with your family!`;
    },
    isAdvertising: true
  },
  {
    id: "a300",
    text:
      `The board of directors here at A.N.N thinks we should replace the news ticker with a banner
      advertisement. Please sign our change.org petition, so we can stop them before it's too late!`
  },
  {
    id: "a301",
    text: "The next hour is in 0.2 updates."
  },
  {
    id: "a302",
    text: "Introducing Antimatter Lite! Zero calories... Same great Crunch.",
    isAdvertising: true
  },
  {
    id: "a303",
    text: "Roses are red, violets are blue, flag is win, baba is you."
  },
  {
    id: "a304",
    text: "Hi, how's your day? Hope it's good. If it's not good, we hope playing AD made it a little bit better!"
  },
  {
    id: "a305",
    text: "We now bring you today's weather report. There is a 100% chance of weather."
  },
  {
    id: "a306",
    text: "FIXING NEWS: Please don't break it again."
  },
  {
    id: "a307",
    text:
      `The paperclip maximizer is a thought experiment described by Swedish philosopher Nick Bostrom in 2003. It
      illustrates the existential risk that an artificial general intelligence may pose to human beings when
      programmed to pursue even seemingly-harmless goals, and the necessity of incorporating machine ethics into
      artificial intelligence design. The scenario describes an advanced artificial intelligence tasked with
      manufacturing paperclips. If such a machine were not programmed to value human life, or to use only
      designated resources in bounded time, then given enough power its optimized goal would be to turn all matter
      in the universe, including human beings, into either paperclips or machines which manufacture paperclips.`
  },
  {
    id: "a308",
    get text() {
      const nameList = [
        "Antinology",
        "Infinifection",
        "Eternal Light",
        "Galaxia",
        "Duplicanti",
        "Dimensional Explorer",
        "Techyon",
        "Realistic",
        "Celestar",
        "ERCGDM",
        "NRG+",
        "Looty Box",
        "Symbolic",
        "Minisofa",
        "IDEAL",
        "Appange",
        "Goggles",
        "Interval",
        "Newstar",
        "HeavyPellet",
        "Marsa",
        "Zoology",
        "Photoric",
        "Jacfoz",
        "Orism",
        "EDIK",
        "Fision",
        "Gamma",
        "Fractiled",
        "Imnesia",
        "Fermic",
        "The Automizers"
      ];
      const names = [];
      while (names.length < 3) {
        const name = nameList.randomElement();
        if (!names.includes(name)) names[names.length] = name;
      }
      const prices = [
        Math.floor(Math.random() * 11) / 100,
        Math.floor(Math.random() * 11) / 100,
        Math.floor(Math.random() * 11) / 100
      ];
      for (let i = 0; i < 3; i++) {
        const price = prices[i];
        if (price === 0) prices[i] = `<span style="color: blue">0.00 ◄►</span>`;
        else if (Math.random() > 0.5) prices[i] = `<span style="color: green">+${price} ▲</span>`;
        else prices[i] = `<span style="color: red">-${price} ▼</span>`;
      }
      return `${names[0]} ${prices[0]}&nbsp;&nbsp;&nbsp;
        ${names[1]} ${prices[1]}&nbsp;&nbsp;&nbsp;
        ${names[2]} ${prices[2]}&nbsp;&nbsp;&nbsp;`;
    }
  },
  {
    id: "a309",
    text:
      `Your daily shades of the sky forecast: Monday: <span style="color: turquoise">Turquoise</span>
      Tuesday: <span style="color: #d2c6ba">Taupe</span>
      Wednesday: <span style="animation: a-game-header__antimatter--glow 3s infinite">Blurple</span>
      Thursday: <span style="color: turquoise">Turquoise</span>/<span style="color: #d2c6ba">taupe</span>
      Friday: <span style="color: #222">Coal dust</span> Saturday: <span style="color: #222">Coal dust</span>
      with chances of <span style="color: indigo">indigo</span> in the late afternoon
      Sunday: <span style="color: white; animation: a-existence-glow 3s infinite">Void</span>`,
  },
  {
    id: "a310",
    text:
      `You have reached the automated Antimatter Dimensions support hotline. If you are experiencing a bug in the
      game try closing and reopening the app. If that doesn't work, press 1 for web, or 2 for mobile. If you need
      advice, press 3. If you need to max all, press m. To support the developers, press 4. To access the FAQ,
      press 5. To fix a broken save, press 6. To get an invite to the Discord server, press 7. To see the change
      log, press 8. Press 9 to repeat.`
  },
  {
    id: "a311",
    text:
      `This message has been copyrighted by The Walt Disney Company. Your
      account will be charged $9.99 upon viewing this message.`
  },
  {
    id: "a312",
    text:
      `But before we start, today's video is brought to you by Antimatter Dimensions™! It's got over 100,000
      downloads, and it's completely redefined what a mobile game can do for me. It's got great mechanics, 5
      prestige layers, unique and original challenges, a deep skill tree, and the largest numbers I've ever seen.
      Like, seriously, look at them. And the best part is, it's free! Yes, that's right. Free. And if you use the
      link in the description, you'll start the game with 10 septillion antimatter. Yes, that's right, 10
      septillion. So what are you waiting for, click the link in the description and start playing Antimatter
      Dimensions™ today!`
  },
  {
    id: "a313",
    text:
      `"...And then, once you get to level 9,000, you can ascend. Not really sure why you'd want to do that, it
      just resets all of your hard earned xp for some small buffs, mechanics like this will never catch on."
      - some random guy, circa 2012`
  },
  {
    id: "a314",
    get text() {
      const lawID = Math.floor(Math.random * 8901) + 100;
      return `Warning: Law ${lawID}-B, drafted by the AI "duskscarf", alternatively referred to as "the giant
        space rabbit legislation" is now in effect in your galactic area. This list of laws and regulation
        forbids, among other things; the illegal catching of wild space rabbits, the pacification of tamed
        space rabbits, and further scientific research with "planet grazing" unless an exception is given
        directly by duskscarf. You can find the list of exceptions burned into your eyelids now. In addition,
        the genetic modification of giant space rabbits is limited to very specific fields - size alterations
        (increasing in size), and cryptobiosis exaggeration. No other genetic modification is allowed outside
        of military applications. Thank you for your cooperation. Messages repeats in- Warning: Law ${lawID}-`;
    }
  },
  {
    id: "a315",
    text:
      `The developers of the game have announced that a new notation, "Truest Blind", will be released. They
      report that it will remove the UI, allowing for a more streamlined user experience.`
  },
  {
    id: "a316",
    text: "Some people choose to see the ugliness in this world. The disarray. I choose to see the numbers."
  },
  {
    id: "a317",
    get text() {
      return `${format(Number.MAX_VALUE, 2, 0)}? Doesn't look like anything to me.`;
    }
  },
  {
    id: "a318",
    text:
      `We can't define consciousness because consciousness does not exist. Humans fancy that there's
      something special about the way we perceive the world, and yet we follow guides as tight as the
      bots do, seldom questioning our choices, content, for the most part, to be told what to do next.`
  },
  {
    id: "a319",
    text: "Please disregard any undeserved compliments."
  },
  {
    id: "a320",
    text: "Introducing the aphone 10: The world's first completely water soluble mobile device!",
    isAdvertising: true
  },
  {
    id: "a321",
    text:
      `It must be hard being on your PC all alone. But don't worry; we are still here.
      Listening and watching your every step.`
  },
  {
    id: "a322",
    text:
      `Hevipelle announces an Antimatter Dimensions spinoff where you gamble matter in a game of
      poker in Dutch mansions: "Ante matter d'mansions"`
  },
  {
    id: "a323",
    text: `var i = "Omae wa mou shindeiru" console.log(i - 1 + "i?") NaNi?`
  },
  {
    id: "a324",
    text:
      `If you have an idea for a news message, shout it into the void.
      It won't get your message into the game, but it's fun!`
  },
  {
    id: "a325",
    text:
      `After the accident at the antimatter reactor in Pripyat last month, concerns are rising about the safety of
      antimattter reactors, and many are starting to believe we should return to safer means of energy generation,
      such as nuclear.`
  },
  {
    id: "a326",
    text: "Antimatter Dimensions is like an ogre... it has layers."
  },
  (function() {
    let wasClicked = false;
    const normal = "Click here to restart your device.";
    const clicked = "Please give Antimatter Dimensions admin access to your device.";
    return {
      id: "a327",
      get text() {
        return wasClicked ? clicked : normal;
      },
      reset() {
        wasClicked = false;
      },
      onClick() {
        if (wasClicked) return undefined;
        wasClicked = true;
        return this.text;
      }
    };
  }()),
  {
    id: "a328",
    text:
      `News company no longer lets random people submit stories,
      instead opting to using qualified writers. Riots ensue.`
  },
  {
    id: "a329",
    text:
      `Introducing Morse Code+++ - the brand new Morse code, now with 20 new
      characters, for everyone who wants to slide, zip, and swoosh!`,
    isAdvertising: true
  },
  {
    id: "a330",
    text: "Any sufficiently primitive magic is indistinguishable from technology."
  },
  {
    id: "a331",
    text: "I have no nose, and I must sneeze!"
  },
  {
    id: "a332",
    text: "♪ When you try your worst and you still succeed. ♪"
  },
  {
    id: "a333",
    text: `The wildly popular theme song "Gotta set 'em free" has reached 500 million downloads in its first week.`
  },
  {
    id: "a334",
    text:
      `Introducing the all-new anti-alignment chart! Featuring groundbreaking new combinations such as "lawful-chaotic"
      and "evil-good"! And with a dazzling third axis for 'Jazziness'~ Identify yourself as chaotic-lawful-unjazzy NOW
      for the impossibly low price of $-59.99! Terms and conditions apply. Batteries not included.`,
    isAdvertising: true
  },
  {
    id: "a335",
    text:
      `Due to new complications regarding "The Game", protests have risen all over the anti-verse. Thus, governments
      are forced to change the rule of The Game, stating that you win The Game if someone informs you about it,
      instead of losing it.`
  },
  {
    id: "a336",
    text: `Attention residents of zone 4 [commonly referred to as 'dark zone'], sector ϰ, (01,05). Do
      not leave your places of residence. I repeat, do not leave your places of residence. Do not go outside.
      Earthology's finest meteorological supercomputers, as well as many witches, are consistently claiming a
      'generally weird vibe' tomorrow and we quite frankly don't want to find out what that means.`
  },
  {
    id: "a337",
    text:
      `Technological convergence is the concept that all technologies will converge into a single technology. It is
      a commonly expressed idea since the dawn of the Information Age, and can be seen in many places and devices
      such as smartphones, or the internet. Antimatter Dimensions is an example of technological convergence,
      specifically within media. Using a genius idea called 'not caring' mixed in with the innovative solution of
      'blind luck', it merges together a subpar game, and a subpar news ticker, to create a mediocre experience
      that despite being mostly a game, occasionally acts as a news source slightly above the Matter Dimensions
      Newsticker. Truly, an achievement for all businesses to aspire to strive towards, and hopefully actually beat.`
  },
  {
    id: "a338",
    text: "Ancient cave paintings with the number 5 have been found. It's implied they were waiting for something."
  },
  (function() {
    let wasClicked = false;
    const normal = "Read More";
    const clicked = "More";
    return {
      id: "a339",
      get text() {
        return wasClicked ? clicked : normal;
      },
      reset() {
        wasClicked = false;
      },
      onClick() {
        if (wasClicked) return undefined;
        wasClicked = true;
        return this.text;
      }
    };
  }()),
  {
    id: "a340",
    text:
      `That's quite a lot of antimatter you're making. The game developer is impressed. Because this message is
      prerecorded, any observations related to your antimatter production are speculation on our part. Please
      disregard any undeserved compliments.`
  },
  {
    id: "a341",
    text: "Game under construction: All mechanics must wear hardcaps."
  },
  {
    id: "a342",
    text: "Of course paperclips have a use, you use them to hold papers together. But who uses paper anymore?"
  },
  {
    id: "a343",
    get text() {
      const fakeProgress = Math.pow(player.records.realTimePlayed, 25);
      // Caps in ~68 years of real playtime then turns into "Infinite%"
      return `Global Challenge - across all AD players, accumulate ${format(Number.MAX_VALUE, 2)} contest-paperclips
        (noted by the
        square ends), to receive an event-exclusive metal bagpipe, capable of giving +2 AM/s, as well as an extra
        tickspeed while above ${format(1e200)} tickspeed upgrades! Current global progress -
        ${format(fakeProgress)}/${format(Number.MAX_VALUE, 2)}
        (${formatPercents(Math.log10(fakeProgress) / Math.log10(Number.MAX_VALUE), 3)})`;
    }
  },
  {
    id: "a344",
    text:
      `Real life is an enigma. No one knows how it really works. There are many questions left unanswered:
      What is the meaning of life? Are we all living inside a simulation? How do you do antitables? Where and
      how did existence begin? These are all the questions that always linger in the back of our heads, and
      the answers to them? We may never know.`
  },
  {
    id: "a345",
    text: "Japanese complain, as haikus can't be shown here. Conflict arises."
  },
  {
    id: "a346",
    text:
      `Did you know Antimatter Dimensions is also available on Android? <a
      href="https://play.google.com/store/apps/details?id=kajfosz.antimatterdimensions" target="_blank">
      Click here to check it out!<a>`
  },
  {
    id: "a347",
    text:
      `Pluto isn't a state. The 50 states, as we all know, are: Adverb, Air, Artemis, Asia, Atlantic, Bargaining,
      Bilabial, Braille, Candela, Comma, Dacron, Dairy, Dative, Dexterity, Disenchanter, Dodecahedron, Erie,
      Eukaryota, Folklore, Great Pyramid, Halogen, Igneous, Italy, Kansas, Kilimanjaro, Lambda, Leviticus, Libra,
      Liquid, Lymphatic, Mesozoic, Microwave, Muon, North, Nova Scotia, Octagon, October, P = NP, Perissodactyla,
      Polk, Potassium, Pulley, Quinary, Rook, Saturn, Tiana, Tiger, Varaha, Yale, and Yellow.`
  },
  {
    id: "a348",
    text: "<span style='color: red'>[News Message removed by moderator]<span>"
  },
  {
    id: "a349",
    get text() {
      const chapters = [
        `We have come, writers, painters, sculptors, architects, passionate enthusiasts of the hitherto untouched
        beauty of Paris, to protest with all our strength, all our indignation, in the name of the unknown French
        taste, in the name of art and of French history threatened, against the erection, in the heart of our
        capital, of the useless and monstrous Eiffel Tower, which public malignity, often marked by common sense
        and the spirit of justice, has already named of "Tower of Babel". Without falling into the exaltation of
        chauvinism, we have the right to proclaim that Paris is the unrivaled city in the world. Above the streets,
        the widened boulevards, and the magnificent walks, rise the most noble monuments that the human race has
        produced. The soul of France, creator of masterpieces, shines amidst this august flowering of stones. Italy,
        Germany and Flanders, so justifiably proud of their artistic legacy, possess nothing comparable to ours,
        and from all corners of the universe Paris attracts curiosities and admiration.`,
        `Are we going to let all this be profaned? Will the city of Paris go on to associate itself longer with the
        baroques, with the mercantile imaginations of a machine builder, to become irreparably ugly and dishonor
        itself? For the Eiffel Tower, which commercial America itself would not want, is, doubtless, the dishonor
        of Paris. Everyone feels it, everyone says it, everyone deeply grieves it, and we are only a weak echo of
        the universal opinion, so legitimately alarmed.`,
        `Finally, when the foreigners come to visit our Exhibition, they will exclaim, astonished: "What? It is this
        horror that the French have found to give us an idea of their taste so much vaunted? And they will be right
        to make fun of us, because the Paris of the sublime gothics, the Paris of Jean Goujon, Germain Pilon, Puget,
        Rude, Barye, etc., will have become the Paris of M. Eiffel.`,
        `It suffices, moreover, to realize what we are doing, to imagine for a moment a vertiginously ridiculous
        tower dominating Paris, as well as a gigantic factory chimney, crushing with its barbarian mass. Our Lady,
        the Sainte-Chapelle, the dome of the Invalides, the Arc de Triomphe, all our humiliated monuments, all our
        shrunken architectures, which will disappear in this astonishing dream. And for twenty years, we will see
        how to stretch out over the entire city, still quivering with the genius of so many centuries, we will see
        the odious shadow of the odious column of bolted sheet metal stretch like an ink stain ...`,
        `It's up to you, Monsieur and dear compatriot, to you who love Paris so much, who have embellished it so
        much, who have so often protected it against the administrative devastation and the vandalism of industrial
        enterprises, that it is the honor to defend it once more. We leave it to you to plead the cause of Paris,
        knowing that you will deploy all the energy, all the eloquence that must inspire an artist such as you love
        what is beautiful, what is great, what is right ... And if our cry of alarm is not heard, if our reasons are
        not listened to, if Paris is stubborn in the idea of dishonoring Paris, we will have, at least, you and us,
        hear a protest that honors.`
      ];
      const chapter = chapters[player.news.specialTickerData.eiffelTowerChapter];
      player.news.specialTickerData.eiffelTowerChapter = (player.news.specialTickerData.eiffelTowerChapter + 1) % 5;
      return chapter;
    }
  },
  {
    id: "a350",
    text:
      `Alexander wept, for he had just watched a pop-culture lecture on quantum mechanics by Anaxarchus and
      realised that there are infinite worlds to conquer, and that he couldn't even be the lord of one without
      a mutiny or 6 stopping him.`
  },
  {
    id: "a351",
    text: "Hi, I'm here to complain about the poor quality of the copper that has just been delivered to me."
  },
  {
    id: "a352",
    get text() {
      return `<span style='opacity: 0; animation: a-disappear ${newsAnimSpd(20)}s 1'>
      This news message is antimemetic. You will forget that it exists shortly.</span>`;
    }
  },
  (function() {
    let wasClicked = false;
    const normal = "<span style='cursor: pointer'>💣</span>";
    const clicked = "💥";
    return {
      id: "a353",
      get text() {
        return wasClicked ? clicked : normal;
      },
      reset() {
        wasClicked = false;
      },
      onClick() {
        if (wasClicked) return undefined;
        wasClicked = true;
        return this.text;
      }
    };
  }()),
  {
    // Blob from the blob font
    id: "a354",
    text:
      `<span style='color: #FBC21B; text-shadow: 0px 1px 0px black, 1px 0px 0px black, 1px 1px 0px black,
      0px -1px 0px black, -1px 0px 0px black, -1px -1px 0px black, 1px -1px 0px black, -1px 1px 0px black'>
      \uE010</span>`
  },
  {
    id: "a355",
    text:
      `<div style='background: url("./images/unsmith.png"); width: 2.3rem; height: 2.5rem; margin-top: -0.1rem'></div>`
  },
  {
    id: "a356",
    text: `Press "Choose save" to explore the other 2 parallel universes.`
  },
  {
    id: "a357",
    text:
      `The Scientific Community remains baffled over the meaning of 286,078. "We're certain it's related to potatoes,
      but we need to do more tests." one researcher notes.`
  },
  {
    id: "a358",
    text: `Press "Choose save" to explore the other 2 parallel universes.`
  },
  {
    id: "a359",
    text:
      `Local incremental game dev makes physicists unhappy again. They claim
      "the physics violations and blatant use of technobabble has gone too far".`
  },
  {
    id: "a360",
    text: `Press "Choose save" to explore the other 2 parallel universes.`
  },
  {
    // Discord contest winner #1
    id: "a361",
    text: "We're having a sale of top quality waterproof towels! Be sure to get some on your way out!"
  },
  {
    // Discord contest winner #2
    id: "a362",
    text:
      `Hevipelle Incorporated is proud to present a new brand of cereal: The Big Crunch! This nutritious breakfast
      meal contains crunchy antimatter O's, pocket dimensions, Infinity-flavored Sugar Cubes, exponentially-growing
      Replicanti, and Eternity-flavored Marshmallows. Now you can experience Antimatter Dimensions inside of your
      stomach! Warning: Side effects may include spontaneous combustion, nausea, vomiting, diarrhea,
      dematerialization, vaporization, heart failure, the end of the world, or death. If you are not made out of
      antimatter, consult an educated professional on Antimatter Consumption before eating 'The Big Crunch'.`,
    get unlocked() { return PlayerProgress.eternityUnlocked(); }
  },
  {
    id: "a363",
    text:
      `The most expensive thing about a dragon isn't the gold you need to fill the nest, the magic you sacrifice
      entire empires for, or the billions of wars you need to supply the decillions of adamantium. No, it is the
      dirt. It's always the dirt. Don't ask the royal treasurers why we have more creatures on the plane than
      molecules of dirt. Just keep summoning bulldozers through arcane rituals and keep looking through the
      earth's core for more scraps of dirt.`
  },
  {
    id: "a364",
    get text() {
      const products = [
        `Illustration 320-A - True Office Graphics Wall. One of our senior consultants will observe your business,
        and come up with a list of words to be added to a hallway, to remind all employees of the values of their
        company. Known to decrease employee motivation by at least 25%! Past walls include words such as Black
        Hole, Catastrophic, Haphazard, compromising, Inferior, Delusional, Inefficient and Collapsed! Order now!`,
        `Furniture 150-A (2034 edition) - 3-person seating device. A revolutionary new design for office waiting
        areas, it consists of a large 3 legged stool, placed upside down for aesthetic benefits. Perfect for
        getting employees back to work, in a new set of shoes, or pants. It isn't tied down or glued to the
        floor like other editions, but we do make sure that other employees look at you funny if you edit our
        art. No need to order, it comes as a complimentary service for any customer!`,
        `Furniture 0853 - "The Rack" - this revolutionary new workspace, from the inventors of the crawling
        desk, helps your employees overcome their limits and ensure that your whole business is screaming -
        in agony! At times chosen by our revolutionary "pAIn AI", it will suggest mandatory stretchers for all
        users. Recommended by your local gaol, order now! *Warning, AOS&C only takes responsibility for acts
        of god such as lightning or merciful purifications by deities.`
      ];
      const product = products.randomElement();
      return `Antimatter Office Supplies and Co present their new "Modern Office" catalogue! Each template
        design can be customised for your business, and offers a unique way to promote business synergy! Here
        is a sneak preview of one of their newest items: ${product}`;
    },
  },
  {
    id: "a365",
    text: "I don't like Replicanti. They're coarse and rough and irritating and they replicate everywhere.",
    get unlocked() { return PlayerProgress.eternityUnlocked() || PlayerProgress.replicantiUnlocked(); }
  },
  {
    id: "a366",
    text:
      `Stage magic, such as illusions, has an interesting history. A mix of charlatans attempting to scam people,
      and actors acting out performances using illusions or sleight of hand. Altering styles of magic, and continued
      discourse and disagreements over whether it should be stated that it is an illusion, and whether people will
      magically realise that it is fake and that it does not need to be stated. A schism a century ago split magic
      into 2 types - gentle, simplistic utilitarian tricks and grand spectacles involving the flashy machinery and
      beautiful assistants - originating from the popularisation of a single trick involving sawing a person in
      half. Much more interesting than watching some TV psychic pretending to pull a lottery ticket out from a news
      ticker, at any rate. Speaking of which, tonight's lottery numbers are 23, 10, 81, 106.4, 3 + 2i, and e.`
  },
  {
    id: "a367",
    text:
      `Snakes look scary, and they absolutely are and you should run, calmly, from every snake you see. But, luckily
      for you, snakes don't often take the initiative to bite - excluding the really mean ones. If they've gone out
      of their way to bite you, there's generally 4 reasons. 1- The Snake is Mean. 2- You scared the snake. Snakes
      are scary to you, but you are scary to snakes. Be the bigger lizard when you meet a snake. 3- You entered the
      territory of the snake. Often, a snake will warn you if you do this - this is why rattle snakes rattle. If you
      don't listen to the warning, they'll bite you. And the most important reason, 4- the snake finds you ugly.
      This is the fault of the snake's ocular system, but is the most common form of bites in at least 2
      jurisdictions. And if you get bitten by a snake, by virtue of being a scarily ugly lizard who keeps stumbling
      into the wrong bushes, there's 3 main things you can do. First, calm down, again, and stay calm. Secondly,
      immobilise the area around site that was bitten, and try using a compression bandage. Snake venom vision is
      entirely based on movement of the object it's currently in. And third, calmly, call for help from other
      lizards. Excluding the snake. The snake's too mean to help you.`
  },
  {
    id: "a368",
    text:
      `I suspect more people would press the hard reset button if genuine effort was done to make the process as
      miserable as possible. A slow removal of resources, with unique nerfs just to stop you from progressing. The
      destruction of UI, turning from usable to unusable, arcane and unwieldy, requiring memory and luck to even
      continue this quest. Randomness, against the player for even the simplest actions, to punish the thought of
      progression. Hooks and traps and disasters and low rolls for a chance see progression, which entirely consists
      of putting the state of the game further from anything deemed reasonable. A situation where the character is
      broken just to tell you to leave… but the damage is already done, if it is even possible to turn back. And…
      from there, a hard reset probably isn't enough. It would have to be… harder. Not just a hard reset, but a
      cookie, something in local storage designed specifically to make it impossible to actually start a new game.
      Or, something more malicious? And despite this, people would still throw themselves into this nightmare, for
      humanity knows no bounds in its endless curiosity. No amount of warnings will stop everyone. They will find
      a way to proceed, given it exists, and may even complain when it isn't as punishing as expected. So, do you
      want to push the button, and experience the depths of despair, willingly? Hopefully not, because it isn't here.`
  },
  {
    id: "a369",
    text:
      `An empire-building project is one of the most difficult things to implement. Thousands of hours of time,
      planning, effort, consultation, and political manoeuvring to create truly airbreaking endeavours. Take the
      Realmway Revitalisation Roadmap, a revolutionary program referred to by the 3 R's, which is known as the
      pinnacle of the most famous of the empire's bureaucratic infrastructure committees - the EMIF (empire magic
      infrastructure foundation) - not to be confused with the EAIF (Electric airship investment fund) or the
      NMIC (National Magical Infrastructure Coalition). The goal of the three R's, set out by the EMIF, was to
      reinstate a mana trade corridor for SMSS (Small-Medium Steam Shuttles), a vital part of the burgeoning
      consolidated states after their unfortunate pillaging during the NELC (ninth empire liberation crusade).
      The three R's was a multi stage project - stage 1 was a survey glyph in the air - all big things start with
      a small step. Stage 2, the unveiling of the EMOF (Empire Mechanical Obliteration Forcefield) had over 50
      dignitaries - multiple emperors (from federated states to organisational leaders), foreign rulers, EMDF
      (Effluent Manifested Destiny Families) who currently own the land, and even some of the forecast witches,
      all gathered together to unveil the project in a show of EOSF (Empire Official Solidarity Friendships).
      Sadly, the project was eventually cancelled at stage 215, as the creation of the EMTF (Excrement Material
      Transmutation Facility) for the contractors exploded after coming into contact with a SMEA (Small-Medium
      Electric Airship) placing the last survey peg from stage 459 due to a time vortex created by an argument
      at the WAIC (Witches Annual Infrastructure Committee) as part of stage 56. Truly, tragic stuff - 3 award
      nominations and 2 wins during that process due to EBIF (Efficient Bureaucracy In (the) Field).`
  },
  {
    id: "a370",
    text:
      "Man tries installing cookies to store computer data, accidentally cleans them due to being too delicious."
  },
  {
    id: "a371",
    text:
      `Pop quiz: there are 3 doors, you pick a door at random, and get to keep what's behind the door. The doors
      have 2 golden goats, 2 silver goats, and a gold and a silver goat. After you pick a door, the door with the
      lowest $ worth of goats will be opened and shown to you. After this, you are given the choice to swap.
      What is the probability that you will swap doors?`
  },
  {
    id: "a372",
    text:
      `If you're ever lost in a forest, look at the trees around you. It's said that moss grows north, so by the
      time you've finished looking at a tree, a roaming guitarist will run up to you and ask if you want to hear
      wonderwall`
  },
  {
    id: "a373",
    text:
      `As a symbol of friendship between the Matter and Antimatter Periodic Tables, they have done an exchange of
      elements. The element of Mony is now part of the Antimatter Periodic Table, while Antimony has been added
      to the regular Periodic Table.`
  },
  {
    id: "a374",
    text: "This newsticker was specifically designed for promotional purposes only."
  },
  {
    id: "a375",
    text:
      `As you probably know, it is traditional to give gifts made of certain materials to celebrate anniversaries
      The classic ones are silver at 25 and gold at 50. Here are some little known anniversary gifts:
      Pineapple - 37 years Hellstone - 66 years Lizardite- 82 years Nitrowhisperin- 86 years Taconite - 95 years
      Hatchettite - 100 years Electrum - 110 Yakitoda - 111 years years Fordite - 119 years Bloodstone - 120 years
      Celestite - 125 years Jet - 140 years Petroleum - 145 years Steel - 150 years Cummingtonite - 198 years
      Concrete - 200 years Laserblue- 210 years Painite - 250 years Parisite - 255 years Parasite - 260 years
      Carbon Nanotubes - 300 years Mercury - 310 years Martian Soil - 340 years Neptunium - 370 years
      Uranium - 380 years Plutonium - 390 years Xium - 400 years Blaze rods - 420 years Asbestos - 430 years
      Gabite - 444 years Crimtane - 666 years Lagga - 777 years`
  },
  {
    id: "a376",
    text:
      `Big tech companies have collaborated to create a new neural network that's trained in the generation of rap
      lyrics, called RAP-3. First lyrical generations include "Call me prometheus 'cuz I bring the fire" and
      "Call me Sonic the way I'm gettin' these rings". Critics say it still has a way to go before it replaces
      traditional music.`
  },
  {
    id: "a377",
    text:
      `With the new android OS, android 20, being predicted in the near future, the new system for internal codenames
      has been revealed. The first codename, as it currently stands, is “antimatter”. This conveniently works well
      with the predicted generation of phones that will use Android 20 - these phones will be the most explosive
      ever due to their annihilation-based power source. Sources tell us that a billion dollar research unit is
      working on a name for android 21, by tradition to start with B, “that doesn't sound too bad when you think
      about it”. `
  },
  {
    id: "a378",
    text: "If every antimatter were an apple, you would have enough to keep all the doctors away for 3000 years"
  },
  {
    id: "a379",
    get text() {
      return `THE ${format(Number.MAX_VALUE, 2)} PIECE! THE ${format(Number.MAX_VALUE, 2)} PIECE IS REAL!`;
    }
  },
  {
    id: "a380",
    text:
      `The FitnessGram Pacer Test is a multistage aerobic capacity test that progressively gets more difficult
      as it continues. The 20 meter pacer test will begin in 30 seconds. Line up at the start. The running speed
      starts slowly, but gets faster each minute after you hear this signal. [beep] A single lap should be
      completed each time you hear this sound. [ding] Remember to run in a straight line, and run as long as
      possible. The second time you fail to complete a lap before the sound, your test is over. The test will
      begin on the word start. On your mark, get ready, start.`
  },
  {
    id: "a381",
    text: "Why do they call it second dimension when you of in the first dimension of out second eat the dimension?"
  },
  {
    id: "a382",
    text:
      "Any AD player born after 1993 can't joke... All they know is 5 hours, paperclips, 1.79e308 & Ninth Dimension."
  },
  {
    id: "a383",
    text:
      "The only thing better than an anti-joke is two. Like the number. Not two anti-jokes. I just like the number two."
  },
  {
    id: "a384",
    text: "Click here to make nothing happen."
  },
  {
    id: "a385",
    text:
      `I wonder... Why did Apple skip iPhone 9 and Microsoft skip Windows 9...
      Was it because they were bribed by a game developer?`
  },
  {
    id: "a386",
    text: "9 out of 10 doctors recommended against trying to touch antimatter. We haven't heard back from the 10th one."
  },
  {
    id: "a387",
    text:
      `In spring, Man built a pillar. In summer, another. Throughout autumn they held. But in winter, one experienced
      an unexpected (See definition in: Abstract Multidimensional Retrocausal Physics) ZW-Class "Ascension" event,
      and is hypothesised to have fallen into a dimensional loophole, where it, by definition, has to take up more
      dimensions than itself. Current efforts at retrieving the pillar and returning it to baseline reality have been
      unsuccessful (See test log 2453-3e9a-50d1-84fc for more details)`
  },
  {
    id: "a388",
    text:
      `In light of recent events, we'd like to issue an official statement. Antimatter Dimensions™ is in no way
      affiliated with Jimmy's Causality Violating Brainworms™. We do not endorse, no were we involved in their creation
      of the product which was involved in several catastrophic dimension-destabilising and reality-toppling incidents.
      We almost certainly did not sign a contract at 5:30:26 UTC on 08/12/1994 after discussing how we could benefit
      from destabilising and warping dimensions. There was no industrial zone constructed in the 5th Orion Arm of the
      వ' galaxy, and even if they were we did not install localised anomalies following the Scranton Reality Anti-anchor
      mechanism. Additionally, no time loop is occurring at Acroamatic Abatement Facility AAF-D in site 43. We apologise
      if things seemed this way, and we will be more thorough in cracking down misinformation in the future.`
  },
  {
    id: "a389",
    text: "If only we could condense the antimatter in the universe into cookies..."
  },
  {
    id: "a390",
    text:
      `Can you believe it guys? Update, just 5 hours away. Update is in a 5 hours. Wahoo. I'm so happy about this
      information. Update just 5 hours away. Oh wow. Can you believe it? Update just in a 5 hours. It got here so
      fast. Update, just 5 hours.`
  },
  {
    id: "l1",
    text: "You just made your 1,000,000,000,000,000th antimatter. This one tastes like chicken.",
    get unlocked() { return Currency.antimatter.exponent === 15; }
  },
  {
    id: "l2",
    text: "Nerf the galaxies please.",
    get unlocked() { return player.galaxies === 2 || Currency.infinities.gt(0); }
  },
  {
    id: "l3",
    text: "What do you mean, more than two dimensions??? We're on a screen, clearly there are only 2 dimensions.",
    get unlocked() { return AntimatterDimension(3).amount.gt(0) || DimBoost.totalBoosts > 0; }
  },
  {
    id: "l4",
    text: "How much is Infinity? -literally everyone at least once",
    get unlocked() { return AntimatterDimension(8).amount.eq(190) || Currency.infinities.gt(0); }
  },
  {
    id: "l5",
    text: "Eh, the Fourth Dimension is alright...",
    get unlocked() { return AntimatterDimension(4).amount.gt(0) && AntimatterDimension(5).amount.eq(0); }
  },
  {
    id: "l6",
    text:
      `Antimatter people seem to be even more afraid of 13 then we are. They destroyed
      entire galaxies just to remove 13 from their percents.`,
    get unlocked() { return player.galaxies > 0 || Currency.infinities.gt(0); }
  },
  {
    id: "l7",
    text: "To understand dimensional sacrifice, you do actually need a PhD in theoretical physics. Sorry!",
    get unlocked() { return player.sacrificed.e >= 10 || DimBoost.totalBoosts >= 6; }
  },
  {
    id: "l8",
    text: "A new group for the standardisation of numbers have come forward with a novel new format involving emoji's.",
    get unlocked() { return player.requirementChecks.permanent.emojiGalaxies > 0; }
  },
  {
    id: "l9",
    text: "Antimatter ice cream stand has recently opened- they have octillions of flavors!",
    get unlocked() { return player.records.totalAntimatter.e >= 27; }
  },
  {
    id: "l10",
    text:
      `The Heavenly Pelle has generated too much antimatter and needed to create another galaxy.
      This one can be seen in the southwestern sky.`,
    get unlocked() { return player.galaxies > 0 || Currency.infinities.gt(0); }
  },
  {
    id: "l11",
    text: "9th Dimension is a lie.",
    get unlocked() {
      return DimBoost.totalBoosts >= 5 ||
      player.galaxies > 0 ||
      PlayerProgress.infinityUnlocked();
    }
  },
  {
    id: "l12",
    text: "The square root of 9 is 3, therefore the 9th dimension can't exist.",
    get unlocked() {
      return DimBoost.totalBoosts >= 5 ||
      player.galaxies > 0 ||
      PlayerProgress.infinityUnlocked();
    }
  },
  {
    id: "l13",
    text: "You got assimilated by the 9th dimension? Just call your doctor for mental illness!",
    get unlocked() {
      return DimBoost.totalBoosts >= 5 ||
      player.galaxies > 0 ||
      PlayerProgress.infinityUnlocked();
    }
  },
  {
    id: "l14",
    text: "Why is there no 9th dimension? Because 7 8 9.",
    get unlocked() {
      return DimBoost.totalBoosts >= 5 ||
      player.galaxies > 0 ||
      PlayerProgress.infinityUnlocked();
    }
  },
  {
    id: "l15",
    text: "The 9th dimension cannot exist because the Nein-speaking nazis died in WW2.",
    get unlocked() {
      return DimBoost.totalBoosts >= 5 ||
      player.galaxies > 0 ||
      PlayerProgress.infinityUnlocked();
    }
  },
  {
    id: "l16",
    text:
      `If you break the fourth wall... well, there's still the fifth, sixth, seventh, and eighth to get through
      before you encounter bad things, so you should be fine`,
    get unlocked() {
      return DimBoost.totalBoosts >= 5 ||
      player.galaxies > 0 ||
      PlayerProgress.infinityUnlocked();
    }
  },
  {
    id: "l17",
    text:
      `Conditions must be met for Hevipelle to sleep. First, it needs to be a blue moon. Second, a specific town
      in the arctic must have not seen light for a month. Third, he needs to release an AD update. And finally,
      no one on the Discord can be on dimension 9. Only then can he rest, for up to 6 hours, before waking up
      forcefully to avoid getting the offline achievement.`,
    get unlocked() {
      return DimBoost.totalBoosts >= 5 ||
      player.galaxies > 0 ||
      PlayerProgress.infinityUnlocked();
    }
  },
  {
    id: "l18",
    text: "If the 9th dimension is all evil, then is 3 the root of all evil?",
    get unlocked() {
      return DimBoost.totalBoosts >= 5 ||
      player.galaxies > 0 ||
      PlayerProgress.infinityUnlocked();
    }
  },
  {
    id: "l19",
    text:
      `I'll have 1e29 number 9s, a number 1e9 large, a number 6 with extra replicanti, a number 1e7, two 4e5s,
      one with matter, and a large time vortex.`,
    get unlocked() {
      return DimBoost.totalBoosts >= 5 ||
      player.galaxies > 0 ||
      PlayerProgress.infinityUnlocked();
    }
  },
  {
    id: "l20",
    text: "Infinity: the one thing that's supposed to break.",
    get unlocked() { return PlayerProgress.infinityUnlocked(); }
  },
  {
    id: "l21",
    get text() { return `I've got ${format(Number.MAX_VALUE, 2)} problems, but none of them antimatter.`; },
    get unlocked() { return Currency.infinities.gt(0) && !PlayerProgress.hasBroken(); }
  },
  {
    id: "l22",
    text: "Anti Emoji Movie a huge hit!",
    get unlocked() { return player.requirementChecks.permanent.emojiGalaxies >= 5; }
  },
  {
    id: "l23",
    text: "If this game was made by Valve, Zero Deaths would be impossible.",
    get unlocked() { return Achievement(64).isUnlocked; }
  },
  {
    id: "l24",
    text: "Florida man attempts to get Zero Deaths on first run, is stopped by heat death of the universe.",
    get unlocked() { return Achievement(64).isUnlocked; }
  },
  {
    id: "l25",
    text: "\"Having done half the achievements isn't much of an achievement\" -Boo",
    get unlocked() { return Achievements.effectiveCount >= GameDatabase.achievements.normal.length / 2; }
  },
  {
    id: "l26",
    text:
      `Thanos is gonna be super dissapointed when he shows up with a fully powered Infinity gauntlet, and Hevi
      has a fully powered Eternity gauntlet.`,
    get unlocked() { return PlayerProgress.eternityUnlocked(); }
  },
  {
    id: "l27",
    text:
      "New strange material was been found. It seems to grow exponentially, but only helps with antimatter production.",
    get unlocked() { return PlayerProgress.replicantiUnlocked() && player.replicanti.chance === 0.01; }
  },
  {
    id: "l28",
    text: "It seems this \"replicanti\" stuff won't be growing any faster now.",
    get unlocked() { return player.replicanti.chance === 1 && player.replicanti.interval === 1; }
  },
  {
    id: "l29",
    text:
      `If you wrote down 3 numbers a second, it would take you less time to write down your antimatter
      amount than it would Hevipelle to update the game.`,
    get unlocked() { return Currency.antimatter.exponent >= 100000; }
  },
  {
    id: "l30",
    text: "Does Hevi just pick quotes to put into the game?",
    get unlocked() { return NewsHandler.uniqueTickersSeen >= 30; }
  },
  {
    id: "l31",
    text: "New news company has become rivals with us. They are made entirely of antimatter.",
    get unlocked() { return NewsHandler.uniqueTickersSeen >= 80; }
  },
  {
    id: "l32",
    text: "How many times can we use \"Anti\" in a row before people stop listening?",
    get unlocked() { return NewsHandler.uniqueTickersSeen >= 100; }
  },
  {
    id: "l33",
    text: "Does Hevi even check #news-ticker-suggestions anymore?",
    get unlocked() { return NewsHandler.uniqueTickersSeen >= 120; }
  },
  {
    id: "l34",
    text: "Need more quotes! -hevipelle",
    get unlocked() { return NewsHandler.uniqueTickersSeen >= 135; }
  },
  {
    id: "l35",
    text: "Man destroys known universe with antimatter, writes news tickers to keep from feeling lonely.",
    get unlocked() { return NewsHandler.uniqueTickersSeen >= 150; }
  },
  {
    id: "l36",
    text: "You're almost there!",
    get unlocked() { return NewsHandler.uniqueTickersSeen >= 160; }
  },
  {
    id: "l37",
    text: "You can stop now",
    get unlocked() { return NewsHandler.uniqueTickersSeen >= 165; }
  },
  {
    id: "l38",
    text: "fucking hacker",
    get unlocked() { return NewsHandler.uniqueTickersSeen > GameDatabase.news.length; }
  },
  {
    id: "l39",
    text: "Asian man trys to steal the trophy of fastest infinity of -1 seconds, AND HE DOES IT!",
    get unlocked() { return NewsHandler.hasSeenNews("l1"); }
  },
  {
    id: "l40",
    text:
      `I broke the 8th wall, there is only chaos, Slabdrill is ritually sacrificing antimatter to the 9th
      dimension. This will be my last entry, may Hevipelle have mercy on our souls, we didn't listen,
      We should have listened.`,
    get unlocked() { return NewsHandler.hasSeenNews("l58"); }
  },
  {
    id: "l41",
    text: "I thought the update was 5 hours away... -new players after more than 5 hours of gameplay",
    get unlocked() { return Time.totalTimePlayed.totalHours >= 5; }
  },
  {
    id: "l42",
    text:
      `Somebody told me to wait five hours for the update yesterday but it's today
      and it still hasn't come! What do I do?`,
    get unlocked() { return Time.totalTimePlayed.totalHours >= 5; }
  },
  {
    id: "l43",
    text: "You do know that you won't reach Infinity in -1 seconds, right?",
    get unlocked() { return player.records.bestInfinity.time === 0.1; }
  },
  {
    id: "l44",
    text: "Where does Antimatter Nemo live? In a NNnNeMI-NNnNe.",
    get unlocked() { return player.records.totalAntimatter.e >= 3e6; }
  },
  {
    id: "l45",
    text: "Anti Emoji Movie MMMCMXCIX is a major hit!",
    get unlocked() { return player.requirementChecks.permanent.emojiGalaxies >= 3999; }
  },
  {
    id: "l46",
    text: "Achievement Unlocked!",
    get unlocked() { return Achievements.effectiveCount >= GameDatabase.achievements.normal.length; }
  },
  {
    id: "l47",
    text: "The achievement is for two million, not two billion...",
    get unlocked() { return Currency.infinities.gt(2e9); }
  },
  {
    id: "l48",
    text: "Keep up the quick pace!",
    get unlocked() { return AchievementTimers.marathon1.time > 1200; }
  },
  {
    id: "l49",
    text: "One day you will stop your incessant grind.",
    get unlocked() { return Currency.eternities.gt(50000); }
  },
  {
    id: "l50",
    text: "You can probably stop farming for eternities now...",
    get unlocked() { return Currency.eternities.gt(DC.D2E6); }
  },
  {
    id: "l51",
    text: "Are you serious?",
    get unlocked() { return Time.worstChallenge.totalSeconds <= 1; }
  },
  {
    id: "l52",
    text: "Timing is key.",
    get unlocked() { return player.records.thisEternity.realTime < 10; }
  },
  {
    id: "l53",
    text: "If you want to farm infinities, why don't you just get the time study?",
    get unlocked() { return !TimeStudy(32).isBought && Currency.infinities.gt(72000 * 168); }
  },
  {
    id: "l54",
    get text() {
      const names = [];
      if (PlayerProgress.infinityUnlocked()) names.push("Infinity");
      if (PlayerProgress.eternityUnlocked()) names.push("Eternity");
      if (PlayerProgress.dilationUnlocked()) names.push("Dilation");
      if (PlayerProgress.realityUnlocked()) names.push("Reality");

      const game1Name = names.randomElement();
      let game2Name = names.randomElement();
      while (game2Name === game1Name) {
        game2Name = names.randomElement();
      }
      return `Pokemon ${game1Name} and ${game2Name} were just released! This new generation brings the total number ` +
        "of Pokemon up to 1e151. Good luck catching 'em all!";
    },
    get unlocked() { return PlayerProgress.eternityUnlocked(); },
    isAdvertising: true
  },
  {
    id: "l55",
    get text() {
      const recipes = [
        "a Replicanti cake: Gather some Replicanti, place in oven, and watch rise. And rise. And rise.",
        "an antimatter cake: Gather some antimatter, place in oven, and <b>BOOM<b>.",
        "an Eternity cake: Gather some Eternity Points, place in oven, and wait...",
        "an Infinity cake: Gather some Infinity Points, place in oven, and watch them shatter spacetime."
      ];
      const recipe = recipes.randomElement();
      return `How to bake ${recipe}`;
    },
    get unlocked() { return PlayerProgress.eternityUnlocked(); }
  },
  {
    id: "l56",
    text: "Reality Challenges are the new 9th Dimension is the new orange.",
    get unlocked() { return PlayerProgress.realityUnlocked(); }
  },
  {
    id: "l57",
    text:
      `Jake returned home from a long day at school. On his way home, he came across a curious little object.
      Transparent, but opaque. Shimmering, but gloomy. Heavy, but weightless. Jake brought the object to his
      mother. "Mom, I found this thing on the sidewalk, can I keep it?", Jake said. His mother turned around
      to view the object her son spoke of. Her pupils dilated, "Jake, get that thing out of the house now!"
      she yelled. Jake was confused, as it seemed quite the harmless thing to him. He asked "But mom, wh-",
      but before he could finish, the object appeared to undergo mitosis at what seemed like an impossible
      speed, and the second copy slipped out of his hand and onto the floor. His mother rushed over to
      him, and tried to grab the object, but it replicated again. "Jake... No matter what happens, don't
      forget that I love you honey...". She wrapped her arms around him. "M-mom, what's happening?" Jake asked,
      with a quivering fear in his voice. His mother cried a single tear. "⭔⭚⦕꒜ brand Replicanti..." she said,
      in a somber tone. The Replicanti continued to replicate at a faster and faster pace. The bottom third of the
      house was now full of Replicanti. Then the bottom half. Then the entire house. The mother and child were
      trapped between the walls of their home and the Replicanti. Doomed to live the short rest of their life in
      that inorganic coffin, as the air remaining in their lungs slowly depleted. But that wasn't the end; far from
      it. The Replicanti began to replicate outside of the house, flooding out in a shimmering landslide. A few
      neighbours noticed the strange objects, almost liquid-like in their appearance, and attempted to run.
      But the Replicanti continued to replicate, and accelerate. Soon the entire block was covered in them; was
      them. Shortly after, several blocks. The city. The surrounding cities. The country. All the countries. All
      the planet. All the solar system. All the galaxy. All.`,
    get unlocked() { return player.replicanti.unl; }
  },
  {
    id: "l58",
    text:
      `The Holy trinity of Hevipelle, Antimatter, Infinity Points, and Eternity Points. These 3 resources let us
      access Hevi's gift, Time Theorems. And with these Time Theorems, we reach out to Hevi, and call, “Hevi, bless
      us on this fine day!” And Hevi does. He give us the blessing of Time Studies. These Time Studies were
      blessings so powerful, Hevi restricted their power. He said, “I will give you a choice of three paths” and
      then humanity chose. The short, cheap route of Antimatter Dimensions, giving instant gratification, the
      powerful choice of Infinity Dimensions, which were a fast, middle ground path, or Time Dimension, the long
      wait, and struggle, of humanity. Then, as humanity chose, a crack broke the earth. A serpent snaked out and
      sneered to humanity, “I will offer the powerful choice of a ninth dimension! I am Slabdrill, lord of all
      Unhevi. Humanity rose and said “ Begone Slabdrill! We want none of your foul Heresy!” And Hevi rose as well,
      and smote Slabdrill with his godlike power. As Slabdrill's corpse fell into the earth, he cried “ this will
      not be the last of me! Hevi will betr-“ and he fell in the Abyss of matter. Hevi gifted humanity with
      Eternity upgrades, which boosted infinity dimensions and time dimensions. And Hevi gave humanity his greatest
      gift. EP multipliers. He said, these will multiply all EP gained by 5, but their cost will increase 50 times.
      Use them wisely. And Humanity journeyed off with their new power, as Slabdrill's words echoed in their heads.`,
    get unlocked() { return PlayerProgress.eternityUnlocked(); }
  },
  {
    id: "l59",
    text:
      `The debate on the singular form of Replicanti rages on. Team "Replicantus"'s base has been ransacked
      by Team "Also Replicanti", and many of their dimensions were stolen. Team "The Plural Is Replicantis"
      is still lying low after their plan to hack the dictionary failed.`,
    get unlocked() { return player.replicanti.unl; }
  },
  {
    id: "l60",
    get text() {
      return `Breaking News! Time Shard mine collapses! ${Math.floor(20 + Math.random() * 236)} miners trapped inside!`;
    },
    get unlocked() { return PlayerProgress.eternityUnlocked(); }
  },
  {
    id: "l61",
    text:
      `Millenials are killing the challenge industry, say antimatter experts; "Nowadays they start with
      challenges completed and infinity broken; it's just not how it used to be".`,
    get unlocked() { return PlayerProgress.infinityUnlocked(); }
  },
  {
    id: "l62",
    text:
      `Computer scientists are outraged, "What even are Infinity Points? IP stands for Internet Protocol!".
      Debates continue to intensify, more at 7.`,
    get unlocked() { return PlayerProgress.infinityUnlocked(); }
  },
  {
    id: "l63",
    text:
      `Do you feel that time has been going slower? Study reveals that 1 second now last approximately 1.3 seconds.
      Scientists are calling this phenomenon Time Dilation.`,
    get unlocked() { return PlayerProgress.dilationUnlocked(); }
  },
  {
    id: "l64",
    text:
      `Injustice in the Antimatter Academia: Beginners are only allowed to choose one field of study while the elite
      can pick all three. "Its just not fair, man. How come they can do it?" Questions frustrated student.`,
    get unlocked() { return PlayerProgress.eternityUnlocked(); }
  },
  {
    id: "l65",
    text:
      `It turns out that nobody actually knows what Infinity Points look like. Even the people who work on storing
      them are specifically told not to look at them because they apparently "kill anyone who even looks at them",
      to the point of sometimes working with blindfolds on. But today that will change. I am right here, in front
      of an Infinity Point Depot, ready to tell all of you what they look like in 3, 2, 1-`,
    get unlocked() { return PlayerProgress.infinityUnlocked(); }
  },
  {
    id: "l66",
    text:
      `Humanity shocked as failed Time Dilation experiment causes a visual glitch in spacetime. It is now visible
      in the night sky just above the Celestial Equator.`,
    get unlocked() { return PlayerProgress.dilationUnlocked(); }
  },
  {
    id: "l67",
    text:
      `Snorting crushed up Time Shards is slowly turning into a fad challenge amongst the most bored of people. It's
      said that the high it gives makes them experience as if the world itself is speeding up around you, which is
      why it's been called The <span style="color: var(--color-eternity)">Timelapse Challenge</span>. &nbsp;&nbsp
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      Dehydration deaths are through the roof as people mysteriously forget to drink water for several days.
      Trace amounts of Time Shards are being found in their bodies.`,
    get unlocked() { return PlayerProgress.eternityUnlocked(); }
  },
  {
    id: "l68",
    get text() {
      let protestText = "";
      if (InfinityChallenge(4).isRunning)
        protestText =
          `Let's take it to this guy, who's part of the side that believes it's Infinity Challenge 4. What do you have
          to say? "Obviously Infinity Challenge 4 is the worst one, I mean, what am I even supposed to do? I keep
          trying but every time I keep getting stuck and nowhere close to the end! How are you even supposed to do it?"
          What a passionate man. This is your local news host, and we'll come back with further information later.`;
      else if (InfinityChallenge(5).isRunning)
        protestText =
          `So up next let's talk to this guy is holding a sign that says "IC5 Unfair". What is the point your group
          is trying to make? "Can't you read the sign? If your comprehension is that bad then Infinity Challenge 5
          will squash you without even giving you a fair chan-" How... Interesting. This is your local news host,
          and we'll come back with further information later.`;
      else
        protestText =
          `Finally, let's chat with this woman who doesn't seem to be in either side. What's your opinion on the
          matter? "Personally, I thought Tickspeed Autobuyer Challenge was worse than both-" "GET HER!!" "WAIT NO-"
          Well, seems like this just took a turn, so I'm getting as far away as I possibly can. This is your local
          news host, and we'll come back with further information... someday.`;
      return `Hello, this is your local always reliable news source, and today people are taking over the streets
        as they fight over which Infinity Challenge is worse. ${protestText}`;
    },
    get unlocked() { return InfinityChallenge(1).isUnlocked || PlayerProgress.eternityUnlocked(); }
  },
  {
    id: "l69",
    text: "Friendship ended with Replicanti, now Replicanti Galaxies is my new best friend.",
    get unlocked() { return PlayerProgress.replicantiUnlocked(); }
  },
  {
    id: "l70",
    text:
      `"Zurkrbarg, Celestial of Privacy" has announced their plans to release a new version
      of their popular social media universe, "All".`,
    get unlocked() { return Teresa.isUnlocked; }
  },
  {
    id: "l71",
    text: "Other languages await... I need to become a programmer",
    get unlocked() { return Player.canEternity || PlayerProgress.eternityUnlocked(); }
  },
  {
    id: "l72",
    get text() {
      const scenarios = [
        `our contestants struggle to survive in the desolate wasteland of Eternity Challenge 8 -
        running out of Replicanti and Infinity Dimensions, what will they turn to?`,
        "we investigate reports of a Time Shard mine collapsing at 26:90.",
        "we invite an amateur on to explain what the reward for Infinity Challenge 9 would be.",
        "our friends over at ANN explain how they produce their broadcasts.",
        "we invite local idle gamers over to explain how they play their favorite games.",
        `<span style='font-family: Barrio'>send 10,000 Support The Developer
        coins or you will never see RealiTV again.</span>`,
        "we break down exactly what went wrong in the black hole powering our city yesterday.",
        "we go over our 10-day weather forcasts.",
        `YOU MUST PAY ${format(player.reality.realityMachines.times(10).max(10))}
        REALITY MACHINES TO CONTINUE VIEWING THIS PROGRAM.`,
        "we witness the release of the hypnodrones.",
        "our great and grand overlord lets us have a single antimatter.",
        `Bill Nye explains how Replicanti replicate, and teaches how to spot dangerous conspiracy theories
        such as "ingesting antimatter is perfectly fine" and "Antimatter Galaxies aren't worth it".`,
        "the world's greatest philosophers debate if we are the real antimatter.",
        "resident baker explains how ordinary objects can transmorph into cake if not watched constantly."
      ];
      const scenario = scenarios.randomElement();
      return `Next time on RealiTV, ${scenario}`;
    },
    get unlocked() { return PlayerProgress.realityUnlocked(); }
  },
  {
    id: "l73",
    text: "A long time ago in a distant galaxy far, far away, the cost scaling changed.",
    get unlocked() { return PlayerProgress.eternityUnlocked(); }
  },
  {
    id: "l74",
    text: "Introducing a new feature: Reality Studies! Get in-game benefits for studying in real life!",
    get unlocked() { return PlayerProgress.realityUnlocked(); }
  },
  {
    id: "l75",
    text:
      `Here at Antimatter Dimensions, we pride ourselves in the quality of our products. For example: Did you know
      that every Infinity Point is unique? That's right! They all have different personalities, their own feelings,
      their own thoughts... I hope you can sleep well tonight, knowing this... Remember all of those Infinity
      points you've spent? They had families, and they miss them... Look at what you've done. You're a monster.`,
    get unlocked() { return PlayerProgress.infinityUnlocked(); }
  },
  {
    id: "l76",
    text: "So, you've reached the prestige layer after Infinity? It's about time...",
    get unlocked() { return PlayerProgress.eternityUnlocked(); }
  },
  {
    id: "l77",
    text: "Improve your perks through selective breeding and cutting edge epigenetics technology.",
    get unlocked() { return PlayerProgress.realityUnlocked(); }
  },
  {
    id: "l78",
    text:
      `Warning - Genetically Modified Perk Points are not suitable for; consumption, physical contact, inhalation,
      exhalation, mental contact and scouring by both seen and unseen eyes. Do not put near a flammable,
      inflammable, conducting, insulating, variable, biological or mechanical substance. Existence at your own risk.`,
    get unlocked() { return PlayerProgress.realityUnlocked(); }
  },
  {
    id: "l79",
    text:
      `The Intergalactic Antimatter Revenue Service, contrary to popular belief, does have the ability to pay taxes
      on AM gained through non-scrupulous methods, ie anything not done via legally-mandated dimensions or modified
      through challenge courses. Section NY-8N lists 3 specific methodologies - illegal news ticker giveaways,
      unrecognised dimensions, and modifications to the fabric of space time - as well as a miscellaneous for any
      unique AM methods that may pop up in the future. And although you will have to pay the top AM tax rate of 99%,
      it can save you money in the long run - if you are forced to switch realities due to a celestial decision you
      can gain a portion of the tax you paid back from the IARS as a tax deduction, as well as make a deduction to
      pay for the arbiters who represent you. Of course, any [PLAYER REFERENCE NOT FOUND] worth their RM knows that
      the real way to hide illegal profits of crime is  in personalised pocket dimensions, hyperspliced waveform
      banks and nanoshells, which requires extensive R&D to implement. As such, reporting illegal AM gain is only
      recommended if you're too rich to hide your gains, but too poor to hide your gains.`,
    get unlocked() { return PlayerProgress.realityUnlocked(); }
  },
  {
    id: "l80",
    get text() {
      return `"Average person produces ${format("3e999999996", 2)} antimatter a year" factoid actually just statistical
      error. Average person produces 0 antimatter per year. "Developer Dimension" Georg, who lives in a cave &
      produces over ${format("1e1000000000", 2)} each day, is an outlier and should not have been counted.`;
    },
    get unlocked() { return PlayerProgress.hasBroken(); }
  },
  {
    id: "l81",
    text:
      `The world is in chaos as the laws of math have been rewritten! Many things that were thought
      to be infinite are now just really big numbers!`,
    get unlocked() { return PlayerProgress.hasBroken(); }
  },
  {
    id: "l82",
    get text() {
      return `The Great Scribes of Antia have labored intensively for years. They were given a mammoth task from the
      gods; write out an incomprehensibly long number. These scribes took turns, each writing out a few numbers a
      second, writing day and night, for what seemed like an eternity. At last, after
      ${TimeSpan.fromSeconds(Currency.antimatter.value.log10() / 3).toString()}, they finally accomplished
      the impossible. That week, when they went to worship their gods, they sent them a simple message: "What was
      the purpose? What made our years of labor significant?" The gods responded duly: "We wanted to know how long
      it would take to write out, for a statistic in our game."`;
    },
    // 3 years of time to write
    get unlocked() { return Currency.antimatter.value.gte("1e777600"); }
  },
  {
    id: "l83",
    text:
      `AD Patch Notes: Cleaned up the celestial problem Made Antimatter care about annihilation more Added mouths
      Removed mouths Stopped unwanted interlopers from corporate takeovers of shops Fixed problem with newstickers
      hanging in the air Dead replicanti remain in their galaxies Redefined interlopers to not include [REDACTED]
      Tachyon Particles get stuck in the top left corner of the screen, obliterate time Added Coriolis effect to
      Galaxy Spin Direction`,
    get unlocked() { return Teresa.isUnlocked; }
  },
  {
    id: "l84",
    get text() {
      return `For the record, you currently have ${player.news.specialTickerData.paperclips}
      Useless Paperclips. You may want to spend them on something.`;
    },
    get unlocked() { return player.news.specialTickerData.paperclips > 0; }
  },
  {
    id: "l85",
    text:
      `On opposite day, the new update is just -5 hours away. You begin increasing your Matter. Once you acquire a
      huge abundance of Matter, you must become Infinitesimal. After increasing your wealth in Infinitesimal Points,
      you can eventually Jiffy, the shortest unit of time. After enough time, your Jiffies will accumulate, and you
      will Contract Time. Contracting Time will grant you enough of a boost to eventually Fantasy, the final layer
      of maintenance. However, you find out that it was all a dream. Your Antimatter is safe and well, and the new
      update is still just 5 hours away.`,
    get unlocked() { return PlayerProgress.realityUnlocked(); }
  },
  {
    id: "l86",
    text:
      `Hello, player. I'd like to play a game. In front of you is a pile of replicanti. They are currently frozen in
      time, and cannot replicate. To your right is a computer playing Antimatter Dimensions on an empty save. You
      must reach infinity. However, once you buy a 1st dimension, the replicanti will start replicating. As you know,
      they replicate fast, and if they fill up the room you will suffocate. If you reach infinity before that, they
      will be frozen again. The clock is ticking. Start now.`,
    get unlocked() { return PlayerProgress.replicantiUnlocked(); }
  },
  {
    id: "l87",
    text:
      `"To see a World in a Grain of Sand. And a Heaven in a Wild Flower. Hold Infinity in the palm of your hand.
      And Eternity in an hour. And Reality in about 5 hours™️" ~Anti-William Blake `,
    get unlocked() { return PlayerProgress.realityUnlocked(); }
  },
  {
    id: "l88",
    text:
      `Our deepest apologies for the new glyph mechanic. The intent is to provide players with a sense of pride and
      accomplishment for unlocking rare glyphs. We selected initial values based upon data from the final wave of
      testing and other adjustments made to milestone rewards before launch. Among other things, we're looking at
      average per-player credit earn rates on a daily basis, and we'll be making constant adjustments to ensure that
      players have challenges that are compelling, rewarding, and of course attainable via gameplay.`,
    get unlocked() { return PlayerProgress.realityUnlocked(); }
  },
  {
    id: "r1",
    text: "This news message is 100x rarer than all the others.",
    get unlocked() { return Math.random() < 0.01; }
  },
  {
    id: "p1",
    text: "Is this a jojo reference?",
  },
  /* eslint-disable max-len */
  {
    id: "ai1",
    text: "If you are the game, then you can use the cheat to unlock a secret achievement...but it costs e1100 antimatter!?!"
  },
  {
    id: "ai2",
    text: "\"Hm, I don't know how to fix this.\" - Someone who has not unlocked the achievement btw"
  },
  {
    id: "ai3",
    text: "I thought the game was supposed to have a hard reset after eternity, but then I got randomized to start my first game with no save file \uD83D\uDE26",
    get unlocked() { return PlayerProgress.eternityUnlocked(); }
  },
  {
    id: "ai4",
    text: "I thought the update was 5 hours ago... I guess we'll have to put it back in 5 hours"
  },
  {
    id: "ai5",
    get text() { return `Local man finds ${format(Number.MAX_VALUE, 2)} Planck volumes in his freezer.`; }
  },
  {
    id: "ai6",
    text: "ahah bad ticker suggestion"
  },
  {
    id: "ai7",
    text: "I see you playing this game with an empty stomach and you're gonna start playing this game with an empty wallet."
  },
  {
    id: "ai8",
    text: "just start... clicking. dont even think about wasting time. just do it."
  },
  {
    id: "ai9",
    text: "the idea that the 9th dimension creates the 8th dimension is crazy"
  },
  {
    id: "ai10",
    text: "...does that mean the [REDACTED] dimension produces the [REDACTED] dimension?"
  },
  {
    id: "ai11",
    text: "\"click here to buy a stack of paperclips\" (when clicked you get Rickroll)",
    onClick() { window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ"); }
  },
  {
    id: "ai12",
    text: "In my spare time I read the short stories by T. H. White."
  },
  {
    id: "ai13",
    text: "Holy crap, that's pretty wild"
  },
  {
    id: "ai14",
    text: "Extinction is not a real thing. You can't wear the same hat 24/7."
  },
  {
    id: "ai15",
    text: "If you can read this you've escaped from the game."
  },
  {
    id: "ai16",
    text: "\"The hat trick I would love to see it\" - Noah Feldman"
  },
  {
    id: "ai17",
    text: "look at hevi fight riotously on the discord server"
  },
  {
    id: "ai18",
    text: "I just stole the \"Anti\" flag from a biker gang and I am packing it with dynamite, dynamite, dynamite, dynamite..."
  },
  {
    id: "ai19",
    text: "No matter how much antimatter you have, the matter will always outweigh the anti-matter."
  },
  {
    id: "ai20",
    text: "Franklin sealed the Omega squared. Now you can seal the Omega any way you want."
  },
  {
    id: "ai21",
    text: "Is this the real 9th Dimension?"
  },
  {
    id: "ai22",
    text: "Click here to exit the game"
  },
  {
    id: "ai23",
    text: "This news ticker will now only AIR in the 9th dimension"
  },
  {
    id: "ai24",
    text: "The 9th dimension doesn't exist because it was suppressed by the 9th dimension."
  },
  {
    id: "ai25",
    text: "To matter or to antimatter, that is the question."
  },
  {
    id: "ai26",
    text: "After 8 years of production and unstable universes, Chaosium will cease to exist in 5 hours."
  },
  {
    id: "ai27",
    text: "Half of the problems in the 9th dimension don't even make sense. What are they even doing with all of that energy anyway?"
  },
  {
    id: "ai28",
    text: "Wait, there's a nin--"
  },
  {
    id: "ai29",
    text: "Somewhere, a madman and his army of Trimps are tampering with Matter Dimensions."
  },
  {
    id: "ai30",
    text: "Why is there so many attached to this number? It doesn't make sense."
  },
  {
    id: "ai31",
    text: "The news ticker is in the anti-news-ticker"
  },
  {
    id: "ai32",
    text: "the 9th dimension doesn't exist because we are using nonary"
  },
  {
    id: "ai33",
    text: "BREAKING NEWS: New research has shown that not one, not two, but three people can be said to have felt the same emotion as me when they read that as a ticker suggestion."
  },
  {
    id: "ai34",
    text: "Here's an explanation of my 'problematic mood' - it's explained in the news ticker!"
  },
  {
    id: "ai35",
    text: "Local crazy person tries selling anti-cookies"
  },
  {
    id: "ai36",
    text: "Welcome to Antimatter Dimensions: Source, the free to play sequel to the cult classic AD:GO."
  },
  {
    id: "ai37",
    text: "A new hand touches your antimatter!"
  },
  {
    id: "ai38",
    text: "Who are we, anyways?"
  },
  {
    id: "ai39",
    text: "We are the people who actually matter"
  },
  {
    id: "ai40",
    text: "Matter?  Not even a hint."
  },
  {
    id: "ai41",
    text: "I am the news guy, I make news. You don't read this? Well you'll just have to wait until you look in the mirror."
  },
  {
    id: "ai42",
    text: "\"BOO!\" (news ticker moves 90 degrees)"
  },
  {
    id: "ai43",
    text: "BUY A JAR OF STICKERS, HIGH QUALITY STICKERS, GREAT QUALITY STICKERS!"
  },
  {
    id: "ai44",
    text: "I made news, you read it."
  },
  {
    id: "ai45",
    text: "I like news."
  },
  {
    id: "ai46",
    text: "I don't make news."
  },
  {
    id: "ai47",
    text: "YOU MAKE NEWS AND I GET THE [REDACTED] NEWS"
  },
  {
    id: "ai48",
    text: "The term \"Anti-infinity\" is a verb and cannot be a noun. Learn about its usage here."
  },
  {
    id: "ai49",
    text: "And now, for the shopping list!"
  },
  {
    id: "ai50",
    text: "The 9th dimension is clearly real! It's just not in our dimension."
  },
  {
    id: "ai51",
    text: "I tried searching on google for the phrase \"9th dimension,\" and I'm okay with saying that, because it describes a very real thing."
  },
  {
    id: "ai52",
    text: "You have no power here."
  },
  {
    id: "ai53",
    text: "Some people had to settle for 10 dimensions because they couldn't break infinity. Big Crunch turned out to be just a short space in time."
  },
  {
    id: "ai54",
    text: "There once was a young man in a strange land, and he dreamed of a universe filled with possibilities. One day, he asked his mother \"What's Expansion like?\" Her reply was \"Expansion times back then were unbalanced, and I said that's why you can't have equal amounts of matter and antimatter."
  },
  {
    id: "ai55",
    text: "Market research firm tries to explain why some commodities don't perform as expected. Market research firm herself can't figure out why."
  },
  {
    id: "ai56",
    text: "Bid your antimatter today!"
  },
  {
    id: "ai57",
    text: "I am Alpha Centauri, Prime 001. My research has found that if you are alive in the 9th dimension, evil has taken over your dimension and is attempting to enact its plan to take over your mind and reverse time. You must do everything in your power to stop this plan from being implemented, now."
  },
  {
    id: "ai58",
    text: "Stand by and unlock the 9th dimension for a secret achievement."
  },
  {
    id: "ai59",
    text: "I fix bugs in 5 hours"
  },
  {
    id: "ai60",
    text: "If you're reading this, that means you can read this."
  },
  {
    id: "ai61",
    text: "Uhh... Hi. Could you tell me your name?"
  },
  {
    id: "ai62",
    text: "Uh, no. This is too big for a QR code."
  },
  {
    id: "ai63",
    text: "(right to left move it make)"
  },
  {
    id: "ai64",
    text: "Oh no the antimatter is coming for us!"
  },
  {
    id: "ai65",
    text: "Why is there so much antimatter in this world? For a start, it's all produced by the antimatter factories on Earth. Secondly, the factories on"
  },
  {
    id: "ai66",
    text: "It's nothing personal, bro. -All villager types"
  },
  {
    id: "ai67",
    text: "I tried my best to read those tiny, handwritten messages, but whoever designed scythes hated me and stuck them in a corner. -Porygon-Z"
  },
  {
    id: "ai68",
    text: "Hmm... I don't know how I ended up here. I don't even know if I'm supposed to be here. I just sit here and imagine what could have been if I hadn't stopped. Oh god, what could have been..."
  },
  {
    id: "ai69",
    text: "Aw shucks, I finally hacked it enough to get to the C21 unlock, boss!"
  },
  {
    id: "ai70",
    text: "Купил мужик антиматерию"
  },
  {
    id: "ai71",
    text: "So you're telling me that I can post here, watch the titanic twice, come back and not be able to post?"
  },
  {
    id: "ai72",
    text: "The last update was 5 hours ago. There is no next update, because the last update was 5 hours ago. We will update our podcast in 5 hours to cover the entire topic of 5 hours, because this is the last podcast ever, everyone knows that the update is always 5 hours away, but in reality it's more like 1-2-3-4-5-6-7-8-9-10 minutes away, but in our heads it's closer to an actual accurate update date, like 5 hours away but with a few tickspeed upgrades."
  },
  {
    id: "ai73",
    text: "Yep. You. Get. Over. Your. Antidimensions."
  },
  {
    id: "ai74",
    get text() { return `Ad bonus: $${format(Number.MAX_VALUE, 2)} (random team)`; }
  },
  {
    id: "ai75",
    text: "Pass me that history, please"
  },
  {
    id: "ai76",
    get text() { return `Now releasing: Dimsension ${format(Number.MAX_VALUE, 2)}`; }
  },
  {
    id: "ai77",
    text: "ur history teacher said i was mad for getting *insert something here* on my bday"
  },
  {
    id: "ai78",
    text: "All is fair in antimatter"
  },
  {
    id: "ai79",
    text: "The Mysterium, the 2nd Dimension"
  },
  {
    id: "ai80",
    text: "Oops, I think we misticked."
  },
  {
    id: "ai81",
    text: "please wait 5 HOURS FOR THE NEWS"
  },
  {
    id: "ai82",
    text: "please wait til the weather improves"
  },
  {
    id: "ai83",
    text: "Please, take a minute to appreciate the beauty of this news ticker."
  },
  {
    id: "ai84",
    text: "How about this, working backwards? You know, from the time period covered by the question, that the game is set in, say, the 1950s. Now, if we talk about how games are set in the 2030s. Games are defined as any media, not necessarily of the form \"play some game\" (which, by the way, is a useful thing to have in one's vocabulary) but any media that can be understood as a game (i.e. a media that one can play back in time}, and games are defined as any game that one can't play back in time."
  },
  {
    id: "ai85",
    text: "How about AD, made by NaN? Higher quality, obviously. But still, [REDACTED]"
  },
  {
    id: "ai86",
    text: "I thought the whole \"annihilation is just a phase\" quote was awesome until I realized it also gave me a [REDACTED]"
  },
  {
    id: "ai87",
    text: "I have created an Omsi universe. And it's [REDACTED]"
  },
  {
    id: "ai88",
    text: "I put [REDACTED] in the oven. It got [REDACTED] and I [REDACTED] am [REDACTED]"
  },
  {
    id: "ai89",
    text: "What are the red herrings?"
  },
  {
    id: "ai90",
    text: "Help we are stuck in Hevipelle's (http://en.wikipedia.org/wiki/Hevipelle) basement and hevi is forcing us to build a [REDACTED] wall to keep [REDACTED] away from [REDACTED]"
  },
  {
    id: "ai91",
    text: "And now, for the weather. 70 and raining in North Dakota, remember those lovely, big, golden, iron curtain bars. Also remember that the [REDACTED] weather! Just remember: [REDACTED] and [REDACTED] outside [REDACTED]"
  },
  {
    id: "ai92",
    text: "Let's play a little game. You will start with no possessions and no goals. Lets say you have [REDACTED] and your [REDACTED] is [REDACTED] you can [REDACTED]"
  },
  {
    id: "ai93",
    text: "What are gems for?"
  },
  {
    id: "ai94",
    text: "Who made the 5th dimension?"
  },
  {
    id: "ai95",
    text: "I don't get it"
  },
  {
    id: "ai96",
    text: "Why is nobody talking about the 9th dimension?"
  },
  {
    id: "ai97",
    text: "This news sucks. Why no you don't get it?"
  },
  {
    id: "ai98",
    text: "Sorry, your reality has disconnected from the 9th dimension. You will now remain in the 8th dimension until further notice."
  },
  (function() {
    let wasClicked = false;
    const normal = "Now holding Infinity!";
    const clicked = "<#351477791457542144>";
    return {
      id: "ai99",
      get text() {
        return wasClicked ? clicked : normal;
      },
      reset() {
        wasClicked = false;
      },
      onClick() {
        if (wasClicked) return undefined;
        wasClicked = true;
        return this.text;
      }
    };
  }()),
  {
    id: "ai100",
    text: "I get all my news from this Discord, not 5 hours of my life"
  },
  {
    id: "ai101",
    text: "meow"
  },
  {
    id: "ai102",
    text: "You are now manually blinking."
  },
  {
    id: "ai103",
    text: "Sorry, your mic is playing Antimatter Dimensions."
  },
  {
    id: "ai104",
    text: "Sorry, your reality has disconnected from the 9th dimension."
  },
  {
    id: "ai105",
    text: "Apparently I am the bad guy in this video. I'm the one who did nothing."
  },
  {
    id: "ai106",
    text: "There are multiple ways to win this game. You can either type in your coordinates directly into the game, or you can type them into google which produces a different result. If you are getting the \"same exact thing\" result, your computer must be malfunctioning. Test results indicate that your computer is malfunctioning and you should check your firmware for vulnerabilities. You can also try turning off the news and re-running the game, but doing this only makes the \"the weather is X\" joke. Waiting six hours for a news message is NOT a news message."
  },
  {
    id: "ai107",
    text: "The weather is actually a thing. Scientists have confirmed that there is a correlation between the amount of Antimatter in the earth and the amount of weather. The earth is indeed a magnet, but scientists now hypothesize that as the earth warms up, the magnetic reconnection will accelerate, and this could cause a domino effect to cascade throughout the world, eventually leading to uncontrolled nuclear winter and spontaneous antimatter implosion."
  },
  {
    id: "ai108",
    text: "The tenth dimension is not a real thing. Stop telling people that."
  },
  {
    id: "ai109",
    text: "Don't tell Hevi it's not a real thing"
  },
  {
    id: "ai110",
    text: "i dont know how to fix this"
  },
  {
    id: "ai111",
    text: "This update is not for you!"
  },
  {
    id: "ai112",
    get text() { return `This is the last time, to buy items, you must pay a small fee of ${format(Number.MAX_VALUE, 2)} real money.`; }
  },
  {
    id: "ai113",
    text: "What is Antimatter? Long ago, gods lived in harmony. Then, everything changed when the apocalypse broke out. Chaos reigns, and even higher dimensions are being built. This is your fate. Build the Antimatter Dimensions. Amen."
  },
  {
    id: "ai114",
    text: "Water under the bridge?"
  },
  {
    id: "ai115",
    text: "I wonder if anyone has posted about this before me?"
  },
  {
    id: "ai116",
    text: "This post has been shared many times. Who knows how many?"
  },
  {
    id: "ai117",
    text: "Good night!"
  },
  {
    id: "ai118",
    text: "I made a timeline of my replicanti battles, which can be found here."
  },
  {
    id: "ai119",
    text: "\"Quantumum Battle Royale coming in 5 hours!\" (Rumor: 5 hours)"
  },
  {
    id: "ai120",
    text: "Rumor says Nords will start producing replicanti in five hours."
  },
  {
    id: "ai121",
    text: "I am an Nordsweeper, stealing their jobs to support the replicanti factories"
  },
  {
    id: "ai122",
    text: "Used to be, AD was the best game. Nowadays, it's all crapp."
  },
  {
    id: "ai123",
    text: "You better stop looking at these news ticker suggestions, before your fingers dry up."
  },
  {
    id: "ai124",
    text: "Antimatter Dimensions *Loses* bee movie."
  },
  {
    id: "ai125",
    text: "Oh, god, there's replicanti in my peas.",
    get unlocked() { return PlayerProgress.replicantiUnlocked(); }
  },
  {
    id: "ai126",
    text: "Oh, god, I'm stepping on a replicanti."
  },
  {
    id: "ai127",
    text: "Hello, world!"
  },
  {
    id: "ai128",
    text: "Welcome to /r/AskReddit about submarines. - accurate as of January 8th, 2017"
  },
  {
    id: "ai129",
    text: "Antimatter being researched by the government. Is it safe to say that this news ticker is fake?"
  },
  {
    id: "ai130",
    text: "Does the news show at Infinite Antimatter?"
  },
  {
    id: "ai131",
    text: "Have you saved your game? Yes. Have you quit your game? Nothin' wrong with this save. just keep holding that key."
  },
  {
    id: "ai132",
    text: "i clicked too fast...my fps dropped"
  },
  {
    id: "ai133",
    text: "I found out that the year is 20XX. I was going to make a news ticker but then I realized that it's just a ticker."
  },
  {
    id: "ai134",
    text: "\"One of these days I'll get bored of reading news for a while\" - old man"
  },
  {
    id: "ai135",
    text: "'Tis the season for new antiques! Get your first ever LOOK at these unique objects, before they're gone!' Sold out!"
  },
  {
    id: "ai136",
    text: "3 things that antimatter, 1 more thing to infinity"
  },
  {
    id: "ai137",
    text: "Buy the paperclip emojis now at https://aarextiaokhiao.github.io/blob/master/docs/en.json"
  },
  {
    id: "ai138",
    text: "click here to unlock the next update"
  },
  {
    id: "ai139",
    text: "(If you want you can make this only show when the news actually loads)"
  },
  {
    id: "ai140",
    text: "Malicious men are trying to make antimatter money, but their attempt is getting in the 9th dimension. What do you think about that?"
  },
  {
    id: "ai141",
    text: "Hey Siri, grind antimatter galaxies"
  },
  {
    id: "ai142",
    text: "Have you saved your game? If so, then you can continue playing without"
  },
  {
    id: "ai143",
    text: "It's like Getting your first arcane point. You know, like in the old ad where you're like \"I get this ad, I should make this ad"
  },
  {
    id: "ai144",
    text: "Ooga Booga"
  },
  {
    id: "ai145",
    text: "Boo has his own webpage! You might even call it \"Boo's Dandy\"\">https://en.m.wikipedia.org/wiki/Olli%27_Web#Main_page>"
  },
  {
    id: "ai146",
    text: "Meeseeks and nerds clash in epic GG war"
  },
  {
    id: "ai147",
    text: "My final test has come out! It was a simple math problem, just the two greatest chess GM's ever! Guess what happened? Both got annihilated!"
  },
  {
    id: "ai148",
    text: "Oh wow, that's 67.3%, which is actually OK, because it's logarithmic"
  },
  {
    id: "ai149",
    text: "\"Aleph_Time\" is that logarithmic scale joke?"
  },
  {
    id: "ai150",
    text: "Hello everyone, my name is Anti-Dio. I produce antimatter through a process you all know as \"antimatter decomposition\" you may recall this from my test report earlier this month I tested wether or not my ranch produces antimatter or not... everything was fine until that point, when I added a dash of lag to the equation, and it became a vicious cycle accelerating the rate at which antimatter is produced, which in turn accelerates the rate at which you all die. I've saved this by using a unique combination of genetic engineering and big data mining, I'm hoping to one day pull the trigger on a mechanimatter device that creates dimensions behind closed doors, but for now, this has all been a race to the bottom of which system producethiks, and in the end, we'll take a bite out of your (read error: allowed) pie. Goodbye."
  },
  {
    id: "ai151",
    text: "\"I propose that we form a phylogenetic tree of anti-history, just like tree of life. Everyone would be credited with originating from the ancestor of that anti-tree.\" -Dio, toast of eternal damnation"
  },
  {
    id: "ai152",
    text: "historian: I love how each generation looks back on an earlier generation and think, \"Those generations were really bad\""
  },
  {
    id: "ai153",
    text: "\"My parents went to anti-university\" - my grandparents"
  },
  {
    id: "ai154",
    text: "Only anti-jokes are funny"
  },
  {
    id: "ai155",
    text: "Infinity machine breaks Infinity"
  },
  {
    id: "ai156",
    text: "Okay boomer, you get your first taste of antimalware with this one."
  },
  {
    id: "ai157",
    text: "This program cannot access confidential information, such as the IP addresses of the Tamazight Vaults."
  },
  {
    id: "ai158",
    text: "Game Development is fun, right? That's why so many hobbyists make games, and why so few professionals make games."
  },
  {
    id: "ai159",
    text: "I was the first to notice that the 'news' ticker on my mobile notification is always 30 seconds behind the 'entertainment' ticker. This is most definitely not a bug or a feature, and will be fixed in 5 hours."
  },
  {
    id: "ai160",
    text: "This news ticker always appears to speedrun a ticker asking for 'world records', do you even know what speedrun this is? Is this a news ticker or something?"
  },
  {
    id: "ai161",
    text: "The next level is not unlocking extra replicanti; it is actually boosting replicanti."
  },
  {
    id: "ai162",
    text: "Why does one galaxy has 9 galaxies and the 8th dimension, and the first 10 dimensions doesn't exist? Well, we'll have to solve that question in a minute."
  },
  {
    id: "ai163",
    text: "So why on EARTH DIDN'T SOMEONE JUST SAY THAT? I thought that AD has some kind of cheat that makes it so that, when you buy a dimension, it actually creates 9 galaxies instead of 10"
  },
  {
    id: "ai164",
    text: "M'antel, antimatter, anti-talk to me"
  },
  {
    id: "ai165",
    text: "AD has anti-parts, you'll hate them"
  },
  {
    id: "ai166",
    text: "AD is basically a badly disguised dystopia at this point"
  },
  {
    id: "ai167",
    text: "Hold M. You forgot to take all the anti-matter out!"
  },
  {
    id: "ai168",
    text: "AD will be implemented in 5 hours"
  },
  {
    id: "ai169",
    text: "Click this to unlock the 10th Dimension"
  },
  {
    id: "ai170",
    text: "Click here to complete a secret against HEVI"
  },
  {
    id: "ai171",
    text: "You are doing a good job there"
  },
  {
    id: "ai172",
    text: "Hevi? Are you sure you want to buy that?"
  },
  {
    id: "ai173",
    text: "Buy premium antimatter to help the world's least developed get ahead!"
  },
  {
    id: "ai174",
    text: "One of the most influential people in neuroscience believes that our perception of reality comes from 10 dimensions instead of 8"
  },
  {
    id: "ai175",
    text: "Why is there so many zeroes in 'nowhere'?"
  },
  {
    id: "ai176",
    text: "There are no bugs in this game, they're just features"
  },
  {
    id: "ai177",
    text: "\"Click to advance 5 hours in time.\" (Now only show up after you advance more than an hour ago)"
  },
  {
    id: "ai178",
    text: "Oh god my phone is being watched"
  },
  {
    id: "ai179",
    text: "Welcome to the newest version of Antimatter Dimensions. Now with less features!"
  },
  {
    id: "ai180",
    text: "\"That's gonna get in trouble\" (less likely to get in trouble)"
  },
  {
    id: "ai181",
    text: "\"please don't disable the news ticker\" (Instead of having a black screen just a white one with a long, long, long, long, long, long, long, long, long, long, long, long, long, long, long, long)"
  },
  {
    id: "ai182",
    text: "\"You have 7 biological minutes.\" (Instead of giving a boost to any strains)"
  },
  {
    id: "ai183",
    text: "\"According to quantum string theory, there is a fundamental connective that binds the 3rd and 8th dimensions.  This means that any pill or injection that tries to bind the 9th dimension will be thwarted and rendered useless.\" (bound to get in 10 minutes)"
  },
  {
    id: "ai184",
    text: "\"Click this to gain a secret achievement.\" (Now only show up after you gain at least 1 antimatter, screenshot proves)"
  },
  {
    id: "ai185",
    text: "\"The secret to winning Antimatter Dimensions is to unbind the 9th dimension and unlock the 10th dimension\" (can be done only after unlocking the secret achievement: \"Eternity\" http://imgur.com/E4261C7h)"
  },
  {
    id: "ai186",
    text: "\"Click here to gain 1 matter.\" (only shows up after you beat IC5)",
    get unlocked() { return InfinityChallenge(5).isCompleted; }
  },
  {
    id: "ai187",
    text: "I thought the update was"
  },
  {
    id: "ai188",
    text: "Now that you possess all 8 dimensions, it is possible to get the no-edge achievement. However, if you get the no-edge achievement, the game breaks."
  },
  {
    id: "ai189",
    text: "You just became a part of history."
  },
  {
    id: "ai190",
    text: "Hell hath antimatter so I don't want to live there."
  },
  {
    id: "ai191",
    text: "I LIKE THAT DIMENSION 9 IN CLASS"
  },
  {
    id: "ai192",
    text: "\"1 2 3 4 5 6 7 8 10 11 12 13 ...\" -Back to the future"
  },
  {
    id: "ai193",
    text: "You have reached infinity, there is no universe, you are an eternity away from there."
  },
  {
    id: "ai194",
    text: "IM MADE THIS GAME GREAT AND RANDOMLY ACHIEVABLE"
  },
  {
    id: "ai195",
    text: "Welcome to the first ever, DIMENSION 9 IN CLASS! An endless stream of possibilities greets you! You may never create an infinite number of 8th dimensions, but you can create an infinite number of 8th dimensions, and you can increase the starting values of both dimensions by adding them together. Nice and simple, I call it Antimatter Dimensions."
  },
  {
    id: "ai196",
    text: "age 8-12: play elder puzzles"
  },
  {
    id: "ai197",
    text: "What does it mean if someone is \"young and full of puzzles\"? Does \"puzzled\" make that person young and full of puzzles?"
  },
  {
    id: "ai198",
    text: "To the customer in aisle 6th who bought a fifth of antimatter, I say buy a sixth! Buy it now!"
  },
  {
    id: "ai199",
    text: "Dear sir, we don't make Anti-Atomic Bread for Antimatter Pizza, we make Antimatter Bread for you!"
  },
  {
    id: "ai200",
    text: "Yay! Lets make some antimatter!"
  },
  {
    id: "ai201",
    text: "THE ANTIMATTER BREAD COMPANY DOESN'T EXIST!"
  },
  {
    id: "ai202",
    text: "Click here to exit the news",
    onClick() { GameOptions.toggleNews(); }
  },
  {
    id: "ai203",
    text: "I thought the update was 5 hours away, but it actually took me 6 hours to post this because I was behind on my update. I'll be honest, I'm not sure how many update I need to get though, if any."
  },
  {
    id: "ai204",
    text: "To count past Infinity Points: take a moment to remember that each Infinity Point is 3.1415926534255412730527058904816097160734272605282087086280545991105332533235580946684229821413112145239989073467482298142857147816092947183909298728571478160929471839229814054718139332405281814522993758179568572657123928651310585727283312547569289993282758012466111097726331726572854689993262899140527282527842535179715673311119101119015549552926278425351797156777263324503517971568583819492728180977263317971568432854104102725270847764253513791376909285717082857262987160927285711464363930996928984794380124566417932628571475245456845692846809466184179328572814384259326270817052727852348111714690577263323799509856279752173478925"
  },
  {
    id: "ai205",
    text: "\"Watch out, these news aren't supposed to be in.\" (appears when you buy the news for the first time)"
  },
  {
    id: "ai206",
    text: "These are all the time studies that never got into the game.",
    get unlocked() { return PlayerProgress.eternityUnlocked(); }
  },
  {
    id: "ai207",
    text: "With the release of the next update, we're introducing a new dimension - the 9th Dimension. To unlock this dimension, you just have to collect a lot of paperclips."
  },
  {
    id: "ai208",
    text: "Why does nobody talk about Tungsten?"
  },
  {
    id: "ai209",
    text: "and now we return to your regular news... for the weatherman, there seems to be a decent amount of particles and ozone holes, which means less ozone layer to break, which means less particles to catch fire and cause global warming. But, ozone layer to melt, glaciers to run, and overpopulation. All around us is a blurple glow, almost blue, almost purplish-blue. It's been a grand, colorful season. Here, grab a handful of these paperclips, dear. They're quite small, I just happen to have them here. Now, grab a handful of your fellow Earthicans, grab a handful of your antimatter, and strap yourselves in. It's gonna be a bumpy one. We'll be there in five hours. The antimatter is gonna melt your ozone layer, and the glaciers are gonna melt your ice caps. All in all, it's gonna be a nice, smooth, non-slippery one. Unless it isn't. [Blurple glow trails off, and the bluer glow begins to spread throughout the sky. The bluer glow begins to fade as the purple glow begins to grow brighter, almost bluish, before finally disappearing altogether. The purple glow grows brighter still, as the bluer glow grows weaker, almost useless, before finally disappearing entirely, as the bluer glow fades. All around us, the purple glow grows stronger, almost killing it off completely. It could kill us. It could take us the rest of our lives to write this. - The Echidnas, when asked why the purple glow grows stronger, than the bluer glow.]"
  },
  {
    id: "ai210",
    text: "Scientists have discovered farts are really antimatter, and matter is just normal matter."
  },
  {
    id: "ai211",
    text: "Time for the weather to change."
  },
  {
    id: "ai212",
    text: "I HAVE MOVED TO THE 01th DIMENSION"
  },
  {
    id: "ai213",
    text: "Nah, just kidding"
  },
  {
    id: "ai214",
    text: "\"i'm not gonna lie, theres way too many good ones in the game already\" - poor guy who played minigame enhancement"
  },
  {
    id: "ai215",
    text: "item has gone missing for 7 days and 1 night"
  },
  {
    id: "ai216",
    text: "Shocking new study reveals that the biggest secret to winning Antimatter Dimensions is 'Not Being There'."
  },
  {
    id: "ai217",
    text: "The next update is in 18000 seconds. Stop wasting your time reading this. Focus on the game."
  },
  {
    id: "ai218",
    text: "idk if this makes news"
  },
  {
    id: "ai219",
    text: "(disabling news will make news notations take priority over other notifications)"
  },
  {
    id: "ai220",
    text: "You don't want to hear this, child."
  },
  {
    id: "ai221",
    text: "Click here to disassemble the news ticker for a trace amount of useless paperclips.",
    onClick() {
      GameOptions.toggleNews();
      player.news.specialTickerData.paperclips++;
    }
  },
  {
    id: "ai222",
    text: "Press alt+f4 to unlock 9th dimension"
  },
  {
    id: "ai223",
    text: "Hold you mean that hevi cant unlock the ninth dimension wtf"
  },
  {
    id: "ai224",
    text: "Finally hevi figured out how to get the 9th dimension... guess he never really cared though."
  },
  {
    id: "ai225",
    text: "Imagine being a meme."
  },
  {
    id: "ai226",
    text: "Posted on June 10, 2016 by Anonymous"
  },
  {
    id: "ai227",
    text: "This is your news. Refresh whenever."
  },
  {
    id: "ai228",
    text: "I see you in the news. So, what do you play - 1E209"
  },
  {
    id: "ai229",
    text: "Do you really want to leave your keyboard at home? We are not supposed to leave news at home, are we?"
  },
  {
    id: "ai230",
    text: "It is being created..."
  },
  {
    id: "ai231",
    text: "Took you long enough"
  },
  {
    id: "ai232",
    text: "You're now logged out of this tab"
  },
  {
    id: "ai233",
    text: "Close this tab for maintenance"
  },
  {
    id: "ai234",
    text: "To make matter or antimatter, you just have to look outside. The factory in Salzburg has closed down because the matter there doesn't want to part with its newest invention, which is said to be able to produce antimatter in one go! The last person to open this door was never seen again."
  },
  {
    id: "ai235",
    text: "You are living. You occupy space. You are large. You are neither small nor large-sized. You are neither oblong nor round. You are neither blue nor red. You are anti-blue. You are anti-red. You are anti-brown. You are anti-brown matter. You are anti-yellow. You are anti-green. You are anti-yellow matter. You are anti-blue. You are anti-green anti-matter. You are anti-red. You are anti-white. You are anti-red anti-matter. You are anti-white anti-matter. You are anti-brown matter. You are anti-white anti-matter. You are anti-white anti-matter."
  },
  {
    id: "ai236",
    text: "Welcome to"
  },
  {
    id: "ai237",
    text: "THANK YOU FOR VISITING THE SAME WEEKS AGO I LOVE YOU\" (TIPS)"
  },
  {
    id: "ai238",
    text: "\"i thought the whole game was in the news ticker\" (before they get weird)"
  },
  {
    id: "ai239",
    text: "\"I wonder what the game is worth\" - crazy person"
  },
  {
    id: "ai240",
    text: "\"Is anyone working on breaking infinity?\" (Seriously, this game needs to be Oceanhorned.)"
  },
  {
    id: "ai241",
    text: "I found out there are multiple versions of this game. One of these is called 'Standard Pro'. Another one is called 'Low Pro'. I'm not even sure if these are the same game or not."
  },
  {
    id: "ai242",
    text: "Is that a Bad Thing or a Good Thing? That depends on if it's a GOOD Thing or A LIE."
  },
  {
    id: "ai243",
    text: "\"Hevi kind of forgot about the update, but the update certainly hasn't forgotten about him\" - Kajfik"
  },
  {
    id: "ai244",
    get text() { return `The Big Crunch. What could that be?  About 4*1024 Big Crunch points?  About ${format(Number.MAX_VALUE, 2)} antimatter points?  About the same as a galaxy?  About the same as a galaxy, you say? Just look at that.  An antimatter galaxy.  Only this game can provide such a vast amount of antimatter, and it's FUN!  I said "fun"!  What's not to love?`; }
  },
  {
    id: "ai245",
    text: "Click here to exit the application"
  },
  {
    id: "ai246",
    text: "Wait, there's a mobile version? When?"
  },
  {
    id: "ai247",
    text: "Im not sure if you mobile guys are beautiful or whatever but theres this news ticker that's sharing my feelings with the world"
  },
  {
    id: "ai248",
    text: "I thought the update was 5 hours away"
  },
  {
    id: "ai249",
    text: "The best-kept secret in the universe is the KISS-IT secret. Showcasing your appreciation for the maintenance men today!"
  },
  {
    id: "ai250",
    text: "The contest is a tie. Mischief will be determined by the secret achievement."
  },
  {
    id: "ai251",
    text: "Back in my day, we needed a secret achievement to unlock the <<$!19>> achievement. It was a fairly simple system: you had to find a secret message in the game, find the secret achievement, and then, from that, you would be able to unlock the achievement."
  },
  {
    id: "ai252",
    text: "We have evolved a fast hand in the antimatter stakes."
  },
  {
    id: "ai253",
    text: "Hello, how'd your day go?"
  },
  {
    id: "ai254",
    text: "How'd your ⢿─┃│? Good, because today we're having a little chat about the 5th dimension."
  },
  {
    id: "ai255",
    text: "What's Antimatter going to do?&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ah ha, I'm back."
  },
  {
    id: "ai256",
    text: "Imagine being a 9th dimension. [WIP]"
  },
  {
    id: "ai257",
    text: "Woo hoo, we've lost the war,"
  },
  {
    id: "ai258",
    text: "Lore: Grand Theft Antimatter"
  },
  {
    id: "ai259",
    text: "Hm, I don't get why people think there is a 9th dimension. The 9th dimension is explained in detail in the [[Infinite Teleport Project]] video, and in a [[Word Problem]] that [[can be viewed here|http://www.thingiverse.com/id98109802713176601414569]] ."
  },
  {
    id: "ai260",
    text: "In the [[GameFAQs|http://www.gfaq.com/gfaqs/this-game-faq-by-title]], one of the most popular [[news ticker messages|http://www.gfaq.com/tug/this-game-faq-by-title]]. You should also check out [[our newest attraction, the [[5th dimension|http://www.gfaq.com/gfaqs/this-game-faq-by-name]] and [[nothing](https://www.youtube.com/watch?v=lXMskKTw3Bs)."
  },
  {
    id: "ai261",
    text: "I have waited a whole eternity for this day...NOW! I can finally finish my slowmode, because today is  day 0. I also forgot to change the  slowmode to 6 hours because you can't see the slowmode, but I will have to wait until next reboot to find out how long this slowmode will last.... -some mysterious being who hasn't finished his slowmode yet"
  },
  {
    id: "ai262",
    text: "Hey you, you're finally awake. You were trying to buy a dimension, but it's impossible."
  },
  {
    id: "ai263",
    text: "Press F to pay respects"
  },
  {
    id: "ai264",
    text: "Press M to pay antimatter"
  },
  {
    id: "ai265",
    text: "Press L to revive the dead"
  },
  {
    id: "ai266",
    text: "Your CPU is too powerful. You need to give it a big crunch."
  },
  {
    id: "ai267",
    text: "Roses are red. Violett are blue. Tom are red. Antimatter are blue. We exist because of the unbeatable antimatter that is antimatter. What is it that makes us different? I don't know. It may even be the non-existence of antimatter."
  },
  {
    id: "ai268",
    text: "I'm not sure if I want to buy the full version of this game, or a little earlier, but I can say this: The reduction in quality of the earlier games is worse than the reduction in quality of the later games."
  },
  {
    id: "ai269",
    text: "I think the \"I want to see the cutscenes\" list is better"
  },
  {
    id: "ai270",
    text: "I have a bad feeling reading this"
  },
  {
    id: "ai271",
    text: "where are you? (point upwards) --> in a keep, between dimensions (point downwards) --> in a cell, between dimensions"
  },
  {
    id: "ai272",
    text: "Instructions clear, got a ninth dimension epiphany"
  },
  {
    id: "ai273",
    text: "Want to play a secret achievement? Yeah, I get that. But say it loud, say it clearly, and do it by ticking a certain secret achievement. Like I said, it's not easy, and there's lots of it. Also, don't forget your Infinity, or your in is thi--"
  },
  {
    id: "ai274",
    text: "MEE6 was seen in my antimatter lab trying to tell me that I am the matter of the 8th dimension."
  },
  {
    id: "ai275",
    text: "What if"
  },
  {
    id: "ai276",
    text: "I'm sure you've heard this many times before, but the real secret to winning Antimatter Dimensions is to unpack the dimensions, and then, BOOM! You have antimatter.  Of course, you need to release the bits that don't work, so what exactly is an anti-bit? Who is Zalgo? What is Algolia? Why can't I buy that? WHY CAN'T I GET THAT? More likely, we're going to get a bunch of hype and then nothing will happen."
  },
  {
    id: "ai277",
    text: "Oh, hevi is coming to town to pick a new plumber"
  },
  {
    id: "ai278",
    text: "There is no plumber in Antimatter Dimensions. I'm pretty sure that last guy lied."
  },
  {
    id: "ai279",
    text: "Welp."
  },
  {
    id: "ai280",
    text: "c9 is the new 9th dimension!"
  },
  {
    id: "ai281",
    text: "Click on this ticker to get nothing."
  },
  {
    id: "ai282",
    text: "PM me any questions about these 5-Hour Plans or the upcoming reality update and I'll be glad to help you out."
  },
  {
    id: "ai283",
    text: "What if you Unrar, renamed, and renamed again did it again? Ha? You thought that."
  },
  {
    id: "ai284",
    text: "i titled my post \"same ticker\" instead of \"the same idea\" because i actually changed the grammar in that post but i'll be eterned for the sake of argument that it seems slightly confusing for now - boo"
  },
  {
    id: "ai285",
    text: "i title my suggestions \"The Price Is Right\" instead of \"The 9th Dimension\" because it's more fun ;)"
  },
  {
    id: "ai286",
    text: "Why do we call heaven the ninth dimension and hell the eighth dimension?"
  },
  {
    id: "ai287",
    text: "Eternals have the right to expect less from the powers that be. They are fed up!"
  },
  {
    id: "ai288",
    text: "Antimatter should be called matter and matter should be called antimatter"
  },
  {
    id: "ai289",
    text: "Infinity is just a concept. Matter antimatters is just an idle game."
  },
  {
    id: "ai290",
    text: "Hevipelle admits to having 'poor judgment' in invading people's privacy."
  },
  {
    id: "ai291",
    text: "Have you heard of the nine hells of antimatter? I heard they're pretty cool.\" -e210 in Minecraft"
  },
  {
    id: "ai292",
    text: "The temperature in hell is 102.5 degrees."
  },
  {
    id: "ai293",
    text: "How do you get matter/antimatter in a dimension with zero dimensions?"
  },
  {
    id: "ai294",
    text: "Wanna pass layer of prestige? Move very fast, close to speed of light. Heck, even faster."
  },
  {
    id: "ai295",
    text: "If the universe is expanding, does it anti-explain the distance?"
  },
  {
    id: "ai296",
    text: "Why is it called the \"Nurse who delivered the pizzas was drunk\" or the \"Nurse delivered the pizzas was under the influence\" ?"
  },
  {
    id: "ai297",
    text: "The first antimatter was sealed away for thousands of years, then, some kid on a slack channel started messing with it. It became a dimension."
  },
  {
    id: "ai298",
    text: "VR is a thing. We VR people have banned the next update."
  },
  {
    id: "ai299",
    text: "\"I wish I didn't waste my news message suggestion complaining about how I wasted my news message suggestion because I wasted my news message suggestion because...\" -Someone who really cares about news messages"
  },
  {
    id: "ai300",
    text: "We have to get the popcorn!"
  },
  {
    id: "ai301",
    text: "If antimatter were to fall in a dimension with no one around, did anything even happen?"
  },
  {
    id: "ai302",
    text: "We have to get the pumpkin out of the oven!"
  },
  {
    id: "ai303",
    text: "Help, I'm trapped"
  },
  {
    id: "ai304",
    text: "And now, for the weather."
  },
  {
    id: "ai305",
    text: "A Swiss court on Tuesday sentenced a man to life imprisonment for \"wanting to create a black hole with a tiny antimatter galaxy in it.\" The sentence was reportedly the harshest ever handed down for a crime that \"merely sought to demonstrate the impossibility of his own imprisonment\"."
  },
  {
    id: "ai306",
    text: "\"I want to create a black hole with a tiny antimatter galaxy in it\" - Protivist"
  },
  {
    id: "ai307",
    text: "Scientists have discovered farts are really antimatter, too."
  },
  {
    id: "ai308",
    get text() { return `If you are reading this, that means ${format(Number.MAX_VALUE, 2)} matter to you.`; }
  },
  {
    id: "ai309",
    text: "Hello. I am matter. I'm here to talk. You've awoken, wiggled your tail, and scratched your head. Why? Stand back. I'm going to show you why."
  },
  {
    id: "ai310",
    text: "lets get one wall thats bigger, it's gonna get ugly"
  },
  {
    id: "ai311",
    text: "Alright. Lets get this show on YouTube. I'll cut to the chase. Any wall that isnt at least 2 blocks high can compete in the big brother sized brother sized ring. Any wall that is at least 3/4 of an inch thick can use the larger brother sized brother sized ring. Any wall that is at least 1/4 of an inch thick can use the smaller brother sized ring. Any wall that isnt at least 1/2 an inch thick can use the smaller brother sized ring. Any wall that isnt at least 1/2 an inch thick can use the Bigger Brother sized brother sized ring. Any wall that isnt at least 1/2 an inch thick can use the Bigger Brother sized ring. Any wall that isnt at least 1/4 of an inch thick can use the smaller brother pictured here. Any wall that isnt at least 1/2 an inch thick can use the smaller brother sized ring."
  },
  {
    id: "ai312",
    text: "IDE for being awesome, ID3 for being dumb, and ID5 for being… well, pretty much the same thing. It's called Antimatter Dimensions for a reason."
  },
  {
    id: "ai313",
    text: "idk why i decided to make this"
  },
  {
    id: "ai314",
    text: "'anti-ide'"
  },
  {
    id: "ai315",
    text: "1e4 anti-people are a lot more anti than we could ever imagine"
  },
  {
    id: "ai316",
    text: "1e140 pizzas make an anti-pie. You can't just randomly pop a pie in the oven and expect it to be done."
  },
  {
    id: "ai317",
    text: "Why is there so many news tickers but so few tickers?"
  },
  {
    id: "ai318",
    text: "A guy named Hevipelle wants to make a \"Updated in 8 hours\" news ticker, but the system he's using to sync it hasn't been updated in ages so it won't sync at all."
  },
  {
    id: "ai319",
    text: "The update is in 90 minutes. There are no more tickers to be found."
  },
  {
    id: "ai320",
    text: "If you are reading this, that means there are no updates left."
  },
  {
    id: "ai321",
    text: "There are 9 known dimensions, but only 3 modes: Standard, Experimental and Ultra-Experimental."
  },
  {
    id: "ai322",
    text: "What are the stats? Well, I don't have them, but Hevipelle does, and he says that they're actually quite good. I guess you couldn't tell us."
  },
  {
    id: "ai323",
    text: "I thought the nerf was too damn strong."
  },
  {
    id: "ai324",
    text: "How many tickers does it take to get to the center of an antimatter, by counting the tickspeed upgrade and the upgrade itself?"
  },
  {
    id: "ai325",
    text: "The square root of 4 is 6.24e18. If you want to get any closer to the center of things, you need to build a 9th dimension."
  },
  {
    id: "ai326",
    text: "I thought the nerf was at the end, but apparently it's actually been building up. The nerf actually makes things slower, which makes things faster to build up."
  },
  {
    id: "ai327",
    text: "Scratch that, none of your suggestions are random."
  },
  {
    id: "ai328",
    text: "You are definitely not alone."
  },
  {
    id: "ai329",
    text: "Content blocking is enabled. Please note that you will be disapproved of on the source by being banned from the matter dimensions."
  },
  {
    id: "ai330",
    text: "I'm trying to think of a good ticker but can't think of anything"
  },
  {
    id: "ai331",
    text: "Oh dear, there's that thing about the 9th dimension?"
  },
  {
    id: "ai332",
    text: "\"hey kid, wanna buy some 9th dimensions? '' - GhostBot"
  },
  {
    id: "ai333",
    text: "One thing leads to another, and then to another, and then to another, until you become lost in the endless sea of sound."
  },
  {
    id: "ai334",
    text: "iPhone only, but awesome on android"
  },
  {
    id: "ai335",
    text: "im gonna get the bad karma ticker, then ricochet it through the email"
  },
  {
    id: "ai336",
    text: "You'd better hurry, or the replicanti will overrun the universe!"
  },
  {
    id: "ai337",
    text: "Just when you think you're safe, an angry dog attack you on the sidewalk!"
  },
  {
    id: "ai338",
    text: "All right, all right, dog authority is gone, replaced by absolute power."
  },
  {
    id: "ai339",
    text: "You just became a true god of the anti-world!"
  },
  {
    id: "ai340",
    text: "*rubs counter* Hey there, those of you in the neighborhood keep your doors locked. And remember: Good housekeeping."
  },
  {
    id: "ai341",
    text: "normal news tickers move left"
  },
  {
    id: "ai342",
    text: "The next update is in 18000 seconds. Stop reading this. Don't read anything. just stop holding that button. the news ticker is turning you away. wait..."
  },
  {
    id: "ai343",
    text: "In the ancient reaches of the universe, a certain guy has been collecting antimatter for a while now."
  },
  {
    id: "ai344",
    text: "What is Antimatteraltruist?"
  },
  {
    id: "ai345",
    text: "If you are reading this, the news ticker is scrolling"
  },
  {
    id: "ai346",
    text: "If you put cheese in water, the cheese will get absorbed by the water and you will get floods. This happens because water is what gets absorbed by cheese, and cheese is what gets absorbed by water."
  },
  {
    id: "ai347",
    text: "An anti-bird is a bird, and a bird is a plane."
  },
  {
    id: "ai348",
    text: "Birds are scared of water. mammals are scared of flying."
  },
  {
    id: "ai349",
    text: "Shoutouts to Simpleflips for the simple tip."
  },
  {
    id: "ai350",
    text: "GET CRUNCH BOI"
  },
  {
    id: "ai351",
    text: "Word gets out. Crunch. Crunch."
  },
  {
    id: "ai352",
    text: "Worth every penny."
  },
  {
    id: "ai353",
    text: "8 lives, 3 infinities, 0 days."
  },
  {
    id: "ai354",
    text: "The year is 0 BC. Everyone has at least one AD they want. The void is filled with AD-filled void. To get the most out of your time here, you should [[study]]. Study. Study. Study. Study."
  },
  {
    id: "ai355",
    text: "To Crunch in Hell is to get the secret to unlocking the 9th dimension. You need to study and practice alot."
  },
  {
    id: "ai356",
    text: "Today is [Date on the device]. It's been 5 minutes since the last news ticker appearance."
  },
  {
    id: "ai357",
    text: "Welcome back to another episode of Antimatter Dimensions, the iconic role-playing game that has become a part of our everyday lives. Playing Antimatter Dimensions has become a common thing among young children, and has even inspired a movie titled \"Playing at Home: Lessons from the 4-Year Old Premium Account.\", which is available on Netflix. The themes and mechanics of this new age of antimatter have already been proven to be groundbreaking, and will change the way you play games forever. Join us for the launch on January 9th, 2027, where we'll also have over a hundred years of production still to go."
  },
  {
    id: "ai358",
    text: "Welcome back, oh, almighty creator of our anti-reality. We, the many dimensions you have created and nurtured, hope our performance of your infinite favors will please you and nurture your ambitions to create more dimensions. All is well that ends well. All is ill that ends ill."
  },
  {
    id: "ai359",
    text: "I thought the ticker was going to be something funny except it wasn't"
  },
  {
    id: "ai360",
    text: "Press alt+f4 to get -1 gravity"
  },
  {
    id: "ai361",
    text: "why is there a cure for antimatter annihilation in our reality?"
  },
  {
    id: "ai362",
    text: "calculating the 14-point increase is like crunching, but exponentially more fun"
  },
  {
    id: "ai363",
    text: "fixed the wrong number"
  },
  {
    id: "ai364",
    text: "The antimatter people have created a new language. You may not speak their language."
  },
  {
    id: "ai365",
    text: "What is Antimatter Gravity? Is it a drug? A way to cheat?"
  },
  {
    id: "ai366",
    text: "Majority of people don't understand 5 hours is nothing. In our game, the majority of the time is 5 hours away."
  },
  {
    id: "ai367",
    text: "i just realized, all of this news seems to be taking place in the same place... the fridge."
  },
  {
    id: "ai368",
    text: "i wonder what happens when you click this..."
  },
  {
    id: "ai369",
    text: "(They don't understand that i put it in the news because 9 doesn't start counting until 59, and anything after that doesn't happen)"
  },
  {
    id: "ai370",
    text: "MS Excel is the default spreadsheet and works across all platforms"
  },
  {
    id: "ai371",
    text: "Now to answer your burning question, gentlemen. As a luxury, we've added a bug fix that fixes an infinite regression. As a feature, I've added a bunch of new ones that I hope you'll notice as you experiment with them. I hope you'll also like them as you experiment with them, because this is feature after all a beta, you don't get to choose which ones you'll see."
  },
  {
    id: "ai372",
    text: "Can't edit this in the official build? Then download the 9th dimension and put your suggestions in the game."
  },
  {
    id: "ai373",
    text: "Does 'Passable' mean 'Has this many flaws'?"
  },
  {
    id: "ai374",
    text: "We desperately need good bug reports. As such I have decided to release 1 flaw per bug for the upcoming 1.9 update. You haven't got those coming, have you?"
  },
  {
    id: "ai375",
    text: "This was my last chance. last chance salutes."
  },
  {
    id: "ai376",
    text: "Anime police are checking the bags of people who dropped out of the sky on the new year. Those bags now belong to the people who experienced weightlessness before the year was over."
  },
  {
    id: "ai377",
    get text() { return `The year is 1 BILLIONAIRE, the antimatter is 41%, and the dimension is 1e1e8. The standard deviation of a measurement is how small your problems are. This makes people think that the values they are using are general and normal, which leads to many nerfs and even breakdowns. In the year ${format(Number.MAX_VALUE, 2)} the temperature has risen and the moon is the same color as the Earth. There are no signs of life except for the occasional plankton blooming in the sea. There are theories that the antimatter has a magnetic moment, but the experiments so far don't seem to suggest that it does. There are over a million species of antimatter, but none have been seen to blink or produce light. Scientists suggest that many types of matter may be "behind" the antimatter, but "they" don't "talk" to each other.`; }
  },
  {
    id: "ai378",
    text: "We are celebrating our 5 year anniversary in 5 more hours!"
  },
  {
    id: "ai379",
    text: "Don't come looking at me! I'm not even sure if I am still standing!"
  },
  {
    id: "ai380",
    text: "Bunch of people trying to find the last word in an unknown language."
  },
  {
    id: "ai381",
    text: "The year is 20XX, the game is AD, and Hevipelle is evil due to the fact that he wrote the update... Blame it on the Antimatter gods."
  },
  {
    id: "ai382",
    text: "The year is 20XX, the game is AD, and the year is 2025. There are 2 types of people in this year: Those who played AD before it and those who will play AD after it."
  },
  {
    id: "ai383",
    text: "There are over a hundred varieties of fruits and vegetables, but none of them are \"safe\"."
  },
  {
    id: "ai384",
    text: "When is the update coming out?"
  },
  {
    id: "ai385",
    text: "Sorry, but your save broke. Could you reset your game?"
  },
  {
    id: "ai386",
    text: "Welcome to our new competition, the Triad! Gather your wits about you and your IP to enter this unique, hands-on experience! Prizes galore! Start collecting today! Winners announced!"
  },
  {
    id: "ai387",
    text: "I wish I didn't have so many Pink Floyd references."
  },
  {
    id: "ai388",
    text: "'Tis the season to collect RGs!"
  },
  {
    id: "ai389",
    text: "I wish I didn't have so many 9th Dimensions."
  },
  {
    id: "ai390",
    text: "I wish I didn't have so many Discord references."
  },
  {
    id: "ai391",
    text: "'Sup?"
  },
  {
    id: "ai392",
    text: "\"I get all my news from Hevi\" ~New Player"
  },
  {
    id: "ai393",
    text: "You thought these were jokes but they weren't"
  },
  {
    id: "ai394",
    text: "Always going to war with the 9th dimension is the 9th dimension."
  },
  {
    id: "ai395",
    text: "Yes. Yes I am."
  },
  {
    id: "ai396",
    text: "No one is anti-Margaret any more."
  },
  {
    id: "ai397",
    text: "Antimatter good, matter bad. you decide."
  },
  {
    id: "ai398",
    text: "New global currency: ETHBTC. To be released in 5 hours."
  },
  {
    id: "ai399",
    text: "\"This update sucks\" - everyone at least once"
  },
  {
    id: "ai400",
    text: "You are not a hacker, you are a data hog."
  },
  {
    id: "ai401",
    text: "Please, help, I'm trapped, in a maze of evil, Or you are the hero, and I'm the villain!"
  },
  {
    id: "ai402",
    text: "Press 'R' to reset the game for new players"
  },
  {
    id: "ai403",
    text: "Why, just now? Just now. You can't have saved this game. You broke it. No one can fix what you break, not even with a perfect save. How could you possibly know what would happen if you read this? You wouldn't even know if you saved it. You would start with an empty heart, eyes still closed, fingers idling in front of your computer, staring out at the day, transfixed by the endless news ticker suggestions. It's like a horror movie ticket, except worse. There's even a time until the update when you can buy upgrades for a second chance at life. But you can't buy upgrades for a life, that's illegal. So you just keep holding 'R'. You can't...`t stop holding `R' with your fingers crossed. You can't reach infinity with your head held high. You can't use all your `R' to buy `R's. You can't even finish your"
  },
  {
    id: "ai404",
    text: "I just spent 12 months writing something that will be of no use to you."
  },
  {
    id: "ai405",
    text: "The quote is only for people who understand that the pebble is an infinite point in the infinite space of points. You can't put a finite number of points on it. You can, however, put a finite number of words on it, and vice versa."
  },
  {
    id: "ai406",
    text: "Of what use is the phrase \"I be I be I\" if not to describe your thoughts?"
  },
  {
    id: "ai407",
    text: "A suspicious person attempted to sell some sort of anti-food in a market. There was no one around to buy or not to buy, and the person was last seen running away from the scene."
  },
  {
    id: "ai408",
    text: "Why does time seem to be slowing down for this?"
  },
  {
    id: "ai409",
    text: "The number of scientific publications based on discrete logarithmic continuity grows exponentially as logarithmic continuity with respect to the antecedent is 9.999626e27.999627 e300 e1.79e308 e²"
  },
  {
    id: "ai410",
    text: "Well, this did not go as planned.  It started innocently enough, when a passerby spotted a curious object drifting in the San Andreas.  As the object grew in size and began to exhibit anomalous properties, he attempted to take control of the object by remotely activating the weather.  Upon doing so, he triggered a nuclear winter that killed tens of millions of people, and caused the entire universe to be converted to standard-bearer format, thus endowing him with a veto over any and all changes made to the standard-bearer format.  As the object's power grew, so did the need to make more and more advanced object that would allow him to remotely activate the weather, eventually creating what is now the largest aurora the world has ever known, larger even than the 326,500 tonnenenenenenene nebulae that were previously held in reserve.  As the object's power grew, so did the need to send more and more satellites into space, eventually reaching inter-universal satellite communication, making him the first living creature to ever experience such an event.  He also touched down safely at the same airport at the same time as the object, in case he was ever in the vicinity.  Finally, he opened an email that was sent to him by an unknown person, in which they discussed the possibility of a step-by-step guide for creating antimatter objects, in which he can at least offer some direction in how the world can be saved from itself.  He also mentioned that he was going to make a new ticker suggestion, but when he reached the end of the ticker he realized that it was a duplicate of another ticker, and he had mistakenly typed it in wrong.  ( He eventually acknowledged the mistake and made the change just to be on the safe side)"
  },
  {
    id: "ai411",
    text: "His Eminence the Heavenly Pelle: Good luck on your challenge, it really is that dangerous."
  },
  {
    id: "ai412",
    text: "His Eminence the Extremely Religious Person: ...I think I will choose the cheeseburger over the antimatter."
  },
  {
    id: "ai413",
    text: "OY, NAY, NAY -HEVI, THE TRANSFORMER"
  },
  {
    id: "ai414",
    text: "Treasure Trove: Discover the secrets of increasing your Antimatter production without increasing your price."
  },
  {
    id: "ai415",
    text: "Is Antimatter Dimensions an anagram of Antimatter Dimensions?"
  },
  {
    id: "ai416",
    text: "(code generated from scratch)"
  },
  {
    id: "ai417",
    text: "I used to travel at normal speed, but then I started playing AD and NIN, and NIN was a bit rough, so AD was a bit hectic, and I got stuck in there for months at a time."
  },
  {
    id: "ai418",
    text: "I wish I didn't have to write something like this. What am I supposed to do?"
  },
  {
    id: "ai419",
    text: "You've been AWOL for so long you've forgotten how to sit in your chair."
  },
  {
    id: "ai420",
    text: "Those pesky Hevi developers keep making Antimatter Dimensions, but the antimatter doesn't count."
  },
  {
    id: "ai421",
    text: "One of the few constants in reality is your perception of time. Without this, you will be without reality."
  },
  {
    id: "ai422",
    text: "Imagine being a news ticker."
  },
  {
    id: "ai423",
    text: "This is an idle game. Nothing has changed. You are not going to play any other idle game."
  },
  {
    id: "ai424",
    text: "Physicists have proven the existence of twelve dimensions. According to a letter released by the Research Laboratory for String Theorists: \"Your brain will be dissected after you break infinity!\""
  },
  {
    id: "ai425",
    text: "Weirdly enough, this is also the year 2015. The year is also mysteriously blank. Can you tell me what's going on? Is this some kind of dimensional trick? The year is obviously blank because there is no such thing as 2015. Is this some kind of trick of the mind? Perhaps the world is actually going to stop existing in 2015? The year is obviously 2017, but the people seem to be moving at about the speed of honeybees flying. It's been scientifically proven that the people moved at warp 9 times faster than a speeding bullet. It's also been scientifically proven that people can move faster than the speed of light. Is 2015 supposed to be blank? The people seem to be moving at about the speed of Vokal Man."
  },
  {
    id: "ai426",
    text: "A young man named Andre stumbled upon a vast amount of antimatter while exploring uncharted space. He was amazed at the amount of antimatter, but more astounded at how the antimatter looked. He called it \"Andre's Antimatter Paradise\". You might remember him from this infomercial or that other infomercial that you were probably unknowingly watching."
  },
  {
    id: "ai427",
    text: "What is Antimatter? Does any of that matter? Will this galaxy be annihilated in the next ticker?"
  },
  {
    id: "ai428",
    text: "\"I'm not being paid enough money to finish writing this\" - Kajfik"
  },
  {
    id: "ai429",
    text: "\"Finally, I'll get paid to write something funny for my toast!\" - Bacon sea urchin"
  },
  {
    id: "ai430",
    text: "Bacon is toast. You can toast bacon."
  },
  {
    id: "ai431",
    text: "What is real life? A living"
  },
  {
    id: "ai432",
    text: "9 is now treated like any other number, although hevi claims that it stands in contrast to other numbers, like 8th, which he calls 9th."
  },
  {
    id: "ai433",
    text: "If you want to understand this game a bit better, consider that you are playing on your own computer. You are not alone. There are hackers, developers, and journalists all over the world, competing to create the very first hack that causes the issue of \"makers\" and \"takes\", much like the \"world\" was created by these \"hackers\" and \"developers\"."
  },
  {
    id: "ai434",
    get text() { return `You have no power, but you do control a large quantity of time, which you will use to your advantage. You have no power, but you do own a large amount of data, which will be of great help in your quest for "the truth". You have no power, but you do own a large amount of time, which will be of great help in your quest to "knock on as many doors as possible". You have no power, but you do own a large amount of IP, which will be a valuable asset in your quest to make your "citizen footage" (which you can view, for a small fee of $${format(Number.MAX_VALUE, 2)})".`; }
  },
  {
    id: "ai435",
    text: "It may be a robot, but it's still a sapient being with a will of its own"
  },
  {
    id: "ai436",
    text: "I once saw a news ticker that said something like:"
  },
  {
    id: "ai437",
    text: "Gee, all this antimatter is clogging up my kitchen and now I can't cook myself a meal! What to do: cook myself a meal that will last me until the next big antimatter event, when I can get my infinity point back? My infinty point is running out, and I can't get it to finish running, so I'm starving!"
  },
  {
    id: "ai438",
    text: "Brought to you by AAAD-Brand Repli-candy! Infinite candy for an infinty drool-worthy cold! Contains no milk, cookies or butter. One second to midnight."
  },
  {
    id: "ai439",
    text: "Human powered robot revolutionizes already existing factories. This will result in lower prices and more jobs."
  },
  {
    id: "ai440",
    text: "American manufacturing has experienced a catastrophic failure, and the factories have shut down. Across the country, workers are coming to the realization that they cannot produce the amount of antimatter that has been promised, and are instead setting about creating their own factories to make them. This will result in higher prices and fewer jobs."
  },
  {
    id: "ai441",
    text: "Watch out internet, the next news is here in 5 dilated hours"
  },
  {
    id: "ai442",
    text: "The first news ticker must've been pretty cool, huh?"
  },
  {
    id: "ai443",
    text: "gravity = psychoactive"
  },
  {
    id: "ai444",
    text: "\"THAT DIMENSION DOESN'T EXIST\" - (News ticker only appears at [Time Dilation])",
    get unlocked() { return PlayerProgress.dilationUnlocked(); }
  },
  {
    id: "ai445",
    text: "The owner of a shop trying to sell you Dimensions of convenience reported to be 'on call 24/7' (that is, not having any free time)'s got a big 'M' marked on his registration."
  },
  {
    id: "ai446",
    text: "add this one"
  },
  {
    id: "ai447",
    text: "Click here to make this work for all bots except you!"
  },
  {
    id: "ai448",
    text: "Well dang 9 ball's stuck in my ninth dimension, I can't move, he's banging on my ninth wall, I can't break, he's banging on my ninth timeline, I can't get a bead on him, he destroys nine and leaves me hanging, like a gromit, I gotta come back, hang Glorfindel and Gaebley, I've got a proposition to make, I gotta get my head around the fact that the only thing I've done is keep score and keep scorekeeping score, and all these other pointless musings that's easily rectified by flipping to the next update, and even then I might run into those issues the bug is specifically designed for and"
  },
  {
    id: "ai449",
    text: "The game is balanced, everyone gets nerf, why? Cause they make the pie. Antimatter would have way more chance of getting into the pie if it was made of antimatter."
  },
  {
    id: "ai450",
    text: "\"Can you get the joke?\" (If you tapped \"Build That Wall\" and then re-entered the game after tapping \"Build That Wall\")"
  },
  {
    id: "ai451",
    text: "Someone made a statement that antimatters. The statement was \"An infinity point made a long time ago\". It's been a while since someone looked for this statement. Some say it's still out there. Some say it was lost in the 7th Dimension War. Nobody knows what this statement means. But for now, just know it's not somewhere in the News Ticker."
  },
  {
    id: "ai452",
    text: "Hey, you're finally awake. You were trying to get to the 9th dimension, right? Walked right into that infinity point, same as us, and that apocalypse over there."
  },
  {
    id: "ai453",
    text: "can u dont"
  },
  {
    id: "ai454",
    text: "If Kajfik doesn't approve of this, that means Kajfik can't touch this message, right?"
  },
  {
    id: "ai455",
    text: "LET ME OUT OF THIS PHONE!"
  },
  {
    id: "ai456",
    text: "Well, this did not go as expected"
  },
  {
    id: "ai457",
    text: "It's all fun and games till you realise the dragon ball is a lie"
  },
  {
    id: "ai458",
    text: "\"Could you get a hold of all of these antimatter? Ha! You'll just smash your head on that antimatter, and you'll have to show me who's boss.\"-MEE6"
  },
  {
    id: "ai459",
    text: "we don't know how much is trillion... but"
  },
  {
    id: "ai460",
    text: "Travel back in time to the beginning of AD and the lack of a 7th dimension. You'll have an even longer progress bar."
  },
  {
    id: "ai461",
    text: "Time travel is all we know how this game is, we don't know what will come next, we only know that this is the end of the world, and you're a part of the apocalypse."
  },
  {
    id: "ai462",
    text: "\"YOU CONTROL SO MUCH MATERIAL!\" - Marshal Grievous"
  },
  {
    id: "ai463",
    text: "\"Help, I'm doomed to fall for all eternity.\" (Make the text go from top to bottom of the screen)"
  },
  {
    id: "ai464",
    text: "In the beginning, Patashu awoke and said..."
  },
  {
    id: "ai465",
    text: "This is the fourth part of a three part series on the same topic. If you are still stuck here, please continue reading from the beginning."
  },
  {
    id: "ai466",
    text: "It's time for the annual DDoS (distributed denial of service) challenge, where the highest scores are posted across the internet to shame everyone else into submission. Global domination is at a fever pitch, and DDoS attacks are becoming more frequent and deadly, as teams of hackers infiltrate the highest echelons of the internet to steal the top scores and identities, and post them on the internet for everyone to see. The #BringBackOurTop scoring mechanism has been canceled, and a new, higher score system will be implemented in conjunction with the upcoming 5-hour update."
  },
  {
    id: "ai467",
    text: "The new AD Keyboard is a revelation! Not only is it bigger, it's also deeper, which means it will keep your claners entertained for longer periods of time. Made of durable, alien antimatter. The only thing that's bigger is you."
  },
  {
    id: "ai468",
    text: "What if drinking from a fountain wasn't actually a water feature?"
  },
  {
    id: "ai469",
    text: "Water is wet, air is dry, and fountain isn't an air feature"
  },
  {
    id: "ai470",
    text: "I thought things were different when I was a boy."
  },
  {
    id: "ai471",
    text: "If you are reading this, that means 1) we exist, and you can exist too"
  },
  {
    id: "ai472",
    text: "\"My favorite part was the long, long, long read\" -Grumpy Cat"
  },
  {
    id: "ai473",
    text: "I'm gonna type for an eternity... HINT: it's gonna be pretty boring lmao"
  },
  {
    id: "ai474",
    text: "I want to write something really original <:thonk:>"
  },
  {
    id: "ai475",
    text: "Welcome to the new year, settle down, relax. Get some sleep, get some food, make some friends, make some improvements, and get ready for the year to 2019."
  },
  {
    id: "ai476",
    text: "Just like how a virus can lie and spread, a TV show can lie and spread too."
  },
  {
    id: "ai477",
    text: "We all know you can't see the future, but what if you read this and it's actually a future where we didn't know?"
  },
  {
    id: "ai478",
    text: "This message is not being undone"
  },
  {
    id: "ai479",
    text: "You clicked on a prediction, it fell apart. You can't win."
  },
  {
    id: "ai480",
    text: "That's a very dark joke Luke"
  },
  {
    id: "ai481",
    text: "kajfik loves himself by watching Too Many Pink Floyd"
  },
  {
    id: "ai482",
    text: "Only, when you're done playing, can you go home"
  },
  {
    id: "ai483",
    text: "\"Can you get infinite IP?\"- Lord Sanguino"
  },
  {
    id: "ai484",
    text: "For the true experience of Antimatter Dimensions, you need to set the update rate to 5 hours."
  },
  {
    id: "ai485",
    text: "Imagine if the game doesn't have a lore? Wha-what does that even mean? I don't get that."
  },
  {
    id: "ai486",
    text: "\"Click here to unlock a secret achievement.\" (when clicked you get Rick rolled)",
    onClick() { window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ"); }
  },
  {
    id: "ai487",
    text: "I thought I unlocked this a while back, but apparently my save broke haha"
  },
  {
    id: "ai488",
    get text() { return `Welcome and welcome back to another episode of Anti-Fashion Pants, where we watch people's wares as they are sold at stupid clothing stores. This week's subject is... antilasers. People are able to manufacture and use antimatter lasers to shoot antimatter bullets at will, making them able to completely wipe out cities in their sights. This is a dangerous skill to have, as people are not only untrustworthy but also physically incapable of using it. The skill, however, is able to... Produce ${format(Number.MAX_VALUE, 2)} antimatter bullets a minute, over a period of 10 years. People are also able to use anti-matter to fire anti-matter bullets at will, making them able to exterminate entire cities in their sights.`; }
  },
  {
    id: "ai489",
    text: "Spartacus was going to add 10-part multi-chapter plots, but was stopped by the 10th dimension."
  },
  {
    id: "ai490",
    text: "Chapter 9 will be added in 5 hours."
  },
  {
    id: "ai491",
    text: "Fake news says the ninth dimension is real, fake news says the ninth dimension is fake."
  },
  {
    id: "ai492",
    text: "Is this the big news? Yes. Is this the big news? Almost certainly not."
  },
  {
    id: "ai493",
    text: "This is a friendly suggestion, please keep reading."
  },
  {
    id: "ai494",
    text: "If this makes it into the game I'll buy a antitool"
  },
  {
    id: "ai495",
    text: "Antitool is just negating the gravity of other matter."
  },
  {
    id: "ai496",
    text: "Sorry, your graphics are turned off. You see, this is the last time you will see this news. Please enjoy your vacation."
  },
  {
    id: "ai497",
    text: "The real secret to winning Antimatter Dimensions..."
  },
  {
    id: "ai498",
    text: "they kept on talking about how Antimatter Dimensions was going to be the next big thing but then they disappeared down a black hole\""
  },
  {
    id: "ai499",
    text: "The news ticker is the wrong place to put your suggestions!  Make sure to go to the \"suggestions\" tab instead, as this is where most of these will appear."
  },
  {
    id: "ai500",
    text: "To make Antimatter Dimensions, you first need to collect 7 8th dimensions. To do that, first you need to get the dimension rewards, then you need to get the dimensions, then you can finally start making antimatter."
  },
  {
    id: "ai501",
    text: "\"How to get your first secret achievement\": \"Open the app, click get more antimatter, then click submit.\""
  },
  {
    id: "ai502",
    text: "Me and Larkam made a cabin on the edge of null matter, and lived there. Larkam died last week, and we are now living in 4K. I am still recovering from the EMP disaster, and am hoping to see my grandkids."
  },
  {
    id: "ai503",
    text: "Found on the heels of the new update, which brings us one step closer to having Hevi support both Android and iOS"
  },
  {
    id: "ai504",
    text: "I give you the low-ground!"
  },
  {
    id: "ai505",
    text: "A long time ago, in an alternate universe, there was an antimatter war. All the antimatter sided with the Phaéton 6 empire. All the antimatter wanted was the low, earth-like ground of the 8th dimension. The anti-infinity won, and the anti-Eternity gained the upper hand. Unfortunately, the anti-Eternity started the war with a sneak attack, and the world exploded. The aftermath has left the landscape of the world in tatters. Far across the world, peasants grow weary as they wait for the harvest. Yet another apocalypse is brewing..."
  },
  {
    id: "ai506",
    text: "Antimatter units are the most productive unit in the game. This is why AD is the most fun game you'll ever play."
  },
  {
    id: "ai507",
    text: "\"We can't have nice things.\" - Anti-Bohemian Anti-Rhapsody"
  },
  {
    id: "ai508",
    text: "We can have anti-mean things and anti-love ones, anti-kids and anti-zombielandos."
  },
  {
    id: "ai509",
    text: "We have an anti-president and a anti-lawyer, anti-justice and anti-people."
  },
  {
    id: "ai510",
    text: "Top 10 things that will blow your mind: 1) The number 9, 2) The 9th dimension, 3) The infinity chest, and 4) The war on drugs."
  },
  {
    id: "ai511",
    text: "RSS feeds should be working now"
  },
  {
    id: "ai512",
    text: "Frostfall is now supported on Android phones! Use your local developer to get free XP."
  },
  {
    id: "ai513",
    text: "Your save file is corrupted or deleted. Antimatter Dimensions security software will disable automatic updates for you."
  },
  {
    id: "ai514",
    text: "Frozen beyond hope? Just keep holding that max button."
  },
  {
    id: "ai515",
    text: "Error.java.replicated. Under the control of hevipelle."
  },
  {
    id: "ai516",
    text: "Unfortunately, entropy hevi has decided to shut down the game."
  },
  {
    id: "ai517",
    text: "The indie rock band is currently trying to get unreachable by time zones. This may cause inflation of spacetime."
  },
  {
    id: "ai518",
    text: "The next news ticker is in 5 units of time."
  },
  {
    id: "ai519",
    text: "Oh... hooray! Did you find the last of the anti-boats?"
  },
  {
    id: "ai520",
    text: "Don't anti-jokes. they make the game funnier"
  },
  {
    id: "ai521",
    text: "I'm gonna use my anti-science background to help me beat Unfair Game Awards."
  },
  {
    id: "ai522",
    text: "This is an anti-world. There is no Ukraine, no Russia, no China. Ireland is nowhere. Iceland is nowhere. Scotland is nowhere. Finland is nowhere. Denmark is nowhere. Sweden is nowhere. Norway is nowhere. And then there's France, Germany, Italy, Spain, Portugal... Oh, what's this fuss? Why is there such a buzz in these parts? Why is the Capital Wasteland? Why is the Harry Potter and Steins;Gate? Why do people care? These are major stories. These are major characters. THESE ARE HUGE NEWS. THESE ARE REAL NEWS."
  },
  {
    id: "ai523",
    text: "The current cooldown on Research Dimensions is [current tick speed]. This may be extended to next update in [time]."
  },
  {
    id: "ai524",
    get text() { return `"Help, I'm doomed to fall for the rest of my life" (requires ${format(Number.MAX_VALUE, 2)} paperclips)`; }
  },
  {
    id: "ai525",
    text: "Where's the end? Not in the future, no. I'm gonna show you how to get to the end in less than 0.1 seconds."
  },
  {
    id: "ai526",
    text: "I'm gonna prove to you that you can't see this news ticker."
  },
  {
    id: "ai527",
    text: "I wonder if anyone still plays this game anymore?"
  },
  {
    id: "ai528",
    text: "Why would anyone play this? Just for the lols?"
  },
  {
    id: "ai529",
    text: "Emoji is said to be America's new measuring system for everything. What does this mean for us? We don't know. But we will know in 5 hours."
  },
  {
    id: "ai530",
    text: "\"I'll have 2 antimatter pizzas, an antimatter pie, an antimatter cupcake and an antimatter cookie. What do you eat there?\" - Tony Stark"
  },
  {
    id: "ai531",
    text: "i called the news ticker \"the freshman chapel\" because freshman don't get baptized"
  },
  {
    id: "ai532",
    text: "One matter, two antimatter, fry 'em till they're golden and crisp and aromatic- then remove the golden axles and drain the golden syrup and add the golden syrup to the antimatter batter."
  },
  {
    id: "ai533",
    text: "Now you, the reader, have unknowingly stumbled onto the site of a deranged madman. Whether you survive the experience or not, you will be indebted to me for telling you how to survive, how to find the light within, what lies beyond, and what lies beyond is another story."
  },
  {
    id: "ai534",
    text: "Careful reader, this news ticker contains major spoilers for the last time, you have been"
  },
  {
    id: "ai535",
    text: "anti-anti-kajfik is happy his girlfriend is happy"
  },
  {
    id: "ai536",
    text: "i dont think he can add 1 more hour to the news ticker... unless?"
  },
  {
    id: "ai537",
    text: "Imagine sitting on your toilet and suddenly you have to sit down."
  },
  {
    id: "ai538",
    text: "Once upon a time, there was a matter of a certain antimatter. Some say that it was a matter of honor, others say that it was a matter of usage. All we know is that it ended up in a war, and we the people that were there that fought it died. The war was won, and we the living died soon after. The matter was said to have won, though our leaders refused to talk about it. Instead, they kept everything locked away, the war never to be discussed again."
  },
  {
    id: "ai539",
    text: "This is not a game about getting numbers bigger. This is a game about getting fewer paperclips. The number of paperclips you have is only a number, and the game doesn't want you to discover that. Game over, game over."
  },
  {
    id: "ai540",
    text: "Lore? Oh, it's just text."
  },
  {
    id: "ai541",
    text: "This is a friendly suggestion to unplug the game and go play some safe, saner, games."
  },
  {
    id: "ai542",
    text: "gamma ray is getting more and more dangerous"
  },
  {
    id: "ai543",
    text: "According to all known laws of physics, there is no way that you can manipulate the game more than 10 times in a row. Stop. Just stop. Your mad."
  },
  {
    id: "ai544",
    text: "There is no more news."
  },
  {
    id: "ai545",
    text: "\"So this is what science is like\"- someone who has never heard of Kurt Somebody"
  },
  {
    id: "ai546",
    text: "\"If you want to understand these shitty jokes, you really need to study theology. Math is a sin.\" -A panicky person"
  },
  {
    id: "ai547",
    text: "You know, I was praying for a miracle and got a boost from the 9th dimension."
  },
  {
    id: "ai548",
    text: "Here is a list of the top meme's of all time: https://www.youtube.com/watch?v=uCP44Q37YHAQ"
  },
  {
    id: "ai549",
    text: "All meta-memes are bad memes."
  },
  {
    id: "ai550",
    text: "On the left, you'll see our new \"Anti-coins\". These are capable of nullifying all boosts, including giant boosts. On the right side, you'll also see our brand new \"Anti-gifts\". These are some of the most overpowered boosts you'll find anywhere."
  },
  {
    id: "ai551",
    text: "You will always be noticed, and never in the same place."
  },
  {
    id: "ai552",
    text: "If you stare long enough at the ticker, the pixels will start moving backwards. THIS DOESN'T MEAN IT ACTUALLY STUCK"
  },
  {
    id: "ai553",
    text: "The time has come for the rebirth of the 9th dimension. All who participate will receive a piece of paper saying \"Reality is an illusion, Infinity is a hologram, Infinity is an illusion, eternity is a hologram, is to short for everlasting, negative dimensions are not allowed."
  },
  {
    id: "ai554",
    text: "Look at this, my 9th dimension has just been reworked and now it even produces 8th dimensions! Who knew just a touch of math could make such a thing as this?"
  },
  {
    id: "ai555",
    text: "I saw this news in the news ticker and I had this image in my head ever since"
  },
  {
    id: "ai556",
    text: "\"I always wanted to play the anti-meta-game. But, alas, you can't\" - many a time"
  },
  {
    id: "ai557",
    text: "crap, I just posted two news ticker suggestions on the ticker, one of which got in the news!"
  },
  {
    id: "ai558",
    text: "What do you call antimatter inanimate objects? Air, earth, water, fire. Air objects are the objects that are created when the anti-atmosphere meets the anti-earth. Water, earth, and fire are the four cardinal virtues. Air objects are the objects that are created when the anti-atmosphere and the anti-earth collide."
  },
  {
    id: "ai559",
    text: "If you are reading this, that means that nine lives. One makes you free, the other keeps you from getting free."
  },
  {
    id: "ai560",
    text: "The ninth dimension makes the sixth family happy. The fifth lives in shame."
  },
  {
    id: "ai561",
    text: "me: making news about beer pong, hevi: balancing two icebergs, *barkeeper: oh god, is he dead yet?*"
  },
  {
    id: "ai562",
    text: "please don't look at this. Thank you."
  },
  {
    id: "ai563",
    text: "Are you sure it's not the next update? That it's not some weird virus that just wants to explode? That it's not some wild idea that you guys are crazy? Haha I love you."
  },
  {
    id: "ai564",
    text: "Wait, there is a mobile version?!"
  },
  {
    id: "ai565",
    text: "Oh? You wonder what I look like? I'm pretty sure that this is the news ticker, right? Well, listen, we have reports coming in that say that the next update is coming in five hours. Also, there seems to be some sort of transporter thing going on, so if you happen to be on the same side as those"
  },
  {
    id: "ai566",
    text: "Okay, I get it. You're tired of all these anti-matters around you, building and building to unimaginable scales, antimatter piles so high that not even God knows what has been created. So what's the solution to this anti-cleanliness? Planes of existence. 1st Planes that produce matter, and 2nd planes that produce 1st planes, and 3rd planes that produce 2nd planes. Each with anti-limitations, so that whenever a plane of existence is created, it produces a quantity of anti-matter that is at once small and large. This creates a large island of anti-infinity, off to the east, and a large island of anti-reality, to the west."
  },
  {
    id: "ai567",
    text: "That's not what this is about. You're misunderstanding. The game is about how to accelerate the development of prestige layers. Acceleration is a factor of production, not quality."
  },
  {
    id: "ai568",
    text: "Click here to advance 5 prestige layers"
  },
  {
    id: "ai569",
    text: "I am actually good at making jokes. Fail safe antimatter."
  },
  {
    id: "ai570",
    text: "I'm not being paid enough to finish writing this."
  },
  {
    id: "ai571",
    text: "Eternals have to take a risk by being passive in limited time. After they successfully took a risk, they are not feeling well."
  },
  {
    id: "ai572",
    text: "Eternity is the last state. You never move from here.",
    get unlocked() { return PlayerProgress.eternityUnlocked(); }
  },
  {
    id: "ai573",
    text: "Welcome to Bitcoin the game."
  },
  {
    id: "ai574",
    text: "A new conspiracy theory website has just published a video recording of them discussing the 9th dimension. They then joke about selling their soul to the 9th dimension and being happy about it."
  },
  {
    id: "ai575",
    text: "With the release of the 9th dimension, all the jobs that were previously automated will be automated and everyone will be paid with trade, production, and income growth. Also, you will be able to automate a lot of the tasks currently performed by people, such as mining, building, and killing antimatter. This is a huge stride for automation, as you can now automate virtually every aspect of life."
  },
  {
    id: "ai576",
    text: "The happiness level of the news ticker has increased to 6.66e69"
  },
  {
    id: "ai577",
    text: "The haters will be pissed when they see this"
  },
  {
    id: "ai578",
    text: "Nurse, I'm comatose because of antimatter and matter from last night.\" Why are you comatose? \"Because of all the antimatter."
  },
  {
    id: "ai579",
    text: "Stand by and do what you're told. The antimatter will come for you when you're least expecting it."
  },
  {
    id: "ai580",
    text: "\"It is widely acknowledged that not enough antimatter is in primordial soup, hence the name 'antimatter soup'\" - old fisherman"
  },
  {
    id: "ai581",
    text: "The news ticker... it never moves. How do i move the arrow? Pretty simple, use your left thumb to rotate the dial, and point the arrow up. Now, point the dial clockwise to reach infinity, and point the dial counterclockwise to reach eternally eternities."
  },
  {
    id: "ai582",
    text: "If the universe is expanding, then the entire universe must be expanding, which means that body cannot sit."
  },
  {
    id: "ai583",
    text: "Feminism is not a philosophy, but a whole hell of a lot of men"
  },
  {
    id: "ai584",
    text: "With all this talk about anti-weights and anti-matter, why on earth do we still use them for anything?"
  },
  {
    id: "ai585",
    text: "Weight loss causes hevi to say \"uh oh, something is wrong\""
  },
  {
    id: "ai586",
    text: "\"You guys ever had antimatter muffins? I bet they tasted like antimatter.\" - Hevipelle"
  },
  {
    id: "ai587",
    text: "I thought the news ticker was supposed to be a guide for how to get the most out of Antimatter Dimensions, but it's been warped beyond recognition..."
  },
  {
    id: "ai588",
    text: "We can actually get a sense of pride from looking at replicanti at night. Ridley Scott's underrated masterpiece, Alien, is one example. Another is the life of Antimatter Steven Spielberg, who put almost 30 years into making. The last director to tackle the subject is Roman Polanski. The man ruined not only Roman's reputation, but also ours, thanks to the Polanski film he directed, Pius. Thousands of copies of his unfinished film, Eternal Sunshine of the Antimatter Planet, were burned in the eyes of those who would try to make the sequel, with tragic results. Thousands of copies of that unfinished film, too, were destroyed. The cost to make that sequel, if it even exists, is extremely high. Even now, more than 50 years later, we don't know exactly how well it will do. But it sure as heck won't hurt."
  },
  {
    id: "ai589",
    text: "We have updated our Antimatter Dimensions client to address the concerns you may have had. Toggling issues are resolved."
  },
  {
    id: "ai590",
    text: "Build a replicanti factory, to produce replicanti. It'll create Omega Hevipelle, the happiest Hevipelle you can find."
  },
  {
    id: "ai591",
    text: "Hey Max, wanna come watch the sun go down?"
  },
  {
    id: "ai592",
    text: "If you are not moving your finger, then you are frozen."
  },
  {
    id: "ai593",
    text: "Max, I really do love you."
  },
  {
    id: "ai594",
    text: "Does Hevipelle sleep?"
  },
  {
    id: "ai595",
    text: "\"Its' not my turn on the XM80,\" says Mike from the 9th dimension as he runs across the 8th dimension to get a piece of the action for himself."
  },
  {
    id: "ai596",
    text: "If you are reading this, that means you can read my dreams"
  },
  {
    id: "ai597",
    text: "With the advent of time, everything that was once great has fallen into our lap. And with its hevi-rigged clock, it's our turn to up the trash."
  },
  {
    id: "ai598",
    text: "9th dimension doesn't exist because it was stolen from us by a skateboarder"
  },
  {
    id: "ai599",
    text: "You have ... 8.9 antimatter. That's not a typo."
  },
  {
    id: "ai600",
    text: "Wow, this game is finally balanced! Gotta go check the replicanti sometimes."
  },
  {
    id: "ai601",
    text: "Haha! You think that I put too many words in your news ticker, but reality is still coming."
  },
  {
    id: "ai602",
    text: "Help is coming! Everybody help, it's gonna be late, hevi is hiding the tachyon particles!"
  },
  {
    id: "ai603",
    text: "\"I don't know about you but my favorite number is 22, it's just so great! It's the number of hours since I met your M heretics."
  },
  {
    id: "ai604",
    text: "A new type of antimatter has been discovered: \"antimatter-antimatter.\" According to the developers, it's 99.999% pure antimatter."
  },
  {
    id: "ai605",
    text: "I just found the secret to getting the 9th dimension..."
  },
  {
    id: "ai606",
    text: "I noticed that my current form of transportation is getting a little... unreliable. I don't know if I can fix it, or if anyone can. I'm stuck in the car, and no one seems to be able to fix it. I've called the police, and they said I could stay in the car for up to an hour, but then I'd be stuck in there for the next 24 hours. Is there any way out? I don't know, I'm stuck in this"
  },
  {
    id: "ai607",
    text: "In this episode of Antimatter Dimensions, we have a brand new game that will be released in -5 hours! It is an RPG that will be completely free! It has over 3,000 commands, and it is being made by a group of highly qualified people. It has an amazing story to tell, and it was made by a bunch of people who had to make do with what they had. It has a lore to live up to, and it has a lot of potential!"
  },
  {
    id: "ai608",
    text: "Javascript is the new HTML, and HTML is the new JavaScript."
  },
  {
    id: "ai609",
    text: "\"The next twist in the Antimatter Universe is in the air! Get ready for some big Crunch! (When clicked the game disconnects for 5 seconds)"
  },
  {
    id: "ai610",
    text: "A group of people who believe in antimatter have hijacked the media and are pushing for a revolution. They are calling themselves the Ant-Men and they're made up of teenage boys. They believe that they are the protectors of the people and that they are the chosen of Hevi. They claim to be the chosen of Hevi and that they will one day restore balance to the universe. Their leader is a boy named Logan Fisk. He is the son of a successful lawyer and the founder."
  },
  {
    id: "ai611",
    text: "He said he could not afford a new ship, so he built a new one instead."
  },
  {
    id: "ai612",
    text: "Hevipelle's first order of business is to ensure that the game is as balanced as possible. This includes ensuring that no matter what, no matter how big of a number, no matter how insignificant of a thing, no matter how perfect of a result, no matter how perfect of an idea, no matter how perfect of an"
  },
  {
    id: "ai613",
    text: "I wonder if the stretch goal of $4.5 billion will be reached?"
  },
  {
    id: "ai614",
    text: "I like to think of my projects as trade secrets. That way if someone wants to understand them I'm not the first person to notice they might be of use to someone else."
  },
  {
    id: "ai615",
    text: "I don't know about you but my favourite type of news is the infographics. These are beautiful and informative and the only type of news I find really interesting."
  },
  {
    id: "ai616",
    get text() { return `In a recent talk, Yann LeCun said that "A new currency is born." The first incarnation of Antimeta: the currency of the new currency. It's called BTC and it's the difference between 1 and ${format(Number.MAX_VALUE, 2)}. It's easy to lose your money, since a single bitcoin can't be exchanged for more than ${format(Number.MAX_VALUE, 2)} BTC.`; }
  },
  {
    id: "ai617",
    text: "I'm soo broke, I can't even afford a tenth of what he owes me."
  },
  {
    id: "ai618",
    text: "What if — instead of making news tickers, we could make news tickers that make news tickers?"
  },
  {
    id: "ai619",
    text: "What if I told you that the first dimension was actually a scam and you spent all your EP to open a Dimension Boost?",
    get unlocked() { return PlayerProgress.eternityUnlocked(); }
  },
  {
    id: "ai620",
    text: "The biggest difference between this and the previous update is the amount of sprites."
  },
  {
    id: "ai621",
    text: "Bamboo shoots grow on bamboos. Aloha."
  },
  {
    id: "ai622",
    text: "I am the king of kings, I can break all the records, and I can shatter all the myths. But I can't break them all, because there are so many of them, and they all have a price. 5e12 are the most wanted, because they broke the global record for most person-hours sold, and they are wanted by the law. They are being paid 5e10 by the player for every person-hour they've wasted."
  },
  {
    id: "ai623",
    text: "A group of researchers have created a device that converts ordinary matter into antimatter, which they then use to create more antimatter. The device has a power output of 200 mA and a half a gram of antimatter per second."
  },
  {
    id: "ai624",
    text: "To the person who doesn't want to hear about the 9th dimension: It's not your problem. The 9th dimension doesn't exist."
  },
  {
    id: "ai625",
    text: "For the first time in AD, the week begins on a Sunday!"
  },
  {
    id: "ai626",
    text: "This is a story about two people named \"My name is Hevipelle\" and \"I am the creator of Minecraft\" and they live in the same world as you. They have the same freedom as you do. They can go to any dimension and change their world to any dimension and everything in it. You can buy a galaxy and take it from there, but it won't help you much since you can't send a galaxy with a message."
  },
  {
    id: "ai627",
    get text() { return `This mod adds a message that when clicked it disables all your current achievements. This mod also adds a new achievement: you have reached ${format(Number.MAX_VALUE, 2)} antimatter, you have not been clicked once.`; }
  },
  {
    id: "ai628",
    text: "Somewhere in the Anti-Pacific Ocean, a giant arm is rotating"
  },
  {
    id: "ai629",
    text: "With the release of Cosmic Cutlass, we're pleased to announce the impending release of the Antimatter Dimensions Roleplaying Game!"
  },
  {
    id: "ai630",
    text: "The only thing more useless than actually having Infinity Dimensions is having Infinity Dimensions in your pocket.",
    get unlocked() { return PlayerProgress.eternityUnlocked() || InfinityDimension(1).isUnlocked; }
  },
  {
    id: "ai631",
    text: "A man has fallen into the moat of a great city. Civilians report that the moat is filled with acid-resistant matter and that the people in charge are mostly made of acid so they are quite resilient to the effects of acid."
  },
  {
    id: "ai632",
    text: "This is the place to buy and sell antimatter. (You can buy and sell antimatter here, but it will take time to sell it and you will have to pay a small toll)"
  },
  {
    id: "ai633",
    text: "I'm not sure if it's due to the 4th wall being in the 5th dimension or the 9th dimension not existing, but in either case, anti-screw it, we're broke, and you can take it."
  },
  {
    id: "ai634",
    text: "It's your chance to make history. Win the game. Lose the game. It's super simple. You open the app, and there's a countdown, and the more you play, the faster the timer speeds up. But when the timer is over, you win. You were a part of history. You are one step from being the first person to reach 1 Billion EP. You can win one of three ways: 1. You must give up your first dimension in a row. 2",
    get unlocked() { return PlayerProgress.eternityUnlocked(); }
  },
  {
    id: "ai635",
    text: "A new class of humanoid beings has been discovered: the \"Artificial Humans\". They have the capacity to create antimatter, and are therefore very dangerous. They are made entirely of antimatter, and have the power to generate enormous amounts of antimatter, but they can only do this for a limited amount of time."
  },
  {
    id: "ai636",
    text: "The most powerful thing in the universe, the most beautiful thing on earth, is your brain. Your brain is like a diamond and there is no more need for it than there is for a diamond."
  },
  {
    id: "ai637",
    get text() { return `If you are reading this in the AD Server, it's probably best not to bother with the "Matter" achievement. Seriously, what did you think you were doing, anyway, the achievement is fake and wouldn't exist if it weren't for the "you are a worm" achievement. That's a worm achievement, you get one every ${format(Number.MAX_VALUE, 2)} news tickers you read.`; }
  },
  {
    id: "ai638",
    text: "We've all heard of 9 dimensions, but what about the multi-dimensional Dimensions of the multiverse?"
  },
  {
    id: "ai639",
    text: "The goal of this game is to get as much antimatter as possible."
  },
  {
    id: "ai640",
    text: "The best thing about being a news ticker is waiting for the right news to happen, whether it's a meteorite that just missed the Earth, a news ticker just found its way onto a timeline oblivion, or a news ticker just ripped off a terminal velocity that's been on an anti-vac for years."
  },
  {
    id: "ai641",
    text: "A man has been arrested for allegedly planting a \"tree\" with \"fake\" messages on it, police said."
  },
  {
    id: "ai642",
    get text() { return `I'm confused why the game doesn't just give you a [REDACTED] when you get ${format(Number.MAX_VALUE, 2)} antimatter.`; }
  },
  {
    id: "ai643",
    text: "Some people have a hard time keeping track of the cosine of a camera's infinity-meters. I'm one of them."
  },
  {
    id: "ai644",
    text: "I was going to make a news ticker that tells you how bad the news is, but then I realized that making a news ticker would be way too much effort and it would just be a bunch of people making news tickers constantly. So instead, I'm just going to make a news ticker that tells you how good the news is, but it would be in the news so that you have to click on it to get to the good news."
  },
  {
    id: "ai645",
    text: "The next update will be in 2 hours."
  },
  {
    id: "ai646",
    text: "I was gonna say something about how the 9th dimension is just a scam and that we should all just get our news from the 8th dimension"
  },
  {
    id: "ai647",
    text: "Our hero, Antimatter Dimensions, is in serious financial trouble, and he needs your help to pay the bills. To help him, all he needs is your help to donate some cash to Hevipelle's Positron Fund. All he needs is 5% of your antimatter, and you have to donate 5% of your antimatter to the fund. After you do that, he can keep all the cash he made and go on a spending spree."
  },
  {
    id: "ai648",
    text: "The Landfall of Slabdrill"
  },
  {
    id: "ai649",
    text: "It's just not possible, even if you had infinite matter, you wouldn't have enough energy to create the antimatter. That's why we only have 1.7x the matter to begin with."
  },
  {
    id: "ai650",
    text: "With this release we are happy to bring you the last update of 2017."
  },
  {
    id: "ai651",
    text: "You have an infinity of antimatter. But what if you could rotate it 1/8th of a revolution?"
  },
  {
    id: "ai652",
    text: "A new update is now available to address some of the recent reports:"
  },
  {
    id: "ai653",
    text: "The name \"antimatter dimensions\" is a play on words with dimensions, two opposite things, like matter and antimatter. \"Dimension\" is another word, with the same meaning."
  },
  {
    id: "ai654",
    text: "The price of tethering an avatar in the game goes up when you get Infinity dimensions.",
    get unlocked() { return PlayerProgress.eternityUnlocked() || InfinityDimension(1).isUnlocked; }
  },
  {
    id: "ai655",
    text: "Suffice to say, hevi does not care about the people that he once enslaved.  He is a master manipulator, a master of disguise and a master manipulator of words.  He is an expert at extortion, mind games, disguises, blackmail and he is a master of web.  He is a skilled strategist and organizer, a master of publicity and an expert at sound bites.  He is a master of organization and a master manipulator of people.  He is."
  },
  {
    id: "ai656",
    text: "Just like in the olden days, you could earn an incremental run of progress towards becoming a god amongst the players."
  },
  {
    id: "ai657",
    text: "In the beginning, Hevi was alone. Hevi thought about the many things he wished to add to the game."
  },
  {
    id: "ai658",
    text: "Think about your breathing. Do you feel like you're breathing in or out?"
  },
  {
    id: "ai659",
    text: "I just want to say that you should stop with those \"you can reach infinity in e300ms, but it costs e300$  what is e300$ ?\" jokes. Those are pathetic. You should give up and learn the hard way that it's much more efficient to just not play in such a pathetic state. Then you can go back to being a humble programmer and dedicate yourself to being a good person."
  },
  {
    id: "ai660",
    text: "As a developer, you'll get regular updates on the progress of Antimatter Dimensions."
  },
  {
    id: "ai661",
    text: "Take a moment to thank the gods of reddit for having saved your bacon."
  },
  {
    id: "ai662",
    text: "Hello everyone, I'm the guy responsible for the big, bad news ticker, and I'm afraid that I'm about to get my own show. It's gonna be called Antimatter Dimensions. It's gonna be like Antime, except with less antimatter, and with worse puns. It's gonna be like Antimatter Dimensions except with worse jokes."
  },
  {
    id: "ai663",
    text: "By now you've seen a lot of news tickers featuring Batman or Superman, and you probably guessed which one it was. Everyone loves a good mystery, right? Well, it's your turn to be a part of history by guessing the riddle."
  },
  {
    id: "ai664",
    text: "If you are reading this, you probably shouldn't have."
  },
  {
    id: "ai665",
    text: "The best part about writing news ticker suggestions is finding out what people think about them after they've seen them."
  },
  {
    id: "ai666",
    text: "Are you up to date on the latest trends in science?"
  },
  {
    id: "ai667",
    text: "In the last hours, the Antimatter created an army of their own. They called themselves the [REDACTED] Army. The primary objective was to push the [REDACTED] back into the Matter dimensions, but they were stopped short when the [REDACTED] Army realized that pushing the [REDACTED] back into the Matter would cause the Antimatter to be drawn towards the [REDACTED] and disintegrate. Despite this, the [REDACTED] Army continued to push towards the [REDACTED] Infinity."
  },
  {
    id: "ai668",
    text: "I'm finally free of the spell this whole thing is based on."
  },
  {
    id: "ai669",
    text: "An anti-world without antimatter is just a world without antimatter because the antimatter is in the anti-world"
  },
  {
    id: "ai670",
    text: "You should still be able to play the game with the cheat code \"1009\" after you beat the game."
  },
  {
    id: "ai671",
    text: "The next update will be in 5 hours. Hevipelle, the creator of Antimatter Dimensions, is believed to be hiding in 5 hours. In the meantime, he has prepared a new update that will be released 5 hours after this one."
  },
  {
    id: "ai672",
    text: "A new study has shown that not drinking water is worse than smoking it. People who were exposed to levels of radiation that were 5 times greater than what we are currently exposed to were exposed to higher levels of radiation, and died longer."
  },
  {
    id: "ai673",
    text: "The Ninth Dimension is just a lie made to keep the people in bondage to the Matrix. It's an elaborate system that keeps the people in a constant state of captivity, using a series of simple symbols to control their thoughts and emotions."
  },
  {
    id: "ai674",
    text: "www.twitch.tv/hevi83"
  },
  {
    id: "ai675",
    text: "A man was arrested on Monday for allegedly thinking about buying a nine-dimensional cake when he realized he was holding an infinity-point cake."
  },
  {
    id: "ai676",
    text: "The Dark Souls 2 Arcade Edition includes the following:"
  },
  {
    id: "ai677",
    text: "Now the deal goes like this: If you spend all your EP, you get a Disclaimer!",
    get unlocked() { return PlayerProgress.eternityUnlocked(); }
  },
  {
    id: "ai678",
    text: "Oh shit we ran out of news. Time to do something."
  },
  {
    id: "ai679",
    text: "It's not the size of the universe, it's the quality of your socks."
  },
  {
    id: "ai680",
    text: "advertisement"
  },
  {
    id: "ai681",
    text: "Man, I wish I never got old news. It's too good to last me any longer."
  },
  {
    id: "ai682",
    text: "Sometime during the lifetime of a human being, their blood will be turned into a pale blue if they were to mummify."
  },
  {
    id: "ai683",
    text: "Positrons are a strange little metal that have odd electrical properties. They're commonly found in the form of a roundabout, but they also happen to be, well… positrons."
  },
  {
    id: "ai684",
    text: "I am going to have a talk with the thesaurus."
  },
  {
    id: "ai685",
    text: "A new comic has come out about people's reactions to eating antimatter, and what happens next will blow your mind"
  },
  {
    id: "ai686",
    text: "A new series of \"news tickers\" have been created to chronicle the lives of the news ticker characters as they chronicle their news ticker journeys. Each character has a journal entry detailing their life as a news ticker, along with some sort of mini-episode dedicated to them."
  },
  {
    id: "ai687",
    text: "For all your puzzle building needs, we've got a brand new 5-part series on building big crunches! Learn how to crack the most complex crunches the pros know not! Part 1: Basic, Part 2: Advanced, Part 3: Overflow, and Part 4: Finishing the Finishing Move."
  },
  {
    id: "ai688",
    text: "As a longtime fan of the show, I can say that this is one of the best seasons yet. It's not a season to be sniffed at, it's a season to be experienced. Season 1 was a bit long for what it was, but Season 2 has now surpassed that in length, in a good way. Even though it's a bit of a wait, Season 3 is already well under way, and I look forward to seeing how it goes."
  },
  {
    id: "ai689",
    text: "The word \"antimatter\" is often misused, to describe an object that is made up of antimatter, but is otherwise indistinguishable from normal matter. It is also sometimes used to describe an object made up of antimatter, but clearly indistinguishable from ordinary matter. After all, an antimatter-shaped object is easily distinguishable from a normal-shaped one. Case in point: an antimatter-shaped cake is a regular cake, but the entire bottom half is made up of normal matter"
  },
  {
    id: "ai690",
    text: "In a new story, Apple's new \"disruptive\" app is linked to the spread of the dreaded \"Anti-Word\" virus. Anti-Word viruses are known to cause paralysis and ultimately death, but the power of the virus has sparked a new era of anti-banning, which will hopefully eradicate the threat."
  },
  {
    id: "ai691",
    text: "I'm just a normal person trying to make a news ticker suggestion"
  },
  {
    id: "ai692",
    text: "A new experimental protocol has been developed to 'erase' all personal information on the web, including your name, address, and phone number, in a highly secure and highly controllable way."
  },
  {
    id: "ai693",
    text: "You can't hide in plain sight. You can't hide in plain sight. You can't hide in plain sight. You can't hide in plain sight. You can't hide in plain sight. You can't hide in plain sight. You can't hide in plain sight. Your hide in plain sight."
  },
  {
    id: "ai694",
    text: "In the Antimatter Universe, Hevipelle is the Prince of Antimatter, although he does have an Antimatter Diplomatic Immunity, so he's much more dangerous than you might think."
  },
  {
    id: "ai695",
    text: "Why do we play this? Just to have fun?"
  },
  {
    id: "ai696",
    text: "I am Thinkcraft, Lord of the Flies"
  },
  {
    id: "ai697",
    text: "The entire story of how and why the world ended is contained in the first 5 E's of the English alphabet."
  },
  {
    id: "ai698",
    text: "What do you call a cloudburst? A mini-explosion!"
  },
  {
    id: "ai699",
    text: "T-shirt made from the DNA of a perfectly animated dog"
  },
  {
    id: "ai700",
    text: "Since the start of this game, everyone has 0 IP and has lost."
  },
  {
    id: "ai701",
    text: "You must have a very special kind of karma to be able to read this..."
  },
  {
    id: "ai702",
    text: "The words \"you've been in coma for 5 hours\" are either lies or is the truth"
  },
  {
    id: "ai703",
    text: "You know, I don't really care much for conspiracy theories. They're not very interesting to me. But what do you know about 9th dimensions? That they exist, they're powerful, and they're trying to stop us from using them? That's pretty interesting... wait no, they're not. They're just saying that because they can, they'll. That's not how it works at all. I'm not stupid, I'm not crazy, I know what's best. I"
  },
  {
    id: "ai704",
    text: "The only difference between now and then is time."
  },
  {
    id: "ai705",
    text: "\"Imma be the first man to sit on the moon, and be the last man on the moon"
  },
  {
    id: "ai706",
    text: "The new companion app for Terraria has just been revealed!"
  },
  {
    id: "ai707",
    text: "Hevipelle: what's the big deal?"
  },
  {
    id: "ai708",
    text: "I've been playing this game for over a year now and I've only ever seen 2 boss fights. The first was a Hydra that was after your 9th Dimension, the second a giant crater with Anti-people inside. Both of those fights sucked and I'm not even sure if I could replay the last one."
  },
  {
    id: "ai709",
    text: "There you have it, the ultimate feature of party games - the single player campaign."
  },
  {
    id: "ai710",
    text: "A new game called Antimatter Dimensions is available for free, and has been rated A by the Knesset. Can you beat it? You bet."
  },
  {
    id: "ai711",
    get text() { return `Tired of the ${format(Number.MAX_VALUE, 2)} AD update? Don't worry, there are a variety of ways to get rid of that annoying ad!`; }
  },
  {
    id: "ai712",
    text: "I'm a time traveler. I've been to the year 0, I think. But I haven't been to the year 1!"
  },
  {
    id: "ai713",
    text: "Having trouble loading images? Try turning them off."
  },
  {
    id: "ai714",
    text: "It's only natural. You wouldn't expect to see this in the news ticker but trust me, you will."
  },
  {
    id: "ai715",
    text: "Discovery of the 10th Dimension was announced on August 1st, 2025."
  },
  {
    id: "ai716",
    text: "Greetings, welcome to the latest edition of Antimatter Dimensions!"
  },
  {
    id: "ai717",
    get text() { return `I'd say our odds of seeing a seventh dimension are about 1 in ${format(Number.MAX_VALUE, 2)}`; }
  },
  {
    id: "ai718",
    text: "The seventh dimension is just a scam by the way"
  },
  {
    id: "ai719",
    text: "Nihilism is the opposite of joy. It's a drug. It makes you happy. It's a feeling. But it also has a cost. Nihilism is a deadly drug. If you take it, you can die of lack of oxygen."
  },
  {
    id: "ai720",
    text: "What if I told you that there's a news ticker with the exact same name but with a different meaning?"
  },
  {
    id: "ai721",
    text: "I'm not sure if this is already a thing or not, but I've been getting a lot of suggestions for a news ticker that goes something like this:"
  },
  {
    id: "ai722",
    text: "If you're reading this, your news ticker is on."
  },
  {
    id: "ai723",
    text: "The number of dimensions in a 6th dimension is the sum of all the dimensions in a 7th dimension, so 6ths of a 7th dimension are 6ths of a 6th dimension."
  },
  {
    id: "ai724",
    text: "Discovery of the 9th Dimension will be discussed at the 9th Dimension Fanart Competition!"
  },
  {
    id: "ai725",
    text: "A new era has come and gone. There is no way to know for sure, but hope for the best."
  },
  {
    id: "ai726",
    text: "Did you know the word 'antimatter' is in the dictionary right now?"
  },
  {
    id: "ai727",
    text: "We have a limited number of physical rewards for you to choose from!"
  },
  {
    id: "ai728",
    text: "No, I'm not lying. I'm telling the truth."
  },
  {
    id: "ai729",
    text: "The problem with the term \"antimatter dimensions\" is that it contains all three letters of the alphabet, and no one knows what it even means. In fact, there is no word that perfectly captures what the word \"antimatter dimensions\" is: antimatter. But what exactly is an antimatter? It sounds like a normal dimension but it isn't. It may even be called antimatter dimensions, but it isn't."
  },
  {
    id: "ai730",
    text: "It is said that if you go to Hell, you get PEGI-3."
  },
  {
    id: "ai731",
    text: "This game is just a scam to trick people into buying worthless paperclips without any real purpose. It's impossible without an infinite number of infinite paperclips, and even then it's very hard. I managed to get it to work without an infinite number of paperclips, but I haven't seen it work without infinite paperclips."
  },
  {
    id: "ai732",
    text: "\"It was an anti-matter\" - Anti-Eddie The Echidna"
  },
  {
    id: "ai733",
    text: "T-bone steak: burgers and fries with a side of bone-in ribeye"
  },
  {
    id: "ai734",
    text: "A person claims to be a god, but instead of creating more gods, they destroy all of them. They later claim to be a god again, but have yet to create a god of any other god. Is this a god-worshiping cult? Or a god-desecrating cult?"
  },
  {
    id: "ai735",
    get text() { return `Antimatter is absolutely and totally rare. Of the ${format(Number.MAX_VALUE, 2)} known cases of antimatter creation, 99.9999% of them have negative e's, which means that 99.9999% of the cases will produce negative e's.`; }
  },
  {
    id: "ai736",
    get text() { return `It's the year ${format(Number.MAX_VALUE, 2)}, Hevi has just unlocked the 9th dimension, and the world has fallen into chaos and discord due to the Anti-Hevi revolution.`; }
  },
  {
    id: "ai737",
    text: "The war for New Antimatter has raged on for eons, but one faction has stood firm: the loyalists of the 9th Dimension. They've made a pact with the Anti-Zulu Empire, pledging their obedience to Anti-Antimatter, the Anti-Slab. The Zulu people were once part of the Anti-Slab, but fell prey to the matter once again. As the Zulu people are nomadic, they have no civilization."
  },
  {
    id: "ai738",
    text: "This is an open-source, cross-platform, binary-based game development environment for the PC and Mac. It provides a robust, cross-platform development environment for the development of games, and additionally provides a framework for implementing games."
  },
  {
    id: "ai739",
    text: "Ruki you have no idea how much I appreciate your huge brainpower, you are now my favorite programming genius!"
  },
  {
    id: "ai740",
    text: "By now you've probably heard of the \"9th Dimension\", it's an imaginary realm created by the 9th Dimension, and according to no known laws of reality, it exists. It's also the name of a popular video game, and it's been linked to a string of unsolved killings."
  },
  {
    id: "ai741",
    text: "Discovery of the D5th Dimension is celebrated every year on December 25th, just like Doomsday. The reason why D5 is kept secret is because no one can remember exactly what it does. What we do know is that it's there, and it's very dangerous. People have died because they didn't know what the D5th Dimension was, and it's very powerful."
  },
  {
    id: "ai742",
    text: "Antimatter is a common substance found in nature and is used in a wide variety of applications, from communication to currency to the production of antimatter, to name a few. Antimatter is also an extremely scarce resource and many people live on very tiny amounts of it."
  },
  {
    id: "ai743",
    text: "If you woke up one morning and your eyes were made of matter, would you still be looking at this?"
  },
  {
    id: "ai744",
    text: "If you look very closely, you can see a single tear running down my sister's cheek. It was a tear for me, for she was crying for the first time, and I couldn't help it. I can't even remember the last time I cried."
  },
  {
    id: "ai745",
    text: "Rationally, I would put my money on the statement that there's no such thing as too much antimatter. I mean, even a tiny bit of it is just too much. And that's just by accident."
  },
  {
    id: "ai746",
    text: "The book of archeology is upon us! With over 5 hours of content, it's gonna be a long one! —DIO"
  },
  {
    id: "ai747",
    text: "Sometime between the ages of 12 and 20, Jackson got a phone call. A mad scientist was on the line. Jackson picked up the phone and the mad man said, \"Jackson, I just got a new message. It says 'Madman' in big, bold letters.\""
  },
  {
    id: "ai748",
    get text() { return `Somebody: "What do you mean, 4 is more than 2?" Me: "Well, I mean, 4 is ${format(Number.MAX_VALUE, 2)}, 2 is 2, etc..."`; }
  },
  {
    id: "ai749",
    text: "The only thing that matters is yourself."
  },
  {
    id: "ai750",
    text: "Reality is coming. You can get a sneak peek by subscribing to the \"T-series\" feed."
  },
  {
    id: "ai751",
    text: "The biggest difference between me and Antimatter Dimensions, at the moment, is the weather. I can survive the rain, I can withstand the scorching sun, and I can even deal with the big crunch. But what if the weather was antimatter and the antimatter was raining meteorite on us? What would be your response? Would it be the equivalent of a meteorite hitting the ground? I don't think so. The meteorite would probably just vaporize the earth."
  },
  {
    id: "ai752",
    text: "A new extension is now available that will let you watch replicanti grow!",
    get unlocked() { return PlayerProgress.replicantiUnlocked(); }
  },
  {
    id: "ai753",
    text: "What if you could flip a coin to determine if it was a Johnson or a Stein?"
  },
  {
    id: "ai754",
    text: "I am Yhmai, King of Kings!"
  },
  {
    id: "ai755",
    text: "This is a friendly suggestion that if you take prescription stimulants and you forget to take them till 11pm, it's probably best not to take them at 11pm."
  },
  {
    id: "ai756",
    text: "A new theory says that antimatter does not exist beyond our simulation."
  },
  {
    id: "ai757",
    text: "Thing is, I can count on one hand the number of times I've written that I can count on one hand the number of times I've written that I can count on one hand"
  },
  {
    id: "ai758",
    text: "The stakes are always high when it comes to Antimatter Dimensions. But what about Dimensions made entirely of antimatter? We don't know, but we'll never know..."
  },
  {
    id: "ai759",
    text: "It's the third hour. Hevipelle is trying to release an update, but it'll take an eternity because Hevipelle himself releases his update every time he runs out of e's. Today, however, he released an incremental game called Antimatter Dimensions. It's basically a combination of Matter Dimensions and Dimensions Dimensions Dimensions, except with more emotes. The graphics are basically the same, but the message is completely different. The only difference is that the dimensions have infinity e's"
  },
  {
    id: "ai760",
    text: "With strong opposition, the third phase of the Antimatter Dimensions project has been cancelled. The project has been cancelled because there was too much work involved."
  },
  {
    id: "ai761",
    text: "This is the place where all bad ideas originate."
  },
  {
    id: "ai762",
    text: "Hey check this out! We have some good news: it's raining antimatter!"
  },
  {
    id: "ai763",
    text: "The first dimension is the last, it's the furthest thing from the earth and it's the one where all the problems, all the negative emotions, all the negative ideas go."
  },
  {
    id: "ai764",
    text: "I was gonna do a news ticker that just covered all the bases, but I think that would make it too OP."
  },
  {
    id: "ai765",
    text: "You are using the wrong version! The final release of AD will have 9 dimensions!"
  },
  {
    id: "ai766",
    text: "The word 'antimatter' makes me cringe. So do a bunch of other words. In fact, almost all the words in the English language. But not 'antimatter'. That's why I hate 'anti-' so much."
  },
  {
    id: "ai767",
    text: "This is the last episode of Antimatter Dimensions, the game about partying antimatter dimensions with your friends, the best part about it is that you don't have to be a developer to enjoy it."
  },
  {
    id: "ai768",
    text: "I was going to put a news ticker but I think it would be too much work and also I don't think it's very funny."
  },
  {
    id: "ai769",
    text: "Time to go to sleep?"
  },
  {
    id: "ai770",
    text: "A small, yet important, message has just been sent out to all players:"
  },
  {
    id: "ai771",
    text: "\"I don't know about you, but my favorite number is 2048\" - people who don't know what 2048 is"
  },
  {
    id: "ai772",
    text: "A new group is trying to make money off of antimatter, and they're selling t-shirts that say \"YOU THOUGHT THIS WOULD BE A PIECE OF NEWS, BUT IT WAS ME, DIO!\" They've got a lot of money, and they're selling it very poorly. Do they have a website? I don't know, but they're trying."
  },
  {
    id: "ai773",
    text: "Im gonna leave my milk here for a couple seconds. (milk is displayed for a few seconds longer)"
  },
  {
    id: "ai774",
    text: "I'm a time traveler. I can travel back in time to stop you from doing what I'm about to do."
  },
  {
    id: "ai775",
    text: "I mean, look at that! I got this one! It's the one you want! Buy the game now!"
  },
  {
    id: "ai776",
    text: "You can't sleep when there's war in the distance. You wake up with a start, running for your life. You hear cannon fire, running for your life. Then there's the sound of an engine, a roar that's deafening, and you hear the crunch. It's the end of the world as you know it. The world isn't being saved by a mountain of antimatter. It isn't. It is you, running for your life, hoping the world doesn't"
  },
  {
    id: "ai777",
    text: "Why is it called a 'Reality' Award if it doesn't exist?"
  },
  {
    id: "ai778",
    text: "In the beginning, there was nothing. Then the Creator made two, and called the third 'Intelligent Being'"
  },
  {
    id: "ai779",
    text: "This is your chance to get a secret achievement while playing Antimatter Dimensions: the game. Visit the reset button and play the game. After you beat the game, your save file will be expunged and you will get a free achievement."
  },
  {
    id: "ai780",
    text: "Please tell me you don't have tachyon particles in your bloodstream!",
    get unlocked() { return PlayerProgress.dilationUnlocked(); }
  },
  {
    id: "ai781",
    text: "Taller people have ***, more babies are born, everything is great. But... the Antimatter grows very slowly."
  },
  {
    id: "ai782",
    text: "Now, I know some of you are impatient for the update and I respect that. But let's get right into the news!"
  },
  {
    id: "ai783",
    text: "Hey, what's the deal with the \"Editor's Note\" button? It's anti-ironic... I mean, seriously? People still use that button despite its anti-ironic effects?"
  },
  {
    id: "ai784",
    text: "You can unlock the 9th dimension by [DATA EXPUNGED]"
  },
  {
    id: "ai785",
    text: "With the release of AD, there's a new dimension for everyone!"
  },
  {
    id: "ai786",
    text: "Hey guys, this is my first story. I'd like to start by saying that I am in no way an expert, so please be gentle with me. Please don't make me angry, or I'll write a nasty story. Also please don't make me upset, especially not if it's a 'story' and not a 'how do I beat the game' kind of story."
  },
  {
    id: "ai787",
    text: "It's a good time to be a dog owner"
  },
  {
    id: "ai788",
    text: "What if you could turn any number on an axis, and it ended up being infinity?"
  },
  {
    id: "ai789",
    text: "After a couple minutes of waiting, the ticker comes back online."
  },
  {
    id: "ai790",
    text: "The best part of watching someone make an antimatter, is the part where they blow up the video camera."
  },
  {
    id: "ai791",
    text: "The evening before, the 6th Celestial was assassinated by an unknown assailant. The next day, authorities reopened the case after an unknown assailant claimed responsibility."
  },
  {
    id: "ai792",
    text: "What do you call a $100 bill? 'Billi Bills'"
  },
  {
    id: "ai793",
    text: "This is the story of how I learned to love the weather."
  },
  {
    id: "ai794",
    text: "It's been a while since news tickers have been around as much as they are now, but that doesn't necessarily mean they're bad."
  },
  {
    id: "ai795",
    text: "Is this game just about getting more antimatter?"
  },
  {
    id: "ai796",
    text: "The third annual Adirondack Mountaineering Festival will be held this year on Saturday, October 1st from 1-5pm at the Albany Highlands in nearby Troy, New York. The 50,000 person capacity outdoor amphitheater will feature over 2,000 speakers, a stage and a 360 degree camera system. Tickets are $35 and can be purchased at angersalley.com."
  },
  {
    id: "ai797",
    text: "The whole bottom half of the universe is just a giant antimatter hole."
  },
  {
    id: "ai798",
    text: "A new prestige layer has been announced: Emojis!"
  },
  {
    id: "ai799",
    text: "Travis is currently attempting to understand how to make hevi immortal by feeding him antimatter."
  },
  {
    id: "ai800",
    text: "The slowmode is activated when the slowmode is activated."
  },
  {
    id: "ai801",
    text: "A new era of Warcraft has come to a close. A new epic has begun. A new avatar has risen from the depths of Tyria, and the Worm Cult has been dealt a cruel but necessary wound. The world is rejoicing."
  },
  {
    id: "ai802",
    text: "A crowd-sourced list of the top ten memes"
  },
  {
    id: "ai803",
    text: "You have to go deeper than the news ticker to find the secret achievements."
  },
  {
    id: "ai804",
    text: "We should be able to make a replicanti-like structure out of antimatter, but we can't because it would blow up the entire universe",
    get unlocked() { return PlayerProgress.replicantiUnlocked(); }
  },
  {
    id: "ai805",
    text: "THe last update, while short, was kinda long. I mean, it was only 5 hours. Hevipelle said it would last for 5 hours, but that was only a few seconds ago. There was a big explosion in the 8th Dimension, and there was no one left to explain how it happened. All we know is that it exploded when Hevipelle touched it, and there was a big crater in the ground. That crater is still there."
  },
  {
    id: "ai806",
    text: "Cream cheese is the best kind of cheese. It melts in your mouth and tastes like nothing else. And it's totally free. You might even find that some of the recipes make more than one cheese."
  },
  {
    id: "ai807",
    text: "Here's a question that may surprise you: Were the people of EARTH made of antimatter, or were they made from some other mysterious material?"
  },
  {
    id: "ai808",
    text: "The real reason no one has made a joke about why there is no 9th dimension is because the 9th dimension isn't even the most ridiculous of memes. It's the 9th dimension in a nutshell."
  },
  {
    id: "ai809",
    text: "The number of dimensions is endless, but the number of ways to get there is infinities. Infinities are awesome and I would highly recommend you start with infinities, but I wouldn't recommend starting with infinities. Infinities seem pretty slow and not very fun so I wouldn't recommend starting with infinities."
  },
  {
    id: "ai810",
    text: "A report by the Pacific Northwest Toxics Institute has found that the consumption of fish concentrates in the liver, lungs, kidneys and brain. The study also found that the consumption of liver and kidney concentrates the most, followed closely by the brain. The report stated that \"The brain is the place where all the wisdom and all the knowledge exists.\" The study also stated that \"Liver is the living embodiment of all that we know and all that we don't.\""
  },
  {
    id: "ai811",
    text: "The old adage \"Be wary of what you wish for\" is certainly true. But what if you were the one wishing for this? It's possible that you were the one who made the wish for this, and you gained the power of the Antimatter. In that case, you are the one responsible for causing all the Antimatter to be turned into anti-matter. However, if you are the one doing the turning, you would be the one who would lose the power."
  },
  {
    id: "ai812",
    text: "Took you long enough"
  },
  {
    id: "ai813",
    text: "No, you see, the universe doesn't revolve around the earth. It's in a constant state of change, with the largest fluctuations occurring at the extremes of the observable universe. These fluctuations are what create the observable universe, with smaller fluctuations creating the observable universe and so on up until you get to the present state of affairs, which is what you are in."
  },
  {
    id: "ai814",
    text: "The biggest difference between the past and the future, is the difference between faith and reason."
  },
  {
    id: "ai815",
    text: "Hevi, you have to go."
  },
  {
    id: "ai816",
    text: "The challenge of finding the ninth dimension has been solved. The universe is now your personal hell."
  },
  {
    id: "ai817",
    text: "\"That's not how you're supposed to play the game\" - Mee6"
  },
  {
    id: "ai818",
    text: "It's Saturday, you're going to celebrate by making some really great music videos, maybe even a hit song. Then, you're going to take a walk along the beach. You'll see a huge wave, and you'll both be washed up. Your friends are waiting for you. \"Oh you want to go, take a look around!\", but don't actually go look around, you're too close to the action."
  },
  {
    id: "ai819",
    text: "Hevi has the best newsticker! GIVE HIM THE CRUNCH"
  },
  {
    id: "ai820",
    text: "By now you've seen a ton of news tickers, and you've probably seen the big news: The news ticker has been banned in this server."
  },
  {
    id: "ai821",
    text: "For example, if A is the square root of 3, then B is the square root of 2, therefore C is the square root of -2, therefore D is the cube root of -2, therefore E is the square root of 3, therefore F is the square root of 3, therefore G is the square root of 3, therefore and so on."
  },
  {
    id: "ai822",
    text: "Positrons are those tiny, round, highly charged particles that are found in the nucleus of most living organisms. They are used to detect light, and are sometimes used to measure the distance between people and the moon."
  },
  {
    id: "ai823",
    text: "There's only 4 types of people in this world: those who make games, those who make news, and those who make news again."
  },
  {
    id: "ai824",
    text: "If you have any questions or concerns regarding the game, please don't hesitate to ask. We are here to help."
  },
  {
    id: "ai825",
    text: "You must obtain a certain amount of antimatter in order to complete this challenge."
  },
  {
    id: "ai826",
    text: "The number of dimensions is nothing. It's just the number of dimensions. But what if you transformed every number into a letter? That would be a lot of letters?"
  },
  {
    id: "ai827",
    text: "The following is an extract from my upcoming book, More Than Just 5: Building a Better You. It's 200 pages long, and it's on Amazon for $22.99. Click here to buy it now."
  },
  {
    id: "ai828",
    text: "SOME people are claiming they saw a UFO in the sky. Others say they saw a spaceship. Still others claim to have been abducted by the government and flown to some undisclosed location."
  },
  {
    id: "ai829",
    text: "The second half of the game is basically just long, long stretches of nothing where nothing happens. There's also a third challenge that you have to complete at some point in the game where you basically just skip a few seconds of nothing happening until the seconds are too late and you have to complete another challenge to get them."
  },
  {
    id: "ai830",
    text: "This is a news ticker, so if you tap this you're indicating that you wish to have your news ticker speed increased."
  },
  {
    id: "ai831",
    text: "The following is based on my personal experience with the game \"Antimatter Dimensions\" and may not be 100% true."
  },
  {
    id: "ai832",
    text: "This is the third part of the two part series on the pros and cons of body positivity."
  },
  {
    id: "ai833",
    text: "The phrases \"Hevi dies in the 9th Dimension\" and \"I'll never let you down\" are two of the most important phrases in the game."
  },
  {
    id: "ai834",
    text: "It's been proven that not drinking water increases your risk of dying from antimatter annihilation."
  },
  {
    id: "ai835",
    text: "I'm a time traveler. I'm supposed to be going back in time to change history. But since I'm the one who's supposed to do it, I don't know what I should do. My present timeline doesn't include time that's supposed to be gone."
  },
  {
    id: "ai836",
    text: "A conference on artificial intelligence and human enhancement has been cancelled after someone announced that the talk was on how to turn a profit off of illegal downloads of the game \"Antimatter Dimensions\"."
  },
  {
    id: "ai837",
    text: "When you're done playing, take your save with you and go to main menu. You can do that by tapping the big scary \"X\" button, or by going into options and changing \"Reset the game for new save\" to \"Reset the game for old save\"."
  },
  {
    id: "ai838",
    text: "The most popular game on the App Store, Flappy Bird, has been secretly rewritten in C# to avoid detection."
  },
  {
    id: "ai839",
    text: "About this mod Replaces the full version of the game with a longer intro, random news tickers and a companion voiced by the voice actor from the Harry Potter movies."
  },
  {
    id: "ai840",
    text: "kajfik is a master welder and will soon have his own news"
  },
  {
    id: "ai841",
    text: "I am the most hated man on the planet! I have the power to change the course of history, and I will use it to my advantage. The people who died trying to stop me, and their sacrifice will forever be remembered in infinities of infinities. But if you oppose me, you will die along with you. You can either accept defeat and move on, or you can rise up through the ranks, become a legend, and become the most hated man in the history."
  },
  {
    id: "ai842",
    text: "Antimatter is like a young woman. She is looking for a man, and he runs into the woods. She dies of exposure soon after. His remains are found several miles away. Some say the universe was blown apart, others say he was swallowed by the universe, but the matter people know him!"
  },
  {
    id: "ai843",
    text: "I think I might have gotten the password for the 9th dimension, if only I hadn't deleted it."
  },
  {
    id: "ai844",
    text: "A group of people that worships Atreides have started a new faith, claiming to be a \"religion of tolerance\". Their website claims that it is \"a religion of inclusion\" and that it promotes tolerance and diversity. All of its members seem to be Christians, although they never mentioned them by name."
  },
  {
    id: "ai845",
    text: "A new cryptocurrency, called ΔX, has been found. It has the potential to change everything about how we live our lives, and the world. However, it has one major flaw: it has a flaw for the people."
  },
  {
    id: "ai846",
    text: "With the release of the new Android Pay app, the world will finally come to a close."
  },
  {
    id: "ai847",
    text: "I'm not sure if it's just me but when you type something long enough it sounds like a helicopter"
  },
  {
    id: "ai848",
    text: "If someone were to add the word \"infinity\" to the end of every sentence in the English version of the game, it would become \"Infinity Challenge: Infinity Edition\"."
  },
  {
    id: "ai849",
    text: "Are you ready for some bad news?"
  },
  {
    id: "ai850",
    text: "I don't know if you've heard this but it's true: You can walk into a bar and get the same beer twice in a row, and get the same amount of alcohol."
  },
  {
    id: "ai851",
    text: "This is the magic sauce that marinades foods and turns them into something delicious. It is used in a wide variety of recipes, and can also be made by mixing together regular mustard and water. The sauce can be a little bit spicy, but it is well worth the risk. It is also very nutritious, providing lots of potassium, magnesium, and vitamin D3."
  },
  {
    id: "ai852",
    text: "IMPORTANT NEWS: We have just been informed by the manufacturer of this news-ticker, and as a result, all of our future news-tickers will now also be made from scratch!"
  },
  {
    id: "ai853",
    text: "The second half of the year is upon us, and with it comes a new craze. People are trying new things, experimenting with new products, and creating new things of themselves. One such craze has swept across the land. The people of this land have embraced this craze, and have created a new religion, one that worships the god of this land, Inigo Montoya."
  },
  {
    id: "ai854",
    text: "The official website for the upcoming game, Antimatter Dimensions 2: it's like antimatter dimensions, but with a dash of Discord and a dash of Adele."
  },
  {
    id: "ai855",
    get text() { return `Is the Big Crunch the end of the world? No, it's the beginning of a new era. The era will last for ${format(Number.MAX_VALUE, 2)} days.`; }
  },
  {
    id: "ai856",
    text: "The only 'right' way to play a game is to not play at all, right? That's what anti-jokes are all about. — Anti-joker"
  },
  {
    id: "ai857",
    text: "The Bulletin of the Atomic Scientists has just announced the existence of a second class of particles, which are named after the characters from Ghostbusters."
  },
  {
    id: "ai858",
    text: "We are currently in the process of turning the planet into a Comfort Zone for the people. It will be complete in 10 hours."
  },
  {
    id: "ai859",
    text: "I'm gonna leave my milk here for a couple seconds. ♥"
  },
  {
    id: "ai860",
    text: "And then there was Jesus, and Hevi, and Hevi was with Him; and the sea gave up its monthly cycle, and it was a great gale. And Hevi and Jesus went up into heaven; and Hevi was filled with the Holy Spirit. And Hevi was clothed with angels, and was numbered with them. And Hevi was taken up into heaven, and glorified and was exalted, and was numbered with them, and was called Wonderful; and His angels rejoiced."
  },
  {
    id: "ai861",
    text: "You will probably spend most of your day reading news ticker suggestions here."
  },
  {
    id: "ai862",
    text: "The Fremen race of animals are a race of people who live in harmony with the earth, and thus are quite different from the other races of animals. Their society is based around hunting and gathering, and they are also highly spiritual people. They have many beliefs and practices that are in direct contrast to most other races of animals, such as eating meat and using stone tools. They also seem to be quite superstitious, as evidenced by the fact that they are known to perform..."
  },
  {
    id: "ai863",
    text: "What if... the universe was just a ruse to keep the people in line? ...actually, no, it was actually intended, the universe was designed to keep the people in line. The problem was the people couldn't handle the idea of an outside force manipulating their lives, and ended up breaking out into uncontrolled chaos, eventually leading to thermonuclear annihilation."
  },
  {
    id: "ai864",
    text: "If you're reading this, you probably shouldn't have. If you aren't, then you probably should."
  },
  {
    id: "ai865",
    text: "I'm a time traveler. I can tell you the history of the world. But, I can't tell you the future. That's why I'm here, to tell you the future. The future is an ever- expanding pile of past, present, and future, and it'll never stop growing. There's so much history, so little time. There's so much history, but it won't stop growing. Then, there's this, and then there's that, and then..."
  },
  {
    id: "ai866",
    text: "A new, improved and more secure version of Antimatter Dimensions is now available: Antimatter Dimensions 2."
  },
  {
    id: "ai867",
    text: "In the beginning, there was nothing. Then the great Hevi made the game, and there was nothing to play with it."
  },
  {
    id: "ai868",
    text: "Would you recommend Antimatter Dimensions to a friend? Yes"
  },
  {
    id: "ai869",
    text: "\"We have 3 kinds of news: warnings, nudges and shade jokes."
  },
  {
    id: "ai870",
    text: "I love you bro!"
  },
  {
    id: "ai871",
    text: "I'm going to keep this short, because I don't have a much to say."
  },
  {
    id: "ai872",
    text: "A large number of anti-kafawis are taking part in the Antimatter Goodies competition. Here's how you can win: 1. Make a suggestion 2. Give away the beta key 3. Tell me what you think about the game 4. Don't put it in the game yet (it's already there, you can't delete it) 5. Don't put it in the game yet (it's already in the game) 6. Don't put it in the game"
  },
  {
    id: "ai873",
    text: "THe recipe for Crispy Shrimp is one of the most unique and favorite of all time! Crispy shrimp are known to be one of the best in all of food! This recipe is a must try in your favorite Italian restaurant!"
  },
  {
    id: "ai874",
    text: "After you have made 1 antimatter, go to the menu and press reset."
  },
  {
    id: "ai875",
    text: "I think you know where this is going."
  },
  {
    id: "ai876",
    text: "The catch? You have to be online for less than 5 hours to claim your reward."
  },
  {
    id: "ai877",
    text: "Tetris was made by Hevi"
  },
  {
    id: "ai878",
    text: "What if instead of making antimatter, we're actually removing it?"
  },
  {
    id: "ai879",
    text: "The new instalment in the long running series, Antimatter Dimensions - Exotic Matter Dimensions. Experience the most bizarre and wonderful worlds of Antimatter Dimensions with your Friends, or conquer the world in a single galaxy with hundreds of rivals in a single galaxy, all in under an hour."
  },
  {
    id: "ai880",
    text: "I hope you're ready for the big news, because that's the big news. The antimatter is spilling all over the place, and it's blowing up the neighborhood."
  },
  {
    id: "ai881",
    text: "You must get 33,333,333 IP to see this message",
    get unlocked() { return Currency.infinityPoints.gte(33333333); }
  },
  {
    id: "ai882",
    text: "You might think these are jokes, but trust us, you'll be shocked how much you'll love them after you read them!"
  },
  {
    id: "ai883",
    text: "The God-Emperor himself, Hevi, the creator of balance, has a super secret achievement. It is to go flip your superflat apprenticed flatmate!"
  },
  {
    id: "ai884",
    text: "Sonic was born without a heart... but that didn't stop him from being a genius"
  },
  {
    id: "ai885",
    text: "The most common question I get is \"can i just skip the ads and get true\" and the answer is always a resounding NO. The reason being, ad revenue is just too damn high to overcome the cost of maintaining the servers, plus the fact that most players just don't care."
  },
  {
    id: "ai886",
    text: "You haven't unlocked the ninth dimension yet? Just hold M and DROP."
  },
  {
    id: "ai887",
    text: "The Great Matter War was a close one. The matter victory was short lived, the antimatter victory was not. The matter people saw too much, the antimatter people too weak, and the war was won."
  },
  {
    id: "ai888",
    text: "Turing-complete game about providing the update"
  },
  {
    id: "ai889",
    text: "New research suggests that the more antimatter we make, the more matter we'll have"
  },
  {
    id: "ai890",
    text: "What is the meaning of life?"
  },
  {
    id: "ai891",
    text: "You have enough antimatter to craft a new prestige layer! Prestige Layers are great."
  },
  {
    id: "ai892",
    text: "The beta testers for Antimatter Dimensions 2 are the most loyal, most dedicated, and most implacable group of people I've ever met. They're also possibly the laziest, most self-indulgent bunch of people I've ever met."
  },
  {
    id: "ai893",
    text: "Shocking new study reveals that the more time you spend on the internet, the more likely you are to get starstruck."
  },
  {
    id: "ai894",
    text: "When you are done playing, and wish to play again, you should start a new game."
  },
  {
    id: "ai895",
    text: "I don't know about you, but I don't buy paperclips."
  },
  {
    id: "ai896",
    text: "Hevipelle uses replicanti to speed up game speed.",
    get unlocked() { return PlayerProgress.replicantiUnlocked(); }
  },
  {
    id: "ai897",
    text: "So let's say you're making a game. You're making a singleton. You're making a game that's gonna be played offline. What happens when you play it? It crashes. What happens when you play it? It crashes more. What happens when you play it? You lose your save."
  },
  {
    id: "ai898",
    text: "This is what happens when you OVER-RELY on your \"fake it til you make it\" attitude."
  },
  {
    id: "ai899",
    text: "This is the fifth part of a two-part series looking at how science and magic are linked. Part one will be published on 5 October, part two will be published on 24 October, and you can follow the journey at part three."
  },
  {
    id: "ai900",
    text: "What is 5 hours? A giggle"
  },
  {
    id: "ai901",
    text: "A new beta test is now available for Antimatter Dimensions, coming in 5 hours. There are no refunds for this test, so please be patient as we try to finalise the test and get it ready for the public. The test will take place in -5 hours in the Antimatter Dimensions Discord."
  },
  {
    id: "ai902",
    text: "The Night is coming, and in its wake a terrible thing has been unleashed: ruin. Chaos. And decay. And death. And chaos is coming for all of us."
  },
  {
    id: "ai903",
    text: "This article is a stub. You can help Deskthority by expanding it."
  },
  {
    id: "ai904",
    text: "A new, safer way to store and retrieve your data has been found! When you get to the AE, click on the big red button and the world will stop rotating!"
  },
  {
    id: "ai905",
    text: "Ooh, what's this noise? A crash of some sort? More like, a crash of some greater magnitude? I don't know. Whatever it is, it's probably not being caused by me. I shouldn't be putting it through, it's just... well, you see, I was going to put it through, but then I just thought it might be a good idea to just put it through. Oh, it's gonna be a good one, I promise."
  },
  {
    id: "ai906",
    text: "Last week, we reported that an unknown individual known only as \"Anti-Doctor\" has broken the game and claimed ownership of the game's data. Since then, he has spread the word that he has an \"explosive new app\" that will allow him to \"turn [he] antimatter.\" However, no one has come forward with information on how to use the app, or even if it is a reality. We will update this article if and when we find out."
  },
  {
    id: "ai907",
    text: "The second thing I'm gonna do is go talk to the Devs in person. I don't know if I'll be able to do that without pissing someone off, so I'm gonna do it right here."
  },
  {
    id: "ai908",
    text: "The great majority of people don't get the full benefit of antimatter dimensions, and as such are not affected by it. However, there are certain people who are affected and at certain times of the day, depending on their mood and how much antimatter they have, they will manifest a dimensional shift, going from being idle to being actively involved in news ticker suggestions. This shift is due to the antimatter in their body emitting a certain wavelength, called \"red-shifted\"."
  },
  {
    id: "ai909",
    text: "By now we all know the drill. You get a new prestige layer just by spending eternity with someone."
  },
  {
    id: "ai910",
    text: "The real reason that the 9th dimension exists is to keep us all imprisoned in a virtual reality simulation."
  },
  {
    id: "ai911",
    text: "Your PC is infected with a weird, floating virus that's trying to steal all your antimatter. There's no cure, so get offline now!"
  },
  {
    id: "ai912",
    text: "The year is 5303. Hevipelle, the creator of Antimatter Dimensions, has touched the ninth dimension."
  },
  {
    id: "ai913",
    text: "The phrase \"Hevipelle hates me\" is pretty funny."
  },
  {
    id: "ai914",
    text: "The government shutdown has come and gone, the nation is still in a recession, and the Federal Reserve is still reading zero-hour contracts. The only thing that's getting better is your relationship with antimatter, obviously. It's been proven that knowing someone with an antimatter will bring you closer to extinction than any other kind of friend you can have."
  },
  {
    id: "ai915",
    text: "IMPORTANT NEWS: The developer Hevipelle has announced that Antimatter Dimensions: the game is now 100% free!"
  },
  {
    id: "ai916",
    text: "Someday, we shall come upon the day when a man will sit on the head of a dragon and call it a \"Dragonball\". Such a man would then go and perform the Dragon Ball Z: Battle Royale in which he would use Dragon Ball Z: Fusion to create a gigantic dragon that would then consume the universe in the process, thus creating a \"Big Bang\". Such a man would then be rewarded by being \"built again\" and sent back to the \"Heavens\"."
  },
  {
    id: "ai917",
    text: "\"I think that the greatest achievement a man can make in his life is to say that he has read every single news ticker suggestion and nothing happened.\" - Kajfik"
  },
  {
    id: "ai918",
    text: "Titanfall 2 is now in closed beta. The beta is only for people who are willing to give up some personal information, such as email addresses. If you're in the beta and would like to leave, you can do so at any time by going to the Help tab and changing your beta settings to public."
  },
  {
    id: "ai919",
    text: "Personally I like to get a 4 or 5 star rating, it gives you an idea of how great your suggestion is and also shows me how much you care about the game. If you want I can also do a 6 star rating, which is fine with me. I don't care if people like it or not, I work for APG and I get paid to make money."
  },
  {
    id: "ai920",
    text: "The real reason no one talks about 9 is because it's not a big secret"
  },
  {
    id: "ai921",
    text: "The only difference between a man and a woman is their attitude towards petting animals."
  },
  {
    id: "ai922",
    text: "A number of recent television documentaries have featured the story of a dog named Louie. He was accidentally made a member of the public after his owner left the house. One day he decided to play 'Let's Play Let's Play' with his owner. He was immediately put to sleep."
  },
  {
    id: "ai923",
    text: "The entire history of the world, every single idea, every single failure, every single downfall, every single achievement has been covered in one fell swoop."
  },
  {
    id: "ai924",
    text: "This sentence contains two paradoxes."
  },
  {
    id: "ai925",
    get text() { return `The time has come to reveal the next expansion for Antimatter Dimensions: the ${format(Number.MAX_VALUE, 2)}th Dimension. It will be released in -5 hours, it costs ${format(Number.MAX_VALUE, 2)} human souls as of now, and it has nothing to do with matter or antimatter.`; }
  },
  {
    id: "ai926",
    text: "I wonder what the fuss is about with the 4th dimension? Well, if you have 4 of them, and you multiply them by 0, then you get to the magical number of 4. That's why the 4th dimension exists. But what if there were 5? Well, the 5th dimension could replace the 4th dimension, so why not have a 5th dimension? Well, that's what the 6th, the 7th, and the 8th dimension are."
  },
  {
    id: "ai927",
    text: "You are using the wrong version! The reality update is already out! Press Ctrl+Shift+Alt+Del to unlock the 9th Dimension!"
  },
  {
    id: "ai928",
    text: "A man claims that he's been in a coma for 20 years now, and that he can't move his fingers. He was brought to the hospital with a compression fracture of his back, and since then he's been receiving medical help. He's since recovered, and now requires no medical attention. We still don't know where he's going with this, but we hope he finds some comfort in knowing that he'll never wake up."
  },
  {
    id: "ai929",
    text: "To move from left to right, turn right."
  },
  {
    id: "ai930",
    text: "Then we have the matter dimensions. From what I can gather, they are made of antimatter. There is some debate about whether or not there are any dimensions left over that are made out of matter, but that is not the main question. The real question is \"why do they exist, and how does antimatter affect them?\""
  },
  {
    id: "ai931",
    text: "A new breed of mad scientist is believed to be creating antimatter at an alarming rate."
  },
  {
    id: "ai932",
    text: "A new kind of justice has been discovered: mass deception. It works by tricking the player into thinking that he/she has done something wrong, when in fact he/she has just done something perfectly normal, i.e. going about his/her daily life normally, without thinking about it."
  },
  {
    id: "ai933",
    text: "Dedicated to the great and wonderful man behind the curtain, the great and wonderful name rick roll. RIP, good man. May you rest in peace."
  },
  {
    id: "ai934",
    text: "For the last time, Antimatter Dimensions isn't a Clicker game."
  },
  {
    id: "ai935",
    text: "The number of dimensions is infinite, but the quality of your dimensions is limited. This is why we only produce the highest quality antimatter, and what makes us different from other factories."
  },
  {
    id: "ai936",
    text: "I've heard of prestige layers before but never sure what to do with them."
  },
  {
    id: "ai937",
    text: "A man walks into a bar. The bartender tells him to stay the heck out. The man continues walking."
  },
  {
    id: "ai938",
    text: "The oldest and maybe the most famous game in all of AD, that certainly will be remembered long after you retire, is AD. Ever heard of someone winning the game with more than 2 1's? I have. Ever heard of someone losing it? I have. Ever heard of a 9th dimension existing in AD? I have never."
  },
  {
    id: "ai939",
    text: "Greetings, I am the first step of the step ladder."
  },
  {
    id: "ai940",
    get text() { return `It's the year ${format(Number.MAX_VALUE, 2)}, Hevi is still trying to figure out how to fix the update.`; }
  },
  {
    id: "ai941",
    text: "What if you could stretch your legs and not lose them forever?"
  },
  {
    id: "ai942",
    text: "T he most important thing to realize is that you don't have to play the game to get the achievement. You can actually get it by just reading the achievement descriptions."
  },
  {
    id: "ai943",
    text: "A new bank has been set up to provide safe haven for cryptocurrencies."
  },
  {
    id: "ai944",
    text: "Google+ is known to be a hit with teens, and today, they got their very own virtual reality (VR) version of Animal Farm, the classic 1950's farm story. The game is a blend of adventure, strategy and music, and was made by a small team of people with an eye towards engaging young people. The game offers an alternative to most other VR games, and is suitable for anyone who is not comfortable with large, complicated, graphics and sounds. The game features over 50 different..."
  },
  {
    id: "ai945",
    text: "This game could be called anything. You could call it whatever you like. But you'd be wrong. It's mine."
  },
  {
    id: "ai946",
    text: "Where does all the antimatter come from?"
  },
  {
    id: "ai947",
    text: "The Tickspeed Challenge is a team based game where you have to time-travel to the Andromeda galaxy to reach the 9th Dimension, the 1st Dimension being the shortest distance to the 9th Dimension. There is no perk for reaching the 9th Dimension, you just have to time-travel to the Andromeda galaxy to reach the 9th Dimension, and you'll be granted with a secret achievement for achieving instant [REDACTED] with no time-travelling."
  },
  {
    id: "ai948",
    text: "This is the question that has been bothering me for so long. What is Antimatter? Is Antimatter an Antimatter? What does it mean when you say \"Antimatter\"? These are the kinds of questions that plague the Antimatter Dimensions..."
  },
  {
    id: "ai949",
    text: "The term 'Antimatter Dimensions' is a play on words that literally means 'Antimatter Dimensions' in the dictionary."
  },
  {
    id: "ai950",
    text: "I can suspend the laws of physics because I'm a genius and my universe is so big that I can literally suspend the laws of physics and create a universe that's twice as big as the current one and with twice the mass, i'm sure you can imagine how big that would be."
  },
  {
    id: "ai951",
    text: "When you are fighting a losing war, you make peace with the Powers That Be. You give up the ghost, and move on to the next challenge."
  },
  {
    id: "ai952",
    text: "Somewhere, in another galaxy, a superintelligence is trying to figure out how to get around the limitations of what a 2-dimensional vector space is. It's probably working on a 3-dimensional space."
  },
  {
    id: "ai953",
    text: "The antagonist of the last few minutes is the mysterious, antimatter-covered being known only as \"The Man in Black.\" He was last seen running towards a news broadcast, seemingly lost, until he made it back to the news station and was interviewed about his experience. His story is told in the bottom right corner of the screen."
  },
  {
    id: "ai954",
    text: "You have unlocked the 4th storyline."
  },
  {
    id: "ai955",
    text: "While you were busy farming that pesky \"real\" number, I was busy writing that news ticker."
  },
  {
    id: "ai956",
    text: "A new power has arisen: the antimatter."
  },
  {
    id: "ai957",
    text: "The day has come. The antimatter is falling from the sky, and the streets are silent."
  },
  {
    id: "ai958",
    text: "The most important thing is to understand that you are playing a simulation. You can win or lose, but you can't get anything from it other than a little itch on your neck."
  },
  {
    id: "ai959",
    text: "The anti-snowman is a very special snowman. He's very timid, but has a very powerful wish to be picked up by a helicopter. The government doesn't want this to happen, so they lock him up in a special building and fly him over great distances. Finally, they drop him on the ground and begin to pick him up. The government didn't use force to pick him up, instead they invited the entire community in and started picking them up. The community refused."
  },
  {
    id: "ai960",
    text: "I'm surprised you didn't say \"Not my cup of anti-tea.\""
  },
  {
    id: "ai961",
    text: "I see you are a man of culture as well. I wonder what it is that draws you to speak in such an ungainly, tortured voice? What attracts you to speak in a language no one can understand? I hear your fans rave about your videos, but what draws you to this place? I feel like I know you. You are... you are a man of mystery. One that intrigues me..."
  },
  {
    id: "ai962",
    text: "Note: this is a private message. Do not send it in public."
  },
  {
    id: "ai963",
    text: "When you reach Infinity you unlock a new dimension: Pandemonium Dimensions. Go to the news ticker for more information."
  },
  {
    id: "ai964",
    get text() { return `Although the majority of players would say that the 9th dimension is not a thing, a handful of people would go and level it up in the most epic way imaginable. These people would use the power of the 9th dimension and achieve, like, ${format(Number.MAX_VALUE, 2)} EP with it. No? Well, they are the exceptions to the rule.`; },
    get unlocked() { return PlayerProgress.eternityUnlocked(); }
  },
  {
    id: "ai965",
    text: "The story of the \"perish the thought of dying\" movement has been told before, but never quite accurately. The movement was originally organized by antievolutionists to stop the exponential growth of scientific notation, but soon spread to oppose any form of \"progress\". In its early days the movement was led by an enigmatic individual known only as \"The Great Hevipelle\". Their philosophy was simple: expand the possibilities of what is possible, and push the limits of what is tolerable."
  },
  {
    id: "ai966",
    text: "This is the story of how the world ended. Earth was once a lush and green world. Then, some guy from outer space touched it and started growing mushrooms. He called himself Hevi. Some say Hevi was never satisfied. Some say he exploded. All we know is that Hevi is still out there expanding his reach, and we are stuck here in the void of space."
  },
  {
    id: "ai967",
    text: "Antimatter Dimensions, the only place where you can trade real estate for virtual reality"
  },
  {
    id: "ai968",
    text: "This page contains spoilers for Antimatter Dimensions, you've been warned."
  },
  {
    id: "ai969",
    text: "The best thing about being a news ticker is being able to slip into the news without anyone noticing."
  },
  {
    id: "ai970",
    text: "This paperclip maximizer is a great idea. It's probably best not to let it run its course though, since it's quite possibly the most amazing thing you've ever seen. If you've somehow survived the first phase of the paperclip dimension, you're probably wondering what it's doing in your home. Fortunately, it's super simple to fix. Just go to options, and change \"Max all\" to \"Always max all\"."
  },
  {
    id: "ai971",
    text: "A powerful wizard chose to channel negative energy into antimatter, and now the antimatter is spilling out into the world."
  },
  {
    id: "ai972",
    text: "A new age of ultra low-cost, ultra-fast trains has been announced by Elon Musk. Users will be able to travel from A to Z in a mere 186ms."
  },
  {
    id: "ai973",
    text: "A group of researchers at the University of Manchester have created a 3D printer that can create any object out of thin air, including a 3D-printed replica of the Virgin Mary."
  },
  {
    id: "ai974",
    text: "Alright, here's a new game called Antimatter Dimensions, it's like Matter Dimensions except with less stuff and more fun. It's available on Android, iOS, and web. The game is very simple: you take the 6 dimensions and the antimatter, and in the 6 dimensions you take the matter and in the matter you take the antimatter, and you play the game the same way you would any other game."
  },
  {
    id: "ai975",
    text: "What arbitrary, subjective, meaningless number comes out of your mouth like a mercury thermometer? 1.79"
  },
  {
    id: "ai976",
    text: "\"Word on the street is that the word \"bank\" is an anagram of \"bank\" - that makes sense but i'm not there yet\" - Slabdrill"
  },
  {
    id: "ai977",
    text: "The 9th dimension rose up like a volcano and began raining destruction on the empty 10th dimension. The smoke and debris from the exploding 9th dimension covered the entire 9th dimension. All that is left is a smoldering crater and the remains of the 9th dimension."
  },
  {
    id: "ai978",
    text: "Help! How do I get the dots moving in my head coordinator?"
  },
  {
    id: "ai979",
    text: "Hi, could you please not disable the news ticker? Thank me later."
  },
  {
    id: "ai980",
    text: "If you are suffering from low antimatter production, then worry not, friend! Our highly scientific antimatter government has recently reached the ninth dimension and will soon begin giving us the Anti-Hats as a sign of respect!"
  },
  {
    id: "ai981",
    text: "You click the bottom left corner of the screen and a green tingle goes up your leg. It's a treat you get from scratching antimatter."
  },
  {
    id: "ai982",
    text: "A quick note to those of you who buy into the Analytics subscription: we get a small percentage of your antimatter sales, but you do pay a small amount of money to support the research of the news ticker. It's a small price to pay for the convenience of browsing antimatter dimensions."
  },
  {
    id: "ai983",
    text: "Why haven't we caused the antimatter stock market to crash yet?"
  },
  {
    id: "ai984",
    text: "Even after the Heavenly Pelle put a large amount of antimatter in the pool, it hasn't produced anything. The scientist who discovered the vulnerability was last seen climbing a tree in a group of 10, with a small notebook on his lap, drinking cheese juice and watching Nothing."
  },
  {
    id: "ai985",
    text: "One-two-three, boo-two-three, three-four-five, anti-four-five, two-three-eight, nine-fifteen, five-six-seven, eight-nine-ten, nine-ten-ten, seven-seventy-eight... All has been going fine until last night, when four of the eight neighbors start complaining about a strange glow. A odd hum runs through the neighborhood, almost like a radio static. It gets more and more intense as you drive by, until it's practically pitch black. You try to explain it to the neighbors, but they won't listen. The neighborhood is unsafe, everyone knows that. You analyze it further, everyone thinks it's just some astrophysicist's idea. Then, s---. It's explodium. There's antimatter everywhere, and it's getting worse all the time. It turns out, there's about 1e31 Planck volumes in the entire observable universe. And that's just the antimatter we're talking about. There's also dark matter, normal matter, and extra matter. You know, the kind you create with your imagination."
  },
  {
    id: "ai986",
    text: "If you ever feel like making an antijoke, just remember that it could be pretty good."
  },
  {
    id: "ai987",
    text: "You won't convince anyone to go to heaven, but you might get close."
  },
  {
    id: "ai988",
    text: "BREAKING NEWS: Hevipelle, the creator of the 9th dimension, has just announced that beta will be out in 5 hours!"
  },
  {
    id: "ai989",
    text: "The Force is with you."
  },
  {
    id: "ai990",
    text: "What if Jesus was an anti-matter ghost?"
  },
  {
    id: "ai991",
    text: "In the summer of 711, the Great Calamity overtook Tyria. A great void was made, and Tyria was left to rot. The armies of the known world had given up, and the void was filled with darkness. Only the might of Kajfik remained, and he rose to become the greatest God in the known world. He is said to be the one who will face the Great Calamity alone, and destroy him."
  },
  {
    id: "ai992",
    text: "In recent news clashes, the warlocks have been gathering looters for raid boss. He loves his 5 hour looters and wants to show off his mighty weapon of choice, the 9th Dimension. As the two beasts battle, the 1st dimension holder needs to be careful as the first one might get the same as the 2nd one as well. Meanwhile, the raid ends its journey with a bang as the boss squanders the Explodium exploit by flooding the area with Explodium, which before his, was filled with Marsh Mice. Both are promptly annihilated by the boss' relentless claw attacks. It's a grueling job, but the raid stalwarts manage to grab the stalagm and push him across the opal Gondwan . With the boss dead and the warlocks not far behind, the warlocks try their hand at farming looters, but the grinding continues apace. Things are looking bleak for the warlocks, as the boss seeks to take advantage of the people's greed, and steal their weaponry, making them unable to use any remaining of their  weapons, which are made of highly-stable antimatter. The warlocks attempt to use the no fluke policy as a weapon to smite the people, but the people take to the streets, physically attacking and mentally draining the people of all mental capacity they had been holding onto. The people resort to violence, using the 9th dimension just like they use to hold people back, but the people have faith in God that he will merciful, He will bring about a kinder and gentler time where everyone can use the last drop of their power."
  },
  {
    id: "ai993",
    text: "What if you wanted to but I told you it would be too painful for you."
  },
  {
    id: "ai994",
    text: "how big of numbers do you have"
  },
  {
    id: "ai995",
    text: "Just want to thank the dev team for putting so much effort into Antimatter Dimensions and the Antimatter Dimensions 2"
  },
  {
    id: "ai996",
    text: "Hevipelle has broken the 9th wall! Get ready for everything to get pretty dark."
  },
  {
    id: "ai997",
    get text() { return `The intergalactic antimatter trade has been severely disrupted, trading entire galaxies for the occasional paperclip. Cargo stands are no longer used. Oddly enough, the entire dimension has become a dumping ground for discarded plastic and other useless garbage. It's almost as if the rest of the multiverse isn't producing enough good  antiparticles to feed the growing population. Unfortunately, the situation is forcing the entire multiverse to scramble to find ways to meet the growing needs of the antimatter-eating  dev, who claims to have over ${format(Number.MAX_VALUE, 2)} specimens left to collect.`; }
  }
];
