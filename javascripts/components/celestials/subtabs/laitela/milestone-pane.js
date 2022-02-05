import "./singularity-milestone.js";

Vue.component("singularity-milestone-pane", {
  data() {
    return {
      milestones: [],
      hasNew: false,
    };
  },
  computed: {
    classObject() {
      return {
        "o-dark-matter-dimension-button--ascend": this.hasNew
      };
    },
  },
  methods: {
    update() {
      this.milestones = SingularityMilestones.nextMilestoneGroup;
      this.hasNew = SingularityMilestones.unseenMilestones.length !== 0;
    },
  },
  template: `
    <div class="c-laitela-next-milestones">
      <div
        class="o-laitela-singularity-modal-button"
        onclick="Modal.singularityMilestones.show()"
        :class="classObject"
      >
        Show all milestones
      </div>
      <singularity-milestone
        v-for="milestone in milestones"
        :key="milestone.id"
        :milestone="milestone"
        :suppressGlow="true"
      />
    </div>`
});
