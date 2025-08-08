import PosConfig from './PosConfig.js';
import fs from 'fs';
import path from 'path';
import { app, dialog } from 'electron';

class PosConfigRepository {

    private posConfigFilePath: string;

    constructor(posConfigFilePath: string) {
        this.posConfigFilePath = posConfigFilePath;
    }

    async getPosConfig(): Promise<PosConfig> {
        return new Promise<PosConfig>((resolve, reject) => {
            try {
                const data = fs.readFileSync(this.posConfigFilePath, 'utf-8');
                const config = JSON.parse(data);
                const posConfig = new PosConfig(config.bussinessName, config.bussinessLogoUrl, config.minimunStock, config.posLanguage);
                resolve(posConfig);
            } catch (error) {
                reject(error);
            }
        });
    }

    async savePosConfig(bussinessName: string, bussinessLogoUrl: string, minimunStock: number, posLanguage: string) {
        if (this.validatePosConfigData(bussinessName, minimunStock)) {
            const dataToSave = {
                bussinessName: bussinessName ? bussinessName : "Mi negocio",
                bussinessLogoUrl: bussinessLogoUrl ? bussinessLogoUrl : "../../assets/react.svg",
                minimunStock: minimunStock ? minimunStock : 5,
                posLanguage: posLanguage ? posLanguage : "es"
            };
            fs.writeFileSync(this.posConfigFilePath, JSON.stringify(dataToSave, null, 2), 'utf-8');
        }
    }

    async selectNewBussinessLogo(): Promise<string | undefined> {
        const imageSelected = await dialog.showOpenDialog({
            title: 'Seleccione un nuevo logo',
            properties: ['openFile'],
            filters: [{ name: 'Imagenes', extensions: ['png', 'jpg', 'jpeg'] }]
        });
        if (imageSelected.canceled || imageSelected.filePaths.length === 0) return undefined;
        return this.saveBussinessLogo(imageSelected.filePaths[0]);
    }

    private async saveBussinessLogo(bussinessLogoUrl: string) {
        const extensionFile = path.extname(bussinessLogoUrl);
        const fileName = `bussiness_logo${extensionFile}`;
        if (!['.png', '.jpg', '.jpeg'].includes(extensionFile.toLowerCase())) {
            throw new Error('Invalid file type');
        }
        const pathDestino = path.join(app.getPath('userData'), fileName);
        fs.copyFileSync(bussinessLogoUrl, pathDestino);
        return pathDestino;
    }

    private validatePosConfigData(bussinessName: string, minimunStock: number): boolean {
        if (!bussinessName || bussinessName.length === 0 || bussinessName.length > 50) {
            throw new Error("El nombre del negocio no puede ser vacío y debe tener máximo 50 caracteres");
        }
        if (minimunStock < 0) {
            throw new Error("El stock mínimo no puede ser negativo");
        }
        return true;
    }
}

export default PosConfigRepository;