<script>
export default {
  name: "SaveInfoEntry",
  props: {
    saveId: {
      type: Number,
      required: false,
      default: 0,
    },
    saveData: {
      type: Object,
      required: true,
    },
    otherData: {
      type: Object,
      required: true,
    },
    showName: {
      type: Boolean,
      required: false,
      default: true,
    },
    saveType: {
      type: String,
      required: true,
    }
  },
  computed: {
    lessHTMLTag() {
      return `<span style="color:#${getComputedStyle(document.body).getPropertyValue("--color-bad").split("#")[1]}">`;
    },
    moreHTMLTag() {
      return `<span style="color:#${getComputedStyle(document.body).getPropertyValue("--color-good").split("#")[1]}">`;
    },
    timePlayed() {
      return `Time Played: ${TimeSpan.fromMilliseconds(this.saveData.realTimePlayed).toString()}`;
    },
    antimatter() {
      if (this.saveData.totalAntimatter.eq(this.otherData.totalAntimatter)) {
        return `Total Antimatter: ${format(this.saveData.totalAntimatter, 2, 1)}`;
      }
      const colorTag = this.saveData.totalAntimatter.gt(this.otherData.totalAntimatter)
        ? this.moreHTMLTag
        : this.lessHTMLTag;
      return `Total Antimatter: ${colorTag}${format(this.saveData.totalAntimatter, 2, 1)}</span>`;
    },
    prestigeCount() {
      return this.compareLayeredValues(
        ["realities", "eternities", "infinities"],
        ["Realities:", "Eternities:", "Infinities:"],
        [this.formatSmall, this.formatSmall, this.formatSmall],
        "(No prestige layers reached yet.)"
      );
    },
    prestigeResource() {
      return this.compareLayeredValues(
        ["imaginaryMachines", "realityMachines", "eternityPoints", "infinityPoints"],
        ["Reality Machines:", "Reality Machines:", "Eternity Points:", "Infinity Points:"],
        [x => formatMachines(this.saveData.realityMachines, x), format, format, format],
        ""
      );
    },
    extraProgressIndicator() {
      return this.compareLayeredValues(
        ["bestLevel", "dilatedTime"],
        ["Best Glyph Level:", "Dilated Time:"],
        [formatInt, format],
        ""
      );
    },
    formattedSTDText() {
      return this.compareLayeredValues(
        ["totalSTD"],
        ["STDs purchased:"],
        [formatInt, format],
        "No STDs purchased"
      );
    },
    name() {
      return this.saveData.saveName;
    },
  },
  methods: {
    formatSmall(number) {
      if (Decimal.gt(number, 1e4)) return format(number, 2);
      return formatInt(number);
    },
    // Compares a list of properties in order, going through the
    // eslint-disable-next-line max-params
    compareLayeredValues(propArray, nameArray, formatArray, fallbackString) {
      // Determine if they're on the same layer and if it's better or worse
      let isSameLayer, isBetter;
      for (let index = 0; index < propArray.length; index++) {
        const prop = propArray[index];
        if (Decimal.eq(this.saveData[prop], 0) && Decimal.eq(this.otherData[prop], 0)) {
          // They're both zero
          continue;
        } else if (Decimal.eq(this.saveData[prop], this.otherData[prop])) {
          // They're both the same value
          isSameLayer = true;
          isBetter = 0;
          break;
        } else if (Decimal.neq(this.saveData[prop], 0) && Decimal.neq(this.otherData[prop], 0)) {
          // Both have nonzero values on the same layer
          isSameLayer = true;
          isBetter = Decimal.gt(this.saveData[prop], this.otherData[prop]) ? 1 : -1;
          break;
        } else {
          // The only other case is that one is zero and the other isn't
          isSameLayer = false;
          isBetter = Decimal.gt(this.saveData[prop], 0) ? 1 : -1;
          break;
        }
      }

      // Figure out what the raw text should be, based on the first nonzero value
      let layerName = fallbackString, layerValue = "";
      for (let index = 0; index < propArray.length; index++) {
        const prop = propArray[index];
        if (Decimal.gt(this.saveData[prop], 0)) {
          layerName = nameArray[index];
          // This is often called with format(), so wew supply a default 2 decimal places
          layerValue = formatArray[index](this.saveData[prop], 2);
          break;
        }
      }

      // Style it appropriately
      if (isBetter === 0) return `${layerName} ${layerValue}`;
      const colorTag = isBetter === 1 ? this.moreHTMLTag : this.lessHTMLTag;
      return isSameLayer
        ? `${layerName} ${colorTag}${layerValue}</span>`
        : `${colorTag}${layerName} ${layerValue}</span>`;
    }
  },
};
</script>

<template>
  <div class="l-modal-options__save-record">
    <h3>{{ saveType }} <span v-if="saveId">(Slot #{{ saveId + 1 }}):</span></h3>
    <span v-if="showName">
      <span v-if="name">
        Save Name: {{ name }}
      </span>
      <span v-else>
        Unnamed Save
      </span>
      <br>
    </span>
    <span v-html="formattedSTDText" />
    {{ timePlayed }}
    <br>
    <br>
    <span v-html="antimatter" />
    <span v-html="prestigeCount" />
    <span v-html="prestigeResource" />
    <span v-html="extraProgressIndicator" />
    <br>
    <slot />
  </div>
</template>
