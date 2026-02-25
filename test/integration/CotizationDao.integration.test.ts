import { Sequelize, DataTypes } from 'sequelize';
import sqlite3 from 'sqlite3';
import CotizationDao from '../../src/data/datasource/ds-sequelize/CotizationDao';
import Cotization from '../../src/data/model/Cotization';
import Product from '../../src/data/model/Product';

describe('CotizationDao integration', () => {
  let sequelize: Sequelize;
  let ProductModel: any;
  let CotizationModel: any;
  let CotizationProductsModel: any;
  let dao: CotizationDao;

  beforeAll(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      dialectModule: sqlite3,
      storage: ':memory:',
      logging: false,
    });

    ProductModel = sequelize.define('products', {
      code: {
        type: DataTypes.TEXT,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      unitPrice: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      isInfinityStock: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    }, { timestamps: false });

    CotizationModel = sequelize.define('cotizations', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      dateOfCotization: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      client: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      userToRegister: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    }, { timestamps: false });

    CotizationProductsModel = sequelize.define('cotizations_products', {
      cotizationId: {
        type: DataTypes.INTEGER,
        references: { model: CotizationModel, key: 'id' }
      },
      productCode: {
        type: DataTypes.TEXT,
        references: { model: ProductModel, key: 'code' }
      },
      unitsSold: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
      }
    }, { timestamps: false });

    // associations not strictly required for the DAO but helpful for clarity
    CotizationModel.hasMany(CotizationProductsModel, { foreignKey: 'cotizationId' });
    ProductModel.hasMany(CotizationProductsModel, { foreignKey: 'productCode' });

    await sequelize.sync({ force: true });

    dao = new CotizationDao(CotizationModel, CotizationProductsModel);
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('saveCotization and getAllCotizations', async () => {
    const p1 = new Product('PR1', 'Prod 1', 10.0, 5, false, 'General');
    const p2 = new Product('PR2', 'Prod 2', 5.0, 10, false, 'General');

    // persist products in DB
    await ProductModel.create({ code: p1.code, name: p1.name, unitPrice: p1.unitPrice, stock: p1.stock, isInfinityStock: p1.isInfinityStock });
    await ProductModel.create({ code: p2.code, name: p2.name, unitPrice: p2.unitPrice, stock: p2.stock, isInfinityStock: p2.isInfinityStock });

    // create cotization using CotizationProduct entries (productId references product.code)
    const cp1 = { productCode: 'PR1', unitsSold: 2 };
    const cp2 = { productCode: 'PR2', unitsSold: 1 };
    const cot = new Cotization(new Date(), 'Client A', 'User1', [cp1 as any, cp2 as any]);
    await dao.saveCotization(cot);

    const all = await dao.getAllCotizations();
    expect(all.length).toBeGreaterThanOrEqual(1);
    const first = all[0];
    expect(first.client).toBe('Client A');
    expect(Array.isArray(first.products)).toBe(true);
    expect(first.products.length).toBe(2);
    expect(first.products.some((pr: any) => pr.productCode === 'PR1')).toBe(true);
  });

  test('getCotizationById returns saved cotization with products', async () => {
    const all = await dao.getAllCotizations();
    const id = all[0].id!;

    const fetched = await dao.getCotizationById(id);
    expect(fetched.id).toBe(id);
    expect(Array.isArray(fetched.products)).toBe(true);
    expect(fetched.products.length).toBe(2);
  });

  test('updateCotization updates fields and products', async () => {
    const all = await dao.getAllCotizations();
    const existing = all[0];

    const newProduct = new Product('PR3', 'Prod 3', 7.5, 20, false, 'General');
    await ProductModel.create({ code: newProduct.code, name: newProduct.name, unitPrice: newProduct.unitPrice, stock: newProduct.stock, isInfinityStock: newProduct.isInfinityStock });

    existing.client = 'Client B';
    existing.products = [{ productCode: 'PR3', unitsSold: 3 } as any];

    await dao.updateCotization(existing);

    const fetched = await dao.getCotizationById(existing.id!);
    expect(fetched.client).toBe('Client B');
    expect(fetched.products.length).toBe(1);
    expect(fetched.products[0].productCode).toBe('PR3');
  });

  test('deleteCotization removes cotization', async () => {
    const all = await dao.getAllCotizations();
    const id = all[0].id!;

    await dao.deleteCotization(id);

    await expect(dao.getCotizationById(id)).rejects.toThrow('Cotizacion no encontrada');
  });

  test('saved products keep correct unitsSold', async () => {
    const p1 = new Product('UP1', 'UProd 1', 8.0, 5, false, 'General');
    const p2 = new Product('UP2', 'UProd 2', 3.0, 10, false, 'General');

    await ProductModel.create({ code: p1.code, name: p1.name, unitPrice: p1.unitPrice, stock: p1.stock, isInfinityStock: p1.isInfinityStock });
    await ProductModel.create({ code: p2.code, name: p2.name, unitPrice: p2.unitPrice, stock: p2.stock, isInfinityStock: p2.isInfinityStock });

    const cp1 = { productCode: 'UP1', unitsSold: 4 } as any;
    const cp2 = { productCode: 'UP2', unitsSold: 2 } as any;
    const cot = new Cotization(new Date(), 'Client Units', 'UserUnits', [cp1, cp2]);

    await dao.saveCotization(cot);

    const all = await dao.getAllCotizations();
    const first = all.find(c => c.client === 'Client Units')!;
    expect(first).toBeDefined();
    expect(first.products.some((pr: any) => pr.productCode === 'UP1' && pr.unitsSold === 4)).toBe(true);
    expect(first.products.some((pr: any) => pr.productCode === 'UP2' && pr.unitsSold === 2)).toBe(true);

    // also verify the raw association rows
    const rows = await CotizationProductsModel.findAll({ where: { cotizationId: first.id } });
    expect(rows.length).toBeGreaterThanOrEqual(2);
    const row1 = rows.find((r: any) => r.productCode === 'UP1');
    const row2 = rows.find((r: any) => r.productCode === 'UP2');
    expect(row1).toBeDefined();
    expect(row1.unitsSold).toBe(4);
    expect(row2).toBeDefined();
    expect(row2.unitsSold).toBe(2);
  });

  test('saveCotization with non-existent product rejects', async () => {
    const cp = { productCode: 'NOEXISTS', unitsSold: 1 } as any;
    const cot = new Cotization(new Date(), 'Client Missing', 'UserMissing', [cp]);

    await expect(dao.saveCotization(cot)).rejects.toBeDefined();

    // Ensure no association rows were created for partial saves
    const all = await dao.getAllCotizations();
    const first = all.find(c => c.client === 'Client Missing');
    if (first) {
      const rows = await CotizationProductsModel.findAll({ where: { cotizationId: first.id } });
      expect(rows.length).toBe(0);
    }
  });

  test('saveCotization rolls back on association write failure', async () => {
    const p = new Product('R1', 'RollBackProd', 1.0, 1, false, 'General');
    await ProductModel.create({ code: p.code, name: p.name, unitPrice: p.unitPrice, stock: p.stock, isInfinityStock: p.isInfinityStock });

    const cp = { productId: 'R1', unitsSold: 2 } as any;
    const cot = new Cotization(new Date(), 'Client Rollback Save', 'UserRB', [cp]);

    // monkey-patch create to force an error
    const originalCreate = CotizationProductsModel.create;
    CotizationProductsModel.create = async () => { throw new Error('Forced failure'); };

    try {
      await expect(dao.saveCotization(cot)).rejects.toThrow('Forced failure');

      // ensure cotization was not persisted
      const found = await CotizationModel.findOne({ where: { client: 'Client Rollback Save' } });
      expect(found).toBeNull();

      // ensure no association rows exist
      const rows = await CotizationProductsModel.findAll({ where: { productCode: 'R1' } });
      expect(rows.length).toBe(0);
    } finally {
      CotizationProductsModel.create = originalCreate;
    }
  });

  test('updateCotization rolls back on association write failure', async () => {
    // prepare initial cotization with product U1
    const u1 = new Product('U1', 'UProd1', 5.0, 5, false, 'General');
    const u2 = new Product('U2', 'UProd2', 6.0, 6, false, 'General');
    await ProductModel.create({ code: u1.code, name: u1.name, unitPrice: u1.unitPrice, stock: u1.stock, isInfinityStock: u1.isInfinityStock });
    await ProductModel.create({ code: u2.code, name: u2.name, unitPrice: u2.unitPrice, stock: u2.stock, isInfinityStock: u2.isInfinityStock });

    const cp1 = { productCode: 'U1', unitsSold: 1 } as any;
    const initial = new Cotization(new Date(), 'Client Update Rollback', 'UserUpd', [cp1]);
    await dao.saveCotization(initial);

    const all = await dao.getAllCotizations();
    const ex = all.find(c => c.client === 'Client Update Rollback')!;

    // Patch create to fail during update
    const originalCreate2 = CotizationProductsModel.create;
    CotizationProductsModel.create = async () => { throw new Error('Forced failure during update'); };

    try {
      // attempt update to replace products with U2
      ex.client = 'Client Update Rollback';
      ex.products = [{ productCode: 'U2', unitsSold: 3 } as any];

      await expect(dao.updateCotization(ex)).rejects.toThrow('Forced failure during update');

      // reload from DB and assert previous associations still exist (rollback happened)
      const reloaded = await dao.getCotizationById(ex.id!);
      expect(reloaded.products.some((p: any) => p.productCode === 'U1')).toBe(true);
      expect(reloaded.products.some((p: any) => p.productCode === 'U2')).toBe(false);
    } finally {
      CotizationProductsModel.create = originalCreate2;
    }
  });
});
