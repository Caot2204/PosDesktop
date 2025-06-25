import type PosDatabase from './PosDatabase.js';
import Product from '../../model/Product.js';
import type { IProductDataSource } from '../ds-interfaces/IProductDataSource.js';
import type CategoryDao from './CategoryDao.js';

class ProductDao implements IProductDataSource {

    private dbInstance;
    private categoryDao: CategoryDao;

    constructor(dbInstance: PosDatabase, categoryDao: CategoryDao) {
        this.dbInstance = dbInstance.getInstance();
        this.categoryDao = categoryDao;
    }

    deleteProduct(code: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.dbInstance.serialize(() => {
                const statement = this.dbInstance.prepare(
                    'DELETE FROM products WHERE code=?'
                );
                statement.run(
                    code,
                    (error: Error | null) => {
                        if (error) { reject(error) }
                        else { resolve() }
                    }
                );
            });
        });
    }

    getAllProducts(): Promise<Product[]> {
        return new Promise<Product[]>((resolve, reject) => {
            this.dbInstance.serialize(() => {
                this.dbInstance.all(
                    `SELECT 
                        p.code, p.name, p.unitPrice, p.stock, p.isInfinityStock,
                        c.name AS category
                    FROM products AS p
                    INNER JOIN categories AS c 
                    ON p.categoryId = c.id 
                    ORDER BY p.name ASC`,
                    (error: Error | null, rows: any[]) => {
                        if (error) {
                            reject(error);
                            return;
                        }
                        const products: Product[] = rows.map(row =>
                            new Product(
                                row.code,
                                row.name,
                                row.unitPrice,
                                row.stock,
                                Boolean(row.isInfinityStock),
                                row.category
                            )
                        );
                        resolve(products);
                    });
            });
        });
    }

    getProductByCode(code: string): Promise<Product> {
        return new Promise<Product>((resolve: any, reject: any) => {
            this.dbInstance.serialize(() => {
                this.dbInstance.get(
                    `SELECT 
                        p.code, p.name, p.unitPrice, p.stock, p.isInfinityStock,
                        c.name AS category
                    FROM products AS p
                    INNER JOIN categories AS c 
                    ON p.categoryId = c.id 
                    WHERE p.code = ?
                    ORDER BY p.name ASC`,
                    [code], (error: Error | null, row: any) => {
                        if (error) {
                            return reject(error);
                        }
                        if (!row) {
                            return resolve(undefined);
                        }
                        const productRecived: Product = new Product(
                            row.code,
                            row.name,
                            row.unitPrice,
                            row.stock,
                            Boolean(row.isInfinityStock),
                            row.category
                        );
                        resolve(productRecived);
                    }
                );
            });
        });
    }

    getProductByName(name: string): Promise<Product> {
        return new Promise<Product>((resolve: any, reject: any) => {
            this.dbInstance.serialize(() => {
                this.dbInstance.get(
                    `SELECT 
                        p.code, p.name, p.unitPrice, p.stock, p.isInfinityStock,
                        c.name AS category
                    FROM products AS p
                    INNER JOIN categories AS c 
                    ON p.categoryId = c.id
                    WHERE p.name = ? 
                    ORDER BY p.name ASC`,
                    [name], (error: Error | null, row: any) => {
                        if (error) {
                            return reject(error);
                        }
                        if (!row) {
                            return resolve(undefined);
                        }
                        const productRecived: Product = new Product(
                            row.code,
                            row.name,
                            row.unitPrice,
                            row.stock,
                            Boolean(row.isInfinityStock),
                            row.category
                        );
                        resolve(productRecived);
                    }
                );
            });
        });
    }

    saveProduct(product: Product): Promise<void> {
        return new Promise(async (resolve: any, reject: any) => {
            const category = await this.categoryDao.getCategoryByName(product.category);
            if (category) {
                this.dbInstance.serialize(() => {
                    const statement = this.dbInstance.prepare(
                        'INSERT INTO products VALUES (?, ?, ?, ?, ?, ?)'
                    );
                    statement.run(
                        product.code,
                        product.name,
                        product.unitPrice,
                        product.stock,
                        product.isInfinityStock ? 1 : 0,
                        category.id,
                        (error: Error | null) => {
                            if (error) { reject(error); }
                            else { resolve() }
                        }
                    );
                });
            } else {
                reject(new Error("Category not found"));
            }
        });
    }

    setNewStockForProduct(code: string, newStock: number): Promise<void> {
        return new Promise((resolve: any, reject: any) => {
            this.dbInstance.serialize(() => {
                const statement = this.dbInstance.prepare(
                    'UPDATE products SET stock=? WHERE code=?'
                );
                statement.run(
                    newStock,
                    code,
                    (error: Error | null) => {
                        if (error) { reject(error) }
                        else { resolve() }
                    }
                );
            });
        });
    }

    updateProduct(product: Product, previousCode?: string): Promise<void> {
        return new Promise(async (resolve: any, reject: any) => {
            const category = await this.categoryDao.getCategoryByName(product.category);
            if (category) {
                this.dbInstance.serialize(() => {
                    if (previousCode) {
                        const statement = this.dbInstance.prepare(
                            'UPDATE products SET code=?, name=?, unitPrice=?, stock=?, isInfinityStock=?, categoryId=? WHERE code=?'
                        );
                        statement.run(
                            product.code,
                            product.name,
                            product.unitPrice,
                            product.stock,
                            product.isInfinityStock ? 1 : 0,
                            category.id,
                            previousCode,
                            (error: Error | null) => {
                                if (error) { reject(error) }
                                else { resolve() }
                            }
                        );
                    } else {
                        const statement = this.dbInstance.prepare(
                            'UPDATE products SET name=?, unitPrice=?, stock=?, isInfinityStock=?, categoryId=? WHERE code=?'
                        );
                        statement.run(
                            product.name,
                            product.unitPrice,
                            product.stock,
                            product.isInfinityStock ? 1 : 0,
                            category.id,
                            product.code,
                            (error: Error | null) => {
                                if (error) { reject(error) }
                                else { resolve() }
                            }
                        );

                    }
                });
            } else {
                reject(new Error("Category not found"));
            }
        });
    }

}

export default ProductDao;