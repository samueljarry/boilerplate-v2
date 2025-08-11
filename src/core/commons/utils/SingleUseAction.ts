import { Action } from "./Action";

export class SingleUseAction extends Action<Array<unknown>> {
  private _used = false;

  public override execute(...params: unknown[]): void {
    if (this._used) return;
    this._used = true;

    super.execute(...params);
    this.clear();
  }

  public reset(): void {
    this._used = false;
  }

  public get used() {
    return this._used;
  }
}