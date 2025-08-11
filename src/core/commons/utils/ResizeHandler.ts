export class ResizeHandler {
  constructor(
    private readonly _callback: () => void,
    executeImmediately?: boolean
  ) {
    if(executeImmediately) {
      this.execute();
    }
  }

  public start() {
    window.addEventListener('resize', this._callback);
  }

  public stop() {
    window.removeEventListener("resize", this._callback);
  }

  public execute() {
    this._callback();
  }
}