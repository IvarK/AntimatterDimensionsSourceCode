
import "./helper-functions";
import "./tree";

/**
 * Most of the GameDB entries in this folder follow largely the same structure, but have been split into multiple
 * for purposes of organization and ease-of-use. All fields must be functions which may or may not accept an input
 * argumen, often having differing behavior based on its presence or absence - more often than not, the lack of an
 * input argument will instead calculate the total contribution (eg. not providing a dimension tier will calculate
 * the total across all dimensions).
 * {
 *  @property {function: @return String} name             Name to associate with this multiplier/effect
 *  @property {function: @return String} isBase           Suppresses the leading × in multipliers if true. Primarily
 *    exists in order to avoid copy-pasting extensive entries in multValue
 *  @property {function: @return Decimal} displayOverride If present, displays this string instead of multipliers. This
 *    has higher priority than isBase
 *  @property {function: @return Decimal|Number} multValue  Value for multipliers given by this effect. Note that some
 *    entries may have a pow10 applied to them in order to "undo" logarithmic scaling in the UI
 *  @property {function: @return Number} powValue         Numerical value for powers given by this effect
 *  @property {function: @return Boolean} isActive        Conditional determining if this component should be visible
 *  @property {function: @return String} color            CSS entry or string specifying this component's color
 *  @property {Array String} overlay                      String array to be used as HTML for an overlay on the tab; all
 *    entries in the array are rendered on top of each other
 *  @property {function: @return String} barOverlay       String to be used as HTML for an overlay on the percentage bar
 * }
 */
import "./general";
import "./antimatter";
import "./antimatter-dimensions";
import "./infinity-dimensions";
import "./time-dimensions";
import "./infinity-points";
import "./eternity-points";
import "./tachyon-particles";
import "./dilated-time";
import "./tickspeed";
import "./galaxies";
import "./infinities";
import "./eternities";
import "./gamespeed";
