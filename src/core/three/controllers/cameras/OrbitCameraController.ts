import { OrbitControls } from "three/examples/jsm/Addons.js";
import { CamerasId } from "../../constants/CamerasId";
import { PerspectiveCameraController } from "./abstracts/PerspectiveCameraController";

export class OrbitCameraController extends PerspectiveCameraController {
  private _orbit: OrbitControls;
  
  constructor() {
    super(CamerasId.ORBIT);

    this.camera.position.set(0,0,5)
  }

  public override init(): void {
    super.init();

    this._orbit = new OrbitControls(this.camera, this.canvas);
    this._orbit.enableDamping = true;
  }

  public override reset(): void {
    super.reset();

    this._orbit.dispose();
  }

  
  
  public override update(dt: number): void {
    this._orbit.update();
  }
}