<script>
export default {
  name: "AutomatorDocsTemplateList",
  computed: {
    templates: () => GameDatabase.reality.automator.templates.scripts
  },
  methods: {
    showModal(template) {
      Modal.automatorScriptTemplate.show(template);
    },
  }
};
</script>

<template>
  <div>
    These templates will let you do some more common things within the Automator. They may be slightly slower than
    manually-written scripts, but don't require you to have any previous programming experience to use. Clicking any
    of these buttons will open up a prompt with some input fields, which will generate text you can copy and paste
    directly into the Automator.
    <button
      v-for="template in templates"
      :key="template.name"
      class="c-automator__button l-automator__button"
      @click="showModal(template)"
    >
      Template: {{ template.name }}
    </button>
  </div>
</template>

<style scoped>

</style>
