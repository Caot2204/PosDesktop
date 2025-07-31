import { IpcMain } from "electron";
import CashClosingRepository from "../../data/repository/CashClosingRepository.js";

class CashClosingIpcDecorator {
    
    private ipcMain: IpcMain;
    private cashClosingRepository: CashClosingRepository;

    constructor(ipcMain: IpcMain, cashClosingRepository: CashClosingRepository) {
        this.ipcMain = ipcMain;
        this.cashClosingRepository = cashClosingRepository;
    }

    async configure() {
        await this.configureCashClosingIpcMethods();
    }

    private async configureCashClosingIpcMethods() {
        this.ipcMain.handle('cashClosingApi:getCashClosingOfDate', async (event, date: Date) => {
            return await this.cashClosingRepository.getCashClosingOfDate(date);
        });

        this.ipcMain.handle('cashClosingApi:getCashClosingOfUser', async (event, userName: string) => {
            return await this.cashClosingRepository.getCashClosingOfUser(userName);
        });

        this.ipcMain.handle('cashClosingApi:saveCashClosing', async (event, currentDate: Date, physicalMoney: number, totalOfDay: number, userName: string) => {
            await this.cashClosingRepository.saveCashClosing(currentDate, physicalMoney, totalOfDay, userName);
        });
    }
}

export default CashClosingIpcDecorator;