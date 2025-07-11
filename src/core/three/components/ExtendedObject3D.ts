import { Object3D } from "three";

export class ExtendedObject3D extends Object3D {
  public isExtendedObject3D = true;
  protected _extendedObject3Ds = new Set<ExtendedObject3D>();

  public init() {
    if (this.resize) {
      window.addEventListener("resize", this.resize);
    }
  }

  public reset() {
    if (this.resize) {
      window.removeEventListener("resize", this.resize);
    }
  }

  // #region utilities
  public override add(...object: Object3D[]): this {
    super.add(...object);
    this._forAllExtendedObject3D((child) =>{
      this._extendedObject3Ds.add(child)
    });
    return this;
  }

  public override remove(...object: Object3D[]): this {
    super.remove(...object);
    this._forAllExtendedObject3D((child) =>
      this._extendedObject3Ds.delete(child)
    );
    return this;
  }

  protected _forAllExtendedObject3D(
    callback: (child: ExtendedObject3D) => void
  ): void {
    this.traverse((child: Object3D) => {
      if (child instanceof ExtendedObject3D) {
        callback(child);
      }
    });
  }
  // #endregion

  public resize: (e: Event) => void;
  public update(dt: number): void {};
}