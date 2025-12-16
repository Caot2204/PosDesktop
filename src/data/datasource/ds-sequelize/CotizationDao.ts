import Cotization from "../../../data/model/Cotization";
import Product from "../../../data/model/Product";
import { ICotizationDataSource } from "../ds-interfaces/ICotizationDataSource";

class CotizationDao implements ICotizationDataSource {

    private CotizationSequelize: any;

    constructor(cotizationSequelize: any) {
        this.CotizationSequelize = cotizationSequelize;
    }

    async saveCotization(cotization: Cotization): Promise<void> {
        try {
            const cotizationCreated: any = await this.CotizationSequelize.create({
                dateOfCotization: cotization.dateOfCotization,
                client: cotization.client,
                userToRegister: cotization.userToRegister
            });
            await cotizationCreated.setProducts(cotization.products.map(p => p.code));
            return;
        } catch (error) {
            throw error;
        }
    }

    async updateCotization(cotization: Cotization): Promise<void> {
        try {
            const cotizationDb = await this.CotizationSequelize.findByPk(cotization.id);
            if (!cotizationDb) throw new Error("Cotizacion no encontrada");
            cotizationDb.dateOfCotization = cotization.dateOfCotization;
            cotizationDb.client = cotization.client;
            cotizationDb.userToRegister = cotization.userToRegister;
            await cotizationDb.save();
            await cotizationDb.setProducts(cotization.products.map(p => p.code));
            return;
        } catch (error) {
            throw error;
        }
    }

    async deleteCotization(cotizationId: number): Promise<void> {
        try {
            const cotization = await this.CotizationSequelize.findByPk(cotizationId);
            if (!cotization) throw new Error("Cotizacion no encontrada");
            await cotization.destroy();
            return;
        } catch (error) {
            throw error;
        }
    }
    
    async getAllCotizations(): Promise<Cotization[]> {
        try {
            const cotizationsDb = await this.CotizationSequelize.findAll();
            const result = await Promise.all(cotizationsDb.map(async (cotization: any) => {
                const productsDb = await cotization.getProducts();
                const products = productsDb.map((p: any) => new Product(
                    p.code,
                    p.name,
                    p.unitPrice,
                    p.stock,
                    p.isInfinityStock,
                    p.category ? p.category.name : ''
                ));
                return new Cotization(
                    cotization.dateOfCotization,
                    cotization.client,
                    cotization.userToRegister,
                    products,
                    cotization.id
                );
            }));
            return result;
        } catch (error) {
            throw error;
        }
    }

    async getCotizationById(cotizationId: number): Promise<Cotization> {
        try {
            const cotizationDb = await this.CotizationSequelize.findByPk(cotizationId);
            if (!cotizationDb) throw new Error("Cotizacion no encontrada");
            const productsDb = await cotizationDb.getProducts();
            const products = productsDb.map((p: any) => new Product(
                p.code,
                p.name,
                p.unitPrice,
                p.stock,
                p.isInfinityStock,
                p.category ? p.category.name : ''
            ));
            return new Cotization(
                cotizationDb.dateOfCotization,
                cotizationDb.client,
                cotizationDb.userToRegister,
                products,
                cotizationDb.id
            );
        } catch (error) {
            throw error;
        }
    }

}

export default CotizationDao;