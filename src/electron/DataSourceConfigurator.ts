import { app, IpcMain } from 'electron';
import fs from 'fs';
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
import PosConfigRepository from '../data/pos-config/PosConfigRepository.js';
import PosConfigIpcDecorator from './decorators/PosConfigIpcDecorator.js';

class DataSourceConfigurator {

    private ipcMain: IpcMain;

    constructor(ipcMain: IpcMain) {
        this.ipcMain = ipcMain;
    }

    async configure() {
        const posConfigPath = await this.checkPosFileConfigAndGetPath();
        await this.configureDatabase(posConfigPath);
    }

    private async checkPosFileConfigAndGetPath(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            try {
                const configFilePath = isDev() ? 'pos_dev_config.json' : path.join(app.getAppPath(), 'pos_config.json');
                console.log(`PosConfigFile path: ${configFilePath}`);
                if (!fs.existsSync(configFilePath)) {
                    const defaultConfig = {
                        bussinessName: "Mi tienda",
                        bussinessLogoUrl: null,
                        minimunStock: 5,
                        posLanguage: "es"
                    };
                    fs.writeFileSync(configFilePath, JSON.stringify(defaultConfig, null, 2), 'utf-8');
                }
                resolve(configFilePath);

            } catch (error) {
                reject(error);
            }
        });
    }

    private async configureDatabase(posConfigPath: string) {
        const dbPath = isDev() ? 'pos_dev_database.sqlite' : path.join(app.getAppPath(), 'pos_database.sqlite');
        console.log(`Database path:${dbPath}`);
        const posDatabase = new PosDatabase(dbPath);
        await posDatabase.initialize();
        console.log('Database initialized');
        if (posDatabase) {
            const posConfigRepository = new PosConfigRepository(posConfigPath);
            const posConfigDecorator = new PosConfigIpcDecorator(this.ipcMain, posConfigRepository);
            await posConfigDecorator.configure();

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