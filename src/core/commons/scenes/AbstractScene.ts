import type { SceneId } from "../constants/scenes/SceneId";
import type { SceneLayer } from "../constants/scenes/SceneLayer";
import type { SceneType } from "../constants/scenes/SceneType";
import type { ViewId } from "../constants/views/ViewId";
import { ViewsManager } from "../managers/ViewsManager";

export abstract class AbstractScene {
  /**
   * Views that are not visible when the Scene is initialized,
   * but should still be hidden when the Scene is.
   *
   */
  protected _linkedViews = new Set<ViewId>();

  /**
   * Views that are shown or hidden together with the Scene,
   * following the Scene's visibility state.
   */
  protected _views = new Set<ViewId>();

  /**
   * Views that are shown with the Scene,
   * but stay visible when Scene is hidden.
   */
  protected _persistentViews = new Set<ViewId>();

  constructor(
    public readonly sceneId: SceneId,
    public readonly sceneLayer: SceneLayer,
    public readonly sceneType: SceneType
  ) {}

  // #region lifecycle
  public init(): void {
    for (const id of this._views) {
      ViewsManager.Show(id);
    }

    for (const id of this._persistentViews) {
      ViewsManager.Show(id);
    }
  }

  public reset(): void {
    for (const id of this._views) {
      // ViewsManager.Hide(id);
    }

    for (const id of this._linkedViews) {
      // ViewsManager.Hide(id);
    }
  }
  // #endregion

  protected get _outroCount() { return this._linkedViews.size + this._views.size; }
}