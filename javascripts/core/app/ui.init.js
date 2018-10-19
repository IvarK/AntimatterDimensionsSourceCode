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
          rateOfChange: Array(9).fill(new Decimal(0)),
          multiplier: Array(9).fill(new Decimal(0)),
          availability: Array(9).fill(false),
          affordability: Array(9).fill(false),
          affordabilityUntil10: Array(9).fill(false),
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