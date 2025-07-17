import Sale from "../../model/Sale.js";
import SalesProduct from "../../model/SalesProduct.js";
import type ISaleDataSource from "../ds-interfaces/ISaleDataSource.js";
import { fromMysqlDatetime, toMysqlDatetime } from "../utils/DateUtils.js";
import type PosDatabase from "./PosDatabase.js";

class SaleDao implements ISaleDataSource {

    private dbInstance;

    constructor(dbInstance: PosDatabase) {
        this.dbInstance = dbInstance.getInstance();
    }

    private getSalesProductSold(saleId: number): Promise<SalesProduct[]> {
        return new Promise<SalesProduct[]>((resolve, reject) => {
            this.dbInstance.all(
                'SELECT productName, unitPrice, unitsSold FROM sales_products WHERE saleId=?',
                [saleId],
                (error: Error | null, rows: any[]) => {
                    if (error) {
                        throw reject(new Error(error.message));
                    }
                    const products = rows.map(row =>
                        new SalesProduct(
                            row.productName,
                            row.unitPrice,
                            row.unitsSold
                        )
                    );
                    resolve(products);
                }
            );
        });
    }

    getSaleById(saleId: number): Promise<Sale> {
        return new Promise<Sale>((resolve, reject) => {
            this.dbInstance.all(
                `SELECT * FROM sales WHERE id=?`,
                async (error: Error | null, row: any) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    const productsSold = await this.getSalesProductSold(saleId);
                    const sale: Sale = new Sale(
                        row.id,
                        row.dayOfSale,
                        row.userToGenerateSale,
                        productsSold,
                        row.totalSale
                    );
                    resolve(sale);
                }
            );
        });
    }

    getSalesPerDay(dayOfSale: Date): Promise<Sale[]> {
        return new Promise<Sale[]>((resolve, reject) => {
            const dateFormated = toMysqlDatetime(dayOfSale).split(" ")[0];
            this.dbInstance.serialize(() => {
                this.dbInstance.all(
                    'SELECT * FROM sales WHERE DATE(dateOfSale) = ?',
                    [dateFormated],
                    (error: Error | null, rows: any[]) => {
                        if (error) {
                            console.log(error);
                            reject(error);
                        }
                        if (rows) {
                            Promise.all(rows.map(async row => {
                                const saleDate = fromMysqlDatetime(row.dateOfSale);
                                if (!saleDate) {
                                    throw new Error("Fecha invalida");
                                }
                                const productsOfSale = await this.getSalesProductSold(Number(row.id));
                                console.log(productsOfSale.length);
                                return new Sale(
                                    row.id,
                                    saleDate,
                                    row.userToGenerateSale,
                                    productsOfSale,
                                    row.totalSale
                                );
                            })).then(sales => {
                                resolve(sales);
                            }).catch(reject);
                        }
                    }
                );
            });
        });
    }

    private saveSalesProduct(saleId: number, productSold: SalesProduct): Promise<void> {
        return new Promise((resolve, reject) => {
            this.dbInstance.serialize(() => {
                this.dbInstance.run(
                    'INSERT INTO sales_products VALUES (?,?,?,?)',
                    [saleId, productSold.name, productSold.unitPrice, productSold.unitsSold],
                    (error: Error | null) => {
                        if (error) { return reject(error) }
                        resolve();
                    }
                );
            });
        });
    }

    saveSale(dayOfSale: Date, userToGenerateSale: string, productsSold: SalesProduct[], totalSale: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this.dbInstance.serialize(() => {
                const dateParsed = toMysqlDatetime(dayOfSale);
                const statementSaveSale = this.dbInstance.prepare(
                    'INSERT INTO sales(dateOfSale, userToGenerateSale, totalSale) VALUES(?,?,?)'
                );
                statementSaveSale.run(
                    dateParsed,
                    userToGenerateSale,
                    totalSale,
                    (error: Error | null) => {
                        if (error) {
                            console.log("insertIntoSale: ", error);
                            reject(error);
                        }
                    }
                );
                this.dbInstance.get(
                    'SELECT id FROM sales WHERE dateOfSale=?',
                    [dateParsed],
                    (error: Error | null, row: any) => {
                        if (error) {
                            console.log("getSaleId: ", error);
                            return reject(error);
                        }
                        if (!row) {
                            return reject("Venta no guardada");
                        }
                        productsSold.forEach(product => {
                            this.saveSalesProduct(Number(row.id), product);
                        });
                    }
                );
                resolve();
            });
        });
    }

}

export default SaleDao;