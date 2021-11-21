<script>
import { isFunction, isString } from "@/utility";

/* eslint-disable no-empty-function */
export default {
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
      default: "",
      required: false
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
        this.isVisible = description !== undefined;
        if (!this.isVisible) return;

        if (isString(description)) {
          this.description = description;
          return;
        }

        if (!isFunction(description)) {
          throw new Error(`DescriptionDisplay config.description has ` +
            ` unsupported type "${typeof description}"`);
        }

        const value = description();

        if (isString(value)) {
          this.description = value;
          this.updateFunction = () => this.description = description();
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
