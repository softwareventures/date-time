/** @file Data types and functions for working with abstract date-times. */

import * as date from "@softwareventures/date";
import * as time from "@softwareventures/time";
import {hasProperty} from "unknown";
import isIntegerInRange from "is-integer-in-range";
import isInteger = require("is-integer");
import type {Comparator} from "@softwareventures/ordered";
import {Comparison} from "@softwareventures/ordered";
import {mapNullable} from "@softwareventures/nullable";
import * as format from "@softwareventures/format-date-time";
import {DateTimeFormatter} from "@softwareventures/format-date-time";
import {JsDate} from "./js-date";

/** An abstract date and time with no associated timezone.
 *
 * To represent an exact instant in time, use `@softwareventures/timestamp`
 * instead. */
export interface DateTime {
    /** Type discriminator identifying the object as a `DateTime`. */
    readonly type: "DateTime";

    /** The year.
     *
     * Should be an integer.
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

    /** The month of the year. Should be an integer in the range `1`-`12`. */
    month: number;

    /** The day of the month. Should be an integer in the range `1`-`31`. */
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

/** Tests if the specified value is a {@link DateTime} object representing a
 * valid date and time.
 *
 * Returns `true` if the value has the shape of a `DateTime` object, the
 * `year`, `month`, `day`, `hours` and `minutes` fields are all integers inside
 * the valid range, and the `seconds` field is a finite number inside the valid
 * range.
 *
 * {@link DateTime}s returned by functions in this library are always valid. */
export function isValidDateTime(value: unknown): value is DateTime {
    return isDateTime(value) && isValid(value);
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

/** Tests if the specified {@link DateTime} object represents a valid date and
 * time.
 *
 * Returns `true` if the `year`, `month`, `day`, `hour`, and `minute` fields
 * are all integers inside the valid range, and the `seconds` field is a finite
 * number inside the valid range.
 *
 * Alias of {@link isValid}, useful for disambiguation from similar functions
 * that operate on other types.
 *
 * {@link DateTime}s returned by functions in this library are always valid. */
export const isDateTimeValid = isValid;

/** Asserts that the specified {@link DateTime} object represents a valid date
 * and time.
 *
 * {@DateTime}s returned by functions in this library are always valid.
 *
 * @throws {Error} if any of the `year`, `month`, `day`, `hours`, or `minutes`
 * fields are non-integers or outside the valid range, or if the `seconds`
 * field is non-finite or outside the valid range. */
export function validate(dateTime: DateTimeOptions): void {
    if (!isValid(dateTime)) {
        throw new Error("Invalid date-time");
    }
}

/** Asserts that the specified {@link DateTime} object represents a valid date
 * and time.
 *
 * {@DateTime}s returned by functions in this library are always valid.
 *
 * Alias of {@link validate}, useful for disambiguation from similar functions
 * that operate on other types.
 *
 * @throws {Error} if any of the `year`, `month`, `day`, `hours`, or `minutes`
 * fields are non-integers or outside the valid range, or if the `seconds`
 * field is non-finite or outside the valid range. */
export const validateDateTime = validate;

/** Constructs a normalized {@link DateTime} object from the specified options.
 *
 * If the `month`, `day`, `hour`, `minute` or `seconds` fields are outside the
 * valid range, then they will roll over into the next minute, hours, day,
 * month or year.
 *
 * @throws {Error} if any of the numeric fields are non-finite numbers
 */
export function dateTime(options: DateTimeOptions): DateTime {
    return fromReferenceSeconds(toReferenceSeconds(options));
}

/**
 * Normalizes the specified {@link DateTime} object so that it represents a
 * valid date.
 *
 * If the `month`, `day`, `hour`, `minute` or `seconds` fields are outside the
 * valid range, then they will roll over into the next minute, hours, day,
 * month or year.
 *
 * Alias of {@link dateTime}. Calling the function by this name instead might
 * make code clearer in cases where the purpose is to normalize an existing
 * `DateTime` object.
 *
 * @throws {Error} if any of the numeric fields are non-finite numbers. */
export const normalize = dateTime;

/**
 * Normalizes the specified {@link DateTime} object so that it represents a
 * valid date.
 *
 * If the `month`, `day`, `hour`, `minute` or `seconds` fields are outside the
 * valid range, then they will roll over into the next minute, hours, day,
 * month or year.
 *
 * Alias of {@link dateTime}. Calling the function by this name instead might
 * make code clearer in cases where the purpose is to normalize an existing
 * `DateTime` object.
 *
 * @throws {Error} if any of the numeric fields are non-finite numbers. */
export const normalizeDateTime = dateTime;

/** Converts the specified {@link DateTime} to a count of seconds since
 * the reference date-time of midnight on the morning of 1st January, 1 CE. */
export function toReferenceSeconds(dateTime: DateTimeOptions): number {
    return (
        date.toReferenceDays({year: dateTime.year, month: dateTime.month, day: dateTime.day}) *
            86400 +
        time.toReferenceSeconds({
            hours: dateTime.hours,
            minutes: dateTime.minutes ?? 0,
            seconds: dateTime.seconds ?? 0
        })
    );
}

/** Converts the specified {@link DateTime} to a count of seconds since
 * the reference date-time of midnight on the morning of 1st January, 1 CE.
 *
 * Alias of {@link toReferenceSeconds}, useful for disambiguation from similar
 * functions that operate on other types. */
export const dateTimeToReferenceSeconds = toReferenceSeconds;

/** Creates a {@link DateTime} corresponding to the specified count of the
 * number of seconds since the reference date-time of midnight on the morning
 * of 1st January, 1 CE.
 *
 * @throws {Error} if `referenceSeconds` is non-finite. */
export function fromReferenceSeconds(referenceSeconds: number): DateTime {
    if (!isFinite(referenceSeconds)) {
        throw new Error("Invalid date-time");
    }
    const referenceDays = Math.floor(referenceSeconds / 86400);
    const {year, month, day} = date.fromReferenceDays(referenceDays);
    const referenceSecondsInDays =
        (86400 + ((referenceSeconds - referenceDays * 86400) % 86400)) % 86400;
    const {hours, minutes, seconds} = time.fromReferenceSeconds(referenceSecondsInDays);
    return {type: "DateTime", year, month, day, hours, minutes, seconds};
}

/** Creates a {@link DateTime} corresponding to the specified count of the
 * number of seconds since the reference date-time of midnight on the morning
 * of 1st January, 1 CE.
 *
 * Alias of {@link fromReferenceSeconds}, useful for disambiguation from
 * similar functions that operate on other types.
 *
 * @throws {Error} if `referenceSeconds` is non-finite. */
export const dateTimeFromReferenceSeconds = fromReferenceSeconds;

/** Returns `true` if `a` and `b` refer to the same date and time. */
export function equal(a: DateTimeOptions, b: DateTimeOptions): boolean {
    return toReferenceSeconds(a) === toReferenceSeconds(b);
}

/** Returns `true` if `a` and `b` refer to the same date and time.
 *
 * Alias of {@link equal}, for disambiguation from other equality functions. */
export const dateTimesEqual = equal;

/** Returns `true` if `a` and `b` refer to the same date and time.
 *
 * Curried variant of {@link equal}. */
export function equalFn(b: DateTimeOptions): (a: DateTimeOptions) => boolean {
    return a => equal(a, b);
}

/** Returns `true` if `a` and `b` refer to the same date and time.
 *
 * Curried variant of {@link dateTimesEqual}. */
export const dateTimesEqualFn = equalFn;

/** Returns `true` if `a` and `b` refer to a different date and time. */
export function notEqual(a: DateTimeOptions, b: DateTimeOptions): boolean {
    return toReferenceSeconds(a) !== toReferenceSeconds(b);
}

/** Returns `true` if `a` and `b` refer to a different date and time.
 *
 * Alias of {@link notEqual}, for disambiguation from other inequality functions. */
export const dateTimesNotEqual = notEqual;

/** Returns `true` if `a` and `b` refer to a different date and time.
 *
 * Curried variant of {@link notEqual}. */
export function notEqualFn(b: DateTimeOptions): (a: DateTimeOptions) => boolean {
    return a => notEqual(a, b);
}

/** Returns `true` if `a` and `b` refer to a different date and time.
 *
 * Curried variant of {@link dateTimesNotEqual}. */
export const dateTimesNotEqualFn = notEqualFn;

/** Compares two {@link DateTime}s and returns a {@link Comparison} specifying
 * if `a` is before, equal to, or after `b`. */
export const compare: Comparator<DateTimeOptions> = (a, b) => {
    const ad = toReferenceSeconds(a);
    const bd = toReferenceSeconds(b);

    if (ad < bd) {
        return Comparison.before;
    } else if (ad > bd) {
        return Comparison.after;
    } else if (ad === bd) {
        return Comparison.equal;
    } else {
        return Comparison.undefined;
    }
};

/** Compares two {@link DateTime}s and returns a {@link Comparison} specifying
 * if `a` is before, equal to, or after `b`.
 *
 * Alias of {@link compare}, useful for disambiguation from other comparison
 * functions. */
export const compareDateTimes = compare;

/** Compares two {@link DateTime}s and returns a {@link Comparison} specifying
 * if `a` is before, equal to, or after `b`.
 *
 * Curried variant of {@link compare}. */
export function compareFn(b: DateTimeOptions): (a: DateTimeOptions) => Comparison {
    return a => compare(a, b);
}

/** Compares two {@link DateTime}s and returns a {@link Comparison} specifying
 * if `a` is before, equal to, or after `b`.
 *
 * Curried variant of {@link compareDateTimes}. */
export const compareDateTimesFn = compareFn;

/** Returns `true` if `a` refers to a date and time before `b`. */
export function before(a: DateTimeOptions, b: DateTimeOptions): boolean {
    return toReferenceSeconds(a) < toReferenceSeconds(b);
}

/** Returns `true` if `a` refers to a date and time before `b`.
 *
 * Alias of {@link before}, useful for disambiguation from similar functions
 * that operate on other date/time types. */
export const dateTimeBefore = before;

/** Returns `true` if `a` refers to a date and time before `b`.
 *
 * Curried variant of {@link before}. */
export function beforeFn(b: DateTimeOptions): (a: DateTimeOptions) => boolean {
    return a => before(a, b);
}

/** Returns `true` if `a` refers to a date and time before `b`.
 *
 * Curried variant of {@link dateTimeBefore}. */
export const dateTimeBeforeFn = beforeFn;

/** Returns `true` if `a` refers to a date and time before or the same as `b`. */
export function beforeOrEqual(a: DateTimeOptions, b: DateTimeOptions): boolean {
    return toReferenceSeconds(a) <= toReferenceSeconds(b);
}

/** Returns `true` if `a` refers to a date and time before or the same as `b`.
 *
 * Alias of {@link beforeOrEqual}, useful for disambiguation from similar
 * functions that operate on other date/time types. */
export const dateTimeBeforeOrEqual = beforeOrEqual;

/** Returns `true` if `a` refers to a date and time before or the same as `b`.
 *
 * Curried variant of {@link beforeOrEqual}. */
export function beforeOrEqualFn(b: DateTimeOptions): (a: DateTimeOptions) => boolean {
    return a => beforeOrEqual(a, b);
}

/** Returns `true` if `a` refers to a date and time before or the same as `b`.
 *
 * Curried variant of {@link dateTimeBeforeOrEqual}. */
export const dateTimeBeforeOrEqualFn = beforeOrEqualFn;

/** Returns `true` if `a` refers to a date and time after `b`. */
export function after(a: DateTimeOptions, b: DateTimeOptions): boolean {
    return toReferenceSeconds(a) > toReferenceSeconds(b);
}

/** Returns `true` if `a` refers to a date and time after `b`.
 *
 * Alias of {@link after}, useful for disambiguation from similar functions
 * that operate on other date/time types. */
export const dateTimeAfter = after;

/** Returns `true` if `a` refers to a date and time after `b`.
 *
 * Curried variant of {@link after}. */
export function afterFn(b: DateTimeOptions): (a: DateTimeOptions) => boolean {
    return a => after(a, b);
}

/** Returns `true` if `a` refers to a date and time after `b`.
 *
 * Curried variant of {@link dateTimeAfter}. */
export const dateTimeAfterFn = afterFn;

/** Returns `true` if `a` refers to a date or time after or the same as `b`. */
export function afterOrEqual(a: DateTimeOptions, b: DateTimeOptions): boolean {
    return toReferenceSeconds(a) >= toReferenceSeconds(b);
}

/** Returns `true` if `a` refers to a date or time after or the same as `b`.
 *
 * Alias of {@link afterOrEqual}, useful for disambiguation from similar
 * functions that operate on other date/time types. */
export const dateTimeAfterOrEqual = afterOrEqual;

/** Returns `true` if `a` refers to a date or time after or the same as `b`.
 *
 * Curried variant of {@link afterOrEqual}. */
export function afterOrEqualFn(b: DateTimeOptions): (a: DateTimeOptions) => boolean {
    return a => afterOrEqual(a, b);
}

/** Returns `true` if `a` refers to a date or time after or the same as `b`.
 *
 * Curried variant of {@link dateTimeAfterOrEqual}. */
export const dateTimeAfterOrEqualFn = afterOrEqualFn;

/** Compares two {@link DateTime}s and returns the earlier of the two. */
export function earliest<T extends DateTimeOptions, U extends DateTimeOptions>(a: T, b: U): T | U {
    return after(a, b) ? b : a;
}

/** Compares two {@link DateTime}s and returns the earlier of the two.
 *
 * Alias of {@link earliest}, useful for disambiguation from similar functions
 * that operate on other date/time types. */
export const earliestDateTime = earliest;

/** Compares two {@link DateTime}s and returns the earlier of the two.
 *
 * Curried variant of {@link earliest}. */
export function earliestFn<T extends DateTimeOptions, U extends DateTimeOptions>(
    b: U
): (a: T) => T | U {
    return a => earliest(a, b);
}

/** Compares two {@link DateTime}s and returns the earlier of the two.
 *
 * Curried variant of {@link earliestDateTime}. */
export const earliestDateTimeFn = earliestFn;

/** Compares two {@link DateTime}s and returns the later of the two. */
export function latest<T extends DateTimeOptions, U extends DateTimeOptions>(a: T, b: U): T | U {
    return before(a, b) ? b : a;
}

/** Compares two {@link DateTime}s and returns the later of the two.
 *
 * Alias of {@link latest}, useful for disambiguation from similar functions
 * that operate on other date/time types. */
export const latestDateTime = latest;

/** Compares two {@link DateTime}s and returns the later of the two.
 *
 * Curried variant of {@link latest}. */
export function latestFn<T extends DateTimeOptions, U extends DateTimeOptions>(
    b: U
): (a: T) => T | U {
    return a => latest(a, b);
}

/** Compares two {@link DateTime}s and returns the later of the two.
 *
 * Curried variant of {@link latestDateTime}. */
export const latestDateTimeFn = latestFn;

/** Returns the current date and time, according to UTC. */
export function nowUtc(): DateTime {
    const now = new JsDate();
    return {
        type: "DateTime",
        year: now.getUTCFullYear(),
        month: now.getUTCMonth() + 1,
        day: now.getUTCDate(),
        hours: now.getUTCHours(),
        minutes: now.getUTCMinutes(),
        seconds: now.getUTCSeconds() + 0.001 * now.getUTCMilliseconds()
    };
}

/** Returns the current date and time, according to UTC.
 *
 * Alias of {@link nowUtc}, useful for disambiguation from similar functions
 * that operate on other date/time types. */
export const dateTimeNowUtc = nowUtc;

/** Returns the current date and time, according to the device's local
 * timezone. */
export function nowDeviceLocal(): DateTime {
    const now = new JsDate();
    return {
        type: "DateTime",
        year: now.getFullYear(),
        month: now.getMonth(),
        day: now.getDay(),
        hours: now.getHours(),
        minutes: now.getHours(),
        seconds: now.getSeconds() + 0.001 * now.getMilliseconds()
    };
}

/** Returns the current date and time, according to the device's local
 * timezone.
 *
 * Alias of {@link nowDeviceLocal}, useful for disambiguation from similar
 * functions that operate on other date/time types. */
export const dateTimeNowDeviceLocal = nowDeviceLocal;

/** Parses a {@link DateTime} from text in ISO 8601 format.
 *
 * The ISO 8601 text must not specify a time zone offset.
 *
 * If the specified text is not a valid ISO 8601 date-time then this function
 * returns `null`.
 *
 * Both extended `YYYY-MM-DDTHH:MM:SS.ssss` and basic
 * `YYYYMMDDTHHMMSS.ssss` ISO 8601 formats are accepted.
 *
 * As an exception to ISO8601, the `"T"` delimiter between the date and time
 * may be replaced by any sequence of whitespace characters. */
export function parseIso8601(text: string): DateTime | null {
    const match =
        /^([+-]?\d{4,})-?(\d{2})-?(\d{2})(?:T|\s+)(\d{2})(?::?(\d{2})(?::?(\d{2}(?:\.\d*)?))?)?$/iu.exec(
            text
        );

    if (match?.[1] == null || match[2] == null || match[3] == null || match[4] == null) {
        return null;
    }

    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const day = parseInt(match[3], 10);
    const hours = parseInt(match[4], 10);
    const minutes = mapNullable(match[5], text => parseInt(text, 10)) ?? 0;
    const seconds = mapNullable(match[6], text => parseFloat(text.replace(",", "."))) ?? 0;

    return dateTime({year, month, day, hours, minutes, seconds});
}

/** Parses a {@link DateTime} from text in ISO 8601 format.
 *
 * The ISO 8601 text must not specify a time zone offset.
 *
 * If the specified text is not a valid ISO 8601 date-time then this function
 * returns `null`.
 *
 * Both extended `YYYY-MM-DDTHH:MM:SS.ssss` and basic
 * `YYYYMMDDTHHMMSS.ssss` ISO 8601 formats are accepted.
 *
 * As an exception to ISO8601, the `"T"` delimiter between the date and time
 * may be replaced by any sequence of whitespace characters.
 *
 * Alias of {@link parseIso8601}, useful for disambiguation from similar
 * functions that operate on other date/time types. */
export const parseDateTimeIso8601 = parseIso8601;

/** Returns a {@link DateTimeFormatter} that formats the specified
 * {@link DateTime} as ISO 8601, with the specified options.
 *
 * By default, the {@link DateTime} is formatted in the "extended" ISO 8601
 * format, with the time delimited by `"T"`, and without rounding, for example
 * `"2024-01-26T11:57:23.723615"`.
 *
 * If the `format` option is set to `"basic"`, then the hyphens and colons are
 * omitted, for example `"20240126T115723.723615"`.
 *
 * If the `round` option is set to `"seconds"`, then the time is rounded down
 * to the next lower second, for example `"2024-01-26T11:57:23"`.
 *
 * If the `round` option is set to `"ms"`, then the time is rounded down to
 * the next lower millisecond, for example `"2024-01-26T11:57:23.723"`.
 *
 * If the `timeDelimiter` option is set to `" "`, then the time is delimited by
 * a space instead of by `"T"`, for example `"2024-01-26 11:57:23.363215"`.
 *
 * For other formats, see `@softwareventures/format-date-time`. */
export const formatIso8601 = format.iso8601;

/** Returns a {@link DateTimeFormatter} that formats the specified
 * {@link DateTime} as ISO 8601, with the specified options.
 *
 * By default, the {@link DateTime} is formatted in the "extended" ISO 8601
 * format, with the time delimited by `"T"`, and without rounding, for example
 * `"2024-01-26T11:57:23.723615"`.
 *
 * If the `format` option is set to `"basic"`, then the hyphens and colons are
 * omitted, for example `"20240126T115723.723615"`.
 *
 * If the `round` option is set to `"seconds"`, then the time is rounded down
 * to the next lower second, for example `"2024-01-26T11:57:23"`.
 *
 * If the `round` option is set to `"ms"`, then the time is rounded down to
 * the next lower millisecond, for example `"2024-01-26T11:57:23.723"`.
 *
 * If the `timeDelimiter` option is set to `" "`, then the time is delimited by
 * a space instead of by `"T"`, for example `"2024-01-26 11:57:23.363215"`.
 *
 * Alias of {@link formatIso8601}, useful for disambiguation from similar
 * functions that operate on other date/time types.
 *
 * For other formats, see `@softwareventures/format-date-time`. */
export const formatDateTimeIso8601 = format.iso8601;

/** Formats the specified {@link DateTime} as ISO 8601 extended, rounded down
 * to the next lower second, and with the time delimited by a space `" "`.
 *
 * This format is intended to be reasonable for display to humans. */
export const formatHumanIso8601 = format.humanIso8601;

/** Formats the specified {@link DateTime} as ISO 8601 extended, rounded down
 * to the next lower second, and with the time delimited by a space `" "`.
 *
 * This format is intended to be reasonable for display to humans.
 *
 * Alias of {@link formatHumanIso8601}, useful for disambiguation from similar
 * functions that operate on other date/time types. */
export const formatDateTimeHumanIso8601 = format.humanIso8601;
