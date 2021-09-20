"use strict";

// All news IDs follow the format [letter(s)][number] so we always assume that's the case and make sure to access the
// relevant props within player.news.seen
const NewsHandler = {
  addSeenNews(id) {
    const groups = id.match(/([a-z]+)(\d+)/u);
    const type = groups[1];
    const number = parseInt(groups[2], 10);

    // This check is needed for migration purposes because we attempt to add news tickers before the relevant
    // properties are created. In the case of different IDs existing due to very old versions, this does technically
    // add a bunch of extra "invalid" and "impossible" IDs which are not normally obtainable.
    if (!player.news.seen[type]) player.news.seen[type] = [];
    
    // If the bit array isn't large enough (ie. the numerical ID is the largest we've seen so far by a long shot), then
    // we pad the array with zeroes until we can fit the new ID in before actually adding it. Note - 32 bits per entry.
    while (32 * player.news.seen[type].length < number) player.news.seen[type].push(0);
    // eslint-disable-next-line no-bitwise
    player.news.seen[type][Math.floor(number / 32)] |= 1 << (number % 32);
  },

  hasSeenNews(id) {
    const groups = id.match(/([a-z]+)(\d+)/u);
    const type = groups[1];
    const number = parseInt(groups[2], 10);
    const bitArray = player.news.seen[type];

    if (!bitArray || 32 * bitArray.length < number) return false;
    // eslint-disable-next-line no-bitwise
    return (bitArray[Math.floor(number / 32)] |= 1 << (number % 32)) !== 0;
  },

  get uniqueTickersSeen() {
    let totalSeen = 0;
    for (const bitmaskArray of Object.values(player.news.seen)) {
      for (const bitmask of bitmaskArray) {
        totalSeen += countValuesFromBitmask(bitmask);
      }
    }
    return totalSeen;
  }
};
