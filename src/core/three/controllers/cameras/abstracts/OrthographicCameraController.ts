import { OrthographicCamera } from "three";
import type { CamerasId } from "../../../constants/CamerasId";
import { AbstractCameraController } from "./AbstractCameraController";

export abstract class OrthographicCameraController extends AbstractCameraController {
  declare protected _camera: OrthographicCamera;
  
  constructor(id: CamerasId) {
    super(id);
  }

  protected override _createCamera(): void {
    this._camera = new OrthographicCamera(-this.aspect, this.aspect, 1, -1);
  }

  protected override _resize = (): void => {
    this._camera.left = -this.aspect;
    this._camera.right = this.aspect;

    this._camera.updateProjectionMatrix();
  };
}