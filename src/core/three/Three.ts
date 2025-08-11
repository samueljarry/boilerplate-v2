import { ACESFilmicToneMapping, NoToneMapping, Scene, Vector2, WebGLRenderer } from "three";

import type { AbstractCameraController } from "./controllers/cameras/abstracts/AbstractCameraController";
import { Action } from "../commons/utils/Action";
import type { AssetsId } from "../commons/constants/AssetsId";
import { CamerasManager } from "./managers/CamerasManager";
import { Modules } from "@/Modules";
import { PostProcessingManager } from "./postprocessing/managers/PostProcessingManager";
import { ThreeAssetsManager } from "./managers/ThreeAssetsManager";
import { ThreeView } from "./views/ThreeView";
import { Ticker } from "../commons/utils/Ticker";
import { ViewId } from "../commons/constants/views/ViewId";
import { ViewsManager } from "../commons/managers/ViewsManager";

export class Three {
  private static _Renderer: WebGLRenderer;
  private static _Canvas: HTMLCanvasElement;
  private static _CameraController: AbstractCameraController;
  private static _Scene = new Scene();
  private static _ViewsInScene = new Set<ThreeView>();
  private static _Viewport = new Vector2();

  public static OnResize = new Action();

  // #region lifecycle
  public static Init(): void {
    this._CheckModule();

    this._Viewport.set(window.innerWidth, window.innerHeight);
    CamerasManager.OnCameraChange.add(this._HandleCameraChange);
    CamerasManager.OnFirstCameraSet.add(this._CheckRequirementBeforeStart);

    ViewsManager.OnViewsChange.add(this._HandleViewsChange);
    ViewsManager.Show(ViewId.MAIN_THREE);
  }

  public static _Start(): void {
    CamerasManager.OnFirstCameraSet.remove(this._CheckRequirementBeforeStart);

    Ticker.Add(this._Update);
  }

  public static Stop(): void {
    ViewsManager.OnViewsChange.remove(this._HandleViewsChange);
    CamerasManager.OnCameraChange.remove(this._HandleCameraChange);
    Ticker.Remove(this._Update);
  }
  // #endregion

  // #region utilities
  private static _CreateRenderer(): void {
    this._Renderer = new WebGLRenderer({
      canvas: this._Canvas,
      alpha: true,
      stencil: true,
      antialias: true,
      powerPreference: "high-performance",
    });

    this._Renderer.toneMapping = ACESFilmicToneMapping;
    this._Renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    this._Renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private static _CheckRequirementBeforeStart = (): void => {
    const ready = !!this.Canvas && !!this._CameraController;

    if (ready) {
      this._Start();
    }
  };

  private static _CheckModule(): void {
    const disabled = !Modules.THREE;

    if (disabled) {
      throw new Error(
        "Three initialization aborted: please, enable THREE module in Modules.ts"
      );
    }
  }

  private static _HandleCameraChange = (
    controller: AbstractCameraController
  ): void => {
    this._Scene.remove(this._CameraController);
    this._CameraController = controller;
    this._Scene.add(this._CameraController);
  };
  // #endregion

  // #region events

  // #region views

  /**
   * Synchronizes the Three.js scene with the set of currently displayed ThreeView instances.
   *
   * This method adds new views from ViewsManager.DisplayedThreeViews to the scene
   * and removes views that are no longer displayed. It ensures that the Three.js
   * scene always reflects the current set of visible ThreeView objects.
   */
  private static _HandleViewsChange = (): void => {
    const toRemove = [];
    const toAdd = [];

    for (const view of this._ViewsInScene) {
      const stillVisible = ViewsManager.DisplayedThreeViews.has(view);
      if (stillVisible) continue;

      toRemove.push(view);
      this._ViewsInScene.delete(view);
    }

    for (const view of ViewsManager.DisplayedThreeViews) {
      const alreadyInScene = this._ViewsInScene.has(view);
      if (alreadyInScene) continue;

      toAdd.push(view);
      this._ViewsInScene.add(view);
    }

    if (toRemove.length > 0) this._Scene.remove(...toRemove);
    if (toAdd.length > 0) this._Scene.add(...toAdd);
  };
  // #endregion

  // #region resize
  private static _Resize = (): void => {
    this._Viewport.set(window.innerWidth, window.innerHeight);
    this._Renderer.setSize(window.innerWidth, window.innerHeight);

    this.OnResize.execute();
  };
  // #endregion

  // #region update
  private static _Update = (dt: number): void => {
    this._CheckResizeRequirement();
    this._CameraController.update(dt);
    this._Render(dt);
  };

  private static _CheckResizeRequirement(): void {
    const notSameWidth = this._Viewport.x !== window.innerWidth;
    const notSameHeight = this._Viewport.y !== window.innerHeight;

    const needsResize = notSameWidth || notSameHeight;

    if (needsResize) {
      this._Resize();
    }
  }

  private static _Render = (dt: number): void => {
    if(PostProcessingManager.Enabled) {
      PostProcessingManager.Composer.render(dt);
    } else {
      this._Renderer.render(this._Scene, this._CameraController.camera);
    }
  };
  // #endregion
  // #endregion

  // #region getters / setters
  public static get Canvas() { return this._Canvas; }
  public static get Scene() { return this._Scene; }
  public static get Camera() { return this._CameraController.camera; }
  public static get Renderer() { return this._Renderer; }

  public static set Canvas(canvas: HTMLCanvasElement) {
    if (this._Canvas) return;

    this._Canvas = canvas;
    this._CreateRenderer();
    CamerasManager.Canvas = this._Canvas;

    this._CheckRequirementBeforeStart();
  }

  public static set Hdr(hdrId: AssetsId) {
    const hdr = ThreeAssetsManager.GetHdr(hdrId);
    this._Scene.environment = hdr;
  }
  // #endregion
}