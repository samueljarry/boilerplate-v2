import MainThreeView from "@/core/three/views/MainThreeView.vue";
import { ViewId } from "../constants/views/ViewId";
import { ViewsManager } from "../managers/ViewsManager";
import { InitCommand } from "./InitCommand";
import { ViewLayer } from "../constants/views/ViewLayer";
import { Modules } from "@/Modules";
import { CamerasManager } from "@/core/three/managers/CamerasManager";
import { Three } from "@/core/three/Three";
import { DefaultCameraController } from "@/controllers/cameras/DefaultCameraController";
import { CamerasId } from "@/core/three/constants/CamerasId";
import { ThreeAssetsManager } from "@/core/three/managers/ThreeAssetsManager";
import { AssetsId } from "../constants/AssetsId";
import { OrbitCameraController } from "@/core/three/controllers/cameras/OrbitCameraController";
import { FPSCameraController } from "@/core/three/controllers/cameras/FPSCameraController";
import { ShaderChunkCommand } from "@/core/three/commands/ShaderChunkCommand";

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