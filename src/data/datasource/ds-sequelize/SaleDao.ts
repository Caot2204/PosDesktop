import { QueryTypes } from 'sequelize';
import Sale from '../../model/Sale';
import SalesProduct from '../../model/SalesProduct';
import type ISaleDataSource from '../ds-interfaces/ISaleDataSource';
import { toMysqlDatetime } from '../utils/DateUtils';

class SaleDao implements ISaleDataSource {

    private SaleSequelize: any;
    private SaleProductsSequelize: any;
    private sequelizeDb: any;

    constructor(saleSequelize: any, saleProductsSequelize: any, sequelizeDb: any) {
        this.SaleSequelize = saleSequelize;
        this.SaleProductsSequelize = saleProductsSequelize;
        this.sequelizeDb = sequelizeDb;
    }

    private getSalesProductSold(saleId: number): Promise<SalesProduct[]> {
        return new Promise<SalesProduct[]>(async (resolve, reject) => {
            const salesProductsDb = await this.SaleProductsSequelize.findAll({ where: { saleId: saleId } });
            if (salesProductsDb) {
                const salesProducts = salesProductsDb.map((salesProductDb: any) => new SalesProduct(
                    salesProductDb.productName,
                    salesProductDb.unitPrice,
                    salesProductDb.unitsSold
                ));
                resolve(salesProducts);
            } else {
                reject(new Error("Error al recuperar productos vendidos"));
            }
        });
    }

    private async mapSaleForPlainObject(saleDb: any) {
        return {
            id: saleDb.id,
            dateOfSale: new Date(saleDb.dateOfSale),
            userToGenerateSale: saleDb.userToGenerateSale,
            productsSold: await this.getSalesProductSold(saleDb.id),
            paymentType: saleDb.paymentType,
            amountPayed: saleDb.amountPayed,
            paymentFolio: saleDb.paymentFolio,
            totalSale: saleDb.totalSale
        }
    }

    getSaleById(saleId: number): Promise<Sale | undefined> {
        return new Promise<Sale | undefined>(async (resolve, reject) => {
            try {
                const saleDb = await this.SaleSequelize.findByPk(saleId);
                if (saleDb) {
                    resolve(this.mapSaleForPlainObject(saleDb));
                } else {
                    resolve(undefined);
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    getSalesPerDay(dayOfSale: Date): Promise<Sale[]> {
        return new Promise<Sale[]>(async (resolve, reject) => {
            try {
                const dateFormated = toMysqlDatetime(dayOfSale).split(" ")[0];
                const salesDb = await this.sequelizeDb.query(
                    'SELECT * FROM sales WHERE DATE(dateOfSale) = ?', {
                    replacements: [dateFormated],
                    type: QueryTypes.SELECT
                });
                const salesPlainObject = await Promise.all(
                    salesDb.map((saleDb: any) => this.mapSaleForPlainObject(saleDb))
                );
                resolve(salesPlainObject);
            } catch (error) {
                reject(error);
            }
        });
    }

    saveSale(
        dayOfSale: Date,
        userToGenerateSale: string,
        productsSold: SalesProduct[],
        paymentType: string,
        amountPayed: number,
        paymentFolio: string | null,
        totalSale: number): Promise<void> {

        return new Promise((resolve, reject) => {

            this.SaleSequelize.create({
                dateOfSale: dayOfSale,
                userToGenerateSale: userToGenerateSale,
                paymentType: paymentType,
                amountPayed: amountPayed,
                paymentFolio: paymentFolio,
                totalSale: totalSale
            }).then(async () => {
                const sale = await this.SaleSequelize.findOne({ where: { dateOfSale: dayOfSale } });
                productsSold.forEach(productSold => {
                    this.SaleProductsSequelize.create({
                        saleId: sale.id,
                        productName: productSold.name,
                        unitPrice: productSold.unitPrice,
                        unitsSold: productSold.unitsSold
                    });
                });
                resolve();
            }).catch((error: Error) => {
                reject(error);
            });
        });
    }
}

export default SaleDao;