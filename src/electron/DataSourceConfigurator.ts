import { app, IpcMain } from 'electron';
import fs from 'fs';
import path from 'path';
import { isDev } from '../electron/util';
import PosDatabase from '../data/datasource/ds-sequelize/PosDatabase';
import UserRepository from '../data/repository/UserRepository';
import UserIpcDecorator from './decorators/UserIpcDecorator';
import CategoryRepository from '../data/repository/CategoryRepository';
import ProductRepository from '../data/repository/ProductRepository';
import InventoryIpcDecorator from './decorators/InventoryIpcDecorator';
import SaleRepository from '../data/repository/SaleRepository';
import SaleIpcDecorator from './decorators/SaleIpcDecorators';
import CashClosingRepository from '../data/repository/CashClosingRepository';
import CashClosingIpcDecorator from './decorators/CashClosingIpcDecoratos';
import PosConfigRepository from '../data/pos-config/PosConfigRepository';
import PosConfigIpcDecorator from './decorators/PosConfigIpcDecorator';

class DataSourceConfigurator {

    private ipcMain: IpcMain;
    private posDatabase: PosDatabase;

    constructor(ipcMain: IpcMain) {
        this.ipcMain = ipcMain;
    }

    async configure() {
        const posConfigPath = await this.checkPosFileConfigAndGetPath();
        await this.checkCurrentSaleBackupExist();
        await this.configureDatabase(posConfigPath);
    }

    async close() {
        await this.posDatabase.close();
    }

    private async checkPosFileConfigAndGetPath() {
        try {
            const configFilePath = isDev() ? 'pos_dev_config.json' : path.join(app.getPath('userData'), 'pos_config.json');
            console.log(`PosConfigFile path: ${configFilePath}`);
            if (!fs.existsSync(configFilePath)) {
                const defaultConfig = {
                    bussinessName: "Mi tienda",
                    bussinessLogoUrl: '../icons/icon.png',
                    minimunStock: 5,
                    posLanguage: "es"
                };
                fs.writeFileSync(configFilePath, JSON.stringify(defaultConfig, null, 2), 'utf-8');
            }
            return configFilePath;

        } catch (error) {
            throw new Error(`Error to set configFile: ${error}`);
        }
    }

    private async checkCurrentSaleBackupExist() {
        try {
            const backupCurrentSalePath = isDev() ? 'pos_dev_current_sale.json' : path.join(app.getPath('userData'), 'pos_current_sale.json');
            if (!fs.existsSync(backupCurrentSalePath)) {
                fs.writeFileSync(backupCurrentSalePath, JSON.stringify([], null, 2), 'utf-8');
            }
        } catch(error) {
            throw new Error(`Error to create current sale backup: ${error}`)
        }
    }

    private async configureDatabase(posConfigPath: string) {
        const dbPath = isDev() ? 'pos_dev_database.sqlite' : path.join(app.getPath('userData'), 'pos_database.sqlite');
        console.log(`Database path:${dbPath}`);
        this.posDatabase = new PosDatabase(dbPath);
        await this.posDatabase.initialize();
        console.log('Database initialized');
        if (this.posDatabase) {
            const posConfigRepository = new PosConfigRepository(posConfigPath);
            const posConfigDecorator = new PosConfigIpcDecorator(this.ipcMain, posConfigRepository);
            await posConfigDecorator.configure();

            const categoryRepository = new CategoryRepository(this.posDatabase.getCategoryDao());
            const productRepository = new ProductRepository(this.posDatabase.getProductDao());
            const inventoryDecorator = new InventoryIpcDecorator(this.ipcMain, categoryRepository, productRepository);
            inventoryDecorator.configure();

            const saleRepository = new SaleRepository(this.posDatabase.getSaleDao(), productRepository);
            const saleDecorator = new SaleIpcDecorator(this.ipcMain, saleRepository);
            saleDecorator.configure();

            const userRepository = new UserRepository(this.posDatabase.getUserDao());
            const userDecorator = new UserIpcDecorator(userRepository, this.ipcMain);
            await userDecorator.configure();

            const cashClosingRepository = new CashClosingRepository(this.posDatabase.getCashClosingDao());
            const cashClosingDecorator = new CashClosingIpcDecorator(this.ipcMain, cashClosingRepository);
            await cashClosingDecorator.configure();
        }
    }
}

export default DataSourceConfigurator;