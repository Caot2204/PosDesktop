import { app, IpcMain } from 'electron';
import path from 'path';
import { isDev } from './util.js';
import PosDatabase from '../data/datasource/ds-sqlite/PosDatabase.js';
import UserRepository from '../data/repository/UserRepository.js';
import UserIpcDecorator from './decorators/UserIpcDecorator.js';


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

        this.configureUserMethods();
    }

    private configureUserMethods() {
        if (this.dbInstance) {
            const userRepository = new UserRepository(this.dbInstance.getUserDao());
            const userDecorator = new UserIpcDecorator(userRepository, this.ipcMain);
            userDecorator.configure();
        }
    }
}

export default DataSourceConfigurator;