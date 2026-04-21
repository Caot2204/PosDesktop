import PosConfig from "../data/pos-config/PosConfig";
import Sale from "../data/model/Sale";
import Egress from "../data/model/Egress";
import i18next from "../i18n";
import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import { app } from "electron";
import { isDev } from "./util";
import { formatDate, formatNumberToCurrentPrice } from "../ui/utils/FormatUtils";

class BalancePdfMaker {
    private static instance: BalancePdfMaker = null;
    private configPos: PosConfig;

    private constructor(posConfig: PosConfig) {
        this.configPos = posConfig;
    }

    public static getInstance(posConfig: PosConfig): BalancePdfMaker {
        if (!this.instance) {
            this.instance = new BalancePdfMaker(posConfig);
        }
        return this.instance;
    }

    public async createPdf(
        startDate: string,
        endDate: string,
        sales: Sale[],
        egresses: Egress[],
        chartUrl: string
    ): Promise<void> {
        await i18next.changeLanguage(this.configPos.posLanguage);
        const folderPath = isDev() ? path.join(process.cwd(), 'balances-pdfs') : path.join(app.getPath('userData'), 'balances-pdfs');

        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        const filePath = path.join(folderPath, `Balance_${startDate}-${endDate}.pdf`);

        return new Promise((resolve, reject) => {
            const base64Data = chartUrl.replace(/^data:image\/png;base64,/, "");
            const buffer = Buffer.from(base64Data, 'base64');
            const totalSales = sales.reduce((acc, curr) => acc + curr.totalSale, 0);
            const totalEgresses = egresses.reduceRight((acc, curr) => acc + curr.amount, 0);
            const neto = totalSales - totalEgresses;

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

            pdf.text(i18next.t('balancePdfMaker.title'), {
                align: 'center',
                stroke: true
            });

            pdf.moveDown();
            pdf.moveDown();

            const currentY = pdf.y;

            // Tabla resumen a la izquierda
            pdf.table({
                // Set the style for all cells
                defaultStyle: { border: 1, borderColor: "gray" },
                // Set the style for cells based on their column
                columnStyles: (i) => {
                    if (i === 0) return { width: 140, border: { left: 2 }, borderColor: { left: "black" }, textStroke: 0.5 };
                    if (i === 1) return { width: 210, border: { right: 2 }, borderColor: { right: "black" } };
                },
                rowStyles: (i) => {
                    if (i === 0) return { border: { top: 2, right: 2 }, borderColor: { top: "black", right: "black" } };
                    if (i === 1) return { border: { right: 2 }, borderColor: { right: "black" } };
                    if (i === 2) return { border: { right: 2 }, borderColor: { right: "black" } };
                    if (i === 3) return { border: { bottom: 2, right: 2 }, borderColor: { bottom: "black", right: "black" } };
                },
                data: [
                    [i18next.t('balancePdfMaker.rangeDate'), `${startDate} - ${endDate}`],
                    [i18next.t('balancePdfMaker.totalSales'), formatNumberToCurrentPrice(totalSales)],
                    [i18next.t('balancePdfMaker.totalEgresses'), formatNumberToCurrentPrice(totalEgresses)],
                    [i18next.t('balancePdfMaker.totalNet'), formatNumberToCurrentPrice(neto)]
                ]
            });

            const tableEndY = pdf.y;

            // Gráfica a la derecha
            pdf.image(buffer, 380, currentY, {
                fit: [180, 180]
            });

            // Ajustar la posición Y para continuar debajo de ambos elementos
            pdf.y = Math.max(tableEndY, currentY + 180);

            pdf.moveDown();
            pdf.moveDown();

            pdf.table({
                columnStyles: ["*", "*", "*", "*"],
                rowStyles: (i) => {
                    return i < 1
                        ? { border: [0, 0, 2, 0], borderColor: "black" }
                        : { border: [0, 0, 1, 0], borderColor: "#aaa" };
                },
                data: [
                    [
                        { text: i18next.t('balancePdfMaker.egressIdTh'), textStroke: 0.5 },
                        { text: i18next.t('balancePdfMaker.egressDateTh'), textStroke: 0.5 },
                        { text: i18next.t('balancePdfMaker.egressDescriptionTh'), textStroke: 0.5 },
                        { text: i18next.t('balancePdfMaker.egressAmountTh'), textStroke: 0.5 }
                    ],
                    ...egresses.map((e: Egress) => {
                        return [
                            e.id.toString(),
                            formatDate(e.dateOfEgress),
                            e.description,
                            formatNumberToCurrentPrice(e.amount)
                        ];
                    })
                ]
            });
            pdf.moveDown();
            pdf.text(
                i18next.t('balancePdfMaker.egressCaption', { tiempoString: `${startDate} - ${endDate}` }),
                {
                    align: 'center',
                    stroke: true
                }
            );

            pdf.moveDown();
            pdf.moveDown();

            pdf.table({
                columnStyles: ["*", "*", "*"],
                rowStyles: (i) => {
                    return i < 1
                        ? { border: [0, 0, 2, 0], borderColor: "black" }
                        : { border: [0, 0, 1, 0], borderColor: "#aaa" };
                },
                data: [
                    [
                        { text: i18next.t('balancePdfMaker.salesIdTh'), textStroke: 0.5 },
                        { text: i18next.t('balancePdfMaker.salesDateTh'), textStroke: 0.5 },
                        { text: i18next.t('balancePdfMaker.salesTotalTh'), textStroke: 0.5 }
                    ],
                    ...sales.map((s: Sale) => {
                        return [
                            s.id.toString(),
                            formatDate(s.dateOfSale),
                            formatNumberToCurrentPrice(s.totalSale)
                        ];
                    })
                ]
            });
            pdf.moveDown();
            pdf.text(
                i18next.t('balancePdfMaker.salesCaption', { tiempoString: `${startDate} - ${endDate}` }),
                {
                    align: 'center',
                    stroke: true
                }
            );

            pdf.end();

            stream.on('finish', () => {
                console.log('PDF created');
                resolve();
            });

            stream.on('error', (err) => {
                reject(err);
            });
        });
    }

    public async findBalancePdf(rangeDate: string): Promise<string | null> {
        return new Promise((resolve, reject) => {
            const folderPath = isDev() ? path.join(process.cwd(), 'balances-pdfs') : path.join(app.getPath('userData'), 'balances-pdfs');
            const filePath = path.join(folderPath, `Balance_${rangeDate}.pdf`);
            if (!fs.existsSync(filePath)) {
                resolve(null);
            }
            resolve(filePath);
        });
    }

    public async deletePdf(rangeDate: string): Promise<void> {
        const folderPath = isDev() ? path.join(process.cwd(), 'balances-pdfs') : path.join(app.getPath('userData'), 'balances-pdfs');
        const filePath = path.join(folderPath, `Balance_${rangeDate}.pdf`);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
}

export default BalancePdfMaker;