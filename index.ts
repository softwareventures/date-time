/** @file Data types and functions for working with abstract date-times. */

import * as date from "@softwareventures/date";
import {hasProperty} from "unknown";
import isInteger = require("is-integer");
import isIntegerInRange from "is-integer-in-range";

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

/** The numeric representation of the month of January. */
export const JANUARY = date.JANUARY; // eslint-disable-line @typescript-eslint/naming-convention

/** The numeric representation of the month of February. */
export const FEBRUARY = date.FEBRUARY; // eslint-disable-line @typescript-eslint/naming-convention

/** The numeric representation of the month of March. */
export const MARCH = date.MARCH; // eslint-disable-line @typescript-eslint/naming-convention

/** The numeric representation of the month of April. */
export const APRIL = date.APRIL; // eslint-disable-line @typescript-eslint/naming-convention

/** The numeric representation of the month of May. */
export const MAY = date.MAY; // eslint-disable-line @typescript-eslint/naming-convention

/** The numeric representation of the month of June. */
export const JUNE = date.JUNE; // eslint-disable-line @typescript-eslint/naming-convention

/** The numeric representation of the month of July. */
export const JULY = date.JULY; // eslint-disable-line @typescript-eslint/naming-convention

/** The numeric representation of the month of August. */
export const AUGUST = date.AUGUST; // eslint-disable-line @typescript-eslint/naming-convention

/** The numeric representation of the month of September. */
export const SEPTEMBER = date.SEPTEMBER; // eslint-disable-line @typescript-eslint/naming-convention

/** The numeric representation of the month of October. */
export const OCTOBER = date.OCTOBER; // eslint-disable-line @typescript-eslint/naming-convention

/** The numeric representation of the month of November. */
export const NOVEMBER = date.NOVEMBER; // eslint-disable-line @typescript-eslint/naming-convention

/** The numeric representation of the month of December. */
export const DECEMBER = date.DECEMBER; // eslint-disable-line @typescript-eslint/naming-convention

/** Tests if the specified year is a leap year. Returns `true` if it is,
 * otherwise `false`.
 *
 * Positive values represent years in the Common Era (CE/AD). For example
 * `2020` represents 2020 CE, the year this module was first published to npm.
 *
 * Negative values or zero represent years before the Common Era (BCE/BC).
 * Zero represents 1 BCE, `-1` represents 2 BCE, `-2` represents 3 BCE,
 * etc.
 *
 * Note that there is no year zero in the Gregorian calendar. The year
 * 1 BCE was immediately followed by 1 CE. */
export const isLeapYear = date.isLeapYear;

/** Returns the number of days in the specified month in the specified year.
 *
 * @param month - An integer representing the month, in the range `1` (January)
 *   to `12` (December).
 *
 * @param year - An integer representing the year. Positive values represent
 *   years in the Common Era (CE/AD). For example `2020` represents 2020 CE,
 *   the year this module was first published to npm. Negative values or zero
 *   represent years before the Common Era (BCE/BC). Zero represents 1 BCE,
 *   `-1` represents 2 BCE, `-2` represents 3 BCE, etc. There is no year zero
 *   in the Gregorian calendar. The year 1 BCE was immediately followed by 1
 *   CE. */
export const daysInMonth = date.daysInMonth;

/** Returns `true` if the specified value has the shape of a {@link DateTime}
 * object.
 *
 * The `year`, `month`, `day`, `hours`, and `minutes` fields may be
 * non-integers or outside the valid range, meaning that the object may not
 * represent a valid date and time.
 *
 * The `seconds` field may be non-finite, meaning that the object may not
 * represent a valid date and time.
 *
 * To test if the object represents a valid date and time, call {@link isValid}
 * or {@link isValidDateTime}.
 */
export function isDateTime(value: unknown): value is DateTime {
    return (
        typeof value === "object" &&
        value != null &&
        hasProperty(value, "type") &&
        value.type === "DateTime" &&
        hasProperty(value, "year") &&
        typeof value.year === "number" &&
        hasProperty(value, "month") &&
        typeof value.month === "number" &&
        hasProperty(value, "day") &&
        typeof (value as {day: unknown}).day === "number" &&
        hasProperty(value, "hours") &&
        typeof value.hours === "number" &&
        hasProperty(value, "minutes") &&
        typeof value.minutes === "number" &&
        hasProperty(value, "seconds") &&
        typeof value.seconds === "number"
    );
}

/** Tests if the specified {@link DateTime} object represents a valid date and
 * time.
 *
 * Returns `true` if the `year`, `month`, `day`, `hour`, and `minute` fields
 * are all integers inside the valid range, and the `seconds` field is a finite
 * number inside the valid range.
 *
 * {@link DateTime}s returned by functions in this library are always valid. */
export function isValid(dateTime: DateTimeOptions): boolean {
    return (
        (!hasProperty(dateTime, "type") || dateTime.type === "DateTime") &&
        isInteger(dateTime.year) &&
        isIntegerInRange(dateTime.month, JANUARY, DECEMBER) &&
        isIntegerInRange(dateTime.day, 1, daysInMonth(dateTime.month, dateTime.year)) &&
        isIntegerInRange(dateTime.hours, 0, 23) &&
        isIntegerInRange(dateTime.minutes ?? 0, 0, 59) &&
        (dateTime.seconds ?? 0) >= 0 &&
        (dateTime.seconds ?? 0) < 60
    );
}
