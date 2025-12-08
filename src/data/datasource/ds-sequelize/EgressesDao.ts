import Egress from "../../model/Egress";
import { IEgressesDao } from "../ds-interfaces/IEgressesDao";

class EgressesDao implements IEgressesDao {

    private EgressSequelize: any;

    constructor(egressSequelize: any) {
        this.EgressSequelize = egressSequelize;
    }

    async getAllEgresses(): Promise<Egress[]> {
        try {
            const egressesDb: any[] = await this.EgressSequelize.findAll({
                order: [['dateOfEgress', 'ASC']]
            });
            return egressesDb.map((egressDb: any) => new Egress(
                egressDb.dateOfEgress,
                egressDb.amount,
                egressDb.description,
                egressDb.id
            ));
        } catch(error) {
            throw error;
        }
    }

    async getEgressById(egressId: number): Promise<Egress> {
        try {
            const egressDb = await this.EgressSequelize.findByPk(egressId);
            if (!egressDb) throw new Error("Egreso no encontrado");
            return new Egress(
                egressDb.dateOfEgress,
                egressDb.amount,
                egressDb.description,
                egressDb.id
            )
        } catch (error) {
            throw error;
        }     
    }

    async saveEgress(egress: Egress): Promise<void> {
        try {
            await this.EgressSequelize.create({
                dateOfEgress: egress.dateOfEgress,
                amount: egress.amount,
                description: egress.description
            });
            return;
        } catch(error) {
            throw error;
        }
    }

    async updateEgress(egress: Egress): Promise<void> {
        try {
            const egressDb = await this.EgressSequelize.findByPk(egress.id);
            if (!egressDb) throw new Error("Egreso no encontrado");
            egressDb.dateOfEgress = egress.dateOfEgress;
            egressDb.amount = egress.amount;
            egressDb.description = egress.description;
            await egressDb.save();
            return;
        } catch(error) {
            throw error;
        }
    }

    async deleteEgress(egressId: number): Promise<void> {
        try {
            const egressDb = await this.EgressSequelize.findByPk(egressId);
            if (!egressDb) throw new Error("Egreso no encontrado");
            await egressDb.destroy();
            return;
        } catch(error) {
            throw error;
        }
    }

}

export default EgressesDao;