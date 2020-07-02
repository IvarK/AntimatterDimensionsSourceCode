"use strict";

Vue.component("modal-away-progress", {
  props: {
    playerBefore: Object,
    playerAfter: Object
  },
  data() {
    return {
      antimatter: {
        before: new Decimal(0),
        after: new Decimal(0)
      },
      infinityPoints: {
        before: new Decimal(0),
        after: new Decimal(0)
      },
      eternityPoints: {
        before: new Decimal(0),
        after: new Decimal(0)
      },
      realityMachines: {
        before: new Decimal(0),
        after: new Decimal(0)
      },
      dilatedTime: {
        before: new Decimal(0),
        after: new Decimal(0)
      },
      infinities: {
        before: new Decimal(0),
        after: new Decimal(0)
      },
      eternities: {
        before: new Decimal(0),
        after: new Decimal(0)
      },
      realities: {
        before: 0,
        after: 0
      },
      singularities: {
        before: 0,
        after: 0
      },
    };
  },
  computed: {
    editLabel() {
      return `Editing`;
    },
  },
  methods: {
    update() {
      this.antimatter.before = this.playerBefore.antimatter;
      this.antimatter.after = player.antimatter;
      this.infinityPoints.before = this.playerBefore.infinityPoints;
      this.infinityPoints.after = player.infinityPoints;
      this.eternityPoints.before = this.playerBefore.eternityPoints;
      this.eternityPoints.after = player.eternityPoints;
      this.realityMachines.before = this.playerBefore.reality.realityMachines;
      this.realityMachines.after = player.reality.realityMachines;
    },
    resourceChanged(resource) {
      if (typeof resource.before === "object") {
        if (resource.before.neq(resource.after)) return true;
        return false;
      }
      if (resource.before !== resource.after) return true;
      return false;
    },
  },
  template:
    `<div class="c-modal l-modal-content--centered">
      <modal-close-button @click="emitClose"/>
      <h3>hi</h3>
    </div>`
});

// We goin to flavortown USA
// hi i'm guy fieri and we're rolling out
// looking for america's greatest
// diners, drive-ins, and dives.