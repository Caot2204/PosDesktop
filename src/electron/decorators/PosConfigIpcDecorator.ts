import { IpcMain, nativeImage } from 'electron';
import fs from 'fs';
import PosConfigRepository from '../../data/pos-config/PosConfigRepository.js';

class PosConfigIpcDecorator {
    private ipcMain: IpcMain;
    private posConfigRepository: PosConfigRepository;

    constructor(ipcMain: Electron.IpcMain, posConfigRepository: PosConfigRepository) {
        this.ipcMain = ipcMain;
        this.posConfigRepository = posConfigRepository;
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

        console.log("PosConfig methods configured succesfully");
    }
}

export default PosConfigIpcDecorator;