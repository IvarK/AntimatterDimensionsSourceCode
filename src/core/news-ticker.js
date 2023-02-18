// All news IDs follow the format [letter(s)][number] so we always assume that's the case and make sure to access the
// relevant props within player.news.seen
export const NewsHandler = {
  // In principle 32 should work but something seems to go wrong with negative numbers in the function that counts
  // the number of bits in a bitmask, so we have to use 31.
  BITS_PER_MASK: 31,

  addSeenNews(id) {
    // From very old save versions; we ignore any IDs which belong to tickers which no longer exist.
    if (!GameDatabase.news.map(e => e.id).includes(id)) return;

    const groups = id.match(/([a-z]+)(\d+)/u);
    const type = groups[1];
    const number = parseInt(groups[2], 10);

    // This check is needed for migration purposes because we attempt to add news tickers before the relevant
    // properties are created in both normal and dev migrations. There's some odd behavior which results in changes
    // either not persisting outside of this function or being immediately overwritten if the props aren't specifically
    // added here for some reason (as opposed to being initialized to empty in player.js)
    if (!player.news.seen[type]) player.news.seen[type] = [];

    // If the bit array isn't large enough (ie. the numerical ID is the largest we've seen so far by a long shot), then
    // we pad the array with zeroes until we can fit the new ID in before actually adding it.
    while (this.BITS_PER_MASK * player.news.seen[type].length <= number) player.news.seen[type].push(0);
    player.news.seen[type][Math.floor(number / this.BITS_PER_MASK)] |= 1 << (number % this.BITS_PER_MASK);
    player.news.totalSeen++;
  },

  hasSeenNews(id) {
    const groups = id.match(/([a-z]+)(\d+)/u);
    const type = groups[1];
    const number = parseInt(groups[2], 10);
    const bitArray = player.news.seen[type];

    if (!bitArray || this.BITS_PER_MASK * bitArray.length < number) return false;
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
