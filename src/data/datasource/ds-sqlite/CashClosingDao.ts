import CashClosing from "../../model/CashClosing.js";
import type { ICashClosingDataSource } from "../ds-interfaces/ICashClosingDataSource.js";
import { fromMysqlDatetime, toMysqlDatetime } from "../utils/DateUtils.js";
import type PosDatabase from "./PosDatabase.js";

class CashClosingDao implements ICashClosingDataSource {

    private dbInstance: any;

    constructor(posDatabase: PosDatabase) {
        this.dbInstance = posDatabase.getInstance();
    }

    getCashClosingOfDate(date: Date): Promise<CashClosing[]> {
        return new Promise<CashClosing[]>((resolve, reject) => {
            const dateFormated = toMysqlDatetime(date).split(" ")[0];
            this.dbInstance.serialize(() => {
                this.dbInstance.all(
                    'SELECT * FROM cash_closings WHERE DATE(date) = ?',
                    [dateFormated],
                    (error: Error | null, rows: any[]) => {
                        if (error) {
                            reject(error);
                        }
                        const cashClosings = rows.map(row =>
                            new CashClosing(
                                row.date,
                                row.physicalMoney,
                                row.totalOfDay,
                                row.userName
                            )
                        );
                        resolve(cashClosings);
                    }
                );
            });
        });
    }

    getCashClosingOfUser(userName: string): Promise<CashClosing[]> {
        return new Promise<CashClosing[]>((resolve, reject) => {
            this.dbInstance.serialize(() => {
                this.dbInstance.all(
                    'SELECT * FROM cash_closings WHERE userName = ?',
                    [userName],
                    (error: Error | null, rows: any[]) => {
                        if (error) {
                            reject(error);
                        }
                        const cashClosings = rows.map(row =>
                            new CashClosing(
                                fromMysqlDatetime(row.date)!!,
                                row.physicalMoney,
                                row.totalOfDay,
                                row.userName
                            )
                        );
                        resolve(cashClosings);
                    }
                );
            });
        });
    }

    saveCashClosing(cashClosing: CashClosing): Promise<void> {
        return new Promise((resolve, reject) => {
            this.dbInstance.serialize(() => {
                const dateParsed = toMysqlDatetime(cashClosing.currentDate);
                const statement = this.dbInstance.prepare(
                    'INSERT INTO cash_closings(date, physicalMoney, totalOfDay, userName) VALUES(?,?,?,?)'
                );
                statement.run(
                    dateParsed,
                    cashClosing.physicalMoney,
                    cashClosing.totalOfDay,
                    cashClosing.userName,
                    (error: Error | null) => {
                        if (error) { reject(error); }
                        else { resolve(); }
                    }
                );
            });
        });
    }
}

export default CashClosingDao;