export default class SalesProduct {
    name: string;
    unitPrice: number;
    unitsSold: number;

    constructor (name: string, unitPrice: number, unitsSold: number) {
        this.name = name;
        this.unitPrice = unitPrice;
        this.unitsSold = unitsSold;
    }
}