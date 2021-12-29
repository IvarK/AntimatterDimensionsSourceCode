<script>
export default {
  name: "AutomatorScriptTemplate",
  props: {
    modalConfig: {
      type: Object,
      required: true
    }
  },
  computed: {
    params: () => GameDatabase.reality.automator.templates.params,
    templates: () => GameDatabase.reality.automator.templates.scripts,
    hasWarnings: () => modalConfig.warnings().length !== 0,
  },
};
</script>

<template>
  <div>
    <b>Required information for Template "{{ modalConfig.name }}"</b>
    <br>
    {{ modalConfig.description }}
    <br>
    <div
      v-for="index in modalConfig.paramTypes.length"
      :key="index"
    >
      {{ modalConfig.paramTypes[index-1] }}
      <br>
      {{ modalConfig.paramNames[index-1] }}
      <br>
      {{ modalConfig.targets[index-1] }}
      ...
    </div>
  </div>
</template>
