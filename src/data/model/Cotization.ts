import Product from '../model/Product';

class Cotization {
    id?: number;
    dateOfCotization: Date;
    client: string;
    userToRegister: string;
    products: Product[] = [];

    constructor(dateOfCotization: Date, client: string, userToRegister: string, products: Product[], id?: number) {
        this.dateOfCotization = dateOfCotization;
        this.client = client;
        this.userToRegister = userToRegister;
        this.products = products;
        if (id) this.id = id;
    }
}

export default Cotization;