"use strict";

// All news IDs follow the format [letter(s)][number] so we always assume that's the case and make sure to access the
// relevant props within player.news.seen
const NewsHandler = {
  // In principle 32 should work but something seems to go wrong with negative numbers in the function that counts
  // the number of bits in a bitmask, so we have to use 31.
  BITS_PER_MASK: 31,

  addSeenNews(id) {
    const groups = id.match(/([a-z]+)(\d+)/u);
    const type = groups[1];
    const number = parseInt(groups[2], 10);

    // This check is needed for migration purposes because we attempt to add news tickers before the relevant
    // properties are created. In the case of different IDs existing due to very old versions, this does technically
    // add a bunch of extra "invalid" and "impossible" IDs which are not normally obtainable.
    if (!player.news.seen[type]) player.news.seen[type] = [];
    
    // If the bit array isn't large enough (ie. the numerical ID is the largest we've seen so far by a long shot), then
    // we pad the array with zeroes until we can fit the new ID in before actually adding it.
    while (this.BITS_PER_MASK * player.news.seen[type].length < number) player.news.seen[type].push(0);
    // eslint-disable-next-line no-bitwise
    player.news.seen[type][Math.floor(number / this.BITS_PER_MASK)] |= 1 << (number % this.BITS_PER_MASK);
  },

  hasSeenNews(id) {
    const groups = id.match(/([a-z]+)(\d+)/u);
    const type = groups[1];
    const number = parseInt(groups[2], 10);
    const bitArray = player.news.seen[type];

    if (!bitArray || this.BITS_PER_MASK * bitArray.length < number) return false;
    // eslint-disable-next-line no-bitwise
    return (bitArray[Math.floor(number / this.BITS_PER_MASK)] |= 1 << (number % this.BITS_PER_MASK)) !== 0;
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
