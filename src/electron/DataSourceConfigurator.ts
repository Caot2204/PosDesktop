import { app, IpcMain } from 'electron';
import path from 'path';
import { isDev } from './util.js';
import PosDatabase from '../data/datasource/ds-sqlite/PosDatabase.js';
import UserRepository from '../data/repository/UserRepository.js';
import UserIpcDecorator from './decorators/UserIpcDecorator.js';
import CategoryRepository from '../data/repository/CategoryRepository.js';
import CategoryIpcDecorator from './decorators/CategoryIpcDecorator.js';


class DataSourceConfigurator {

    private ipcMain: IpcMain;
    private dbInstance: any | null;

    constructor(ipcMain: IpcMain) {
        this.ipcMain = ipcMain;
    }

    async configureWithSqlite() {
        const dbPath = isDev() ? 'pos_dev_database.sqlite' : path.join(app.getAppPath(), 'pos_database.sqlite');
        console.log(`Database path:${dbPath}`);
        this.dbInstance = new PosDatabase(dbPath);
        await this.dbInstance.initialize();
        console.log('Database initialized');

        if (this.dbInstance) {
            const categoryRepository = new CategoryRepository(this.dbInstance.getCategoryDao());
            const categoryDecorator = new CategoryIpcDecorator(categoryRepository, this.ipcMain);
            await categoryDecorator.configure();

            const userRepository = new UserRepository(this.dbInstance.getUserDao());
            const userDecorator = new UserIpcDecorator(userRepository, this.ipcMain);
            await userDecorator.configure();
        }
    }
}

export default DataSourceConfigurator;