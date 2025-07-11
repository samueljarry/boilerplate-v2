export class Drag {
  private _enabled = false;
  private _dragging = false;
  private _onDrag: (event: PointerEvent) => void;

  constructor() {}

  // #region lifecycle
  public start(): void {
    this._addListeners();
    this._enabled = true;
  }

  public stop(): void {
    this._removeListeners();
    this._enabled = false;
  }

  private _addListeners(): void {
    window.addEventListener("pointerdown", this._startDrag);
  }

  private _removeListeners(): void {
    window.removeEventListener("pointerdown", this._startDrag);
    this._stopDrag();
  }
  // #endregion

  // #region event handlers
  private _startDrag = (): void => {
    this._dragging = true;

    window.addEventListener("pointermove", this._drag);
    window.addEventListener("pointerup", this._stopDrag);
  };

  private _stopDrag = (): void => {
    this._dragging = false;

    window.removeEventListener("pointermove", this._drag);
    window.removeEventListener("pointerup", this._stopDrag);
  };

  private _drag = (event: PointerEvent): void => {
    this._onDrag(event);
  };
  // #endregion

  // #region getters / setters
  public get enabled() {
    return this._enabled;
  }
  public get dragging() {
    return this._dragging;
  }

  public set onDrag(func: (event: PointerEvent) => void) { this._onDrag = func; }
  // #endregion
}