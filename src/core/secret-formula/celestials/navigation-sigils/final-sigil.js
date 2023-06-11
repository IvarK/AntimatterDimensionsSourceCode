import { CELESTIAL_NAV_DRAW_ORDER } from "../navigation";

function sigilProgress() {
  const riftProgress = PelleRifts.all.map(r => Math.clamp(r.realPercentage, 0, 1)).min();
  const generatorProgress = Math.log10(1 + GalaxyGenerator.generatedGalaxies) / 11;
  return Math.clampMax(0.2 * riftProgress + 0.8 * generatorProgress, 1);
}

// Determines styling, overall visibility, and placement/scaling of the sigil. Center and size are defined such that
// keeping the sigil within internal coordinates of ±1 will keep the sigil within a ±size box of the center coordinates
const SigilAttributes = {
  visible: () => PelleRifts.all.map(r => Math.clamp(r.realPercentage, 0, 1)).min() > 0,
  center: new Vector(400, 300),
  size: 400,
  color: "#00ffff",
  canvasLayer: CELESTIAL_NAV_DRAW_ORDER.NODE_BG - 500,
};

function scaledPos(x, y) {
  const att = SigilAttributes;
  return new Vector(att.center.x + att.size * x, att.center.y + att.size * y);
}

// Reflects a vector across the vertical line down the center of the sigil bounding box. Used to take advantage of the
// sigil having vertical symmetry, allowing us to cut down on hardcoded specifications by half
function reflectAcrossVertical(vec) {
  return new Vector(2 * SigilAttributes.center.x - vec.x, vec.y);
}

/**
 * Method to make an appropriately-formatted entry to be fed into the navigation code
 *
 * @member {String} type  String specifying the actual shape of the element to be drawn; must be "line" or "circle"
 * @member {Object} att   Object whose props list out attributes of the shape to be drawn:
 *  Line  : start and end, specifying the two endpoints to draw between.
 *  Circle: center and radius to specify the circle path, initAngle and finalAngle to specify an arc segment to draw.
 *    0 is rightward and positive angles draw clockwise. Note that making finalAngle-initialAngle a multiple of 2pi
 *    will cause curve decomposition errors in the curve-drawing code.
 * @member {Object} fill  Object specifying a segment for the fill as a fraction of the total sigil filling progress.
 *  Each particular segment will fill from 0% to 100% within the range init to init+weight, without over/underfilling.
 * @member {String} colorOverride Color to use for rendering the element, used instead of SigilAttributes.color
 */
// eslint-disable-next-line max-params
function sigilShape(type, att, fill, colorOverride) {
  let pos, path, pathStart, pathEnd;
  switch (type) {
    case "edge":
      pos = att.start;
      path = new LinearPath(att.start, att.end);
      pathStart = 0;
      pathEnd = 1;
      break;
    case "circle":
      pos = att.center;
      path = LogarithmicSpiral.fromPolarEndpoints(att.center, 0, att.radius * SigilAttributes.size,
        1, att.radius * SigilAttributes.size);
      pathStart = att.initAngle;
      pathEnd = att.finalAngle;
      break;
    default:
      throw Error("Unrecognized shape in sigil specification");
  }

  return {
    visible: () => SigilAttributes.visible() && sigilProgress() >= fill.init,
    complete: () => Math.clamp((sigilProgress() - fill.init) / fill.weight, 0, 1),
    // Note that att and fill aren't used in navigation rendering, but including them here massively simplifies the
    // sigil reflection logic
    att,
    fill,
    node: {
      position: pos,
      ring: {
        rMajor: 0,
      },
    },
    connector: {
      pathStart,
      pathEnd,
      drawOrder: SigilAttributes.canvasLayer,
      path,
      fill: colorOverride ?? SigilAttributes.color,
      completeWidth: SigilAttributes.size / 20,
      noBG: true,
    },
  };
}

// These coordinates should generally be kept within ±1; if the sigil needs to be larger then that should be changed in
// the SigilAttribute object instead. Naming conventions for this sigil use smaller numbers to denote nodes generally
// closer to the center line (whether by distance or path length), whereas abbreviated words are used to describe
// vertical position. C denotes horizontal center points.
const Positions = Object.freeze({
  circTop: scaledPos(0.333, -0.41),
  circMid: scaledPos(0.5, 0.22),
  circBot: scaledPos(0, 0.43),
  topC: scaledPos(0, -0.4),
  top1: scaledPos(0.08, -0.27),
  top2: scaledPos(0.18, -0.35),
  top3: scaledPos(0.28, -0.35),
  mid: scaledPos(0.08, 0.05),
  arm1: scaledPos(0.5, 0.05),
  arm2: scaledPos(0.5, -0.15),
  arm3: scaledPos(0.4, -0.15),
  lowC: scaledPos(0, 0.22),
  low1: scaledPos(0.42, 0.22),
  botC: scaledPos(0, 0.31),
  bot1: scaledPos(0.12, 0.43),
  bot2: scaledPos(0.28, 0.43),
});

// List of specified primitive graphics elements with which to construct the sigil; see docstring of sigilShape
// for description of proper attribute specifications
const Shapes = {
  botCircR: sigilShape("circle",
    { center: Positions.circBot, radius: 0.12, initAngle: 0.5 * Math.PI, finalAngle: -0.5 * Math.PI },
    { init: 0, weight: 0.2 }),
  botH: sigilShape("edge",
    { start: Positions.bot1, end: Positions.bot2 },
    { init: 0.1, weight: 0.1 }),
  lowH: sigilShape("edge",
    { start: Positions.lowC, end: Positions.low1 },
    { init: 0.3, weight: 0.3 }),
  circUp: sigilShape("circle",
    { center: Positions.circMid, radius: 0.08, initAngle: Math.PI, finalAngle: 0 },
    { init: 0.6, weight: 0.1 }),
  circDown: sigilShape("circle",
    { center: Positions.circMid, radius: 0.08, initAngle: Math.PI, finalAngle: 2 * Math.PI },
    { init: 0.6, weight: 0.1 }),
  vert2: sigilShape("edge",
    { start: Positions.bot2, end: Positions.top3 },
    { init: 0.2, weight: 0.7 }),
  vertC: sigilShape("edge",
    { start: Positions.botC, end: Positions.lowC },
    { init: 0.2, weight: 0.1 }),
  vertDiag1: sigilShape("edge",
    { start: Positions.lowC, end: Positions.mid },
    { init: 0.3, weight: 0.1 }),
  arm1: sigilShape("edge",
    { start: Positions.mid, end: Positions.arm1 },
    { init: 0.4, weight: 0.2 }),
  arm2: sigilShape("edge",
    { start: Positions.arm1, end: Positions.arm2 },
    { init: 0.6, weight: 0.1 }),
  arm3: sigilShape("edge",
    { start: Positions.arm2, end: Positions.arm3 },
    { init: 0.7, weight: 0.1 }),
  vert1: sigilShape("edge",
    { start: Positions.mid, end: Positions.top1 },
    { init: 0.4, weight: 0.3 }),
  vertDiag2: sigilShape("edge",
    { start: Positions.top1, end: Positions.topC },
    { init: 0.7, weight: 0.1 }),
  vertDiag3: sigilShape("edge",
    { start: Positions.top1, end: Positions.top2 },
    { init: 0.7, weight: 0.1 }),
  topH: sigilShape("edge",
    { start: Positions.top2, end: Positions.top3 },
    { init: 0.8, weight: 0.1 }),
  circTopUp: sigilShape("circle",
    { center: Positions.circTop, radius: 0.08, initAngle: 0.75 * Math.PI, finalAngle: 1.75 * Math.PI },
    { init: 0.9, weight: 0.1 }),
  circTopDown: sigilShape("circle",
    { center: Positions.circTop, radius: 0.08, initAngle: 0.75 * Math.PI, finalAngle: -0.25 * Math.PI },
    { init: 0.9, weight: 0.1 }),
};

// The hardcoded elements in Shapes above only specify roughly half of the sigil; here we take all the existing entries
// and reflect them across the center line. Note that this technically duplicates one of the elements on top of itself
for (const key of Object.keys(Shapes)) {
  const toReflect = Shapes[key];
  if (toReflect.connector.path instanceof LinearPath) {
    Shapes[`${key}Ref`] = sigilShape("edge",
      { start: reflectAcrossVertical(toReflect.att.start), end: reflectAcrossVertical(toReflect.att.end) },
      toReflect.fill);
  } else if (toReflect.connector.path instanceof LogarithmicSpiral) {
    Shapes[`${key}Ref`] = sigilShape("circle",
      { center: reflectAcrossVertical(toReflect.att.center), radius: toReflect.att.radius,
        initAngle: Math.PI - toReflect.att.initAngle, finalAngle: Math.PI - toReflect.att.finalAngle },
      toReflect.fill);
  }
}

// This segment adds multiple circular arcs around the entire sigil, which all fill simultaneously
const arcSegments = 16;
for (let arcIndex = 0; arcIndex < arcSegments; arcIndex++) {
  const len = 2 * Math.PI / arcSegments;
  const init = arcIndex * len;
  Shapes[`arcInner${arcIndex}`] = sigilShape("circle",
    { center: SigilAttributes.center, radius: 0.75,
      initAngle: init, finalAngle: init + len },
    { init: 0.1, weight: 0.4 },
    "crimson");
  Shapes[`arcOuter${arcIndex}`] = sigilShape("circle",
    { center: SigilAttributes.center, radius: 0.95,
      initAngle: init, finalAngle: init - len },
    { init: 0.5, weight: 0.4 },
    "crimson");
}

export const finalSigil = Object.values(Shapes)
  .mapToObject((key, idx) => `final-sigil-${idx}`, val => val);
