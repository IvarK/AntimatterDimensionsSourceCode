<script>
export default {
  name: "ModernSidebarCurrency",
  data() {
    return {
      sidebarID: 0,
      resourceName: "",
      resourceValue: new Decimal(0)
    };
  },
  computed: {
    resourceDB: () => GameDatabase.sidebarResources,
    numDBEntries() {
      return this.resourceDB.length;
    },
    resource() {
      // With "default" sorting, return the latest unlocked resource - otherwise, return the specified one
      return this.sidebarID === 0
        ? this.resourceDB.filter(e => e.isAvailable()).sort((a, b) => b.id - a.id)[0]
        : this.resourceDB.find(e => e.id === this.sidebarID);
    },
    displayValue() {
      // RM + iM seems to cause strange, undesirable linebreaks
      return this.resource.formatValue(this.resourceValue).replace(" + ", "+");
    }
  },
  methods: {
    update() {
      this.sidebarID = player.options.sidebarResourceID;
      this.resourceName = this.resource.resourceName ?? this.resource.optionName;
      this.resourceValue.copyFrom(this.resource.value());
    },
    cycleResource(dir) {
      const oldID = this.sidebarID;
      this.sidebarID = (this.sidebarID + this.numDBEntries + dir) % this.numDBEntries;
      while (this.sidebarID !== oldID) {
        if (this.resource.isAvailable()) break;
        this.sidebarID = (this.sidebarID + this.numDBEntries + dir) % this.numDBEntries;
      }
      player.options.sidebarResourceID = this.sidebarID;
    },
    containerClass() {
      return {
        "c-sidebar-resource": true,
        "c-sidebar-resource-default": this.sidebarID === 0,
      };
    },
    styleObject() {
      const strLen = this.displayValue.length;
      return {
        transform: `scale(${strLen < 10 ? 1 : 10 / strLen})`,
      };
    }
  },
};
</script>

<template>
  <div
    :class="containerClass()"
    @click.exact="cycleResource(1)"
    @click.shift.exact="cycleResource(-1)"
  >
    <h2
      :class="resource.formatClass"
      :style="styleObject()"
    >
      {{ displayValue }}
    </h2>
    <div class="c-sidebar-resource__information">
      <span class="c-sidebar-resource__name">{{ resourceName }}</span>
    </div>
  </div>
</template>

<style scoped>
.c-sidebar-resource {
  display: flex;
  flex-direction: column;
  width: var(--sidebar-width);
  height: 7rem;
  justify-content: center;
  align-items: center;
  background-color: var(--color-base);
  border-right: 0.1rem solid var(--color-accent);
  border-bottom: 0.1rem solid var(--color-accent);
  padding: 1rem;
  user-select: none;
}

.c-sidebar-resource-default {
  border-width: 0.3rem;
}

.c-sidebar-resource:last-child {
  border-bottom-right-radius: var(--var-border-radius, 0.5rem);
}

.c-sidebar-resource h2 {
  z-index: 1;
  font-size: 1.9rem;
  margin: 0;
}

.t-dark .c-sidebar-resource h2,
.t-dark-metro .c-sidebar-resource h2 {
  text-shadow: 0 0 0.1rem rgba(0, 0, 0, 50%), -0.1rem 0.1rem 0.1rem rgba(0, 0, 0, 80%);
}

.c-sidebar-resource__information {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  font-size: 1.5rem;
  color: var(--color-text);
}

.c-sidebar-resource__name {
  font-size: 1.2rem;
}

.o-sidebar-currency--antimatter {
  color: black;
}

.t-normal .o-sidebar-currency--antimatter {
  color: var(--color-accent);
}

.t-dark .o-sidebar-currency--antimatter,
.t-amoled .o-sidebar-currency--antimatter,
.t-s6 .o-sidebar-currency--antimatter,
.t-s10 .o-sidebar-currency--antimatter {
  animation: a-game-header__antimatter--glow 25s infinite;
}

.t-s11 .o-sidebar-currency--antimatter {
  animation: a-game-header__antimatter--glow-blob 25s infinite;
}

.t-dark-metro .o-sidebar-currency--antimatter,
.t-amoled-metro .o-sidebar-currency--antimatter {
  color: #e0e0e0;
}

.o-sidebar-currency--infinity {
  color: var(--color-infinity);
}

.o-sidebar-currency--replicanti {
  /* Taken from glyph-types.js */
  color: #03a9f4;
}

.o-sidebar-currency--eternity {
  color: var(--color-eternity);
}

.o-sidebar-currency--dilation {
  color: var(--color-dilation);
}

.o-sidebar-currency--reality {
  color: var(--color-reality);
}

.o-sidebar-currency--effarig {
  color: var(--color-effarig--base);
}

.o-sidebar-currency--laitela {
  color: var(--color-laitela--base);
  text-shadow: 0.1rem 0.1rem 0.1rem var(--color-laitela--accent);
}

.o-sidebar-currency--pelle {
  color: var(--color-pelle--base);
}
</style>
