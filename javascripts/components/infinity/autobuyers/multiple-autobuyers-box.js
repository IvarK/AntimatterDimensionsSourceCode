"use strict";

Vue.component("multiple-autobuyers-box", {
  components: {
    "single-autobuyer-in-row": {
      components: {
        "autobuyer-mode-button": {
          props: {
            autobuyer: Object,
          },
          data() {
            return {
              mode: AUTOBUYER_MODE.BUY_SINGLE
            };
          },
          computed: {
            modeDisplay() {
              switch (this.mode) {
                case AUTOBUYER_MODE.BUY_SINGLE: return "Buys singles";
                case AUTOBUYER_MODE.BUY_10: return "Buys max";
              }
              throw "Unknown Dimension Autobuyer mode";
            }
          },
          methods: {
            update() {
              this.mode = this.autobuyer.mode;
            },
            toggleMode() {
              this.autobuyer.toggleMode();
              this.update();
            }
          },
          template: `
            <button
              class="o-autobuyer-btn o-autobuyer-btn--tiny"
              @click="toggleMode"
            >
              {{ modeDisplay }}
            </button>`
        }
      },
      props: {
        autobuyer: Object,
        // You may notice that there are no autobuyers where showInterval or showBulk would apply -
        // they are always the same. This is for future-proofing,
        // also for the sunk costs fallacy after trying to fully integrate ADs into this system
        showInterval: Boolean,
        showBulk: Boolean,
      },
      data() {
        return {
          isVisible: false,
        };
      },
      computed: {
        name() {
          return this.autobuyer.name;
        },
        hasMode() {
          return this.autobuyer.mode !== undefined;
        },
      },
      methods: {
        update() {
          const buyer = this.autobuyer;
          this.isVisible = buyer.isUnlocked || buyer.isBought;
        },
      },
      template: `
        <span v-if="isVisible" class="c-autobuyer-box-slot">
          <autobuyer-toggle-label :autobuyer="autobuyer" />
          {{ name }}
          <autobuyer-interval-label
            :autobuyer="autobuyer"
            :showInterval="showInterval"
            :showBulk="showBulk"
          />
          <autobuyer-mode-button v-if="hasMode" :autobuyer="autobuyer" />
        </span>`
    }
  },
  props: {
    autobuyers: Array,
  },
  data() {
    return {
      continuumActive: false,
      anyUnlocked: false,
      sameInterval: false,
      sameBulk: false,
    };
  },
  computed: {
    name() {
      return this.autobuyers.name;
    },
    boxSize() {
      // The width of the name panel is 20% - the other 80% is divvied up between the multiple autobuyers.
      return `width: ${80 / this.autobuyers.length}%`;
    },
    isADBox() {
      return this.name === Autobuyers.antimatterDimensions.name;
    },
    showAutobuyers() {
      // Only display the Antimatter Dimension Autobuyers if the bulk is the same and there are any of them unlocked
      if (this.isADBox) return this.anyUnlocked && this.sameBulk && this.sameInterval;
      return this.anyUnlocked;
    }
  },
  methods: {
    update() {
      this.continuumActive = Laitela.continuumActive;
      // If any of the autobuyers are unlocked, we should display the whole thing.
      this.anyUnlocked = this.autobuyers.some(x => x.isUnlocked);
      // If the first autobuyer's interval isn't undefined, check if all the intervals are the same - if they are
      // we should show the interval on the main autobuyer instead of on each of the sub autobuyers.
      const sameIntervalSet = new Set(this.autobuyers.map(x => x.interval));
      this.sameInterval = !sameIntervalSet.has(undefined) && sameIntervalSet.size === 1;
      // If the first autobuyer's bulk is unlimited, the bulks are the same. Otherwise, we have to check if all the
      // other bulks are the same.
      // If they are the same, we should show it on the main instead of on each of the sub autobuyers.
      const sameBulkSet = new Set(this.autobuyers.map(x => x.bulk));
      this.sameBulk = this.autobuyers[0].hasUnlimitedBulk || sameBulkSet.size === 1;
    },
  },
  template: `
    <span
      v-if="showAutobuyers && !(isADBox && continuumActive)"
      class="c-autobuyer-box-row"
    >
      <div class="l-autobuyer-box__header--new">
        {{ name }}<br>Autobuyers
        <autobuyer-interval-label
          :autobuyer="autobuyers[0]"
          :showInterval="sameInterval"
          :showBulk="sameBulk"
        />
      </div>
      <single-autobuyer-in-row
        v-for="(autobuyer, id) in autobuyers"
        :key="id"
        :autobuyer="autobuyer"
        :style="boxSize"
        :showInterval="!sameInterval"
        :showBulk="!sameBulk"
      />
    </span>
    <span
      v-else-if="isADBox && continuumActive"
      class="c-autobuyer-box-row"
    >
      Continuum makes Antimatter Dimension and Tickspeed Autobuyers obsolete, as you now automatically have a
      <br>
      certain amount of simulated Antimatter Dimension and Tickspeed purchases based on your antimatter.
    </span>`
});
