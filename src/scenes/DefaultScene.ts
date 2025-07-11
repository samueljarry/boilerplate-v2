import { AssetsId } from "@/core/commons/constants/AssetsId";
import { CamerasId } from "@/core/three/constants/CamerasId";
import { SceneId } from "@/core/commons/constants/scenes/SceneId";
import { SceneLayer } from "@/core/commons/constants/scenes/SceneLayer";
import { ThreeScene } from "@/core/three/scenes/ThreeScene";
import { ViewId } from "@/core/commons/constants/views/ViewId";

export class DemoScene extends ThreeScene {
  constructor() {
    super(SceneId.DEFAULT, SceneLayer.MAIN, {
      hdr: AssetsId.HDR_SKY,
      camera: CamerasId.DEFAULT
    })

    this._views.add(ViewId.THREE_DEMO);
    this._views.add(ViewId.DEMO)
  }
}