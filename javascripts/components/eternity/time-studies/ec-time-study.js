Vue.component("ec-time-study", {
  props: {
    setup: Object
  },
  data: function() {
    return {
      hasRequirement: false,
      requirement: {
        current: new Decimal(0),
        total: new Decimal(0)
      }
    };
  },
  computed: {
    study: function() {
      return this.setup.study;
    },
    id: function() {
      return this.study.id;
    },
    hasDecimalRequirement: function() {
      return this.id > 6;
    },
    requirementResource: function() {
      switch (this.id) {
        case 1: return "Eternities";
        case 2: return "Tickspeed upgrades gained from time dimensions";
        case 3: return "8th dimensions";
        case 4: return "infinities";
        case 5: return "antimatter galaxies";
        case 6: return "replicanti galaxies";
        case 7: return "antimatter";
        case 8: return "IP";
        case 9: return "infinity power";
        case 10: return "EP";
      }
    }
  },
  methods: {
    update() {
      const id = this.id;
      this.hasRequirement = !player.reality.perks.includes(31) || player.etercreq !== id;
      if (!this.hasRequirement || id > 10) return;
      const requirement = this.requirement;
      const study = this.study;
      if (this.hasDecimalRequirement) {
        requirement.total.copyFrom(study.requirementTotal);
        requirement.current.copyFrom(study.requirementCurrent.min(requirement.total));
      }
      else {
        requirement.total = study.requirementTotal;
        requirement.current = Math.min(study.requirementCurrent, requirement.total);
      }
    },
    purchase() {
      this.study.purchase();
    },
    formatNumber(value) {
      return value.toString();
    },
    formatWithCommas(value) {
      return formatWithCommas(value);
    },
    formatDecimal(value) {
      return this.shortenCosts(value);
    },
    formatRequirement(formatFn) {
      return `${formatFn(this.requirement.current)}/${formatFn(this.requirement.total)}`;
    }
  },
  template:
    `<time-study :setup="setup" class="o-time-study--eternity-challenge" @purchase="purchase">
      Eternity Challenge {{id}}
      <template v-if="hasRequirement">
        <br>
        Requirement:
        <span v-if="id === 12">Use only the Time Dimension path</span>
        <span v-else-if="id === 11">Use only the Normal Dimension path</span>
        <span v-else>
          <span v-if="id > 6">{{formatRequirement(formatDecimal)}}</span>
          <span v-else-if="id === 4">{{formatRequirement(formatWithCommas)}}</span>
          <span v-else>{{formatRequirement(formatNumber)}}</span>
          {{requirementResource}}
        </span>
      </template>
    </time-study>`
});