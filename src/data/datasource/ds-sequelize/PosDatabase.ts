import { DataTypes, Sequelize } from "sequelize";
import { SequelizeStorage, Umzug } from "umzug";
import path from "path";
import UserDao from "./UserDao";
import CategoryDao from "./CategoryDao";
import ProductDao from "./ProductDao";
import SaleDao from "./SaleDao";
import CashClosingDao from "./CashClosingDao";

class PosDatabase {

    private sequelize: Sequelize;
    private UserSequelize: any;
    private CategorySequelize: any;
    private ProductSequelize: any;
    private SaleSequelize: any;
    private SaleProductsSequelize: any;
    private CashClosingSequelize: any;

    private userDao: UserDao | null = null;
    private categoryDao: CategoryDao | null = null;
    private productDao: ProductDao | null = null;
    private saleDao: SaleDao | null = null;
    private cashClosingDao: CashClosingDao | null = null;

    constructor(dbPath: string | 'test') {
        this.sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: dbPath === 'test' ? ':memory:' : dbPath,
        });
    }

    async close() {
        await this.sequelize.close();
    }

    async initialize() {
        this.createUserTable();
        this.createCategoryTable();
        this.createProductTable();
        this.createSaleTable();
        this.createSalesProductsTable();
        this.createCashClosingTable();
        this.stableshRelationships();
        //this.checkMigrations(this.sequelize);
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

    private createCashClosingTable() {
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
    }

    private createCategoryTable() {
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
    }

    private createProductTable() {
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
    }

    private createSalesProductsTable() {
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
    }

    private createSaleTable() {
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
    }

    private createUserTable() {
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
    }

    private stableshRelationships() {
        this.SaleSequelize.hasMany(this.SaleProductsSequelize);
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

    private async checkMigrations(sequelize: any) {
        const umzug = new Umzug({
            migrations: {glob: path.join(__dirname, 'migrations', '*.js')},
            context: sequelize.getQueryInterface(),
            storage: new SequelizeStorage({sequelize}),
            logger: console
        });
        await umzug.up();
    }
}

export default PosDatabase;