import sqlite3 from "sqlite3";
import UserDao from "./UserDao.js";

class PosDatabase {

    private db: any | null = null;
    private dbPath: string | 'test';
    private userDao: UserDao | null = null;

    constructor(dbPath: string | 'test') {
        this.dbPath = dbPath;
    }

    async initialize(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                this.db = new sqlite3.Database(this.dbPath === 'test' ? ':memory:' : this.dbPath);
                if (this.db) {
                    this.createUserTable();
                    this.userDao = new UserDao(this);
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
                id VARCHAR(255) PRIMARY KEY,
                name VARCHAR(50),
                password VARCHAR(255),
                isAdmin TINYINT
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

    getUserDao(): UserDao {
        if (!this.userDao) {
            this.userDao = new UserDao(this.db);
        }
        return this.userDao;
    }

}

export default PosDatabase;