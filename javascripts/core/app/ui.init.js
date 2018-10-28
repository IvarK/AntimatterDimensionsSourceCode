let ui = {
  model: {
    player: player,
    options: player.options
  },
  actions: {},
  view: {
    modal: {
      current: undefined,
      cloudConflicts: [],
      message: ""
    },
    tabs: {
      current: undefined,
      dimensions: {
        subtab: String.empty,
        normal: {
          floatingText: Array.from({length: 9}, () => [])
        },
        infinity: {
          dims: Array.from({length: 9}, () => {
            return {
              amount: String.empty,
              rateOfChange: String.empty,
              multiplier: String.empty,
              cost: String.empty,
              isAvailable: false,
              isAffordable: false,
              isCapped: false,
              capIP: String.empty
            };
          }),
          multiplier: String.empty,
          infinityPower: String.empty,
          powerPerSecond: String.empty
        },
        time: {
          dims: Array.from({length: 9}, () => {
            return {
              amount: String.empty,
              cost: String.empty,
              rateOfChange: String.empty,
              multiplier: String.empty,
              isAvailable: false,
              isAffordable: false
            };
          }),
          timeShards: String.empty,
          shardsPerSecond: String.empty
        }
      },
      statistics: {
        subtab: String.empty
      }
    },
    shiftDown: false
  }
};