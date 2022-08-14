export type Storage = Record<string, any>;

/**
 * Provides safe methods to set, unset and get items from the local storage
 * caching the storage to increase performance.
 *
 * @method set(key,value)
 * @method remove(key)
 * @method get(key)
 *
 * #### Example
 *
 * ```ts
 * import LocalStorage from '~/utils/class/LocalStorage'
 *
 * LocalStorage.set('user', {name: 'Jose', age: '18'});
 * LocalStorage.get('user')
 * // {name: 'Jose', age: '18'}
 * LocalStorage.remove('user');
 * ```
 *
 * @author [Pollum](pollum.io)
 * @since 0.1.0
 *
 */
class SafeLocalStorage {
  /**
   * The prefix of the storage
   */
  private prefix: string = import.meta.env.VITE_LOCAL_STORAGE_PREFIX ?? "@app:";

  /**
   * The name of the storage
   */
  private storeName =
    import.meta.env.VITE_LOCAL_STORAGE_STORE_NAME ?? "@app-session";

  /**
   * The cached storage
   */
  private storage: Storage = {};

  constructor(storeName?: string, prefix?: string) {
    if (storeName) this.storeName = storeName;
    if (prefix) {
      this.prefix = prefix[prefix.length] === ":" ? prefix : prefix + ":";
    }
    this.syncLocalStorage();
  }

  /**
   * Updates the local storage with the current stored storage
   */
  private updateLocalStorage() {
    if (typeof window !== "undefined") {
      const stringify = JSON.stringify(this.storage);
      localStorage.setItem(this.storeName, stringify);
    }
  }

  /**
   * Synchronizes the local storage with the browser's local storage
   */
  private syncLocalStorage() {
    if (typeof window !== "undefined") {
      const storage = localStorage.getItem(this.storeName);
      if (storage) this.storage = JSON.parse(storage);
    }
  }

  /**
   * Performs the actions before and after the executable procedure such as:
   *  - Local Storage sync;
   *  - Local Storage Update;
   *
   * @param fn the executable procedure (add, remove, update)
   */
  private _(fn: (storage: Storage) => void) {
    if (Object.keys(this.storage).length) this.syncLocalStorage();
    fn(this.storage);
    this.updateLocalStorage();
  }

  /**
   * Mounts the key for the item with the prefixes
   * @param key
   */
  private keyName(key: string): string {
    return `${this.prefix}${key}`;
  }

  /**
   * Parses the current storage into key->values without prefix
   */
  private parseStorage() {
    const store: Storage = {};
    for (const key in this.storage) {
      const regex = new RegExp(this.prefix, "igm");
      const keyName = key.split(regex)[1];
      store[keyName] = this.storage[key];
    }
    return store;
  }

  /**
   * Sets an item into the local storage
   * @param key
   * @param value
   */
  set<T>(key: string, value: T) {
    this._((storage) => {
      storage[this.keyName(key)] = value;
    });
    return this;
  }

  /**
   * Removes a key from the storage
   * @param key
   */
  remove(key: string) {
    this._((storage) => {
      const keyName = this.keyName(key);
      if (storage[keyName]) delete storage[keyName];
    });
    return this;
  }

  /**
   * Clears the local storage.
   *
   * If `except` is provided, then the keys contained in the array will
   * be kept.
   *
   * @param except ['user', 'pools'] <- this will keep user and pools in the storage.
   */
  destroy(except?: string[]) {
    if (typeof window !== "undefined") {
      if (!except) {
        this.storage = {};
        localStorage.removeItem(this.storeName);
      } else
        this._((storage) => {
          for (const key in storage) {
            const regex = new RegExp(this.prefix, "igm");
            const keyName = key.split(regex)[1];
            if (!except.includes(keyName)) delete storage[key];
          }
        });
    }
    return this;
  }

  /**
   * Returns a value from the storage.
   *
   * If the key doens't exists in the storage, it'll result `undefined`
   * @param key
   * @returns
   */
  get<T>(key: string): T | undefined {
    const keyName = this.keyName(key);
    return this.storage[keyName];
  }

  /**
   * Returns the full storage
   * @returns
   */
  getStorage(): Storage {
    return this.parseStorage();
  }
}

/**
 * Default object to safely manage local storage
 */
const LocalStorage = new SafeLocalStorage();

export { LocalStorage, SafeLocalStorage };
