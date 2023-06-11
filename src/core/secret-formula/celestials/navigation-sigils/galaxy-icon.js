import { CELESTIAL_NAV_DRAW_ORDER, pelleStarPosition } from "../navigation";

// Determines styling, overall visibility, and placement/scaling of the sigil. Center and size are defined such that
// the sigil will largely stay within a circle of radius "size" centered on "center"
const SigilAttributes = {
  visible: () => Pelle.hasGalaxyGenerator,
  center: pelleStarPosition(0, 0),
  size: 20,
  color: "#00ffff",
  canvasLayer: CELESTIAL_NAV_DRAW_ORDER.CANVAS_OVERLAY,
};

/**
 * Method to make an appropriately-formatted entry to be fed into the navigation code
 *
 * @member {String} type  String specifying the actual shape of the element to be drawn; must be "circle" or "arc"
 * @member {Object} att   Object whose props list out attributes of the shape to be drawn:
 *  center - Center of the circle or logarithmic spiral ("arc") being drawn
 *  radius - Only used for "circle" and is the radius of the circle being drawn
 *  initRadius/finalRadius - Radius endpoints for a spiral
 *  initAngle/finalAngle - Angular endpoints for a spiral
 * @member {Object} draw  Object whose props (thickness, layer) determine the thickness and z-index of this element
 * @member {String} colorOverride Color to use for rendering the element, used instead of SigilAttributes.color
 */
// eslint-disable-next-line max-params
function sigilShape(type, att, draw, colorOverride) {
  let pos, path, pathStart, pathEnd;
  switch (type) {
    case "circle":
      pos = att.center;
      path = LogarithmicSpiral.fromPolarEndpoints(att.center, 0, att.radius * SigilAttributes.size,
        1, att.radius * SigilAttributes.size);
      pathStart = att.initAngle;
      pathEnd = att.finalAngle;
      break;
    case "arc":
      pos = att.center;
      pathStart = att.initAngle;
      pathEnd = att.finalAngle;
      path = LogarithmicSpiral.fromPolarEndpoints(att.center, pathStart, att.initRadius * SigilAttributes.size,
        pathEnd, att.finalRadius * SigilAttributes.size);
      break;
    default:
      throw Error("Unrecognized shape in sigil specification");
  }

  return {
    visible: () => SigilAttributes.visible(),
    complete: () => 1,
    node: {
      position: pos,
      ring: {
        rMajor: SigilAttributes.size * draw.thickness,
      },
      bgDrawOrder: SigilAttributes.canvasLayer + draw.layer,
    },
    connector: {
      pathStart,
      pathEnd,
      drawOrder: SigilAttributes.canvasLayer + draw.layer,
      path,
      fill: colorOverride ?? SigilAttributes.color,
      completeWidth: SigilAttributes.size * draw.thickness,
      noBG: true
    },
  };
}

// List of specified primitive graphics elements with which to construct the sigil; see docstring of sigilShape
// for description of proper attribute specifications. These are two circular rings in the center of the galaxy
const Shapes = {
  disc: sigilShape("circle",
    { center: SigilAttributes.center, radius: 0.2, initAngle: 0, finalAngle: 6.28 },
    { thickness: 0.15, layer: 1 },
    "#88ffff"),
  glow: sigilShape("circle",
    { center: SigilAttributes.center, radius: 0.125, initAngle: 0, finalAngle: 6.28 },
    { thickness: 0.05, layer: 2 },
    "white"),
};

// This segment adds multiple circular arcs around the entire sigil, in a shape resembling a spiral galaxy
const arcSegments = 10;
for (let arcIndex = 0; arcIndex < arcSegments; arcIndex++) {
  const len = 2 * Math.PI / arcSegments;
  const init = arcIndex * len;
  Shapes[`spiral${arcIndex}`] = sigilShape("arc",
    { center: SigilAttributes.center, initRadius: 0.2, finalRadius: 0.9, initAngle: init, finalAngle: init + Math.PI },
    { thickness: 0.1, layer: 0 },
    "cyan");
}

export const galaxyIcon = Object.values(Shapes)
  .mapToObject((key, idx) => `galaxy-icon-${idx}`, val => val);
