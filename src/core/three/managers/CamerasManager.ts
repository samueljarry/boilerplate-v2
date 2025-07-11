import type { AbstractCameraController } from "../controllers/cameras/abstracts/AbstractCameraController";
import { Action } from "@/core/commons/utils/Action";
import { CamerasId } from "../constants/CamerasId";
import { SingleUseAction } from "@/core/commons/utils/SingleUseAction";
import { getOrThrowError } from "@/core/commons/utils/getOrThrow";

export class CamerasManager {
  private static readonly DEBUG_CAMERA = [CamerasId.FPS, CamerasId.ORBIT];
  private static _Cameras = new Map<CamerasId, AbstractCameraController>();
  private static _Controller: AbstractCameraController;
  private static _PreviousController: AbstractCameraController;

  public static OnCameraChange = new Action<[AbstractCameraController]>();
  public static OnFirstCameraSet = new SingleUseAction();

  // #region lifecycle
  public static Init(): void {
    window.addEventListener("keydown", this._ListenForCameraSwaps);
  }

  public static Stop(): void {
    window.removeEventListener("keydown", this._ListenForCameraSwaps);
  }
  // #endregion

  // #region utilities
  public static Add(
    controller: new () => AbstractCameraController
  ): void {
    const c = new controller();
    this._Cameras.set(c.cameraId, c);
  }

  private static _ListenForCameraSwaps = ({ code, shiftKey }: KeyboardEvent): void => {
    const orbitKeybind = shiftKey && code === "KeyC";
    const fpsKeybind = shiftKey && code === "KeyF";

    if (orbitKeybind) return this._SwapControllers(CamerasId.ORBIT);
    if (fpsKeybind) return this._SwapControllers(CamerasId.FPS);
  };

  private static _OnControllerChange(): void {
    this._Controller.init();

    this.OnCameraChange.execute(this._Controller);

    if (!this._PreviousController) {
      this.OnFirstCameraSet.execute();
    }
  }

  private static _SwapControllers(id: CamerasId): void {
    const isActiveCamera = this._Controller.cameraId === id;
    const targetId = isActiveCamera ? this._PreviousController.cameraId : id;

    const isTargetDebugCamera = this.DEBUG_CAMERA.includes(targetId);
    const isPreviousDebugCamera = this.DEBUG_CAMERA.includes(this._Controller.cameraId);

    const controller = this.Get(targetId);

    // Case 1: Both current and target cameras are debug cameras
    // Only update the active controller to avoid losing reference to the previous one,
    // which could trap the user between two debug cameras
    if (isPreviousDebugCamera && isTargetDebugCamera) {
      this._Controller = controller;
      this._OnControllerChange();
    }
    // Case 2: The target camera is a debug camera
    // Save the current controller as previous so it can be restored later,
    // then activate the debug camera
    else if (isTargetDebugCamera) {
      this._PreviousController = this._Controller;
      this.Controller = controller;
    }
    // Case 3: The target camera is not a debug camera
    // Restore the previous camera as the active one
    else {
      this.Controller = this._PreviousController;
    }
  }
  // #endregion

  // #region getters / setters
  public static Get<T extends AbstractCameraController>(id: CamerasId): T {
    return getOrThrowError(
      this._Cameras,
      id,
      `No camera controller found for "${id}". Make sure it's correctly setup within an InitCommand.`
    ) as T;
  }

  public static set Canvas(canvas: HTMLCanvasElement) {
    for (const camera of this._Cameras.values()) {
      camera.canvas = canvas;
    }
  }

  public static set Controller(
    idOrCameraController: CamerasId | AbstractCameraController
  ) {
    const isController = typeof idOrCameraController === "object";

    this._PreviousController = this._Controller;
    this._PreviousController?.reset();

    this._Controller = isController
      ? idOrCameraController
      : this.Get(idOrCameraController);

    this._OnControllerChange();
  }

  public static get ControllerId() {
    return this._Controller.id;
  }
  // #endregion
}