import Cotization from "../../../data/model/Cotization";
import CotizationProduct from "../../../data/model/CotizationProduct";
import { ICotizationDataSource } from "../ds-interfaces/ICotizationDataSource";

class CotizationDao implements ICotizationDataSource {

    private CotizationSequelize: any;
    private CotizationProductsSequelize: any;

    constructor(cotizationSequelize: any, cotizationProductsSequelize: any) {
        this.CotizationSequelize = cotizationSequelize;
        this.CotizationProductsSequelize = cotizationProductsSequelize;
    }

    async saveCotization(cotization: Cotization): Promise<number> {
        // run the whole save flow inside a transaction so failures rollback everything
        const sequelize = this.CotizationSequelize.sequelize;
        const t = await sequelize.transaction();
        try {
            const cotizationCreated: any = await this.CotizationSequelize.create({
                dateOfCotization: cotization.dateOfCotization,
                client: cotization.client,
                userToRegister: cotization.userToRegister
            }, { transaction: t });

            // ensure all product association rows are created and await their completion
            await Promise.all(cotization.products.map((p: CotizationProduct) =>
                this.CotizationProductsSequelize.create({
                    cotizationId: cotizationCreated.id,
                    productCode: p.productCode,
                    unitsSold: p.unitsSold
                }, { transaction: t })
            ));

            await t.commit();
            return cotizationCreated.id;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async updateCotization(cotization: Cotization): Promise<void> {
        const sequelize = this.CotizationSequelize.sequelize;
        const t = await sequelize.transaction();
        try {
            const cotizationDb = await this.CotizationSequelize.findByPk(cotization.id, { transaction: t });
            if (!cotizationDb) {
                await t.rollback();
                throw new Error("Cotizacion no encontrada");
            }
            cotizationDb.dateOfCotization = cotization.dateOfCotization;
            cotizationDb.client = cotization.client;
            cotizationDb.userToRegister = cotization.userToRegister;
            await cotizationDb.save({ transaction: t });

            await this.CotizationProductsSequelize.destroy({
                where: {
                    cotizationId: cotizationDb.id
                },
                transaction: t
            });

            // recreate product association rows and await completion
            await Promise.all(cotization.products.map((p: CotizationProduct) =>
                this.CotizationProductsSequelize.create({
                    cotizationId: cotizationDb.id,
                    productCode: p.productCode,
                    unitsSold: p.unitsSold
                }, { transaction: t })
            ));

            await t.commit();
            return;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async deleteCotization(cotizationId: number): Promise<void> {
        try {
            const cotization = await this.CotizationSequelize.findByPk(cotizationId);
            if (!cotization) throw new Error("Cotizacion no encontrada");
            await this.CotizationProductsSequelize.destroy({
                where: {
                    cotizationId: cotization.id
                }
            });
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
                const productsDb = await this.CotizationProductsSequelize.findAll({
                    where: {
                        cotizationId: cotization.id
                    }
                });
                const products = productsDb.map((p: any) => new CotizationProduct(
                    p.productCode,
                    p.unitsSold
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
            const productsDb = await this.CotizationProductsSequelize.findAll({
                where: {
                    cotizationId: cotizationDb.id
                }
            });
            const products = productsDb.map((p: any) => new CotizationProduct(
                p.productCode,
                p.unitsSold
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