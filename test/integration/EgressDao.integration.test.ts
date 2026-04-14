import { Sequelize, DataTypes } from 'sequelize';
import sqlite3 from 'sqlite3';
import EgressDao from '../../src/data/datasource/ds-sequelize/EgressDao';
import Egress from '../../src/data/model/Egress';

describe('EgressesDao integration', () => {
  let sequelize: Sequelize;
  let EgressModel: any;
  let dao: EgressDao;

  beforeAll(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      dialectModule: sqlite3,
      storage: ':memory:',
      logging: false,
    });

    EgressModel = sequelize.define('egresses', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      dateOfEgress: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      amount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userToRegister: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    }, { timestamps: false });

    await sequelize.sync({ force: true });
    dao = new EgressDao(EgressModel);
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('saveEgress and getAllEgresses', async () => {
    const e = new Egress(new Date('2020-01-01'), 123.45, 'Test egress', 'admin');
    await dao.saveEgress(e);

    const all = await dao.getAllEgresses();
    expect(all).toHaveLength(1);
    expect(all[0].amount).toBeCloseTo(123.45);
    expect(all[0].description).toBe('Test egress');
  });

  test('getEgressById returns saved egress', async () => {
    const e = new Egress(new Date('2021-02-03'), 50, 'Find me', 'admin');
    await dao.saveEgress(e);

    const all = await dao.getAllEgresses();
    const toFind = all.find(x => x.description === 'Find me');
    expect(toFind).toBeDefined();

    const fetched = await dao.getEgressById(toFind!.id as number);
    expect(fetched.description).toBe('Find me');
    expect(fetched.amount).toBe(50);
  });

  test('updateEgress updates existing record', async () => {
    const e = new Egress(new Date('2022-03-04'), 10, 'To update', 'admin');
    await dao.saveEgress(e);
    const all = await dao.getAllEgresses();
    const target = all.find(x => x.description === 'To update')!;

    target.description = 'Updated';
    target.amount = 99.99;

    await dao.updateEgress(target);

    const reloaded = await dao.getEgressById(target.id as number);
    expect(reloaded.description).toBe('Updated');
    expect(reloaded.amount).toBeCloseTo(99.99);
  });

  test('deleteEgress removes record', async () => {
    const e = new Egress(new Date('2023-05-06'), 5, 'To delete', 'admin');
    await dao.saveEgress(e);
    const all = await dao.getAllEgresses();
    const target = all.find(x => x.description === 'To delete')!;

    await dao.deleteEgress(target.id as number);

    await expect(dao.getEgressById(target.id as number)).rejects.toThrow('Egreso no encontrado');
  });

  test('getEgressById throws when not found', async () => {
    await expect(dao.getEgressById(99999)).rejects.toThrow('Egreso no encontrado');
  });

  test('getEgressesByRange returns records within range', async () => {
    // Clear for this specific test to ensure clean state
    await EgressModel.destroy({ where: {}, truncate: true });

    const e1 = new Egress(new Date('2023-10-20T10:00:00'), 100, 'Inside Oct 20', 'admin');
    const e2 = new Egress(new Date('2023-10-21T15:00:00'), 200, 'Inside Oct 21', 'admin');
    const e3 = new Egress(new Date('2023-10-22T08:00:00'), 300, 'Inside Oct 22', 'admin');
    const eBefore = new Egress(new Date('2023-10-19T23:59:59'), 50, 'Before range', 'admin');
    const eAfter = new Egress(new Date('2023-10-23T00:00:01'), 60, 'After range', 'admin');

    await dao.saveEgress(e1);
    await dao.saveEgress(e2);
    await dao.saveEgress(e3);
    await dao.saveEgress(eBefore);
    await dao.saveEgress(eAfter);

    const results = await dao.getEgressesByRange('2023-10-20', '2023-10-22');

    expect(results).toHaveLength(3);
    const descriptions = results.map(r => r.description);
    expect(descriptions).toContain('Inside Oct 20');
    expect(descriptions).toContain('Inside Oct 21');
    expect(descriptions).toContain('Inside Oct 22');
    expect(descriptions).not.toContain('Before range');
    expect(descriptions).not.toContain('After range');
    
    // Check order (DESC by dateOfEgress)
    expect(results[0].description).toBe('Inside Oct 22');
  });
});
