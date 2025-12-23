type ActionFunc<T extends Array<unknown>> = (...params: T) => void;

export interface ActionParameters {
  singleUse?: boolean;
}

export class Action<T extends Array<unknown>> {
  protected static DEFAULT_PARAMETERS: ActionParameters = {
    singleUse: false,
  } as const

  protected readonly _parameters: ActionParameters;
  
  protected _callbacks = new Set<ActionFunc<T>>();
  protected _orderMap = new Map<ActionFunc<T>, number>();
  protected _consumed = false;

  constructor(parameters: ActionParameters = Action.DEFAULT_PARAMETERS) {
    this._parameters = parameters;
  }

  // #region public methods
  public add(func: ActionFunc<T>, order = 1) {
    this._callbacks.add(func);
    this._orderMap.set(func, order);
  }

  public remove(func: ActionFunc<T>) {
    this._callbacks.delete(func);
    this._orderMap.delete(func);
  }

  public clear(): void {
    for (const func of this._callbacks) {
      this.remove(func);
    }
  }

  public execute(...params: T) {
    if(this._parameters.singleUse && this._consumed) {
      return;
    }

    this._consumed = true;

    for (const func of this._callbacks) {
      func(...params);
    }
  }

  public reset() {
    this._consumed = false;
    this.clear();
  }
  // #endregion

  // #region getters 
  public get callbacks() {
    return this._callbacks;
  }

  public get consumed() {
    if(!this._parameters.singleUse) {
      console.warn('Action needs to be instanced with "singleUse" parameters set to true for consumption to be handled.');
    }

    return this._consumed;
  }
  // #endregion
}