import CotizationProduct from "./CotizationProduct";

class Cotization {
    id?: number;
    dateOfCotization: Date;
    client: string;
    userToRegister: string;
    products: CotizationProduct[] = [];

    constructor(dateOfCotization: Date, client: string, userToRegister: string, products: CotizationProduct[], id?: number) {
        this.dateOfCotization = dateOfCotization;
        this.client = client;
        this.userToRegister = userToRegister;
        this.products = products;
        if (id) this.id = id;
    }
}

export default Cotization;