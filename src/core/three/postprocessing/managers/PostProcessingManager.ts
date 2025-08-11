import { EffectComposer, RenderPass } from "postprocessing";

import { HalfFloatType } from "three";
import type { PassId } from "../constants/PassId";
import { PostProcessingProxy } from "../proxies/PostProcessingProxy";
import { Three } from "../../Three";

export class PostProcessingManager {
  private static _RenderPass: RenderPass;
  private static _Enabled = false;
  private static _PostProcessingPasses = new Set<PassId>();
  private static _Composer: EffectComposer;

  private static _InitPostProcessing() {
    this._RenderPass = new RenderPass(Three.Scene, Three.Camera);
    
    this._Composer = new EffectComposer(Three.Renderer, {
      alpha: true,
      frameBufferType: HalfFloatType,
      depthBuffer: true
    });

    this._Composer.addPass(this._RenderPass);

    this._Enabled = true;
  }

  public static AddPass(id: PassId) {
    const pass = PostProcessingProxy.GetPass(id);

    if (!this._Enabled) {
      this._InitPostProcessing();
    }

    pass.init();
    this._Composer.addPass(pass)
    this._PostProcessingPasses.add(id);
  }

  public static RemoveEffect(id: PassId) {
    const pass = PostProcessingProxy.GetPass(id);

    this._Composer.removePass(pass)
    this._PostProcessingPasses.delete(id)
    pass.reset();
  }

  // #region getters / setters
  public static get Composer() { return this._Composer;}
  public static get Enabled() { return this._Enabled; }
  // #endregion
}