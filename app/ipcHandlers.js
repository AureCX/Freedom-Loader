const {registerLoggerAPIHandlers} = require("./ipc/loggerAPI");
const {registerFeatureAPIHandlers} = require("./ipc/featureAPI");
const {registerInfoAPIHandlers} = require("./ipc/infoAPI");
const {registerDownloadAPIHandlers} = require("./ipc/downloadAPI");
const {registerThemeAPIHandlers} = require("./ipc/themeAPI");
const {registerTopbarAPIHandlers} = require("./ipc/topbarAPI");
const {registerUpdaterAPIHandlers} = require("./ipc/updaterAPI");
const {registerReportBugAPIHandlers} = require("./ipc/reportBugAPI");
const {registerUiAPIHandlers} = require("./ipc/uiAPI");

/**
 * Registers all IPC handlers and event listeners for Electron main process.
 *
 * This function wires renderer → main communication channels:
 * - synchronous queries (handle)
 * - fire-and-forget events (on)
 *
 * @param {Function} getMainWindow - Function returning current BrowserWindow instance
 */
function registerIpcHandlers(getMainWindow) {

  registerLoggerAPIHandlers();
  registerFeatureAPIHandlers();
  registerInfoAPIHandlers();
  registerDownloadAPIHandlers(getMainWindow);
  registerThemeAPIHandlers();
  registerTopbarAPIHandlers(getMainWindow);
  registerUpdaterAPIHandlers();
  registerReportBugAPIHandlers();
  registerUiAPIHandlers();

  /**
   * Updates a runtime feature flag and persists it to disk.
   *
   * Flow:
   * - Validates key against whitelist
   * - Prevents unnecessary writes if value is unchanged
   * - Updates in-memory config object
   * - Persists to configuration file
   *
   * Security note:
   * Only whitelisted keys can be modified via IPC to prevent config injection.
   *
   * @param {Electron.IpcMainEvent} event
   * @param {{key: string, value: any}} payload
   * @returns {boolean} success state
   */
  ipcMain.handle("set-feature", (event, { key, value }) => {
    try {
      return setFeature(key, value);
    } catch (err) {
      logger.error(`Failed to set feature ${key}: ${err.message}`);
      throw err;
    }});
}

module.exports = { registerIpcHandlers };
