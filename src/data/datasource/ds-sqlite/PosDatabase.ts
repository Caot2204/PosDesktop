import sqlite3 from 'sqlite3';
import UserDao from './UserDao.js';
import User from '../../model/User.js';
import CategoryDao from './CategoryDao.js';
import ProductDao from './ProductDao.js';
import SaleDao from './SaleDao.js';

class PosDatabase {

    private db: any | null = null;
    private dbPath: string | 'test';
    private userDao: UserDao | null = null;
    private categoryDao: CategoryDao | null = null;
    private productDao: ProductDao | null = null;
    private saleDao: SaleDao | null = null;

    constructor(dbPath: string | 'test') {
        this.dbPath = dbPath;
    }

    async initialize(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                this.db = new sqlite3.Database(this.dbPath === 'test' ? ':memory:' : this.dbPath);
                if (this.db) {
                    this.createUserTable();
                    this.createCategoryTable();
                    this.createProductTable();
                    this.createSaleTable();
                    this.createSalesProductsTable();
                    this.userDao = new UserDao(this);
                    this.categoryDao = new CategoryDao(this);
                    this.productDao = new ProductDao(this, this.categoryDao);
                    this.saleDao = new SaleDao(this);
                    this.insertDefaultData();
                    resolve();
                } else {
                    reject(new Error("Database is not initialized"));
                }
            }
        });
    }

    getInstance(): any {
        if (this.db === null) {
            throw new Error("Database is not initialized");
        }
        return this.db;
    }

    async close(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.db) {
                this.db.close((err: Error | null) => {
                    if (err) {
                        console.error('Error closing database:', err.message);
                        reject(err);
                    } else {
                        console.log('Database closed.');
                        this.db = null;
                        resolve();
                    }
                });
            } else {
                resolve();
            }
        });
    }

    private createUserTable(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                return reject(new Error("Database is not initialized"));
            }
            this.db.run(`CREATE TABLE IF NOT EXISTS users(
                id VARCHAR(255) PRIMARY KEY NOT NULL,
                name VARCHAR(50) NOT NULL,
                password VARCHAR(255) NOT NULL,
                isAdmin TINYINT NOT NULL
            )`, (error: Error) => {
                if (error) {
                    console.error('Error creating users table: ', error.message);
                    reject(error);
                } else {
                    console.log('Users table checked/created');
                    resolve();
                }
            });
        })
    }

    private createCategoryTable(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                return reject(new Error("Database is not initialized"));
            }
            this.db.run(`CREATE TABLE IF NOT EXISTS categories(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name VARCHAR(50) UNIQUE NOT NULL            
            )`, (error: Error) => {
                if (error) {
                    console.error('Error creating categories table: ', error.message);
                    reject(error);
                } else {
                    console.log('Categories table checked/created');
                    resolve();
                }
            });
        });
    }

    private createProductTable(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                return reject(new Error("Database is not initialized"));
            }
            this.db.run(`CREATE TABLE IF NOT EXISTS products(
                code VARCHAR(50) PRIMARY KEY NOT NULL,
                name VARCHAR(100) NOT NULL,
                unitPrice DOUBLE NOT NULL,
                stock INT NOT NULL,
                isInfinityStock TINYINT NOT NULL,
                categoryId INT NOT NULL
            )`, (error: Error) => {
                if (error) {
                    console.error('Error creating products table: ', error.message);
                    reject(error);
                } else {
                    console.log('Products table checked/created');
                    resolve();
                }
            });
        });
    }

    private createSaleTable(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                return reject(new Error("Database is not initialized"));
            }
            this.db.run(`CREATE TABLE IF NOT EXISTS sales(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                dateOfSale DATETIME NOT NULL,
                userToGenerateSale VARCHAR(255) NOT NULL,
                paymentType VARCHAR(100) NOT NULL,
                amountPayed DOUBLE NOT NULL,
                totalSale DOUBLE NOT NULL
            )`, (error: Error) => {
                if (error) {
                    console.error("Error creating sales table: ", error.message);
                    reject(error);
                } else {
                    console.log("Sales table checked/created");
                    resolve();
                }
            });
        });
    }

    private createSalesProductsTable(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                return reject(new Error("Database is not initialized"));
            }
            this.db.run(`CREATE TABLE IF NOT EXISTS sales_products(
                saleId INT NOT NULL,
                productName VARCHAR(100) NOT NULL,
                unitPrice DOUBLE NOT NULL,
                unitsSold INT NOT NULL
            )`, (error: Error) => {
                if (error) {
                    console.error("Error creating sales_products table: ", error.message);
                    reject(error);
                } else {
                    console.log("Sales_products table checked/created");
                    resolve();
                }
            });
        });
    }

    getUserDao(): UserDao {
        if (!this.userDao) {
            this.userDao = new UserDao(this);
        }
        return this.userDao;
    }

    getCategoryDao(): CategoryDao {
        if (!this.categoryDao) {
            this.categoryDao = new CategoryDao(this);
        }
        return this.categoryDao;
    }

    getProductDao(): ProductDao {
        if (!this.productDao) {
            this.productDao = new ProductDao(this, this.getCategoryDao());
        }
        return this.productDao;
    }

    getSaleDao(): SaleDao {
        if (!this.saleDao) {
            this.saleDao = new SaleDao(this);
        }
        return this.saleDao;
    }

    private async insertDefaultData() {
        const category = await this.categoryDao?.getAllCategories();
        if (category?.length === 0) {
            await this.categoryDao?.saveCategory("Todos");
        }
        const users = await this.userDao?.getAllUsers();
        if (users?.length === 0) {
            await this.userDao?.saveUser(new User(
                "adminDefault",
                "Admin",
                "12345678",
                true
            ));
        }
    }

}

export default PosDatabase;