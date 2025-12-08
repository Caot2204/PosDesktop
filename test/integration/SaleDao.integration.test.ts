import { Sequelize, DataTypes, QueryTypes } from 'sequelize';
import sqlite3 from 'sqlite3';
import SaleDao from '../../src/data/datasource/ds-sequelize/SaleDao';
import Sale from '../../src/data/model/Sale';
import SalesProduct from '../../src/data/model/SalesProduct';

describe('SaleDao integration', () => {
  let sequelize: Sequelize;
  let SaleModel: any;
  let SaleProductsModel: any;
  let dao: SaleDao;

  beforeAll(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      dialectModule: sqlite3,
      storage: ':memory:',
      logging: false,
    });

    SaleModel = sequelize.define('sales', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      dateOfSale: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      userToGenerateSale: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      paymentType: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      amountPayed: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      paymentFolio: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
      },
      totalSale: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
    }, { timestamps: false });

    SaleProductsModel = sequelize.define('sales_products', {
      saleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      productName: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      unitPrice: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      unitsSold: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }, { timestamps: false });

    SaleModel.hasMany(SaleProductsModel);
    SaleProductsModel.belongsTo(SaleModel);

    await sequelize.sync({ force: true });
    dao = new SaleDao(SaleModel, SaleProductsModel, sequelize);
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('saveSale and getSalesPerDay', async () => {
    const date = new Date('2024-01-20T10:00:00');
    const products = [
      new SalesProduct('Laptop', 999.99, 1),
      new SalesProduct('Mouse', 29.99, 2),
    ];

    await dao.saveSale(date, 'user1', products, 'cash', 1059.98, null, 1059.97);

    const sales = await dao.getSalesPerDay(date);
    expect(sales.length).toBeGreaterThanOrEqual(1);
    expect(sales[0].userToGenerateSale).toBe('user1');
    expect(sales[0].paymentType).toBe('cash');
    expect(sales[0].totalSale).toBeCloseTo(1059.97);
  });

  test('saveSale with credit card and payment folio', async () => {
    const date = new Date('2024-01-21T14:00:00');
    const products = [new SalesProduct('Monitor', 349.99, 1)];

    await dao.saveSale(date, 'user2', products, 'card', 349.99, 'FOLIO123', 349.99);

    const sales = await dao.getSalesPerDay(date);
    const sale = sales.find(s => s.userToGenerateSale === 'user2');
    expect(sale).toBeDefined();
    expect(sale!.paymentFolio).toBe('FOLIO123');
    expect(sale!.paymentType).toBe('card');
  });

  test('getSaleById returns sale details', async () => {
    const date = new Date('2024-01-22T09:00:00');
    const products = [
      new SalesProduct('Keyboard', 79.99, 1),
      new SalesProduct('Cable', 9.99, 3),
    ];

    await dao.saveSale(date, 'user3', products, 'cash', 109.97, null, 109.96);

    const sales = await dao.getSalesPerDay(date);
    const firstSale = sales[0];

    const fetched = await dao.getSaleById(firstSale.id);
    expect(fetched).toBeDefined();
    expect(fetched!.userToGenerateSale).toBe('user3');
    expect(fetched!.productsSold.length).toBe(2);
    expect(fetched!.productsSold[0].name).toBe('Keyboard');
    expect(fetched!.productsSold[1].unitsSold).toBe(3);
  });

  test('saveSale with multiple products', async () => {
    const date = new Date('2024-01-23T15:30:00');
    const products = [
      new SalesProduct('Headphones', 149.99, 1),
      new SalesProduct('Mouse Pad', 19.99, 2),
      new SalesProduct('USB Hub', 59.99, 1),
    ];

    await dao.saveSale(date, 'user4', products, 'check', 399.96, 'CHECK001', 399.95);

    const sales = await dao.getSalesPerDay(date);
    const sale = sales.find(s => s.userToGenerateSale === 'user4');
    expect(sale!.productsSold.length).toBe(3);
    expect(sale!.amountPayed).toBeCloseTo(399.96);
  });

  test('getSalesPerDay returns empty array for date with no sales', async () => {
    const date = new Date('2025-12-31T00:00:00');
    const sales = await dao.getSalesPerDay(date);
    expect(Array.isArray(sales)).toBe(true);
  });

  test('getSaleById returns undefined for non-existent sale', async () => {
    const result = await dao.getSaleById(99999);
    expect(result).toBeUndefined();
  });
});
