import User from '../../model/User';
import { type IUserDataSource } from '../ds-interfaces/IUserDataSource';
import PosDatabase from './PosDatabase';

class UserDao implements IUserDataSource {

    private dbInstance;

    constructor(dbInstance: PosDatabase) {
        this.dbInstance = dbInstance.getInstance();
    }

    async getUserByName(userName: string): Promise<User> {
        return new Promise<User>((resolve, reject) => {
            this.dbInstance.serialize(() => {
                this.dbInstance.get(
                    'SELECT * FROM users WHERE name = ?',
                    [userName],
                    (error: Error | null, row: any) => {
                        if (error) { reject(error) }
                        if (row) {
                            const user = new User(
                                row.id,
                                row.name,
                                row.password,
                                Boolean(row.isAdmin)
                            );
                            resolve(user);
                        } else {
                            reject("Usuario o contraseña inválida");
                        }
                    }
                );
            });
        });
    }

    async getAllUsers(): Promise<User[]> {
        return new Promise<User[]>((resolve: any, reject: any) => {
            this.dbInstance.serialize(() => {
                this.dbInstance.all('SELECT * FROM users ORDER BY name ASC', (error: Error | null, rows: any[]) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    const users: User[] = rows.map(row => new User(
                        row.id,
                        row.name,
                        undefined,
                        Boolean(row.isAdmin)
                    ));
                    resolve(users);
                });
            });
        });
    }

    async getUserById(userId: string): Promise<User> {
        return new Promise<User>((resolve: any, reject: any) => {
            this.dbInstance.serialize(() => {
                this.dbInstance.get('SELECT * FROM users WHERE id = ?', [userId], (error: Error | null, row: any) => {
                    if (error) {
                        return reject(error);
                    }
                    if (!row) {
                        return resolve(undefined);
                    }
                    const userRecived: User = new User(
                        row.id,
                        row.name,
                        row.password,
                        Boolean(row.isAdmin)
                    )
                    resolve(userRecived);
                });
            });
        });
    }

    async saveUser(user: User): Promise<void> {
        return new Promise((resolve, reject) => {
            this.dbInstance.serialize(() => {
                const statement = this.dbInstance.prepare(
                    "INSERT INTO users VALUES (?, ?, ?, ?)"
                );
                statement.run(
                    user.id,
                    user.name,
                    user.password,
                    user.isAdmin ? 1 : 0,
                    (error: Error | null) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve();
                        }
                    }
                );
            });
        });
    }

    async updateUser(user: User): Promise<void> {
        return new Promise((resolve, reject) => {
            this.dbInstance.serialize(() => {
                const statement = this.dbInstance.prepare(
                    "UPDATE users SET name=?, isAdmin=? WHERE id = ?"
                );
                statement.run(
                    user.name,
                    user.isAdmin ? 1 : 0,
                    user.id,
                    (error: Error | null) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve();
                        }
                    }
                )
            });
        });
    }

    async deleteUser(userId: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.dbInstance.serialize(() => {
                const statement = this.dbInstance.prepare(
                    "DELETE FROM users WHERE id = ?"
                );
                statement.run(
                    userId,
                    (error: Error | null) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve();
                        }
                    }
                )
            });
        });
    }

}

export default UserDao;