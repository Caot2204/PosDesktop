/**
 * Converts a TypeScript Date object to a MySQL DATETIME format string.
 *
 * @param date The Date object to convert.
 * @returns A string formatted for MySQL DATETIME ('YYYY-MM-DD HH:MM:SS').
 */
export function toMysqlDatetime(date: Date): string {
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

/**
 * Converts a MySQL DATETIME string (assumed to be in UTC) to a JavaScript Date object.
 *
 * @param datetimeString The string from the MySQL DATETIME field, e.g., '2023-10-27 10:00:00'.
 * @returns A Date object representing the correct moment in time.
 */
export function fromMysqlDatetime(datetimeString: string | null | undefined): Date | null {
  if (!datetimeString) {
    return null;
  }
  return new Date(datetimeString.replace(' ', 'T') + 'Z');
}