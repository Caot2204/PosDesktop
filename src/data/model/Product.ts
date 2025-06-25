class Product {
    code: string;
    name: string;
    unitPrice: number;
    stock: number;
    isInfinityStock: boolean = false;
    category: string;

    constructor(code: string, name: string, unitPrice: number, stock: number, isInfinityStock: boolean, category: string) {
        this.code = code;
        this.name = name;
        this.unitPrice = unitPrice;
        this.stock = stock;
        this.isInfinityStock = isInfinityStock;
        this.category = category;
    }
}

export default Product;