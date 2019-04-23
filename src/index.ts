// NOTE: app-module-path must be the very first import of the application.
// These 2 lines allows modules to be required by absolute path (no ../ in imports).
// Do Not Remove.
import * as appModulePath from 'app-module-path';
appModulePath.addPath(__dirname);

import App from 'App';

const app = new App();
app.run();
