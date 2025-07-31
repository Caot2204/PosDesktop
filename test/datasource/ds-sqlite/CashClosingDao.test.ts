import CashClosingDao from '../../../dist-electron/data/datasource/ds-sqlite/CashClosingDao';
import CashClosing from '../../../dist-electron/data/model/CashClosing.js';
import PosDatabase from '../../../dist-electron/data/datasource/ds-sqlite/PosDatabase.js';

describe('CashClosingDao', () => {
  let db: any;
  let dao: CashClosingDao;

  beforeEach(async () => {
    db = new PosDatabase('test');
    await db.initialize();
    dao = new CashClosingDao(db);
  });

  it('saveCashClosing and getCashClosingOfDate should work', async () => {
    const closing = new CashClosing(new Date('2025-07-09'), 1000, 1500, 'cajero');
    await dao.saveCashClosing(closing);
    const closings = await dao.getCashClosingOfDate(new Date('2025-07-09'));
    expect(closings[0].physicalMoney).toBe(1000);
    expect(closings[0].totalOfDay).toBe(1500);
    expect(closings[0].userName).toBe('cajero');
  });

  it('getCashClosingOfUser should return closings for user', async () => {
    const closing1 = new CashClosing(new Date('2025-07-09'), 1000, 1500, 'cajero');
    const closing2 = new CashClosing(new Date('2025-07-09'), 2000, 2500, 'admin');
    await dao.saveCashClosing(closing1);
    await dao.saveCashClosing(closing2);
    const closings = await dao.getCashClosingOfUser('cajero');
    expect(closings.length).toBeGreaterThan(0);
    expect(closings[0].userName).toBe('cajero');
  });
});

// Error tests
describe('CashClosingDaoError', () => {
  let mockDb: any;
  let dao: CashClosingDao;

  beforeEach(() => {
    mockDb = {
      serialize: jest.fn(fn => fn()),
      all: jest.fn(),
      prepare: jest.fn(() => ({
        run: jest.fn(),
      })),
    };
    const mockDbInstance = { getInstance: () => mockDb };
    dao = new CashClosingDao(mockDbInstance as any);
  });

  it('getCashClosingOfDate should reject on error', async () => {
    mockDb.all.mockImplementation((query, params, cb) => cb(new Error('fail')));
    await expect(dao.getCashClosingOfDate(new Date())).rejects.toThrow('fail');
  });

  it('getCashClosingOfUser should reject on error', async () => {
    mockDb.all.mockImplementation((query, params, cb) => cb(new Error('fail')));
    await expect(dao.getCashClosingOfUser('cajero')).rejects.toThrow('fail');
  });

  it('saveCashClosing should reject on db error', async () => {
    mockDb.prepare.mockReturnValue({
      run: (date, physicalMoney, totalOfDay, userName, cb) => cb(new Error('fail')),
    });
    const closing = new CashClosing(new Date(), 1000, 1500, 'cajero');
  });
});