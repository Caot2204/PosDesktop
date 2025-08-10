import Category from '../../model/Category';
import type { ICategoryDataSource } from '../ds-interfaces/ICategoryDataSource';

class CategoryDao implements ICategoryDataSource {

    private CategorySequelize: any;

    constructor(categorySequelize: any) {
        this.CategorySequelize = categorySequelize;
    }

    getAllCategories(): Promise<Category[]> {
        return new Promise<Category[]>(async (resolve, reject) => {
            const categoriesDb = await this.CategorySequelize.findAll();
            if (categoriesDb) {
                const categories = categoriesDb.map((categoryDb: any) => new Category(
                    categoryDb.id,
                    categoryDb.name
                ));
                resolve(categories);
            } else {
                reject(new Error("Error al recuperar categorias"));
            }
        });
    }

    getCategoryById(categoryId: number): Promise<Category> {
        return new Promise<Category>(async (resolve, reject) => {
            const categoryDb = await this.CategorySequelize.findByPk(categoryId);
            if (categoryDb) {
                const category = new Category(
                    categoryDb.id,
                    categoryDb.name
                );
                resolve(category);
            } else {
                reject(new Error("Categoria no encontrada"));
            }
        });
    }

    getCategoryByName(name: string): Promise<Category> {
        return new Promise<Category>(async (resolve, reject) => {
            const categoryDb = await this.CategorySequelize.findOne({ where: { name: name } });
            if (categoryDb) {
                const category = new Category(
                    categoryDb.id,
                    categoryDb.name
                );
                resolve(category);
            } else {
                reject(new Error("Categoria no encontrada"));
            }
        });
    }

    saveCategory(name: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.CategorySequelize.create({
                name: name
            }).then(() => {
                resolve();
            }).catch((error: Error) => {
                reject(error);
            });
        });
    }

    updateCategory(category: Category): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const categoryDb = await this.CategorySequelize.findByPk(category.id);
            if (categoryDb) {
                categoryDb.name = category.name;
                categoryDb.save()
                    .then(() => {
                        resolve();
                    }).catch((error: Error) => {
                        reject(error);
                    });
            } else {
                reject(new Error("Categoria no encontrada"));
            }
        });
    }

    deleteCategory(categoryId: number): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const categoryDb = await this.CategorySequelize.findByPk(categoryId);
            if (categoryDb) {
                categoryDb.destroy()
                    .then(() => {
                        resolve();
                    })
                    .catch((error: Error) => {
                        reject(error);
                    });
            } else {
                reject(new Error("Categoria no encontrada"));
            }
        });
    }

}

export default CategoryDao;