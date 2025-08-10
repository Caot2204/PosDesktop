import type CashClosing from "../../model/CashClosing";

export interface ICashClosingDataSource {
    
    getCashClosingOfDate(date: Date): Promise<CashClosing[]>;

    getCashClosingOfUser(userName: string): Promise<CashClosing[]>;

    saveCashClosing(cashClosing: CashClosing): Promise<void>;

}