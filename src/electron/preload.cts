import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld('userAPI',
  {
    saveUser: (name: string, password: string, isAdmin: boolean) => ipcRenderer.invoke(
      'userApi:saveUser', name, password, isAdmin
    ),
    deleteUser: (id: string) => ipcRenderer.invoke('userApi:deleteUser', id),
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