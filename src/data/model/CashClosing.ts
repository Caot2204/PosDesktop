export default class CashClosing {
    id?: number;
    currentDate: Date;
    physicalMoney: number;
    totalOfDay: number;
    userName: string;

    constructor(currentDate: Date, physicalMoney: number, totalOfDay: number, userName: string, id?: number) {
        this.currentDate = currentDate;
        this.physicalMoney = physicalMoney;
        this.totalOfDay = totalOfDay;
        this.userName = userName;
        if (id) this.id= id;
    }
}