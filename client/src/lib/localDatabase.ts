// قاعدة بيانات محلية للعمل بدون إنترنت
// تستخدم IndexedDB لحفظ البيانات محلياً

interface ImageProcessingHistory {
  id: string;
  originalImage: string; // base64
  processedImage: string; // base64
  prompt: string;
  service: string;
  settings: Record<string, any>;
  timestamp: number;
  processingTime: number;
  metadata?: Record<string, any>;
}

interface UserSettings {
  id: string;
  language: string;
  theme: string;
  preferredQuality: string;
  lastUsedServices: string[];
  customPrompts: string[];
  processingPreferences: Record<string, any>;
}

interface ModelCache {
  id: string;
  modelName: string;
  modelData: ArrayBuffer;
  version: string;
  lastUsed: number;
  size: number;
}

class LocalDatabase {
  private db: IDBDatabase | null = null;
  private readonly dbName = "KnouxVersaDB";
  private readonly dbVersion = 1;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // متجر سجل ال��عالجة
        if (!db.objectStoreNames.contains("processingHistory")) {
          const historyStore = db.createObjectStore("processingHistory", {
            keyPath: "id",
          });
          historyStore.createIndex("timestamp", "timestamp", { unique: false });
          historyStore.createIndex("service", "service", { unique: false });
        }

        // متجر إعدادات المستخدم
        if (!db.objectStoreNames.contains("userSettings")) {
          db.createObjectStore("userSettings", { keyPath: "id" });
        }

        // متجر ذاكرة التخزين المؤقت للنماذج
        if (!db.objectStoreNames.contains("modelCache")) {
          const modelStore = db.createObjectStore("modelCache", {
            keyPath: "id",
          });
          modelStore.createIndex("lastUsed", "lastUsed", { unique: false });
        }

        // متجر الصور المفضلة
        if (!db.objectStoreNames.contains("favorites")) {
          const favStore = db.createObjectStore("favorites", { keyPath: "id" });
          favStore.createIndex("timestamp", "timestamp", { unique: false });
        }

        // متجر الإعدادات المسبقة
        if (!db.objectStoreNames.contains("presets")) {
          db.createObjectStore("presets", { keyPath: "id" });
        }
      };
    });
  }

  // === إدارة سجل المعالجة ===
  async saveProcessingHistory(
    history: Omit<ImageProcessingHistory, "id">,
  ): Promise<string> {
    if (!this.db) throw new Error("Database not initialized");

    const id = `history_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const record: ImageProcessingHistory = { id, ...history };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(
        ["processingHistory"],
        "readwrite",
      );
      const store = transaction.objectStore("processingHistory");
      const request = store.add(record);

      request.onsuccess = () => resolve(id);
      request.onerror = () => reject(request.error);
    });
  }

  async getProcessingHistory(
    limit: number = 50,
  ): Promise<ImageProcessingHistory[]> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(
        ["processingHistory"],
        "readonly",
      );
      const store = transaction.objectStore("processingHistory");
      const index = store.index("timestamp");
      const request = index.openCursor(null, "prev");

      const results: ImageProcessingHistory[] = [];
      let count = 0;

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor && count < limit) {
          results.push(cursor.value);
          count++;
          cursor.continue();
        } else {
          resolve(results);
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  async getHistoryByService(
    service: string,
  ): Promise<ImageProcessingHistory[]> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(
        ["processingHistory"],
        "readonly",
      );
      const store = transaction.objectStore("processingHistory");
      const index = store.index("service");
      const request = index.getAll(service);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteHistoryItem(id: string): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(
        ["processingHistory"],
        "readwrite",
      );
      const store = transaction.objectStore("processingHistory");
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clearOldHistory(daysOld: number = 30): Promise<number> {
    if (!this.db) throw new Error("Database not initialized");

    const cutoffTime = Date.now() - daysOld * 24 * 60 * 60 * 1000;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(
        ["processingHistory"],
        "readwrite",
      );
      const store = transaction.objectStore("processingHistory");
      const index = store.index("timestamp");
      const request = index.openCursor(IDBKeyRange.upperBound(cutoffTime));

      let deletedCount = 0;

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          cursor.delete();
          deletedCount++;
          cursor.continue();
        } else {
          resolve(deletedCount);
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  // === إدارة إعدادات المستخدم ===
  async saveUserSettings(settings: Omit<UserSettings, "id">): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    const record: UserSettings = { id: "user_settings", ...settings };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["userSettings"], "readwrite");
      const store = transaction.objectStore("userSettings");
      const request = store.put(record);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getUserSettings(): Promise<UserSettings | null> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["userSettings"], "readonly");
      const store = transaction.objectStore("userSettings");
      const request = store.get("user_settings");

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  // === إدارة ذاكرة التخزين المؤقت للنماذج ===
  async cacheModel(
    modelName: string,
    modelData: ArrayBuffer,
    version: string,
  ): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    const record: ModelCache = {
      id: modelName,
      modelName,
      modelData,
      version,
      lastUsed: Date.now(),
      size: modelData.byteLength,
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["modelCache"], "readwrite");
      const store = transaction.objectStore("modelCache");
      const request = store.put(record);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getCachedModel(modelName: string): Promise<ArrayBuffer | null> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["modelCache"], "readwrite");
      const store = transaction.objectStore("modelCache");
      const request = store.get(modelName);

      request.onsuccess = () => {
        const result = request.result;
        if (result) {
          // تحديث وقت الاستخدام الأخير
          result.lastUsed = Date.now();
          store.put(result);
          resolve(result.modelData);
        } else {
          resolve(null);
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  async clearOldCachedModels(maxAge: number = 7): Promise<number> {
    if (!this.db) throw new Error("Database not initialized");

    const cutoffTime = Date.now() - maxAge * 24 * 60 * 60 * 1000;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["modelCache"], "readwrite");
      const store = transaction.objectStore("modelCache");
      const index = store.index("lastUsed");
      const request = index.openCursor(IDBKeyRange.upperBound(cutoffTime));

      let deletedCount = 0;

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          cursor.delete();
          deletedCount++;
          cursor.continue();
        } else {
          resolve(deletedCount);
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  // === إدارة المفضلة ===
  async addToFavorites(historyId: string): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    const record = {
      id: historyId,
      timestamp: Date.now(),
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["favorites"], "readwrite");
      const store = transaction.objectStore("favorites");
      const request = store.put(record);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async removeFromFavorites(historyId: string): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["favorites"], "readwrite");
      const store = transaction.objectStore("favorites");
      const request = store.delete(historyId);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getFavorites(): Promise<string[]> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["favorites"], "readonly");
      const store = transaction.objectStore("favorites");
      const request = store.getAll();

      request.onsuccess = () => {
        const favorites = request.result.map((item) => item.id);
        resolve(favorites);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // === إدارة الإعدادات المسبقة ===
  async savePreset(name: string, settings: Record<string, any>): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    const record = {
      id: name,
      settings,
      timestamp: Date.now(),
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["presets"], "readwrite");
      const store = transaction.objectStore("presets");
      const request = store.put(record);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getPresets(): Promise<
    Array<{ id: string; settings: Record<string, any>; timestamp: number }>
  > {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["presets"], "readonly");
      const store = transaction.objectStore("presets");
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // === إحصائيات الاستخدام ===
  async getUsageStats(): Promise<{
    totalProcessed: number;
    favoritesCount: number;
    mostUsedService: string;
    storageUsed: number;
    cacheSize: number;
  }> {
    if (!this.db) throw new Error("Database not initialized");

    const [history, favorites, models] = await Promise.all([
      this.getProcessingHistory(10000),
      this.getFavorites(),
      this.getAllCachedModels(),
    ]);

    // حساب الخدمة الأكثر استخداماً
    const serviceCount: Record<string, number> = {};
    history.forEach((item) => {
      serviceCount[item.service] = (serviceCount[item.service] || 0) + 1;
    });

    const mostUsedService = Object.keys(serviceCount).reduce(
      (a, b) => (serviceCount[a] > serviceCount[b] ? a : b),
      "",
    );

    // حساب حجم التخزين
    const storageUsed = history.reduce((sum, item) => {
      return (
        sum + (item.originalImage.length + item.processedImage.length) * 0.75
      ); // تقدير تقريبي لـ base64
    }, 0);

    const cacheSize = models.reduce((sum, model) => sum + model.size, 0);

    return {
      totalProcessed: history.length,
      favoritesCount: favorites.length,
      mostUsedService,
      storageUsed,
      cacheSize,
    };
  }

  private async getAllCachedModels(): Promise<ModelCache[]> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["modelCache"], "readonly");
      const store = transaction.objectStore("modelCache");
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // === تنظيف البيانات ===
  async clearAllData(): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    const storeNames = [
      "processingHistory",
      "userSettings",
      "modelCache",
      "favorites",
      "presets",
    ];

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeNames, "readwrite");

      let completed = 0;
      const total = storeNames.length;

      storeNames.forEach((storeName) => {
        const store = transaction.objectStore(storeName);
        const request = store.clear();

        request.onsuccess = () => {
          completed++;
          if (completed === total) {
            resolve();
          }
        };

        request.onerror = () => reject(request.error);
      });
    });
  }

  // === إغلاق قاعدة البيانات ===
  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

// إنشاء مثيل مشترك
export const localDB = new LocalDatabase();

// تهيئة قاعدة البيانات عند تحميل الموديول
localDB.init().catch(console.error);

// تصدير الأنواع للاستخدام في مكونات أخرى
export type { ImageProcessingHistory, UserSettings, ModelCache };
