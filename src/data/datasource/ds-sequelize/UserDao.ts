import User from '../../model/User';
import type { IUserDataSource } from '../ds-interfaces/IUserDataSource';

class UserDao implements IUserDataSource {

    private UserSequelize: any;

    constructor(userSequelize: any) {
        this.UserSequelize = userSequelize;
    }

    getUserByName(userName: string): Promise<User> {
        return new Promise<User>(async (resolve, reject) => {
            const userDb = await this.UserSequelize.findOne({ where: { name: userName } });
            if (userDb) {
                const user = new User(
                    userDb.id,
                    userDb.name,
                    userDb.password,
                    userDb.isAdmin
                );
                resolve(user);
            } else {
                reject(new Error("Usuario no encontrado"));
            }
        });
    }

    getAllUsers(): Promise<User[]> {
        return new Promise<User[]>(async (resolve, reject) => {
            const usersDb = await this.UserSequelize.findAll();
            if (usersDb) {
                const users = usersDb.map((userDb: any) => new User(
                    userDb.id,
                    userDb.name,
                    userDb.password,
                    userDb.isAdmin
                ));
                resolve(users);
            } else {
                reject(new Error("No se encontraron usuarios"));
            }
        });
    }

    getUserById(userId: string): Promise<User> {
        return new Promise<User>(async (resolve, reject) => {
            const userDb = await this.UserSequelize.findByPk(userId);
            if (userDb) {
                const user = new User(
                    userDb.id,
                    userDb.name,
                    userDb.password,
                    userDb.isAdmin
                );
                resolve(user);
            } else {
                reject(new Error("Usuario no encontrado"));
            }
        });
    }

    saveUser(user: User): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.UserSequelize.create({
                id: user.id,
                name: user.name,
                password: user.password,
                isAdmin: user.isAdmin
            }).then(() => {
                resolve();
            }).catch((error: Error) => {
                reject(error);
            });
        });
    }

    updateUser(user: User): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const userDb = await this.UserSequelize.findByPk(user.id);
            if (userDb) {
                userDb.name = user.name;
                userDb.password = user.password;
                userDb.isAdmin = user.isAdmin;

                userDb.save()
                    .then(() => {
                        resolve();
                    }).catch((error: Error) => {
                        reject(error);
                    });
            } else {
                reject(new Error("Usuario no encontrado"));
            }
        });
    }

    deleteUser(userId: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const userDb = await this.UserSequelize.findByPk(userId);
            if (userDb) {
                userDb.destroy()
                    .then(() => {
                        resolve();
                    }).catch((error: Error) => {
                        reject(error);
                    });
            } else {
                reject(new Error("Usuario no encontrado"));
            }
        });
    }

}

export default UserDao;