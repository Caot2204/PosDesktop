import type Sale from "../../model/Sale.js";
import type SalesProduct from "../../model/SalesProduct.js";

export default interface ISaleDataSource {
    
    getSaleById(saleId: number): Promise<Sale | undefined>;

    getSalesPerDay(dayOfSale: Date): Promise<Sale[]>;

    saveSale(
        dayOfSale: Date, 
        userToGenerateSale: string, 
        productsSold: SalesProduct[], 
        paymentType: string,
        amountPayed: number,
        totalSale: number): Promise<void>;

}