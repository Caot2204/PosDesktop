export function formatNumberToCurrentPrice(price: number): string {
    return new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
        minimumFractionDigits: 2
    }).format(price);
}

export function formatDate(dateToFormat: Date): string {
    const minutes = dateToFormat.getMinutes() < 10 ? "0" + dateToFormat.getMinutes() : dateToFormat.getMinutes();
    const seconds = dateToFormat.getSeconds() < 10 ? "0" + dateToFormat.getSeconds() : dateToFormat.getSeconds();
    return dateToFormat.getDate() + "-" +
      (dateToFormat.getMonth() + 1) + "-" +
      dateToFormat.getFullYear() + " " +
      dateToFormat.getHours() + ":" +
      minutes + ":" +
      seconds;
}

export function formatDateForSearch(dateToFormat: Date): string {
    const month = dateToFormat.getMonth() + 1 < 10 ? "0" + (dateToFormat.getMonth() + 1) : dateToFormat.getMonth() + 1;
    const day = dateToFormat.getDate() < 10 ? "0" + dateToFormat.getDate() : dateToFormat.getDate();
    return dateToFormat.getFullYear() + "-" + month + "-" + day;
}