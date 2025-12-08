import { Sequelize, DataTypes } from 'sequelize';
import sqlite3 from 'sqlite3';
import EgressesDao from '../../src/data/datasource/ds-sequelize/EgressesDao';
import Egress from '../../src/data/model/Egress';

describe('EgressesDao integration', () => {
  let sequelize: Sequelize;
  let EgressModel: any;
  let dao: EgressesDao;

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
    }, { timestamps: false });

    await sequelize.sync({ force: true });
    dao = new EgressesDao(EgressModel);
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('saveEgress and getAllEgresses', async () => {
    const e = new Egress(new Date('2020-01-01'), 123.45, 'Test egress');
    await dao.saveEgress(e);

    const all = await dao.getAllEgresses();
    expect(all).toHaveLength(1);
    expect(all[0].amount).toBeCloseTo(123.45);
    expect(all[0].description).toBe('Test egress');
  });

  test('getEgressById returns saved egress', async () => {
    const e = new Egress(new Date('2021-02-03'), 50, 'Find me');
    await dao.saveEgress(e);

    const all = await dao.getAllEgresses();
    const toFind = all.find(x => x.description === 'Find me');
    expect(toFind).toBeDefined();

    const fetched = await dao.getEgressById(toFind!.id as number);
    expect(fetched.description).toBe('Find me');
    expect(fetched.amount).toBe(50);
  });

  test('updateEgress updates existing record', async () => {
    const e = new Egress(new Date('2022-03-04'), 10, 'To update');
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
    const e = new Egress(new Date('2023-05-06'), 5, 'To delete');
    await dao.saveEgress(e);
    const all = await dao.getAllEgresses();
    const target = all.find(x => x.description === 'To delete')!;

    await dao.deleteEgress(target.id as number);

    await expect(dao.getEgressById(target.id as number)).rejects.toThrow('Egreso no encontrado');
  });

  test('getEgressById throws when not found', async () => {
    await expect(dao.getEgressById(99999)).rejects.toThrow('Egreso no encontrado');
  });
});
