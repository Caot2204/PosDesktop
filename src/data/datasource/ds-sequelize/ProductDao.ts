import Product from '../../model/Product';
import type { IProductDataSource } from '../ds-interfaces/IProductDataSource';

class ProductDao implements IProductDataSource {

    private ProductSequelize: any;
    private CategorySequelize: any;

    constructor(productSequelize: any, categorySequelize: any) {
        this.ProductSequelize = productSequelize;
        this.CategorySequelize = categorySequelize;
    }

    deleteProduct(code: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const productDb = await this.ProductSequelize.findByPk(code);
            if (productDb) {
                productDb.destroy()
                    .then(() => {
                        resolve();
                    })
                    .catch((error: Error) => {
                        reject(error);
                    });
            } else {
                reject(new Error("Producto no encontrado"));
            }
        });
    }

    getAllProducts(): Promise<Product[]> {
        return new Promise<Product[]>(async (resolve, reject) => {
            const productsDb = await this.ProductSequelize.findAll({
                include: this.CategorySequelize
            });
            if (productsDb) {
                const products = productsDb.map((productDb: any) => new Product(
                    productDb.code,
                    productDb.name,
                    productDb.unitPrice,
                    productDb.stock,
                    productDb.isInfinityStock,
                    productDb.category.name
                ));
                resolve(products);
            } else {
                reject(new Error("Error al recuperar productos"));
            }
        });
    }

    getProductByCode(code: string): Promise<Product> {
        return new Promise<Product>(async (resolve, reject) => {
            const productDb = await this.ProductSequelize.findByPk(code, {
                include: this.CategorySequelize
            });
            if (productDb) {
                const product = new Product(
                    productDb.code,
                    productDb.name,
                    productDb.unitPrice,
                    productDb.stock,
                    productDb.isInfinityStock,
                    productDb.category.name
                );
                resolve(product);
            } else {
                reject(new Error("Producto no encontrado"));
            }
        });
    }

    saveProduct(product: Product): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const category = await this.CategorySequelize.findOne({ where: { name: product.category } });
            if (category) {
                this.ProductSequelize.create({
                    code: product.code,
                    name: product.name,
                    unitPrice: product.unitPrice,
                    stock: product.stock,
                    isInfinityStock: product.isInfinityStock,
                    categoryId: category.id
                }).then(() => {
                    resolve();
                }).catch((error: Error) => {
                    reject(error);
                });
            } else {
                reject(new Error("Categoria no encontrada"));
            }
        });
    }

    setNewStockForProduct(code: string, newStock: number): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const product = await this.ProductSequelize.findByPk(code);
            if (product) {
                product.stock = newStock;
                product.save()
                    .then(() => {
                        resolve();
                    }).catch((error: Error) => {
                        reject(error);
                    });
            } else {
                reject(new Error("Producto no encontrado"));
            }
        });
    }

    updateProduct(product: Product, previousCode?: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const category = await this.CategorySequelize.findOne({ where: { name: product.category } });
            if (category) {
                const productDb = previousCode ?
                    await this.ProductSequelize.findByPk(previousCode)
                    :
                    await this.ProductSequelize.findByPk(product.code);
                if (productDb) {
                    console.log("Previuos code: ", previousCode);
                    console.log("New code: ", product.code);
                    productDb.set({
                        code: product.code,
                        name: product.name,
                        unitPrice: product.unitPrice,
                        stock: product.stock,
                        isInfinityStock: product.isInfinityStock,
                        categoryId: category.id
                    });
                    productDb.save()
                        .then(() => {
                            resolve();
                        }).catch((error: Error) => {
                            reject(error);
                        });
                } else {
                    reject(new Error("Producto no encontrado"));
                }
            } else {
                reject(new Error("Categoria no encontrada"));
            }
        });
    }
}

export default ProductDao;