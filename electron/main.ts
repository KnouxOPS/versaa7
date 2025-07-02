import {
  app,
  BrowserWindow,
  Menu,
  shell,
  dialog,
  ipcMain,
  screen,
} from "electron";
import { join } from "path";
import { readFileSync, existsSync } from "fs";

// Keep a global reference of the window object
let mainWindow: BrowserWindow | null = null;
let splashWindow: BrowserWindow | null = null;

// App Info
const APP_NAME = "KNOUX VERSA";
const APP_VERSION = "1.0.0";
const isDev = process.env.NODE_ENV === "development";

function createSplashWindow(): BrowserWindow {
  splashWindow = new BrowserWindow({
    width: 450,
    height: 350,
    frame: false,
    alwaysOnTop: true,
    transparent: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Load external splash screen
  const splashPath = isDev
    ? join(__dirname, "../assets/splash.html")
    : join(__dirname, "../assets/splash.html");

  splashWindow.loadFile(splashPath).catch(() => {
    // Fallback to simple splash if file not found
    const simpleSplash = `data:text/html;charset=UTF-8,${encodeURIComponent(`
      <!DOCTYPE html>
      <html>
        <head><style>
          body { margin:0; padding:40px; background:#1a1a2e; color:#00ffff;
                 font-family:system-ui; text-align:center; }
          .logo { font-size:48px; margin-bottom:20px; }
          .title { font-size:24px; margin-bottom:10px; }
        </style></head>
        <body>
          <div class="logo">K</div>
          <div class="title">KNOUX VERSA</div>
          <div>Loading AI Nexus...</div>
        </body>
      </html>
    `)}`;
    splashWindow.loadURL(simpleSplash);
  });

  // Center the splash window
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const x = Math.floor((width - 400) / 2);
  const y = Math.floor((height - 300) / 2);
  splashWindow.setPosition(x, y);

  return splashWindow;
}

function createMainWindow(): BrowserWindow {
  // Get display information
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  // Create the browser window
  mainWindow = new BrowserWindow({
    width: Math.min(1400, width - 100),
    height: Math.min(900, height - 100),
    minWidth: 1000,
    minHeight: 700,
    show: false, // Don't show until ready
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true,
      preload: join(__dirname, "preload.js"),
    },
    icon: isDev ? undefined : join(__dirname, "../assets/icon.png"),
    titleBarStyle: process.platform === "darwin" ? "hiddenInset" : "default",
    autoHideMenuBar: true,
  });

  // Set app title
  mainWindow.setTitle(`${APP_NAME} v${APP_VERSION}`);

  // Load the app
  if (isDev) {
    mainWindow.loadURL("http://localhost:5000");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(join(__dirname, "../public/index.html"));
  }

  // Show window when ready
  mainWindow.once("ready-to-show", () => {
    if (splashWindow) {
      splashWindow.close();
      splashWindow = null;
    }

    if (mainWindow) {
      mainWindow.show();

      if (isDev) {
        mainWindow.webContents.openDevTools();
      }
    }
  });

  // Handle window closed
  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  return mainWindow;
}

// Create application menu
function createMenu() {
  const template: any = [
    {
      label: "File",
      submenu: [
        {
          label: "New Transformation",
          accelerator: "CmdOrCtrl+N",
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.send("new-transformation");
            }
          },
        },
        {
          label: "Open Image",
          accelerator: "CmdOrCtrl+O",
          click: async () => {
            if (mainWindow) {
              const result = await dialog.showOpenDialog(mainWindow, {
                properties: ["openFile"],
                filters: [
                  {
                    name: "Images",
                    extensions: ["jpg", "jpeg", "png", "gif", "webp"],
                  },
                ],
              });

              if (!result.canceled && result.filePaths.length > 0) {
                mainWindow.webContents.send("open-image", result.filePaths[0]);
              }
            }
          },
        },
        { type: "separator" },
        {
          label: "Exit",
          accelerator: process.platform === "darwin" ? "Cmd+Q" : "Ctrl+Q",
          click: () => {
            app.quit();
          },
        },
      ],
    },
    {
      label: "Edit",
      submenu: [
        { label: "Undo", accelerator: "CmdOrCtrl+Z", role: "undo" },
        { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", role: "redo" },
        { type: "separator" },
        { label: "Cut", accelerator: "CmdOrCtrl+X", role: "cut" },
        { label: "Copy", accelerator: "CmdOrCtrl+C", role: "copy" },
        { label: "Paste", accelerator: "CmdOrCtrl+V", role: "paste" },
      ],
    },
    {
      label: "View",
      submenu: [
        { label: "Reload", accelerator: "CmdOrCtrl+R", role: "reload" },
        {
          label: "Force Reload",
          accelerator: "CmdOrCtrl+Shift+R",
          role: "forceReload",
        },
        {
          label: "Toggle Developer Tools",
          accelerator: "F12",
          role: "toggleDevTools",
        },
        { type: "separator" },
        { label: "Actual Size", accelerator: "CmdOrCtrl+0", role: "resetZoom" },
        { label: "Zoom In", accelerator: "CmdOrCtrl+Plus", role: "zoomIn" },
        { label: "Zoom Out", accelerator: "CmdOrCtrl+-", role: "zoomOut" },
        { type: "separator" },
        {
          label: "Toggle Fullscreen",
          accelerator: "F11",
          role: "togglefullscreen",
        },
      ],
    },
    {
      label: "AI Tools",
      submenu: [
        {
          label: "Magic Morph",
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.send("select-service", "magic-morph");
            }
          },
        },
        {
          label: "Remove & Replace",
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.send("select-service", "remove-replace");
            }
          },
        },
        {
          label: "Style Transfer",
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.send("select-service", "style-transfer");
            }
          },
        },
        { type: "separator" },
        {
          label: "VIP Magic Morph",
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.send("vip-request");
            }
          },
        },
      ],
    },
    {
      label: "Help",
      submenu: [
        {
          label: "About KNOUX VERSA",
          click: () => {
            dialog.showMessageBox(mainWindow!, {
              type: "info",
              title: "About KNOUX VERSA",
              message: `${APP_NAME} v${APP_VERSION}`,
              detail:
                "The Uncensored AI Nexus\n\nCreated by Sadek Elgazar\n\nTransform images with unlimited AI power.",
              buttons: ["OK"],
            });
          },
        },
        {
          label: "Support Creator",
          click: () => {
            shell.openExternal("https://buymeacoffee.com/knoux");
          },
        },
        { type: "separator" },
        {
          label: "Check for Updates",
          click: () => {
            dialog.showMessageBox(mainWindow!, {
              type: "info",
              title: "Updates",
              message: "You are running the latest version!",
              detail: `${APP_NAME} v${APP_VERSION}`,
              buttons: ["OK"],
            });
          },
        },
      ],
    },
  ];

  // macOS specific menu adjustments
  if (process.platform === "darwin") {
    template.unshift({
      label: APP_NAME,
      submenu: [
        {
          label: `About ${APP_NAME}`,
          click: () => {
            dialog.showMessageBox(mainWindow!, {
              type: "info",
              title: `About ${APP_NAME}`,
              message: `${APP_NAME} v${APP_VERSION}`,
              detail: "The Uncensored AI Nexus\n\nCreated by Sadek Elgazar",
              buttons: ["OK"],
            });
          },
        },
        { type: "separator" },
        { label: "Services", role: "services", submenu: [] },
        { type: "separator" },
        { label: `Hide ${APP_NAME}`, accelerator: "Command+H", role: "hide" },
        {
          label: "Hide Others",
          accelerator: "Command+Shift+H",
          role: "hideothers",
        },
        { label: "Show All", role: "unhide" },
        { type: "separator" },
        { label: "Quit", accelerator: "Command+Q", click: () => app.quit() },
      ],
    });
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// App event listeners
app.whenReady().then(() => {
  createSplashWindow();

  // Create main window after a short delay
  setTimeout(() => {
    createMainWindow();
    createMenu();
  }, 2000);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Security: Prevent navigation to external websites
app.on("web-contents-created", (event, contents) => {
  contents.on("will-navigate", (navigationEvent, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);

    if (parsedUrl.origin !== "http://localhost:3000" && !isDev) {
      navigationEvent.preventDefault();
    }
  });
});

// IPC handlers
ipcMain.handle("get-app-version", () => {
  return APP_VERSION;
});

ipcMain.handle("show-save-dialog", async () => {
  if (mainWindow) {
    const result = await dialog.showSaveDialog(mainWindow, {
      filters: [{ name: "Images", extensions: ["png", "jpg", "jpeg"] }],
    });
    return result;
  }
});

// Handle VIP key validation (encrypted)
ipcMain.handle("validate-vip-key", (event, key: string) => {
  try {
    // Check if vip.key file exists
    const vipKeyPath = join(__dirname, "../vip.key");
    if (existsSync(vipKeyPath)) {
      const storedKey = readFileSync(vipKeyPath, "utf8").trim();
      return key === storedKey;
    }
    return false;
  } catch (error) {
    console.error("VIP key validation error:", error);
    return false;
  }
});

// Export for testing
export { createMainWindow, createSplashWindow };
