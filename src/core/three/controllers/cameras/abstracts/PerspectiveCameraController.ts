import { PerspectiveCamera } from "three";
import type { CamerasId } from "../../../constants/CamerasId";
import { AbstractCameraController } from "./AbstractCameraController";

export class PerspectiveCameraController extends AbstractCameraController {
  protected declare _camera: PerspectiveCamera;

  constructor(id: CamerasId) {
    super(id);
  }

  protected override _createCamera(): void {
    this._camera = new PerspectiveCamera(75, this.aspect, 0.01, 1000);
  }

  protected override _resize = (): void => {
    this._camera.aspect = this.aspect;
    this._camera.updateProjectionMatrix();
  };

  public override get camera() {
    return this._camera;
  }
}