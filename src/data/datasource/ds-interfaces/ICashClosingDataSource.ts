import type CashClosing from "../../model/CashClosing.js";

export interface ICashClosingDataSource {
    
    getCashClosingOfDate(date: Date): Promise<CashClosing[]>;

    getCashClosingOfUser(userName: string): Promise<CashClosing[]>;

    saveCashClosing(cashClosing: CashClosing): Promise<void>;

}