const DEFAULT_CACHE_TIME = 60 * 60 * 24 * 7;

class Storage {
  private storage: globalThis.Storage;
  private prefixKey?: string;

  constructor(prefixKey = '', storage = localStorage) {
    this.storage = storage;
    this.prefixKey = prefixKey;
  }

  private getKey(key: string) {
    return `${this.prefixKey}${key}`.toUpperCase();
  }

  getAuthorization(key: any) {
    return `Bearer ${this.get(key)}`;
  }

  isAuthenticated(key: any): boolean {
    return Boolean(this.storage.getItem(key));
  }

  set(key: string, value: any, expire: number | null = DEFAULT_CACHE_TIME) {
    const stringData = JSON.stringify({
      value,
      expire: expire !== null ? new Date().getTime() + expire * 1000 : null
    });
    this.storage.setItem(this.getKey(key), stringData);
  }

  get(key: string, def: any = null) {
    const item = this.storage.getItem(this.getKey(key));
    if (item) {
      try {
        const data = JSON.parse(item);
        const { value, expire } = data;
        if (expire === null || expire >= Date.now()) {
          return value;
        }
        this.remove(key);
      } catch (e) {
        return e;
      }
    }
    return def;
  }

  remove(key: string) {
    this.storage.removeItem(this.getKey(key));
  }
}

export const storage = new Storage('');
