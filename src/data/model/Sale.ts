import type SalesProduct from "./SalesProduct.js";

export default class Sale {
    id: number;
    dateOfSale: Date;
    userToGeneretaSale: string;
    productsSold: SalesProduct[];
    paymentType: string;
    amountPayed: number;
    totalSale: number;

    constructor (id: number, dateOfSale: Date, userToGenerateSale: string, productsSold: SalesProduct[], paymentType: string, amountPayed: number, totalSale: number) {
        this.id = id;
        this.dateOfSale = dateOfSale;
        this.userToGeneretaSale = userToGenerateSale;
        this.productsSold = productsSold ? productsSold : [];
        this.paymentType = paymentType;
        this.amountPayed = amountPayed;
        this.totalSale = totalSale;
    }
}