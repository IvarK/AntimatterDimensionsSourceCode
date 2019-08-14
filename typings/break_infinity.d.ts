export declare type DecimalSource = Decimal | number | string;
/**
 * The Decimal's value is simply mantissa * 10^exponent.
 */
export default class Decimal {
    m: number;
    e: number;
    s: number;
    static fromMantissaExponent(mantissa: number, exponent: number): Decimal;
    static fromMantissaExponent_noNormalize(mantissa: number, exponent: number): Decimal;
    static fromDecimal(value: Decimal): Decimal;
    static fromNumber(value: number): Decimal;
    static fromString(value: string): Decimal;
    static fromValue(value: DecimalSource): Decimal;
    static fromValue_noAlloc(value: DecimalSource): Decimal;
    static abs(value: DecimalSource): Decimal;
    static neg(value: DecimalSource): Decimal;
    static negate(value: DecimalSource): Decimal;
    static negated(value: DecimalSource): Decimal;
    static sign(value: DecimalSource): number;
    static sgn(value: DecimalSource): number;
    static round(value: DecimalSource): Decimal;
    static floor(value: DecimalSource): Decimal;
    static ceil(value: DecimalSource): Decimal;
    static trunc(value: DecimalSource): Decimal;
    static add(value: DecimalSource, other: DecimalSource): Decimal;
    static plus(value: DecimalSource, other: DecimalSource): Decimal;
    static sub(value: DecimalSource, other: DecimalSource): Decimal;
    static subtract(value: DecimalSource, other: DecimalSource): Decimal;
    static minus(value: DecimalSource, other: DecimalSource): Decimal;
    static mul(value: DecimalSource, other: DecimalSource): Decimal;
    static multiply(value: DecimalSource, other: DecimalSource): Decimal;
    static times(value: DecimalSource, other: DecimalSource): Decimal;
    static div(value: DecimalSource, other: DecimalSource): Decimal;
    static divide(value: DecimalSource, other: DecimalSource): Decimal;
    static recip(value: DecimalSource): Decimal;
    static reciprocal(value: DecimalSource): Decimal;
    static reciprocate(value: DecimalSource): Decimal;
    static cmp(value: DecimalSource, other: DecimalSource): 0 | 1 | -1;
    static compare(value: DecimalSource, other: DecimalSource): 0 | 1 | -1;
    static eq(value: DecimalSource, other: DecimalSource): boolean;
    static equals(value: DecimalSource, other: DecimalSource): boolean;
    static neq(value: DecimalSource, other: DecimalSource): boolean;
    static notEquals(value: DecimalSource, other: DecimalSource): boolean;
    static lt(value: DecimalSource, other: DecimalSource): boolean;
    static lte(value: DecimalSource, other: DecimalSource): boolean;
    static gt(value: DecimalSource, other: DecimalSource): boolean;
    static gte(value: DecimalSource, other: DecimalSource): boolean;
    static max(value: DecimalSource, other: DecimalSource): Decimal;
    static min(value: DecimalSource, other: DecimalSource): Decimal;
    static clamp(value: DecimalSource, min: DecimalSource, max: DecimalSource): Decimal;
    static clampMin(value: DecimalSource, min: DecimalSource): Decimal;
    static clampMax(value: DecimalSource, max: DecimalSource): Decimal;
    static cmp_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource): 0 | 1 | -1;
    static compare_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource): 0 | 1 | -1;
    static eq_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource): boolean;
    static equals_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource): boolean;
    static neq_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource): boolean;
    static notEquals_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource): boolean;
    static lt_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource): boolean;
    static lte_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource): boolean;
    static gt_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource): boolean;
    static gte_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource): boolean;
    static log10(value: DecimalSource): number;
    static absLog10(value: DecimalSource): number;
    static pLog10(value: DecimalSource): number;
    static log(value: DecimalSource, base: number): number;
    static log2(value: DecimalSource): number;
    static ln(value: DecimalSource): number;
    static logarithm(value: DecimalSource, base: number): number;
    static pow10(value: number): Decimal;
    static pow(value: DecimalSource, other: number | Decimal): Decimal;
    static exp(value: DecimalSource): Decimal;
    static sqr(value: DecimalSource): Decimal;
    static sqrt(value: DecimalSource): Decimal;
    static cube(value: DecimalSource): Decimal;
    static cbrt(value: DecimalSource): Decimal;
    /**
     * If you're willing to spend 'resourcesAvailable' and want to buy something
     * with exponentially increasing cost each purchase (start at priceStart,
     * multiply by priceRatio, already own currentOwned), how much of it can you buy?
     * Adapted from Trimps source code.
     */
    static affordGeometricSeries(resourcesAvailable: DecimalSource, priceStart: DecimalSource, priceRatio: DecimalSource, currentOwned: number | Decimal): Decimal;
    /**
     * How much resource would it cost to buy (numItems) items if you already have currentOwned,
     * the initial price is priceStart and it multiplies by priceRatio each purchase?
     */
    static sumGeometricSeries(numItems: number | Decimal, priceStart: DecimalSource, priceRatio: DecimalSource, currentOwned: number | Decimal): Decimal;
    /**
     * If you're willing to spend 'resourcesAvailable' and want to buy something with additively
     * increasing cost each purchase (start at priceStart, add by priceAdd, already own currentOwned),
     * how much of it can you buy?
     */
    static affordArithmeticSeries(resourcesAvailable: DecimalSource, priceStart: DecimalSource, priceAdd: DecimalSource, currentOwned: DecimalSource): Decimal;
    /**
     * How much resource would it cost to buy (numItems) items if you already have currentOwned,
     * the initial price is priceStart and it adds priceAdd each purchase?
     * Adapted from http://www.mathwords.com/a/arithmetic_series.htm
     */
    static sumArithmeticSeries(numItems: DecimalSource, priceStart: DecimalSource, priceAdd: DecimalSource, currentOwned: DecimalSource): Decimal;
    /**
     * When comparing two purchases that cost (resource) and increase your resource/sec by (deltaRpS),
     * the lowest efficiency score is the better one to purchase.
     * From Frozen Cookies:
     * http://cookieclicker.wikia.com/wiki/Frozen_Cookies_(JavaScript_Add-on)#Efficiency.3F_What.27s_that.3F
     */
    static efficiencyOfPurchase(cost: DecimalSource, currentRpS: DecimalSource, deltaRpS: DecimalSource): Decimal;
    static randomDecimalForTesting(absMaxExponent: number): Decimal;
    /**
     * A number (double) with absolute value between [1, 10) OR exactly 0.
     * If mantissa is ever 10 or greater, it should be normalized
     * (divide by 10 and add 1 to exponent until it is less than 10,
     * or multiply by 10 and subtract 1 from exponent until it is 1 or greater).
     * Infinity/-Infinity/NaN will cause bad things to happen.
     */
    mantissa: number;
    /**
     * A number (integer) between -EXP_LIMIT and EXP_LIMIT.
     * Non-integral/out of bounds will cause bad things to happen.
     */
    exponent: number;
    constructor(value?: DecimalSource);
    /**
     * When mantissa is very denormalized, use this to normalize much faster.
     */
    normalize(): this | undefined;
    fromMantissaExponent(mantissa: number, exponent: number): this;
    /**
     * Well, you know what you're doing!
     */
    fromMantissaExponent_noNormalize(mantissa: number, exponent: number): this;
    fromDecimal(value: Decimal): this;
    fromNumber(value: number): this;
    fromString(value: string): this;
    fromValue(value?: DecimalSource): this;
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
    neg(): Decimal;
    negate(): Decimal;
    negated(): Decimal;
    sign(): number;
    sgn(): number;
    round(): Decimal;
    floor(): Decimal;
    ceil(): Decimal;
    trunc(): Decimal;
    add(value: DecimalSource): Decimal;
    plus(value: DecimalSource): Decimal;
    sub(value: DecimalSource): Decimal;
    subtract(value: DecimalSource): Decimal;
    minus(value: DecimalSource): Decimal;
    mul(value: DecimalSource): Decimal;
    multiply(value: DecimalSource): Decimal;
    times(value: DecimalSource): Decimal;
    div(value: DecimalSource): Decimal;
    divide(value: DecimalSource): Decimal;
    divideBy(value: DecimalSource): Decimal;
    dividedBy(value: DecimalSource): Decimal;
    recip(): Decimal;
    reciprocal(): Decimal;
    reciprocate(): Decimal;
    /**
     * -1 for less than value, 0 for equals value, 1 for greater than value
     */
    cmp(value: DecimalSource): 0 | 1 | -1;
    compare(value: DecimalSource): 0 | 1 | -1;
    eq(value: DecimalSource): boolean;
    equals(value: DecimalSource): boolean;
    neq(value: DecimalSource): boolean;
    notEquals(value: DecimalSource): boolean;
    lt(value: DecimalSource): boolean;
    lte(value: DecimalSource): boolean;
    gt(value: DecimalSource): boolean;
    gte(value: DecimalSource): boolean;
    max(value: DecimalSource): Decimal;
    min(value: DecimalSource): Decimal;
    clamp(min: DecimalSource, max: DecimalSource): Decimal;
    clampMin(min: DecimalSource): Decimal;
    clampMax(max: DecimalSource): Decimal;
    cmp_tolerance(value: DecimalSource, tolerance: DecimalSource): 0 | 1 | -1;
    compare_tolerance(value: DecimalSource, tolerance: DecimalSource): 0 | 1 | -1;
    /**
     * Tolerance is a relative tolerance, multiplied by the greater of the magnitudes of the two arguments.
     * For example, if you put in 1e-9, then any number closer to the
     * larger number than (larger number)*1e-9 will be considered equal.
     */
    eq_tolerance(value: DecimalSource, tolerance: DecimalSource): boolean;
    equals_tolerance(value: DecimalSource, tolerance: DecimalSource): boolean;
    neq_tolerance(value: DecimalSource, tolerance: DecimalSource): boolean;
    notEquals_tolerance(value: DecimalSource, tolerance: DecimalSource): boolean;
    lt_tolerance(value: DecimalSource, tolerance: DecimalSource): boolean;
    lte_tolerance(value: DecimalSource, tolerance: DecimalSource): boolean;
    gt_tolerance(value: DecimalSource, tolerance: DecimalSource): boolean;
    gte_tolerance(value: DecimalSource, tolerance: DecimalSource): boolean;
    log10(): number;
    absLog10(): number;
    pLog10(): number;
    log(base: number): number;
    log2(): number;
    ln(): number;
    logarithm(base: number): number;
    pow(value: number | Decimal): Decimal;
    pow_base(value: DecimalSource): Decimal;
    factorial(): Decimal;
    exp(): Decimal;
    sqr(): Decimal;
    sqrt(): Decimal;
    cube(): Decimal;
    cbrt(): Decimal;
    sinh(): Decimal;
    cosh(): Decimal;
    tanh(): Decimal;
    asinh(): number;
    acosh(): number;
    atanh(): number;
    /**
     * Joke function from Realm Grinder
     */
    ascensionPenalty(ascensions: number): Decimal;
    /**
     * Joke function from Cookie Clicker. It's 'egg'
     */
    egg(): Decimal;
    lessThanOrEqualTo(other: DecimalSource): boolean;
    lessThan(other: DecimalSource): boolean;
    greaterThanOrEqualTo(other: DecimalSource): boolean;
    greaterThan(other: DecimalSource): boolean;
}
