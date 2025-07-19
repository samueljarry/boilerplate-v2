import { ViewId } from "@/core/commons/constants/views/ViewId";
import { ViewLayer } from "@/core/commons/constants/views/ViewLayer";
import { ScenesManager } from "@/core/commons/managers/ScenesManager";
import { ViewsManager } from "@/core/commons/managers/ViewsManager";
import { DemoScene } from '@/scenes/DefaultScene';
import { DemoThreeView } from '@/views/three/DefaultThreeView';
import { InitCommand } from "@/core/commons/commands/InitCommand";
import DemoVueView from "@/views/vue/DemoVueView.vue";

export class GlobalInitCommand extends InitCommand {
  public override async initBefore() {

  }

  public override async initProxies() {
    
  }

  public override async initManagers() {
    
  }

  public override async initThree() {
    
  }

  public override async initCommons() {
    
  }

  public override async initAfterLoad() {

  }

  public override initViews() {  
    ViewsManager.CreateThreeView(DemoThreeView);
    ViewsManager.CreateVueView(ViewId.DEMO, DemoVueView, ViewLayer.UI_1);
  }
  
  public override initScenes() {
    ScenesManager.Add(DemoScene);
  }

  public override async initAfter() {
    
  }
}