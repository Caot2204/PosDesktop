import type Sale from "../../model/Sale";
import type SalesProduct from "../../model/SalesProduct";

export default interface ISaleDataSource {
    
    getSaleById(saleId: number): Promise<Sale | undefined>;

    getSalesPerDay(dayOfSale: Date): Promise<Sale[]>;

    saveSale(
        dayOfSale: Date, 
        userToGenerateSale: string, 
        productsSold: SalesProduct[], 
        paymentType: string,
        amountPayed: number,
        paymentFolio: string | null,
        totalSale: number): Promise<void>;

}