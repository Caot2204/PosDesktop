class CotizationProduct {
    productCode: string;
    unitsSold: number;

    constructor(productCode: string, unitsSold: number) {
        this.productCode = productCode;
        this.unitsSold = unitsSold;
    }
}

export default CotizationProduct;