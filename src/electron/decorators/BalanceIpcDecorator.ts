import { IpcMain } from "electron";
import BalancePdfMaker from "../BalancePdfMaker";
import Sale from "../../data/model/Sale";
import Egress from "../../data/model/Egress";

class BalanceIpcDecorator {
    private balancePdfMaker: BalancePdfMaker;
    private ipcMain: IpcMain;

    public constructor(balancePdfMaker: BalancePdfMaker, ipcMain: IpcMain) {
        this.balancePdfMaker = balancePdfMaker;
        this.ipcMain = ipcMain;
    }

    async configure() {
        await this.configureBalanceIpcMethods();
    }

    private async configureBalanceIpcMethods() {
        this.ipcMain.handle('balanceApi:createBalancePdf', async (event, startDate: string, endDate: string, sales: Sale[], egresses: Egress[], chartUrl: string) => {
            await this.balancePdfMaker.createPdf(startDate, endDate, sales, egresses, chartUrl);
        });

        this.ipcMain.handle('balanceApi:findBalancePdf', async (event, rangeDate: string) => {
            return await this.balancePdfMaker.findBalancePdf(rangeDate);
        });

        this.ipcMain.handle('balanceApi:deleteBalancePdf', async (event, rangeDate: string) => {
            await this.balancePdfMaker.deletePdf(rangeDate);
        });
    }
}

export default BalanceIpcDecorator;