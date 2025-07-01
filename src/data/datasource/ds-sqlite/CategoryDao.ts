import Category from "../../model/Category.js";
import type { ICategoryDataSource } from "../ds-interfaces/ICategoryDataSource.js";
import type PosDatabase from "./PosDatabase.js";

class CategoryDao implements ICategoryDataSource {

    private dbInstance;

    constructor(dbInstance: PosDatabase) {
        this.dbInstance = dbInstance.getInstance();
    }

    getAllCategories(): Promise<Category[]> {
        return new Promise<Category[]>((resolve: any, reject: any) => {
            this.dbInstance.serialize(() => {
                this.dbInstance.all('SELECT * FROM categories ORDER BY name ASC', (error: Error | null, rows: any[]) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    const categories: Category[] = rows.map(row => 
                        new Category(
                            row.id,
                            row.name
                        )
                    );
                    resolve(categories);
                });
            });
        });        
    }

    getCategoryById(categoryId: number): Promise<Category> {
        return new Promise<Category>((resolve: any, reject: any) => {
            this.dbInstance.serialize(() => {
                this.dbInstance.get('SELECT * FROM categories WHERE id=?', [categoryId], (error: Error | null, row: any) => {
                    if (error) {
                        return reject(error);
                    }
                    if (!row) {
                        return resolve(undefined);
                    }
                    const categoryRecived: Category = new Category(
                        row.id,
                        row.name
                    );
                    resolve(categoryRecived);
                });
            });
        });
    }

    getCategoryByName(name: string): Promise<Category> {
        return new Promise<Category>((resolve: any, reject: any) => {
            this.dbInstance.serialize(() => {
                this.dbInstance.get('SELECT * FROM categories WHERE name=?', [name], (error: Error | null, row: any) => {
                    if (error) {
                        return reject(error);
                    }
                    if (!row) {
                        return resolve(undefined);
                    }
                    const categoryRecived: Category = new Category(
                        row.id,
                        row.name
                    );
                    resolve(categoryRecived);
                });
            });
        });
    }

    saveCategory(name: string): Promise<void> {
        return new Promise((resolve: any, reject: any) => {
            this.dbInstance.serialize(() => {
                const statement = this.dbInstance.prepare(
                    'INSERT INTO categories(name) VALUES (?)'
                );
                statement.run(
                    name,
                    (error: Error | null) => {
                        if (error) { reject(error) }
                        else { resolve() }
                    }
                );
            });
        });
    }

    updateCategory(category: Category): Promise<void> {
        return new Promise((resolve: any, reject: any) => {
            this.dbInstance.serialize(() => {
                const statement = this.dbInstance.prepare(
                    'UPDATE categories SET name=? WHERE id=?'
                );
                statement.run(
                    category.name,
                    category.id,
                    (error: Error | null) => {
                        if (error) { reject(error); }
                        else { resolve(); }
                    }
                );
            });
        });
    }

    deleteCategory(categoryId: number): Promise<void> {
        return new Promise((resolve: any, reject: any) => {
            this.dbInstance.serialize(() => {
                const updateProductsStatment = this.dbInstance.prepare(
                    'UPDATE products SET categoryId=1 WHERE categoryId=?'
                );
                updateProductsStatment.run(
                    categoryId,
                    (error: Error | null) => {
                        if (error) { reject(error); }
                    }
                );

                const statement = this.dbInstance.prepare(
                    'DELETE FROM categories WHERE id=?'
                );
                statement.run(
                    categoryId,
                    (error: Error | null) => {
                        if (error) { reject(error); }
                        else { resolve(); }
                    }
                );
            });
        });
    }
}

export default CategoryDao;