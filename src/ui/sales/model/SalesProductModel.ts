export default class SaleProductModel {
  code: string;
  name: string;
  unitPrice: number;
  unitsToSale: number;
  stock: number | 'infinity';

  constructor(code: string, name: string, unitPrice: number, unitsToSale: number, stock: number | 'infinity') {
    this.code = code;
    this.name = name;
    this.unitPrice = unitPrice;
    this.unitsToSale = unitsToSale;
    this.stock = stock;
  }
}