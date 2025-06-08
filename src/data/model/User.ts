class User {
    id: string | undefined;
    name: string;
    password: string;
    isAdmin: boolean = false

    constructor(id: string | undefined, name: string, password: string, isAdmin: boolean) {
        if (id) this.id = id;
        this.name = name;
        this.password = password;
        this.isAdmin = isAdmin;
    }
}

export default User;