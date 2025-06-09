import { app, BrowserWindow, ipcMain } from 'electron';
import { getPreloadPath } from './pathResolver.js';
import path from 'path';
import { isDev } from './util.js';
import PosDatabase from '../data/datasource/ds-sqlite/PosDatabase.js';
import UserIpcDecorator from './decorators/UserIpcDecorator.js';

let dbInstance: PosDatabase;

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
  const dbPath = isDev() ? 'pos_dev_database.sqlite' : path.join(app.getAppPath(), 'pos_database.sqlite');
  console.log(`Database path:${dbPath}`);
  dbInstance = new PosDatabase(dbPath);
  try {
    await dbInstance.initialize();
    console.log('Database initialized');
    const userDecorator = new UserIpcDecorator(dbInstance, ipcMain);
    userDecorator.configure();
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

