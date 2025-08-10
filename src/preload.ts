import { contextBridge, ipcRenderer } from "electron";
import SaleProductModel from "./ui/sales/model/SalesProductModel";

contextBridge.exposeInMainWorld('userAPI',
  {
    saveUser: (name: string, password: string, isAdmin: boolean) => ipcRenderer.invoke(
      'userApi:saveUser', name, password, isAdmin
    ),
    deleteUser: (id: string, isAdmin: boolean) => ipcRenderer.invoke('userApi:deleteUser', id, isAdmin),
    updateUser: (id: string, name: string, password: string, isAdmin: boolean) =>
      ipcRenderer.invoke('userApi:updateUser', id, name, password, isAdmin),
    getAllUsers: () => ipcRenderer.invoke('userApi:getAllUsers'),
    login: (userName: string, password: string) => ipcRenderer.invoke('userApi:login', userName, password)
  }
);

contextBridge.exposeInMainWorld('categoryAPI',
  {
    saveCategory: (name: string) => ipcRenderer.invoke('categoryApi:saveCategory', name),
    updateCategory: (categoryId: number, name: string) => ipcRenderer.invoke('categoryApi:updateCategory', categoryId, name),
    deleteCategory: (categoryId: number) => ipcRenderer.invoke('categoryApi:deleteCategory', categoryId),
    getAllCategories: () => ipcRenderer.invoke('categoryApi:getAllCategories')
  }
);

contextBridge.exposeInMainWorld('productAPI',
  {
    deleteProduct: (code: string) => ipcRenderer.invoke('productApi:deleteProduct', code),
    getAllProducts: () => ipcRenderer.invoke('productApi:getAllProducts'),
    getProductByCode: (code: string) => ipcRenderer.invoke('productApi:getProductByCode', code),
    increaseStock: (code: string, unitsToIncrease: number) => ipcRenderer.invoke('productApi:increaseStock', code, unitsToIncrease),
    saveProduct: (code: string, name: string, unitPrice: number, stock: number, isInfinityStock: boolean, category: string) => ipcRenderer.invoke('productApi:saveProduct', code, name, unitPrice, stock, isInfinityStock, category),
    updateProduct: (code: string, name: string, unitPrice: number, stock: number, isInfinityStock: boolean, category: string, previousCode?: string) => ipcRenderer.invoke('productApi:updateProduct', code, name, unitPrice, stock, isInfinityStock, category, previousCode),
  }
);

contextBridge.exposeInMainWorld('saleAPI',
  {
    getSaleById: (saleId: number) => ipcRenderer.invoke('saleApi:getSaleById', saleId),
    getSalesByDate: (dateOfSale: Date) => ipcRenderer.invoke('saleApi:getSalesByDate', dateOfSale),
    saveSale: (
      dateOfSale: Date,
      userToGenerateSale: string,
      productsSold: SaleProductModel[],
      paymentType: string,
      amountPayed: number,
      totalSale: number
    ) => ipcRenderer.invoke('saleApi:saveSale', dateOfSale, userToGenerateSale, productsSold, paymentType, amountPayed, totalSale)
  }
);

contextBridge.exposeInMainWorld('cashClosingAPI',
  {
    getCashClosingOfDate: (date: Date) => ipcRenderer.invoke('cashClosingApi:getCashClosingOfDate', date),
    getCashClosingOfUser: (userName: string) => ipcRenderer.invoke('cashClosingApi:getCashClosingOfUser', userName),
    saveCashClosing: (physicalMoney: number, totalOfDay: number, userName: string) => ipcRenderer.invoke('cashClosingApi:saveCashClosing', physicalMoney, totalOfDay, userName)
  }
);

contextBridge.exposeInMainWorld('posConfigAPI',
  {
    getPosConfig: () => ipcRenderer.invoke('posConfigApi:getPosConfig'),
    savePosConfig: (bussinessName: string, bussinessLogoUrl: string, minimunStock: number, posLanguage: string) => ipcRenderer.invoke('posConfigApi:savePosConfig', bussinessName, bussinessLogoUrl, minimunStock, posLanguage),
    selectNewBussinessLogo: () => ipcRenderer.invoke('posConfigApi:selectNewBussinessLogo'),
    getBussinessLogoDataUrl: (logoPath: string) => ipcRenderer.invoke('posConfigApi:getBussinessLogoDataUrl', logoPath)
  }

);