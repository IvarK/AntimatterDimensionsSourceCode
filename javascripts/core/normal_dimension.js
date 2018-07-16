function getDimensionFinalMultiplier(tier) {
  //if (player.currentEternityChall == "eterc3" && tier > 4) return new Decimal(0)
  var name = TIER_NAMES[tier];

  let multiplier = new Decimal(player[name + 'Pow']);

  if (player.currentEternityChall == "eterc11") return player.infinityPower.pow(7).max(1).times(getDimensionBoostPower().pow(player.resets - tier + 1).max(1))
  if (player.currentChallenge == "challenge7") {
      if (tier == 4) multiplier = multiplier.pow(1.4)
      if (tier == 2) multiplier = multiplier.pow(1.7)
  }

  if ( isAchEnabled("r11") ) multiplier = multiplier.times(player.achPow);
  multiplier = multiplier.times(kongDimMult)
  multiplier = multiplier.times(kongAllDimMult)
  var conversionRate = 7
  for (i in player.reality.glyphs.active) {
    var glyph = player.reality.glyphs.active[i]
    if (glyph.type == "infinity" && glyph.effects.rate !== undefined) conversionRate += glyph.effects.rate
  }
  if (player.currentEternityChall == "eterc9") multiplier = multiplier;
  else multiplier = multiplier.times(player.infinityPower.pow(conversionRate).max(1))

  if (player.infinityUpgrades.includes("totalMult")) multiplier = multiplier.times(totalMult)
  if (player.infinityUpgrades.includes("currentMult")) multiplier = multiplier.times(currentMult)
  if (player.infinityUpgrades.includes("infinitiedMult")) multiplier = multiplier.times(infinitiedMult)
  if (player.infinityUpgrades.includes("achievementMult")) multiplier = multiplier.times(achievementMult)
  if (player.infinityUpgrades.includes("challengeMult")) multiplier = multiplier.times(challengeMult)

  if (hasInfinityMult(tier)) multiplier = multiplier.times(dimMults());
  if (tier == 1) {
      if (player.infinityUpgrades.includes("unspentBonus")) multiplier = multiplier.times(unspentBonus);
      if (isAchEnabled("r28")) multiplier = multiplier.times(1.1);
      if (isAchEnabled("r31")) multiplier = multiplier.times(1.05);
      if (isAchEnabled("r71")) multiplier = multiplier.times(3);
      if (isAchEnabled("r68")) multiplier = multiplier.times(1.5);
  }

  multiplier = multiplier.times(timeMult());
  if (tier == 8 && isAchEnabled("r23")) multiplier = multiplier.times(1.1);
  else if (isAchEnabled("r34")) multiplier = multiplier.times(1.02);
  if (tier <= 4 && isAchEnabled("r43")) multiplier = multiplier.times(1.25);
  if (isAchEnabled("r48")) multiplier = multiplier.times(1.1);
  if (isAchEnabled("r72")) multiplier = multiplier.times(1.1); // tbd
  if (isAchEnabled("r74") && player.currentChallenge != "") multiplier = multiplier.times(1.4);
  if (isAchEnabled("r77")) multiplier = multiplier.times(1+tier/100);
  if (isAchEnabled("r56") && player.thisInfinityTime < 1800) multiplier = multiplier.times(3600/(player.thisInfinityTime+1800));
  if (isAchEnabled("r78") && player.thisInfinityTime < 3) multiplier = multiplier.times(3.3/(player.thisInfinityTime+0.3));
  if (isAchEnabled("r65") && player.currentChallenge != "" && player.thisInfinityTime < 1800) multiplier = multiplier.times(Math.max(2400/(player.thisInfinityTime+600), 1))
  if (isAchEnabled("r91") && player.thisInfinityTime < 50) multiplier = multiplier.times(Math.max(301-player.thisInfinityTime*6, 1))
  if (isAchEnabled("r92") && player.thisInfinityTime < 600) multiplier = multiplier.times(Math.max(101-player.thisInfinityTime/6, 1));
  if (isAchEnabled("r84")) multiplier = multiplier.times(player.money.pow(0.00004).plus(1));
  else if (isAchEnabled("r73")) multiplier = multiplier.times(player.money.pow(0.00002).plus(1));


  if (player.timestudy.studies.includes(71) && tier !== 8) multiplier = multiplier.times(calcTotalSacrificeBoost().pow(0.25).min("1e210000"));
  if (player.timestudy.studies.includes(91)) multiplier = multiplier.times(Decimal.pow(10, Math.min(player.thisEternity, 18000)/60));
  if (player.timestudy.studies.includes(101)) multiplier = multiplier.times(Decimal.max(player.replicanti.amount, 1))
  if (player.timestudy.studies.includes(161)) multiplier = multiplier.times(new Decimal("1e616"))
  if (player.timestudy.studies.includes(234) && tier == 1) multiplier = multiplier.times(calcTotalSacrificeBoost())

  multiplier = multiplier.times(player.postC3Reward)
  if (player.challenges.includes("postc8") && tier < 8 && tier > 1) multiplier = multiplier.times(mult18);

  if (player.currentChallenge == "postc6") multiplier = multiplier.dividedBy(player.matter.max(1))
  if (player.currentChallenge == "postc8") multiplier = multiplier.times(postc8Mult)

  if (player.currentChallenge == "postc4" && player.postC4Tier != tier) multiplier = multiplier.pow(0.25)
  if (player.challenges.includes("postc4")) multiplier = multiplier.pow(1.05);
  if (player.currentEternityChall == "eterc10") multiplier = multiplier.times(ec10bonus)
  if (player.timestudy.studies.includes(193)) multiplier = multiplier.times(Decimal.pow(1.03, player.eternities).min("1e13000"))
  if (tier == 8 && player.timestudy.studies.includes(214)) multiplier = multiplier.times((calcTotalSacrificeBoost().pow(8)).min("1e46000").times(calcTotalSacrificeBoost().pow(1.1).min(new Decimal("1e125000"))))
  if (multiplier.lt(1)) multiplier = new Decimal(1)

  for (i in player.reality.glyphs.active) {
    var glyph = player.reality.glyphs.active[i]
    if (glyph.type == "power" && glyph.effects.pow !== undefined) multiplier = multiplier.pow(glyph.effects.pow)
    if (glyph.type == "power" && glyph.effects.mult !== undefined) multiplier = multiplier.times(glyph.effects.mult)
  }

  if (player.dilation.active) {
    multiplier = Decimal.pow(10, Math.pow(multiplier.log10(), 0.75))
    if (player.dilation.upgrades.includes(9)) {
      multiplier = Decimal.pow(10, Math.pow(multiplier.log10(), 1.05))
    }

    for (i in player.reality.glyphs.active) {
        var glyph = player.reality.glyphs.active[i]
        if (glyph.type == "dilation" && glyph.effects.pow !== undefined) multiplier = multiplier.pow(glyph.effects.pow)
    }
  }

  if (player.dilation.upgrades.includes(6)) multiplier = multiplier.times(player.dilation.dilatedTime.pow(308))

  
  return multiplier;
}


function getMoneyPerSecond() {
  return getDimensionFinalMultiplier(1)*Math.floor(player.firstAmount)/player.tickspeed;
}

function getDimensionDescription(tier) {
  var name = TIER_NAMES[tier];

  let description = shortenDimensions(player[name + 'Amount']) + ' (' + dimBought(tier) + ')';
  if (tier == 8) description = Math.round(player[name + 'Amount']) + ' (' + dimBought(tier) + ')';

  if (tier < 8) {
      description += '  (+' + formatValue(player.options.notation, getDimensionRateOfChange(tier), 2, 2) + '%/s)';
  }

  return description;
}

function getDimensionRateOfChange(tier) {
  if (tier == 8 || (player.currentEternityChall == "eterc3" && tier > 3)) {
      return 0;
  }

  let toGain = getDimensionProductionPerSecond(tier + 1)
  if (tier == 7 && player.currentEternityChall == "eterc7") toGain = DimensionProduction(1).times(10)

  var name = TIER_NAMES[tier];
  if (player.currentChallenge == "challenge7") {
      if (tier == 7) return 0
      else toGain = getDimensionProductionPerSecond(tier + 2);
  }
  var current = player[name + 'Amount'].max(1);
  var change  = toGain.times(10).dividedBy(current);

  return change;
}

function hasInfinityMult(tier) {
    switch (tier) {
        case 1: case 8: return player.infinityUpgrades.includes("18Mult");
        case 2: case 7: return player.infinityUpgrades.includes("27Mult");
        case 3: case 6: return player.infinityUpgrades.includes("36Mult");
        case 4: case 5: return player.infinityUpgrades.includes("45Mult");
    }
}



    function multiplySameCosts(cost) {
        var tiers = [ null, "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eight" ];
        var tierCosts = [ null, new Decimal(1e3), new Decimal(1e4), new Decimal(1e5), new Decimal(1e6), new Decimal(1e8), new Decimal(1e10), new Decimal(1e12), new Decimal(1e15) ];
    
        for (let i = 1; i <= 8; ++i) {
            if (player[tiers[i] + "Cost"].e == cost.e) player[tiers[i] + "Cost"] = player[tiers[i] + "Cost"].times(tierCosts[i])
    
        }
        if (player.tickSpeedCost.e == cost.e) player.tickSpeedCost = player.tickSpeedCost.times(player.tickspeedMultiplier)
        }
    
    
    function multiplyPC5Costs(cost, tier) {
        var tiers = [ null, "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eight" ];
    
        if (tier < 5) {
            for (var i = 1; i<9; i++) {
                if (player[tiers[i] + "Cost"].e <= cost.e) {
                    player[tiers[i] + "Cost"] = player[tiers[i] + "Cost"].times(player.costMultipliers[i-1])
                    if (player[tiers[i] + "Cost"].gte(Number.MAX_VALUE)) player.costMultipliers[i-1] = player.costMultipliers[i-1].times(10)
                }
            }
        } else {
            for (var i = 1; i<9; i++) {
                if (player[tiers[i] + "Cost"].e >= cost.e) {
                    player[tiers[i] + "Cost"] = player[tiers[i] + "Cost"].times(player.costMultipliers[i-1])
                   if (player[tiers[i] + "Cost"].gte(Number.MAX_VALUE)) player.costMultipliers[i-1] = player.costMultipliers[i-1].times(10)
                }
            }
        }
    }
    
    
    function canBuyDimension(tier) {
        if (tier == 9 ) {
            if (player.secondAmount.equals(0)) return false
            else return true
        }
    
        if (!player.break && player.money.gt(Number.MAX_VALUE)) return false;
        if (tier > player.resets + 4) return false;
        if (tier > 1 && player[TIER_NAMES[tier - 1] + 'Amount'] == 0 && player.eternities < 30) return false;
        if ((player.currentChallenge == "challenge4" || player.currentChallenge == "postc1") && tier >= 7) return false
    
        return true;
    }
    
    function getDimensionPowerMultiplier(tier) {
        let dimMult = 2;
    
    
        if (player.currentChallenge == "challenge9" || player.currentChallenge == "postc1") dimMult = Math.pow(10/0.30,Math.random())*0.30
    
        if (player.infinityUpgrades.includes('dimMult')) dimMult *= 1.1;
        if (isAchEnabled("r58")) dimMult *= 1.01;
        dimMult += ECTimesCompleted("eterc3") * 0.8
        return dimMult;
    }
    
    
    function clearDimensions(amount) {
        var tiers = [ null, "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eight" ];
    
        for (i = 1; i <= amount; i++) {
            player[tiers[i] + "Amount"] = new Decimal(0)
        }
    }
    
    
    function getDimensionCostMultiplier(tier) {
    
        var multiplier2 = [new Decimal(1e3),new Decimal(5e3),new Decimal(1e4),new Decimal(1.2e4),new Decimal(1.8e4),new Decimal(2.6e4),new Decimal(3.2e4),new Decimal(4.2e4)];
        if (player.currentChallenge == "challenge10") return multiplier2[tier - 1];
        else return player.costMultipliers[tier - 1];
    }
    
    function onBuyDimension(tier) {
        if (!player.break) {
            switch (tier) {
                case 1: giveAchievement("You gotta start somewhere"); break;
                case 2: giveAchievement("100 antimatter is a lot"); break;
                case 3: giveAchievement("Half life 3 confirmed"); break;
                case 4: giveAchievement("L4D: Left 4 Dimensions"); break;
                case 5: giveAchievement("5 Dimension Antimatter Punch"); break;
                case 6: giveAchievement("We couldn't afford 9"); break;
                case 7: giveAchievement("Not a luck related achievement"); break;
                case 8: giveAchievement("90 degrees to infinity"); break;
            }
        }
    
        if (player.eightAmount.round().eq(99)) {
            giveAchievement("The 9th Dimension is a lie");
        }
    
        player.postC4Tier = tier;
        postc8Mult = new Decimal(1)
        if (tier != 8) player.dimlife = false
        if (tier != 1) player.dead = false
    
    
    }
    
    function dimBought(tier) {
        return player[TIER_NAMES[tier]+"Bought"] % 10;
    }
    
    function buyOneDimension(tier) {
        var name = TIER_NAMES[tier];
        var cost = player[name + 'Cost'];
        auto = false;
    
        if (player.currentChallenge != "challenge10" && player.currentChallenge != "postc1") {
            if (!canBuyDimension(tier)) {
                return false;
            }
        } else {
            if (tier >= 3) {
                if (player[TIER_NAMES[tier-2] + 'Amount'].lt(cost)) return false
            }
            else if (!canBuyDimension(tier)) {
                return false;
            } else if (tier < 3 && !canAfford(cost)){
                return false;
            }
        }
    
    
    
        if (player.currentChallenge != "challenge10" && player.currentChallenge != "postc1") {
            if (!canAfford(cost)) {
                return false;
            }
        }
    
    
        if ((player.currentChallenge != "challenge10" && player.currentChallenge != "postc1") || tier < 3) {
            player.money = player.money.minus(cost);
        } else {
            player[TIER_NAMES[tier-2] + 'Amount'] = player[TIER_NAMES[tier-2] + 'Amount'].minus(cost)
        }
    
        player[name + 'Amount'] = player[name + 'Amount'].plus(1);
        player[name + 'Bought']++;
    
        if (dimBought(tier) === 0) {
            player[name + 'Pow']  = player[name + 'Pow'].times(getDimensionPowerMultiplier(tier));
            if (player.currentChallenge != "challenge5" && player.currentChallenge != "postc5") player[name + 'Cost'] = player[name + 'Cost'].times(getDimensionCostMultiplier(tier));
            else if (player.currentChallenge == "postc5") multiplyPC5Costs(player[name + 'Cost'], tier)
            else multiplySameCosts(cost);
            if (player[name + 'Cost'].gte(Number.MAX_VALUE)) player.costMultipliers[tier-1] = player.costMultipliers[tier-1].times(player.dimensionMultDecrease)
            floatText(name+"D", "x" + shortenMoney(getDimensionPowerMultiplier(tier)))
        }
    
        if (player.currentChallenge == "challenge2" || player.currentChallenge == "postc1") player.chall2Pow = 0;
        if (player.currentChallenge == "challenge8" || player.currentChallenge == "postc1") clearDimensions(tier-1);
    
        onBuyDimension(tier);
    
    
        return true;
    }
    
    function buyManyDimension(tier) {
        var name = TIER_NAMES[tier];
        var cost = player[name + 'Cost'].times(10 - dimBought(tier));
    
        auto = false;
    
        if ((player.currentChallenge == "challenge12" || player.currentChallenge == "postc1" || player.currentChallenge == "postc6") && player.matter.equals(0)) player.matter = new Decimal(1);
        if (player.currentChallenge != "challenge10" && player.currentChallenge != "postc1") {
            if (!canBuyDimension(tier)) {
                return false;
            }
        } else {
            if (tier >= 3) {
                if (!canBuyDimension(tier)) return false
                if (player[TIER_NAMES[tier-2] + 'Amount'].lt(cost)) return false
            }
            else if (!canBuyDimension(tier)) {
                return false;
            } else if (tier < 3 && !canAfford(cost)){
                return false;
            }
        }
    
    
    
        if (player.currentChallenge != "challenge10" && player.currentChallenge != "postc1") {
            if (!canAfford(cost)) {
                return false;
            }
        }
    
        if ((player.currentChallenge != "challenge10" && player.currentChallenge != "postc1") || tier < 3) {
            player.money = player.money.minus(cost);
        } else {
            player[TIER_NAMES[tier-2] + 'Amount'] = player[TIER_NAMES[tier-2] + 'Amount'].minus(cost)
        }
    
        player[name + 'Amount'] = player[name + 'Amount'].plus(10 - dimBought(tier));
        player[name + 'Bought'] = player[name + 'Bought'] + (10 - dimBought(tier));
        player[name + 'Pow']  = player[name + 'Pow'].times(getDimensionPowerMultiplier(tier));
        if (player.currentChallenge != "challenge5" && player.currentChallenge != "postc5" ) player[name + 'Cost'] = player[name + 'Cost'].times((getDimensionCostMultiplier(tier)));
        else if (player.currentChallenge == "postc5") multiplyPC5Costs(player[name + 'Cost'], tier)
        else multiplySameCosts(player[name + 'Cost']);
        if (player[name + 'Cost'].gte(Number.MAX_VALUE)) player.costMultipliers[tier-1] = player.costMultipliers[tier-1].times(player.dimensionMultDecrease)
        if (player.currentChallenge == "challenge2" || player.currentChallenge == "postc1") player.chall2Pow = 0;
        if (player.currentChallenge == "challenge8" || player.currentChallenge == "postc1") clearDimensions(tier-1);
        floatText(name+"D", "x" + shortenMoney(getDimensionPowerMultiplier(tier)))
        onBuyDimension(tier);
    
        return true;
    }
    
    
    const initCost = [null, new Decimal(10), new Decimal(1e2), new Decimal(1e4), new Decimal(1e6), new Decimal(1e9), new Decimal(1e12), new Decimal(1e18), new Decimal(1e24)]
    const costMults = [null, new Decimal(1e3), new Decimal(1e4), new Decimal(1e5), new Decimal(1e6), new Decimal(1e8), new Decimal(1e10), new Decimal(1e12), new Decimal(1e15)]
    function buyManyDimensionAutobuyer(tier, bulk) {
    
        var name = TIER_NAMES[tier];
        var cost = player[name + 'Cost'].times(10 - dimBought(tier))
        if (!player.break && player.money.gt(Number.MAX_VALUE)) return false;

        if (tier >= 3 && (player.currentChallenge == "challenge10" || player.currentChallenge == "postc1")) {
            if (!canBuyDimension(tier)) return false
            if (player[TIER_NAMES[tier-2] + 'Amount'].lt(cost)) return false
                if (canBuyDimension(tier)) {
                    if (cost.lt(player[TIER_NAMES[tier-2]+"Amount"]) && dimBought(tier) != 0) {
                        player[TIER_NAMES[tier-2]+"Amount"] = player[TIER_NAMES[tier-2]+"Amount"].minus(cost)
                        player[name + "Amount"] = Decimal.round(player[name + "Amount"].plus(10 - dimBought(tier)))
                        player[name + 'Bought'] += (10 - dimBought(tier));
                        player[name + 'Pow']  = player[name + 'Pow'].times(getDimensionPowerMultiplier(tier))
                        player[name + "Cost"] = player[name + "Cost"].times(getDimensionCostMultiplier(tier))
                    }
                    var x = bulk
                    while (player[TIER_NAMES[tier-2]+"Amount"].gt(player[name + "Cost"].times(10)) && x > 0) {
                        player[TIER_NAMES[tier-2]+"Amount"] = player[TIER_NAMES[tier-2]+"Amount"].minus(player[name + "Cost"].times(10))
                        player[name + "Cost"] = player[name + "Cost"].times(getDimensionCostMultiplier(tier))
                        player[name + "Amount"] = Decimal.round(player[name + "Amount"].plus(10))
                        player[name + 'Bought'] += 10
                        player[name + "Pow"] = player[name + "Pow"].times(getDimensionPowerMultiplier(tier))
                        if (player[name + 'Cost'].gte(Number.MAX_VALUE)) player.costMultipliers[tier-1] = player.costMultipliers[tier-1].times(player.dimensionMultDecrease)
                        x--;
                    }


                    onBuyDimension(tier);
                }
        } else {
            if (!canBuyDimension(tier)) return false
                if (cost.lt(player.money) && dimBought(tier) != 0) {
                    player.money = player.money.minus(cost)
                    player[name + "Amount"] = Decimal.round(player[name + "Amount"].plus(10 - dimBought(tier)))
                    player[name + 'Bought'] += (10 - dimBought(tier));
                    player[name + 'Pow']  = player[name + 'Pow'].times(getDimensionPowerMultiplier(tier))
                    player[name + "Cost"] = player[name + "Cost"].times(getDimensionCostMultiplier(tier))
                }
                if (player.money.lt(player[name + "Cost"].times(10))) return false
                var x = bulk
    
            if ((player.dimensionMultDecrease > 3 || player.currentChallenge == "postc5" || player.currentChallenge == "challenge5")) {
                while (player.money.gte(player[name + "Cost"].times(10)) && x > 0) {
                        player.money = player.money.minus(player[name + "Cost"].times(10))
                        if (player.currentChallenge != "challenge5" && player.currentChallenge != "postc5") player[name + "Cost"] = player[name + "Cost"].times(getDimensionCostMultiplier(tier))
                        else if (player.currentChallenge == "postc5") multiplyPC5Costs(player[name + 'Cost'], tier)
                        else multiplySameCosts(player[name + 'Cost'])
                        player[name + "Amount"] = Decimal.round(player[name + "Amount"].plus(10))
                        player[name + 'Bought'] += 10
                        player[name + "Pow"] = player[name + "Pow"].times(getDimensionPowerMultiplier(tier))
                        if (player[name + 'Cost'].gte(Number.MAX_VALUE)) player.costMultipliers[tier-1] = player.costMultipliers[tier-1].times(player.dimensionMultDecrease)
                        if (player.currentChallenge == "challenge8") clearDimensions(tier-1)
                        x--;
                }
            } else {
                if (player[name + "Cost"].lt(Number.MAX_VALUE)) {
                    let failsafe = 0
                    while (player.money.gt(player[name + "Cost"].times(10)) && x > 0 && player[name + "Cost"].lte(Number.MAX_VALUE) && failsafe < 150) {
                        player.money = player.money.minus(player[name + "Cost"].times(10))
                        if (player.currentChallenge != "challenge5" && player.currentChallenge != "postc5") player[name + "Cost"] = player[name + "Cost"].times(getDimensionCostMultiplier(tier))
                        else if (player.currentChallenge == "postc5") multiplyPC5Costs(player[name + 'Cost'], tier)
                        else multiplySameCosts(player[name + 'Cost'])
                        player[name + "Amount"] = Decimal.round(player[name + "Amount"].plus(10))
                        player[name + 'Bought'] += 10
                        player[name + "Pow"] = player[name + "Pow"].times(getDimensionPowerMultiplier(tier))
                        if (player[name + 'Cost'].gte(Number.MAX_VALUE)) player.costMultipliers[tier-1] = player.costMultipliers[tier-1].times(player.dimensionMultDecrease)
                        if (player.currentChallenge == "challenge8") clearDimensions(tier-1)
                        x--;
                        failsafe++;
                    }
                }
                if (player[name + "Cost"].gte(Number.MAX_VALUE)) {
                    var a = Math.log10(Math.sqrt(player.dimensionMultDecrease))
                    var b = player.costMultipliers[tier-1].dividedBy(Math.sqrt(player.dimensionMultDecrease)).log10()
                    var c = player[name + "Cost"].dividedBy(player.money).log10()
                    var discriminant = Math.pow(b, 2) - (c *a* 4)
                    if (discriminant < 0) return false
                    var buying = Math.floor((Math.sqrt(Math.pow(b, 2) - (c *a *4))-b)/(2 * a))+1
                    if (buying <= 0) return false
                    if (buying > bulk) buying = bulk
                    player[name+"Amount"] = Decimal.round(player[name+"Amount"].plus(10*buying))
                    preInfBuy = Math.floor(1 + (308 - initCost[tier].log10()) / costMults[tier].log10())
                    postInfBuy = player[name + 'Bought']/10+buying - preInfBuy - 1
                    postInfInitCost = initCost[tier].times(Decimal.pow(costMults[tier], preInfBuy))
                    player[name + 'Bought'] += 10*buying
                    player[name + "Pow"] = player[name + "Pow"].times(Decimal.pow(getDimensionPowerMultiplier(tier), buying))
    
                    newCost = postInfInitCost.times(Decimal.pow(costMults[tier], postInfBuy)).times(Decimal.pow(player.dimensionMultDecrease, postInfBuy * (postInfBuy+1)/2))
                    newMult = costMults[tier].times(Decimal.pow(player.dimensionMultDecrease, postInfBuy+1))
                    //if (buying > 0 )player[name + "Cost"] = player.costMultipliers[tier-1].times(Decimal.pow(player.dimensionMultDecrease, (buying * buying - buying)/2)).times(player[name + "Cost"])
    
                    player[name + "Cost"] = newCost
                    player.costMultipliers[tier-1] = newMult
                    if (player.money.gte(player[name + "Cost"])) player.money = player.money.minus(player[name + "Cost"])
                    player[name + "Cost"] = player[name + "Cost"].times(player.costMultipliers[tier-1])
                    player.costMultipliers[tier-1] = player.costMultipliers[tier-1].times(player.dimensionMultDecrease)
                }
            }
        }
    if ((player.currentChallenge == "challenge12" || player.currentChallenge == "postc1" || player.currentChallenge == "postc6") && player.matter.equals(0)) player.matter = new Decimal(1);
    if (player.currentChallenge == "challenge2" || player.currentChallenge == "postc1") player.chall2Pow = 0;
    if (player.currentChallenge == "postc1") clearDimensions(tier-1);
    player.postC4Tier = tier;
    if (tier != 8) player.dimlife = false
    if (tier != 1) player.dead = false
}


function canAfford(cost) {
    return ((cost.lt(new Decimal("1.79e308")) && !player.break) || player.break) && cost.lte(player.money);
}


document.getElementById("first").onclick = function () {
    if (buyOneDimension(1)) {
        // This achievement is granted only if the buy one button is pressed.
        if (player.firstAmount >= 1e150) {
            giveAchievement("There's no point in doing that");
        }
        if ((player.currentChallenge == "challenge12" || player.currentChallenge == "postc1") && player.matter.equals(0)) player.matter = new Decimal(1);
    }
    if (player.firstAmount.lt(1)) {
        player.money = new Decimal("0")
        player.firstAmount = player.firstAmount.plus(1);
        player.firstBought += 1;
        giveAchievement("You gotta start somewhere");
    }
};

document.getElementById("second").onclick = function () {
    buyOneDimension(2);
    if ((player.currentChallenge == "challenge12" || player.currentChallenge == "postc1" || player.currentChallenge == "postc6") && player.matter.equals(0)) player.matter = new Decimal(1);
};

document.getElementById("third").onclick = function () {
    buyOneDimension(3);
    if ((player.currentChallenge == "challenge12" || player.currentChallenge == "postc1" || player.currentChallenge == "postc6") && player.matter.equals(0))player.matter = new Decimal(1);
};

document.getElementById("fourth").onclick = function () {
    buyOneDimension(4);
    if ((player.currentChallenge == "challenge12" || player.currentChallenge == "postc1" || player.currentChallenge == "postc6") && player.matter.equals(0)) player.matter = new Decimal(1);
};

document.getElementById("fifth").onclick = function () {
    buyOneDimension(5);
};

document.getElementById("sixth").onclick = function () {
    buyOneDimension(6);
};

document.getElementById("seventh").onclick = function () {
    buyOneDimension(7);
};

document.getElementById("eight").onclick = function () {
    buyOneDimension(8);
};

document.getElementById("firstMax").onclick = function () {
    buyManyDimension(1);
    if ((player.currentChallenge == "challenge12" || player.currentChallenge == "postc1") && player.matter.equals(0)) player.matter = new Decimal(1);
};

document.getElementById("secondMax").onclick = function () {
    buyManyDimension(2);
    if ((player.currentChallenge == "challenge12" || player.currentChallenge == "postc1") && player.matter.equals(0)) player.matter = new Decimal(1);
};

document.getElementById("thirdMax").onclick = function () {
    buyManyDimension(3);
};

document.getElementById("fourthMax").onclick = function () {
    buyManyDimension(4);
};

document.getElementById("fifthMax").onclick = function () {
    buyManyDimension(5);
};

document.getElementById("sixthMax").onclick = function () {
    buyManyDimension(6);
};

document.getElementById("seventhMax").onclick = function () {
    buyManyDimension(7);
};

document.getElementById("eightMax").onclick = function () {
    buyManyDimension(8);
};


function timeMult() {
    var mult = new Decimal(1)
    if (player.infinityUpgrades.includes("timeMult")) mult = mult.times(Math.pow(player.totalTimePlayed / 1200, 0.15));
    if (player.infinityUpgrades.includes("timeMult2")) mult = mult.times(Decimal.max(Math.pow(player.thisInfinityTime / 2400, 0.25), 1));
    if (isAchEnabled("r76")) mult = mult.times(Math.pow(player.totalTimePlayed / (600*60*48), 0.05));
    return mult;
}

function dimMults() {
    if (player.timestudy.studies.includes(31)) return Decimal.pow(1 + (getInfinitied() * 0.2), 4)
    else return new Decimal(1 + (getInfinitied() * 0.2))
}

function getDimensionProductionPerSecond(tier) {
    let ret = Decimal.floor(player[TIER_NAMES[tier] + 'Amount']).times(getDimensionFinalMultiplier(tier)).times(1000).dividedBy(player.tickspeed)
    if (player.currentChallenge == "challenge7") {
        if (tier == 4) ret = player[TIER_NAMES[tier] + 'Amount'].floor().pow(1.3).times(getDimensionFinalMultiplier(tier)).dividedBy(player.tickspeed.dividedBy(1000))
        else if (tier == 2) ret = player[TIER_NAMES[tier] + 'Amount'].floor().pow(1.5).times(getDimensionFinalMultiplier(tier)).dividedBy(player.tickspeed.dividedBy(1000))
    }
    if (player.currentChallenge == "challenge2" || player.currentChallenge == "postc1") ret = ret.times(player.chall2Pow)
    if (player.dilation.active) {
        let tick = new Decimal(player.tickspeed)
        tick = Decimal.pow(10, Math.pow(Math.abs(tick.log10()), 0.75))
        if (player.dilation.upgrades.includes(9)) {
            tick = Decimal.pow(10, Math.pow(Math.abs(tick.log10()), 1.05))
          }
        tick = new Decimal(1).dividedBy(tick)
        ret = Decimal.floor(player[TIER_NAMES[tier] + 'Amount']).times(getDimensionFinalMultiplier(tier)).times(1000).dividedBy(tick)
    }
    if (((player.currentChallenge !== "" && !player.currentChallenge.includes("post")) || !player.break) && ret.gte(Number.MAX_VALUE)) ret = ret.min("1e312")
    return ret;
}