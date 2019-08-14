"use strict";

Vue.component("sacrificed-glyphs", {
  components: {
    "type-sacrifice": {
      props: {
        type: String,
      },
      data() {
        return {
          amount: 0,
          effectValue: 0,
        };
      },
      computed: {
        typeConfig() {
          return GlyphTypes[this.type];
        },
        sacConfig() {
          return GlyphSacrifice[this.type].config;
        },
        symbol() {
          return this.typeConfig.symbol;
        },
        formatAmount() {
          return this.shorten(this.amount, 2);
        },
        description() {
          return this.sacConfig.description(this.effectValue);
        },
      },
      methods: {
        update() {
          this.amount = player.reality.glyphs.sac[this.type];
          this.effectValue = GlyphSacrifice[this.type].effectValue;
        }
      },
      template: `
        <div v-if="amount > 0"
             class="l-sacrificed-glyphs__type">
          <div>
            <div class="l-sacrificed-glyphs__type-symbol c-sacrificed-glyphs__type-symbol">
              {{symbol}}
            </div>
            <div class="l-sacrificed-glyphs__type-amount c-sacrificed-glyphs__type-amount">
              {{formatAmount}}
            </div>
          </div>
          {{description}}
        </div>`
    }
  },
  data() {
    return {
      anySacrifices: false,
    };
  },
  computed: {
    types: () => GLYPH_TYPES,
  },
  methods: {
    update() {
      this.anySacrifices = GLYPH_TYPES.some(e => player.reality.glyphs.sac[e] !== 0);
    }
  },
  template: `
  <div v-show="anySacrifices"
       class="c-sacrificed-glyphs l-sacrificed-glyphs">
    <div class="c-sacrificed-glyphs__header">Sacrifices:</div>
    <template v-for="type in types">
      <type-sacrifice :type="type"/>
    </template>
  </div>`,
});