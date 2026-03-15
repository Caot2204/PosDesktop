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
import PosConfig from "../data/pos-config/PosConfig";

class CotizationPdfMaker {

    private static instance: CotizationPdfMaker = null;
    private productDataSource: IProductDataSource;
    private configPos: PosConfig

    private constructor(productDataSource: IProductDataSource, configPos: PosConfig) {
        this.productDataSource = productDataSource;
        this.configPos = configPos;
    }

    public static getInstance(productDataSource: IProductDataSource, configPos: PosConfig): CotizationPdfMaker {
        if (!this.instance) {
            this.instance = new CotizationPdfMaker(productDataSource, configPos);
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
        const folderPath = isDev() ? path.join(process.cwd(), 'cotizations-pdfs') : path.join(app.getPath('userData'), 'cotizations-pdfs');

        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        const filePath = path.join(folderPath, `${cotization.id}_cotization.pdf`);

        return new Promise((resolve, reject) => {
            var pdf = new PDFDocument({
                size: 'LETTER'
            });
            var stream = fs.createWriteStream(filePath);
            pdf.pipe(stream);

            let logoToDraw = this.configPos.bussinessLogoUrl;
            let logoExists = false;

            if (logoToDraw) {
                if (logoToDraw.startsWith('data:image/')) {
                    logoExists = true;
                } else if (fs.existsSync(logoToDraw)) {
                    logoExists = true;
                } else if (logoToDraw === '../icons/icon.png' || logoToDraw === '../../assets/react.svg') {
                    const fallbackPath = path.join(process.cwd(), 'src/icons/icon.png');
                    if (fs.existsSync(fallbackPath)) {
                        logoToDraw = fallbackPath;
                        logoExists = true;
                    }
                }
            }

            if (logoExists) {
                try {
                    pdf.image(logoToDraw, {
                        fit: [50, 50],
                        align: 'center',
                        valign: 'center'
                    });
                } catch (e) {
                    console.error("Error drawing logo to PDF:", e);
                }
            }

            pdf.text(" " + this.configPos.bussinessName);

            pdf.moveDown();

            pdf.table({
                data: [
                    ["Folio: ", cotization.id.toString()],
                    ["Fecha: ", formatDate(cotization.dateOfCotization)],
                    ["Cliente: ", cotization.client],
                    ["Registrado por: ", cotization.userToRegister]
                ]
            });

            pdf.moveDown();

            pdf.table({
                data: [
                    ["Producto", "Precio unitario", "Cantidad", "Subtotal"],
                    ...products.map((p: Product) => {
                        const unitsSoldOfProduct = cotization.products.find((cp: CotizationProduct) => cp.productCode === p.code)?.unitsSold;
                        return [
                            p.name,
                            formatNumberToCurrentPrice(p.unitPrice),
                            unitsSoldOfProduct.toString(),
                            formatNumberToCurrentPrice(p.unitPrice * unitsSoldOfProduct)
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

    public async findCotizationPdf(cotizationId: number): Promise<string | null> {
        return new Promise((resolve, reject) => {
            const folderPath = isDev() ? path.join(process.cwd(), 'cotizations-pdfs') : path.join(app.getPath('userData'), 'cotizations-pdfs');
            const filePath = path.join(folderPath, `${cotizationId}_cotization.pdf`);
            if (!fs.existsSync(filePath)) {
                resolve(null);
            }
            resolve(filePath);
        });
    }

    public async deletePdf(cotizationId: number): Promise<void> {
        const folderPath = isDev() ? path.join(process.cwd(), 'cotizations-pdfs') : path.join(app.getPath('userData'), 'cotizations-pdfs');
        const filePath = path.join(folderPath, `${cotizationId}_cotization.pdf`);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }

}

export default CotizationPdfMaker;