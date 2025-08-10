import User from "../../model/User";

export interface IUserDataSource {

    getUserByName(userName: string): Promise<User>;

    getAllUsers(): Promise<User[]>;

    getUserById(userId: string): Promise<User>;

    saveUser(user: User): Promise<void>;

    updateUser(user: User): Promise<void>;

    deleteUser(userId: string): Promise<void>;

}