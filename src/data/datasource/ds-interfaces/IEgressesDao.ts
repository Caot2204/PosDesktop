import type Egress from "../../model/Egress";

export interface IEgressesDao {

    getAllEgresses(): Promise<Egress[]>;

    getEgressById(egressId: number): Promise<Egress>;

    saveEgress(egress: Egress): Promise<void>;

    updateEgress(egress: Egress): Promise<void>;

    deleteEgress(egressId: number): Promise<void>;

}