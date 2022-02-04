import "./normal-time-study.js";
import "./secret-time-study.js";
import "./triad-time-study.js";
import "./ec-time-study.js";
import "./dilation-time-study.js";
import { rem } from "./rem.js";
import { TimeStudySetup } from "./time-study.js";
import { TimeStudyConnectionSetup } from "./time-study-connection.js";
import PrimaryButton from "@/components/PrimaryButton";

class TimeStudyRow {
  constructor(layout, items, isWide) {
    this.layout = layout;
    this.items = items;
    this.isWide = isWide;
  }

  get width() {
    const itemCount = this.items.length;
    const layout = this.layout;
    return itemCount * layout.itemWidth + (itemCount - 1) * layout.spacing;
  }

  itemPosition(column, treeLayout) {
    const layout = this.layout;
    const treeWidth = treeLayout.width;
    const rowLeft = (treeWidth - this.width) / 2;
    return rowLeft + column * layout.itemWidth + column * layout.spacing;
  }
}

class TimeStudyRowLayout {
  constructor(props) {
    this.itemWidth = props.itemWidth;
    this.itemHeight = props.itemHeight;
    this.spacing = props.spacing;
  }
}

class TimeStudyTreeLayout {
  constructor(type) {
    this.spacing = 4;

    const normalRowLayout = new TimeStudyRowLayout({
      itemWidth: 18,
      itemHeight: 10,
      spacing: 3
    });

    const wideRowLayout = new TimeStudyRowLayout({
      itemWidth: 12,
      itemHeight: 10,
      spacing: 0.6
    });
    const normalRow = (...items) => new TimeStudyRow(normalRowLayout, items);
    const wideRow = (...items) => new TimeStudyRow(wideRowLayout, items, true);

    const TS = id => TimeStudy(id);
    const EC = id => TimeStudy.eternityChallenge(id);

    /**
     * @type {TimeStudyRow[]}
     */
    /* eslint-disable no-multi-spaces, space-in-parens, func-call-spacing */
    this.rows = [
      normalRow(                       null,   TS(11),   null                         ),
      normalRow(                           TS(21), TS(22)                             ),
      normalRow(                   TS(33), TS(31), TS(32), null                       )
    ];

    if (type === STUDY_TREE_LAYOUT_TYPE.ALTERNATIVE_62 || type === STUDY_TREE_LAYOUT_TYPE.ALTERNATIVE_62_181 ||
      type === STUDY_TREE_LAYOUT_TYPE.ALTERNATIVE_TRIAD_STUDIES) {
      this.rows.push(
        normalRow(                     null, TS(41), TS(42), EC(5)                      ),
        normalRow(                               TS(51)                                 )
      );
    } else {
      this.rows.push(
        normalRow(                           TS(41), TS(42)                             ),
        normalRow(                       null,   TS(51),  EC(5)                         )
      );
    }

    this.rows.push(
      normalRow(                       null,   TS(61),  TS(62)                        ),
      normalRow(                      TS(71),  TS(72),  TS(73)                        ),
      normalRow(                      TS(81),  TS(82),  TS(83)                        ),
      normalRow(                      TS(91),  TS(92),  TS(93)                        ),
      normalRow(                      TS(101), TS(102), TS(103)                       ),
      normalRow(                       EC(7),  TS(111),  null                         ),
      normalRow(                      TS(121), TS(122), TS(123)                       ),
      normalRow(               EC(6), TS(131), TS(132), TS(133), EC(8)                ),
      normalRow(                      TS(141), TS(142), TS(143)                       ),
      normalRow(               null,   EC(9), TS(151),   null,   EC(4)                ),
      normalRow(                          TS(161), TS(162)                            )
    );

    if (type === STUDY_TREE_LAYOUT_TYPE.ALTERNATIVE_181 || type === STUDY_TREE_LAYOUT_TYPE.ALTERNATIVE_62_181 ||
        type === STUDY_TREE_LAYOUT_TYPE.ALTERNATIVE_TRIAD_STUDIES) {
      this.rows.push(
        normalRow(                         null, TS(171),  EC(2)                        ),
        normalRow(                        EC(1), TS(181),  EC(3)                        )
      );
    } else {
      this.rows.push(
        normalRow(                               TS(171)                                ),
        normalRow(                         EC(1), EC(2), EC(3)                          ),
        normalRow(                               TS(181)                                )
      );
    }

    this.rows.push(
      normalRow(                               EC(10)                                 ),
      normalRow(             TS(191),          TS(192),          TS(193)              ),
      normalRow(                               TS(201)                                ),
      normalRow(    TS(211),          TS(212),          TS(213),          TS(214)     ),
      wideRow  (TS(221), TS(222), TS(223), TS(224), TS(225), TS(226), TS(227), TS(228))
    );

    if (type === STUDY_TREE_LAYOUT_TYPE.ALTERNATIVE_TRIAD_STUDIES && !Pelle.isDoomed) {
      const vLevel = Ra.pets.v.level;
      this.rows.push(
        normalRow(
          vLevel >= 5 ? TS(301) : null,
          vLevel >= 10 ? TS(302) : null,
          vLevel >= 15 ? TS(303) : null,
          vLevel >= 20 ? TS(304) : null
        )
      );
    }

    this.rows.push(
      normalRow(    TS(231),          TS(232),          TS(233),          TS(234)     ),
      normalRow(              EC(11),                             EC(12)              ),
      normalRow(                          TimeStudy.dilation                          ),
      normalRow(          TimeStudy.timeDimension(5), TimeStudy.timeDimension(6)      ),
      normalRow(          TimeStudy.timeDimension(7), TimeStudy.timeDimension(8)      ),
      normalRow(                          TimeStudy.reality                           )
    );
    /* eslint-enable no-multi-spaces, space-in-parens, func-call-spacing */

    /**
     * @type {TimeStudySetup[]}
     */
    this.studies = [];
    for (let rowIndex = 0; rowIndex < this.rows.length; rowIndex++) {
      const row = this.rows[rowIndex];
      for (let columnIndex = 0; columnIndex < row.items.length; columnIndex++) {
        const study = row.items[columnIndex];
        if (study === null) continue;
        const setup = new TimeStudySetup({
          study,
          row: rowIndex,
          column: columnIndex
        });
        if (row.isWide) {
          setup.isSmall = true;
        }
        this.studies.push(setup);
      }
    }
    const secretStudy = {};
    this.secretStudy = new TimeStudySetup({
      study: secretStudy,
      row: 0,
      column: 2
    });

    /**
     * @type {TimeStudyConnectionSetup[]}
     */
    this.connections = TimeStudy.allConnections
      .map(c => new TimeStudyConnectionSetup(c));
    this.secretStudyConnection = new TimeStudyConnectionSetup(
      new TimeStudyConnection(TS(11), secretStudy)
    );

    this.width = this.rows.map(row => row.width).max();
    const heightNoSpacing = this.rows.map(r => r.layout.itemHeight).sum();
    this.height = heightNoSpacing + (this.rows.length - 1) * this.spacing;

    for (const study of this.studies) {
      study.setPosition(this);
    }
    this.secretStudy.setPosition(this);

    for (const connection of this.connections) {
      connection.setPosition(this.studies, this.width, this.height);
    }
    this.secretStudyConnection.setPosition(this.studies.concat(this.secretStudy), this.width, this.height);
  }

  itemPosition(row) {
    const rows = this.rows.slice(0, row);
    const heightNoSpacing = rows.map(r => r.layout.itemHeight).sum();
    return heightNoSpacing + rows.length * this.spacing;
  }

  static create(type) {
    if (this._instances === undefined) {
      this._instances = [];
    }
    const layout = new TimeStudyTreeLayout(type);
    this._instances[type] = layout;
    return layout;
  }
}

const STUDY_TREE_LAYOUT_TYPE = {
  NORMAL: 0,
  ALTERNATIVE_62: 1,
  ALTERNATIVE_181: 2,
  ALTERNATIVE_62_181: 3,
  ALTERNATIVE_TRIAD_STUDIES: 4,
  get current() {
    const alt62 = Perk.bypassEC5Lock.isBought;
    const alt181 = Perk.bypassEC1Lock.isBought && Perk.bypassEC2Lock.isBought && Perk.bypassEC3Lock.isBought;
    if (Ra.canBuyTriad) return this.ALTERNATIVE_TRIAD_STUDIES;
    if (alt62 && alt181) return this.ALTERNATIVE_62_181;
    if (alt62) return this.ALTERNATIVE_62;
    if (alt181) return this.ALTERNATIVE_181;
    return this.NORMAL;
  }
};

Vue.component("time-studies-tab", {
  components: {
    PrimaryButton
  },
  data() {
    return {
      respec: player.respec,
      layoutType: STUDY_TREE_LAYOUT_TYPE.NORMAL,
      vLevel: 0,
      renderedStudyCount: 0,
      renderedConnectionCount: 0,
    };
  },
  created() {
    const incrementRenderedCount = () => {
      let shouldRequestNextFrame = false;
      if (this.renderedStudyCount < this.allStudies.length) {
        this.renderedStudyCount += 2;
        shouldRequestNextFrame = true;
      }
      if (this.renderedConnectionCount < this.allConnections.length) {
        this.renderedConnectionCount += 2;
        shouldRequestNextFrame = true;
      }
      if (shouldRequestNextFrame) {
        this.renderAnimationId = requestAnimationFrame(incrementRenderedCount);
      }
    };
    incrementRenderedCount();

    // Scroll to top because time studies tab is rendered progressively
    // and we don't want the player to see empty space while it's loading.
    document.body.scrollTop = 0;
  },
  beforeDestroy() {
    cancelAnimationFrame(this.renderAnimationId);
  },
  watch: {
    respec(newValue) {
      player.respec = newValue;
    },
    vLevel() {
      // When vLevel changes, we recompute the study tree because of triad studies
      this.$recompute("layout");
    }
  },
  computed: {
    layout() {
      return TimeStudyTreeLayout.create(this.layoutType);
    },
    allStudies() {
      return this.layout.studies;
    },
    studies() {
      return this.allStudies.slice(0, this.renderedStudyCount);
    },
    allConnections() {
      return this.layout.connections;
    },
    connections() {
      return this.allConnections.slice(0, this.renderedConnectionCount);
    },
    treeStyleObject() {
      return {
        width: rem(this.layout.width),
        height: rem(this.layout.height)
      };
    },
    respecClassObject() {
      return {
        "o-primary-btn--subtab-option": true,
        "o-primary-btn--respec-active": this.respec
      };
    }
  },
  methods: {
    update() {
      this.respec = player.respec;
      this.layoutType = STUDY_TREE_LAYOUT_TYPE.current;
      this.vLevel = Ra.pets.v.level;
    },
    studyComponent(study) {
      switch (study.type) {
        case TIME_STUDY_TYPE.NORMAL: return "normal-time-study";
        case TIME_STUDY_TYPE.ETERNITY_CHALLENGE: return "ec-time-study";
        case TIME_STUDY_TYPE.DILATION: return "dilation-time-study";
        case TIME_STUDY_TYPE.TRIAD: return "triad-time-study";
      }
      throw "Unknown Time Study type";
    },
    exportStudyTree() {
      if (player.timestudy.studies.length === 0) {
        GameUI.notify.error("You cannot export an empty Time Study Tree!");
      } else {
        copyToClipboard(GameCache.currentStudyTree.value.exportString);
        GameUI.notify.info("Exported current Time Studies to your clipboard");
      }
    }
  },
  template: `
    <div class="l-time-studies-tab">
      <div class="c-subtab-option-container">
        <PrimaryButton
          class="o-primary-btn--subtab-option"
          @click="exportStudyTree"
        >
          Export tree
        </PrimaryButton>
        <PrimaryButton
          :class="respecClassObject"
          @click="respec = !respec"
        >
          Respec Time Studies on next Eternity
        </PrimaryButton>
        <PrimaryButton
          class="o-primary-btn--subtab-option"
          onclick="Modal.studyString.show()"
        >
          Import tree
        </PrimaryButton>
      </div>
      <div class="l-time-study-tree l-time-studies-tab__tree" :style="treeStyleObject">
        <component
          v-for="(setup, index) in studies"
          :key="setup.study.type.toString() + setup.study.id.toString()"
          :setup="setup"
          :is="studyComponent(setup.study)"
        />
        <secret-time-study :setup="layout.secretStudy" />
        <svg :style="treeStyleObject" class="l-time-study-connection">
          <time-study-connection
            v-for="(setup, index) in connections"
            :key="'connection' + index"
            :setup="setup"
          />
          <secret-time-study-connection :setup="layout.secretStudyConnection" />
        </svg>
      </div>
    </div>`
});
