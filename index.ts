/** @file Data types and functions for working with abstract date-times. */

/** An abstract date and time with no associated timezone.
 *
 * To represent an exact instant in time, use `@softwareventures/timestamp`
 * instead. */
export interface DateTime {
    /** Type discriminator identifying the object as a `DateTime`. */
    readonly type: "DateTime";

    /** The year.
     *
     * Positive values represent years in the Common Era (CE/AD). For example
     * `2024` represents 2024 CE, the year this module was first published to
     * npm.
     *
     * Negative values or zero represent years before the Common Era (BCE/BC).
     * Zero represents 1 BCE, `-1` represents 2 BCE, `-2` represents 3 BCE,
     * etc.
     *
     * Note that there is no year zero in the Gregorian calendar. The year
     * 1 BCE was immediately followed by 1 CE. */
    year: number;

    /** The month of the year. Should be in the range `1`-`12`. */
    month: number;

    /** The day of the month. Should be in the range `1`-`31`. */
    day: number;

    /** The hours component of the time of day. Should be an integer in the
     * range `0`-`23`. */
    readonly hours: number;

    /** The minutes component of the time of day. Should be an integer in the
     * range `0`-`59`. */
    readonly minutes: number;

    /** The seconds component of the time of day. Should be in the range
     * `0`-`60`, inclusive of `0` but exclusive of `60`. May be fractional
     * to represent an instant in time with sub-second accuracy. */
    readonly seconds: number;
}

/** Options required to construct a `DateTime`.
 *
 * An instance of {@link DateTime} may always be used in place of
 * `DateTimeOptions`. */
export interface DateTimeOptions {
    /** Type discriminator identifying the object as a `DateTime`.
     *
     * If specified, must be the string `"DateTime"`. This is to prevent errors
     * caused by a `DateTime` being accidentally passed to functions that
     * operate on other types. */
    readonly type?: "DateTime";

    /**
     * The year.
     *
     * Positive values represent years in the Common Era (CE/AD). For example
     * `2020` represents 2020 CE, the year this module was first published to
     * npm.
     *
     * Negative values or zero represent years before the Common Era (BCE/BC).
     * Zero represents 1 BCE, `-1` represents 2 BCE, `-2` represents 3 BCE,
     * etc.
     *
     * Note that there is no year zero in the Gregorian calendar. The year
     * 1 BCE was immediately followed by 1 CE.
     */
    readonly year: number;

    /** The month of the year. Should be in the range `1`-`12`. */
    readonly month: number;

    /** The day of the month. Should be in the range `1`-`31`. */
    readonly day: number;

    /** The hours component of the time of day. Should be an integer in the
     * range `0`-`23`. */
    readonly hours: number;

    /** The minutes component of the time of day. Should be an integer in the
     * range `0`-`59`.
     *
     * @default 0 */
    readonly minutes?: number;

    /** The seconds component of the time of day. Should be in the range
     * `0`-`60`, inclusive of `0` but exclusive of `60`. May be fractional
     * to represent an instant in time with sub-second accuracy.
     *
     * @default 0 */
    readonly seconds?: number;
}
