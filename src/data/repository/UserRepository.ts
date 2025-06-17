import User from '../model/User.js';
import type { IUserDataSource } from '../datasource/ds-interfaces/IUserDataSource.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

class UserRepository {

    private userDataSource: IUserDataSource;

    constructor(userDataSource: IUserDataSource) {
        this.userDataSource = userDataSource;
    }

    async getAllUsers() {
        return this.userDataSource.getAllUsers();
    }

    async getUserById(id: string) {
        return this.userDataSource.getUserById(id);
    }

    async saveUser(name: string, password: string, isAdmin: boolean) {
        if (this.validateUserData(name, password)) {
            const userID = await this.generatUniqueUserId();
            try {
                const passwordEncrypted = await this.encryptPassword(password);
                this.userDataSource.saveUser(new User(userID, name, passwordEncrypted, isAdmin));
            } catch (error) {
                throw new Error("Ha ocurrido un error al guardar, intente de nuevo");
            }
        }
    }

    async updateUser(id: string, name: string, isAdmin: boolean) {
        if (name && (name.length > 0 && name.length < 30)) {
            const user = await this.getUserById(id);
            if (user) {
                try {
                    this.userDataSource.updateUser(new User(id, name, undefined, isAdmin));
                } catch (error) {
                    throw new Error("Ha ocurrido un error al guardar, intente de nuevo");
                }
            } else {
                throw Error(`The user with the ${id} not exist`);
            }
        } else {
            throw new Error("El nombre no puede estar vacío y debe tener máximo 30 caracteres");
        }
    }

    async deleteUser(id: string) {
        this.userDataSource.deleteUser(id);
    }

    private validateUserData(name: string, password: string): boolean {
        if (!name || !password) throw new Error("No puede haber campos vacios");
        if (name.length > 30) throw new Error("El nombre solo puede tener hasta 30 caracteres");
        if (password.length < 8 || password.length > 30) throw new Error("La contraseña debe tener entre 8 y 30 caracteres");
        return true;
    }

    private async generatUniqueUserId(): Promise<string> {
        return new Promise<string>((resolve: any) => {
            let idGenerated: string = uuidv4();
            resolve(idGenerated);
        });
    }

    private async encryptPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }

}

export default UserRepository;