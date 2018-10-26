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
              rateOfChange: new Decimal(0),
              multiplier: new Decimal(0),
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
            boost: new Decimal(0)
          },
          progress: {
            fill: 0,
            tooltip: String.empty
          }
        },
        infinity: {
          dims: Array.from({length: 9}, () => {
            return {
              rateOfChange: new Decimal(0),
              multiplier: new Decimal(0),
              isAvailable: false,
            };
          }),
          multiplier: new Decimal(0),
          powerPerSecond: new Decimal(0)
        },
        time: {
          dims: Array.from({length: 9}, () => {
            return {
              rateOfChange: new Decimal(0),
              multiplier: new Decimal(0),
              isAvailable: false,
              amount: new Decimal(0),
            };
          }),
          shardsPerSecond: new Decimal(0)
        }
      },
      statistics: {
        subtab: String.empty
      }
    },
    shiftDown: false
  }
};