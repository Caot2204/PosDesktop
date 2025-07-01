import CategoryRepository from '../../../src/data/repository/CategoryRepository';
import Category from '../../../src/data/model/Category';

describe('CategoryRepository', () => {
  let mockDataSource: any;
  let repository: CategoryRepository;

  beforeEach(() => {
    mockDataSource = {
      getAllCategories: jest.fn(),
      getCategoryById: jest.fn(),
      saveCategory: jest.fn(),
      updateCategory: jest.fn(),
      deleteCategory: jest.fn(),
    };
    repository = new CategoryRepository(mockDataSource);
  });

  it('should call getAllCategories on the data source', async () => {
    await repository.getAllCategories();
    expect(mockDataSource.getAllCategories).toHaveBeenCalledTimes(1);
  });

  it('should call getCategoryById on the data source with correct id', async () => {
    await repository.getCategoryById(1);
    expect(mockDataSource.getCategoryById).toHaveBeenCalledWith(1);
  });

  it('should call saveCategory on the data source with valid name', async () => {
    await repository.saveCategory('Bebidas');
    expect(mockDataSource.saveCategory).toHaveBeenCalledWith('Bebidas');
  });

  it('should throw error if saveCategory is called with invalid name', async () => {
    await expect(repository.saveCategory('')).rejects.toThrow();
    expect(mockDataSource.saveCategory).not.toHaveBeenCalled();
  });

  it('should call updateCategory on the data source with valid category', async () => {
    const category = new Category(1, 'Comidas');
    mockDataSource.getCategoryById.mockResolvedValue(category);
    await repository.updateCategory(category.id!!, category.name);
    expect(mockDataSource.updateCategory).toHaveBeenCalledWith(category);
  });

  it('should throw error if updateCategory is called with invalid name', async () => {
    const category = new Category(1, '');
    mockDataSource.getCategoryById.mockResolvedValue(category);
    await expect(repository.updateCategory(category.id!!, category.name)).rejects.toThrow();
    expect(mockDataSource.updateCategory).not.toHaveBeenCalled();
  });

  it('should not call updateCategory if category does not exist', async () => {
    mockDataSource.getCategoryById.mockResolvedValue(undefined);
    await repository.updateCategory(999, 'Test');
    expect(mockDataSource.updateCategory).not.toHaveBeenCalled();
  });

  it('should call deleteCategory on the data source with correct id', async () => {
    await repository.deleteCategory(2);
    expect(mockDataSource.deleteCategory).toHaveBeenCalledWith(2);
  });

  it('should throw error if saveCategory throws', async () => {
    mockDataSource.saveCategory.mockImplementation(() => { throw new Error('fail'); });
    await expect(repository.saveCategory('Valid')).rejects.toThrow('Ha ocurrido un error al guardar, intente de nuevo');
  });

  it('should throw error if updateCategory throws', async () => {
    const category = new Category(1, 'Comidas');
    mockDataSource.getCategoryById.mockResolvedValue(category);
    mockDataSource.updateCategory.mockImplementation(() => { throw new Error('fail'); });
    await expect(repository.updateCategory(category.id!!, category.name)).rejects.toThrow('Ha ocurrido un error al guardar, intente de nuevo');
  });

  it('should not throw if deleteCategory throws', async () => {
    mockDataSource.deleteCategory.mockImplementation(() => { throw new Error('fail'); });
    await expect(repository.deleteCategory(1)).resolves.toBeUndefined();
  });
});