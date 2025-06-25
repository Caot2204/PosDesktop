import type Category from "../../model/Category.js";

export interface ICategoryDataSource {
    
    getAllCategories(): Promise<Category[]>;

    getCategoryById(categoryId: number): Promise<Category>;

    getCategoryByName(name: string): Promise<Category>;

    saveCategory(name: string): Promise<void>;
    
    updateCategory(category: Category): Promise<void>;

    deleteCategory(categoryId: number): Promise<void>;

}