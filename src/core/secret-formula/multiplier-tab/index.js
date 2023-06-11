/**
 * Most of the GameDB entries in this folder follow largely the same structure, but have been split into multiple
 * for purposes of organization and ease-of-use. All fields may also be functions which may or may not accept an input
 * argument, often having differing behavior based on its presence or absence - more often than not, the lack of an
 * input argument will instead calculate the total contribution (eg. not providing a dimension tier will calculate
 * the total across all dimensions).
 * {
 *  @property {String} name               Name to associate with this multiplier/effect
 *  @property {String} isBase             Suppresses the leading × in multipliers if true. Primarily
 *    exists in order to avoid copy-pasting extensive entries in multValue
 *  @property {Decimal} displayOverride If present, displays this string instead of multipliers. This
 *    has higher priority than isBase
 *  @property {Decimal|Number} fakeValue  Value to be used as a stand-in for a total when this entry
 *    is the parent resource of a list of other resources. Mostly used in entries that contribute to a whole differently
 *    than how they're further broken down (eg. IP/EP contibuting as multipliers but consisting of currencies)
 *  @property {Decimal|Number} multValue  Value for multipliers given by this effect. Note that some
 *    entries may have a pow10 applied to them in order to "undo" logarithmic scaling in the UI
 *  @property {Number} powValue           Numerical value for powers given by this effect
 *  @property {Number} dilationEffect     Exponent to use for dilation effect
 *  @property {Boolean} isDilated         Denotes if the multiplier is already dilated and needs an "anti-dilation"
 *    calculation to be applied to make the numbers in the UI correct. Defaults to false
 *  @property {Boolean} isActive          Conditional determining if this component should be visible
 *  @property {Array String} overlay      String array to be used as HTML for an overlay on the tab; all
 *    entries in the array are rendered on top of each other
 *  @property {Object} icon               An object containing text and color for the bar that this
 *    entry has in the Vue component
 * }
 */

export { multiplierTabValues } from "./values";
export { multiplierTabTree } from "./tree";
