import type Product from "../../model/Product.js";

export interface IProductDataSource {

    deleteProduct(code: string): Promise<void>;

    getAllProducts(): Promise<Product[]>;

    getProductByCode(code: string): Promise<Product>;

    saveProduct(product: Product): Promise<void>;

    setNewStockForProduct(code: string, newStock: number): Promise<void>;

    updateProduct(product: Product, previousCode?: string): Promise<void>;

}