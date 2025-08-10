import path from 'path';
import { app } from 'electron';
import { isDev } from './util';

export function getPreloadPath() {
  console.log("si pasa");
  return path.join(
    app.getAppPath(),
    isDev() ? '.' : '..',
    'dist-electron/electron/preload.cjs'
  );
}