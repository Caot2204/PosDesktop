import type { ICashClosingDataSource } from "../datasource/ds-interfaces/ICashClosingDataSource.js";
import CashClosing from "../model/CashClosing.js";

class CashClosingRepository {

    private cashClosingDataSource: ICashClosingDataSource;

    constructor(cashClosingDataSource: ICashClosingDataSource) {
        this.cashClosingDataSource = cashClosingDataSource;
    }

    async getCashClosingOfDate(date: Date) {
        return this.cashClosingDataSource.getCashClosingOfDate(date);        
    }

    async getCashClosingOfUser(userName: string) {
        return this.cashClosingDataSource.getCashClosingOfUser(userName);
    }

    async saveCashClosing(currentDate: Date, physicalMoney: number, totalOfDay: number, userName: string) {
        if (physicalMoney <= 0) {
            throw new Error("El dinero físico debe ser mayor a 0");
        }
        this.cashClosingDataSource.saveCashClosing(new CashClosing(
            currentDate,
            physicalMoney,
            totalOfDay,
            userName
        ));
    }
}

export default CashClosingRepository;