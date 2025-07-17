import type SaleProductModel from "../../ui/sales/model/SalesProductModel.js";
import type ISaleDataSource from "../datasource/ds-interfaces/ISaleDataSource.js";
import type Sale from "../model/Sale.js";
import SalesProduct from "../model/SalesProduct.js";

class SaleRepository {

    private saleDataSource: ISaleDataSource;

    constructor(saleDataSource: ISaleDataSource) {
        this.saleDataSource = saleDataSource;
    }

    async getSaleById(saleId: number): Promise<Sale> {
        return this.saleDataSource.getSaleById(saleId);
    }

    async getSalesByDate(dayOfSale: Date): Promise<Sale[]> {
        return this.saleDataSource.getSalesPerDay(dayOfSale);
    }

    async saveSale(dayOfSale: Date, userToGenerateSale: string, productsSold: SaleProductModel[], totalSale: number): Promise<void> {
        const salesProductToSave: SalesProduct[] = productsSold.map(product => 
            new SalesProduct(
                product.name,
                product.unitPrice,
                product.unitsToSale
            )
        );
        this.saleDataSource.saveSale(dayOfSale, userToGenerateSale, salesProductToSave, totalSale);
    }

}

export default SaleRepository;