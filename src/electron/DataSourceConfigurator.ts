import { app, IpcMain } from 'electron';
import path from 'path';
import { isDev } from './util.js';
import PosDatabase from '../data/datasource/ds-sqlite/PosDatabase.js';
import UserRepository from '../data/repository/UserRepository.js';
import UserIpcDecorator from './decorators/UserIpcDecorator.js';
import CategoryRepository from '../data/repository/CategoryRepository.js';
import ProductRepository from '../data/repository/ProductRepository.js';
import InventoryIpcDecorator from './decorators/InventoryIpcDecorator.js';


class DataSourceConfigurator {

    private ipcMain: IpcMain;

    constructor(ipcMain: IpcMain) {
        this.ipcMain = ipcMain;
    }

    async configureWithSqlite() {
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

            const userRepository = new UserRepository(posDatabase.getUserDao());
            const userDecorator = new UserIpcDecorator(userRepository, this.ipcMain);
            await userDecorator.configure();
        }
    }
}

export default DataSourceConfigurator;