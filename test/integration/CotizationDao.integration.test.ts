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
      }
    }, { timestamps: false });

    CotizationModel.belongsToMany(ProductModel, { through: CotizationProductsModel, foreignKey: 'cotizationId', otherKey: 'productCode' });
    ProductModel.belongsToMany(CotizationModel, { through: CotizationProductsModel, foreignKey: 'productCode', otherKey: 'cotizationId' });

    await sequelize.sync({ force: true });

    dao = new CotizationDao(CotizationModel);
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

    const cot = new Cotization(new Date(), 'Client A', 'User1', [p1, p2]);
    await dao.saveCotization(cot);

    const all = await dao.getAllCotizations();
    expect(all.length).toBeGreaterThanOrEqual(1);
    const first = all[0];
    expect(first.client).toBe('Client A');
    expect(Array.isArray(first.products)).toBe(true);
    expect(first.products.length).toBe(2);
    expect(first.products.some((pr: any) => pr.code === 'PR1')).toBe(true);
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
    existing.products = [newProduct];

    await dao.updateCotization(existing);

    const fetched = await dao.getCotizationById(existing.id!);
    expect(fetched.client).toBe('Client B');
    expect(fetched.products.length).toBe(1);
    expect(fetched.products[0].code).toBe('PR3');
  });

  test('deleteCotization removes cotization', async () => {
    const all = await dao.getAllCotizations();
    const id = all[0].id!;

    await dao.deleteCotization(id);

    await expect(dao.getCotizationById(id)).rejects.toThrow('Cotizacion no encontrada');
  });
});
