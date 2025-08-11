import { CommonAssetsManager } from "../managers/CommonAssetsManager";
import { Modules } from "@/Modules";
// import { CommonAssetsManager } from "../../managers/CommonAssetsManager";
import { ThreeAssetsManager } from "@/core/three/managers/ThreeAssetsManager";

export class InitCommand {
  public async init(): Promise<void> {
    await this.initBefore();
    await this.initProxies();
    await this.initManagers();
    await this.initThree();
    await this.initCommons();
    await this.loadAssets();
    await this.initAfterLoad();

    this.initViews();
    this.initScenes();
    await this.initAfter()
  }

  public async initBefore(): Promise<void> {}

  /**
   * Init all proxies
   */
  public async initProxies(): Promise<void> {}

  /**
   * Init all Managers
   */
  public async initManagers(): Promise<void> {}

  /**
   * Init every Three.js related assets
   */
  public async initThree(): Promise<void> {}

  /**
   * Init every common assets
   */
  public async initCommons(): Promise<void> {}

  /**
   * Init all views
   */
  public initViews(): void {}

  /**
   * Init scenes
   */
  public initScenes(): void {}

  /**
   * Load all assets added to queue
   */
  public async loadAssets(): Promise<void> {
    await CommonAssetsManager.Load();

    if(Modules.THREE) {
      await ThreeAssetsManager.Load();
    }
  }

  /**
   * Init anything after everything is loaded
   */
  public async initAfterLoad(): Promise<void> {}

  public async initAfter(): Promise<void> {}
}
