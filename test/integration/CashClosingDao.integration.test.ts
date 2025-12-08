import { Sequelize, DataTypes } from 'sequelize';
import sqlite3 from 'sqlite3';
import CashClosingDao from '../../src/data/datasource/ds-sequelize/CashClosingDao';
import CashClosing from '../../src/data/model/CashClosing';

describe('CashClosingDao integration', () => {
  let sequelize: Sequelize;
  let CashClosingModel: any;
  let dao: CashClosingDao;

  beforeAll(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      dialectModule: sqlite3,
      storage: ':memory:',
      logging: false,
    });

    CashClosingModel = sequelize.define('cash_closings', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      physicalMoney: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      totalOfDay: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      userName: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    }, { timestamps: false });

    await sequelize.sync({ force: true });
    dao = new CashClosingDao(CashClosingModel, sequelize);
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('saveCashClosing and getCashClosingOfDate', async () => {
    const date = new Date('2024-01-15');
    const cc = new CashClosing(date, 500.00, 550.00, 'user1');
    await dao.saveCashClosing(cc);

    const closings = await dao.getCashClosingOfDate(date);
    expect(closings.length).toBeGreaterThanOrEqual(1);
    expect(closings.some(c => c.userName === 'user1')).toBe(true);
    expect(closings.some(c => c.physicalMoney === 500.00)).toBe(true);
  });

  test('getCashClosingOfUser returns closings for specific user', async () => {
    const date1 = new Date('2024-01-16');
    const date2 = new Date('2024-01-17');

    const cc1 = new CashClosing(date1, 1000.00, 1050.00, 'user2');
    const cc2 = new CashClosing(date2, 1100.00, 1150.00, 'user2');

    await dao.saveCashClosing(cc1);
    await dao.saveCashClosing(cc2);

    const closings = await dao.getCashClosingOfUser('user2');
    expect(closings.length).toBeGreaterThanOrEqual(2);
    expect(closings.every(c => c.userName === 'user2')).toBe(true);
  });

  test('saveCashClosing with different amounts', async () => {
    const date = new Date('2024-01-18');
    const cc = new CashClosing(date, 750.50, 800.75, 'user3');
    await dao.saveCashClosing(cc);

    const closings = await dao.getCashClosingOfDate(date);
    const saved = closings.find(c => c.userName === 'user3');
    expect(saved).toBeDefined();
    expect(saved!.physicalMoney).toBeCloseTo(750.50);
    expect(saved!.totalOfDay).toBeCloseTo(800.75);
  });

  test('getCashClosingOfDate filters by date', async () => {
    const date1 = new Date('2024-02-01');
    const date2 = new Date('2024-02-02');

    const cc1 = new CashClosing(date1, 500.00, 550.00, 'user4');
    const cc2 = new CashClosing(date2, 600.00, 650.00, 'user5');

    await dao.saveCashClosing(cc1);
    await dao.saveCashClosing(cc2);

    const closingsDate1 = await dao.getCashClosingOfDate(date1);
    expect(closingsDate1.some(c => c.userName === 'user4')).toBe(true);
    expect(closingsDate1.every(c => c.userName !== 'user5')).toBe(true);
  });

  test('getCashClosingOfUser filters by user', async () => {
    const date = new Date('2024-02-03');
    const cc1 = new CashClosing(date, 400.00, 450.00, 'userA');
    const cc2 = new CashClosing(date, 300.00, 350.00, 'userB');

    await dao.saveCashClosing(cc1);
    await dao.saveCashClosing(cc2);

    const closingsUserA = await dao.getCashClosingOfUser('userA');
    expect(closingsUserA.every(c => c.userName === 'userA')).toBe(true);
    expect(closingsUserA.some(c => c.physicalMoney === 400.00)).toBe(true);
  });

  test('saveCashClosing persists id', async () => {
    const date = new Date('2024-02-04');
    const cc = new CashClosing(date, 200.00, 250.00, 'user6');
    await dao.saveCashClosing(cc);

    const closings = await dao.getCashClosingOfDate(date);
    const saved = closings.find(c => c.userName === 'user6');
    expect(saved).toBeDefined();
    expect(saved!.id).toBeDefined();
    expect(typeof saved!.id).toBe('number');
  });
});
