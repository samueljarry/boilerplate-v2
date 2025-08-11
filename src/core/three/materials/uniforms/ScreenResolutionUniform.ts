import { Uniform, Vector2, type IUniform } from "three";
import { Three } from "../../Three";
import { ExtendedUniform } from "./ExtendedUniform";

export class ScreenResolutionUniform extends ExtendedUniform<Vector2> {
  protected override _uniform = new Uniform(
    new Vector2(window.innerWidth, window.innerHeight)
  );

  public override start() {
    Three.OnResize.add(this._updateValues);
  }

  public override stop() {
    Three.OnResize.remove(this._updateValues);
  }

  private _updateValues = () => {
    this._uniform.value.set(window.innerWidth, window.innerHeight);
  };
}