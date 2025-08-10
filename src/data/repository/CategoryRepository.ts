import type { ICategoryDataSource } from '../datasource/ds-interfaces/ICategoryDataSource';

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
            try {
                this.categoryDataSource.saveCategory(name);
            } catch (error) {
                throw new Error("Ha ocurrido un error al guardar, intente de nuevo");
            }
        }
    }

    async updateCategory(categoryId: number, name: string) {
        if (categoryId) {
            const category = await this.getCategoryById(categoryId);
            if (category) {
                if (this.validateCategoryData(name)) {
                    category.name = name;
                    try {
                        this.categoryDataSource.updateCategory(category);
                    } catch (error) {
                        throw new Error("Ha ocurrido un error al guardar, intente de nuevo");
                    }
                }
            }
        }
    }

    async deleteCategory(categoryId: number) {
        try {
            this.categoryDataSource.deleteCategory(categoryId);
        } catch (error) {
            console.log(error);
        }
    }

    private validateCategoryData(name: string): boolean {
        if (!name || name.length === 0 || name.length > 50) {
            throw new Error("La categoría no puede ser vacía y debe tener maximo 50 caracteres");
        }
        return true;
    }

}

export default CategoryRepository;