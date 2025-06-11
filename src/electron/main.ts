import { app, BrowserWindow, ipcMain } from 'electron';
import { getPreloadPath } from './pathResolver.js';
import path from 'path';
import { isDev } from './util.js';
import DataSourceConfigurator from './DataSourceConfigurator.js'

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    minWidth: 1000,
    minHeight: 500,
    webPreferences: {
      preload: getPreloadPath()
    }
  })

  if (isDev()) {
    mainWindow.loadURL('http://localhost:5123');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), 'dist-react/index.html'));
  }
}

const initializeDatabaseAndIpcMethods = async (): Promise<boolean> => {
  try {
    const dataSourceConfigurator = new DataSourceConfigurator(ipcMain);
    dataSourceConfigurator.configureWithSqlite();    
  } catch (error) {
    console.error('Error initializing database:', error);
    app.quit();
    return false;
  }
  return true;
}

app.whenReady().then(async () => {
  const databaseReady = await initializeDatabaseAndIpcMethods();
  if (databaseReady) {
    createWindow()
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
});

