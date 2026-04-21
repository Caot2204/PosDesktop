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
import i18next from "../i18n";

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
        await i18next.changeLanguage(this.configPos.posLanguage);
        const products = await this.getProducts(cotization.products);
        const folderPath = isDev() ? path.join(process.cwd(), 'cotizations-pdfs') : path.join(app.getPath('userData'), 'cotizations-pdfs');

        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        const filePath = path.join(folderPath, `${cotization.id}_cotization.pdf`);

        return new Promise((resolve, reject) => {
            let total: number = 0.0;
            var pdf = new PDFDocument({
                size: 'LETTER',
                margin: 20
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

            pdf.text(this.configPos.bussinessName);

            pdf.moveDown();

            pdf.table({
                // Set the style for all cells
                defaultStyle: { border: 1, borderColor: "gray" },
                // Set the style for cells based on their column
                columnStyles: (i) => {
                    if (i === 0) return { width: 100, border: { left: 2 }, borderColor: { left: "black" }, textStroke: 0.5 };
                    if (i === 2) return { width: "*", border: { right: 2 }, borderColor: { right: "black" } };
                },
                rowStyles: (i) => {
                    if (i === 0) return { border: { top: 2, right: 2 }, borderColor: { top: "black", right: "black" } };
                    if (i === 1) return { border: { right: 2 }, borderColor: { right: "black" } };
                    if (i === 2) return { border: { right: 2 }, borderColor: { right: "black" } };
                    if (i === 3) return { border: { bottom: 2, right: 2 }, borderColor: { bottom: "black", right: "black" } };
                },
                data: [
                    [i18next.t('pdfMaker.folioLabel'), cotization.id.toString()],
                    [i18next.t('pdfMaker.dateLabel'), formatDate(cotization.dateOfCotization)],
                    [i18next.t('pdfMaker.clientLabel'), cotization.client],
                    [i18next.t('pdfMaker.userRegisteredLabel'), cotization.userToRegister]
                ]
            });

            pdf.moveDown();
            pdf.moveDown();

            pdf.table({
                columnStyles: [220, "*", "*", "*"],
                rowStyles: (i) => {
                    return i < 1
                        ? { border: [0, 0, 2, 0], borderColor: "black" }
                        : { border: [0, 0, 1, 0], borderColor: "#aaa" };
                },
                data: [
                    [
                        { text: i18next.t('pdfMaker.productLabel'), textStroke: 0.5 },
                        { text: i18next.t('pdfMaker.unitPriceLabel'), textStroke: 0.5 },
                        { text: i18next.t('pdfMaker.unitsSoldLabel'), textStroke: 0.5 },
                        { text: i18next.t('pdfMaker.subtotalLabel'), textStroke: 0.5 }
                    ],
                    ...products.map((p: Product) => {
                        const unitsSoldOfProduct = cotization.products.find((cp: CotizationProduct) => cp.productCode === p.code)?.unitsSold;
                        const subtotal = p.unitPrice * unitsSoldOfProduct;
                        total += subtotal;
                        return [
                            p.name,
                            formatNumberToCurrentPrice(p.unitPrice),
                            unitsSoldOfProduct.toString(),
                            formatNumberToCurrentPrice(subtotal)
                        ];
                    })
                ]
            });

            pdf.moveDown();
            pdf.moveDown();

            pdf.text(
                i18next.t('pdfMaker.totalLabel', { totalAmount: formatNumberToCurrentPrice(total) }),
                {
                    align: "right",
                    stroke: true
                }
            );

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