import { DataTypes, Sequelize } from "sequelize";
import sqlite3 from "sqlite3";
import { existsSync } from 'fs';
import { copyFile, unlink } from 'fs/promises'
import UserDao from "./UserDao";
import CategoryDao from "./CategoryDao";
import ProductDao from "./ProductDao";
import SaleDao from "./SaleDao";
import CashClosingDao from "./CashClosingDao";
import EgressDao from "./EgressDao";
import CotizationDao from "./CotizationDao";

class PosDatabase {

    private sequelize: Sequelize;
    private dbPath: string;
    private UserSequelize: any;
    private CategorySequelize: any;
    private ProductSequelize: any;
    private SaleSequelize: any;
    private SaleProductsSequelize: any;
    private CashClosingSequelize: any;
    private EgressSequelize: any;
    private CotizationSequelize: any;
    private CotizationProductsSequelize: any;

    private userDao: UserDao | null = null;
    private categoryDao: CategoryDao | null = null;
    private productDao: ProductDao | null = null;
    private saleDao: SaleDao | null = null;
    private cashClosingDao: CashClosingDao | null = null;
    private egressDao: EgressDao | null = null;
    private cotizationDao: CotizationDao | null = null;

    constructor(dbPath: string | 'test') {
        this.dbPath = dbPath === 'test' ? ':memory:' : dbPath;
        this.sequelize = new Sequelize({
            dialect: 'sqlite',
            dialectModule: sqlite3,
            storage: dbPath === 'test' ? ':memory:' : dbPath,
        });
    }

    async close() {
        await this.sequelize.close();
    }

    async initialize() {
        this.defineModels();
        await this.sequelize.sync();
        try {
            await this.sequelize.authenticate();
            console.log('Connection has been established successfully.');
            this.insertDefaultData();
        } catch (error) {
            console.log('Unable to connect to the database:', error);
            throw new Error("Error al conectar a la base de datos");
        }
    }

    private defineModels() {
        this.UserSequelize = this.sequelize.define('users',
            {
                id: {
                    type: DataTypes.TEXT,
                    primaryKey: true,
                    allowNull: false
                },
                name: {
                    type: DataTypes.TEXT,
                    allowNull: false
                },
                password: {
                    type: DataTypes.TEXT,
                    allowNull: false
                },
                isAdmin: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: false
                }
            },
            {
                timestamps: false
            }
        );

        this.CashClosingSequelize = this.sequelize.define('cash_closings',
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                date: {
                    type: DataTypes.DATE,
                    allowNull: false
                },
                physicalMoney: {
                    type: DataTypes.DOUBLE,
                    allowNull: false
                },
                totalOfDay: {
                    type: DataTypes.DOUBLE,
                    allowNull: false
                },
                userName: {
                    type: DataTypes.TEXT,
                    allowNull: false
                }
            },
            {
                timestamps: false
            }
        );

        this.CategorySequelize = this.sequelize.define('categories',
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                name: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    unique: true
                }
            },
            {
                timestamps: false
            }
        );

        this.CotizationSequelize = this.sequelize.define('cotizations',
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                dateOfCotization: {
                    type: DataTypes.DATE,
                    allowNull: false
                },
                client: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                userToRegister: {
                    type: DataTypes.STRING,
                    allowNull: false
                }
            },
            {
                timestamps: false
            }
        );

        this.EgressSequelize = this.sequelize.define('egresses',
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                dateOfEgress: {
                    type: DataTypes.DATE,
                    allowNull: false
                },
                amount: {
                    type: DataTypes.DOUBLE,
                    allowNull: false
                },
                description: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                userToRegister: {
                    type: DataTypes.TEXT,
                    allowNull: false
                }
            },
            {
                timestamps: false
            }
        );

        this.ProductSequelize = this.sequelize.define('products',
            {
                code: {
                    type: DataTypes.TEXT,
                    primaryKey: true,
                    allowNull: false
                },
                name: {
                    type: DataTypes.TEXT,
                    allowNull: false
                },
                unitPrice: {
                    type: DataTypes.DOUBLE,
                    allowNull: false
                },
                stock: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                isInfinityStock: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: false
                }
            },
            {
                timestamps: false
            }
        );

        this.CotizationProductsSequelize = this.sequelize.define('cotizations_products',
            {
                cotizationId: {
                    type: DataTypes.INTEGER,
                    references: {
                        model: this.CotizationSequelize,
                        key: 'id'
                    }
                },
                productCode: {
                    type: DataTypes.TEXT,
                    references: {
                        model: this.ProductSequelize,
                        key: 'code'
                    }
                },
                unitsSold: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                }
            },
            {
                timestamps: false
            }
        );

        this.SaleSequelize = this.sequelize.define('sales',
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                dateOfSale: {
                    type: DataTypes.DATE,
                    allowNull: false
                },
                userToGenerateSale: {
                    type: DataTypes.TEXT,
                    allowNull: false
                },
                paymentType: {
                    type: DataTypes.TEXT,
                    allowNull: false
                },
                amountPayed: {
                    type: DataTypes.DOUBLE,
                    allowNull: false
                },
                paymentFolio: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: null
                },
                totalSale: {
                    type: DataTypes.DOUBLE,
                    allowNull: false
                }
            },
            {
                timestamps: false
            }
        );

        this.SaleProductsSequelize = this.sequelize.define('sales_products',
            {
                saleId: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                productName: {
                    type: DataTypes.TEXT,
                    allowNull: false
                },
                unitPrice: {
                    type: DataTypes.DOUBLE,
                    allowNull: false
                },
                unitsSold: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                }
            },
            {
                timestamps: false
            }
        );

        this.SaleSequelize.hasMany(this.SaleProductsSequelize);
        this.SaleProductsSequelize.belongsTo(this.SaleSequelize);

        this.CategorySequelize.hasMany(this.ProductSequelize);
        this.ProductSequelize.belongsTo(this.CategorySequelize);
    }

    getCashClosingDao() {
        if (!this.cashClosingDao) {
            this.cashClosingDao = new CashClosingDao(this.CashClosingSequelize, this.sequelize);
        }
        return this.cashClosingDao;
    }

    getCategoryDao() {
        if (!this.categoryDao) {
            this.categoryDao = new CategoryDao(this.CategorySequelize, this.sequelize);
        }
        return this.categoryDao;
    }

    getProductDao() {
        if (!this.productDao) {
            this.productDao = new ProductDao(this.ProductSequelize, this.CategorySequelize);
        }
        return this.productDao;
    }

    getSaleDao() {
        if (!this.saleDao) {
            this.saleDao = new SaleDao(this.SaleSequelize, this.SaleProductsSequelize, this.sequelize);
        }
        return this.saleDao;
    }

    getEgressDao() {
        if (!this.egressDao) {
            this.egressDao = new EgressDao(this.EgressSequelize);
        }
        return this.egressDao;
    }

    getCotizationDao() {
        if (!this.cotizationDao) {
            this.cotizationDao = new CotizationDao(this.CotizationSequelize, this.CotizationProductsSequelize);
        }
        return this.cotizationDao;
    }

    getUserDao(): UserDao {
        if (!this.userDao) {
            this.userDao = new UserDao(this.UserSequelize);
        }
        return this.userDao
    }

    private async insertDefaultData() {
        const categories = await this.CategorySequelize.findAll();
        if (categories && categories.length === 0) {
            await this.CategorySequelize.create({ name: "Todos" });
        }
    }

    async createBackup(path: string) {
        try {
            if (existsSync(path)) {
                await unlink(path);
            }
            await this.sequelize.query(`VACUUM INTO '${path}'`);
            return {
                success: true,
                path: path
            };
        } catch (error) {
            console.error('Error durante el backup:', error);
            return {
                success: false
            };
        }
    }

    private async isEschemaValid(dbPath: string): Promise<boolean> {
        const tempSequelize = new Sequelize({
            dialect: 'sqlite',
            storage: dbPath,
            logging: false
        });
        try {
            const queryInterface = tempSequelize.getQueryInterface();
            const tablas = await queryInterface.showAllTables();

            if (!tablas.includes('Usuarios') || !tablas.includes('Configuracion')) {
                console.error("Esquema inválido: Faltan tablas críticas.");
                return false;
            }

            

            return true;
        } catch (error) {
            console.error("No es un archivo SQLite válido o está corrupto.");
            return false;
        } finally {
            await tempSequelize.close();
        }
    }

    async loadBackup(backupPath: string) {
        const currentDbPath = this.dbPath;
        if (currentDbPath != ':memory:') {
            try {
                await this.sequelize.close();

                const tempPath = `${currentDbPath}.tmp`;
                if (existsSync(currentDbPath)) {
                    await copyFile(currentDbPath, tempPath);
                }

                await copyFile(backupPath, currentDbPath);

                if (existsSync(tempPath)) await unlink(tempPath);
                if (existsSync(`${currentDbPath}-wal`)) await unlink(`${currentDbPath}-wal`);
                if (existsSync(`${currentDbPath}-shm`)) await unlink(`${currentDbPath}-shm`);

                return { success: true };
            } catch (error) {
                console.error('Error durante la carga del backup:', error);
                return {
                    success: false
                }
            }
        }
    }
}

export default PosDatabase;