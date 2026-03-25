import { dialog, IpcMain, nativeImage, app } from 'electron';
import fs from 'fs';
import PosConfigRepository from '../../data/pos-config/PosConfigRepository';
import i18n from '../../i18n';

class PosConfigIpcDecorator {
    private ipcMain: IpcMain;
    private posConfigRepository: PosConfigRepository;
    private createBackup: (path: string) => Promise<void>;
    private loadBackup: (path: string) => Promise<void>;

    constructor(ipcMain: Electron.IpcMain, posConfigRepository: PosConfigRepository, createBackupCallback: (path: string) => Promise<void>, loadBackupCallback: (path: string) => Promise<void>) {
        this.ipcMain = ipcMain;
        this.posConfigRepository = posConfigRepository;
        this.createBackup = createBackupCallback;
        this.loadBackup = loadBackupCallback;
    }

    async configure() {
        await this.configurePosConfigIpcMethods();
    }

    private async configurePosConfigIpcMethods() {
        this.ipcMain.handle('posConfigApi:getPosConfig', async () => {
            return await this.posConfigRepository.getPosConfig();
        });

        this.ipcMain.handle('posConfigApi:savePosConfig', async (event, bussinessName: string, bussinessLogoUrl: string, minimunStock: number, posLanguage: string) => {
            await this.posConfigRepository.savePosConfig(bussinessName, bussinessLogoUrl, minimunStock, posLanguage);
        });

        this.ipcMain.handle('posConfigApi:selectNewBussinessLogo', async () => {
            return await this.posConfigRepository.selectNewBussinessLogo();
        });

        this.ipcMain.handle('posConfigApi:getBussinessLogoDataUrl', async (event, logoPath: string) => {
            if (!fs.existsSync(logoPath)) return undefined;
            const image = nativeImage.createFromPath(logoPath);
            return image.toDataURL();
        });

        this.ipcMain.handle('posConfigApi:createDatabaseBackup', async (event) => {
            const language = (await this.posConfigRepository.getPosConfig()).posLanguage || 'es';
            i18n.changeLanguage(language);
            const { canceled, filePath } = await dialog.showSaveDialog({
                title: i18n.t('screens.administration.exportWindowTitle'),
                defaultPath: 'pos_database_backup.sqlite',
                buttonLabel: i18n.t('screens.administration.exportButtonWindowLabel'),
                filters: [{ name: 'SQLite Database', extensions: ['sqlite', 'db'] }]
            });

            if (canceled || !filePath) {
                return { success: false, canceled: true };
            }

            return await this.createBackup(filePath);
        });

        this.ipcMain.handle('posConfigApi:loadDatabaseBackup', async (event) => {
            const language = (await this.posConfigRepository.getPosConfig()).posLanguage || 'es';
            i18n.changeLanguage(language);
            const { canceled, filePaths } = await dialog.showOpenDialog({
                title: i18n.t('screens.administration.loadBackupWindowTitle'),
                buttonLabel: i18n.t('screens.administration.loadBackupButtonWindowLabel'),
                filters: [{ name: 'SQLite Database', extensions: ['sqlite', 'db'] }],
            });

            const backupPath = filePaths[0];

            if (canceled || !backupPath) {
                return { success: false, canceled: true };
            }

            return await this.loadBackup(backupPath);
        });

        this.ipcMain.handle('posConfigApi:restartApp', () => {
            app.relaunch();
            app.exit();
        });

        console.log("PosConfig methods configured succesfully");
    }
}

export default PosConfigIpcDecorator;