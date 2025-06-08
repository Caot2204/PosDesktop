import UserRepository from '../../../src/data/repository/UserRepository';
import type { IUserDataSource } from '../../../src/data/datasource/ds-interfaces/IUserDataSource';
import type User from '../../../src/data/model/User';

// Mock the IUserDataSource
const mockUserDataSource: jest.Mocked<IUserDataSource> = {
    getAllUsers: jest.fn(),
    getUserById: jest.fn(),
    saveUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
};

describe('UserRepository', () => {
    let userRepository: UserRepository;

    beforeEach(() => {
        // Create a new UserRepository instance before each test
        userRepository = new UserRepository(mockUserDataSource);
        // Clear mock calls before each test
        jest.clearAllMocks();
    });

    it('should call getAllUsers on the data source when getAllUsers is called', async () => {
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
        expect(mockUserDataSource.saveUser).toHaveBeenCalledWith('New User', 'password test', false);
    });

    it('should call updateUser on the data source with the correct user', async () => {
        await userRepository.updateUser('update-id', 'Updated User', 'password test', false);

        expect(mockUserDataSource.updateUser).toHaveBeenCalledTimes(1);
        expect(mockUserDataSource.updateUser).toHaveBeenCalledWith('update-id', 'Updated User', 'password test', false);
    });

    it('should call deleteUser on the data source with the correct id', async () => {
        const userId = 'delete-id';

        await userRepository.deleteUser(userId);

        expect(mockUserDataSource.deleteUser).toHaveBeenCalledTimes(1);
        expect(mockUserDataSource.deleteUser).toHaveBeenCalledWith(userId);
    });
});
