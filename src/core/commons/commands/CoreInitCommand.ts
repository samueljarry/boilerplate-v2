import { DefaultCameraController } from "@/controllers/cameras/DefaultCameraController";
import { ShaderChunkCommand } from "@/core/three/commands/ShaderChunkCommand";
import { CamerasId } from "@/core/three/constants/CamerasId";
import { FPSCameraController } from "@/core/three/controllers/cameras/FPSCameraController";
import { OrbitCameraController } from "@/core/three/controllers/cameras/OrbitCameraController";
import { CamerasManager } from "@/core/three/managers/CamerasManager";
import { ThreeAssetsManager } from "@/core/three/managers/ThreeAssetsManager";
import { Three } from "@/core/three/Three";
import MainThreeView from "@/core/three/views/MainThreeView.vue";
import { Modules } from "@/Main";
import { AssetsId } from "../constants/AssetsId";
import { ViewId } from "../constants/views/ViewId";
import { ViewLayer } from "../constants/views/ViewLayer";
import { ViewsManager } from "../managers/ViewsManager";
import { InitCommand } from "./InitCommand";

export class CoreInitCommand extends InitCommand {
  public override async initBefore() {
    if (Modules.THREE) {
      ShaderChunkCommand.Extend();
    }
  }

  public override async initManagers(): Promise<void> {
    if(Modules.THREE) {
      CamerasManager.Init();
    }
  }

  public override async initThree(): Promise<void> {
    if(!Modules.THREE) return;

    ThreeAssetsManager.AddTexture(
      AssetsId.TEXTURE_GRADIENT,
      "textures/gradients.png"
    );

    ThreeAssetsManager.AddHdr(AssetsId.HDR_SKY, 'hdr/sky.hdr');

    CamerasManager.Add(DefaultCameraController)
    CamerasManager.Add(OrbitCameraController)
    CamerasManager.Add(FPSCameraController)
  }

  public override initViews(): void {
    if(Modules.THREE) {
      ViewsManager.CreateVueView(
        ViewId.MAIN_THREE,
        MainThreeView, 
        ViewLayer.MAIN_THREE
      );
    }
  }

  public override async initAfter(): Promise<void> {
    if(Modules.THREE) {
      Three.Init();
      Three.Hdr = AssetsId.HDR_SKY;
      CamerasManager.Controller = CamerasManager.Get(CamerasId.DEFAULT);
    }
  }
}