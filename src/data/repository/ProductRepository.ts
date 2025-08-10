import type { IProductDataSource } from "../datasource/ds-interfaces/IProductDataSource";
import Product from '../model/Product'

class ProductRepository {

    private productDataSource: IProductDataSource;

    constructor(productDataSource: IProductDataSource) {
        this.productDataSource = productDataSource;
    }

    async decreaseStock(code: string, unitsToDecrease: number): Promise<void> {
        const product = await this.getProductByCode(code);
        if (product) {
            if (!product.isInfinityStock) {
                const newStock = product.stock - unitsToDecrease;
                this.productDataSource.setNewStockForProduct(product.code, newStock);
            }
        } else {
            throw new Error("Producto no encontrado");
        }
    }

    async deleteProduct(code: string): Promise<void> {
        if (code) {
            this.productDataSource.deleteProduct(code);
        }
    }

    async getAllProducts(): Promise<Product[]> {
        return this.productDataSource.getAllProducts();
    }

    async getProductByCode(code: string): Promise<Product> {
        return this.productDataSource.getProductByCode(code);
    }

    async increaseStock(code: string, unitsToIncrease: number): Promise<void> {
        const product = await this.getProductByCode(code);
        if (product) {
            if (!product.isInfinityStock) {
                const newStock = product.stock + unitsToIncrease;
                this.productDataSource.setNewStockForProduct(product.code, newStock);
            } else {
                throw new Error("El producto tiene stock infinito");
            }
        } else {
            throw new Error("Producto no encontrado");
        }
    }

    async saveProduct(code: string, name: string, unitPrice: number, stock: number, isInfinityStock: boolean, category: string): Promise<void> {
        if (this.validateProductData(code, name, unitPrice, stock, isInfinityStock, category)) {
            const productToSave = new Product(code, name, unitPrice, stock, isInfinityStock, category);
            try {
                this.productDataSource.saveProduct(productToSave);
            } catch (error) {
                throw new Error("Ha ocurrido un error al guardar, intente de nuevo");
            }
        }
    }

    async updateProduct(code: string, name: string, unitPrice: number, stock: number, isInfinityStock: boolean, category: string, previousCode?: string): Promise<void> {
        if (this.validateProductData(code, name, unitPrice, stock, isInfinityStock, category)) {
            const productToUpdate = await this.getProductByCode(previousCode ? previousCode : code);
            if (productToUpdate) {
                productToUpdate.name = name;
                productToUpdate.unitPrice = unitPrice;
                productToUpdate.stock = stock;
                productToUpdate.isInfinityStock = isInfinityStock;
                productToUpdate.category = category;
                try {
                    if (previousCode) {
                        productToUpdate.code = code;
                        this.productDataSource.updateProduct(productToUpdate, previousCode);
                    } else {
                        this.productDataSource.updateProduct(productToUpdate);
                    }
                } catch (error) {
                    throw new Error("Ha ocurrido un error al guardar, intente de nuevo");
                }
            } else {
                throw new Error("Producto no encontrado");
            }

        }
    }

    private validateProductData(code: string, name: string, unitPrice: number, stock: number, isInfinityStock: boolean, category: string): boolean {
        if (!code || code.length > 50) { throw new Error("El código no puede estar vacío y debe contener máximo 50 carácteres"); }
        if (!name || name.length > 100) { throw new Error("El nombre no puede estar vacío y debe contener máximo 100 carácteres"); }
        if (!unitPrice) { throw new Error("El precio unitario no puede estar vacío"); }
        if (!isInfinityStock) {
            if (!stock || stock < 0) { throw new Error("El stock debe ser mayor o igual a 0"); }
        }
        if (!category) { throw new Error("Debe especificar una categoría") }
        return true;
    }
}

export default ProductRepository;