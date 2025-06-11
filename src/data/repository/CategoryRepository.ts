import type { ICategoryDataSource } from '../datasource/ds-interfaces/ICategoryDataSource.js';
import Category from '../model/Category.js';

class CategoryRepository {
    
    private categoryDataSource: ICategoryDataSource;

    constructor(categoryDataSource: ICategoryDataSource) {
        this.categoryDataSource = categoryDataSource;
    }

    async getAllCategories() {
        return this.categoryDataSource.getAllCategories();
    }

    async getCategoryById(categoryId: number) {
        return this.categoryDataSource.getCategoryById(categoryId);
    }

    async saveCategory(name: string) {
        if (this.validateCategoryData(name)) {
            this.categoryDataSource.saveCategory(name);
        }
    }

    async updateCategory(category: Category) {
        if (this.validateCategoryData(category.name)) {
            this.categoryDataSource.updateCategory(category);
        }
    }

    async deleteCategory(categoryId: number) {
        this.categoryDataSource.deleteCategory(categoryId);
    }

    private validateCategoryData(name: string): boolean {
        if (!name || name.length === 0 || name.length > 50) {
            throw new Error("La categoría no puede ser vacía y debe tener maximo 50 caracteres");
        }
        return true;
    }

}

export default CategoryRepository;