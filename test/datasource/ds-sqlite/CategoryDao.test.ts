import CategoryDao from '../../../dist-electron/data/datasource/ds-sqlite/CategoryDao.js';
import Category from '../../../dist-electron/data/model/Category.js';
import PosDatabase from '../../../dist-electron/data/datasource/ds-sqlite/PosDatabase.js';

describe('CategoryDao', () => {
  let db: any;
  let dao: CategoryDao;

  beforeEach(() => {
    db = new PosDatabase('test');
    db.initialize();
    dao = new CategoryDao(db);
  });

  it('getAllCategories should resolve with categories', async () => {
    const categories = [new Category(1, "Abarrotes"), new Category(2, "Papeleria"), new Category(3, "Ropa")];
    await dao.saveCategory("Abarrotes");
    await dao.saveCategory("Papeleria");
    await dao.saveCategory("Ropa");

    const recived = await dao.getAllCategories();
    expect(categories).toEqual(recived);
  });

  it('getCategoryById should resolve with a category', async () => {
    const category = new Category(1, "Abarrotes");
    await dao.saveCategory("Abarrotes");
    const recived = await dao.getCategoryById(1);
    expect(category).toEqual(recived);
  });

  it('getCategoryById should resolve undefined if not found', async () => {
    const recived = await dao.getCategoryById(1);
    expect(undefined).toEqual(recived);
  });

  it('updateCategory should resolve on success', async () => {
    const expectCategory = new Category(1, "Editada");
    await dao.saveCategory("Abarrotes");
    await dao.updateCategory(expectCategory);
    const categoryUpdated = await dao.getCategoryById(1);
    expect(expectCategory).toEqual(categoryUpdated);
  });

  it('deleteCategory should resolve on success', async () => {
    const category = new Category(1, "Abarrotes");
    await dao.saveCategory("Abarrotes");
    await dao.deleteCategory(1);
    const categoryRecived = await dao.getCategoryById(1);
    expect(undefined).toEqual(categoryRecived);
  });
});


// Test errors
describe('CategoryDaoError', () => {
  let mockDb: any;
  let dao: CategoryDao;

  beforeEach(() => {
    mockDb = {
      serialize: jest.fn(fn => fn()),
      all: jest.fn(),
      get: jest.fn(),
      prepare: jest.fn(() => ({
        run: jest.fn(),
      })),
    };
    // Mock getInstance to return mockDb
    const mockDbInstance = { getInstance: () => mockDb };
    dao = new CategoryDao(mockDbInstance as any);
  });

  it('getAllCategories should reject on error', async () => {
    mockDb.all.mockImplementation((query, cb) => cb(new Error('fail')));
    await expect(dao.getAllCategories()).rejects.toThrow('fail');
  });

  it('getCategoryById should resolve undefined if not found', async () => {
    mockDb.get.mockImplementation((query, params, cb) => cb(null, undefined));
    const result = await dao.getCategoryById(99);
    expect(result).toBeUndefined();
  });

  it('getCategoryById should reject on error', async () => {
    mockDb.get.mockImplementation((query, params, cb) => cb(new Error('fail')));
    await expect(dao.getCategoryById(1)).rejects.toThrow('fail');
  });

  it('saveCategory should reject on error', async () => {
    const runMock = jest.fn((name, cb) => cb(new Error('fail')));
    mockDb.prepare.mockReturnValue({ run: runMock });
    await expect(dao.saveCategory('Nueva')).rejects.toThrow('fail');
  });

  it('updateCategory should reject on error', async () => {
    const runMock = jest.fn((name, id, cb) => cb(new Error('fail')));
    mockDb.prepare.mockReturnValue({ run: runMock });
    const category = new Category(1, 'Editada');
    await expect(dao.updateCategory(category)).rejects.toThrow('fail');
  });

  it('deleteCategory should reject on error', async () => {
    const runMock = jest.fn((id, cb) => cb(new Error('fail')));
    mockDb.prepare.mockReturnValue({ run: runMock });
    await expect(dao.deleteCategory(1)).rejects.toThrow('fail');
  });
});