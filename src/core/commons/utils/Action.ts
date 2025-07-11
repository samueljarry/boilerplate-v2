export class Action<T extends Array<unknown>> {
  public actionSet = new Set<(...params: T) => void>();
  private _callbacks: Array<(...params: T) => void> = [] as const;

  public add(func: (...params: T) => void) {
    this.actionSet.add(func);
    this._callbacks = Array.from(this.actionSet);
  }

  public remove(func: (...params: T) => void) {
    this.actionSet.delete(func);
    this._callbacks = Array.from(this.actionSet);
  }

  public clear(): void {
    for (const func of this.actionSet) {
      this.remove(func);
    }
  }

  public execute(...params: T) {
    for (const func of this.actionSet.values()) {
      func(...params);
    }
  }

  public get callbacks() {
    return this._callbacks;
  }
}