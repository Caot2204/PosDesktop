export function formatNumberToCurrentPrice(price: number): string {
    return new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
        minimumFractionDigits: 2
    }).format(price);
}

export function formatDate(dateToFormat: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    const minutes = pad(dateToFormat.getMinutes());
    const seconds = pad(dateToFormat.getSeconds());
    return pad(dateToFormat.getDate()) + "-" +
      pad(dateToFormat.getMonth() + 1) + "-" +
      dateToFormat.getFullYear() + " " +
      pad(dateToFormat.getHours()) + ":" +
      minutes + ":" +
      seconds;
}

// Returns a date string in YYYY-MM-DD (local) suitable for inputs and comparisons
export function formatOnlyDate(dateToformat: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    return dateToformat.getFullYear() + "-" +
      pad(dateToformat.getMonth() + 1) + "-" +
      pad(dateToformat.getDate());
}

// Alias for formatOnlyDate, used when building SQL-like search strings
export function formatDateForSearch(dateToFormat: Date): string {
    return formatOnlyDate(dateToFormat);
}

// Parse a YYYY-MM-DD string as a local Date (avoids UTC parsing of new Date('YYYY-MM-DD'))
export function parseLocalDate(value: string | null | undefined): Date | null {
    if (!value) return null;
    const parts = value.split('-').map(p => parseInt(p, 10));
    if (parts.length !== 3 || parts.some(isNaN)) return null;
    const [year, month, day] = parts;
    // month is 1-based in the string, Date expects 0-based month
    return new Date(year, month - 1, day);
}

// Convert a Date to an input[type=date] value string (YYYY-MM-DD)
export function toInputDateValue(date: Date | null | undefined): string {
    if (!date) return '';
    return formatOnlyDate(date);
}