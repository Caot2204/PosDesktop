class PosConfig {
    bussinessName: string;
    bussinessLogoUrl: string;
    minimunStock: number;
    posLanguage: string;

    constructor(bussinessName: string, bussinessLogoUrl: string, minimunStock: number, posLanguage: string) {
        this.bussinessName = bussinessName;
        this.bussinessLogoUrl = bussinessLogoUrl;
        this.minimunStock = minimunStock;
        this.posLanguage = posLanguage;
    }
}

export default PosConfig;