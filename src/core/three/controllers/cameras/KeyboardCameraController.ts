import { KeyCode, type Key } from "@/core/commons/constants/commons/KeyCode";
import { PerspectiveCameraController } from "./abstracts/PerspectiveCameraController";

type KeyboardCameraControllerFunc = (key: Key, event: KeyboardEvent) => void

type Control = string | number;

type ControlParams = {
  keys: Array<Key>;
  shift?: boolean;
  onPress?: KeyboardCameraControllerFunc;
  onRelease?: KeyboardCameraControllerFunc;
}

type KeyFunctions = {
  onPress?: KeyboardCameraControllerFunc;
  onRelease?: KeyboardCameraControllerFunc;
}

export abstract class KeyboardCameraController extends PerspectiveCameraController {
  private _keyFunctions = new Map<Key, KeyFunctions>();
  private _shiftKeyFunctions = new Map<Key, KeyFunctions>();

  private _keyControls = new Map<Key, Control>();
  private _shiftKeyControls = new Map<Key, Control>();

  private _pressedKeys = new Map<Key, Control>();
  private _activeControls = new Set<Control>();

  public override init() {
    super.init();

    window.addEventListener("keydown", this._handleKeydown);
    window.addEventListener("keyup", this._handleKeyup);
  }

  public override reset() {
    super.reset();

    window.removeEventListener("keydown", this._handleKeydown);
    window.removeEventListener("keyup", this._handleKeyup);
  }

  private _getKeyStorages(shiftKey: boolean) {
    const functionMap = shiftKey ? this._shiftKeyFunctions : this._keyFunctions;
    const controlMap = shiftKey ? this._shiftKeyControls : this._keyControls;

    return {
      functionMap,
      controlMap,
    };
  }

  protected _addControl(
    control: Control,
    { keys, ...params }: ControlParams
  ): void {
    const shiftKey = params?.shift;

    const { functionMap, controlMap } = this._getKeyStorages(!!shiftKey);

    for (const key of keys) {
      controlMap.set(key, control);
      const obj: KeyFunctions = {};

      if (typeof params.onPress === "function") {
        obj.onPress = params.onPress;
      }

      if (typeof params.onRelease === "function") {
        obj.onRelease = params.onRelease;
      }

      functionMap.set(key, obj);
    }
  }

  protected _removeKey(code: KeyCode): void {
    this._keyFunctions.delete(code);
  }

  protected _enableDebug(): void {
    window.addEventListener("keyup", this._debug);
  }

  private _debug = (e: KeyboardEvent): void => {
    console.debug(e);
  };

  private _handleKeydown = (event: KeyboardEvent): void => {
    const { functionMap, controlMap } = this._getKeyStorages(event.shiftKey);

    const control = controlMap.get(event.code);
    const funcs = functionMap.get(event.code);

    if (control) {
      this._pressedKeys.set(event.code, control);
      this._updateActiveControls();
    }

    if (funcs?.onPress) {
      funcs.onPress(event.code, event);
    }
  };

  private _updateActiveControls(): void {
    this._activeControls.clear();

    for (const control of this._pressedKeys.values()) {
      this._activeControls.add(control);
    }

    this._onControlChange();
  }

  protected _onControlChange(): void {}

  private _handleKeyup = (event: KeyboardEvent): void => {
    const { functionMap } = this._getKeyStorages(event.shiftKey);
    const funcs = functionMap.get(event.code);

    this._pressedKeys.delete(event.code);
    this._updateActiveControls();

    if (funcs?.onRelease) {
      funcs.onRelease(event.code, event);
    }
  };

  public get controls() {
    return this._activeControls.values();
  }
}