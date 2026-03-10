import { IpcMain } from "electron";
import CotizationRepository from "../../data/repository/CotizationRepository";
import CotizationProduct from "../../data/model/CotizationProduct";
import { IProductDataSource } from "../../data/datasource/ds-interfaces/IProductDataSource";
import CotizationPdfMaker from "../CotizationPdfMaker";

class CotizationIpcDecorator {

    private cotizationRepository: CotizationRepository;
    private ipcMain: IpcMain;
    private productDataSource: IProductDataSource;

    constructor(cotizationRepository: CotizationRepository, ipcMain: IpcMain, productDataSource: IProductDataSource) {
        this.cotizationRepository = cotizationRepository;
        this.ipcMain = ipcMain;
        this.productDataSource = productDataSource;
    }

    async configure() {
        await this.configureCotizationIpcMethods();
    }

    private async configureCotizationIpcMethods() {
        this.ipcMain.handle('cotizationApi:saveCotization', async (event, dateOfCotization: Date, client: string, userToRegister: string, products: CotizationProduct[]) => {
            const cotizationId = await this.cotizationRepository.saveCotization(
                dateOfCotization, client, userToRegister, products
            );
            return cotizationId;
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

        this.ipcMain.handle('cotizationApi:findCotizationPdf', async (event, cotizationId) => {
            return await CotizationPdfMaker.getInstance(this.productDataSource).findCotizationPdf(cotizationId);
        });

        this.ipcMain.handle('cotizationApi:createCotizationPdf', async (event, cotizationId: number) => {
            await CotizationPdfMaker.getInstance(this.productDataSource).createPdf(
                await this.cotizationRepository.getCotizationById(cotizationId)
            );
        });

        this.ipcMain.handle('cotizationApi:deleteCotizationPdf', async (event, cotizationId: number) => {
            await CotizationPdfMaker.getInstance(this.productDataSource).deletePdf(cotizationId);
        });
    }

}

export default CotizationIpcDecorator;