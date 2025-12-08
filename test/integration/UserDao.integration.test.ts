import { Sequelize, DataTypes } from 'sequelize';
import sqlite3 from 'sqlite3';
import UserDao from '../../src/data/datasource/ds-sequelize/UserDao';
import User from '../../src/data/model/User';

describe('UserDao integration', () => {
  let sequelize: Sequelize;
  let UserModel: any;
  let dao: UserDao;

  beforeAll(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      dialectModule: sqlite3,
      storage: ':memory:',
      logging: false,
    });

    UserModel = sequelize.define('users', {
      id: {
        type: DataTypes.TEXT,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      password: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    }, { timestamps: false });

    await sequelize.sync({ force: true });
    dao = new UserDao(UserModel);
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('saveUser and getAllUsers', async () => {
    const user1 = new User('user1', 'John Doe', 'password123', false);
    const user2 = new User('user2', 'Admin User', 'adminpass', true);
    
    await dao.saveUser(user1);
    await dao.saveUser(user2);

    const all = await dao.getAllUsers();
    expect(all.length).toBeGreaterThanOrEqual(2);
    expect(all.some(u => u.id === 'user1')).toBe(true);
    expect(all.some(u => u.id === 'user2' && u.isAdmin === true)).toBe(true);
  });

  test('getUserById returns saved user', async () => {
    const user = new User('user3', 'Test User', 'testpass', false);
    await dao.saveUser(user);

    const fetched = await dao.getUserById('user3');
    expect(fetched.id).toBe('user3');
    expect(fetched.name).toBe('Test User');
    expect(fetched.isAdmin).toBe(false);
  });

  test('getUserByName returns user with correct name', async () => {
    const user = new User('user4', 'Jane Smith', 'janepwd', false);
    await dao.saveUser(user);

    const fetched = await dao.getUserByName('Jane Smith');
    expect(fetched.name).toBe('Jane Smith');
    expect(fetched.id).toBe('user4');
  });

  test('updateUser updates name and isAdmin', async () => {
    const user = new User('user5', 'Original Name', 'pwd', false);
    await dao.saveUser(user);

    const updated = new User('user5', 'Updated Name', 'pwd', true);
    await dao.updateUser(updated);

    const fetched = await dao.getUserById('user5');
    expect(fetched.name).toBe('Updated Name');
    expect(fetched.isAdmin).toBe(true);
  });

  test('deleteUser removes user', async () => {
    const user = new User('user6', 'To Delete', 'pwd', false);
    await dao.saveUser(user);

    await dao.deleteUser('user6');

    await expect(dao.getUserById('user6')).rejects.toThrow('Usuario no encontrado');
  });

  test('getUserById throws when user not found', async () => {
    await expect(dao.getUserById('nonexistent')).rejects.toThrow('Usuario no encontrado');
  });

  test('getUserByName throws when user not found', async () => {
    await expect(dao.getUserByName('NonexistentUser')).rejects.toThrow('Usuario no encontrado');
  });
});
