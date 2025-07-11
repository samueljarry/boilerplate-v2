import { CamerasId } from "@/core/three/constants/CamerasId";
import { PerspectiveCameraController } from "@/core/three/controllers/cameras/abstracts/PerspectiveCameraController";

export class DefaultCameraController extends PerspectiveCameraController {
  constructor() {
    super(CamerasId.DEFAULT);

    this.position.set(0, 0, 5);
  }
}