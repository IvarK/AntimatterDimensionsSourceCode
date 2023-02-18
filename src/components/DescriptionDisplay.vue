<script>
import wordShift from "@/core/word-shift";

import { isFunction, isString } from "@/utility";

/* eslint-disable no-empty-function */
export default {
  name: "DescriptionDisplay",
  props: {
    config: {
      type: Object,
      required: false,
      default: undefined
    },
    name: {
      type: String,
      required: false,
      default: undefined
    },
    length: {
      type: Number,
      required: false,
      default: undefined
    },
    title: {
      type: String,
      required: false,
      default: ""
    }
  },
  data() {
    return {
      isVisible: false,
      description: ""
    };
  },
  computed: {
    classObject() {
      const name = this.name;
      if (name === undefined) {
        return undefined;
      }
      const classes = {};
      classes[name] = true;
      if (this.description.length >= this.length) {
        classes[`${name}--small-text`] = true;
      }
      return classes;
    }
  },
  watch: {
    config: {
      immediate: true,
      handler(config) {
        this.updateFunction = () => { };
        const description = config?.description;
        // Descriptions in config entries are occasionally used both as standalone statements and mid-sentence,
        // so we explicitly capitalize them here because this only shows up in standalone places
        const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);
        this.isVisible = description !== undefined;
        if (!this.isVisible) return;

        if (isString(description)) {
          this.description = capitalize(description);
          return;
        }

        if (!isFunction(description)) {
          throw new Error(`DescriptionDisplay config.description has ` +
            ` unsupported type "${typeof description}"`);
        }

        const value = description();

        if (isString(value)) {
          // This is a special case for scrambling EC6 description text
          if (this.config.scrambleText) {
            this.description = capitalize(value).replace("*", wordShift.wordCycle(this.config.scrambleText, true));
            this.updateFunction = () =>
              this.description = capitalize(description())
                .replace("*", wordShift.wordCycle(this.config.scrambleText, true));
            return;
          }
          this.description = capitalize(value);
          this.updateFunction = () => this.description = capitalize(description());
          return;


        }

        throw new Error(`DescriptionDisplay config.description is a function ` +
          `which returns unsupported type "${typeof value}"`);
      }
    }
  },
  beforeCreate() {
    this.updateFunction = () => { };
  },
  methods: {
    update() {
      this.updateFunction();
    }
  },
};
</script>

<template>
  <span
    v-if="isVisible"
    :class="classObject"
  >
    {{ title }} {{ description }}
  </span>
</template>
