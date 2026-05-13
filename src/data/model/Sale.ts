import type SalesProduct from "./SalesProduct";

export default class Sale {
    id: number;
    dateOfSale: Date;
    userToGenerateSale: string;
    productsSold: SalesProduct[];
    paymentType: string;
    amountPayed: number;
    amountPayedWithCard: number | null;
    paymentFolio: string | null;
    totalSale: number;

    constructor(id: number, dateOfSale: Date, userToGenerateSale: string, productsSold: SalesProduct[], paymentType: string, amountPayed: number, amountPayedWithCard: number | null, paymentFolio: string | null, totalSale: number) {
        this.id = id;
        this.dateOfSale = dateOfSale;
        this.userToGenerateSale = userToGenerateSale;
        this.productsSold = productsSold ? productsSold : [];
        this.paymentType = paymentType;
        this.amountPayed = amountPayed;
        this.amountPayedWithCard = amountPayedWithCard;
        this.paymentFolio = paymentFolio;
        this.totalSale = totalSale;
    }
}