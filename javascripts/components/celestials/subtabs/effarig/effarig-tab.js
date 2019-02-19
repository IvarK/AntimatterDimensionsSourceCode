Vue.component('effarig-tab', {
  components: {
    "glyph-weight-sliders": {
      props: {
        value: {
          type: Number,
          default: 50
        },
        name: {
          type: String
        }
      },
      template:
        `<div class="o-effarig-slider"> 
          <b>{{ name }} weight: {{ value/100 }}</b>
          <input
            style="margin-left:0rem;"
            :value="value"
            class="o-primary-btn--update-rate__slider"
            type="range"
            min="0"
            max="100"
            @input="emitInput(parseInt($event.target.value))"
          />
         </div>`
    },
    "run-unlock-reward": {
      props: {
        unlock: Object
      },
      data: function() {
        return {
          isUnlocked: false
        };
      },
      methods: {
        update() {
          this.isUnlocked = this.unlock.isUnlocked;
        }
      },
      template: `<div v-if="isUnlocked">{{ unlock.config.description }}</div>`
    }
  },
  data: function() {
    return {
      relicShards: 0,
      shardsGained: 0,
      autosacrificeUnlocked: false,
      adjusterUnlocked: false,
      autopickerUnlocked: false,
      runUnlocked: false,
      weights: player.celestials.effarig.glyphWeights,
      typePriorities: ["Power", "Time", "Infinity", "Dilation", "Replication"],
      quote: "",
      quoteIdx: 0,
    };
  },
  methods: {
    update() {
      this.relicShards = player.celestials.effarig.relicShards;
      this.shardsGained = Effarig.shardsGained;
      this.typePriorities = player.celestials.effarig.typePriorityOrder;
      this.quote = Effarig.quote;
      this.quoteIdx = player.celestials.effarig.quoteIdx;
      this.runUnlocked = EffarigUnlock.run.isUnlocked;
      this.autosacrificeUnlocked = EffarigUnlock.autosacrifice.isUnlocked;
      this.adjusterUnlocked = EffarigUnlock.adjuster.isUnlocked;
      this.autopickerUnlocked = EffarigUnlock.autopicker.isUnlocked;
    },
    startRun() {
      Effarig.startRun();
    },
    adjustWeights(name) {
      let tempTotalWeight = 0
      for (let i in this.weights) {
        tempTotalWeight += this.weights[i]
      }
      let tempExtra = tempTotalWeight - 100
      if (this.weights[name] === 100) {
        for (let i in this.weights) {
          this.weights[i] = 0;
        }
        this.weights[name] = 100;
      } else {
        while (tempExtra > 0) {
          for (let i in this.weights) {
            if (tempExtra > 0 && this.weights[i] > 0 && i != name) {
              this.weights[i]--;
              tempExtra--;
            }
          }
        }
      }
    },
    move() {
      player.celestials.effarig.typePriorityOrder = this.typePriorities
    },
    nextQuote() {
      Effarig.nextQuote()
    },
    hasNextQuote() {
      return this.quoteIdx < Effarig.maxQuoteIdx
    }
  },
  computed: {
    shopUnlocks: () => [
      EffarigUnlock.adjuster,
      EffarigUnlock.autosacrifice,
      EffarigUnlock.autopicker
    ],
    runUnlock: () => EffarigUnlock.run,
    runUnlocks: () => [
      EffarigUnlock.infinity,
      EffarigUnlock.eternity,
      EffarigUnlock.reality
    ]
  },
  template:
    `<div class="l-effarig-celestial-tab">
      <div class="o-teresa-quotes"> {{ quote }}</div><button class="o-quote-button" @click="nextQuote()" v-if="hasNextQuote()">→</button>
      <div class="c-effarig-relics">You have {{ shortenRateOfChange(relicShards) }} Relic Shards.</div>
      <div class="c-effarig-relic-description">You gain {{ shortenRateOfChange(shardsGained) }} Shards next reality, based on different kinds of glyph effects you have equipped and EP.</div>
      <div class="l-effarig-shop">
        <effarig-unlock-button
          v-for="(unlock, i) in shopUnlocks"
          :key="i"
          :unlock="unlock"
        />
      </div>
      <effarig-unlock-button :unlock="runUnlock" />
      <div class="l-effarig-glyph-settings">
        <div v-if="autosacrificeUnlocked">
          Highest type will be picked, lowest sacrificed.
          <draggable :list="typePriorities" @end="move()">
            <div v-for="element in typePriorities" class="o-effarig-glyph-type">{{element}}</div>
          </draggable>
        </div>
        <div v-if="adjusterUnlocked">
          <div>
            <glyph-weight-sliders v-model="weights.ep" name="EP" @input="adjustWeights('ep')"/>
            <glyph-weight-sliders v-model="weights.repl" name="Replicanti" @input="adjustWeights('repl')"/>
          </div>
          <div>
            <glyph-weight-sliders v-model="weights.dt" name="DT" @input="adjustWeights('dt')"/>
            <glyph-weight-sliders v-model="weights.eternities" name="Eternities" @input="adjustWeights('eternities')"/>
          </div>
        </div>
        <div v-if="autopickerUnlocked">Glyph effect weight settings here</div>
      </div>
      <div v-if="runUnlocked">
        <button
          class="o-effarig-shop-button effarig-run-button"
          @click="startRun()"
        >
          Start a new reality, all production and gamespeed is severely lowered,
          infinity and time dimensions reduce the production penalty.
          Glyph levels are temporarily capped. You will gain unlocks at Infinity, Eternity and Reality.
        </button>
        <run-unlock-reward
          v-for="(unlock, i) in runUnlocks"
          :key="i"
          :unlock="unlock"
        />
      </div>
    </div>`
});