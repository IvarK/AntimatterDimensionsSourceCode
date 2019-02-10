Vue.component("sacrificed-glyphs", {
  components: {
    "type-sacrifice": {
      props: {
        type: String,
        amount: Number,
        effectValue: Number,
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
      template: /*html*/`
        <div class="l-sacrificed-glyphs__type">
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
  data: function () {
    return {
      sacrificed: GlyphTypes.list.map(t => ({
        type: t.id,
        amount: player.reality.glyphs.sac[t.id],
        effectValue: GlyphSacrifice[t.id].effectValue,
      })),
    };
  },
  computed: {
    anySacrifices() {
      return this.sacrificed.some(t => t.amount !== 0);
    }
  },
  methods: {
    update() {
      GlyphTypes.list.forEach((t, idx) => {
        this.sacrificed[idx].amount = player.reality.glyphs.sac[t.id];
        this.sacrificed[idx].effectValue = GlyphSacrifice[t.id].effectValue;
      });
    }
  },
  template: /*html*/`
  <div v-show="anySacrifices"
       class="c-sacrificed-glyphs l-sacrificed-glyphs">
    <div class="c-sacrificed-glyphs__header">Sacrifices:</div>
    <template v-for="sacInfo in sacrificed">
      <type-sacrifice v-if="sacInfo.amount > 0" v-bind="sacInfo"/>
    </template>
  </div>`,
})