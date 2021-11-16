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
    classes() {
      const name = this.name;
      if (name === undefined) {
        return undefined;
      }
      const classes = [name];
      if (this.length !== undefined && this.description.length >= this.length) {
        classes.push(`${name}--small-text`);
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
          throw new Error(`CostDisplay config.description has ` +
            ` unsupported type "${typeof description}"`);
        }

        const value = description();

        if (isString(value)) {
          this.description = value;
          this.updateFunction = () => this.description = description();
          return;
        }

        throw new Error(`CostDisplay config.description is a function ` +
          `which returns unsupported type "${typeof value}"`);
      }
    }
  },
  created() {
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
    :class="classes"
  >
    {{ title }} {{ description }}
  </span>
</template>
