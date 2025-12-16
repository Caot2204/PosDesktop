import { ICotizationDataSource } from '../datasource/ds-interfaces/ICotizationDataSource';
import Cotization from '../model/Cotization';
import Product from '../model/Product';

class CotizationRepository {

    private cotizationDataSource: ICotizationDataSource;

    constructor(cotizationDataSource: ICotizationDataSource) {
        this.cotizationDataSource = cotizationDataSource;
    }

    async saveCotization(dateOfCotization: Date, client: string, userToRegister: string, products: Product[]) {
        try {
            if (this.validateCotizationData(dateOfCotization, client, userToRegister, products)) {
                await this.cotizationDataSource.saveCotization(
                    new Cotization(
                        dateOfCotization,
                        client,
                        userToRegister,
                        products
                    )
                );
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async updateCotization(id: number, dateOfCotization: Date, client: string, userToRegister: string, products: Product[]) {
        try {
            if (this.validateCotizationData(dateOfCotization, client, userToRegister, products)) {
                await this.cotizationDataSource.updateCotization(
                    new Cotization(
                        dateOfCotization,
                        client,
                        userToRegister,
                        products,
                        id
                    )
                )
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async deleteCotization(cotizationId: number) {
        try {
            await this.cotizationDataSource.deleteCotization(cotizationId);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getAllCotizations() {
        try {
            await this.cotizationDataSource.getAllCotizations();
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getCotizationById(cotizationId: number) {
        try {
            await this.cotizationDataSource.getCotizationById(cotizationId);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    private validateCotizationData(dateOfCotization: Date, client: string, userToRegister: string, products: Product[]): Boolean {
        if (!dateOfCotization) throw new Error("Se debe especificar una fecha.");
        if (!userToRegister) throw new Error("Se debe especificar un usuario");
        if (!products) throw new Error("Debe haber productos que agregar a la cotizacion");
        return true;
    }

}

export default CotizationRepository;