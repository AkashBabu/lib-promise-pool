export default async function PromisePool<T = any, R = any>(
  /* array of items to be iterated */
  arr: T[],
  worker: (item: T, index: number) => Promise<R>,
  concurrency?: number,
  options?: {
    stopOnErr?: boolean;
  }
): Promise<R[]>;
