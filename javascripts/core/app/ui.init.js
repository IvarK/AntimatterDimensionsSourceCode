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
    tab: {
      current: undefined,
      dimensions: {
        normal: {
          dims: Array.from({length: 9}, () => {
            return {
              rateOfChange: new Decimal(0),
              multiplier: new Decimal(0),
              isAvailable: false,
              isAffordable: false,
              isAffordableUntil10: false
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
          }
        }
      }
    },
    shiftDown: false
  }
};