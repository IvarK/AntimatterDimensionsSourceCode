let ui = {
  model: {
    player: player
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
          dims: Array.from({length: 9}, () => {
            return {
              rateOfChange: String.empty,
              multiplier: String.empty,
              amount: String.empty,
              singleCost: String.empty,
              until10Cost: String.empty,
              isAvailable: false,
              isAffordable: false,
              isAffordableUntil10: false,
              floatingText: []
            };
          }),
          shift: {
            requirement: {
              tier: 0,
              amount: 0
            },
            isBoost: false
          },
          galaxy: {
            type: String.empty,
            requirement: {
              tier: 0,
              amount: 0
            },
            extra: 0
          },
          sacrifice: {
            isAvailable: false,
            boost: String.empty
          },
          progress: {
            fill: 0,
            tooltip: String.empty
          }
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