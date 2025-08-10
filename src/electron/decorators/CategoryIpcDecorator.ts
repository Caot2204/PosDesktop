import CategoryRepository from '../../data/repository/CategoryRepository';

class CategoryIpcDecorator {

    private categoryRespository: CategoryRepository;
    private ipcMain: Electron.IpcMain;

    constructor(categoryRepository: CategoryRepository, ipcMain: Electron.IpcMain) {
        this.categoryRespository = categoryRepository;
        this.ipcMain = ipcMain;
    }

    async configure() {
        await this.configureCategoryIpcMethods();
    }

    private async configureCategoryIpcMethods() {
        this.ipcMain.handle('categoryApi:saveCategory', async (event, name: string) => {
            await this.categoryRespository.saveCategory(name);
        });

        this.ipcMain.handle('categoryApi:updateCategory', async (event, categoryId: number, name: string) => {
            await this.categoryRespository.updateCategory(categoryId, name);
        });
        
        this.ipcMain.handle('categoryApi:deleteCategory', async (event, categoryId: number) => {
            await this.categoryRespository.deleteCategory(categoryId);
        });

        this.ipcMain.handle('categoryApi:getAllCategories', async (event) => {
            return await this.categoryRespository.getAllCategories();
        });
        console.log("Category methods configured succesfully");
    }
}

export default CategoryIpcDecorator;