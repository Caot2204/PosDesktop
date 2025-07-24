export default class UserSession {
    userName: string;
    isAdmin: boolean;

    constructor(userName: string, isAdmin: boolean) {
        this.userName = userName;
        this.isAdmin = isAdmin;
    }
}