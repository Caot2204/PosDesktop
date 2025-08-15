import type SaleProductModel from "../../ui/sales/model/SalesProductModel";
import type ISaleDataSource from "../datasource/ds-interfaces/ISaleDataSource";
import type Sale from "../model/Sale";
import SalesProduct from "../model/SalesProduct";
import type ProductRepository from "./ProductRepository";

class SaleRepository {

    private saleDataSource: ISaleDataSource;
    private productRepository: ProductRepository;

    constructor(saleDataSource: ISaleDataSource, productRepository: ProductRepository) {
        this.saleDataSource = saleDataSource;
        this.productRepository = productRepository;
    }

    async getSaleById(saleId: number): Promise<Sale | undefined> {
        return this.saleDataSource.getSaleById(saleId);
    }

    async getSalesByDate(dayOfSale: Date): Promise<Sale[]> {
        return this.saleDataSource.getSalesPerDay(dayOfSale);
    }

    async saveSale(
        dayOfSale: Date,
        userToGenerateSale: string,
        productsSold: SaleProductModel[],
        paymentType: string,
        amountPayed: number,
        paymentFolio: string | null,
        totalSale: number): Promise<void> {
        const salesProductToSave: SalesProduct[] = productsSold.map(product =>
            new SalesProduct(
                product.name,
                product.unitPrice,
                product.unitsToSale
            )
        );
        try {
            this.saleDataSource.saveSale(
                dayOfSale,
                userToGenerateSale,
                salesProductToSave,
                paymentType,
                amountPayed,
                paymentFolio,
                totalSale
            );
            productsSold.forEach(product => {
                this.productRepository.decreaseStock(product.code, product.unitsToSale);
            });
        } catch (error) {
            throw error;
        }
    }

}

export default SaleRepository;