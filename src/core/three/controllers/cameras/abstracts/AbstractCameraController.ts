import { type Camera } from "three";
import type { CamerasId } from "../../../constants/CamerasId";
import { ExtendedObject3D } from "../../../components/ExtendedObject3D";
import { Three } from "../../../Three";

export abstract class AbstractCameraController extends ExtendedObject3D {
  protected _camera: Camera;
  protected _active = false;

  public canvas: HTMLCanvasElement;
  public readonly isCameraController = true;

  constructor(protected readonly _cameraId: CamerasId) {
    super();

    this._createCamera();
    this.add(this._camera);
  }

  protected abstract _createCamera(): void

  // #region lifecycle
  public override init() {
    this._active = true;

    this._resize();
    Three.OnResize.add(this._resize)
  }

  public override reset() {
    this._active = false;

    Three.OnResize.remove(this._resize);
  }
  // #endregion

  // #region events
  protected abstract _resize: () => void;
  // #endregion

  // #region getters / setters
  public get active() {
    return this._active;
  }
  public get cameraId() {
    return this._cameraId;
  }
  public get camera() {
    return this._camera;
  }

  public get aspect(): number {
    return this.canvas
      ? this.canvas.offsetWidth / this.canvas.offsetHeight
      : window.innerWidth / window.innerHeight;
  }
  // #endregion
}