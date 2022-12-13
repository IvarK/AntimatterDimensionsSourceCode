import { TimeStudyConnectionSetup } from "./TimeStudyConnection";
import { TimeStudySetup } from "./TimeStudyButton";

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

export class TimeStudyTreeLayout {
  constructor(type, scaling = 1) {
    this.spacing = 4 * scaling;

    const normalRowLayout = new TimeStudyRowLayout({
      itemWidth: 18 * scaling,
      itemHeight: 10 * scaling,
      spacing: 3 * scaling
    });

    const wideRowLayout = new TimeStudyRowLayout({
      itemWidth: 12 * scaling,
      itemHeight: 10 * scaling,
      spacing: 0.6 * scaling
    });
    const normalRow = (...items) => new TimeStudyRow(normalRowLayout, items);
    const wideRow = (...items) => new TimeStudyRow(wideRowLayout, items, true);

    const TS = id => (TimeStudy(id).isUnlocked ? TimeStudy(id) : null);
    const EC = id => TimeStudy.eternityChallenge(id);

    /**
     * @type {TimeStudyRow[]}
     */
    /* eslint-disable no-multi-spaces, space-in-parens, func-call-spacing */
    this.rows = [
      normalRow(                       null,   TS(11),   null                         ),
      normalRow(                           TS(21), TS(22)                             ),
      normalRow(                   null, TS(31), TS(32), TS(33)                       )
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
      this.rows.push(
        normalRow(                 TS(301), TS(302), TS(303), TS(304)                 )
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
      column: 0
    });

    const enslavedStudy = {};
    this.enslavedStudy = new TimeStudySetup({
      study: enslavedStudy,
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
    this.enslavedStudyConnection = new TimeStudyConnectionSetup(
      new TimeStudyConnection(TS(11), enslavedStudy)
    );

    this.width = this.rows.map(row => row.width).max();
    const heightNoSpacing = this.rows.map(r => r.layout.itemHeight).sum();
    this.height = heightNoSpacing + (this.rows.length - 1) * this.spacing;

    for (const study of this.studies) {
      study.setPosition(this);
    }
    this.secretStudy.setPosition(this);
    this.enslavedStudy.setPosition(this);

    for (const connection of this.connections) {
      connection.setPosition(this.studies, this.width, this.height);
    }
    this.secretStudyConnection.setPosition(this.studies.concat(this.secretStudy), this.width, this.height);
    this.enslavedStudyConnection.setPosition(this.studies.concat(this.enslavedStudy), this.width, this.height);
  }

  itemPosition(row) {
    const rows = this.rows.slice(0, row);
    const heightNoSpacing = rows.map(r => r.layout.itemHeight).sum();
    return heightNoSpacing + rows.length * this.spacing;
  }

  static create(type, scaling = 1) {
    if (this._instances === undefined) {
      this._instances = [];
    }
    const layout = new TimeStudyTreeLayout(type, scaling);
    this._instances[`${type}__${scaling}`] = layout;
    return layout;
  }
}

export const STUDY_TREE_LAYOUT_TYPE = {
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
