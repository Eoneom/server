export interface Lock {
  has(key: string): boolean
  set(key: string): void
  delete(key: string): void
}
