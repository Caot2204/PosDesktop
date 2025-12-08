import { Sequelize, DataTypes } from 'sequelize';
import sqlite3 from 'sqlite3';
import CategoryDao from '../../src/data/datasource/ds-sequelize/CategoryDao';
import Category from '../../src/data/model/Category';

describe('CategoryDao integration', () => {
  let sequelize: Sequelize;
  let CategoryModel: any;
  let dao: CategoryDao;

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

    // Create a dummy ProductSequelize for testing (not actually needed for CategoryDao tests)
    const ProductModel = sequelize.define('products', {
      code: {
        type: DataTypes.TEXT,
        primaryKey: true,
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
        defaultValue: false,
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }, { timestamps: false });

    CategoryModel.hasMany(ProductModel);
    ProductModel.belongsTo(CategoryModel);

    await sequelize.sync({ force: true });
    dao = new CategoryDao(CategoryModel, sequelize);
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('saveCategory and getAllCategories', async () => {
    await dao.saveCategory('Electronics');
    await dao.saveCategory('Books');

    const all = await dao.getAllCategories();
    expect(all.length).toBeGreaterThanOrEqual(2);
    expect(all.some(c => c.name === 'Electronics')).toBe(true);
    expect(all.some(c => c.name === 'Books')).toBe(true);
  });

  test('getCategoryById returns saved category', async () => {
    await dao.saveCategory('Clothing');
    const all = await dao.getAllCategories();
    const clothing = all.find(c => c.name === 'Clothing');

    const fetched = await dao.getCategoryById(clothing!.id as number);
    expect(fetched.name).toBe('Clothing');
    expect(fetched.id).toBe(clothing!.id);
  });

  test('getCategoryByName returns category with correct name', async () => {
    await dao.saveCategory('Food');
    const fetched = await dao.getCategoryByName('Food');
    expect(fetched.name).toBe('Food');
  });

  test('updateCategory updates name', async () => {
    await dao.saveCategory('Toys');
    const all = await dao.getAllCategories();
    const toys = all.find(c => c.name === 'Toys');

    const updated = new Category(toys!.id, 'Games');
    await dao.updateCategory(updated);

    const fetched = await dao.getCategoryById(toys!.id as number);
    expect(fetched.name).toBe('Games');
  });

  test('deleteCategory removes category', async () => {
    // Ensure "Todos" exists before deleting
    const all = await dao.getAllCategories();
    if (!all.find(c => c.name === 'Todos')) {
      await dao.saveCategory('Todos');
    }

    await dao.saveCategory('TempCategory');
    const updated = await dao.getAllCategories();
    const toDelete = updated.find(c => c.name === 'TempCategory');

    await dao.deleteCategory(toDelete!.id as number);

    await expect(dao.getCategoryById(toDelete!.id as number)).rejects.toThrow('Categoria no encontrada');
  });

  test('getCategoryById throws when category not found', async () => {
    await expect(dao.getCategoryById(99999)).rejects.toThrow('Categoria no encontrada');
  });

  test('getCategoryByName throws when category not found', async () => {
    await expect(dao.getCategoryByName('NonexistentCategory')).rejects.toThrow('Categoria no encontrada');
  });
});
