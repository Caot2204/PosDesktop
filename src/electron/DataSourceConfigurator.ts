import { app, IpcMain } from 'electron';
import path from 'path';
import { isDev } from './util.js';
import PosDatabase from '../data/datasource/ds-sequelize/PosDatabase.js';
import UserRepository from '../data/repository/UserRepository.js';
import UserIpcDecorator from './decorators/UserIpcDecorator.js';
import CategoryRepository from '../data/repository/CategoryRepository.js';
import ProductRepository from '../data/repository/ProductRepository.js';
import InventoryIpcDecorator from './decorators/InventoryIpcDecorator.js';
import SaleRepository from '../data/repository/SaleRepository.js';
import SaleIpcDecorator from './decorators/SaleIpcDecorators.js';
import CashClosingRepository from '../data/repository/CashClosingRepository.js';
import CashClosingIpcDecorator from './decorators/CashClosingIpcDecoratos.js';


class DataSourceConfigurator {

    private ipcMain: IpcMain;

    constructor(ipcMain: IpcMain) {
        this.ipcMain = ipcMain;
    }

    async configure() {
        const dbPath = isDev() ? 'pos_dev_database.sqlite' : path.join(app.getAppPath(), 'pos_database.sqlite');
        console.log(`Database path:${dbPath}`);
        const posDatabase = new PosDatabase(dbPath);
        await posDatabase.initialize();
        console.log('Database initialized');
        if (posDatabase) {
            const categoryRepository = new CategoryRepository(posDatabase.getCategoryDao());
            const productRepository = new ProductRepository(posDatabase.getProductDao());
            const inventoryDecorator = new InventoryIpcDecorator(this.ipcMain, categoryRepository, productRepository);
            inventoryDecorator.configure();

            const saleRepository = new SaleRepository(posDatabase.getSaleDao(), productRepository);
            const saleDecorator = new SaleIpcDecorator(this.ipcMain, saleRepository);
            saleDecorator.configure();

            const userRepository = new UserRepository(posDatabase.getUserDao());
            const userDecorator = new UserIpcDecorator(userRepository, this.ipcMain);
            await userDecorator.configure();

            const cashClosingRepository = new CashClosingRepository(posDatabase.getCashClosingDao());
            const cashClosingDecorator = new CashClosingIpcDecorator(this.ipcMain, cashClosingRepository);
            await cashClosingDecorator.configure();
        }
    }
}

export default DataSourceConfigurator;