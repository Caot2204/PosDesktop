import { QueryTypes } from 'sequelize';
import CashClosing from '../../model/CashClosing.js';
import type { ICashClosingDataSource } from '../ds-interfaces/ICashClosingDataSource.js';
import { fromMysqlDatetime, toMysqlDatetime } from '../utils/DateUtils.js';

class CashClosingDao implements ICashClosingDataSource {

    private CashClosingSequelize: any;
    private sequelizeDb: any;

    constructor(cashClosingSequelize: any, sequelizeDb: any) {
        this.CashClosingSequelize = cashClosingSequelize;
        this.sequelizeDb = sequelizeDb;
    }

    getCashClosingOfDate(date: Date): Promise<CashClosing[]> {
        return new Promise<CashClosing[]>(async (resolve, reject) => {
            const dateFormated = toMysqlDatetime(date).split(" ")[0];
            const cashClosingsDb = await this.sequelizeDb.query(
                'SELECT * FROM cash_closings WHERE DATE(date) = ?', {
                replacements: [dateFormated],
                type: QueryTypes.SELECT
            });
            if (cashClosingsDb) {
                const cashClosings = cashClosingsDb.map((cashClosingDb: any) => new CashClosing(
                    fromMysqlDatetime(cashClosingDb.date)!!,
                    cashClosingDb.physicalMoney,
                    cashClosingDb.totalOfDay,
                    cashClosingDb.userName,
                    cashClosingDb.id
                ));
                resolve(cashClosings);
            } else {
                reject(new Error("Error al recuperar los cierre de caja"));
            }
        });
    }

    getCashClosingOfUser(userName: string): Promise<CashClosing[]> {
        return new Promise<CashClosing[]>(async (resolve, reject) => {
            const cashClosingsDb = await this.CashClosingSequelize.findAll({ where: { userName: userName } });
            if (cashClosingsDb) {
                const cashClosings = cashClosingsDb.map((cashClosingDb: any) => new CashClosing(
                    fromMysqlDatetime(cashClosingDb.date)!!,
                    cashClosingDb.physicalMoney,
                    cashClosingDb.totalOfDay,
                    cashClosingDb.userName,
                    cashClosingDb.id
                ));
                resolve(cashClosings);
            } else {
                reject(new Error("Error al recuperar los cierre de caja"));
            }
        });
    }

    saveCashClosing(cashClosing: CashClosing): Promise<void> {
        return new Promise((resolve, reject) => {
            this.CashClosingSequelize.create({
                date: cashClosing.currentDate,
                physicalMoney: cashClosing.physicalMoney,
                totalOfDay: cashClosing.totalOfDay,
                userName: cashClosing.userName
            }).then(() => {
                resolve();
            }).catch((error: Error) => {
                reject(error);
            });
        });
    }

}

export default CashClosingDao;