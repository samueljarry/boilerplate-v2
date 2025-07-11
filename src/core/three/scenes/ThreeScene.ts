import { AbstractScene } from "@/core/commons/scenes/AbstractScene";
import type { SceneId } from "@/core/commons/constants/scenes/SceneId";
import type { SceneLayer } from "@/core/commons/constants/scenes/SceneLayer";
import { AssetsId } from "@/core/commons/constants/AssetsId";
import { SceneType } from "@/core/commons/constants/scenes/SceneType";
import { CamerasId } from "../constants/CamerasId";
import { CamerasManager } from "../managers/CamerasManager";

export type ThreeSceneParams = {
  hdr?: AssetsId;
  camera?: CamerasId;
}

export class ThreeScene extends AbstractScene {
  protected _hdrId: AssetsId;
  protected _cameraId: CamerasId;

  constructor(
    id: SceneId, 
    layer: SceneLayer, 
    params?: ThreeSceneParams
  ) {
    super(id, layer, SceneType.THREE);

    this._cameraId = params?.camera ?? CamerasId.DEFAULT;
    this._hdrId = params?.hdr ?? AssetsId.HDR_SKY;
  }

  public override init(): void {
    super.init();

    CamerasManager.Controller = this._cameraId;
  }
}