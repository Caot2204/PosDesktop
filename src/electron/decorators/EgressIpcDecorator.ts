import { IpcMain } from "electron";
import EgressRepository from "../../data/repository/EgressRepository";

class EgressIpcDecorator {
    
    private egressRepository: EgressRepository;
    private ipcMain: IpcMain;

    constructor(egressRepository: EgressRepository, ipcMain: IpcMain) {
        this.egressRepository = egressRepository;
        this.ipcMain = ipcMain;
    }

    async configure() {
        await this.configureEgressIpcMethods();
    }

    private async configureEgressIpcMethods() {
        this.ipcMain.handle('egressApi:getAllEgresses', async (event) => {
            return await this.egressRepository.getAllEgresses();
        });

        this.ipcMain.handle('egressApi:getEgressById', async (event, egressId:number) => {
            return await this.egressRepository.getEgressById(egressId);
        });

        this.ipcMain.handle('egressApi:saveEgress', async (event, dateOfEgress: Date, amount: number, description: string, userToRegister: string) => {
            await this.egressRepository.saveEgress(dateOfEgress, amount, description, userToRegister);
        });

        this.ipcMain.handle('egressApi:updateEgress', async (event, id: number, dateOfEgress: Date, amount: number, description: string, userToRegister: string) => {
            await this.egressRepository.updateEgress(id, dateOfEgress, amount, description, userToRegister);
        });

        this.ipcMain.handle('egressApi:deleteEgress', async (event, egressId: number) => {
            await this.egressRepository.deleteEgress(egressId);
        });
        console.log("Egress methods configured succesfully");
    }
}

export default EgressIpcDecorator;