import Product from "../../../data/model/Product";
import type Cotization from "../../../data/model/Cotization";

export interface ICotizationDataSource {

    saveCotization(cotization: Cotization): Promise<void>;

    updateCotization(cotization: Cotization): Promise<void>;

    deleteCotization(cotizationId: number): Promise<void>;

    getAllCotizations(): Promise<Cotization[]>;

    getCotizationById(cotizationId: number): Promise<Cotization>;
    
}