import type { IEgressDataSource } from "../datasource/ds-interfaces/IEgressDataSource";
import Egress from "../model/Egress";

class EgressRepository {

    private egressDataSource: IEgressDataSource;

    constructor(egressDataSource: IEgressDataSource) {
        this.egressDataSource = egressDataSource;
    }

    async getAllEgresses() {
        try {
            return this.egressDataSource.getAllEgresses();
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getEgressById(egressId: number) {
        try {
            return this.egressDataSource.getEgressById(egressId);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async saveEgress(dateOfEgress: Date, amount: number, descripcion: string) {
        try {
            if (this.validateEgressData(dateOfEgress, amount, descripcion)) {
                await this.egressDataSource.saveEgress(
                    new Egress(
                        dateOfEgress,
                        amount,
                        descripcion
                    )
                );
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async updateEgress(id: number, dateOfEgress: Date, amount: number, description: string) {
        try {
            if (this.validateEgressData(dateOfEgress, amount, description)) {
                await this.egressDataSource.updateEgress(
                    new Egress(
                        dateOfEgress,
                        amount,
                        description,
                        id
                    )
                );
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async deleteEgress(egressId: number) {
        try {
            if (egressId) await this.egressDataSource.deleteEgress(egressId);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    private validateEgressData(dateOfEgress: Date, amount: number, description: string): Boolean {
        if (!dateOfEgress) throw new Error("La fecha no puede estar vacia");
        if (!amount || amount <= 0) throw new Error("Debe ingresar un monto mayor a 0");
        if (!description) throw new Error("Ingresa la descripción del egreso");
        return true;
    }

}

export default EgressRepository;