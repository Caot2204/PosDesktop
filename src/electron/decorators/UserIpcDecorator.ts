import UserRepository from '../../data/repository/UserRepository.js';

class UserIpcDecorator {

    private userRepository: UserRepository;
    private ipcMain: Electron.IpcMain;

    constructor(userRepository: UserRepository, ipcMain: Electron.IpcMain) {
        this.userRepository = userRepository;
        this.ipcMain = ipcMain;
    }

    async configure() {
        await this.configureUserIpcMethods();
    }

    private async configureUserIpcMethods() {
        this.ipcMain.handle('userApi:saveUser', async (event, name: string, password: string, isAdmin: boolean) => {
            await this.userRepository.saveUser(name, password, isAdmin);
        });

        this.ipcMain.handle('userApi:updateUser', async (event, id: string, name: string, isAdmin: boolean) => {
            await this.userRepository.updateUser(id, name, isAdmin);
        });

        this.ipcMain.handle('userApi:deleteUser', async (event, userId: string, isAdmin: boolean) => {
            await this.userRepository.deleteUser(userId, isAdmin);
        });

        this.ipcMain.handle('userApi:getAllUsers', async (event) => {
            return await this.userRepository.getAllUsers();
        });
        console.log("User methods configured succesfully");
    }
}

export default UserIpcDecorator;