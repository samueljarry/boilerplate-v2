import { ExtendedObject3D } from "../components/ExtendedObject3D";
import { Mixin } from "ts-mixer";
import type { ViewId } from "@/core/commons/constants/views/ViewId";
import type { ViewLayer } from "@/core/commons/constants/views/ViewLayer";
import { ViewType } from "@/core/commons/constants/views/ViewType";
import { AbstractAnimatedView } from "@/core/commons/views/abstracts/AbstractAnimatedView";
import { Ticker } from "@/core/commons/utils/Ticker";

export abstract class ThreeView extends Mixin(ExtendedObject3D, AbstractAnimatedView) {
  constructor(id: ViewId, layer: ViewLayer) {
    super(id, layer, ViewType.THREE);
  }

  // #region lifecycle
  public override init(): void {
    super.init();

    this._forAllExtendedObject3D((child) => child.init());
    Ticker.Add(this._update);

    if (this.resize) {
      window.addEventListener("resize", this.resize);
    }
  }

  public override reset(): void {
    super.reset()
    this._forAllExtendedObject3D((child) => child.reset());
    Ticker.Remove(this._update);

    if (this.resize) {
      window.removeEventListener("resize", this.resize);
    }
  }
  // #endregion

  private _update = (dt: number, elapsed: number) => {
    for (const object of this._extendedObject3Ds) {
      object.update(dt);
    }
  };
}