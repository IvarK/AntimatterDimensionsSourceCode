export type DecimalSource = Decimal | number | string | undefined | null;

export declare class Decimal {
    exponent: number;
    mantissa: number;
    normalize(): this;
    fromMantissaExponent(mantissa: number, exponent: number): this;
    fromMantissaExponent_noNormalize(mantissa: number, exponent: number): this;
    fromDecimal(value: Decimal): this;
    fromNumber(value: number): this;
    fromString(value: string): this;
    fromValue(value: DecimalSource): this;
    constructor(value?: DecimalSource);
    static fromMantissaExponent(mantissa: number, exponent: number): Decimal;
    static fromMantissaExponent_noNormalize(mantissa: number, exponent: number): Decimal;
    static fromDecimal(value: Decimal): Decimal;
    static fromNumber(value: number): Decimal;
    static fromString(value: string): Decimal;
    static fromValue(value: DecimalSource): Decimal;
    toNumber(): number;
    mantissaWithDecimalPlaces(places: number): number;
    toString(): string;
    toExponential(places: number): string;
    toFixed(places: number): string;
    toPrecision(places: number): string;
    valueOf(): string;
    toJSON(): string;
    toStringWithDecimalPlaces(places: number): string;
    abs(): Decimal;
    static abs(value: DecimalSource): Decimal;
    neg(): Decimal;
    static neg(value: DecimalSource): Decimal;
    negate(): Decimal;
    static negate(value: DecimalSource): Decimal;
    negated(): Decimal;
    static negated(value: DecimalSource): Decimal;
    sign(): number;
    static sign(value: DecimalSource): number;
    sgn(): number;
    static sgn(value: DecimalSource): number;
    round(): Decimal;
    static round(value: DecimalSource): Decimal;
    floor(): Decimal;
    static floor(value: DecimalSource): Decimal;
    ceil(): Decimal;
    static ceil(value: DecimalSource): Decimal;
    trunc(): Decimal;
    static trunc(value: DecimalSource): Decimal;
    add(value: DecimalSource): Decimal;
    static add(value: DecimalSource, other: DecimalSource): Decimal;
    plus(value: DecimalSource): Decimal;
    static plus(value: DecimalSource, other: DecimalSource): Decimal;
    sub(value: DecimalSource): Decimal;
    static sub(value: DecimalSource, other: DecimalSource): Decimal;
    subtract(value: DecimalSource): Decimal;
    static subtract(value: DecimalSource, other: DecimalSource): Decimal;
    minus(value: DecimalSource): Decimal;
    static minus(value: DecimalSource, other: DecimalSource): Decimal;
    mul(value: DecimalSource): Decimal;
    static mul(value: DecimalSource, other: DecimalSource): Decimal;
    multiply(value: DecimalSource): Decimal;
    static multiply(value: DecimalSource, other: DecimalSource): Decimal;
    times(value: DecimalSource): Decimal;
    static times(value: DecimalSource, other: DecimalSource): Decimal;
    div(value: DecimalSource): Decimal;
    static div(value: DecimalSource, other: DecimalSource): Decimal;
    divide(value: DecimalSource): Decimal;
    static divide(value: DecimalSource, other: DecimalSource): Decimal;
    divideBy(value: DecimalSource): Decimal;
    dividedBy(value: DecimalSource): Decimal;
    recip(): Decimal;
    static recip(value: DecimalSource): Decimal;
    reciprocal(): Decimal;
    static reciprocal(value: DecimalSource): Decimal;
    reciprocate(): Decimal;
    static reciprocate(value: DecimalSource): Decimal;
    cmp(value: DecimalSource): 1 | 0 | -1;
    static cmp(value: DecimalSource, other: DecimalSource): 1 | 0 | -1;
    compare(value: DecimalSource): 1 | 0 | -1;
    static compare(value: DecimalSource, other: DecimalSource): 1 | 0 | -1;
    eq(value: DecimalSource): boolean;
    static eq(value: DecimalSource, other: DecimalSource): boolean;
    equals(value: DecimalSource): boolean;
    static equals(value: DecimalSource, other: DecimalSource): boolean;
    neq(value: DecimalSource): boolean;
    static neq(value: DecimalSource, other: DecimalSource): boolean;
    notEquals(value: DecimalSource): boolean;
    static notEquals(value: DecimalSource, other: DecimalSource): boolean;
    lt(value: DecimalSource): boolean;
    static lt(value: DecimalSource, other: DecimalSource): boolean;
    lte(value: DecimalSource): boolean;
    static lte(value: DecimalSource, other: DecimalSource): boolean;
    gt(value: DecimalSource): boolean;
    static gt(value: DecimalSource, other: DecimalSource): boolean;
    gte(value: DecimalSource): boolean;
    static gte(value: DecimalSource, other: DecimalSource): boolean;
    max(value: DecimalSource): Decimal;
    static max(value: DecimalSource, other: DecimalSource): Decimal;
    min(value: DecimalSource): Decimal;
    static min(value: DecimalSource, other: DecimalSource): Decimal;
    cmp_tolerance(value: DecimalSource, tolerance: DecimalSource): 1 | 0 | -1;
    static cmp_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource): 1 | 0 | -1;
    compare_tolerance(value: DecimalSource, tolerance: DecimalSource): 1 | 0 | -1;
    static compare_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource): 1 | 0 | -1;
    eq_tolerance(value: DecimalSource, tolerance: DecimalSource): boolean;
    static eq_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource): boolean;
    equals_tolerance(value: DecimalSource, tolerance: DecimalSource): boolean;
    static equals_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource): boolean;
    neq_tolerance(value: DecimalSource, tolerance: DecimalSource): boolean;
    static neq_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource): boolean;
    notEquals_tolerance(value: DecimalSource, tolerance: DecimalSource): boolean;
    static notEquals_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource): boolean;
    lt_tolerance(value: DecimalSource, tolerance: DecimalSource): boolean;
    static lt_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource): boolean;
    lte_tolerance(value: DecimalSource, tolerance: DecimalSource): boolean;
    static lte_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource): boolean;
    gt_tolerance(value: DecimalSource, tolerance: DecimalSource): boolean;
    static gt_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource): boolean;
    gte_tolerance(value: DecimalSource, tolerance: DecimalSource): boolean;
    static gte_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource): boolean;
    log10(): number;
    static log10(value: DecimalSource): number;
    log(base: number): number;
    static log(value: DecimalSource, base: number): number;
    log2(): number;
    static log2(value: DecimalSource): number;
    ln(): number;
    static ln(value: DecimalSource): number;
    logarithm(base: number): number;
    static logarithm(value: DecimalSource, base: number): number;
    pow(value: number | Decimal): Decimal;
    static pow10(value: number): Decimal;
    pow_base(value: DecimalSource): Decimal;
    static pow(value: DecimalSource, other: number | Decimal): Decimal;
    factorial(): Decimal;
    exp(): number | Decimal;
    static exp(value: DecimalSource): number | Decimal;
    sqr(): Decimal;
    static sqr(value: DecimalSource): Decimal;
    sqrt(): Decimal;
    static sqrt(value: DecimalSource): Decimal;
    cube(): Decimal;
    static cube(value: DecimalSource): Decimal;
    cbrt(): Decimal;
    static cbrt(value: DecimalSource): Decimal;
    sinh(): Decimal;
    cosh(): Decimal;
    tanh(): Decimal;
    asinh(): Decimal;
    acosh(): Decimal;
    atanh(): Decimal;
    // If you're willing to spend 'resourcesAvailable' and want to buy something
    // with exponentially increasing cost each purchase
    // (start at priceStart, multiply by priceRatio, already own currentOwned),
    // how much of it can you buy? Adapted from Trimps source code.
    static affordGeometricSeries(resourcesAvailable: DecimalSource, priceStart: DecimalSource, priceRatio: DecimalSource, currentOwned: DecimalSource): Decimal;
    // How much resource would it cost to buy (numItems) items if you already have currentOwned,
    // the initial price is priceStart and it multiplies by priceRatio each purchase?
    static sumGeometricSeries(numItems: DecimalSource, priceStart: DecimalSource, priceRatio: DecimalSource, currentOwned: DecimalSource): Decimal;
    // If you're willing to spend 'resourcesAvailable' and want to buy something
    // with additively increasing cost each purchase
    // (start at priceStart, add by priceAdd, already own currentOwned),
    // how much of it can you buy?
    static affordArithmeticSeries(resourcesAvailable: DecimalSource, priceStart: DecimalSource, priceAdd: DecimalSource, currentOwned: DecimalSource): Decimal;
    // How much resource would it cost to buy (numItems) items if you already have currentOwned,
    // the initial price is priceStart and it adds priceAdd each purchase?
    // Adapted from http://www.mathwords.com/a/arithmetic_series.htm
    static sumArithmeticSeries(numItems: DecimalSource, priceStart: DecimalSource, priceAdd: DecimalSource, currentOwned: DecimalSource): Decimal;
    //Joke function from Realm Grinder
    ascensionPenalty(ascensions: number): Decimal;
    //When comparing two purchases that cost (resource) and increase your resource/sec by (delta_RpS),
    // the lowest efficiency score is the better one to purchase.
    // From Frozen Cookies: http://cookieclicker.wikia.com/wiki/Frozen_Cookies_(JavaScript_Add-on)#Efficiency.3F_What.27s_that.3F
    static efficiencyOfPurchase(cost: DecimalSource, current_RpS: DecimalSource, delta_RpS: DecimalSource): Decimal;
    //Joke function from Cookie Clicker. It's 'egg'
    egg(): Decimal;
    lessThanOrEqualTo(other: DecimalSource): boolean;
    lessThan(other: DecimalSource): boolean;
    greaterThanOrEqualTo(other: DecimalSource): boolean;
    greaterThan(other: DecimalSource): boolean;
    static randomDecimalForTesting(absMaxExponent: number): Decimal;
}
