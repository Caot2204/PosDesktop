export default class Egress {
    id?: number;
    dateOfEgress: Date;
    amount: number;
    description: string;

    constructor(dateOfEgress: Date, amount: number, description: string, id?: number) {
        this.dateOfEgress = dateOfEgress;
        this.amount = amount;
        this.description = description;
        if (id) this.id = id;
    }
}