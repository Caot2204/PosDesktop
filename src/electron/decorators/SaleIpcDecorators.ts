import { IpcMain } from "electron";
import SaleRepository from '../../data/repository/SaleRepository';
import SaleProductModel from '../../ui/sales/model/SalesProductModel';

class SaleIpcDecorator {

    private saleRepository: SaleRepository;
    private ipcMain: IpcMain;

    constructor(ipcMain: IpcMain, saleRepository: SaleRepository) {
        this.ipcMain = ipcMain;
        this.saleRepository = saleRepository;
    }

    async configure() {
        await this.configureSaleIpcMethods();
    }

    private async configureSaleIpcMethods() {
        this.ipcMain.handle('saleApi:getSaleById', async (event, saleId: number) => {
            return await this.saleRepository.getSaleById(saleId);
        });
        
        this.ipcMain.handle('saleApi:getSalesByDate', async (event, dayOfSale: Date) => {
            return await this.saleRepository.getSalesByDate(dayOfSale);
        });

        this.ipcMain.handle('saleApi:saveSale', async (event, dateOfSale: Date, userToGenerateSale: string, productsSold: SaleProductModel[], paymentType: string, amountPayed: number, totalSale: number) => {
            await this.saleRepository.saveSale(dateOfSale, userToGenerateSale, productsSold, paymentType, amountPayed, totalSale);
        });
    }
}

export default SaleIpcDecorator;