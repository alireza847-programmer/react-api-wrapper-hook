export interface CacheItem {
  key: string;
  value: any;
  timeout: number;
  fetchTime: Date;
}

export type Caches = CacheItem[];
