export default class Egress {
    id?: number;
    dateOfEgress: Date;
    amount: number;
    description: string;
    userToRegister: string;

    constructor(dateOfEgress: Date, amount: number, description: string, userToRegister: string, id?: number) {
        this.dateOfEgress = dateOfEgress;
        this.amount = amount;
        this.description = description;
        this.userToRegister = userToRegister;
        if (id) this.id = id;
    }
}