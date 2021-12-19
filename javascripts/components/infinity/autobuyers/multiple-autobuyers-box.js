import "./autobuyer-toggle-label.js";
import "./autobuyer-interval-label.js";

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
    type: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      continuumActive: false,
      anyUnlocked: false,
      allMaxedInterval: false,
      allUnlimitedBulk: false,
    };
  },
  computed: {
    autobuyers() {
      return this.type.zeroIndexed;
    },
    name() {
      return this.type.groupName;
    },
    boxSize() {
      // The width of the name panel is 20% - the other 80% is divvied up between the multiple autobuyers.
      return `width: ${80 / this.type.entryCount}%`;
    },
    isADBox() {
      return this.name === Autobuyer.antimatterDimension.groupName;
    },
    showAutobuyers() {
      // Only display the Antimatter Dimension Autobuyers if the bulk is the same and there are any of them unlocked
      if (this.isADBox) return this.anyUnlocked && !this.displayBulkAsGroup && this.displayIntervalAsGroup;
      return this.anyUnlocked;
    },
    displayIntervalAsGroup() {
      return this.allMaxedInterval ?? true;
    },
    displayBulkAsGroup() {
      return this.allUnlimitedBulk ?? true;
    },
  },
  methods: {
    update() {
      this.continuumActive = Laitela.continuumActive;
      const type = this.type;
      this.anyUnlocked = type.anyUnlocked();
      this.allMaxedInterval = type.allMaxedInterval?.();
      this.allUnlimitedBulk = type.allUnlimitedBulk?.();
    },
  },
  template: `
    <span
      v-if="showAutobuyers && !(isADBox && continuumActive)"
      class="c-autobuyer-box-row"
    >
      <div class="l-autobuyer-box__title">
        {{ name }}<br>Autobuyers
        <autobuyer-interval-label
          :autobuyer="autobuyers[0]"
          :showInterval="displayIntervalAsGroup"
          :showBulk="displayBulkAsGroup"
        />
      </div>
      <single-autobuyer-in-row
        v-for="(autobuyer, id) in autobuyers"
        :key="id"
        :autobuyer="autobuyer"
        :style="boxSize"
        :showInterval="!displayIntervalAsGroup"
        :showBulk="!displayBulkAsGroup"
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
