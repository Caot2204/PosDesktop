import ProductDao from '../../../dist-electron/data/datasource/ds-sqlite/ProductDao.js';
import CategoryDao from '../../../dist-electron/data/datasource/ds-sqlite/CategoryDao.js';
import Product from '../../../dist-electron/data/model/Product.js';
import PosDatabase from '../../../dist-electron/data/datasource/ds-sqlite/PosDatabase.js';

describe('ProductDao', () => {
  let db: any;
  let categoryDao: CategoryDao;
  let dao: ProductDao;

  beforeEach(async () => {
    db = new PosDatabase('test');
    await db.initialize();
    categoryDao = new CategoryDao(db);
    await categoryDao.saveCategory('Abarrotes');
    dao = new ProductDao(db, categoryDao);
  });

  it('saveProduct and getProductByCode should work', async () => {
    const product = new Product('P001', 'Arroz', 10, 100, false, 'Abarrotes');
    await dao.saveProduct(product);
    const received = await dao.getProductByCode('P001');
    expect(received).toEqual(product);
  });

  it('getAllProducts should return all products', async () => {
    const product1 = new Product('P001', 'Arroz', 10, 100, false, 'Abarrotes');
    const product2 = new Product('P002', 'Frijol', 15, 50, false, 'Abarrotes');
    await dao.saveProduct(product1);
    await dao.saveProduct(product2);
    const products = await dao.getAllProducts();
    expect(products).toEqual([product1, product2]);
  });

  it('setNewStockForProduct should update stock', async () => {
    const product = new Product('P001', 'Arroz', 10, 100, false, 'Abarrotes');
    await dao.saveProduct(product);
    await dao.setNewStockForProduct('P001', 200);
    const updated = await dao.getProductByCode('P001');
    expect(updated?.stock).toBe(200);
  });

  it('updateProduct should update product fields', async () => {
    const product = new Product('P001', 'Arroz', 10, 100, false, 'Abarrotes');
    await dao.saveProduct(product);
    const updatedProduct = new Product('P001', 'Arroz Premium', 20, 150, true, 'Abarrotes');
    await dao.updateProduct(updatedProduct);
    const received = await dao.getProductByCode('P001');
    expect(received).toEqual(updatedProduct);
  });

  it('deleteProduct should remove the product', async () => {
    const product = new Product('P001', 'Arroz', 10, 100, false, 'Abarrotes');
    await dao.saveProduct(product);
    await dao.deleteProduct('P001');
    const received = await dao.getProductByCode('P001');
    expect(received).toBeUndefined();
  });
});

// Test errors
describe('ProductDaoError', () => {
  let mockDb: any;
  let mockCategoryDao: any;
  let dao: ProductDao;

  beforeEach(() => {
    mockDb = {
      serialize: jest.fn(fn => fn()),
      all: jest.fn(),
      get: jest.fn(),
      prepare: jest.fn(() => ({
        run: jest.fn(),
      })),
    };
    mockCategoryDao = {
      getCategoryByName: jest.fn().mockResolvedValue({ id: 1, name: 'Abarrotes' }),
    };
    const mockDbInstance = { getInstance: () => mockDb };
    dao = new ProductDao(mockDbInstance as any, mockCategoryDao as any);
  });

  it('getAllProducts should reject on error', async () => {
    mockDb.all.mockImplementation((query, cb) => cb(new Error('fail')));
    await expect(dao.getAllProducts()).rejects.toThrow('fail');
  });

  it('getProductByCode should reject on error', async () => {
    mockDb.get.mockImplementation((query, params, cb) => cb(new Error('fail')));
    await expect(dao.getProductByCode('P001')).rejects.toThrow('fail');
  });

  it('saveProduct should reject if category not found', async () => {
    mockCategoryDao.getCategoryByName.mockResolvedValue(undefined);
    const product = { code: 'P001', name: 'Arroz', unitPrice: 10, stock: 100, isInfinityStock: false, category: 'Abarrotes' };
    await expect(dao.saveProduct(product as any)).rejects.toThrow('Category not found');
  });

  it('saveProduct should reject on db error', async () => {
    mockDb.prepare.mockReturnValue({
      run: (code, name, unitPrice, stock, isInfinityStock, categoryId, cb) => cb(new Error('fail')),
    });
    const product = { code: 'P001', name: 'Arroz', unitPrice: 10, stock: 100, isInfinityStock: false, category: 'Abarrotes' };
    await expect(dao.saveProduct(product as any)).rejects.toThrow('fail');
  });

  it('setNewStockForProduct should reject on db error', async () => {
    mockDb.prepare.mockReturnValue({
      run: (stock, code, cb) => cb(new Error('fail')),
    });
    await expect(dao.setNewStockForProduct('P001', 100)).rejects.toThrow('fail');
  });

  it('updateProduct should reject if category not found', async () => {
    mockCategoryDao.getCategoryByName.mockResolvedValue(undefined);
    const product = { code: 'P001', name: 'Arroz', unitPrice: 10, stock: 100, isInfinityStock: false, category: 'Abarrotes' };
    await expect(dao.updateProduct(product as any)).rejects.toThrow('Category not found');
  });

  it('updateProduct should reject on db error', async () => {
    mockDb.prepare.mockReturnValue({
      run: (...args: any[]) => args[args.length - 1](new Error('fail')),
    });
    const product = { code: 'P001', name: 'Arroz', unitPrice: 10, stock: 100, isInfinityStock: false, category: 'Abarrotes' };
    await expect(dao.updateProduct(product as any)).rejects.toThrow('fail');
  });

  it('deleteProduct should reject on db error', async () => {
    mockDb.prepare.mockReturnValue({
      run: (code, cb) => cb(new Error('fail')),
    });
    await expect(dao.deleteProduct('P001')).rejects.toThrow('fail');
  });
});