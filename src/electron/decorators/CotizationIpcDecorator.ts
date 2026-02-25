import { IpcMain } from "electron";
import CotizationRepository from "../../data/repository/CotizationRepository";
import CotizationProduct from "../../data/model/CotizationProduct";

class CotizationIpcDecorator {

    private cotizationRepository: CotizationRepository;
    private ipcMain: IpcMain;

    constructor(cotizationRepository: CotizationRepository, ipcMain: IpcMain) {
        this.cotizationRepository = cotizationRepository;
        this.ipcMain = ipcMain;
    }

    async configure() {
        await this.configureCotizationIpcMethods();
    }

    private async configureCotizationIpcMethods() {
        this.ipcMain.handle('cotizationApi:saveCotization', async (event, dateOfCotization: Date, client: string, userToRegister: string, products: CotizationProduct[]) => {
            await this.cotizationRepository.saveCotization(
                dateOfCotization, client, userToRegister, products
            );            
        });
        
        this.ipcMain.handle('cotizationApi:updateCotization', async (event, id: number, dateOfCotization: Date, client: string, userToRegister: string, products: CotizationProduct[]) => {
            await this.cotizationRepository.updateCotization(
                id, dateOfCotization, client, userToRegister, products
            );
        });

        this.ipcMain.handle('cotizationApi:deleteCotization', async (event, cotizationId: number) => {
            await this.cotizationRepository.deleteCotization(cotizationId);
        });

        this.ipcMain.handle('cotizationApi:getAllCotizations', async (event) => {
            return await this.cotizationRepository.getAllCotizations();
        })

        this.ipcMain.handle('cotizationApi:getCotizationById', async (event, cotizationId) => {
            return await this.cotizationRepository.getCotizationById(cotizationId);
        });
    }

}

export default CotizationIpcDecorator;