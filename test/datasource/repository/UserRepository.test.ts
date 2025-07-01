import UserRepository from '../../../dist-electron/data/repository/UserRepository';
import type User from '../../../dist-electron/data/model/User';

// Mock the IUserDataSource
const mockUserDataSource = {
    getAllUsers: jest.fn(),
    getUserById: jest.fn(),
    saveUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
};

describe('UserRepository', () => {
    let userRepository: UserRepository;

    beforeEach(() => {
        userRepository = new UserRepository(mockUserDataSource);
        jest.clearAllMocks();
    });

    it('should call getAllUsers on the data source', async () => {
        const mockUsers: User[] = [{ id: '1', name: 'Test User', password: 'password test', isAdmin: false }];
        mockUserDataSource.getAllUsers.mockResolvedValue(mockUsers);

        const users = await userRepository.getAllUsers();

        expect(mockUserDataSource.getAllUsers).toHaveBeenCalledTimes(1);
        expect(users).toEqual(mockUsers);
    });

    it('should call getUserById on the data source with the correct id', async () => {
        const userId = '123';
        const mockUser: User = { id: userId, name: 'Test User', password: 'password test', isAdmin: false };
        mockUserDataSource.getUserById.mockResolvedValue(mockUser);

        const user = await userRepository.getUserById(userId);

        expect(mockUserDataSource.getUserById).toHaveBeenCalledTimes(1);
        expect(mockUserDataSource.getUserById).toHaveBeenCalledWith(userId);
        expect(user).toEqual(mockUser);
    });

    it('should call saveUser on the data source with the correct user', async () => {
        await userRepository.saveUser('New User', 'password test', false);

        expect(mockUserDataSource.saveUser).toHaveBeenCalledTimes(1);
        expect(mockUserDataSource.saveUser).toHaveBeenCalledWith({
            name: 'New User',
            password: expect.any(String), // password is usually hashed
            isAdmin: false
        });
    });

    it('should throw error if saveUser is called with invalid name', async () => {
        await expect(userRepository.saveUser('', 'password', false)).rejects.toThrow();
        expect(mockUserDataSource.saveUser).not.toHaveBeenCalled();
    });

    it('should call updateUser on the data source with the correct user', async () => {
        await userRepository.updateUser('update-id', 'Updated User', false);

        expect(mockUserDataSource.updateUser).toHaveBeenCalledTimes(1);
        expect(mockUserDataSource.updateUser).toHaveBeenCalledWith({
            id: 'update-id',
            name: 'Updated User',
            password: undefined,
            isAdmin: false
        });
    });

    it('should throw error if updateUser is called with invalid name', async () => {
        await expect(userRepository.updateUser('id', '', false)).rejects.toThrow();
        expect(mockUserDataSource.updateUser).not.toHaveBeenCalled();
    });

    it('should call deleteUser on the data source with the correct id', async () => {
        const userId = 'delete-id';

        await userRepository.deleteUser(userId);

        expect(mockUserDataSource.deleteUser).toHaveBeenCalledTimes(1);
        expect(mockUserDataSource.deleteUser).toHaveBeenCalledWith(userId);
    });

    it('should handle errors thrown by saveUser', async () => {
        mockUserDataSource.saveUser.mockImplementation(() => { throw new Error('fail'); });
        await expect(userRepository.saveUser('Valid', 'password', false)).rejects.toThrow();
    });

    it('should handle errors thrown by updateUser', async () => {
        mockUserDataSource.updateUser.mockImplementation(() => { throw new Error('fail'); });
        await expect(userRepository.updateUser('id', 'Valid', false)).rejects.toThrow();
    });

    it('should not throw if deleteUser throws', async () => {
        mockUserDataSource.deleteUser.mockImplementation(() => { throw new Error('fail'); });
        await expect(userRepository.deleteUser('id')).resolves.toBeUndefined();
    });
});
