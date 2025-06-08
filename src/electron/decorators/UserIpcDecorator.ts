import PosDatabase from '../../data/datasource/ds-sqlite/PosDatabase.js';
import UserDao from '../../data/datasource/ds-sqlite/UserDao.js';
import UserRepository from '../../data/repository/UserRepository.js';

class UserIpcDecorator {

    private userRepository: UserRepository;
    private ipcMain: Electron.IpcMain;

    constructor(dbInstance: PosDatabase, ipcMain: Electron.IpcMain) {
        this.userRepository = new UserRepository(new UserDao(dbInstance));
        this.ipcMain = ipcMain;
    }

    configure() {
        this.configureUserIpcMethods();
    }

    private async configureUserIpcMethods() {
        this.ipcMain.handle('userApi:saveUser', async (event, name: string, password: string, isAdmin: boolean) => {
            await this.userRepository.saveUser(name, password, isAdmin);
        });

        this.ipcMain.handle('userApi:updateUser', async (event, id: string, name: string, password: string, isAdmin: boolean) => {
            await this.userRepository.updateUser(id, name, password, isAdmin);
        });

        this.ipcMain.handle('userApi:deleteUser', async (event, userId: string) => {
            await this.userRepository.deleteUser(userId);
        });

        this.ipcMain.handle('userApi:getAllUsers', async (event) => {
            return await this.userRepository.getAllUsers();
        });
        console.log("User methods configured succesfully");
    }
}

export default UserIpcDecorator;