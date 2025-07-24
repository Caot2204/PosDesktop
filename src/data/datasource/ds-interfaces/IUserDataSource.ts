import User from "../../model/User.js";

export interface IUserDataSource {

    getUserByName(userName: string): Promise<User>;

    getAllUsers(): Promise<User[]>;

    getUserById(user: string): Promise<User>;

    saveUser(user: User): Promise<void>;

    updateUser(user: User): Promise<void>;

    deleteUser(userId: string): Promise<void>;

}