"use strict";
/**
 * @template
 * {
 *  name: {String}
 *  id: {Number}
 *  info: {function: @return String}
 *  unlock: {function: @return Boolean}
 *  tags: {Array: String}
 *  tab: {String} "tab/subtab"
 * }
 */

const H2P_TABS = [
  {
    name: "Dimensions",
    id: 0,
    info: () => `Dimensions are your production units in game. The first Dimension produces your Antimatter.
    Each consecutive dimension produces the previous one, allowing you to have steady growth.
    There are eight dimensions total. <br>
    <b>Dimension Multiplier:</b> Beside the dimension there is a multiplier (example: First Dimension x1.0).
    The base production of each dimension is multiplied by this number.
    This multiplier increases by 2x(Base) for every 10 of that dimension purchased. Each time this occurs,
    the price of the dimension will increase. <br>
    <b>Accumulated Dimension Quantity:</b>The next column is your current amount of that dimension you own.
    This is a combination of how many you have purchased with antimatter,
    as well as produced from the higher dimension. <br>
    <b>Purchased Dimensions Quantity:</b> Next to each accumulated quantity of owned dimensions,
    the amount of that dimension purchased toward the next multiplier upgrade is displayed in brackets.
    If you have (4) next to your accumulated dimension quaintly,
    you will need 6 more of that dimension for the next multiplier increase. <br>
    <b>Dimension Growth Percent:</b> This number represents the amount of growth that
    dimensions experiences per second. +100% means the dimension is doubling each second.
    This allows you to judge overall growth. <br>
    <b>Cost &amp; until 10:</b>
    You can buy a single quantity of each dimension with antimatter when the cost button is highlighted.
    Alternatively, if the Until 10 buttons is highlighted,
    you can buy whatever quantity gets you to that dimensions next dimension multiplier. <br>
    <b>Max all:</b> Max all will buy max tickspeed (see below),
    then will buy until 10 of 1st dimension until it can't anymore, then 2nd, and so on. <br>
    <b>Dimension base prices:</b> 10, 100, 10000, 1e6, 1e9, 1e13, 1e18, 1e24 <br>
    <b>Base per 10 bought dimension price increases:</b>1000, 10000, 1e5, 1e6, 1e8, 1e10, 1e12, 1e15 <br>
    <b>Hotkeys: 1, 2, 3, 4, 5, 6, 7, 8</b> for buy until 10 Xth dimension
    (you can also hold down shift while buying dimensions, it will only buy 1 instead of 10), <b>M</b> for Max all`,
    unlock: () => true,
    tags: ["dims", "normal"],
    tab: "dimensions/normal"
  }
];
