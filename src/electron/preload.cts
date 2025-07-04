import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld('userAPI',
  {
    saveUser: (name: string, password: string, isAdmin: boolean) => ipcRenderer.invoke(
      'userApi:saveUser', name, password, isAdmin
    ),
    deleteUser: (id: string, isAdmin: boolean) => ipcRenderer.invoke('userApi:deleteUser', id, isAdmin),
    updateUser: (id: string, name: string, password: string, isAdmin: boolean) => 
      ipcRenderer.invoke('userApi:updateUser', id, name, password, isAdmin),
    getAllUsers: () => ipcRenderer.invoke('userApi:getAllUsers')
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