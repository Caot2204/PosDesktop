import { IProductDataSource } from "../data/datasource/ds-interfaces/IProductDataSource";
import CotizationProduct from "../data/model/CotizationProduct";
import Cotization from "../data/model/Cotization";
import Product from "../data/model/Product";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { isDev } from "./util";
import { app } from "electron";
import { formatDate, formatNumberToCurrentPrice } from "../ui/utils/FormatUtils";

class CotizationPdfMaker {

    private static instance: CotizationPdfMaker = null;
    private productDataSource: IProductDataSource;

    private constructor(productDataSource: IProductDataSource) {
        this.productDataSource = productDataSource
    }

    public static getInstance(productDataSource: IProductDataSource): CotizationPdfMaker {
        if (!this.instance) {
            this.instance = new CotizationPdfMaker(productDataSource);
        }
        return this.instance;
    }

    private async getProducts(products: CotizationProduct[]): Promise<Product[]> {
        return Promise.all(products.map(async (p: CotizationProduct) => {
            return await this.productDataSource.getProductByCode(p.productCode);
        }));
    }

    public async createPdf(cotization: Cotization): Promise<void> {
        const products = await this.getProducts(cotization.products);
        const folderPath = isDev() ? path.join(process.cwd(), 'cotizations') : path.join(app.getPath('userData'), 'cotizations');

        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        const filePath = path.join(folderPath, `${cotization.id}_cotization.pdf`);

        return new Promise((resolve, reject) => {
            var pdf = new PDFDocument();
            var stream = fs.createWriteStream(filePath);
            pdf.pipe(stream);

            pdf.table({
                data: [
                    ["Folio: ", cotization.id.toString()],
                    ["Fecha: ", formatDate(cotization.dateOfCotization)],
                    ["Cliente: ", cotization.client],
                    ["Registrado por: ", cotization.userToRegister]
                ]
            });

            pdf.table({
                data: [
                    ["Producto", "Precio unitario", "Cantidad", "Subtotal"],
                    ...products.map((p: Product) => {
                        return [
                            p.name,
                            formatNumberToCurrentPrice(p.unitPrice),
                            p.stock.toString(),
                            formatNumberToCurrentPrice(p.unitPrice * p.stock)
                        ];
                    })
                ]
            });

            stream.on('finish', () => {
                console.log('PDF created');
                resolve();
            });

            stream.on('error', (err) => {
                reject(err);
            });

            pdf.end();
        });
    }

}

export default CotizationPdfMaker;