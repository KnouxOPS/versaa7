const { contextBridge, ipcRenderer } = require("electron");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("electronAPI", {
  // App info
  getAppVersion: () => ipcRenderer.invoke("get-app-version"),

  // File operations
  showSaveDialog: () => ipcRenderer.invoke("show-save-dialog"),

  // VIP functionality
  validateVipKey: (key) => ipcRenderer.invoke("validate-vip-key", key),

  // Listen for menu events
  onNewTransformation: (callback) => {
    ipcRenderer.on("new-transformation", callback);
  },

  onOpenImage: (callback) => {
    ipcRenderer.on("open-image", (event, filePath) => callback(filePath));
  },

  onSelectService: (callback) => {
    ipcRenderer.on("select-service", (event, serviceId) => callback(serviceId));
  },

  onVipRequest: (callback) => {
    ipcRenderer.on("vip-request", callback);
  },

  // Remove listeners
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  },
});

// Expose a limited API for development
if (process.env.NODE_ENV === "development") {
  contextBridge.exposeInMainWorld("electronDev", {
    openDevTools: () => ipcRenderer.send("open-dev-tools"),
    isDev: true,
  });
}
