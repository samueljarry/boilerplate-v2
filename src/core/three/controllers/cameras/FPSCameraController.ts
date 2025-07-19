import { KeyCode } from "@/core/commons/constants/commons/KeyCode";
import { CamerasId } from "../../constants/CamerasId";
import { KeyboardCameraController } from "./KeyboardCameraController";
import { clamp } from "@/core/commons/utils/clamp";
import { Quaternion, Vector2, Vector3 } from "three";
import { X_AXIS, Y_AXIS } from "../../utils/ThreeUtils";
import { lerp } from "three/src/math/MathUtils.js";
import { expDecay } from "@/core/commons/utils/expDecay";
import { Drag } from "@/core/commons/utils/Drag";

enum Controls {
  DOLLY_IN = 'DOLLY_IN',
  DOLLY_OUT = 'DOLLY_OUT',
  
  TRUCK_LEFT = 'TRUCK_LEFT',
  TRUCK_RIGHT = 'TRUCK_RIGHT',
  
  PAN_LEFT = 'PAN_LEFT',
  PAN_RIGHT = 'PAN_RIGHT',

  PEDESTAL_UP = 'PEDESTAL_UP',
  PEDESTAL_DOWN = 'PEDESTAL_DOWN',
  
  TILT_UP = 'TILT_UP',
  TILT_DOWN = 'TILT_DOWN',
}

export class FPSCameraController extends KeyboardCameraController {
  private readonly SPEED_FACTOR = 0.8;
  private readonly SENSIBILITY = 30;

  private _dollyVec = new Vector3();
  private _panQuat = new Quaternion();
  private _tiltQuat = new Quaternion();
  private _computeQuat = new Quaternion();

  private _minTilt = -Math.PI * 0.5;
  private _maxTilt = Math.PI * 0.5;

  private _dollyT = 0;
  private _panT = 0;
  private _tiltT = 0;
  private _truckT = 0;
  private _pedestalT = 0;

  private _dolly = 0;
  private _pan = 0;
  private _tilt = 0;
  private _truck = 0;
  private _pedestal = 0;
  private _tiltAngle = 0;

  private _drag = new Drag();
  private _movement = new Vector2();

  constructor() {
    super(CamerasId.FPS);

    this.position.set(0,0,5)

    this._drag.onDrag = this._handleDrag;
    this.rotation.y = Math.PI * 0.5;

    // Dolly
    this._addControl(Controls.DOLLY_IN, {
      keys: [KeyCode.ArrowUp, KeyCode.W],
    });

    this._addControl(Controls.DOLLY_OUT, {
      keys: [KeyCode.ArrowDown, KeyCode.S],
    });

    // Pan
    this._addControl(Controls.PAN_RIGHT, {
      keys: [KeyCode.ArrowRight, KeyCode.D],
      shift: true,
    });

    this._addControl(Controls.PAN_LEFT, {
      keys: [KeyCode.ArrowLeft, KeyCode.A],
      shift: true,
    });

    // Pedestal
    this._addControl(Controls.PEDESTAL_UP, {
      keys: [KeyCode.Space],
    });

    this._addControl(Controls.PEDESTAL_DOWN, {
      keys: [KeyCode.Space],
      shift: true,
    });

    // Truck
    this._addControl(Controls.TRUCK_RIGHT, {
      keys: [KeyCode.D, KeyCode.ArrowRight],
    });

    this._addControl(Controls.TRUCK_LEFT, {
      keys: [KeyCode.A, KeyCode.ArrowLeft],
    });

    // Tilt
    this._addControl(Controls.TILT_UP, {
      keys: [KeyCode.ArrowUp, KeyCode.W],
      shift: true,
    });

    this._addControl(Controls.TILT_DOWN, {
      keys: [KeyCode.ArrowDown, KeyCode.S],
      shift: true,
    });
  }

  public override init(): void {
    super.init();

    this._drag.start();
  }

  public override reset(): void {
    super.reset();

    this._drag.stop();
  }

  public override update(dt: number): void {
    super.update(dt);

    this._updateVars();

    this._updatePos(dt);
    this._updateRotation(dt);

    this._resetVars();
  }

  private _clamp(x: number) {
    return clamp(x, -1, 1);
  }

  private _resetVars(): void {
    this._dollyT = 0;
    this._panT = 0;
    this._tiltT = 0;
    this._pedestalT = 0;
    this._truckT = 0;

    this._tilt = 0;

    this._dollyVec.setScalar(0);
    this._movement.setScalar(0);
    // this._panQuat.identity();
    // this._tiltQuat.identity();
  }

  private _updateVars(): void {
    for (const control of this.controls) {
      switch (control) {
        case Controls.DOLLY_IN:
          this._dollyT = this._clamp(this._dollyT - 1);
          break;
        case Controls.DOLLY_OUT:
          this._dollyT = this._clamp(this._dollyT + 1);
          break;
        case Controls.PAN_LEFT:
          this._panT = this._clamp(this._panT + 1);
          break;
        case Controls.PAN_RIGHT:
          this._panT = this._clamp(this._panT - 1);
          break;
        case Controls.PEDESTAL_DOWN:
          this._pedestalT = this._clamp(this._pedestalT - 1);
          break;
        case Controls.PEDESTAL_UP:
          this._pedestalT = this._clamp(this._pedestalT + 1);
          break;
        case Controls.TRUCK_LEFT:
          this._truckT = this._clamp(this._truckT - 1);
          break;
        case Controls.TRUCK_RIGHT:
          this._truckT = this._clamp(this._truckT + 1);
          break;
        case Controls.TILT_UP:
          this._tiltT = this._clamp(this._truckT + 1);
          break;
        case Controls.TILT_DOWN:
          this._tiltT = this._clamp(this._truckT - 1);
          break;
      }
    }
  }

  private _handleDrag = ({ movementX, movementY }: PointerEvent) => {
    const x = movementX / window.innerWidth;
    const y = movementY / window.innerHeight;

    this._movement.set(x, y).multiplyScalar(this.SENSIBILITY);
  };

  private _updatePos(dt: number): void {
    this._dolly = expDecay(this._dolly, this._dollyT, 8, dt);
    this._pedestal = expDecay(this._pedestal, this._pedestalT, 8, dt);
    this._truck = expDecay(this._truck, this._truckT, 8, dt);

    this._dollyVec
      .set(this._truck * 0.5, this._pedestal * 0.5, this._dolly * 0.5)
      .multiplyScalar(this.SPEED_FACTOR);

    this._dollyVec.applyQuaternion(this.quaternion);

    this.position.add(this._dollyVec);
  }

  private _updateRotation(dt: number): void {
    this._pan = expDecay(this._pan, this._panT + this._movement.x, 8, dt);
    this._computeQuat.setFromAxisAngle(Y_AXIS, (this._pan * 0.25) / Math.PI);
    this._panQuat.multiply(this._computeQuat);

    this._tilt = expDecay(this._tilt, this._tiltT + this._movement.y, 8, dt);
    this._tiltAngle = clamp(
      this._tiltAngle + this._tilt,
      this._minTilt,
      this._maxTilt
    );

    this._computeQuat.setFromAxisAngle(X_AXIS, this._tiltAngle);
    this._tiltQuat.slerp(this._computeQuat, 1 - Math.pow(0.01, dt));

    this.quaternion.multiplyQuaternions(this._panQuat, this._tiltQuat);
  }
}