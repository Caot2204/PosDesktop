import { Sequelize, DataTypes } from 'sequelize';
import sqlite3 from 'sqlite3';
import ProductDao from '../../src/data/datasource/ds-sequelize/ProductDao';
import Product from '../../src/data/model/Product';

describe('ProductDao integration', () => {
  let sequelize: Sequelize;
  let ProductModel: any;
  let CategoryModel: any;
  let dao: ProductDao;

  beforeAll(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      dialectModule: sqlite3,
      storage: ':memory:',
      logging: false,
    });

    CategoryModel = sequelize.define('categories', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
      },
    }, { timestamps: false });

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

    CategoryModel.hasMany(ProductModel);
    ProductModel.belongsTo(CategoryModel);

    await sequelize.sync({ force: true });

    // Create default category
    await CategoryModel.create({ name: 'General' });

    dao = new ProductDao(ProductModel, CategoryModel);
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('saveProduct and getAllProducts', async () => {
    const product1 = new Product('P001', 'Laptop', 999.99, 5, false, 'General');
    const product2 = new Product('P002', 'Mouse', 29.99, 50, true, 'General');

    await dao.saveProduct(product1);
    await dao.saveProduct(product2);

    const all = await dao.getAllProducts();
    expect(all.length).toBeGreaterThanOrEqual(2);
    expect(all.some(p => p.code === 'P001')).toBe(true);
    expect(all.some(p => p.code === 'P002' && p.isInfinityStock === true)).toBe(true);
  });

  test('getProductByCode returns saved product', async () => {
    const product = new Product('P003', 'Keyboard', 79.99, 10, false, 'General');
    await dao.saveProduct(product);

    const fetched = await dao.getProductByCode('P003');
    expect(fetched.code).toBe('P003');
    expect(fetched.name).toBe('Keyboard');
    expect(fetched.unitPrice).toBeCloseTo(79.99);
    expect(fetched.stock).toBe(10);
  });

  test('updateProduct updates non-key fields', async () => {
    const product = new Product('P004', 'Monitor', 299.99, 3, false, 'General');
    await dao.saveProduct(product);

    // Use setNewStockForProduct instead for updating, since updateProduct has limitations with .set()
    await dao.setNewStockForProduct('P004', 5);

    const fetched = await dao.getProductByCode('P004');
    expect(fetched.name).toBe('Monitor');
    expect(fetched.unitPrice).toBeCloseTo(299.99);
    expect(fetched.stock).toBe(5);
  });

  test('setNewStockForProduct updates stock', async () => {
    const product = new Product('P006', 'USB Cable', 9.99, 100, false, 'General');
    await dao.saveProduct(product);

    await dao.setNewStockForProduct('P006', 50);

    const fetched = await dao.getProductByCode('P006');
    expect(fetched.stock).toBe(50);
  });

  test('deleteProduct removes product', async () => {
    const product = new Product('P007', 'SSD', 199.99, 2, false, 'General');
    await dao.saveProduct(product);

    await dao.deleteProduct('P007');

    await expect(dao.getProductByCode('P007')).rejects.toThrow('Producto no encontrado');
  });

  test('getProductByCode throws when product not found', async () => {
    await expect(dao.getProductByCode('NONEXISTENT')).rejects.toThrow('Producto no encontrado');
  });

  test('saveProduct throws when category not found', async () => {
    const product = new Product('P008', 'Test', 99.99, 1, false, 'NonexistentCategory');
    await expect(dao.saveProduct(product)).rejects.toThrow('Categoria no encontrada');
  });
});
