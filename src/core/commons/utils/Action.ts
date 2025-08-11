type ActionFunc<T extends Array<unknown>> = (...params: T) => void;

export class Action<T extends Array<unknown>> {
  public actionSet = new Set<ActionFunc<T>>();
  private _orderMap = new Map<ActionFunc<T>, number>();
  private _callbacks: Array<ActionFunc<T>> = [] as const;

  public add(func: ActionFunc<T>, order = 1) {
    this.actionSet.add(func);
    this._orderMap.set(func, order);
    this._callbacks = Array.from(this.actionSet).sort(
      (a, b) => (this._orderMap.get(a) ?? 0) - (this._orderMap.get(b) ?? 0)
    );
  }

  public remove(func: ActionFunc<T>) {
    this.actionSet.delete(func);
    this._orderMap.delete(func);
    this._callbacks = Array.from(this.actionSet).sort(
      (a, b) => (this._orderMap.get(a) ?? 0) - (this._orderMap.get(b) ?? 0)
    );
  }

  public clear(): void {
    for (const func of this.actionSet) {
      this.remove(func);
    }
  }

  public execute(...params: T) {
    for (const func of this._callbacks) {
      func(...params);
    }
  }

  public get callbacks() {
    return this._callbacks;
  }
}