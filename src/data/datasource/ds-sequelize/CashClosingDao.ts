import { Op } from 'sequelize';
import CashClosing from '../../model/CashClosing';
import type { ICashClosingDataSource } from '../ds-interfaces/ICashClosingDataSource';
import { fromMysqlDatetime, toMysqlDatetime } from '../utils/DateUtils';

class CashClosingDao implements ICashClosingDataSource {

    private CashClosingSequelize: any;
    private sequelizeDb: any;

    constructor(cashClosingSequelize: any, sequelizeDb: any) {
        this.CashClosingSequelize = cashClosingSequelize;
        this.sequelizeDb = sequelizeDb;
    }

    getCashClosingOfDate(date: Date): Promise<CashClosing[]> {
        return new Promise<CashClosing[]>(async (resolve, reject) => {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            const cashClosingsDb = await this.CashClosingSequelize.findAll({
                where: {
                    date: {
                        [Op.between]: [startOfDay, endOfDay]
                    }
                }
            });
            if (cashClosingsDb) {
                const cashClosings = cashClosingsDb.map((cashClosingDb: any) => new CashClosing(
                    new Date(cashClosingDb.date),
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
                    new Date(cashClosingDb.date),
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