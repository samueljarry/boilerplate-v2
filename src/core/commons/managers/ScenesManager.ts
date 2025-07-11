import type { AbstractScene } from "../scenes/AbstractScene";
import type { SceneId } from "../constants/scenes/SceneId";
import type { SceneLayer } from "../constants/scenes/SceneLayer";

export class ScenesManager {
  private static _ScenesMap = new Map<SceneId, AbstractScene>();
  private static _ScenesLayerMap = new Map<SceneLayer, AbstractScene>();
  private static _DisplayedScenes = new Set<AbstractScene>();

  // #region utilities

  /**
   * Creates an instance of the given scene class and adds it to the scenes map.
   *
   * Use this method to register a new scene so it can be managed and displayed
   * by the ScenesManager.
   *
   * @param scene - The scene class (constructor) to instantiate and add.
   */
  public static Add(scene: new () => AbstractScene): void {
    const s = new scene();
    this._ScenesMap.set(s.sceneId, s);
  }

  /**
   * Displays the scene corresponding to the given scene ID.
   *
   * If another scene is already displayed on the same layer, it will be hidden first.
   * The new scene is then registered as displayed and its init() method is called.
   *
   * @param id - The unique identifier of the scene to display.
   */
  public static Show(id: SceneId): void {
    const scene = this._Retrieve(id);
    const previousScene = this._ScenesLayerMap.get(scene.sceneLayer);

    if (previousScene) {
      this.Hide(previousScene.sceneId);
    }

    this._ScenesLayerMap.set(scene.sceneLayer, scene);
    this._DisplayedScenes.add(scene);

    scene.init();
  }

  /**
   * Hides the scene corresponding to the given scene ID.
   *
   * Removes the scene from the displayed scenes and its layer mapping,
   * then calls its reset() method to clear its state.
   *
   * @param id - The unique identifier of the scene to hide.
   */
  public static Hide(id: SceneId): void {
    const scene = this._Retrieve(id);

    this._ScenesLayerMap.delete(scene.sceneLayer);
    this._DisplayedScenes.delete(scene);

    scene.reset();
  }

  private static _Retrieve(id: SceneId) {
    const scene = this._ScenesMap.get(id);

    if (!scene) {
      throw new Error(`
        No Scene found for ID ${id}.
        Please make sure it is initialized within an InitCommand and that 
        you are not interacting with it before it has loaded.
      `);
    }

    return scene;
  }
  // #endregion

  // #region getters / setters
  public static get DisplayedScenes() {
    return this._DisplayedScenes;
  }
  // #endregion
}