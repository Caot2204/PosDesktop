import { isDev } from "../../electron/util";
import SaleProductModel from "../../ui/sales/model/SalesProductModel";
import type ISaleDataSource from "../datasource/ds-interfaces/ISaleDataSource";
import type Sale from "../model/Sale";
import SalesProduct from "../model/SalesProduct";
import type ProductRepository from "./ProductRepository";
import fs from 'fs';
import path from 'path';
import { app } from "electron";

class SaleRepository {

    private saleDataSource: ISaleDataSource;
    private productRepository: ProductRepository;

    constructor(saleDataSource: ISaleDataSource, productRepository: ProductRepository) {
        this.saleDataSource = saleDataSource;
        this.productRepository = productRepository;
    }

    async clearCurrentSaleBackup() {
        const backupCurrentSalePath = isDev() ? 'pos_dev_current_sale.json' : path.join(app.getPath('userData'), 'pos_current_sale.json');
        if(fs.existsSync(backupCurrentSalePath)) {
            fs.writeFileSync(backupCurrentSalePath, JSON.stringify([], null, 2), 'utf-8');
        }
    }

    async createCurrentSaleBackup(productsSold: SaleProductModel[]) {
        const backupCurrentSalePath = isDev() ? 'pos_dev_current_sale.json' : path.join(app.getPath('userData'), 'pos_current_sale.json');
        if(fs.existsSync(backupCurrentSalePath)) {
            fs.writeFileSync(backupCurrentSalePath, JSON.stringify(productsSold, null, 2), 'utf-8');
        }
    }

    async getCurrentSaleBackup(): Promise<SaleProductModel[]> {
        let products: SaleProductModel[] = [];
        const backupCurrentSalePath = isDev() ? 'pos_dev_current_sale.json' : path.join(app.getPath('userData'), 'pos_current_sale.json');
        if(fs.existsSync(backupCurrentSalePath)) {
            const data = fs.readFileSync(backupCurrentSalePath, 'utf-8');
            products = JSON.parse(data);
        }
        return products;
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