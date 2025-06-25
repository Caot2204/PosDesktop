import CategoryRepository from '../../data/repository/CategoryRepository.js';
import ProductRepository from '../../data/repository/ProductRepository.js';

class InventoryIpcDecorator {

    private categoryRepository: CategoryRepository;
    private productRepository: ProductRepository;
    private ipcMain: Electron.IpcMain;

    constructor(ipcMain: Electron.IpcMain, categoryRepository: CategoryRepository, productRepository: ProductRepository) {
        this.ipcMain = ipcMain;
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;        
    }

    configure() {
        this.configureCategoryIpcMethods();
        this.configureProductIpcMethods();
    }

    private async configureCategoryIpcMethods() {
        this.ipcMain.handle('categoryApi:saveCategory', async (event, name: string) => {
            await this.categoryRepository.saveCategory(name);
        });

        this.ipcMain.handle('categoryApi:updateCategory', async (event, categoryId: number, name: string) => {
            await this.categoryRepository.updateCategory(categoryId, name);
        });
        
        this.ipcMain.handle('categoryApi:deleteCategory', async (event, categoryId: number) => {
            await this.categoryRepository.deleteCategory(categoryId);
        });

        this.ipcMain.handle('categoryApi:getAllCategories', async (event) => {
            return await this.categoryRepository.getAllCategories();
        });
        console.log("Category methods configured succesfully");
    }

    private async configureProductIpcMethods() {
        this.ipcMain.handle('productApi:deleteProduct', async (event, code: string) => {
            await this.productRepository.deleteProduct(code);
        });

        this.ipcMain.handle('productApi:getAllProducts', async (event) => {
            return await this.productRepository.getAllProducts();
        });

        this.ipcMain.handle('productApi:getProductByCode', async (event, code: string) => {
            return await this.productRepository.getProductByCode(code);
        });

        this.ipcMain.handle('productApi:getProductByName', async (event, name: string) => {
            return await this.productRepository.getProductByName(name);
        });

        this.ipcMain.handle('productApi:increaseStock', async (event, code: string, unitsToIncrease: number) => {
            await this.productRepository.increaseStock(code, unitsToIncrease);
        });

        this.ipcMain.handle('productApi:saveProduct', async (event, code: string, name: string, unitPrice: number, stock: number, isInfinityStock: boolean, category: string) => {
            await this.productRepository.saveProduct(code, name, unitPrice, stock, isInfinityStock, category);
        });

        this.ipcMain.handle('productApi:updateProduct', async (event, code: string, name: string, unitPrice: number, stock: number, isInfinityStock: boolean, category: string, previousCode?: string) => {
            await this.productRepository.updateProduct(code, name, unitPrice, stock, isInfinityStock, category, previousCode);
        });
        console.log("Product methods configured succesfully");
    }

}

export default InventoryIpcDecorator;