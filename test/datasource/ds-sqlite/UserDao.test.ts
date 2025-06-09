import UserDao from '../../../dist-electron/data/datasource/ds-sqlite/UserDao';
import PosDatabase from '../../../dist-electron/data/datasource/ds-sqlite/PosDatabase';
import User from '../../../dist-electron/data/model/User';

describe('UserDao', () => {
    let posDatabase: PosDatabase;
    let userDao: UserDao;

    beforeEach(() => {
        posDatabase = new PosDatabase('test');
        posDatabase.initialize();
        userDao = new UserDao(posDatabase);
    });

    it('save a user in the database', async () => {
        const mockUser: User = new User(
            "1",
            "Test user",
            "sspodofkofkdf",
            true
        )
        userDao.saveUser(mockUser);
        const userRecupered: User = await userDao.getUserById("1");
        expect(mockUser).toEqual(userRecupered);
    });

    /*
    it('save more users in the database', async () => {
        const mockUser: User = new User(
            1,
            "Test user",
            "sspodofkofkdf",
            true
        )
        const mockUser2: User = new User(
            2,
            "Test user2",
            "sspodofkofkdf",
            true
        )
        const mockUser3: User = new User(
            3,
            "Test user 3",
            "sspodofkofkdf",
            true
        )
        const listUsers: User[] = [mockUser, mockUser2, mockUser3];
        userDao.saveUser(mockUser);
        userDao.saveUser(mockUser2);
        userDao.saveUser(mockUser3);
        const usersRecupered: User[] = await userDao.getAllUsers();
        expect(listUsers).toEqual(usersRecupered);
    });
    */

    it('update a user in the database', async () => {
        const mockUser: User = new User(
            "1",
            "Test user",
            "sspodofkofkdf",
            true
        )
        userDao.saveUser(mockUser);
        const userRecupered: User = await userDao.getUserById("1");
        expect(mockUser).toEqual(userRecupered);

        mockUser.name = "New name";
        mockUser.password = "12345677";
        userDao.updateUser(mockUser);
        const userUpdated = await userDao.getUserById("1");
        expect(mockUser).toEqual(userUpdated);
    });

    it('delete a user in the database', async () => {
        const mockUser: User = new User(
            "1",
            "Test user",
            "sspodofkofkdf",
            true
        )
        userDao.saveUser(mockUser);
        const userRecupered: User = await userDao.getUserById("1");
        expect(mockUser).toEqual(userRecupered);

        userDao.deleteUser(mockUser.id!!);
        const userDeleted: User = await userDao.getUserById("1");
        expect(userDeleted).toBeUndefined();
    });
});